import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

# Create necessary directories
os.makedirs("plots", exist_ok=True)
os.makedirs("fine_tuned_models", exist_ok=True)

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

def fine_tune_model(stock_name, epochs=10, batch_size=32):
    print(f"Starting fine-tuning for {stock_name}...")

    # Load model and data
    model = tf.keras.models.load_model(MODEL_PATH)
    df = load_stock_data(stock_name)
    data = df["Close"].values.reshape(-1, 1)

    # Setup scaler
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaler.fit(data)
    scaled_data = scaler.transform(data)

    # Create training sequences
    x_train, y_train = [], []
    for i in range(TIME_STEP, len(scaled_data)):
        x_train.append(scaled_data[i - TIME_STEP:i])
        y_train.append(scaled_data[i])
    
    x_train, y_train = np.array(x_train), np.array(y_train)
    x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

    # Fine-tune model
    model.fit(x_train, y_train, epochs=epochs, batch_size=batch_size, verbose=1)

    # Save fine-tuned model
    os.makedirs("fine_tuned_models", exist_ok=True)
    fine_tuned_path = f"fine_tuned_models/{stock_name}_model.keras"
    model.save(fine_tuned_path)
    print(f"Fine-tuned model saved at: {fine_tuned_path}")

    return fine_tuned_path

def predict_future(stock_name, model_path=None):
    if model_path is None:
        model_path = MODEL_PATH
    model = tf.keras.models.load_model(model_path)
    scaler_max = np.load(SCALER_DATA_MAX_PATH)

    df = load_stock_data(stock_name)
    data = df["Close"].values.reshape(-1, 1)

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaler.fit(data)
    scaler.data_max_ = scaler_max
    scaled_data = scaler.transform(data)

    input_seq = scaled_data[-TIME_STEP:].reshape(1, TIME_STEP, 1)

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

    # Plotting
    plt.figure(figsize=(10, 5))
    plt.plot(df.index, data, label="Historical Prices")
    plt.plot(future_dates, predictions_actual, label="Predicted Future")
    plt.title(f"{stock_name} - Next {FUTURE_DAYS} Days Forecast")
    plt.xlabel("Date")
    plt.ylabel("Stock Price")
    plt.legend()
    plt.grid()
    plt.tight_layout()
    plt.savefig(f"plots/{stock_name}_future_prediction.png")
    plt.close()

    print(f"Prediction plot saved to plots/{stock_name}_future_prediction.png")
    return predictions_actual, future_dates

# Example usage
if __name__ == "__main__":
    stock = "AXISBANK.NS"

    # Fine-tune model on this stock
    fine_tuned_model_path = fine_tune_model(stock, epochs=10)

    # Use the fine-tuned model for prediction
    future_prices, future_dates = predict_future(stock, model_path=fine_tuned_model_path)

    print(f"\nPredicted next {FUTURE_DAYS} closing prices for {stock}:")
    for date, price in zip(future_dates, future_prices.flatten()):
        print(f"{date.strftime('%Y-%m-%d')}: {price}")
