import asyncio
import yfinance as yf
import matplotlib.pyplot as plt
import numpy as np
import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import math
import uvicorn
from fastapi import FastAPI, WebSocket
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_percentage_error
from fastapi.middleware.cors import CORSMiddleware
import logging
import json
import concurrent.futures
import pandas as pd


np.random.seed(42)
tf.random.set_seed(42)
tf.get_logger().setLevel(logging.ERROR)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

path = os.path.abspath("stock_csvs")

csvs = {
    "HDFCBANK.NS" : "HDFC_Bank_Ltd.csv",
    "ICICIBANK.NS" : "ICICI_Bank_Ltd.csv",
    "RELIANCE.NS" : "Reliance_Industries_Ltd.csv",
    "INFY.NS" : "Infosys_Ltd.csv",
    "TCS.NS" : "Tata_Consultancy_Services_Ltd.csv",
    "LT.NS" : "Larsen_and_Toubro_Ltd.csv",
    "AXISBANK.NS" : "Axis_Bank_Ltd.csv",
    "SBIN.NS" : "State_Bank_of_India.csv"
}

@app.websocket("/ws/progress")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("Waiting for stock name...")

    try:
        stock_name = await websocket.receive_text()
        stock_name = stock_name.strip().upper()
        print(f"Received stock name: {stock_name}")
        await websocket.send_text(f"Received stock name: {stock_name}")
        
        if stock_name not in csvs:
            await websocket.send_text("Error: Stock not found in local CSV mapping.")
            await websocket.close()
            return

        csv_filename = csvs[stock_name]
        csv_file_path = os.path.join(path, csv_filename)

        if not os.path.exists(csv_file_path):
            await websocket.send_text("Error: CSV file not found.")
            print("File missing.")
            await websocket.close()
            return

        await websocket.send_text("Loading DataFrame...")
        data = pd.read_csv(csv_file_path, parse_dates=["Date"], index_col="Date")

        if data.empty:
            await websocket.send_text("Error: No data found in CSV file.")
            await websocket.close()
            return

        await websocket.send_text(f"Data successfully loaded for {stock_name}. Shape: {data.shape}")
        print(data.head())

        df1 = data.reset_index()['Close']
        scaler = MinMaxScaler(feature_range=(0, 1))
        df1 = scaler.fit_transform(np.array(df1).reshape(-1, 1))

        await websocket.send_text("Splitting and preparing dataset...")
        training_size = int(len(df1) * 0.65)
        test_size = len(df1) - training_size
        train_data, test_data = df1[0:training_size, :], df1[training_size:, :]

        def create_dataset(dataset, time_step=1):
            dataX, dataY = [], []
            for i in range(len(dataset) - time_step - 1):
                a = dataset[i:(i + time_step), 0]
                dataX.append(a)
                dataY.append(dataset[i + time_step, 0])
            return np.array(dataX), np.array(dataY)

        time_step = 100
        X_train, y_train = create_dataset(train_data, time_step)
        X_test, y_test = create_dataset(test_data, time_step)

        X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
        X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

        await websocket.send_text("Training model...")
        print("Training model...")

        tf.keras.backend.clear_session()

        early_stopping = tf.keras.callbacks.EarlyStopping(monitor = "val_loss", patience = 10,restore_best_weights = True,verbose = 1)

        reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(monitor = "val_loss", factor = 0.5,patience = 5,verbose = 1, min_lr = 1e-6)

        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(128, return_sequences=True, input_shape=(time_step, 1)),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.LSTM(64, return_sequences=True),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.GRU(64, return_sequences=True),
            tf.keras.layers.Dropout(0.2),
            tf.keras.layers.GRU(32, return_sequences=False),
            tf.keras.layers.Dense(1)
        ])

        # model.compile(loss='mean_squared_error', optimizer='adam')
        model.compile(loss='mean_squared_error',optimizer=tf.keras.optimizers.AdamW(learning_rate=0.01,weight_decay=1e-4))

        loop = asyncio.get_running_loop()

        class EpochCallback(tf.keras.callbacks.Callback):
            def __init__(self, websocket, loop):
                super().__init__()
                self.websocket = websocket
                self.loop = loop

            def on_epoch_end(self, epoch, logs=None):
                if self.websocket.client_state.name != "CONNECTED":
                    return
                message = f"Training Model...({epoch + 1} / 50)"
                asyncio.run_coroutine_threadsafe(
                    self.websocket.send_text(message),
                    self.loop
                )

        callback = EpochCallback(websocket, loop)

        with concurrent.futures.ThreadPoolExecutor() as executor:
            await loop.run_in_executor(executor, lambda: model.fit(
                X_train, y_train,
                validation_data=(X_test, y_test),
                epochs=50,
                batch_size=64,
                verbose=1,
                callbacks=[callback, reduce_lr]
            ))

        await websocket.send_text("Making predictions...")
        train_predict = model.predict(X_train)
        test_predict = model.predict(X_test)
        train_predict = scaler.inverse_transform(train_predict)
        test_predict = scaler.inverse_transform(test_predict)

        y_train_inv = scaler.inverse_transform(y_train.reshape(-1, 1))
        y_test_inv = scaler.inverse_transform(y_test.reshape(-1, 1))

        await websocket.send_text("Calculating RMSE & MAPE...")
        train_rmse = math.sqrt(mean_squared_error(y_train_inv, train_predict))
        test_rmse = math.sqrt(mean_squared_error(y_test_inv, test_predict))
        await websocket.send_text(f"Train RMSE: {train_rmse:.2f}, Test RMSE: {test_rmse:.2f}")
        print(f"Train RMSE: {train_rmse:.2f}, Test RMSE: {test_rmse:.2f}")
        train_mape = mean_absolute_percentage_error(y_train_inv, train_predict)
        test_mape = mean_absolute_percentage_error(y_test_inv, test_predict)

        await websocket.send_text(f"Train MAPE: {train_mape:.2f}%, Test MAPE: {test_mape:.2f}%")
        print(f"Train MAPE: {train_mape:.2f}%, Test MAPE: {test_mape:.2f}%")

        output_dir = os.path.abspath("../frontend/public/plots")
        os.makedirs(output_dir, exist_ok=True)

        # === Train/Test Plot ===
        try:
            await websocket.send_text("Generating train/test prediction plot...")
            look_back = 100
            trainPredictPlot = np.empty_like(df1)
            trainPredictPlot[:, :] = np.nan
            trainPredictPlot[look_back:len(train_predict)+look_back, :] = train_predict

            testPredictPlot = np.empty_like(df1)
            testPredictPlot[:, :] = np.nan
            testPredictPlot[len(train_predict)+(look_back*2)+1:len(df1)-1, :] = test_predict

            plt.figure(figsize=(10, 6))
            plt.plot(scaler.inverse_transform(df1), label="Original")
            plt.plot(trainPredictPlot, label="Train Prediction")
            plt.plot(testPredictPlot, label="Test Prediction")
            plt.title(f"{stock_name} - Stock Price Prediction")
            plt.legend()
            train_test_path = os.path.join(output_dir, "train_test_predictions.png")
            plt.savefig(train_test_path)
            plt.close()
            print(f"Saved train/test plot at: {train_test_path}")
            await websocket.send_text("Train/test plot saved.")
        except Exception as e:
            await websocket.send_text(f"Failed to save train/test plot: {e}")
            print(f"Error saving train/test plot: {e}")

        # === Future Forecast Plot ===
        try:
            await websocket.send_text("Forecasting future...")
            x_input = test_data[len(test_data) - 100:].reshape(1, -1)
            temp_input = list(x_input[0])
            lst_output = []

            for i in range(60):
                x_input = np.array(temp_input[-100:]).reshape((1, time_step, 1))
                yhat = model.predict(x_input, verbose=0)
                temp_input.append(yhat[0][0])
                lst_output.append(yhat[0])
                await websocket.send_text(f"Forecasting day {i+1} / 60...")

            await websocket.send_text("Generating future forecast plot...")
            
            forecast_values = scaler.inverse_transform(np.array(lst_output).reshape(-1, 1))
            
            day_new = np.arange(1, 101)
            day_pred = np.arange(101, 101 + len(forecast_values))

            plt.figure(figsize=(10, 6))
            plt.plot(day_new, scaler.inverse_transform(df1[-100:]), label="Last 100 Days")
            plt.plot(day_pred, forecast_values, label="Next 60 Days")
            plt.title(f"{stock_name} - Future Forecasting")
            plt.legend()
            
            future_path = os.path.join(output_dir, "future_forecasting.png")
            plt.savefig(future_path)
            plt.close()
            print(f"Saved future forecast plot at: {future_path}")
            await websocket.send_text("Future forecast plot saved.")
        except Exception as e:
            await websocket.send_text(f"Failed to save future forecast plot: {e}")
            print(f"Error saving future forecast plot: {e}")


        # === Extended Forecast Plot ===
        try:
            await websocket.send_text("Generating extended forecast plot...")
            df3 = df1.tolist()
            df3.extend(np.array(lst_output).reshape(-1, 1).tolist())
            plt.figure(figsize=(10, 6))
            plt.plot(df3[1000:])
            plt.title(f"{stock_name} - Extended Forecasting")
            extended_path = os.path.join(output_dir, "extended_forecasting.png")
            plt.savefig(extended_path)
            plt.close()
            print(f"Saved extended forecast plot at: {extended_path}")
            await websocket.send_text("Extended forecast plot saved.")
        except Exception as e:
            await websocket.send_text(f"Failed to save extended forecast plot: {e}")
            print(f"Error saving extended forecast plot: {e}")

        await websocket.send_text("Done")
        print("Done")

    except Exception as e:
        await websocket.send_text(f"Error occurred: {str(e)}")
        print(f"Error occurred: {str(e)}")
        await websocket.close()


if __name__ == "__main__":
    uvicorn.run("stock:app", host="127.0.0.1", port=8080, reload=True)