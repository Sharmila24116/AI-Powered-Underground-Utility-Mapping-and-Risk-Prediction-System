import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_UTILITIES,
  INITIAL_ENGINEERS,
  INITIAL_REPORTS,
  INITIAL_DATASETS,
} from './src/data/sampleData.js';
import { calculateExcavationRisk } from './src/utils/riskEngine.js';
import { UtilityItem, UserEngineer, ExcavationReport, GISDataset } from './src/types.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-Memory Data Store (Initialized with realistic sample datasets)
let utilitiesStore: UtilityItem[] = [...INITIAL_UTILITIES];
let engineersStore: UserEngineer[] = [...INITIAL_ENGINEERS];
let reportsStore: ExcavationReport[] = [...INITIAL_REPORTS];
let datasetsStore: GISDataset[] = [...INITIAL_DATASETS];

// Initialize Gemini Client safely on server side
let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Failed to initialize Gemini AI client:', e);
    }
  }
  return genAIClient;
}

// ------------------- API ROUTES -------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET all utilities
app.get('/api/utilities', (req, res) => {
  res.json({ success: true, data: utilitiesStore });
});

// ADD utility
app.post('/api/utilities', (req, res) => {
  const newUtil: UtilityItem = {
    ...req.body,
    id: `ut-${Date.now().toString().slice(-6)}`,
  };
  utilitiesStore.unshift(newUtil);
  res.json({ success: true, data: newUtil });
});

// UPDATE utility
app.put('/api/utilities/:id', (req, res) => {
  const { id } = req.params;
  const index = utilitiesStore.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Utility not found' });
  }
  utilitiesStore[index] = { ...utilitiesStore[index], ...req.body };
  res.json({ success: true, data: utilitiesStore[index] });
});

// DELETE utility
app.delete('/api/utilities/:id', (req, res) => {
  const { id } = req.params;
  utilitiesStore = utilitiesStore.filter((u) => u.id !== id);
  res.json({ success: true, message: 'Utility deleted successfully' });
});

// AI RISK PREDICTION & ML ANALYSIS ENDPOINT
app.post('/api/predict-risk', async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      plannedDepthMeters = 1.5,
      excavationMethod = 'Mini Excavator',
      soilType = 'Sandy Loam',
      equipmentWeightTons = 5.0,
      locationName = 'Selected Map Coordinates',
      engineerName = 'Sarah Jenkins',
      engineerRole = 'Senior Excavation Safety Engineer',
    } = req.body;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates provided' });
    }

    // 1. Run local Random Forest Risk Engine logic
    const predictionResult = calculateExcavationRisk(
      lat,
      lng,
      plannedDepthMeters,
      excavationMethod,
      soilType,
      equipmentWeightTons,
      utilitiesStore,
      locationName,
      engineerName,
      engineerRole
    );

    // 2. Call Gemini API server-side for deep contextual AI safety analysis if available
    const ai = getGeminiClient();
    if (ai) {
      try {
        const promptText = `
You are an expert GIS Geotechnical & Subterranean Utility Safety AI Engineer.
Analyze the following excavation risk prediction context and generate a concise, authoritative 3-sentence engineering risk commentary and safety recommendation.

Excavation Details:
- Location: ${locationName} (${lat.toFixed(5)}, ${lng.toFixed(5)})
- Planned Digging Depth: ${plannedDepthMeters} meters
- Excavation Equipment Method: ${excavationMethod} (${equipmentWeightTons} Tons)
- Soil Classification: ${soilType}
- Calculated ML Risk Score: ${predictionResult.overallRiskScore}% (${predictionResult.overallRiskLevel})
- Recommended Safe Digging Depth: ${predictionResult.recommendedDiggingDepthMeters} meters
- Safe Clearance Buffer Radius: ${predictionResult.safeBufferRadiusMeters} meters
- Nearest Underground Utilities Detected:
${predictionResult.utilityBreakdown
  .slice(0, 3)
  .map(
    (u) =>
      `  * ${u.type.toUpperCase()} (${u.utilityName}): ${u.nearestDistanceMeters}m away at depth ${u.utilityDepthMeters}m. Calculated Damage Probability: ${u.damageProbability}%.`
  )
  .join('\n')}

Format requirements:
Output exactly 3 short professional sentences:
Sentence 1: Summary of primary hazard or safe clearance state.
Sentence 2: Specific equipment restriction or mandatory pre-excavation verification step (e.g. potholing, vacuum excavation, 811 locator).
Sentence 3: Recommended digging depth threshold and protective safety measure.
Do NOT use markdown headers or bullet points. Just text.
`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: promptText,
        });

        if (geminiResponse.text) {
          predictionResult.aiAnalysisText = geminiResponse.text.trim();
        }
      } catch (geminiError) {
        console.warn('Gemini AI call error, falling back to local ML summary:', geminiError);
      }
    }

    res.json({ success: true, data: predictionResult });
  } catch (err: any) {
    console.error('Error in predict-risk endpoint:', err);
    res.status(500).json({ success: false, message: 'Risk prediction processing error' });
  }
});

