import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

df = pd.read_csv("../data/forestfires.csv")

df["fire"] = (df["area"] > 0).astype(int)

X = df[["temp", "RH", "wind", "rain"]]
y = df["fire"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

preds = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, preds))

joblib.dump(model, "fire_model.pkl")

print("Model saved successfully")