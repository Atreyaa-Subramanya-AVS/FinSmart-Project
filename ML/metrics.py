import os
import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error

# Disable TensorFlow ONEDNN optimizations (if needed)
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
# Hello

# Constants
MODEL_PATH = "ML/saved_models/combined_model.keras"
SCALER_DATA_MAX_PATH = "ML/saved_models/combined_scaler.npy"
CSV_DIR = os.path.abspath("ML/training_stock_csvs")
TIME_STEP = 100
EVAL_DAYS = 30  # Number of days to evaluate on

# Stock CSV mapping
csvs = {
    "RELIANCE.NS": "Reliance_Industries_Ltd.csv",
    "HDFCBANK.NS": "HDFC_Bank_Ltd.csv",
    "ICICIBANK.NS": "ICICI_Bank_Ltd.csv",
    "INFY.NS": "Infosys_Ltd.csv",
    "TCS.NS": "Tata_Consultancy_Services_Ltd.csv",
    "LT.NS": "Larsen_and_Toubro_Ltd.csv",
    "AXISBANK.NS": "Axis_Bank_Ltd.csv",
    "SBIN.NS": "State_Bank_of_India.csv",
    "ADANIENT.NS": "Adani_Enterprises_Ltd.csv"
}

def load_stock_data(stock_name):
    path = os.path.join(CSV_DIR, csvs[stock_name])
    df = pd.read_csv(path, parse_dates=["Date"], index_col="Date")
    return df

def evaluate_model(stock_name):
    model = tf.keras.models.load_model(MODEL_PATH)
    scaler_max = np.load(SCALER_DATA_MAX_PATH)
    df = load_stock_data(stock_name)
    data = df["Close"].values.reshape(-1, 1)

    scaler = MinMaxScaler()
    scaler.fit(data)
    scaler.data_max_ = scaler_max
    scaled_data = scaler.transform(data)

    X = []
    y = []
    for i in range(TIME_STEP, len(data) - EVAL_DAYS):
        X.append(scaled_data[i - TIME_STEP:i])
        y.append(scaled_data[i:i + EVAL_DAYS])

    X = np.array(X)
    y = np.array(y)

    if len(X) == 0:
        print("Not enough data to evaluate.")
        return

    # Take the last sequence for evaluation
    input_seq = X[-1].reshape(1, TIME_STEP, 1)
    true_seq = y[-1].reshape(EVAL_DAYS, 1)
    predictions = []

    for _ in range(EVAL_DAYS):
        pred = model.predict(input_seq, verbose=0)
        predictions.append(pred[0][0])
        input_seq = np.append(input_seq[:, 1:, :], pred.reshape(1, 1, 1), axis=1)

    predictions = np.array(predictions).reshape(-1, 1)

    # Inverse scale
    true_prices = scaler.inverse_transform(true_seq)
    predicted_prices = scaler.inverse_transform(predictions)

    mae = mean_absolute_error(true_prices, predicted_prices)
    rmse = np.sqrt(mean_squared_error(true_prices, predicted_prices))

    print(f"\n📈 Accuracy Evaluation for {stock_name}")
    print(f"Last {EVAL_DAYS} actual days vs predicted:")
    print(f"MAE  = ₹{mae:.2f}")
    print(f"RMSE = ₹{rmse:.2f}")

if __name__ == "__main__":
    stock = "RELIANCE.NS"  # Change to any stock in the mapping
    evaluate_model(stock)
