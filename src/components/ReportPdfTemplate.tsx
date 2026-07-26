import React from 'react';
import { RiskPredictionResult } from '../types';

interface ReportPdfTemplateProps {
  prediction: RiskPredictionResult;
}

export const ReportPdfTemplate: React.FC<ReportPdfTemplateProps> = ({ prediction }) => {
  return (
    <div
      id="pdf-report-document"
      className="bg-white text-slate-900 p-8 max-w-4xl mx-auto space-y-6 font-sans text-xs border border-slate-200 shadow-2xl"
      style={{ width: '800px', minHeight: '1100px' }}
    >
      {/* Official Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              TerraShield GIS
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            Underground Infrastructure Safety & Excavation Risk Permit
          </p>
        </div>

        <div className="text-right space-y-0.5">
          <div className="text-sm font-bold font-mono text-slate-900">
            PERMIT #: EXC-2026-{(Math.random() * 9000 + 1000).toFixed(0)}
          </div>
          <div className="text-[10px] text-slate-500">
            Issued: {new Date(prediction.timestamp).toLocaleDateString()}
          </div>
          <div className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
            OFFICIAL DIGITAL PERMIT
          </div>
        </div>
      </div>

      {/* Excavation Site Metadata Grid */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Site Location</span>
          <strong className="text-slate-900 font-semibold">{prediction.locationName}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold">GPS Coordinates</span>
          <strong className="text-slate-900 font-mono">
            {prediction.latitude.toFixed(5)}°N, {prediction.longitude.toFixed(5)}°W
          </strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Planned Digging Depth</span>
          <strong className="text-slate-900 font-mono">{prediction.plannedDepthMeters} meters</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Excavation Machinery</span>
          <strong className="text-slate-900 font-semibold">
            {prediction.excavationMethod} ({prediction.equipmentWeightTons} Tons)
          </strong>
        </div>
      </div>

      {/* Risk Score Highlight Banner */}
      <div className="p-5 rounded-xl bg-slate-900 text-white flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-400 uppercase font-bold">Calculated ML Risk Index</div>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {prediction.overallRiskScore}% ({prediction.overallRiskLevel})
          </div>
        </div>

        <div className="text-right space-y-0.5">
          <div className="text-[10px] text-slate-400 font-bold">RECOMMENDED SAFE DIGGING DEPTH</div>
          <div className="text-xl font-black font-mono text-amber-400">
            {prediction.recommendedDiggingDepthMeters} meters
          </div>
          <div className="text-[10px] text-slate-300">Buffer Clearance: {prediction.safeBufferRadiusMeters}m</div>
        </div>
      </div>

      {/* Utility Breakdown Table */}
      <div className="space-y-2">
        <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">
          Detected Subterranean Utility Lines & Damage Probabilities
        </h4>
        <table className="w-full text-left border-collapse border border-slate-200">
          <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-700">
            <tr>
              <th className="border border-slate-200 px-3 py-2">Utility Line</th>
              <th className="border border-slate-200 px-3 py-2">Nearest Dist</th>
              <th className="border border-slate-200 px-3 py-2">Buried Depth</th>
              <th className="border border-slate-200 px-3 py-2">Damage Prob %</th>
              <th className="border border-slate-200 px-3 py-2">Action Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {prediction.utilityBreakdown.map((util, i) => (
              <tr key={i} className="border-t border-slate-200 text-[11px]">
                <td className="border border-slate-200 px-3 py-1.5 font-bold">{util.utilityName}</td>
                <td className="border border-slate-200 px-3 py-1.5 font-mono">{util.nearestDistanceMeters}m</td>
                <td className="border border-slate-200 px-3 py-1.5 font-mono">{util.utilityDepthMeters}m</td>
                <td className="border border-slate-200 px-3 py-1.5 font-mono font-bold text-red-600">
                  {util.damageProbability}%
                </td>
                <td className="border border-slate-200 px-3 py-1.5 text-[10px]">{util.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Reasoning Summary */}
      <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
        <div className="font-bold text-xs text-blue-900">Gemini AI Safety Analysis & Reasoning</div>
        <p className="text-[11px] leading-relaxed italic">{prediction.aiAnalysisText}</p>
      </div>

      {/* Safety Precautions Checklist */}
      <div className="space-y-1.5">
        <h4 className="font-bold text-xs uppercase text-slate-900 tracking-wider">
          Mandatory Safety Precautions & Field Protocol
        </h4>
        <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-700">
          {prediction.safetyPrecautions.map((pre, idx) => (
            <li key={idx}>{pre}</li>
          ))}
        </ul>
      </div>

      {/* Signatures */}
      <div className="pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-[11px]">
        <div>
          <div className="text-slate-500">Inspecting Field Engineer:</div>
          <div className="font-bold text-slate-900 mt-1">{prediction.engineerName}</div>
          <div className="text-[10px] text-slate-400">{prediction.engineerRole}</div>
          <div className="mt-4 border-b border-slate-400 w-48" />
          <div className="text-[9px] text-slate-400 mt-0.5">Signature & Stamp</div>
        </div>

        <div>
          <div className="text-slate-500">GIS Directorate Approval:</div>
          <div className="font-bold text-slate-900 mt-1">Marcus Vance</div>
          <div className="text-[10px] text-slate-400">Chief Safety Officer</div>
          <div className="mt-4 border-b border-slate-400 w-48" />
          <div className="text-[9px] text-slate-400 mt-0.5">Digital Clearance Token</div>
        </div>
      </div>
    </div>
  );
};
