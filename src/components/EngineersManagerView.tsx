import React, { useState } from 'react';
import { Users, Plus, ShieldCheck, Mail, Building, MapPin, FileCheck } from 'lucide-react';
import { UserEngineer } from '../types';

interface EngineersManagerViewProps {
  engineers: UserEngineer[];
  onAddEngineer: (engineer: Omit<UserEngineer, 'id' | 'reportsCreated'>) => void;
}

export const EngineersManagerView: React.FC<EngineersManagerViewProps> = ({
  engineers,
  onAddEngineer,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'engineer'>('engineer');
  const [department, setDepartment] = useState('Subterranean Safety Unit');
  const [assignedZone, setAssignedZone] = useState('Financial & SOMA Sector');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddEngineer({
      name,
      email,
      role,
      department,
      assignedZone,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 1000000)}?w=200`,
    });
    setShowAddModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-cyan-400" />
            Licensed Excavation Engineers & Personnel
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Directory of certified field engineers, GIS administrators, and geotechnical safety officers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Licensed Engineer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engineers.map((eng) => (
          <div
            key={eng.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <img
                src={eng.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                alt={eng.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-md"
              />
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{eng.name}</h3>
                <div className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  {eng.role}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{eng.email}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Building className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{eng.department}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>Zone: {eng.assignedZone}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <span className="text-slate-400">Excavation Scans Run</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {eng.reportsCreated} Permits
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add New Engineer Profile</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. David Chen, PE"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@utilitymap.ai"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1 text-slate-300">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'engineer')}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  >
                    <option value="engineer">Engineer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-slate-300">Assigned Zone</label>
                  <input
                    type="text"
                    value={assignedZone}
                    onChange={(e) => setAssignedZone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1 text-slate-300">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white outline-none"
                />
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
                  Save Engineer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
