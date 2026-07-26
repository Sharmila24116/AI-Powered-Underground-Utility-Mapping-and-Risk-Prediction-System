import React from 'react';
import { User, Shield, Building, MapPin, CheckCircle, Cpu, Radio, Award } from 'lucide-react';
import { UserEngineer } from '../types';

interface ProfileViewProps {
  currentUser: UserEngineer;
  onSwitchRole: (role: 'admin' | 'engineer') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, onSwitchRole }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4">
      {/* Profile Card Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl object-cover border-4 border-cyan-500/50 shadow-xl"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span className="capitalize">{currentUser.role} Account</span>
            </div>

            <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
            <p className="text-xs text-slate-300 font-medium">{currentUser.email}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-blue-400" />
                {currentUser.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {currentUser.assignedZone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          Switch System Role (Demo Simulation)
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Toggle between Administrator and Field Engineer roles to test permissions and UI perspectives.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={() => onSwitchRole('engineer')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              currentUser.role === 'engineer'
                ? 'border-cyan-500 bg-cyan-500/10 text-slate-900 dark:text-white'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-bold text-sm flex items-center justify-between">
              <span>Licensed Field Engineer</span>
              {currentUser.role === 'engineer' && <CheckCircle className="w-4 h-4 text-cyan-500" />}
            </div>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              Run AI risk predictions, drop interactive GIS pins, and download signed PDF permits.
            </p>
          </button>

          <button
            onClick={() => onSwitchRole('admin')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              currentUser.role === 'admin'
                ? 'border-blue-600 bg-blue-600/10 text-slate-900 dark:text-white'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="font-bold text-sm flex items-center justify-between">
              <span>GIS Administrator</span>
              {currentUser.role === 'admin' && <CheckCircle className="w-4 h-4 text-blue-600" />}
            </div>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
              Full admin rights: Add/delete utility pipeline records, manage engineers, and upload GeoJSON/CSV datasets.
            </p>
          </button>
        </div>
      </div>

      {/* Backend & AI System Health */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          System Integration & API Connection Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div>
              <div className="font-bold text-slate-200">Express API Server</div>
              <div className="text-[10px] text-emerald-400">Port 3000 Active</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <div>
              <div className="font-bold text-slate-200">Gemini 3.6 AI</div>
              <div className="text-[10px] text-cyan-400">Server-Side Proxy Ready</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-3">
            <Award className="w-4 h-4 text-amber-400" />
            <div>
              <div className="font-bold text-slate-200">Random Forest ML</div>
              <div className="text-[10px] text-amber-400">RF-100 Classifier Ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
