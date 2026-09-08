import React, { useState } from 'react';
import { Lock, Mail, User, ShieldCheck, ArrowRight, GraduationCap, BookOpen, Building2 } from 'lucide-react';
import { erpService } from '../../../services/erpService';

interface LoginPageProps {
  onEnterErp: (role?: string) => void;
  onNavigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onEnterErp, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'faculty' | 'student'>('admin');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your institutional email and password.');
      return;
    }
    // Authenticate and transition into private ERP
    onEnterErp(selectedRole);
  };

  const handleDemoLogin = (role: 'admin' | 'faculty' | 'student') => {
    onEnterErp(role);
  };

  return (
    <div className="w-full bg-slate-950 min-h-screen text-slate-100 flex flex-col justify-between">
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif font-black text-slate-950 shadow-md">
            GTS
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
              Grace Theological Seminary
            </div>
            <div className="text-[10px] text-slate-400">
              Return to Public Portal
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('/')}
          className="text-xs text-slate-400 hover:text-white font-medium"
        >
          ← Back to Website
        </button>
      </div>

      {/* Main Login Box */}
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-8 border border-slate-800 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif font-black text-2xl text-white">
              Institutional ERP Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Secure single sign-on for students, faculty, and administrative staff
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6 text-xs">
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`py-2 rounded-xl font-bold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin / Staff
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('faculty')}
              className={`py-2 rounded-xl font-bold transition-all ${
                selectedRole === 'faculty'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`py-2 rounded-xl font-bold transition-all ${
                selectedRole === 'student'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Student
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder={
                    selectedRole === 'admin' 
                      ? 'admin@graceseminary.ac.ke' 
                      : selectedRole === 'faculty' 
                      ? 'faculty@graceseminary.ac.ke' 
                      : 'student@graceseminary.ac.ke'
                  }
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
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[10px] text-amber-400 hover:underline">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Sign In to ERP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Triggers */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block text-center mb-3">
              Instant Demo Direct Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center cursor-pointer group"
              >
                <Building2 className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-300 block">Executive</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('faculty')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center cursor-pointer group"
              >
                <BookOpen className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-300 block">Lecturer</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('student')}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-center cursor-pointer group"
              >
                <GraduationCap className="w-4 h-4 text-amber-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold text-slate-300 block">Student</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="max-w-7xl mx-auto w-full px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Grace Theological Seminary & Bible College. All rights reserved.
      </div>
    </div>
  );
};
