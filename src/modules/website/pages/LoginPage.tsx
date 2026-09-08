import React, { useState } from 'react';
import { 
  Lock, Mail, User, ShieldCheck, ArrowRight, GraduationCap, 
  BookOpen, Building2, Eye, EyeOff, CheckCircle2, AlertCircle, 
  KeyRound, Sparkles, X, UserPlus, Shield 
} from 'lucide-react';
import { authService } from '../../../services/authService';
import { UserRole } from '../../../types';

interface LoginPageProps {
  onEnterErp: (role?: string) => void;
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onEnterErp, onNavigate }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [email, setEmail] = useState('davmuchiri48@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign Up / Register State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('STUDENT');
  const [regDepartment, setRegDepartment] = useState('Biblical Studies');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // Forgot Password Modal
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please enter your institutional email and password.');
      return;
    }

    setLoading(true);
    const result = await authService.signInWithEmail(email, password);
    setLoading(false);

    if (result.success && result.user) {
      setSuccessMsg(`Welcome, ${result.user.fullName}! Authenticated as ${result.user.role}.`);
      setTimeout(() => {
        onEnterErp(result.user?.role);
      }, 500);
    } else {
      setError(result.error || 'Authentication failed. Please verify your email and password.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regFullName || !regEmail || !regPassword) {
      setError('Please provide all mandatory details to register your account.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPass) {
      setError('Password and confirmation password do not match.');
      return;
    }

    setLoading(true);
    const result = await authService.signUpWithEmail(regEmail, regPassword, {
      fullName: regFullName,
      role: regRole,
      department: regDepartment,
      phoneNumber: regPhone
    });
    setLoading(false);

    if (result.success && result.user) {
      setSuccessMsg(`Account successfully created for ${result.user.fullName}! Redirecting to Seminary ERP...`);
      setTimeout(() => {
        onEnterErp(result.user?.role);
      }, 700);
    } else {
      setError(result.error || 'Registration failed. Please check your credentials.');
    }
  };

  const handleDemoFill = async (demoEmail: string, demoPass: string, role: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setLoading(true);
    const res = await authService.signInWithEmail(demoEmail, demoPass);
    setLoading(false);
    if (res.success && res.user) {
      onEnterErp(res.user.role);
    } else {
      onEnterErp(role);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage(null);
    setForgotLoading(true);

    const res = await authService.sendPasswordReset(forgotEmail);
    setForgotLoading(false);
    setForgotMessage({
      text: res.message,
      isError: !res.success
    });
  };

  return (
    <div className="w-full bg-[#050914] min-h-screen text-slate-100 flex flex-col justify-between">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif font-black text-slate-950 shadow-md">
            GTS
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
              Grace Theological Seminary
            </div>
            <div className="text-[10px] text-slate-400">
              Theological ERP & Academic Management Portal
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/')}
          className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer transition-colors"
        >
          ← Back to Seminary Portal
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto px-4 py-4">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-7 border border-slate-800 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-black text-2xl text-white">
              Institutional ERP Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Secure single sign-on with verified user credentials & password
            </p>
          </div>

          {/* Auth Mode Toggle Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-5 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-xl font-bold transition-all cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl mb-4 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl mb-4 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE 1: SIGN IN FORM */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="davmuchiri48@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setIsForgotModalOpen(true);
                    }}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm border-slate-800 text-amber-500 focus:ring-amber-500/20"
                  />
                  <span>Remember my institutional session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 transition-all"
              >
                <span>{loading ? 'Authenticating Credentials...' : 'Sign In to ERP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 2: SIGN UP / REGISTER FORM */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Full Legal / Institutional Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Caleb Kiprop Koech"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Institutional Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. caleb.koech@gracetheo.edu"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Seminary Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="LECTURER">Lecturer / Faculty</option>
                    <option value="ADMIN">Administrative Staff</option>
                    <option value="FINANCE">Finance Officer</option>
                    <option value="REGISTRAR">Registrar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="Biblical Studies"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full px-2.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Choose Account Password (min 6 chars) *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={regConfirmPass}
                    onChange={(e) => setRegConfirmPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50 transition-all"
              >
                <span>{loading ? 'Creating Credentials...' : 'Register Institutional Account'}</span>
                <UserPlus className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Pre-filled Logins for rapid preview verification */}
          <div className="mt-7 pt-5 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block text-center mb-2.5">
              Verified Seminary Accounts (Click to Sign In)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('davmuchiri48@gmail.com', 'Admin@123', 'SUPER_ADMIN')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-center cursor-pointer group transition-colors"
              >
                <Building2 className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-200 block">Dr. David (Admin)</span>
                <span className="text-[9px] text-slate-500 block font-mono">Admin@123</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('j.vance@gracetheo.edu', 'Faculty@123', 'LECTURER')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-center cursor-pointer group transition-colors"
              >
                <BookOpen className="w-4 h-4 text-blue-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-200 block">Dr. Vance (Faculty)</span>
                <span className="text-[9px] text-slate-500 block font-mono">Faculty@123</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('caleb.koech@gracetheo.edu', 'Student@123', 'STUDENT')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-center cursor-pointer group transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-200 block">Caleb (Student)</span>
                <span className="text-[9px] text-slate-500 block font-mono">Student@123</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm text-slate-100 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Reset Account Password</h3>
              </div>
              <button
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotMessage(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Enter your registered seminary institutional email. A secure password reset link or instructions will be dispatched immediately.
            </p>

            {forgotMessage && (
              <div className={`p-3 rounded-xl mb-4 text-xs flex items-start gap-2 ${
                forgotMessage.isError
                  ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              }`}>
                {forgotMessage.isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <span>{forgotMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@gracetheo.edu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Victory International Apostolic Biblical Institute. All rights reserved.
      </div>
    </div>
  );
};