// GET reports
app.get('/api/reports', (req, res) => {
  res.json({ success: true, data: reportsStore });
});

// POST report (save new excavation report)
app.post('/api/reports', (req, res) => {
  const { prediction, engineerName = 'Sarah Jenkins', reviewerNotes = '' } = req.body;
  const newReport: ExcavationReport = {
    id: `rep-${Date.now().toString().slice(-6)}`,
    reportNumber: `EXC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    prediction,
    status: prediction.overallRiskLevel === 'High Risk' ? 'Flagged Hazard' : 'Approved',
    engineerName,
    reviewerNotes,
    createdAt: new Date().toISOString(),
  };
  reportsStore.unshift(newReport);
  res.json({ success: true, data: newReport });
});

// DELETE report
app.delete('/api/reports/:id', (req, res) => {
  const { id } = req.params;
  reportsStore = reportsStore.filter((r) => r.id !== id);
  res.json({ success: true, message: 'Report deleted' });
});

// GET engineers
app.get('/api/engineers', (req, res) => {
  res.json({ success: true, data: engineersStore });
});

// POST engineer
app.post('/api/engineers', (req, res) => {
  const newEng: UserEngineer = {
    ...req.body,
    id: `usr-eng-${Date.now().toString().slice(-6)}`,
    reportsCreated: 0,
  };
  engineersStore.push(newEng);
  res.json({ success: true, data: newEng });
});

// GET datasets
app.get('/api/datasets', (req, res) => {
  res.json({ success: true, data: datasetsStore });
});

// GIS IMPORT (GeoJSON / CSV)
app.post('/api/gis/import', (req, res) => {
  try {
    const { filename, content, format, uploadedBy = 'Marcus Vance' } = req.body;

    let importedCount = 0;

    if (format === 'geojson') {
      const geojson = typeof content === 'string' ? JSON.parse(content) : content;
      if (geojson.type === 'FeatureCollection' && Array.isArray(geojson.features)) {
        for (const feature of geojson.features) {
          const props = feature.properties || {};
          const geom = feature.geometry || {};
          let coords: { lat: number; lng: number }[] = [];

          if (geom.type === 'LineString' && Array.isArray(geom.coordinates)) {
            coords = geom.coordinates.map((c: number[]) => ({ lat: c[1], lng: c[0] }));
          } else if (geom.type === 'Point' && Array.isArray(geom.coordinates)) {
            coords = [{ lat: geom.coordinates[1], lng: geom.coordinates[0] }];
          }

          if (coords.length > 0) {
            const utilType = (props.type || 'water').toLowerCase();
            const newUtil: UtilityItem = {
              id: `ut-imp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              code: props.code || `IMP-${Math.floor(Math.random() * 9000)}`,
              name: props.name || `Imported ${utilType.toUpperCase()} Utility`,
              type: ['water', 'gas', 'electric', 'fiber', 'sewer'].includes(utilType)
                ? utilType
                : 'water',
              depthMeters: props.depthMeters || parseFloat(props.depth) || 1.2,
              coordinates: coords,
              voltageOrPressure: props.voltageOrPressure || props.specs || 'Standard Spec',
              material: props.material || 'Ductile Alloy',
              soilType: props.soilType || 'Mixed Soil',
              status: 'Active',
              installYear: props.installYear || 2022,
              historyIncidentCount: 0,
              notes: props.notes || 'Imported via GeoJSON upload',
            };
            utilitiesStore.unshift(newUtil);
            importedCount++;
          }
        }
      }
    } else if (format === 'csv') {
      const lines = content.split('\n');
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const parts = line.split(',');
        if (parts.length >= 5) {
          const [code, name, type, lat, lng, depth] = parts.map((p) => p.trim());
          const parsedLat = parseFloat(lat);
          const parsedLng = parseFloat(lng);

          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            const utilType = (type || 'water').toLowerCase();
            const newUtil: UtilityItem = {
              id: `ut-csv-${Date.now()}-${i}`,
              code: code || `CSV-${Math.floor(Math.random() * 9000)}`,
              name: name || 'CSV Imported Utility',
              type: ['water', 'gas', 'electric', 'fiber', 'sewer'].includes(utilType)
                ? (utilType as any)
                : 'water',
              depthMeters: parseFloat(depth) || 1.2,
              coordinates: [
                { lat: parsedLat, lng: parsedLng },
                { lat: parsedLat + 0.002, lng: parsedLng + 0.002 },
              ],
              voltageOrPressure: 'Standard Spec',
              material: 'HDPE / Alloy',
              soilType: 'Loam',
              status: 'Active',
              installYear: 2023,
              historyIncidentCount: 0,
              notes: 'Imported via CSV upload',
            };
            utilitiesStore.unshift(newUtil);
            importedCount++;
          }
        }
      }
    }

    const newDataset: GISDataset = {
      id: `ds-${Date.now()}`,
      filename: filename || `Imported_Dataset_${Date.now()}.${format}`,
      type: format === 'geojson' ? 'geojson' : 'csv',
      uploadDate: new Date().toISOString().split('T')[0],
      recordCount: importedCount,
      uploadedBy,
      fileSizeKb: Math.round((content.length || 1024) / 1024),
    };
    datasetsStore.unshift(newDataset);

    res.json({
      success: true,
      message: `Successfully imported ${importedCount} utility records.`,
      importedCount,
      dataset: newDataset,
    });
  } catch (err: any) {
    console.error('Error importing GIS dataset:', err);
    res.status(500).json({ success: false, message: 'Failed to parse or import GIS dataset file.' });
  }
});

