from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from config import Config
from models import db, User, Utility, Prediction, Report
import os

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return jsonify({
        "system": "AI-Powered Underground Utility Mapping and Risk Prediction API",
        "status": "online",
        "version": "1.0.0"
    })

@app.route('/api/utilities', methods=['GET'])
def get_utilities():
    utilities = Utility.query.all()
    return jsonify([{
        'id': u.id,
        'code': u.code,
        'name': u.name,
        'type': u.utility_type,
        'depthMeters': u.depth_meters,
        'specs': u.specs,
        'material': u.material,
        'soilType': u.soil_type,
        'status': u.status
    } for u in utilities])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
