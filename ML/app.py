from fastapi import FastAPI, Request
import joblib
import numpy as np
from stock_predict import predict_stock  # example import if you have a function

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "ML service running"}

@app.post("/predict")
async def get_prediction(request: Request):
    data = await request.json()
    input_data = data.get("input", [])
    # assuming predict_stock() handles model loading
    prediction = predict_stock(input_data)
    return {"prediction": prediction}
