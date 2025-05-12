import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import pandas_ta as ta

# Create directory for plots
os.makedirs("plots", exist_ok=True)

# Constants
MODEL_PATH = "ML/saved_models/combined_model.keras"
SCALER_DATA_MAX_PATH = "ML/saved_models/combined_scaler.npy"
CSV_DIR = os.path.abspath("ML/training_stock_csvs")
TIME_STEP = 100
FUTURE_DAYS = 200

# Stock CSV mapping
csvs = {
    "HDFCBANK.NS": "HDFC_Bank_Ltd.csv",
    "ICICIBANK.NS": "ICICI_Bank_Ltd.csv",
    "RELIANCE.NS": "Reliance_Industries_Ltd.csv",
    "INFY.NS": "Infosys_Ltd.csv",
    "TCS.NS": "Tata_Consultancy_Services_Ltd.csv",
    "LT.NS": "Larsen_and_Toubro_Ltd.csv",
    "AXISBANK.NS": "Axis_Bank_Ltd.csv",
    "SBIN.NS": "State_Bank_of_India.csv",
    "ADANIENT.NS": "Adani_Enterprises_Ltd.csv"
}

def load_stock_data(stock_name):
    if stock_name not in csvs:
        raise ValueError(f"{stock_name} not found in mapping.")
    path = os.path.join(CSV_DIR, csvs[stock_name])
    df = pd.read_csv(path, parse_dates=["Date"], index_col="Date")
    return df

def predict_future(stock_name, model_path=MODEL_PATH):
    print(f"\n[INFO] Starting prediction for: {stock_name}")

    model = tf.keras.models.load_model(model_path)
    scaler_max = np.load(SCALER_DATA_MAX_PATH)

    df = load_stock_data(stock_name)

    # Add indicators
    df['SMA_50'] = ta.sma(df['Close'], length=50)
    df['SMA_200'] = ta.sma(df['Close'], length=200)
    df['RSI'] = ta.rsi(df['Close'], length=14)
    macd = ta.macd(df['Close'])
    df['MACD'] = macd['MACD_12_26_9']
    df['MACD_signal'] = macd['MACDs_12_26_9']
    df.dropna(inplace=True)

    # Prepare model input
    data = df["Close"].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaler.fit(data)
    scaler.data_max_ = scaler_max
    scaled_data = scaler.transform(data)
    input_seq = scaled_data[-TIME_STEP:].reshape(1, TIME_STEP, 1)

    # Predict
    predictions = []
    last_date = df.index[-1]
    for _ in range(FUTURE_DAYS):
        pred = model.predict(input_seq, verbose=0)
        predictions.append(pred[0][0])
        pred = pred.reshape(1, 1, 1)
        input_seq = np.append(input_seq[:, 1:, :], pred, axis=1)

    predictions = np.array(predictions).reshape(-1, 1)
    predictions_actual = scaler.inverse_transform(predictions)
    future_dates = pd.date_range(start=last_date, periods=FUTURE_DAYS + 1, freq='B')[1:]

    # Plot all in one
    plt.figure(figsize=(14, 8))
    plt.plot(df.index, df["Close"], label="Historical Close", color="black")
    plt.plot(df.index, df["SMA_50"], label="SMA 50", color="blue", linestyle="--")
    plt.plot(df.index, df["SMA_200"], label="SMA 200", color="green", linestyle="--")
    plt.plot(df.index, df["RSI"], label="RSI", color="purple", alpha=0.6)
    plt.plot(df.index, df["MACD"], label="MACD", color="red", alpha=0.7)
    plt.plot(df.index, df["MACD_signal"], label="MACD Signal", color="orange", alpha=0.7)
    plt.plot(future_dates, predictions_actual, label="Predicted Future", color="darkorange", linewidth=2)

    plt.title(f"{stock_name} - Forecast + Indicators")
    plt.xlabel("Date")
    plt.ylabel("Price / Indicator Value")
    plt.legend(loc="upper left")
    plt.grid(True)
    plt.tight_layout()

    plot_path = f"plots/{stock_name}_forecast_with_all_indicators.png"
    plt.savefig(plot_path)
    plt.close()

    print(f"[INFO] Forecast plot saved to: {plot_path}")
    return predictions_actual, future_dates

# Example usage
if __name__ == "__main__":
    stock = "RELIANCE.NS"
    future_prices, future_dates = predict_future(stock)

    print(f"\nPredicted next {FUTURE_DAYS} closing prices for {stock}:")
    for date, price in zip(future_dates, future_prices.flatten()):
        print(f"{date.strftime('%Y-%m-%d')}: {price}")
