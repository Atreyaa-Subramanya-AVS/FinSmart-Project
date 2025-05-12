import os
import yfinance as yf
import numpy as np
import tensorflow as tf
import pandas as pd
import math
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error

np.random.seed(42)
tf.random.set_seed(42)

# Define stock CSV mappings (you can modify this)
csvs = {
    "HDFCBANK.NS": "HDFC_Bank_Ltd.csv",
    "ICICIBANK.NS": "ICICI_Bank_Ltd.csv",
    "RELIANCE.NS": "Reliance_Industries_Ltd.csv",
    "INFY.NS": "Infosys_Ltd.csv",
    "TCS.NS": "Tata_Consultancy_Services_Ltd.csv",
    "LT.NS": "Larsen_and_Toubro_Ltd.csv",
    "AXISBANK.NS": "Axis_Bank_Ltd.csv",
    "SBIN.NS": "State_Bank_of_India.csv"
}

def load_data(stock_name):
    path = os.path.abspath("ML/stock_csvs")
    if stock_name not in csvs:
        raise ValueError(f"Stock {stock_name} not found in the local CSV mapping.")
    
    csv_filename = csvs[stock_name]
    csv_file_path = os.path.join(path, csv_filename)
    if not os.path.exists(csv_file_path):
        raise FileNotFoundError(f"CSV file not found for {stock_name}.")
    
    data = pd.read_csv(csv_file_path, parse_dates=["Date"], index_col="Date")
    if data.empty:
        raise ValueError(f"No data found for {stock_name} in CSV file.")
    
    return data

def combine_data():
    all_data = []
    
    # Load and combine data from all the CSVs
    for stock_name in csvs.keys():
        stock_data = load_data(stock_name)
        stock_data["Stock"] = stock_name  # Optional: Add stock name as a column for identification
        all_data.append(stock_data)

    # Concatenate all stock data into one DataFrame
    combined_data = pd.concat(all_data)
    return combined_data

def create_dataset(dataset, time_step=1):
    dataX, dataY = [], []
    for i in range(len(dataset) - time_step - 1):
        a = dataset[i:(i + time_step), 0]
        dataX.append(a)
        dataY.append(dataset[i + time_step, 0])
    return np.array(dataX), np.array(dataY)

def train_model(X_train, y_train, X_test, y_test, time_step=100):
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
    
    model.compile(loss='mean_squared_error', optimizer=tf.keras.optimizers.AdamW(learning_rate=0.01, weight_decay=1e-4))

    model.fit(X_train, y_train, validation_data=(X_test, y_test), epochs=50, batch_size=64, verbose=1)

    return model

def evaluate_model(model, X_train, y_train, X_test, y_test, scaler):
    train_predict = model.predict(X_train)
    test_predict = model.predict(X_test)

    train_predict = scaler.inverse_transform(train_predict)
    test_predict = scaler.inverse_transform(test_predict)

    y_train_inv = scaler.inverse_transform(y_train.reshape(-1, 1))
    y_test_inv = scaler.inverse_transform(y_test.reshape(-1, 1))

    train_rmse = math.sqrt(mean_squared_error(y_train_inv, train_predict))
    test_rmse = math.sqrt(mean_squared_error(y_test_inv, test_predict))
    train_mape = mean_absolute_percentage_error(y_train_inv, train_predict)
    test_mape = mean_absolute_percentage_error(y_test_inv, test_predict)

    print(f"Train RMSE: {train_rmse:.2f}, Test RMSE: {test_rmse:.2f}")
    print(f"Train MAPE: {train_mape:.2f}%, Test MAPE: {test_mape:.2f}%")

    return train_predict, test_predict

def save_model(model, scaler, stock_name="combined"):
    model_path = os.path.join("saved_models", f"{stock_name}_model.keras")
    scaler_path = os.path.join("saved_models", f"{stock_name}_scaler.npy")

    os.makedirs("saved_models", exist_ok=True)

    model.save(model_path)
    np.save(scaler_path, scaler.data_max_)

def load_model_and_scaler(stock_name="combined"):
    model_path = os.path.join("saved_models", f"{stock_name}_model.keras")
    scaler_path = os.path.join("saved_models", f"{stock_name}_scaler.npy")

    if os.path.exists(model_path) and os.path.exists(scaler_path):
        model = tf.keras.models.load_model(model_path)
        scaler_data_max = np.load(scaler_path)
        return model, scaler_data_max
    else:
        return None, None

def plot_results(df1, train_predict, test_predict, stock_name="combined", scaler=None):
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
    plt.title(f"Combined Stock Price Prediction")
    plt.legend()

    plot_path = os.path.join("plots", f"combined_train_test_predictions.png")
    plt.savefig(plot_path)
    plt.close()

def main():
    # Combine data from all stocks
    combined_data = combine_data()

    # Use only the 'Close' price column for training
    df1 = combined_data.reset_index()['Close']
    scaler = MinMaxScaler(feature_range=(0, 1))
    df1 = scaler.fit_transform(np.array(df1).reshape(-1, 1))

    # Split data into training and testing
    training_size = int(len(df1) * 0.65)
    test_size = len(df1) - training_size
    train_data, test_data = df1[0:training_size, :], df1[training_size:, :]

    time_step = 100
    X_train, y_train = create_dataset(train_data, time_step)
    X_test, y_test = create_dataset(test_data, time_step)

    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

    # Load model if available
    model, saved_scaler = load_model_and_scaler()

    if model is None or saved_scaler is None:
        print("Training model...")
        model = train_model(X_train, y_train, X_test, y_test, time_step)
        print("Model trained.")
        save_model(model, scaler)
    else:
        print("Loaded saved model.")
        scaler.data_max_ = saved_scaler

    # Evaluate the model
    train_predict, test_predict = evaluate_model(model, X_train, y_train, X_test, y_test, scaler)

    # Plot results
    plot_results(df1, train_predict, test_predict, scaler=scaler)

if __name__ == "__main__":
    main()
