import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  HardHat,
  Cpu,
  FileText,
  Download,
  Flame,
  Droplets,
  Zap,
  Wifi,
  Building2,
  Sparkles,
  RotateCcw,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { RiskPredictionResult, UtilityType, UserEngineer } from '../types';
import { SAMPLE_LOCATIONS } from '../data/sampleData';

interface RiskPredictorViewProps {
  initialLat?: number;
  initialLng?: number;
  initialLocationName?: string;
  currentUser: UserEngineer;
  onSaveReport: (prediction: RiskPredictionResult) => void;
  onDownloadPdf: (prediction: RiskPredictionResult) => void;
}

export const RiskPredictorView: React.FC<RiskPredictorViewProps> = ({
  initialLat = 37.7882,
  initialLng = -122.3980,
  initialLocationName = 'Tech Campus & Innovation Center',
  currentUser,
  onSaveReport,
  onDownloadPdf,
}) => {
  // Form Parameters
  const [locationName, setLocationName] = useState(initialLocationName);
  const [latitude, setLatitude] = useState(initialLat.toString());
  const [longitude, setLongitude] = useState(initialLng.toString());
  const [plannedDepth, setPlannedDepth] = useState(1.5);
  const [excavationMethod, setExcavationMethod] = useState('Mini Excavator');
  const [soilType, setSoilType] = useState('Sandy Loam');
  const [equipmentWeight, setEquipmentWeight] = useState(8.5);

  // Loading & Result States
  const [isLoading, setIsLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [predictionResult, setPredictionResult] = useState<RiskPredictionResult | null>(null);

  // Sync if initial props change
  useEffect(() => {
    setLatitude(initialLat.toString());
    setLongitude(initialLng.toString());
    if (initialLocationName) setLocationName(initialLocationName);
  }, [initialLat, initialLng, initialLocationName]);

  // Run AI Machine Learning Risk Engine API call
  const handleRunPrediction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setIsLoading(true);
    setProgressPercent(10);

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 200);

    try {
      const response = await fetch('/api/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          plannedDepthMeters: parseFloat(plannedDepth.toString()),
          excavationMethod,
          soilType,
          equipmentWeightTons: parseFloat(equipmentWeight.toString()),
          locationName,
          engineerName: currentUser.name,
          engineerRole: currentUser.department,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProgressPercent(100);
        setTimeout(() => {
          setPredictionResult(data.data);
          setIsLoading(false);
          clearInterval(interval);
        }, 300);
      } else {
        alert(data.message || 'Failed to calculate risk score.');
        setIsLoading(false);
        clearInterval(interval);
      }
    } catch (err) {
      console.error('Error running ML risk prediction:', err);
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  const getRiskBadgeClass = (level: string) => {
    if (level === 'High Risk') return 'status-badge-danger font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider';
    if (level === 'Medium Risk') return 'status-badge-warning font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider';
    return 'status-badge-success font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider';
  };

  const getUtilityIcon = (type: UtilityType) => {
    switch (type) {
      case 'water':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'gas':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'electric':
        return <Zap className="w-4 h-4 text-red-400" />;
      case 'fiber':
        return <Wifi className="w-4 h-4 text-emerald-400" />;
      case 'sewer':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      default:
        return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Random Forest ML & Gemini 3.6 AI Reasoning</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            AI Excavation Risk Predictor
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Simulate excavation depth, equipment weight, and soil parameters to predict damage probabilities across underground utility networks.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Preset Site:</span>
          <select
            onChange={(e) => {
              const preset = SAMPLE_LOCATIONS.find((l) => l.name === e.target.value);
              if (preset) {
                setLocationName(preset.name);
                setLatitude(preset.lat.toString());
                setLongitude(preset.lng.toString());
              }
            }}
            className="bg-slate-800 text-xs text-white border border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
          >
            {SAMPLE_LOCATIONS.map((loc) => (
              <option key={loc.name} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Parameters Input Form */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <HardHat className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              Excavation Site Parameters
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">Step 1 of 2</span>
          </div>

          <form onSubmit={handleRunPrediction} className="space-y-4">
            {/* Location Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Target Site Name / Description
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Latitude (°N)
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Longitude (°W)
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Planned Digging Depth */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Planned Digging Depth:</span>
                <span className="text-blue-600 dark:text-cyan-400 font-mono text-sm">
                  {plannedDepth} meters
                </span>
              </div>
              <input
                type="range"
                min="0.3"
                max="4.0"
                step="0.1"
                value={plannedDepth}
                onChange={(e) => setPlannedDepth(parseFloat(e.target.value))}
                className="w-full accent-blue-600 dark:accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Shallow (0.3m)</span>
                <span>Deep Trench (4.0m)</span>
              </div>
            </div>

            {/* Excavation Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Excavation Method / Machinery
              </label>
              <select
                value={excavationMethod}
                onChange={(e) => setExcavationMethod(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Heavy Excavator">Heavy Backhoe / Excavator (High Impact)</option>
                <option value="Mini Excavator">Mini Excavator (Medium Impact)</option>
                <option value="Vacuum Excavation">Vacuum / Hydro-Excavation (Non-Destructive)</option>
                <option value="Hand Digging">Hand Digging & Non-Conductive Shovels (Safest)</option>
              </select>
            </div>

            {/* Soil Type & Equipment Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Soil Classification
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Sandy Loam">Sandy Loam</option>
                  <option value="Heavy Clay">Heavy Clay</option>
                  <option value="Rocky / Gravel">Rocky / Gravel</option>
                  <option value="Compact Loam">Compact Loam</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Equipment Weight (Tons)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="35"
                  value={equipmentWeight}
                  onChange={(e) => setEquipmentWeight(parseFloat(e.target.value))}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Calculate AI Risk & Run Random Forest ML</span>
            </button>
          </form>

          {/* Loading Progress Bar */}
          {isLoading && (
            <div className="space-y-2 py-2">
              <div className="flex justify-between text-xs font-bold text-blue-600 dark:text-cyan-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 animate-spin" />
                  Scanning subterranean GIS layers & calculating risk...
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Prediction Output & Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {!predictionResult && !isLoading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400 shadow-xl space-y-3">
              <Activity className="w-12 h-12 mx-auto text-blue-500/40 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Ready To Compute Risk
              </h3>
              <p className="text-xs max-w-md mx-auto">
                Fill in the excavation depth, soil condition, and machinery parameters on the left, then click "Calculate AI Risk" to run the Random Forest ML prediction model.
              </p>
            </div>
          )}

          {predictionResult && (
            <div className="bg-[#0f172a] border border-[#334155] rounded-xl p-6 shadow-xl space-y-6">
              {/* Overall Risk Score Badge Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#1e293b] text-white shadow-lg border border-[#334155]">
                <div className="space-y-1">
                  <div className="text-[12px] text-slate-400 uppercase tracking-widest font-semibold">
                    OVERALL RISK FACTOR
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[48px] font-extrabold leading-none text-red-500">
                      {predictionResult.overallRiskScore}%
                    </span>
                    <span className={getRiskBadgeClass(predictionResult.overallRiskLevel)}>
                      {predictionResult.overallRiskLevel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Recommended Depth</span>
                    <strong className="text-blue-500 font-bold text-sm">
                      {predictionResult.recommendedDiggingDepthMeters}m Max
                    </strong>
                  </div>
                  <div className="h-8 w-px bg-[#334155]" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Safe Buffer Clearance</span>
                    <strong className="text-amber-400 font-bold text-sm">
                      {predictionResult.safeBufferRadiusMeters}m
                    </strong>
                  </div>
                </div>
              </div>

              {/* Utility Damage Probability Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center justify-between">
                  <span>Utility Damage Probability Breakdown</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    Distance decay & depth overlap matrix
                  </span>
                </h4>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-3 py-2.5">Utility Line</th>
                        <th className="px-3 py-2.5">Distance</th>
                        <th className="px-3 py-2.5">Buried Depth</th>
                        <th className="px-3 py-2.5">Damage Prob %</th>
                        <th className="px-3 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {predictionResult.utilityBreakdown.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="px-3 py-2.5 font-semibold flex items-center gap-2">
                            {getUtilityIcon(item.type)}
                            <div>
                              <div className="text-slate-900 dark:text-slate-100">{item.utilityName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{item.utilityCode}</div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 font-mono font-medium">
                            {item.nearestDistanceMeters}m
                          </td>
                          <td className="px-3 py-2.5 font-mono text-slate-600 dark:text-slate-400">
                            {item.utilityDepthMeters}m
                          </td>
                          <td className="px-3 py-2.5 font-mono font-bold">
                            <span
                              className={
                                item.damageProbability >= 70
                                  ? 'text-red-600 dark:text-red-400'
                                  : item.damageProbability >= 40
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-emerald-600 dark:text-emerald-400'
                              }
                            >
                              {item.damageProbability}%
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-bold text-[10px]">
                            <span
                              className={`px-2 py-0.5 rounded-md ${
                                item.riskLevel === 'High Risk'
                                  ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                                  : item.riskLevel === 'Medium Risk'
                                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              }`}
                            >
                              {item.riskLevel}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Gemini AI Engineering Analysis Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/90 to-slate-900 text-white border border-blue-800/60 shadow-lg space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Gemini AI Safety & Engineering Analysis</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed italic">
                  "{predictionResult.aiAnalysisText}"
                </p>
              </div>

              {/* Required Safety Precautions Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Mandatory Field Safety Precautions
                </h4>

                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {predictionResult.safetyPrecautions.map((pre, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pre}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => onSaveReport(predictionResult)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Save Excavation Permit</span>
                </button>

                <button
                  onClick={() => onDownloadPdf(predictionResult)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs rounded-xl border border-slate-700 shadow-md transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Signed PDF Report</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
