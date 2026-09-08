import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, KeyRound, Shield, ShieldCheck, ShieldAlert, 
  Search, Filter, Lock, Mail, Smartphone, Building2, 
  CheckCircle2, AlertCircle, RefreshCw, Copy, Check, MoreVertical,
  Trash2, UserX, UserCheck, Eye, EyeOff, Sparkles, Database
} from 'lucide-react';
import { authService } from '../../services/authService';
import { UserAccount, UserRole } from '../../types';
import { firestoreSyncService } from '../../services/firestoreSync';

export const UserAccountsModule: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);

  // New Account Form
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('STUDENT');
  const [newDepartment, setNewDepartment] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('Seminary@2026');
  const [showNewPass, setShowNewPass] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Reset Password Form
  const [resetPassValue, setResetPassValue] = useState('');
  const [copiedCredentials, setCopiedCredentials] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');

  const loadUsers = () => {
    setUsers(authService.getAllUserAccounts());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const rolesList: UserRole[] = [
    'SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'PRESIDENT', 'REGISTRAR', 
    'ACADEMIC_DEAN', 'ACADEMIC_OFFICER', 'LECTURER', 'FACULTY', 'FINANCE', 
    'FINANCE_OFFICER', 'MINISTRY_COORDINATOR', 'LIBRARIAN', 'CHAPLAIN', 
    'STUDENT_AFFAIRS', 'HOSTEL_MANAGER', 'EXAM_OFFICER', 'STUDENT', 'ALUMNI'
  ];

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    const matchesStatus = selectedStatusFilter === 'ALL' || u.status === selectedStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Metrics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const adminUsers = users.filter(u => ['SUPER_ADMIN', 'ADMIN', 'PRINCIPAL', 'REGISTRAR'].includes(u.role)).length;
  const facultyUsers = users.filter(u => ['LECTURER', 'FACULTY', 'ACADEMIC_DEAN'].includes(u.role)).length;
  const studentUsers = users.filter(u => u.role === 'STUDENT').length;

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newFullName || !newEmail || !newPassword) {
      setFormError('Please fill in all required account fields.');
      return;
    }

    if (newPassword.length < 6) {
      setFormError('Temporary password must be at least 6 characters.');
      return;
    }

    const res = authService.createInstitutionalAccount({
      fullName: newFullName,
      email: newEmail,
      role: newRole,
      department: newDepartment,
      phoneNumber: newPhone,
      initialPassword: newPassword,
      notes: 'Provisioned by Seminary Administrator'
    });

    if (res.success) {
      setFormSuccess(`User account created for ${newEmail} with initial password!`);
      loadUsers();
      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess('');
        setNewFullName('');
        setNewEmail('');
        setNewPhone('');
        setNewDepartment('');
        setNewPassword('Seminary@2026');
      }, 1500);
    } else {
      setFormError(res.error || 'Failed to create account.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !resetPassValue) return;

    authService.resetAccountPassword(selectedUser.id, resetPassValue);
    setResetSuccess(`Password for ${selectedUser.email} has been updated to "${resetPassValue}".`);
    loadUsers();
    setTimeout(() => {
      setIsResetPassModalOpen(false);
      setResetSuccess('');
      setSelectedUser(null);
      setResetPassValue('');
    }, 2500);
  };

  const handleToggleStatus = (user: UserAccount) => {
    authService.toggleAccountStatus(user.id);
    loadUsers();
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (confirm(`Are you sure you want to permanently revoke credentials and delete user account: ${user.fullName} (${user.email})?`)) {
      authService.deleteInstitutionalAccount(user.id);
      loadUsers();
    }
  };

  const handleSyncToFirestore = async () => {
    setIsSyncing(true);
    setSyncNotice('');
    const res = await firestoreSyncService.pushAllToFirestore();
    setIsSyncing(false);
    if (res.success) {
      setSyncNotice(`Synced ${users.length} accounts to Cloud Firestore users collection!`);
      setTimeout(() => setSyncNotice(''), 4000);
    } else {
      setSyncNotice('Sync failed. Please check connection.');
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCredentials(true);
    setTimeout(() => setCopiedCredentials(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">User Accounts & Authentication</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Identity & Access Management
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage institutional logins, password policies, user credentials, and role assignments across faculty, staff, and students.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncToFirestore}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Database className="w-4 h-4 text-amber-400" />
            <span>{isSyncing ? 'Syncing...' : 'Sync to Firestore'}</span>
          </button>

          <button
            onClick={() => {
              setNewPassword(generateRandomPassword());
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {syncNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Total Accounts</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalUsers}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">{activeUsers} Active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Administrators</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{adminUsers}</p>
          <span className="text-[10px] text-slate-500">Full & Exec Privileges</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Faculty / Lecturers</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{facultyUsers}</p>
          <span className="text-[10px] text-slate-500">Academic Staff</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Students</span>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{studentUsers}</p>
          <span className="text-[10px] text-slate-500">Undergrad & Postgrad</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold">Security Status</span>
            <Lock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-lg font-black text-emerald-700">Protected</p>
          <span className="text-[10px] text-slate-500">Encrypted Passwords</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search accounts by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-amber-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-600">Role:</span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="ALL">All Roles</option>
              {rolesList.map(r => (
                <option key={r} value={r}>{r.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">User Account & Identity</th>
                <th className="py-3 px-4">Role & Access Tier</th>
                <th className="py-3 px-4">Department / Program</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Account Type</th>
                <th className="py-3 px-4 text-right">Actions & Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No user accounts match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-slate-800 to-slate-950 text-amber-400 font-black text-xs flex items-center justify-center shrink-0 border border-slate-700">
                          {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'US'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{user.fullName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.role === 'SUPER_ADMIN' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : user.role === 'REGISTRAR' || user.role === 'ACADEMIC_DEAN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : user.role === 'LECTURER' || user.role === 'FACULTY'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {user.department || 'General'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {user.accountType || 'Institutional Account'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setResetPassValue(generateRandomPassword());
                            setIsResetPassModalOpen(true);
                          }}
                          title="Reset Password"
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <KeyRound className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            user.status === 'Active'
                              ? 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
                              : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {user.status === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        {user.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER ACCOUNT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Create New User Account</h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Provision a new institutional credential set with email, password, and institutional permission role.
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal / Institutional Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Barnabas Kipkemoi"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. barnabas.kipkemoi@gracetheo.edu"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Permission Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-hidden"
                  >
                    {rolesList.map(r => (
                      <option key={r} value={r}>{r.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department / Faculty
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Biblical Studies"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Telephone Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Initial Account Password *
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[10px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:bg-white focus:border-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Save & Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isResetPassModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Reset Account Password</h3>
                </div>
                <button
                  onClick={() => setIsResetPassModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Assign a new credentials password for <strong className="text-white">{selectedUser.fullName}</strong>.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="p-6 space-y-4 text-xs">
              {resetSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{resetSuccess}</span>
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <p className="text-[11px] text-slate-600">User: <strong className="text-slate-900">{selectedUser.fullName}</strong></p>
                <p className="text-[11px] text-slate-600 font-mono">Email: {selectedUser.email}</p>
                <p className="text-[11px] text-slate-600">Role: <strong className="text-amber-700">{selectedUser.role}</strong></p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    New Temporary Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetPassValue(generateRandomPassword())}
                    className="text-[10px] text-amber-600 font-bold hover:underline cursor-pointer"
                  >
                    Generate Random
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={resetPassValue}
                    onChange={(e) => setResetPassValue(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold focus:bg-white focus:border-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(resetPassValue)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    title="Copy Password"
                  >
                    {copiedCredentials ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsResetPassModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-xs cursor-pointer"
                >
                  Save New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
