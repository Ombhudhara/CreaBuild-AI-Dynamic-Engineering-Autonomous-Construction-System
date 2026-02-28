import sys
import json
import joblib
import os
import warnings

warnings.filterwarnings("ignore")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'risk_model.pkl')
    importance_path = os.path.join(script_dir, 'feature_importance.json')

    clf = None
    importance = {}

    if os.path.exists(model_path):
        clf = joblib.load(model_path)
    if os.path.exists(importance_path):
        with open(importance_path, 'r') as f:
            importance = json.load(f)

    # Signal Node.js that the model is loaded into RAM and ready
    print("READY", flush=True)

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
            
        try:
            input_data = json.loads(line)
            
            if clf is None:
                print(json.dumps({"error": "Model not found. Run train_model.py first."}), flush=True)
                continue
                
            temp = float(input_data.get('temperature', 25))
            vib = float(input_data.get('vibration', 0.5))
            hum = float(input_data.get('humidity', 50))
            load = float(input_data.get('loadStress', 100))
            
            X = [[temp, vib, hum, load]]
            
            pred = clf.predict(X)[0]
            prob = clf.predict_proba(X)[0]
            confidence = float(max(prob)) * 100
            
            result = {
                "riskLevel": int(pred),
                "confidence": confidence,
                "probabilities": [float(p) for p in prob],
                "featureImportance": importance
            }
            
            print(json.dumps(result), flush=True)
        except Exception as e:
            print(json.dumps({"error": str(e)}), flush=True)

if __name__ == "__main__":
    main()
