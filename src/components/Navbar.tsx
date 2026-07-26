import React, { useState } from 'react';
import {
  ShieldAlert,
  Map,
  Activity,
  Layers,
  Users,
  FileText,
  Home,
  BookOpen,
  Bell,
  Sun,
  Moon,
  UserCheck,
  ChevronDown,
  Search,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { UserEngineer } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserEngineer;
  setCurrentUser: (user: UserEngineer) => void;
  allEngineers: UserEngineer[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  highRiskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  allEngineers,
  isDarkMode,
  setIsDarkMode,
  highRiskCount,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Interactive Map', icon: Map },
    { id: 'predictor', label: 'AI Risk Predictor', icon: Activity },
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'utilities', label: 'Utility Manager', icon: Layers },
    { id: 'reports', label: 'Excavation Reports', icon: FileText },
    ...(currentUser.role === 'admin'
      ? [{ id: 'engineers', label: 'Engineers', icon: Users }]
      : []),
    { id: 'docs', label: 'Flask & System Docs', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1e293b] border-b border-[#334155] text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                  GEOSCAN<span className="text-blue-500">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md">
                  GIS v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none hidden sm:block">
                Underground Utility & Risk Mapping
              </p>
            </div>
          </div>

          {/* Nav Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Role Switcher, Alerts, Dark Mode, User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Hazard Alerts */}
            <div className="relative">
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Real-time Hazard Alerts"
              >
                <Bell className="w-4 h-4" />
                {highRiskCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                    {highRiskCount}
                  </span>
                )}
              </button>

              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Active Risk Alerts
                    </span>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                      {highRiskCount} High Risk
                    </span>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    <div className="p-2 rounded-lg bg-red-950/40 border border-red-800/40 text-xs">
                      <div className="font-semibold text-red-300 flex items-center justify-between">
                        <span>GAS-9901 Mission Line</span>
                        <span className="text-[10px] text-red-400">88% Risk</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        High-pressure gas trunk detected at 0.9m depth near Tech Campus. Machine digging restricted.
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-xs">
                      <div className="font-semibold text-amber-300 flex items-center justify-between">
                        <span>ELE-3301 High Voltage Feeder</span>
                        <span className="text-[10px] text-amber-400">52% Risk</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        115kV feeder conduit line nearby. Dielectric PPE and non-conductive hand digging required.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowAlertsDropdown(false);
                      setActiveTab('reports');
                    }}
                    className="w-full mt-2 text-center text-xs font-medium text-cyan-400 hover:text-cyan-300 pt-2 border-t border-slate-800"
                  >
                    View All Reports & History →
                  </button>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {/* Role / Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-medium text-slate-200 transition-colors"
              >
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold leading-tight">{currentUser.name}</div>
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-slate-200">Switch User Account / Role</p>
                    <p className="text-[10px] text-slate-400">Test platform from Admin or Engineer view</p>
                  </div>
                  <div className="py-1 space-y-1 max-h-56 overflow-y-auto">
                    {allEngineers.map((eng) => (
                      <button
                        key={eng.id}
                        onClick={() => {
                          setCurrentUser(eng);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                          currentUser.id === eng.id
                            ? 'bg-blue-600/30 text-white font-semibold border border-blue-500/40'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-200">{eng.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize">
                            {eng.role} • {eng.department.split(' ')[0]}
                          </div>
                        </div>
                        {currentUser.id === eng.id && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Scroll Navigation */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800 space-x-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 bg-slate-800/60 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
