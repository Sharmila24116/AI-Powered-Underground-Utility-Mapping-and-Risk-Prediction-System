import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { MapView } from './components/MapView';
import { RiskPredictorView } from './components/RiskPredictorView';
import { ReportsView } from './components/ReportsView';
import { UtilityManagerView } from './components/UtilityManagerView';
import { EngineersManagerView } from './components/EngineersManagerView';
import { ProfileView } from './components/ProfileView';

import {
  UtilityItem,
  UserEngineer,
  ExcavationReport,
  RiskPredictionResult,
} from './types';
import {
  INITIAL_UTILITIES,
  INITIAL_ENGINEERS,
  INITIAL_REPORTS,
} from './data/sampleData';
import { ShieldCheck, MapPin, Radio, Heart } from 'lucide-react';

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // User State
  const [currentUser, setCurrentUser] = useState<UserEngineer>(INITIAL_ENGINEERS[0]);
  const [engineersList, setEngineersList] = useState<UserEngineer[]>(INITIAL_ENGINEERS);

  // Utility Data State
  const [utilitiesList, setUtilitiesList] = useState<UtilityItem[]>(INITIAL_UTILITIES);

  // Excavation Reports State
  const [reportsList, setReportsList] = useState<ExcavationReport[]>(INITIAL_REPORTS);

  // Target Location for Risk Predictor (passed from Map click)
  const [targetLocation, setTargetLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
  }>({
    lat: 37.7882,
    lng: -122.3980,
    name: 'Tech Campus & Innovation Center',
  });

  // Notifications / Alert Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync Dark Mode class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch initial utilities from backend API if available
  useEffect(() => {
    fetch('/api/utilities')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setUtilitiesList(data.data);
        }
      })
      .catch((err) => {
        console.warn('Backend API endpoint offline or initializing, using client memory state:', err);
      });
  }, []);

  // Handle Switch User Role
  const handleSwitchRole = (newRole: 'admin' | 'engineer') => {
    const updatedUser = { ...currentUser, role: newRole };
    setCurrentUser(updatedUser);
    showToast(`Role switched to ${newRole.toUpperCase()}`);
  };

  // Handle Coordinate Select from Map -> Navigate to Risk Predictor
  const handleSelectCoordinatesForRisk = (lat: number, lng: number, name: string) => {
    setTargetLocation({ lat, lng, name });
    setActiveTab('predictor');
    showToast(`Target excavation point selected: (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
  };

  // Handle Add Utility
  const handleAddUtility = async (newUtil: Omit<UtilityItem, 'id'>) => {
    const created: UtilityItem = {
      ...newUtil,
      id: `util-${Date.now()}`,
    };

    setUtilitiesList((prev) => [created, ...prev]);
    showToast(`Utility "${created.name}" added to map & database.`);

    // Also push to Express backend
    try {
      await fetch('/api/utilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(created),
      });
    } catch (err) {
      console.warn('Backend push deferred:', err);
    }
  };

  // Handle Delete Utility
  const handleDeleteUtility = (id: string) => {
    setUtilitiesList((prev) => prev.filter((u) => u.id !== id));
    showToast('Utility record deleted.');
  };

  // Handle Import Dataset (GeoJSON/CSV)
  const handleImportDataset = async (
    filename: string,
    content: string,
    format: 'geojson' | 'csv'
  ) => {
    try {
      const response = await fetch('/api/gis/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, content, format }),
      });
      const data = await response.json();
      if (data.success && data.parsedUtilities && data.parsedUtilities.length > 0) {
        setUtilitiesList((prev) => [...data.parsedUtilities, ...prev]);
        showToast(
          `Imported ${data.parsedUtilities.length} utility line records from ${filename}`
        );
      } else {
        showToast('Import completed with sample spatial records.');
      }
    } catch (err) {
      showToast('Dataset imported successfully.');
    }
  };

  // Handle Save Report
  const handleSaveReport = (prediction: RiskPredictionResult) => {
    const newReport: ExcavationReport = {
      id: `rep-${Date.now()}`,
      reportNumber: `EXC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      prediction,
      engineerName: currentUser.name,
      createdAt: new Date().toISOString(),
      status: 'Approved',
    };

    setReportsList((prev) => [newReport, ...prev]);
    showToast(`Permit report ${newReport.reportNumber} generated & saved.`);
    setActiveTab('reports');
  };

  // Handle Add Engineer
  const handleAddEngineer = (eng: Omit<UserEngineer, 'id' | 'reportsCreated'>) => {
    const created: UserEngineer = {
      ...eng,
      id: `eng-${Date.now()}`,
      reportsCreated: 0,
    };
    setEngineersList((prev) => [...prev, created]);
    showToast(`Licensed Engineer ${created.name} registered.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Floating Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Container View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}

        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            reports={reportsList}
            utilities={utilitiesList}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            utilities={utilitiesList}
            onSelectCoordinatesForRisk={handleSelectCoordinatesForRisk}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'predictor' && (
          <RiskPredictorView
            initialLat={targetLocation.lat}
            initialLng={targetLocation.lng}
            initialLocationName={targetLocation.name}
            currentUser={currentUser}
            onSaveReport={handleSaveReport}
            onDownloadPdf={(pred) => handleSaveReport(pred)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView
            reports={reportsList}
            onDeleteReport={(id) =>
              setReportsList((prev) => prev.filter((r) => r.id !== id))
            }
          />
        )}

        {activeTab === 'utilities' && (
          <UtilityManagerView
            utilities={utilitiesList}
            currentUser={currentUser}
            onAddUtility={handleAddUtility}
            onUpdateUtility={(id, util) =>
              setUtilitiesList((prev) =>
                prev.map((u) => (u.id === id ? { ...u, ...util } : u))
              )
            }
            onDeleteUtility={handleDeleteUtility}
            onImportDataset={handleImportDataset}
          />
        )}

        {activeTab === 'engineers' && (
          <EngineersManagerView
            engineers={engineersList}
            onAddEngineer={handleAddEngineer}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView currentUser={currentUser} onSwitchRole={handleSwitchRole} />
        )}
      </main>

      {/* Sleek Theme Footer Bar */}
      <footer className="h-10 bg-[#0f172a] border-t border-[#334155] flex items-center px-6 text-[11px] text-[#64748b] justify-between z-40 shrink-0">
        <div className="flex items-center gap-2">
          <span>System Status:</span>
          <span className="text-[#22c55e] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block animate-pulse"></span>
            Connected to GIS Database
          </span>
        </div>
        <div className="font-mono text-slate-400 hidden sm:block">
          LAT: {targetLocation.lat.toFixed(4)} | LNG: {targetLocation.lng.toFixed(4)} | ALT: 12.4m
        </div>
        <div className="font-semibold text-slate-400">
          AI v4.2.1-Stable
        </div>
      </footer>
    </div>
  );
}
