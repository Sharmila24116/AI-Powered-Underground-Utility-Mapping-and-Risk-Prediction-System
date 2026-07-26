import React, { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Droplets,
  Flame,
  Zap,
  Wifi,
  Building2,
} from 'lucide-react';
import { UtilityItem, UtilityType, UserEngineer } from '../types';

interface UtilityManagerViewProps {
  utilities: UtilityItem[];
  currentUser: UserEngineer;
  onAddUtility: (util: Omit<UtilityItem, 'id'>) => void;
  onUpdateUtility: (id: string, util: Partial<UtilityItem>) => void;
  onDeleteUtility: (id: string) => void;
  onImportDataset: (filename: string, content: string, format: 'geojson' | 'csv') => void;
}

export const UtilityManagerView: React.FC<UtilityManagerViewProps> = ({
  utilities,
  currentUser,
  onAddUtility,
  onUpdateUtility,
  onDeleteUtility,
  onImportDataset,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingUtility, setEditingUtility] = useState<UtilityItem | null>(null);

  // New Utility Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<UtilityType>('water');
  const [newDepth, setNewDepth] = useState('1.2');
  const [newLat, setNewLat] = useState('37.7882');
  const [newLng, setNewLng] = useState('-122.3980');
  const [newSpecs, setNewSpecs] = useState('Standard Spec');
  const [newMaterial, setNewMaterial] = useState('Ductile Alloy');
  const [newSoil, setNewSoil] = useState('Loam');

  // Import State
  const [importFormat, setImportFormat] = useState<'geojson' | 'csv'>('geojson');
  const [importText, setImportText] = useState('');
  const [importFilename, setImportFilename] = useState('New_GIS_Data.geojson');

  // Filtered utilities
  const filteredUtilities = utilities.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypeFilter === 'all' || u.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  // Handle Create Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(newLat);
    const lng = parseFloat(newLng);

    onAddUtility({
      code: newCode || `UT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName || 'New Utility Line',
      type: newType,
      depthMeters: parseFloat(newDepth) || 1.2,
      coordinates: [
        { lat, lng },
        { lat: lat + 0.002, lng: lng + 0.002 },
      ],
      voltageOrPressure: newSpecs,
      material: newMaterial,
      soilType: newSoil,
      status: 'Active',
      installYear: 2026,
      historyIncidentCount: 0,
    });

    setShowAddModal(false);
    setNewCode('');
    setNewName('');
  };

  // Handle File Upload Read
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFilename(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();
    const format = ext === 'csv' ? 'csv' : 'geojson';
    setImportFormat(format);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  // Submit Dataset Import
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return alert('Please upload or paste dataset content.');
    onImportDataset(importFilename, importText, importFormat);
    setShowImportModal(false);
    setImportText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            Underground Utility Registry & GIS Import
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage mapped water, gas, power, fiber, and sewer infrastructure. Import GeoJSON/CSV vector layers or export live dataset.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-xl text-cyan-300 flex items-center gap-2 transition-all"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload GeoJSON/CSV</span>
          </button>

          <a
            href="/api/gis/export?format=geojson"
            download="underground_utilities.geojson"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-xl text-slate-200 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export GeoJSON</span>
          </a>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Utility Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search utility code or name..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-600 dark:text-slate-300">Category:</span>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-medium outline-none"
          >
            <option value="all">All Utility Types</option>
            <option value="water">Water Pipelines</option>
            <option value="gas">Gas Pipelines</option>
            <option value="electric">Electric Cables</option>
            <option value="fiber">Fiber Optic</option>
            <option value="sewer">Sewer Lines</option>
          </select>
        </div>
      </div>

      {/* Utilities Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Code / Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Depth</th>
                <th className="px-4 py-3">Specs / Pressure</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Soil</th>
                <th className="px-4 py-3">Status</th>
                {currentUser.role === 'admin' && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredUtilities.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-semibold">
                    <div className="text-slate-900 dark:text-slate-100">{u.name}</div>
                    <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">{u.code}</div>
                  </td>
                  <td className="px-4 py-3 capitalize font-bold">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                      {u.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                    {u.depthMeters} m
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.voltageOrPressure}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.material}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{u.soilType}</td>
                  <td className="px-4 py-3 font-bold text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                      {u.status}
                    </span>
                  </td>
                  {currentUser.role === 'admin' && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDeleteUtility(u.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Utility Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add New Utility Record</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Utility Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. SOMA Water Branch Line"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Utility Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. WTR-8805"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">Category Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as UtilityType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="water">Water</option>
                    <option value="gas">Gas</option>
                    <option value="electric">Electric</option>
                    <option value="fiber">Fiber</option>
                    <option value="sewer">Sewer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Depth (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDepth}
                    onChange={(e) => setNewDepth(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Voltage / Pressure</label>
                  <input
                    type="text"
                    value={newSpecs}
                    onChange={(e) => setNewSpecs(e.target.value)}
                    placeholder="e.g. 120 PSI or 115kV"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Material</label>
                  <input
                    type="text"
                    value={newMaterial}
                    onChange={(e) => setNewMaterial(e.target.value)}
                    placeholder="e.g. Ductile Iron"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                >
                  Save Utility Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GIS Dataset Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-cyan-400" />
                Upload GIS Vector Dataset (GeoJSON / CSV)
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-6 text-center space-y-2 cursor-pointer transition-colors bg-slate-800/50">
                <FileCode className="w-8 h-8 text-cyan-400 mx-auto" />
                <div className="font-bold text-slate-200">
                  Click to select file or drag GeoJSON/CSV here
                </div>
                <div className="text-[10px] text-slate-400">
                  Supports .geojson, .json, or .csv files
                </div>
                <input
                  type="file"
                  accept=".geojson,.json,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="gis-file-input"
                />
                <label
                  htmlFor="gis-file-input"
                  className="inline-block mt-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Browse Files
                </label>
              </div>

              {/* Text Area Content */}
              <div>
                <label className="block font-bold mb-1 text-slate-300">
                  Raw Dataset Payload Preview
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="Paste raw GeoJSON string or CSV content here..."
                  rows={5}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-200 font-mono text-[11px] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg"
                >
                  Import Into Map & DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
