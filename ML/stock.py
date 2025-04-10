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
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/progress")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_text("Waiting for stock name...")
    
    try:
        # Receive stock name
        stock_name = await websocket.receive_text()
        await websocket.send_text(f"Received stock: {stock_name}")

        # Setup & Fetch
        await websocket.send_text("Fetching stock data...")
        ticker = yf.Ticker(stock_name)
        data = ticker.history(period="5y")

        if data.empty:
            await websocket.send_text("Error: No data found for this stock symbol.")
            await websocket.close()
            return

        df1 = data.reset_index()['Close']
        scaler = MinMaxScaler(feature_range=(0,1))
        df1 = scaler.fit_transform(np.array(df1).reshape(-1,1))

        # Split & Dataset
        await websocket.send_text("Splitting and preparing dataset...")
        training_size = int(len(df1)*0.65)
        test_size = len(df1) - training_size
        train_data, test_data = df1[0:training_size,:], df1[training_size:len(df1),:1]

        def create_dataset(dataset, time_step=1):
            dataX, dataY = [], []
            for i in range(len(dataset)-time_step-1):
                a = dataset[i:(i+time_step),0]
                dataX.append(a)
                dataY.append(dataset[i + time_step, 0])
            return np.array(dataX), np.array(dataY)

        time_step = 100
        X_train, y_train = create_dataset(train_data, time_step)
        X_test, y_test = create_dataset(test_data, time_step)

        X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
        X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

        # Train Model
        await websocket.send_text("Training model...")
        model = tf.keras.Sequential()
        model.add(tf.keras.layers.LSTM(50, return_sequences=True, input_shape=(100, 1)))
        model.add(tf.keras.layers.LSTM(50, return_sequences=True))
        model.add(tf.keras.layers.LSTM(50))
        model.add(tf.keras.layers.Dense(1))
        model.compile(loss='mean_squared_error', optimizer='adam')

        class EpochCallback(tf.keras.callbacks.Callback):
            def on_epoch_end(self, epoch, logs=None):
                message = f"Training epoch {epoch+1}/100, loss: {logs['loss']:.4f}"
                asyncio.create_task(websocket.send_text(message))

        model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=100, batch_size=64, verbose=0,
                  callbacks=[EpochCallback()])

        # Predictions
        await websocket.send_text("Making predictions...")
        train_predict = model.predict(X_train)
        test_predict = model.predict(X_test)
        train_predict = scaler.inverse_transform(train_predict)
        test_predict = scaler.inverse_transform(test_predict)

        # RMSE
        await websocket.send_text("Calculating RMSE...")
        train_rmse = math.sqrt(mean_squared_error(y_train, train_predict))
        test_rmse = math.sqrt(mean_squared_error(y_test, test_predict))
        await websocket.send_text(f"Train RMSE: {train_rmse:.2f}, Test RMSE: {test_rmse:.2f}")

        # Plotting
        await websocket.send_text("Generating plots...")
        output_dir = "../frontend/public/plots"
        os.makedirs(output_dir, exist_ok=True)

        look_back = 100
        trainPredictPlot = np.empty_like(df1)
        trainPredictPlot[:, :] = np.nan
        trainPredictPlot[look_back:len(train_predict)+look_back, :] = train_predict

        testPredictPlot = np.empty_like(df1)
        testPredictPlot[:, :] = np.nan
        testPredictPlot[len(train_predict)+(look_back*2)+1:len(df1)-1, :] = test_predict

        plt.figure(figsize=(10,6))
        plt.plot(scaler.inverse_transform(df1), label="Original")
        plt.plot(trainPredictPlot, label="Train Prediction")
        plt.plot(testPredictPlot, label="Test Prediction")
        plt.title(f"{stock_name} - Stock Price Prediction")
        plt.legend()
        plt.savefig(os.path.join(output_dir, "train_test_predictions.png"))
        plt.close()

        # Forecasting
        await websocket.send_text("Forecasting future...")
        x_input = test_data[len(test_data) - 100:].reshape(1,-1)
        temp_input = list(x_input[0])
        lst_output = []
        i = 0
        while(i < 30):
            if(len(temp_input) > 100):
                x_input = np.array(temp_input[1:]).reshape((1, time_step, 1))
            else:
                x_input = np.array(temp_input).reshape((1, time_step, 1))
            yhat = model.predict(x_input, verbose=0)
            temp_input.extend(yhat[0].tolist())
            temp_input = temp_input[1:]
            lst_output.extend(yhat.tolist())
            i += 1

        day_new = np.arange(1, 101)
        day_pred = np.arange(101, 131)

        plt.figure(figsize=(10,6))
        plt.plot(day_new, scaler.inverse_transform(df1[len(df1)-100:]), label="Last 100 Days")
        plt.plot(day_pred, scaler.inverse_transform(lst_output), label="Next 30 Days")
        plt.title(f"{stock_name} - Future Forecasting")
        plt.legend()
        plt.savefig(os.path.join(output_dir, "future_forecasting.png"))
        plt.close()

        df3 = df1.tolist()
        df3.extend(lst_output)
        plt.figure(figsize=(10,6))
        plt.plot(df3[1000:])
        plt.title(f"{stock_name} - Extended Forecasting")
        plt.savefig(os.path.join(output_dir, "extended_forecasting.png"))
        plt.close()

        await websocket.send_text("Done")
        print("Done")

    except Exception as e:
        await websocket.send_text(f"Error occurred: {str(e)}")
        await websocket.close()

if __name__ == "__main__":
    uvicorn.run("stock:app", host="127.0.0.1", port=8080, reload=True)
