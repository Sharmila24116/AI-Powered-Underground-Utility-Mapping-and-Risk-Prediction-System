import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

def generate_synthetic_excavation_data(n_samples=2000):
    """
    Generates realistic synthetic data for training the Underground Excavation Risk ML Model.
    Features:
    - distance_to_utility (m)
    - planned_depth (m)
    - utility_depth (m)
    - depth_difference (m)
    - utility_type_code (0: sewer, 1: fiber, 2: water, 3: electric, 4: gas)
    - excavation_method_code (0: hand, 1: vacuum, 2: mini-digger, 3: heavy-excavator)
    - soil_type_code (0: clay, 1: loam, 2: sandy, 3: rocky)
    - historical_incidents
    Target:
    - risk_class (0: Low Risk, 1: Medium Risk, 2: High Risk)
    """
    np.random.seed(42)
    
    distance = np.random.exponential(scale=12.0, size=n_samples)
    distance = np.clip(distance, 0.1, 50.0)
    
    planned_depth = np.random.uniform(0.3, 4.0, size=n_samples)
    utility_depth = np.random.uniform(0.5, 3.5, size=n_samples)
    depth_diff = utility_depth - planned_depth
    
    utility_type = np.random.choice([0, 1, 2, 3, 4], size=n_samples, p=[0.2, 0.2, 0.25, 0.2, 0.15])
    method = np.random.choice([0, 1, 2, 3], size=n_samples, p=[0.15, 0.25, 0.35, 0.25])
    soil = np.random.choice([0, 1, 2, 3], size=n_samples)
    incidents = np.random.poisson(lam=0.5, size=n_samples)
    
    # Calculate continuous risk index score formula
    risk_score = (
        (100 * np.exp(-distance / 6.0)) * 0.45 +
        (np.where(depth_diff <= 0, 1.4, np.where(depth_diff <= 0.4, 1.1, 0.3))) * 25 +
        (utility_type * 4) +
        (method * 6) +
        (soil * 3) +
        (incidents * 5)
    )
    
    # Map score to classes: 0 (Low), 1 (Medium), 2 (High)
    risk_class = np.where(risk_score >= 65, 2, np.where(risk_score >= 35, 1, 0))
    
    df = pd.DataFrame({
        'distance_to_utility': distance,
        'planned_depth': planned_depth,
        'utility_depth': utility_depth,
        'depth_difference': depth_diff,
        'utility_type': utility_type,
        'excavation_method': method,
        'soil_type': soil,
        'historical_incidents': incidents,
        'risk_class': risk_class
    })
    
    return df

def train_and_save_model():
    print("Generating synthetic excavation training dataset...")
    df = generate_synthetic_excavation_data(2500)
    
    X = df.drop(columns=['risk_class'])
    y = df['risk_class']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier model...")
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf_model.fit(X_train, y_train)
    
    y_pred = rf_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Training Complete! Accuracy: {accuracy * 100:.2f}%")
    
    output_dir = os.path.dirname(__file__)
    model_path = os.path.join(output_dir, 'excavation_risk_rf_model.joblib')
    joblib.dump(rf_model, model_path)
    print(f"Saved Random Forest model artifact to: {model_path}")

if __name__ == '__main__':
    train_and_save_model()
