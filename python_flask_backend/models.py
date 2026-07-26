from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='engineer') # 'admin' or 'engineer'
    department = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Utility(db.Model):
    __tablename__ = 'utilities'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(150), nullable=False)
    utility_type = db.Column(db.String(30), nullable=False) # water, gas, electric, fiber, sewer
    depth_meters = db.Column(db.Float, nullable=False)
    coordinates_json = db.Column(db.Text, nullable=False) # JSON array of [{lat, lng}]
    specs = db.Column(db.String(100)) # e.g. 115kV, 250 PSI
    material = db.Column(db.String(80))
    soil_type = db.Column(db.String(50))
    status = db.Column(db.String(30), default='Active')
    install_year = db.Column(db.Integer)
    incident_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Prediction(db.Model):
    __tablename__ = 'predictions'
    id = db.Column(db.Integer, primary_key=True)
    location_name = db.Column(db.String(150))
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    planned_depth = db.Column(db.Float, nullable=False)
    excavation_method = db.Column(db.String(50))
    soil_type = db.Column(db.String(50))
    overall_risk_score = db.Column(db.Float, nullable=False)
    overall_risk_level = db.Column(db.String(20), nullable=False) # Low Risk, Medium Risk, High Risk
    recommended_depth = db.Column(db.Float)
    ai_recommendations = db.Column(db.Text)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    report_number = db.Column(db.String(50), unique=True, nullable=False)
    prediction_id = db.Column(db.Integer, db.ForeignKey('predictions.id'))
    status = db.Column(db.String(30), default='Approved')
    engineer_notes = db.Column(db.Text)
    file_path = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
