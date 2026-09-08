import React, { useState } from 'react';
import { Church, CheckCircle, Clock, FileText } from 'lucide-react';
import { erpService } from '../../services/erpService';

export const MinistryModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'placements' | 'reports'>('placements');
  const placements = erpService.getMinistryPlacements();
  const reports = erpService.getMinistryReports();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Ministry Formation & Field Internship</h2>
          <p className="text-xs text-slate-500">Track church attachments, preaching hours, evangelism souls won, weekly student reports, and supervisor evaluations.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('placements')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold ${activeTab === 'placements' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Placements
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold ${activeTab === 'reports' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'}`}
          >
            Weekly Ministry Reports
          </button>
        </div>
      </div>

      {activeTab === 'placements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {placements.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold rounded-lg text-[10px]">{p.placementType}</span>
                <span className="text-xs font-semibold text-emerald-600">{p.status}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{p.studentName}</h3>
                <p className="text-xs text-amber-700 font-medium">{p.churchOrOrganization}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs space-y-1">
                <div><span className="text-slate-400">Supervisor:</span> <span className="font-semibold text-slate-900">{p.supervisorName}</span></div>
                <div><span className="text-slate-400">Contact:</span> <span className="font-semibold text-slate-900">{p.supervisorPhone} • {p.supervisorEmail}</span></div>
                <div><span className="text-slate-400">Duration:</span> <span className="font-semibold text-slate-900">{p.startDate} to {p.endDate}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                <th className="p-4">Student Name</th>
                <th className="p-4">Week #</th>
                <th className="p-4">Preaching Hours</th>
                <th className="p-4">Souls Won</th>
                <th className="p-4">Teaching Hours</th>
                <th className="p-4">Evaluation Score</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="p-4 font-bold text-slate-900">{r.studentName}</td>
                  <td className="p-4 font-mono font-bold">Week {r.weekNumber}</td>
                  <td className="p-4 font-mono">{r.preachingHours} hrs</td>
                  <td className="p-4 font-mono text-emerald-600 font-bold">{r.evangelismSoulsWon} souls</td>
                  <td className="p-4 font-mono">{r.teachingHours} hrs</td>
                  <td className="p-4 font-mono font-bold text-amber-600">{r.supervisorEvaluationScore} / 10</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-md font-semibold text-[10px]">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
