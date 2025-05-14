import os
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
import uvicorn
import base64
import numpy as np
import pandas as pd
import tensorflow as tf
from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import pandas_ta as ta
from io import BytesIO
import urllib

# Constants
MODEL_PATH = "saved_models/combined_model.keras"
SCALER_DATA_MAX_PATH = "saved_models/combined_scaler.npy"
CSV_DIR = os.path.abspath("stock_csvs")
TIME_STEP = 100
FUTURE_DAYS = 200

# CSV Mapping
csvs = {
    "RELIANCE.NS": "Reliance_Industries_Ltd.csv",
    "HDFCBANK.NS": "HDFC_Bank_Ltd.csv",
    "TCS.NS": "Tata_Consultancy_Services_Ltd.csv",
    "BHARTIARTL.NS":"Bharti_Airtel_Ltd.csv",
    "ICICIBANK.NS": "ICICI_Bank_Ltd.csv",
    "SBIN.NS": "State_Bank_of_India.csv",
    "INFY.NS": "Infosys_Ltd.csv",
    "HINDUNILVR.NS": "Hindustan_Unilever_Ltd.csv",
    "BAJFINANCE.NS": "Bajaj_Finance_Ltd.csv",
    "ITC.NS": "ITC_Ltd.csv",
    "HCLTECH.NS": "HCL_Technologies_Ltd.csv",
    "LT.NS": "Larsen_and_Toubro_Ltd.csv",
    "SUNPHARMA.NS": "Sun_Pharmaceutical_Industries_Ltd.csv",
    "KOTAKBANK.NS": "Kotak_Mahindra_Bank_Ltd.csv",
    "MARUTI.NS": "Maruti_Suzuki_India_Ltd.csv",
    "M&M.NS": "Mahindra_and_Mahindra_Ltd.csv",
    "AXISBANK.NS": "Axis_Bank_Ltd.csv",
    "ULTRACEMCO.NS": "UltraTech_Cement_Ltd.csv",
    "ADANIENT.NS": "Adani_Enterprises_Ltd.csv",
    "BAJAJFINSV.NS": "Bajaj_Finserv_Ltd.csv", 
}

# App init
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure plots directory exists
os.makedirs("plots", exist_ok=True)

# Load model and scaler once
print("Loading model and scaler on startup...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    scaler_max = np.load(SCALER_DATA_MAX_PATH)
except Exception as e:
    print("Failed to load model or scaler:", str(e))
    model = None
    scaler_max = None


def load_stock_data(stock_name):
    if stock_name not in csvs:
        raise ValueError(f"{stock_name} not found in mapping.")
    
    path = os.path.join(CSV_DIR, csvs[stock_name])
    if not os.path.exists(path):
        raise ValueError(f"CSV file not found for {stock_name} at path {path}")
    
    df = pd.read_csv(path, parse_dates=["Date"], index_col="Date")
    if df.empty:
        raise ValueError(f"No data found in CSV for {stock_name}")
    
    print(f"Loaded {stock_name} data. Shape: {df.shape}")
    return df


def predict_future(stock_name: str):

    if model is None or scaler_max is None:
        raise ValueError("Model or scaler not loaded. Check file paths or loading logic.")

    if stock_name not in csvs:
        raise ValueError(f"Unsupported stock symbol: {stock_name}")

    csv_file = csvs[stock_name]
    csv_path = os.path.join(CSV_DIR, csv_file)
    # print(f"[DEBUG] Loading CSV from: {csv_path}")

    if not os.path.exists(csv_path):
        raise ValueError(f"CSV file not found: {csv_path}")

    # Add optional logging for content sanity
    try:
        df = pd.read_csv(csv_path)
        # print(f"[DEBUG] CSV loaded. Shape: {df.shape}, Columns: {df.columns.tolist()}")
    except Exception as e:
        raise ValueError(f"Failed to read CSV: {e}")

    # You can add more checks here, like:
    if "Close" not in df.columns:
        raise ValueError("CSV file does not contain 'Close' column.")

    if len(df) < TIME_STEP:
        raise ValueError(f"Not enough data points. Found {len(df)}, required at least {TIME_STEP}.")

    if model is None or scaler_max is None:
        raise ValueError("Model or scaler not loaded properly")

    df = load_stock_data(stock_name)

    # Add indicators
    df['SMA_50'] = ta.sma(df['Close'], length=50)
    df['SMA_200'] = ta.sma(df['Close'], length=200)
    df['RSI'] = ta.rsi(df['Close'], length=14)
    macd = ta.macd(df['Close'])
    df['MACD'] = macd['MACD_12_26_9']
    df['MACD_signal'] = macd['MACDs_12_26_9']
    df.dropna(inplace=True)

    # Prepare input
    data = df["Close"].values.reshape(-1, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaler.fit(data)

    if scaler_max.shape != scaler.data_max_.shape:
        raise ValueError(f"Scaler shape mismatch. Expected {scaler.data_max_.shape}, got {scaler_max.shape}")

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

    # Plot
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

    # Convert plot to base64
    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    plt.close()
    buffer.seek(0)
    base64_img = base64.b64encode(buffer.read()).decode("utf-8")

    return predictions_actual, future_dates, base64_img


@app.get("/predict")
def predict(stock: str = Query(..., description="Stock symbol (e.g. RELIANCE.NS). If it includes special characters like &, use URL encoding (e.g., M%26M.NS for M&M.NS)")):
    try:
        # Decode in case it's URL-encoded
        decoded_stock = urllib.parse.unquote(stock)
        # print(f"[DEBUG] Predicting for: {decoded_stock}")

        if decoded_stock not in csvs:
            return JSONResponse(
                status_code=400,
                content={"error": f"Stock '{decoded_stock}' is not supported or not found in available data."}
            )

        # Run prediction
        prices, dates, base64_plot = predict_future(decoded_stock)
        predictions_data = [
            {"date": date.strftime("%Y-%m-%d"), "price": float(price)}
            for date, price in zip(dates, prices.flatten())
        ]
        return {
            "stock": decoded_stock,
            "predictions": predictions_data,
            "plot_base64": base64_plot
        }

    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": str(e)})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Internal server error: {str(e)}"})


# if __name__ == "__main__":
#     uvicorn.run("stock_predict:app", host="127.0.0.1", port=8083, reload=True)
