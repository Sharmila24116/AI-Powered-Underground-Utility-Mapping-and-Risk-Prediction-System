import React from 'react';
import {
  MapPin,
  ShieldCheck,
  Cpu,
  FileCheck,
  ArrowRight,
  Radio,
  Zap,
  Flame,
  Droplets,
  Wifi,
  CornerDownRight,
  Award,
  CheckCircle,
  Building2,
  HardHat,
  Search,
  Activity,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-6 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_60%)]"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>AI-Powered Underground Utility GIS & Excavation Safety</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Prevent Utility Strikes Before You Dig With{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Predictive AI & GIS
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              An enterprise subterranean mapping system that combines interactive Leaflet GIS vector layers, Random Forest risk modeling, and Gemini AI reasoning to detect buried water, gas, power, fiber, and sewer infrastructure.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => onNavigate('map')}
                className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
              >
                <MapPin className="w-4 h-4" />
                <span>Launch Interactive Map</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('predictor')}
                className="flex items-center gap-2 px-6 py-3.5 bg-slate-800/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700/80 rounded-xl transition-all hover:scale-[1.02]"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Run AI Risk Calculator</span>
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
              <div>
                <div className="text-xl sm:text-2xl font-black text-cyan-400">99.2%</div>
                <div className="text-slate-400 text-[11px] font-medium">Utility Line Detection</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400">&lt;2.0s</div>
                <div className="text-slate-400 text-[11px] font-medium">ML Risk Computation</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-indigo-400">100%</div>
                <div className="text-slate-400 text-[11px] font-medium">OSHA / 811 Compliant</div>
              </div>
            </div>
          </div>

          {/* Subterranean Radar Layer Graphical Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl space-y-3 overflow-hidden">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-2 text-cyan-400">
                  <Radio className="w-4 h-4 animate-spin" />
                  Subterranean Layer Radar Scan
                </span>
                <span className="text-[10px] text-slate-400 font-mono">LAT: 37.7882 | LNG: -122.3980</span>
              </div>

              {/* Utility Layers Cross Section Graphic */}
              <div className="space-y-2 py-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs">
                  <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-blue-200 flex justify-between">
                      <span>Water Main Trunk (WTR-7701)</span>
                      <span className="text-blue-400 font-mono">1.8m Depth</span>
                    </div>
                    <div className="text-[10px] text-slate-400">120 PSI • Ductile Iron • Safe Clearance</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/50 text-xs shadow-lg shadow-amber-950/30">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-amber-200 flex justify-between">
                      <span>High-Pressure Gas Trunk (GAS-9901)</span>
                      <span className="text-amber-400 font-mono font-bold">0.9m Depth</span>
                    </div>
                    <div className="text-[10px] text-amber-300/80 font-medium">
                      ⚠️ CRITICAL HIGH RISK: Pothole & vacuum dig only
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs">
                  <Zap className="w-4 h-4 text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-red-200 flex justify-between">
                      <span>115kV Power Feeder (ELE-3301)</span>
                      <span className="text-red-400 font-mono">1.1m Depth</span>
                    </div>
                    <div className="text-[10px] text-slate-400">High Voltage Concrete Duct • Dielectric Required</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
                  <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-emerald-200 flex justify-between">
                      <span>Trans-Pacific Fiber Ring (FBR-1101)</span>
                      <span className="text-emerald-400 font-mono">0.6m Depth</span>
                    </div>
                    <div className="text-[10px] text-slate-400">800 Gbps Backbone • Micro-Duct HDPE</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Calculated Risk Score: <strong className="text-red-400 font-bold">82% (High Risk)</strong></span>
                <span className="text-cyan-400 font-medium">Safe Depth: 0.8m</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4-Step Workflow) */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            How The Subterranean AI Platform Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            From GIS spatial coordinate querying to machine learning hazard risk scores and instant digital excavation permit generation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              GIS Map Query
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drop an excavation pin or input GPS latitude/longitude coordinates on the interactive Leaflet map to inspect subterranean utility lines.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-500" />
              Proximity Scan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Spatial algorithms calculate point-to-polyline minimum distances across water, gas, power, telecom, and sewer network lines.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              Random Forest ML & Gemini AI
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              ML models evaluate depth difference, soil type, and excavation equipment weight to output a precise Risk Index % and safe depth.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              PDF Permit Generation
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Export professional signed excavation permits complete with location map snapshots, required PPE, and safe digging guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* Utility Color Standards & Capabilities */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">APWA Standard Utility Color Mapping</h3>
            <p className="text-xs text-slate-400">American Public Works Association (APWA) uniform color code protocol</p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Open Map Layer Controls →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Droplets className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-xs text-blue-300">Water Pipeline</div>
            <div className="text-[11px] text-slate-400">Potable Water Mains & Service Lines</div>
          </div>

          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-yellow-500 mx-auto flex items-center justify-center shadow-lg shadow-yellow-500/50">
              <Flame className="w-4 h-4 text-black font-bold" />
            </div>
            <div className="font-bold text-xs text-yellow-300">Gas Pipeline</div>
            <div className="text-[11px] text-slate-400">High-Pressure Gas & Petroleum Lines</div>
          </div>

          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-red-500 mx-auto flex items-center justify-center shadow-lg shadow-red-500/50">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-xs text-red-300">Electric Cable</div>
            <div className="text-[11px] text-slate-400">High Voltage Transmission & Feeder Ducts</div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/50">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-xs text-emerald-300">Fiber Optic</div>
            <div className="text-[11px] text-slate-400">Telecommunications & Optical Backbone</div>
          </div>

          <div className="p-4 rounded-xl bg-amber-900/30 border border-amber-700/40 text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-700 mx-auto flex items-center justify-center shadow-lg shadow-amber-700/50">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="font-bold text-xs text-amber-200">Sewer Line</div>
            <div className="text-[11px] text-slate-400">Sanitary Trunk & Stormwater Interceptors</div>
          </div>
        </div>
      </section>

      {/* Real World Applications */}
      <section className="space-y-6">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Real-World Industry Applications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <HardHat className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Municipal Trenching & Roadwork</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Provides city engineers with instant subterranean visibility during road widenings, pipe retrofits, and sidewalk repaving projects.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Wifi className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">5G & Fiber Backbone Expansion</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Prevents costly multi-million dollar fiber optic cuts during directional drilling and micro-trenching for urban broadband expansion.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Pipeline Damage Prevention</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Eliminates catastrophic gas explosion hazards by enforcing non-destructive vacuum excavation buffer zones around high-pressure lines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
