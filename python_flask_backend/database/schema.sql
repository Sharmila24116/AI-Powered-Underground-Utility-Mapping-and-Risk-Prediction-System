-- MySQL Database Schema for Underground Utility Mapping & Risk Prediction System
CREATE DATABASE IF NOT EXISTS underground_utility_db;
USE underground_utility_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'engineer') DEFAULT 'engineer',
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Utilities Table
CREATE TABLE IF NOT EXISTS utilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    utility_type ENUM('water', 'gas', 'electric', 'fiber', 'sewer') NOT NULL,
    depth_meters FLOAT NOT NULL,
    coordinates_json TEXT NOT NULL,
    specs VARCHAR(100),
    material VARCHAR(80),
    soil_type VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Active',
    install_year INT,
    incident_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Predictions Table
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(150),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    planned_depth FLOAT NOT NULL,
    excavation_method VARCHAR(50),
    soil_type VARCHAR(50),
    overall_risk_score FLOAT NOT NULL,
    overall_risk_level ENUM('Low Risk', 'Medium Risk', 'High Risk') NOT NULL,
    recommended_depth FLOAT,
    ai_recommendations TEXT,
    created_by_user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_number VARCHAR(50) NOT NULL UNIQUE,
    prediction_id INT,
    status ENUM('Approved', 'Pending Review', 'Flagged Hazard', 'Completed') DEFAULT 'Approved',
    engineer_notes TEXT,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prediction_id) REFERENCES predictions(id) ON DELETE CASCADE
);

-- Initial Demo Users
INSERT INTO users (username, email, password_hash, role, department)
VALUES 
('admin_vance', 'admin@utilitymap.ai', 'scrypt:32768:8:1$hash_placeholder', 'admin', 'GIS Infrastructure Safety'),
('eng_jenkins', 'engineer@utilitymap.ai', 'scrypt:32768:8:1$hash_placeholder', 'engineer', 'Subterranean Excavation Risk')
ON DUPLICATE KEY UPDATE id=id;
