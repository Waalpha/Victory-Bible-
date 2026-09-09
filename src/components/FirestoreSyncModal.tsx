import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudUpload, 
  CloudDownload, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Database, 
  X, 
  Server, 
  ShieldCheck, 
  RefreshCw,
  Zap,
  Activity,
  Check,
  PauseCircle,
  PlayCircle
} from 'lucide-react';
import { firestoreSyncService, SyncProgress } from '../services/firestoreSync';
import { firebaseConfig } from '../services/firebase';

interface FirestoreSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirestoreSyncModal: React.FC<FirestoreSyncModalProps> = ({ isOpen, onClose }) => {
  const [progress, setProgress] = useState<SyncProgress>(firestoreSyncService.getProgress());
  const [activeAction, setActiveAction] = useState<'push' | 'pull' | null>(null);

  useEffect(() => {
    const unsubscribe = firestoreSyncService.subscribe(p => {
      setProgress(p);
      if (p.status !== 'in_progress') {
        setActiveAction(null);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handleToggleAutoSync = () => {
    firestoreSyncService.toggleAutoSync();
  };

  const handlePush = async () => {
    setActiveAction('push');
    await firestoreSyncService.pushAllToFirestore(false);
  };

  const handlePull = async () => {
    setActiveAction('pull');
    await firestoreSyncService.pullAllFromFirestore();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#0B1F17] text-white p-6 flex items-center justify-between border-b border-[#153F33]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold">Cloud Firestore Sync Center</h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                  progress.autoSyncEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${progress.autoSyncEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{progress.autoSyncEnabled ? 'Auto-Sync Active' : 'Auto-Sync Paused'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                Database: {firebaseConfig.firestoreDatabaseId} • Project: {firebaseConfig.projectId}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Auto-Sync Master Switch Card */}
          <div className="bg-[#F4F8F5] border border-[#C6E2D5] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-[#0B1F17]">Automatic Cloud Synchronization</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-600 text-white rounded-md">
                    Real-time
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Automatically mirrors all student enrollments, exam records, fee invoices, staff directories, and institution branding into Cloud Firestore as you work.
                </p>
              </div>
            </div>

            <button
              onClick={handleToggleAutoSync}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shrink-0 ${
                progress.autoSyncEnabled
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              {progress.autoSyncEnabled ? (
                <>
                  <PauseCircle className="w-4 h-4" />
                  <span>Disable Auto-Sync</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Enable Auto-Sync</span>
                </>
              )}
            </button>
          </div>

          {/* Connection Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mb-1">
                <Server className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-Sync Engine</span>
              </div>
              <p className="text-xs font-bold text-slate-900 flex items-center space-x-1">
                {progress.isAutoSyncing ? (
                  <span className="text-amber-600 flex items-center space-x-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Syncing changes...</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Continuous Watcher</span>
                  </span>
                )}
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Security Rules</span>
              </div>
              <p className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 inline" />
                <span>Protected & Verified</span>
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold mb-1">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Last Cloud Update</span>
              </div>
              <p className="text-xs font-mono text-slate-700 truncate">
                {progress.lastSyncedAt || 'Syncing now...'}
              </p>
            </div>
          </div>

          {/* Sync Status Banner */}
          {progress.status === 'in_progress' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center space-x-3 text-emerald-900 font-semibold text-sm">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                <span>{progress.syncMode === 'auto' ? 'Auto-Sync in Progress...' : 'Full Sync in Progress...'}</span>
              </div>
              <p className="text-xs text-emerald-800">{progress.message}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                  style={{ 
                    width: progress.totalCollections > 0 
                      ? `${Math.min(100, (progress.completedCollections / progress.totalCollections) * 100)}%` 
                      : '20%' 
                  }}
                />
              </div>
            </div>
          )}

          {progress.status === 'success' && !progress.isAutoSyncing && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900">Firestore In Sync</h4>
                <p className="text-xs text-emerald-700 mt-0.5">{progress.message}</p>
              </div>
            </div>
          )}

          {progress.status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-900">Firestore Sync Alert</h4>
                <p className="text-xs text-red-700 mt-0.5">{progress.message}</p>
                {progress.errorDetails && (
                  <p className="text-[11px] font-mono text-red-600 mt-1 bg-red-100/60 p-2 rounded">
                    {progress.errorDetails}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Recent Auto-Sync Activity */}
          {progress.recentActivity && progress.recentActivity.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Recent Auto-Sync Activity</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Live log</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-36 overflow-y-auto space-y-2">
                {progress.recentActivity.slice(0, 6).map(act => (
                  <div key={act.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${act.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span className="text-slate-700 truncate">{act.text}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0 ml-2">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collection breakdown */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Synchronized Cloud Collections
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-44 overflow-y-auto pr-1">
              {[
                { col: 'students', label: 'Students', icon: '👨‍🎓' },
                { col: 'applicants', label: 'Admissions', icon: '📝' },
                { col: 'programs', label: 'Programs', icon: '🎓' },
                { col: 'departments', label: 'Departments', icon: '🏛️' },
                { col: 'courses', label: 'Courses & Units', icon: '📚' },
                { col: 'staff', label: 'Faculty & Staff', icon: '👨‍🏫' },
                { col: 'feeStructures', label: 'Fee Structures', icon: '💰' },
                { col: 'invoices', label: 'Invoices', icon: '🧾' },
                { col: 'payments', label: 'Payments', icon: '💳' },
                { col: 'examinations', label: 'Examinations', icon: '✍️' },
                { col: 'examResults', label: 'Exam Results', icon: '📊' },
                { col: 'ministryPlacements', label: 'Field Placements', icon: '⛪' },
                { col: 'ministryReports', label: 'Ministry Reports', icon: '📜' },
                { col: 'libraryBooks', label: 'Library Catalog', icon: '📖' },
                { col: 'hostelRooms', label: 'Hostel Rooms', icon: '🛏️' },
                { col: 'announcements', label: 'Announcements', icon: '📢' }
              ].map(({ col, label, icon }) => (
                <div key={col} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="flex items-center space-x-2 truncate">
                    <span>{icon}</span>
                    <span className="font-semibold text-slate-800 truncate">{label}</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {progress.collectionCounts[col] !== undefined 
                      ? `${progress.collectionCounts[col]} docs` 
                      : 'live'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${progress.autoSyncEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span>{progress.autoSyncEnabled ? 'Auto-syncing to Cloud Firestore' : 'Auto-sync is currently paused'}</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handlePull}
              disabled={progress.status === 'in_progress'}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <CloudDownload className="w-4 h-4 text-slate-500" />
              <span>Pull from Cloud</span>
            </button>

            <button
              onClick={handlePush}
              disabled={progress.status === 'in_progress'}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {progress.status === 'in_progress' && activeAction === 'push' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing to Firestore...</span>
                </>
              ) : (
                <>
                  <CloudUpload className="w-4 h-4" />
                  <span>Force Full Sync</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
