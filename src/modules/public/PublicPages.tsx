import React, { useState } from 'react';
import { Award, CheckCircle2, Search, ArrowLeft, Send, BookOpen, GraduationCap, Phone, Mail, MapPin } from 'lucide-react';
import { erpService } from '../../services/erpService';

interface PublicPagesProps {
  page: 'verify' | 'apply' | 'contact';
  onBackToApp: () => void;
}

export const PublicPages: React.FC<PublicPagesProps> = ({ page, onBackToApp }) => {
  const settings = erpService.getSettings();
  const programs = erpService.getPrograms();

  // Verification state
  const [certCode, setCertCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verifySearched, setVerifySearched] = useState(false);

  // Application state
  const [appForm, setAppForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
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
  const [appSubmitted, setAppSubmitted] = useState(false);
  const [appNumber, setAppNumber] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifySearched(true);
    // Demo verification logic
    if (certCode.trim().toUpperCase() === 'GRC-2026-8801' || certCode.trim().length > 3) {
      setVerificationResult({
        certificateNumber: certCode.toUpperCase() || 'GRC-2026-8801',
        studentName: 'Caleb Kiprop Koech',
        award: 'Bachelor of Theology (B.Th.)',
        program: 'Bachelor of Theology',
        graduationYear: '2026',
        institution: settings.institutionName,
        status: 'VALID CERTIFICATE - AUTHORIZED',
        dateIssued: '2026-08-20'
      });
    } else {
      setVerificationResult(null);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prog = programs.find(p => p.id === appForm.programId);
    const num = 'APP-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
    erpService.addApplicant({
      ...appForm,
      applicationNumber: num,
      programName: prog?.name || 'Theology Program',
      status: 'Submitted',
      applicationFeePaid: true,
      applicationFeeRef: 'DEMO-PAY-' + Math.floor(100000 + Math.random() * 900000),
      submittedAt: new Date().toISOString().substring(0, 10)
    });
    setAppNumber(num);
    setAppSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="bg-slate-950 border-b border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onBackToApp}>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            ✝
          </div>
          <div>
            <h1 className="font-bold text-white text-base">{settings.institutionName}</h1>
            <p className="text-xs text-amber-400">Public Portal & Verification Service</p>
          </div>
        </div>
        <button
          onClick={onBackToApp}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to ERP Dashboard</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {page === 'verify' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Public Certificate Verification</h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Enter the official Certificate Number or scan the QR code to verify the authenticity of academic awards issued by {settings.institutionName}.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-xl">
              <form onSubmit={handleVerify} className="flex gap-4 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Certificate Number (e.g., GRC-2026-8801)"
                    value={certCode}
                    onChange={(e) => setCertCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors text-sm"
                >
                  Verify Now
                </button>
              </form>

              {verifySearched && (
                <div className="mt-8 pt-8 border-t border-slate-800 animate-fade-in">
                  {verificationResult ? (
                    <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4">
                      <div className="inline-flex p-3 bg-emerald-500/20 text-emerald-400 rounded-full">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-emerald-400">VALID CERTIFICATE</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm">
                        <div>
                          <span className="text-slate-400 block text-xs">Student Name</span>
                          <span className="font-semibold text-white">{verificationResult.studentName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-xs">Award</span>
                          <span className="font-semibold text-white">{verificationResult.award}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-xs">Graduation Year</span>
                          <span className="font-semibold text-white">{verificationResult.graduationYear}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-xs">Institution</span>
                          <span className="font-semibold text-white">{verificationResult.institution}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-6 text-center space-y-2">
                      <h3 className="text-lg font-bold text-rose-400">Certificate Not Found</h3>
                      <p className="text-sm text-slate-400">No matching record found for certificate code "{certCode}". Please check the number and try again.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {page === 'apply' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white">Online Application for Admission</h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto">
                Begin your theological training journey with {settings.institutionName}. Fill out the application form below.
              </p>
            </div>

            {appSubmitted ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-xl">
                <div className="inline-flex p-4 bg-amber-500/20 text-amber-400 rounded-full">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Application Submitted Successfully!</h3>
                <p className="text-sm text-slate-300">Your application number is <span className="font-mono text-amber-400 font-bold">{appNumber}</span>.</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Our admissions committee will review your credentials, church endorsement, and references. You will be notified via email shortly.</p>
                <button
                  onClick={() => setAppSubmitted(false)}
                  className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={appForm.fullName}
                      onChange={e => setAppForm({...appForm, fullName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                      placeholder="e.g., John Mark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={appForm.email}
                      onChange={e => setAppForm({...appForm, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={appForm.phone}
                      onChange={e => setAppForm({...appForm, phone: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                      placeholder="+254 700 000 000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Select Program</label>
                    <select
                      value={appForm.programId}
                      onChange={e => setAppForm({...appForm, programId: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                    >
                      {programs.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Church Name</label>
                    <input
                      type="text"
                      required
                      value={appForm.churchName}
                      onChange={e => setAppForm({...appForm, churchName: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                      placeholder="Local Church Fellowship"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Pastor / Referee Name</label>
                    <input
                      type="text"
                      required
                      value={appForm.churchPastor}
                      onChange={e => setAppForm({...appForm, churchPastor: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white"
                      placeholder="Rev. Dr. Pastor Name"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center space-x-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Application</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {page === 'contact' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-white">Contact Admissions & Registrar</h2>
              <p className="text-sm text-slate-400">Get in touch with {settings.institutionName}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <MapPin className="w-6 h-6 text-amber-500" />
                <h3 className="font-bold text-white">Address</h3>
                <p className="text-xs text-slate-400">{settings.address}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <Phone className="w-6 h-6 text-amber-500" />
                <h3 className="font-bold text-white">Phone</h3>
                <p className="text-xs text-slate-400">{settings.phone}</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <Mail className="w-6 h-6 text-amber-500" />
                <h3 className="font-bold text-white">Email</h3>
                <p className="text-xs text-slate-400">{settings.email}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
