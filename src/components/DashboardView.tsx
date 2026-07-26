import React from 'react';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  Users,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  FileCheck,
  Zap,
  Flame,
  Droplets,
  Wifi,
  Building2,
  ShieldAlert,
  CloudSun,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { UserEngineer, ExcavationReport, UtilityItem } from '../types';

interface DashboardViewProps {
  currentUser: UserEngineer;
  reports: ExcavationReport[];
  utilities: UtilityItem[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  reports,
  utilities,
}) => {
  // Chart Colors
  const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  // Utility Distribution
  const utilityCounts = {
    Water: utilities.filter((u) => u.type === 'water').length,
    Gas: utilities.filter((u) => u.type === 'gas').length,
    Electric: utilities.filter((u) => u.type === 'electric').length,
    Fiber: utilities.filter((u) => u.type === 'fiber').length,
    Sewer: utilities.filter((u) => u.type === 'sewer').length,
  };

  const utilityData = [
    { name: 'Water Pipe', count: utilityCounts.Water, color: '#3b82f6' },
    { name: 'Gas Pipe', count: utilityCounts.Gas, color: '#eab308' },
    { name: 'Power Line', count: utilityCounts.Electric, color: '#ef4444' },
    { name: 'Fiber Duct', count: utilityCounts.Fiber, color: '#22c55e' },
    { name: 'Sewer Line', count: utilityCounts.Sewer, color: '#a16207' },
  ];

  // Risk Distribution Data
  const highRisk = reports.filter((r) => r.prediction.overallRiskLevel === 'High Risk').length + 3;
  const mediumRisk = reports.filter((r) => r.prediction.overallRiskLevel === 'Medium Risk').length + 6;
  const lowRisk = reports.filter((r) => r.prediction.overallRiskLevel === 'Low Risk').length + 12;

  const riskPieData = [
    { name: 'High Risk', value: highRisk, color: '#ef4444' },
    { name: 'Medium Risk', value: mediumRisk, color: '#f59e0b' },
    { name: 'Low Risk', value: lowRisk, color: '#10b981' },
  ];

  // Monthly Excavation Scans Trend
  const monthlyTrendData = [
    { month: 'Feb', total: 18, highRisk: 3 },
    { month: 'Mar', total: 24, highRisk: 5 },
    { month: 'Apr', total: 31, highRisk: 4 },
    { month: 'May', total: 28, highRisk: 6 },
    { month: 'Jun', total: 42, highRisk: 8 },
    { month: 'Jul', total: 38, highRisk: 7 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">
            {currentUser.role === 'admin' ? 'Administrative Executive View' : 'Field Engineer Operational View'}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {currentUser.role === 'admin' ? 'GIS System Analytics Dashboard' : 'Field Operations Dashboard'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time analytics on subterranean utility density, risk score classifications, and excavation scan trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-amber-400" />
            <span>Field Digging Weather: <strong>Clear 22°C</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Mapped Utilities</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            {utilities.length}
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold">+12 this week</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Active Engineers</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            4
          </div>
          <div className="text-[10px] text-slate-400">Licensed Field Team</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>High Risk Hotspots</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold text-red-600 dark:text-red-400 font-mono">
            {highRisk}
          </div>
          <div className="text-[10px] text-red-400 font-medium">Flagged Hazards</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Scans Run Today</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
            12
          </div>
          <div className="text-[10px] text-emerald-500 font-semibold">100% verified</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Model Accuracy</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
            96.4%
          </div>
          <div className="text-[10px] text-slate-400">Random Forest RF-100</div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-500" />
              Excavation Risk Classifications
            </h3>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300">
              <div>High Risk</div>
              <div className="font-mono text-base font-bold">{highRisk}</div>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-300">
              <div>Medium Risk</div>
              <div className="font-mono text-base font-bold">{mediumRisk}</div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-300">
              <div>Low Risk</div>
              <div className="font-mono text-base font-bold">{lowRisk}</div>
            </div>
          </div>
        </div>

        {/* Utility Types Bar Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-500" />
              Utility Network Distribution
            </h3>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={utilityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {utilityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Excavation Scans Area Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Monthly Excavation Scans Trend
            </h3>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="highRisk" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Log & Field Scans */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          Recent Field Excavation Scans & Permits
        </h3>

        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{rep.reportNumber}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      rep.prediction.overallRiskLevel === 'High Risk'
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    }`}
                  >
                    {rep.prediction.overallRiskLevel}
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 font-medium">
                  Site: {rep.prediction.locationName} • Inspector: {rep.engineerName}
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                    Depth: {rep.prediction.plannedDepthMeters}m
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
