import joblib
import pandas as pd
import os

MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "fire_model.pkl"
)

model = joblib.load(MODEL_PATH)

def predict_fire(temp, humidity, wind, rain):

    data = pd.DataFrame({
        "temp": [temp],
        "RH": [humidity],
        "wind": [wind],
        "rain": [rain]
    })

    probability = float(model.predict_proba(data)[0][1])

    print("INPUT:", temp, humidity, wind, rain)
    print("PROBABILITY:", probability)

    if probability < 0.3:
        risk = "LOW"
    elif probability < 0.7:
        risk = "MEDIUM"
    else:
        risk = "HIGH"

    return round(probability * 100, 2), risk