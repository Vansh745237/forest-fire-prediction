import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score
)

# ==========================
# Load Dataset
# ==========================
df = pd.read_csv("forestfires.csv")

# Create target column
df["fire"] = (df["area"] > 0).astype(int)

# Features and Target
X = df[["temp", "RH", "wind", "rain"]]
y = df["fire"]

# ==========================
# Split Dataset
# ==========================
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# ==========================
# Train Model
# ==========================
model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# ==========================
# Predictions
# ==========================
preds = model.predict(X_test)
probs = model.predict_proba(X_test)[:, 1]

# ==========================
# Evaluation Metrics
# ==========================
accuracy = accuracy_score(y_test, preds)
precision = precision_score(y_test, preds)
recall = recall_score(y_test, preds)
f1 = f1_score(y_test, preds)
roc_auc = roc_auc_score(y_test, probs)

print("=" * 50)
print("FOREST FIRE PREDICTION MODEL RESULTS")
print("=" * 50)

print(f"Accuracy : {accuracy * 100:.2f}%")
print(f"Precision: {precision * 100:.2f}%")
print(f"Recall   : {recall * 100:.2f}%")
print(f"F1 Score : {f1 * 100:.2f}%")
print(f"ROC-AUC  : {roc_auc * 100:.2f}%")

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, preds))

print("\nClassification Report:")
print(classification_report(y_test, preds))

# ==========================
# Save Model
# ==========================
joblib.dump(model, "fire_model.pkl")

print("\nModel saved successfully as fire_model.pkl")