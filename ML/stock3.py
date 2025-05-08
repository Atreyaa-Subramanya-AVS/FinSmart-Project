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

        df1 = data[['Open', 'High', 'Low', 'Close']].copy()  # Use OHLC data
        scaler = MinMaxScaler(feature_range=(0, 1))
        df1_scaled = scaler.fit_transform(df1)

        await websocket.send_text("Splitting and preparing dataset...")
        training_size = int(len(df1_scaled) * 0.65)
        test_size = len(df1_scaled) - training_size
        train_data, test_data = df1_scaled[0:training_size, :], df1_scaled[training_size:, :]

        def create_dataset(dataset, time_step=1):
            dataX, dataY = [], []
            for i in range(len(dataset) - time_step - 1):
                a = dataset[i:(i + time_step), :]  # Use all 4 features
                dataX.append(a)
                dataY.append(dataset[i + time_step, 3])  # Predicting the 'Close' price
            return np.array(dataX), np.array(dataY)

        time_step = 100
        X_train, y_train = create_dataset(train_data, time_step)
        X_test, y_test = create_dataset(test_data, time_step)

        X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 4)  # 4 features: Open, High, Low, Close
        X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 4)

        await websocket.send_text("Training model...")
        print("Training model...")

        tf.keras.backend.clear_session()

        model = tf.keras.Sequential([
            tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(50, return_sequences=True), input_shape=(100, 4)),
            tf.keras.layers.LSTM(50, return_sequences=True),
            tf.keras.layers.GRU(50, return_sequences=True),  # GRU layer
            tf.keras.layers.Dropout(0.2),  # Dropout layer
            tf.keras.layers.Dense(1)
        ])
        model.compile(loss='mean_squared_error', optimizer='adam')

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
                verbose=1,  # Enable TF logs
                callbacks=[callback]
            ))

        await websocket.send_text("Making predictions...")
        # After training and predicting
        train_predict = model.predict(X_train)
        test_predict = model.predict(X_test)

        # Reshape the predictions to match the original data shape (1 feature for Close price)
        train_predict = train_predict.reshape(-1, 1)
        test_predict = test_predict.reshape(-1, 1)

        # Step 1: Create full copies of the original scaled data
        train_predict_full = np.copy(df1_scaled)  # Create a copy of the scaled data for the train set
        test_predict_full = np.copy(df1_scaled)  # Same for the test set

        # Step 2: Replace the 'Close' column (index 3) with the predicted 'Close' prices
        train_predict_full[:, 3] = train_predict.reshape(-1)
        test_predict_full[:, 3] = test_predict.reshape(-1)

        # Step 3: Apply inverse_transform on the full array
        train_predict_inv = scaler.inverse_transform(train_predict_full)
        test_predict_inv = scaler.inverse_transform(test_predict_full)

        # Extract the 'Close' price from the inverse-transformed data
        train_predict_inv = train_predict_inv[:, 3]
        test_predict_inv = test_predict_inv[:, 3]

        y_train_inv = scaler.inverse_transform(y_train.reshape(-1, 1))
        y_test_inv = scaler.inverse_transform(y_test.reshape(-1, 1))

        await websocket.send_text("Calculating RMSE...")
        train_rmse = math.sqrt(mean_squared_error(y_train_inv, train_predict_inv))
        test_rmse = math.sqrt(mean_squared_error(y_test_inv, test_predict_inv))
        await websocket.send_text(f"Train RMSE: {train_rmse:.2f}, Test RMSE: {test_rmse:.2f}")
        print(f"Train RMSE: {train_rmse:.2f}, Test RMSE: {test_rmse:.2f}")

        output_dir = os.path.abspath("../frontend/public/plots")
        os.makedirs(output_dir, exist_ok=True)

        try:
            await websocket.send_text("Generating train/test prediction plot...")

            look_back = 100

            # Ensure that the prediction arrays have the same length as the 'Close' price column
            trainPredictPlot = np.full_like(df1_scaled[:, 3], np.nan)  # Initialize with NaNs
            testPredictPlot = np.full_like(df1_scaled[:, 3], np.nan)  # Initialize with NaNs

            # Assign the predictions to the appropriate positions in the plot arrays
            trainPredictPlot[look_back:len(train_predict_inv) + look_back] = train_predict_inv.flatten()
            testPredictPlot[len(train_predict_inv) + (look_back * 2):len(df1_scaled)] = test_predict_inv.flatten()

            # Plotting the results
            plt.figure(figsize=(10, 6))
            plt.plot(scaler.inverse_transform(df1_scaled[:, 3].reshape(-1, 1)), label="Original Data")
            plt.plot(trainPredictPlot, label="Train Prediction")
            plt.plot(testPredictPlot, label="Test Prediction")
            plt.title(f"{stock_name} - Stock Price Prediction")
            plt.legend()

            # Save the plot
            train_test_path = os.path.join(output_dir, "train_test_predictions.png")
            plt.savefig(train_test_path)
            plt.close()

            await websocket.send_text("Train/test plot saved.")
        except Exception as e:
            await websocket.send_text(f"Failed to save train/test plot: {e}")
            print(f"Error saving train/test plot: {e}")



        try:
            await websocket.send_text("Forecasting future...")
            x_input = test_data[len(test_data) - 100:].reshape(1, 100, 4)  # Reshaping correctly for LSTM input (1, time_step, features)
            temp_input = list(x_input[0])
            lst_output = []

            for i in range(30):
                x_input = np.array(temp_input[-100:]).reshape((1, 100, 4))  # Use all 4 features (Open, High, Low, Close)
                yhat = model.predict(x_input, verbose=0)
                temp_input.append(yhat[0][0])  # Only append the predicted Close price
                lst_output.append(yhat[0])
                await websocket.send_text(f"Forecasting day {i+1}/30...")

            # Step 1: Prepare the forecast values and reshape for inverse transform
            forecast_values = np.array(lst_output).reshape(-1, 1)  # Reshape to 2D for scaler

            # Step 2: Create a copy of the last 100 days for future forecasting and replace Close column with forecast
            forecast_values_full = np.copy(df1_scaled[-30:])  # Use the last 30 days of data
            forecast_values_full[:, 3] = forecast_values.reshape(-1)

            # Step 3: Inverse transform the forecast values
            forecast_values_full_inv = scaler.inverse_transform(forecast_values_full)

            # Step 4: Plotting the forecasted future prices
            day_new = np.arange(1, 101)
            day_pred = np.arange(101, 131)

            plt.figure(figsize=(10, 6))
            plt.plot(day_new, scaler.inverse_transform(df1_scaled[-100:, 3].reshape(-1, 1)), label="Last 100 Days")  # Close prices
            plt.plot(day_pred, forecast_values_full_inv[:, 3], label="Next 30 Days")  # Only plotting the forecasted Close price
            plt.title(f"{stock_name} - Future Forecasting")
            plt.legend()
            future_path = os.path.join(output_dir, "future_forecasting.png")
            plt.savefig(future_path)
            plt.close()
            await websocket.send_text("Future forecast plot saved.")

        except Exception as e:
            await websocket.send_text(f"Failed to save forecast plot: {e}")
            print(f"Error saving forecast plot: {e}")

    except Exception as e:
        await websocket.send_text(f"An error occurred: {e}")
        print(f"Error: {e}")

if __name__ == "__main__":
    uvicorn.run("stock:app", host="127.0.0.1", port=8080, reload=True)