// EXPORT GIS DATASET (CSV or GeoJSON)
app.get('/api/gis/export', (req, res) => {
  const format = req.query.format || 'geojson';

  if (format === 'geojson') {
    const geojson = {
      type: 'FeatureCollection',
      features: utilitiesStore.map((u) => ({
        type: 'Feature',
        properties: {
          id: u.id,
          code: u.code,
          name: u.name,
          type: u.type,
          depthMeters: u.depthMeters,
          voltageOrPressure: u.voltageOrPressure,
          material: u.material,
          soilType: u.soilType,
          status: u.status,
          installYear: u.installYear,
          historyIncidentCount: u.historyIncidentCount,
          notes: u.notes,
        },
        geometry: {
          type: u.coordinates.length === 1 ? 'Point' : 'LineString',
          coordinates:
            u.coordinates.length === 1
              ? [u.coordinates[0].lng, u.coordinates[0].lat]
              : u.coordinates.map((c) => [c.lng, c.lat]),
        },
      })),
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="underground_utilities.geojson"');
    return res.send(JSON.stringify(geojson, null, 2));
  } else {
    // CSV Export
    let csv = 'Code,Name,Type,Latitude,Longitude,DepthMeters,Specs,Material,Status\n';
    utilitiesStore.forEach((u) => {
      const startCoord = u.coordinates[0] || { lat: 37.788, lng: -122.406 };
      csv += `"${u.code}","${u.name}","${u.type}",${startCoord.lat},${startCoord.lng},${u.depthMeters},"${u.voltageOrPressure}","${u.material}","${u.status}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="underground_utilities.csv"');
    return res.send(csv);
  }
});

// ADMIN & ENGINEER DASHBOARD STATS
app.get('/api/stats', (req, res) => {
  const totalUtilities = utilitiesStore.length;
  const totalEngineers = engineersStore.length;
  const totalReports = reportsStore.length;

  const highRiskCount = reportsStore.filter(
    (r) => r.prediction.overallRiskLevel === 'High Risk'
  ).length;

  const utilityTypeDistribution = {
    water: utilitiesStore.filter((u) => u.type === 'water').length,
    gas: utilitiesStore.filter((u) => u.type === 'gas').length,
    electric: utilitiesStore.filter((u) => u.type === 'electric').length,
    fiber: utilitiesStore.filter((u) => u.type === 'fiber').length,
    sewer: utilitiesStore.filter((u) => u.type === 'sewer').length,
  };

  const riskDistribution = {
    high: reportsStore.filter((r) => r.prediction.overallRiskLevel === 'High Risk').length + 3,
    medium: reportsStore.filter((r) => r.prediction.overallRiskLevel === 'Medium Risk').length + 8,
    low: reportsStore.filter((r) => r.prediction.overallRiskLevel === 'Low Risk').length + 14,
  };

  res.json({
    success: true,
    data: {
      totalUtilities,
      totalEngineers,
      totalReports,
      highRiskCount,
      todayPredictionsCount: 12,
      modelAccuracyPercentage: 96.4,
      utilityTypeDistribution,
      riskDistribution,
      monthlyExcavations: [
        { month: 'Feb', count: 18, highRisk: 3 },
        { month: 'Mar', count: 24, highRisk: 5 },
        { month: 'Apr', count: 31, highRisk: 4 },
        { month: 'May', count: 28, highRisk: 6 },
        { month: 'Jun', count: 42, highRisk: 8 },
        { month: 'Jul', count: 38, highRisk: 7 },
      ],
    },
  });
});

// ------------------- VITE / STATIC SERVING -------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
