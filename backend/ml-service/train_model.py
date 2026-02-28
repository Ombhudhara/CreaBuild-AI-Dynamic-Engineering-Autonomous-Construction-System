import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import json
import os

# Set paths
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, 'risk_model.pkl')
importance_path = os.path.join(script_dir, 'feature_importance.json')

# 1. Generate synthetic dataset
np.random.seed(42)
n_samples = 1500

print("Generating synthetic dataset...")
temperature = np.random.normal(25, 5, n_samples)
vibration = np.random.exponential(0.5, n_samples)
humidity = np.random.normal(50, 10, n_samples)
loadStress = np.random.normal(100, 20, n_samples)

riskLevel = np.zeros(n_samples, dtype=int)

for i in range(n_samples):
    vib = vibration[i]
    load = loadStress[i]
    if vib > 2.0 or load > 150:
        riskLevel[i] = 2 # High Risk
    elif vib > 1.0 or load > 130:
        riskLevel[i] = 1 # Medium Risk
    else:
        riskLevel[i] = 0 # Low Risk

df = pd.DataFrame({
    'temperature': temperature,
    'vibration': vibration,
    'humidity': humidity,
    'loadStress': loadStress,
    'riskLevel': riskLevel
})

X = df[['temperature', 'vibration', 'humidity', 'loadStress']]
y = df['riskLevel']

print(f"Dataset generated. Shape: {df.shape}")
print("Training Random Forest Classifier...")
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X, y)

print("Training complete. Saving model...")
# Save the model
joblib.dump(clf, model_path)

# Save feature importance for frontend
importance = clf.feature_importances_
importance_dict = {
    'temperature': float(importance[0]),
    'vibration': float(importance[1]),
    'humidity': float(importance[2]),
    'loadStress': float(importance[3])
}

with open(importance_path, 'w') as f:
    json.dump(importance_dict, f, indent=4)

print("============ DONE ============")
print("✅ Model (risk_model.pkl) and Feature Importance (feature_importance.json) saved successfully in ml-service directory!")
