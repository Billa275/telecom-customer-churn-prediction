import os
import random
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import xgboost as xgb

app = Flask(__name__)
CORS(app)

# ----------------------------------------------------
# 1. Load Data
# ----------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, 'Balanced_Telco_Customer_Churn.csv')

if not os.path.exists(csv_path):
    csv_path = os.path.join(BASE_DIR, '..', 'Balanced_Telco_Customer_Churn.csv')

if not os.path.exists(csv_path):
    csv_path = os.path.join(BASE_DIR, 'data', 'Balanced_Telco_Customer_Churn.csv')

df = pd.read_csv(csv_path)

# Drop ID and clean TotalCharges
df.drop(['customerID'], axis=1, inplace=True, errors='ignore')
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df = df.dropna().reset_index(drop=True)

# Encode Target
df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})

# Separate features and target
X = df.drop('Churn', axis=1).copy()
y = df['Churn'].copy()

# Store feature order
feature_columns = list(X.columns)

# Encode all categorical text columns explicitly into integers
label_encoders = {}
for col in feature_columns:
    if X[col].dtype == object:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le
    else:
        X[col] = pd.to_numeric(X[col], errors='coerce').fillna(0.0)

# Ensure entire matrix is numeric float before scaling
X = X.astype(float)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Standard Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train XGBoost
xgb_model = xgb.XGBClassifier(eval_metric='logloss', random_state=42)
xgb_model.fit(X_train_scaled, y_train)

# ----------------------------------------------------
# 2. Q-Learning Table Setup
# ----------------------------------------------------
states = ['Low Risk', 'Medium Risk', 'High Risk']
actions = ['Do Nothing', 'Offer Discount', 'Call Customer']

rewards = {
    'Low Risk': [1.0, 0.5, -0.2],
    'Medium Risk': [0.0, 0.7, 0.6],
    'High Risk': [-1.0, 1.0, 1.2]
}

q_table = pd.DataFrame(np.zeros((len(states), len(actions))), index=states, columns=actions)
lr = 0.1
gamma = 0.9

for _ in range(1000):
    s = random.choice(states)
    a = random.choice(actions) if random.uniform(0, 1) < 0.1 else q_table.loc[s].idxmax()
    r = rewards[s][actions.index(a)]
    s_next = random.choice(states)
    q_table.loc[s, a] = (1 - lr) * q_table.loc[s, a] + lr * (r + gamma * q_table.loc[s_next].max())

# ----------------------------------------------------
# 3. Prediction API
# ----------------------------------------------------
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    sample_df = pd.DataFrame([data])
    
    # Reorder columns to match training set
    sample_df = sample_df[feature_columns]

    # Safely transform incoming values using saved LabelEncoders
    for col in feature_columns:
        if col in label_encoders:
            le = label_encoders[col]
            known = set(le.classes_)
            val = str(sample_df.at[0, col])
            sample_df.at[0, col] = le.transform([val])[0] if val in known else 0
        else:
            sample_df.at[0, col] = pd.to_numeric(sample_df.at[0, col], errors='coerce')

    sample_df = sample_df.astype(float).fillna(0.0)

    # Scale the single row
    sample_scaled = scaler.transform(sample_df)

    # Churn probability calculation
    prob = float(xgb_model.predict_proba(sample_scaled)[0][1])
    pred = "Yes" if prob >= 0.5 else "No"

    # Risk level categorization
    tenure_val = float(data.get('tenure', 0))
    if pred == "No":
        risk_level = "Low Risk"
    elif pred == "Yes" and tenure_val > 6:
        risk_level = "Medium Risk"
    else:
        risk_level = "High Risk"

    recommended_action = q_table.loc[risk_level].idxmax()

    return jsonify({
        'prediction': pred,
        'churn_probability': prob,
        'risk_level': risk_level,
        'recommended_strategy': recommended_action
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)