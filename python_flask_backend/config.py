import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'terra-shield-secret-key-2026')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL', 
        'mysql+pymysql://root:password@localhost:3306/underground_utility_db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    REPORTS_FOLDER = os.path.join(os.path.dirname(__file__), 'reports')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB max limit
