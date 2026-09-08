import React, { useState } from 'react';
import { 
  Users, Search, Plus, Trash2, Edit2, Mail, Phone, 
  GraduationCap, BookOpen, Briefcase, CheckCircle2, 
  AlertTriangle, X, Shield, Building2, Eye, Filter
} from 'lucide-react';
import { erpService } from '../../services/erpService';
import { StaffMember } from '../../types';

export const StaffModule: React.FC = () => {
  const [staffList, setStaffList] = useState<StaffMember[]>(() => erpService.getStaff());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);
  const [viewingStaff, setViewingStaff] = useState<StaffMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const departments = [
    'Biblical Studies',
    'Systematic & Historical Theology',
    'Pastoral Ministry & Leadership',
    'Biblical Languages',
    'Global Missions & Evangelism',
    'Administration & Registry',
    'Library & Research',
    'Finance & Accounts'
  ];

  const positions: StaffMember['position'][] = [
    'Professor',
    'Senior Lecturer',
    'Lecturer',
    'Assistant Lecturer',
    'Dean',
    'Registrar',
    'Administrator',
    'Support Staff'
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Form state for new staff
  const getNextStaffNumber = () => {
    const nextNum = staffList.length + 1;
    return `STF-${String(nextNum).padStart(3, '0')}`;
  };

  const [formData, setFormData] = useState({
    staffNumber: getNextStaffNumber(),
    fullName: '',
    email: '',
    phone: '',
    department: 'Biblical Studies',
    position: 'Lecturer' as StaffMember['position'],
    qualifications: '',
    specialization: '',
    employmentStatus: 'Full-Time' as StaffMember['employmentStatus'],
    avatarUrl: ''
  });

  const openAddModal = () => {
    setFormData({
      staffNumber: getNextStaffNumber(),
      fullName: '',
      email: '',
      phone: '',
      department: 'Biblical Studies',
      position: 'Lecturer',
      qualifications: '',
      specialization: '',
      employmentStatus: 'Full-Time',
      avatarUrl: ''
    });
    setShowAddModal(true);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      alert('Please provide staff full name and email address.');
      return;
    }

    const created = erpService.addStaff({
      staffNumber: formData.staffNumber || getNextStaffNumber(),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || '+254 700 000 000',
      department: formData.department,
      position: formData.position,
      qualifications: formData.qualifications.trim() || 'M.Div. in Theological Studies',
      specialization: formData.specialization.trim() || 'Biblical Exegesis & Ministry',
      employmentStatus: formData.employmentStatus,
      avatarUrl: formData.avatarUrl.trim() || undefined
    });

    const updated = erpService.getStaff();
    setStaffList(updated);
    setShowAddModal(false);
    showToast(`Staff member "${created.fullName}" successfully added to directory!`);
  };

  const handleEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;

    const updated = erpService.updateStaff(editingStaff.id, {
      staffNumber: editingStaff.staffNumber,
      fullName: editingStaff.fullName.trim(),
      email: editingStaff.email.trim(),
      phone: editingStaff.phone.trim(),
      department: editingStaff.department,
      position: editingStaff.position,
      qualifications: editingStaff.qualifications.trim(),
      specialization: editingStaff.specialization.trim(),
      employmentStatus: editingStaff.employmentStatus,
      avatarUrl: editingStaff.avatarUrl?.trim() || undefined
    });

    if (updated) {
      setStaffList(erpService.getStaff());
      setEditingStaff(null);
      showToast(`Staff profile for "${updated.fullName}" updated successfully.`);
    }
  };

  const confirmDeleteStaff = () => {
    if (!deletingStaff) return;
    const name = deletingStaff.fullName;
    erpService.deleteStaff(deletingStaff.id);
    setStaffList(erpService.getStaff());
    setDeletingStaff(null);
    if (viewingStaff?.id === deletingStaff.id) {
      setViewingStaff(null);
    }
    showToast(`Staff member "${name}" has been permanently removed.`);
  };

  // Filtered staff list
  const filteredStaff = staffList.filter(s => {
    const matchesSearch = 
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.staffNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = selectedDepartment === 'ALL' || s.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'ALL' || s.employmentStatus === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const fullTimeCount = staffList.filter(s => s.employmentStatus === 'Full-Time').length;
  const professorsCount = staffList.filter(s => s.position === 'Professor' || s.position === 'Dean').length;
  const uniqueDepartmentsCount = new Set(staffList.map(s => s.department)).size;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Faculty & Staff Management</h2>
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-[11px] rounded-md font-mono">
              {staffList.length} Active Staff
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain institutional faculty records, academic qualifications, professorial appointments, and department allocation.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Staff Member</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Staff</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{staffList.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Seminary directory</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full-Time Faculty</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{fullTimeCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{((fullTimeCount / (staffList.length || 1)) * 100).toFixed(0)}% residential</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Depts</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{uniqueDepartmentsCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Faculty chairs</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Professors & Deans</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{professorsCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Senior theological leadership</div>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search faculty by name, staff ID, department, specialization..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="ALL">All Statuses</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
            </select>

            <div className="hidden sm:flex border border-slate-200 rounded-xl p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Table
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Showing <strong className="text-slate-900 font-semibold">{filteredStaff.length}</strong> of {staffList.length} staff members</span>
          {(selectedDepartment !== 'ALL' || selectedStatus !== 'ALL' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedDepartment('ALL');
                setSelectedStatus('ALL');
                setSearchTerm('');
              }}
              className="text-amber-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Staff Display */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No Staff Members Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No faculty match your current search query or filter criteria. Try adjusting your filters or add a new staff member.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Staff Member
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map(st => (
            <div 
              key={st.id} 
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400/60 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-4">
                {/* Avatar and Main Info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-sm shadow-xs shrink-0 overflow-hidden">
                      {st.avatarUrl ? (
                        <img src={st.avatarUrl} alt={st.fullName} className="w-full h-full object-cover" />
                      ) : (
                        st.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                          {st.staffNumber}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          st.employmentStatus === 'Full-Time' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {st.employmentStatus}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm truncate mt-1 group-hover:text-amber-800 transition-colors">
                        {st.fullName}
                      </h3>
                      <p className="text-xs text-amber-700 font-semibold truncate">{st.position}</p>
                    </div>
                  </div>
                </div>

                {/* Department & Qualifications */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-medium">{st.department}</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700 text-[11px] leading-relaxed">
                    <div className="text-[9px] font-bold uppercase text-slate-400 mb-0.5">Qualifications</div>
                    <p className="line-clamp-2">{st.qualifications}</p>
                  </div>

                  {st.specialization && (
                    <div className="text-[11px] text-slate-600">
                      <span className="text-slate-400 font-medium">Focus: </span>
                      <span className="font-medium text-slate-800">{st.specialization}</span>
                    </div>
                  )}
                </div>

                {/* Contact Links */}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
                  <a 
                    href={`mailto:${st.email}`} 
                    className="text-slate-600 hover:text-amber-700 flex items-center gap-2 truncate py-0.5"
                    title={st.email}
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate font-mono text-[11px]">{st.email}</span>
                  </a>
                  <a 
                    href={`tel:${st.phone}`} 
                    className="text-slate-600 hover:text-amber-700 flex items-center gap-2 truncate py-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono text-[11px]">{st.phone}</span>
                  </a>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingStaff(st)}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs border border-slate-200 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingStaff(st)}
                    className="px-2.5 py-1.5 bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-semibold rounded-lg text-xs border border-slate-200 hover:border-amber-300 flex items-center gap-1 transition-colors"
                    title="Edit staff details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeletingStaff(st)}
                    className="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-semibold rounded-lg text-xs border border-slate-200 hover:border-rose-300 flex items-center gap-1 transition-colors"
                    title="Delete staff member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Staff ID</th>
                  <th className="px-5 py-3.5">Faculty Member</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Position</th>
                  <th className="px-5 py-3.5">Contact Details</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaff.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                      {st.staffNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                          {st.avatarUrl ? (
                            <img src={st.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            st.fullName[0]
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{st.fullName}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{st.qualifications}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{st.department}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-amber-800">{st.position}</span>
                    </td>
                    <td className="px-5 py-3.5 space-y-0.5">
                      <div className="font-mono text-slate-600">{st.email}</div>
                      <div className="font-mono text-[11px] text-slate-400">{st.phone}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        st.employmentStatus === 'Full-Time' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {st.employmentStatus}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStaff(st)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingStaff(st)}
                          className="p-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-lg transition-colors"
                          title="Edit Staff Member"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingStaff(st)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                          title="Delete Staff Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD STAFF MEMBER ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full my-8 p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Add New Staff Member</h3>
                  <p className="text-xs text-slate-500">Register new theological faculty or administrative officer</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Staff ID Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.staffNumber}
                    onChange={e => setFormData({ ...formData, staffNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold focus:ring-2 focus:ring-amber-500/30"
                    placeholder="e.g. STF-005"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Employment Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={e => setFormData({ ...formData, employmentStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-amber-500/30"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name & Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500/30"
                  placeholder="e.g. Rev. Dr. David Muchiri"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500/30"
                    placeholder="e.g. d.muchiri@gracetheo.edu"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500/30"
                    placeholder="e.g. +254 712 345 678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/30"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Rank / Position <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-amber-500/30"
                  >
                    {positions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Qualifications</label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={e => setFormData({ ...formData, qualifications: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500/30"
                  placeholder="e.g. Ph.D. in Old Testament Exegesis, Trinity Evangelical Divinity School"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teaching & Research Specialization</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500/30"
                  placeholder="e.g. Hebrew Poetry, Hermeneutics, and Reformation Dogmatics"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo / Avatar URL (Optional)</label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500/30"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save & Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT STAFF MEMBER ================= */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full my-8 p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Edit Staff Member</h3>
                  <p className="text-xs text-slate-500">Update qualifications, department, and contact details</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingStaff(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Staff ID Number</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.staffNumber}
                    onChange={e => setEditingStaff({ ...editingStaff, staffNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Status</label>
                  <select
                    value={editingStaff.employmentStatus}
                    onChange={e => setEditingStaff({ ...editingStaff, employmentStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name & Title</label>
                <input
                  type="text"
                  required
                  value={editingStaff.fullName}
                  onChange={e => setEditingStaff({ ...editingStaff, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingStaff.email}
                    onChange={e => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.phone}
                    onChange={e => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={editingStaff.department}
                    onChange={e => setEditingStaff({ ...editingStaff, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Position / Rank</label>
                  <select
                    value={editingStaff.position}
                    onChange={e => setEditingStaff({ ...editingStaff, position: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
                  >
                    {positions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Qualifications</label>
                <input
                  type="text"
                  value={editingStaff.qualifications}
                  onChange={e => setEditingStaff({ ...editingStaff, qualifications: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teaching & Research Specialization</label>
                <input
                  type="text"
                  value={editingStaff.specialization}
                  onChange={e => setEditingStaff({ ...editingStaff, specialization: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={editingStaff.avatarUrl || ''}
                  onChange={e => setEditingStaff({ ...editingStaff, avatarUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-up border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Delete Staff Member</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to permanently remove <strong className="text-slate-900">{deletingStaff.fullName}</strong> ({deletingStaff.staffNumber}) from the staff registry?
              </p>
              <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl text-left text-xs text-rose-800">
                <span className="font-semibold block">⚠️ Permanent Action:</span>
                This will delete their faculty profile from Cloud Firestore and remove them from all department teaching directories.
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletingStaff(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteStaff}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
              >
                Yes, Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW STAFF PROFILE ================= */}
      {viewingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scale-up border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-[11px] font-mono font-bold bg-amber-50 text-amber-900 px-2.5 py-1 rounded-lg border border-amber-200/60">
                {viewingStaff.staffNumber}
              </span>
              <button 
                onClick={() => setViewingStaff(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 text-amber-400 font-bold flex items-center justify-center text-xl shrink-0 overflow-hidden shadow-sm">
                {viewingStaff.avatarUrl ? (
                  <img src={viewingStaff.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  viewingStaff.fullName[0]
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{viewingStaff.fullName}</h3>
                <p className="text-xs text-amber-700 font-semibold">{viewingStaff.position} • {viewingStaff.department}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                  viewingStaff.employmentStatus === 'Full-Time' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {viewingStaff.employmentStatus} Appointment
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Qualifications</span>
                <span className="font-semibold text-slate-800 leading-relaxed">{viewingStaff.qualifications}</span>
              </div>
              {viewingStaff.specialization && (
                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Teaching Specialization</span>
                  <span className="font-semibold text-slate-800">{viewingStaff.specialization}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Email</span>
                  <a href={`mailto:${viewingStaff.email}`} className="text-amber-800 font-mono font-medium hover:underline">
                    {viewingStaff.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Phone</span>
                  <a href={`tel:${viewingStaff.phone}`} className="text-amber-800 font-mono font-medium hover:underline">
                    {viewingStaff.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  const toDelete = viewingStaff;
                  setViewingStaff(null);
                  setDeletingStaff(toDelete);
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const toEdit = viewingStaff;
                    setViewingStaff(null);
                    setEditingStaff(toEdit);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Details
                </button>
                <button
                  onClick={() => setViewingStaff(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
