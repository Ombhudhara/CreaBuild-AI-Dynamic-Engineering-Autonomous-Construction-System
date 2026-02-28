import sys
import json
import joblib
import os

import warnings
warnings.filterwarnings("ignore")

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input data provided"}))
        return

    try:
        input_data = json.loads(sys.argv[1])
        
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, 'risk_model.pkl')
        importance_path = os.path.join(script_dir, 'feature_importance.json')
        
        if not os.path.exists(model_path):
            print(json.dumps({"error": "Model file not found. Please run train_model.py first."}))
            return

        clf = joblib.load(model_path)
        
        temp = float(input_data.get('temperature', 25))
        vib = float(input_data.get('vibration', 0.5))
        hum = float(input_data.get('humidity', 50))
        load = float(input_data.get('loadStress', 100))
        
        X = [[temp, vib, hum, load]]
        
        pred = clf.predict(X)[0]
        prob = clf.predict_proba(X)[0]
        confidence = float(max(prob)) * 100
        
        if os.path.exists(importance_path):
            with open(importance_path, 'r') as f:
                importance = json.load(f)
        else:
            importance = {}

        result = {
            "riskLevel": int(pred), # 0 (Low), 1 (Medium), 2 (High)
            "confidence": confidence,
            "probabilities": [float(p) for p in prob],
            "featureImportance": importance
        }
        
        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
