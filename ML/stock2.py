import asyncio
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import math
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
import yfinance as yf
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
import concurrent.futures

# Environment Setup
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Initialize FastAPI
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Technical Indicator Functions ===
def add_technical_indicators(df):
    df['SMA_5'] = df['Close'].rolling(window=5).mean()
    df['SMA_20'] = df['Close'].rolling(window=20).mean()
    df['RSI'] = compute_rsi(df['Close'], 14)
    df.fillna(method='bfill', inplace=True)
    return df

def compute_rsi(series, window):
    delta = series.diff()
    gain = delta.clip(lower=0).rolling(window).mean()
    loss = -delta.clip(upper=0).rolling(window).mean()
    rs = gain / loss
    return 100 - (100 / (1 + rs))

# === Dataset Preparation ===
def create_dataset(dataset, time_step=100):
    X, y = [], []
    for i in range(len(dataset) - time_step):
        X.append(dataset[i:i + time_step])
        y.append(dataset[i + time_step, 3])  # Predict 'Close' price
    return np.array(X), np.array(y)

# === Inverse Transform for Close Price Only ===
def inverse_transform_close(scaled_close, scaler, feature_index=3):
    inverse = np.zeros((len(scaled_close), scaler.n_features_in_))
    inverse[:, feature_index] = scaled_close.reshape(-1)
    return scaler.inverse_transform(inverse)[:, feature_index]

# === WebSocket Endpoint ===
@app.websocket("/ws/progress")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("Waiting for stock name...")

    try:
        stock_name = await websocket.receive_text()
        await websocket.send_text(f"Received stock: {stock_name}")
        ticker = yf.Ticker(stock_name)
        await websocket.send_text(f"Fetching stock data...{stock_name}")
        data = ticker.history(period="5y")

        if data.empty:
            await websocket.send_text("Error: No data found for this stock symbol.")
            await websocket.close()
            return

        await websocket.send_text("Preparing data...")

        df = add_technical_indicators(data[['Open', 'High', 'Low', 'Close', 'Volume']])
        scaler = MinMaxScaler()
        scaled_data = scaler.fit_transform(df)

        training_size = int(len(scaled_data) * 0.65)
        train_data, test_data = scaled_data[:training_size], scaled_data[training_size:]

        time_step = 100
        X_train, y_train = create_dataset(train_data, time_step)
        X_test, y_test = create_dataset(test_data, time_step)

        await websocket.send_text("Training model...")

        model = tf.keras.Sequential([
            tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(100, return_sequences=True), input_shape=(time_step, X_train.shape[2])),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(100)),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(1)
        ])
        model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), loss='mean_squared_error')

        # === WebSocket Callback for Training Progress ===
        class EpochCallback(tf.keras.callbacks.Callback):
            def __init__(self, websocket, loop):
                self.websocket = websocket
                self.loop = loop

            def on_epoch_end(self, epoch, logs=None):
                try:
                    msg = f"Training Model...({epoch + 1} / 50)"
                    asyncio.run_coroutine_threadsafe(self.websocket.send_text(msg), self.loop)
                except:
                    pass  # ignore if WebSocket is closed

        loop = asyncio.get_event_loop()
        early_stop = tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
        callbacks = [EpochCallback(websocket, loop), early_stop]

        with concurrent.futures.ThreadPoolExecutor() as executor:
            await loop.run_in_executor(executor, lambda: model.fit(
                X_train, y_train,
                validation_data=(X_test, y_test),
                epochs=50,
                batch_size=64,
                verbose=0,
                callbacks=callbacks
            ))

        await websocket.send_text("Making predictions...")

        train_pred = model.predict(X_train)
        test_pred = model.predict(X_test)

        inv_y_train = inverse_transform_close(y_train, scaler)
        inv_y_test = inverse_transform_close(y_test, scaler)
        inv_train_pred = inverse_transform_close(train_pred, scaler)
        inv_test_pred = inverse_transform_close(test_pred, scaler)

        await websocket.send_text("Calculating error metrics...")

        train_rmse = math.sqrt(mean_squared_error(inv_y_train, inv_train_pred))
        test_rmse = math.sqrt(mean_squared_error(inv_y_test, inv_test_pred))
        mae = mean_absolute_error(inv_y_test, inv_test_pred)
        normalized_rmse = test_rmse / np.mean(inv_y_test)

        await websocket.send_text(f"Train RMSE: {train_rmse:.2f}, Test RMSE: {test_rmse:.2f}, MAE: {mae:.2f}, Normalized RMSE: {normalized_rmse:.4f}")

        await websocket.send_text("Plotting results...")

        output_dir = "../frontend/public/plots"
        os.makedirs(output_dir, exist_ok=True)

        total_len = len(scaled_data)
        prediction_plot = np.empty(total_len)
        prediction_plot[:] = np.nan
        prediction_plot[time_step:time_step+len(inv_train_pred)] = inv_train_pred
        prediction_plot[training_size + time_step:training_size + time_step + len(inv_test_pred)] = inv_test_pred

        plt.figure(figsize=(10, 6))
        plt.plot(df['Close'].values, label="Original Close")
        plt.plot(prediction_plot, label="Predicted Close")
        plt.legend()
        plt.title(f"{stock_name} - Price Prediction")
        plt.savefig(os.path.join(output_dir, "train_test_predictions.png"))
        plt.close()

        await websocket.send_text("Prediction plot saved.")
        await websocket.send_text("Done")
        await websocket.close()

        # Cleanup
        del model, X_train, X_test, y_train, y_test

    except Exception as e:
        await websocket.send_text(f"Error occurred: {str(e)}")
        await websocket.close()
        print(f"Error occurred: {str(e)}")

# === Uvicorn Runner ===
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("stock:app", host="127.0.0.1", port=8080, reload=True, workers=1)