export type UtilityType = 'water' | 'gas' | 'electric' | 'fiber' | 'sewer';

export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk';

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface UtilityItem {
  id: string;
  code: string;
  name: string;
  type: UtilityType;
  depthMeters: number; // depth below surface in meters
  coordinates: LatLngPoint[]; // Polyline or path
  voltageOrPressure: string; // e.g. "115kV", "60 PSI", "100 Gbps", "12-inch Trunk"
  material: string; // e.g. "Ductile Iron", "Steel", "HDPE", "Copper", "Concrete"
  soilType: string;
  status: 'Active' | 'Under Maintenance' | 'Decommissioned' | 'Proposed';
  installYear: number;
  historyIncidentCount: number;
  notes?: string;
  diameterMm?: number;
}

export interface UtilityRiskDetail {
  type: UtilityType;
  utilityName: string;
  utilityCode: string;
  nearestDistanceMeters: number;
  utilityDepthMeters: number;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  damageProbability: number; // 0 - 100%
  recommendation: string;
}

export interface RiskPredictionResult {
  id: string;
  locationName: string;
  latitude: number;
  longitude: number;
  plannedDepthMeters: number;
  excavationMethod: string; // e.g. "Heavy Excavator", "Mini Excavator", "Vacuum Excavation", "Hand Digging"
  soilType: string; // "Clay", "Sandy", "Rocky", "Loam"
  equipmentWeightTons: number;
  overallRiskScore: number; // 0 - 100
  overallRiskLevel: RiskLevel;
  recommendedDiggingDepthMeters: number;
  safeBufferRadiusMeters: number;
  utilityBreakdown: UtilityRiskDetail[];
  safetyPrecautions: string[];
  aiAnalysisText: string;
  timestamp: string;
  engineerName: string;
  engineerRole: string;
}

export interface ExcavationReport {
  id: string;
  reportNumber: string;
  prediction: RiskPredictionResult;
  status: 'Approved' | 'Pending Review' | 'Flagged Hazard' | 'Completed';
  engineerName: string;
  reviewerNotes?: string;
  createdAt: string;
}

export interface UserEngineer {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer';
  department: string;
  assignedZone: string;
  reportsCreated: number;
  avatarUrl?: string;
}

export interface GISDataset {
  id: string;
  filename: string;
  type: 'csv' | 'geojson';
  uploadDate: string;
  recordCount: number;
  uploadedBy: string;
  fileSizeKb: number;
}

export interface LocationPreset {
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
}
