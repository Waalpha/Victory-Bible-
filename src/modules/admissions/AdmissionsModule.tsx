import React, { useState } from 'react';
import { UserPlus, CheckCircle, XCircle, FileText, Search, UserCheck, Eye, Plus } from 'lucide-react';
import { erpService } from '../../services/erpService';
import { Applicant, ApplicantStatus } from '../../types';

export const AdmissionsModule: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>(erpService.getApplicants());
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);

  // New applicant form state
  const programs = erpService.getPrograms();
  const [newApp, setNewApp] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male' as const,
    dateOfBirth: '2000-01-01',
    nationality: 'Kenyan',
    address: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    churchName: '',
    churchPastor: '',
    refereeName: '',
    refereePhone: '',
    programId: programs[0]?.id || '',
    intake: 'September 2026'
  });

  const handleStatusChange = (id: string, newStatus: ApplicantStatus) => {
    const updated = applicants.map(a => a.id === id ? { ...a, status: newStatus } : a);
    erpService.saveApplicants(updated);
    setApplicants(updated);
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus });
    }
    erpService.logAction('admin@gracetheo.edu', 'ADMIN', `Updated applicant status to ${newStatus}`, 'Admissions', id);
  };

  const handleConvertToStudent = (app: Applicant) => {
    const studentNumber = 'GRC/2026/' + Math.floor(100 + Math.random() * 900);
    const admissionNumber = 'ADM-2026-' + Math.floor(1000 + Math.random() * 9000);
    const prog = programs.find(p => p.id === app.programId);

    erpService.addStudent({
      studentNumber,
      admissionNumber,
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      gender: app.gender,
      dateOfBirth: app.dateOfBirth,
      nationality: app.nationality,
      address: app.address,
      nextOfKinName: app.nextOfKinName,
      nextOfKinPhone: app.nextOfKinPhone,
      emergencyContact: app.nextOfKinPhone,
      churchName: app.churchName,
      churchPastor: app.churchPastor,
      previousEducation: 'High School Diploma / Transferred',
      programId: app.programId,
      programName: app.programName || prog?.name || 'Theology Program',
      department: prog?.department || 'Biblical Studies',
      intake: app.intake,
      academicYear: '2026/2027',
      semester: 'Semester 1',
      status: 'Active',
      gpa: 3.5,
      cgpa: 3.5,
      feeBalance: 1200,
      attendanceRate: 100,
      createdAt: new Date().toISOString().substring(0, 10)
    });

    handleStatusChange(app.id, 'Enrolled');
    alert(`Applicant ${app.fullName} successfully converted to Active Student with ID ${studentNumber}!`);
  };

  const handleCreateApplicant = (e: React.FormEvent) => {
    e.preventDefault();
    const prog = programs.find(p => p.id === newApp.programId);
    const num = 'APP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    const created = erpService.addApplicant({
      ...newApp,
      applicationNumber: num,
      programName: prog?.name || 'Theology Program',
      status: 'Submitted',
      applicationFeePaid: true,
      applicationFeeRef: 'MPESA-DEMO-' + Math.floor(100000 + Math.random() * 900000),
      submittedAt: new Date().toISOString().substring(0, 10)
    });
    setApplicants([created, ...applicants]);
    setShowNewModal(false);
  };

  const filtered = applicants.filter(a => {
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    const matchSearch = a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || a.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Admissions & Applications Management</h2>
          <p className="text-xs text-slate-500">Review candidate applications, ecclesiastical endorsements, and enrollment status.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2.5 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl text-xs flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['All', 'Submitted', 'Under Review', 'Accepted', 'Enrolled', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                filterStatus === st ? 'bg-[#15803D] text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <th className="p-4">Application #</th>
                <th className="p-4">Applicant Name</th>
                <th className="p-4">Program</th>
                <th className="p-4">Church / Pastor</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-semibold text-slate-900">{app.applicationNumber}</td>
                  <td className="p-4 font-bold text-slate-900">{app.fullName}</td>
                  <td className="p-4">{app.programName}</td>
                  <td className="p-4">
                    <span className="block font-medium text-slate-800">{app.churchName}</span>
                    <span className="text-[10px] text-slate-400">{app.churchPastor}</span>
                  </td>
                  <td className="p-4 text-slate-500">{app.submittedAt}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-lg font-semibold text-[10px] ${
                      app.status === 'Enrolled' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'Under Review' ? 'bg-amber-100 text-amber-800' :
                      app.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedApplicant(app)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                    {app.status !== 'Enrolled' && (
                      <button
                        onClick={() => handleConvertToStudent(app)}
                        className="px-3 py-1.5 bg-[#15803D] hover:bg-[#14532D] text-white rounded-lg font-semibold inline-flex items-center space-x-1 shadow-xs cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Enroll</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Review Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-600 font-bold">{selectedApplicant.applicationNumber}</span>
                <h3 className="text-xl font-bold text-slate-900">{selectedApplicant.fullName}</h3>
              </div>
              <button 
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Email & Phone</span>
                <span className="font-semibold text-slate-900">{selectedApplicant.email} • {selectedApplicant.phone}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Program Applied</span>
                <span className="font-semibold text-slate-900">{selectedApplicant.programName}</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Church Information</span>
                <span className="font-semibold text-slate-900">{selectedApplicant.churchName} ({selectedApplicant.churchPastor})</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-slate-400 block font-medium">Referee</span>
                <span className="font-semibold text-slate-900">{selectedApplicant.refereeName} ({selectedApplicant.refereePhone})</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Change Status / Action</label>
              <div className="flex flex-wrap gap-2">
                {(['Submitted', 'Under Review', 'Accepted', 'Rejected', 'Waitlisted'] as ApplicantStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedApplicant.id, st)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${
                      selectedApplicant.status === st ? 'bg-[#15803D] text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
              {selectedApplicant.status !== 'Enrolled' && (
                <button
                  onClick={() => {
                    handleConvertToStudent(selectedApplicant);
                    setSelectedApplicant(null);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Approve & Enroll as Student</span>
                </button>
              )}
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Application Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Create New Application</h3>
              <button onClick={() => setShowNewModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">✕</button>
            </div>
            <form onSubmit={handleCreateApplicant} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newApp.fullName}
                  onChange={e => setNewApp({...newApp, fullName: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="Applicant Name"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newApp.email}
                    onChange={e => setNewApp({...newApp, email: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={newApp.phone}
                    onChange={e => setNewApp({...newApp, phone: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program</label>
                <select
                  value={newApp.programId}
                  onChange={e => setNewApp({...newApp, programId: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {programs.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Church Name</label>
                  <input
                    type="text"
                    required
                    value={newApp.churchName}
                    onChange={e => setNewApp({...newApp, churchName: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pastor Name</label>
                  <input
                    type="text"
                    required
                    value={newApp.churchPastor}
                    onChange={e => setNewApp({...newApp, churchPastor: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#15803D] hover:bg-[#14532D] text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
