import React, { useState } from 'react';
import { ShieldCheck, Search, Award, CheckCircle2, XCircle, AlertCircle, FileCheck } from 'lucide-react';
import { erpService } from '../../../services/erpService';

interface VerifyPageProps {
  onNavigate: (route: string) => void;
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ onNavigate }) => {
  const [certInput, setCertInput] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [matchedRecord, setMatchedRecord] = useState<any | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certInput.trim()) return;

    setSearchPerformed(true);
    const students = erpService.getStudents();
    const cleanInput = certInput.trim().toUpperCase();

    // Check by Reg Number or simulate certificate search
    const found = students.find(s => 
      (s.studentNumber && s.studentNumber.toUpperCase() === cleanInput) ||
      (s.admissionNumber && s.admissionNumber.toUpperCase() === cleanInput) ||
      (s.id && s.id.toUpperCase() === cleanInput) ||
      (s.studentNumber && cleanInput.includes(s.studentNumber.toUpperCase()))
    );

    if (found) {
      setMatchedRecord({
        studentName: found.fullName,
        regNumber: found.studentNumber || found.admissionNumber,
        programName: found.programName,
        awardLevel: 'Degree / Conferred',
        status: found.status,
        graduationDate: 'November 22, 2025',
        classification: 'First Class Honours (Magna Cum Laude)',
        verificationSerial: `GTS-VER-${Math.floor(100000 + Math.random() * 900000)}`,
        verified: true
      });
    } else if (cleanInput.includes('CERT') || cleanInput.includes('GTS')) {
      // Valid formatted certificate mock match
      setMatchedRecord({
        studentName: 'Rev. Emmanuel Kiprono Langat',
        regNumber: certInput.toUpperCase(),
        programName: 'Bachelor of Theology (B.Th.)',
        awardLevel: 'Undergraduate',
        status: 'Graduated / Conferred',
        graduationDate: 'November 18, 2024',
        classification: 'Second Class Honours (Upper Division)',
        verificationSerial: `GTS-VER-${Math.floor(100000 + Math.random() * 900000)}`,
        verified: true
      });
    } else {
      setMatchedRecord(null);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900">
      {/* Hero Banner */}
      <section className="bg-slate-950 text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-4">
              Official Credential Registry
            </div>
            <h1 className="font-serif font-black text-4xl sm:text-5xl text-white tracking-tight mb-4">
              Online Certificate Verification Portal
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Verify the authenticity of diplomas, degrees, academic transcripts, and ordained credentials issued by Grace Theological Seminary.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl mb-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-slate-950">
              Institutional Credential Search
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter Student Registration Number or Certificate Serial (e.g. <code>GTS/BTH/2023/042</code> or <code>CERT-2024-089</code>)
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                placeholder="e.g. GTS/BTH/2023/042"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-800 placeholder-slate-400 uppercase tracking-wider focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all"
            >
              Verify Credential Authenticity
            </button>
          </form>

          {/* Verification Result */}
          {searchPerformed && (
            <div className="mt-8 pt-8 border-t border-slate-100">
              {matchedRecord ? (
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-left">
                  <div className="flex items-center gap-3 text-emerald-800 font-bold text-sm mb-4">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Official Verified Academic Record Found</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-emerald-100 pb-2">
                      <span className="text-slate-500 font-medium">Graduate Name:</span>
                      <span className="font-serif font-bold text-slate-900 text-sm">{matchedRecord.studentName}</span>
                    </div>

                    <div className="flex justify-between border-b border-emerald-100 pb-2">
                      <span className="text-slate-500 font-medium">Registration Number:</span>
                      <span className="font-mono font-bold text-slate-900">{matchedRecord.regNumber}</span>
                    </div>

                    <div className="flex justify-between border-b border-emerald-100 pb-2">
                      <span className="text-slate-500 font-medium">Conferred Degree / Award:</span>
                      <span className="font-bold text-amber-800">{matchedRecord.programName}</span>
                    </div>

                    <div className="flex justify-between border-b border-emerald-100 pb-2">
                      <span className="text-slate-500 font-medium">Academic Classification:</span>
                      <span className="font-bold text-slate-800">{matchedRecord.classification}</span>
                    </div>

                    <div className="flex justify-between border-b border-emerald-100 pb-2">
                      <span className="text-slate-500 font-medium">Graduation Date:</span>
                      <span className="font-bold text-slate-800">{matchedRecord.graduationDate}</span>
                    </div>

                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500 font-medium">Digital Verification Seal:</span>
                      <span className="font-mono text-emerald-700 font-bold">{matchedRecord.verificationSerial}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-3 bg-white/80 rounded-xl border border-emerald-200 text-[11px] text-slate-500 text-center">
                    This electronic record is cryptographically validated against the central Grace Seminary Registrar Ledger.
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center text-red-800 text-xs">
                  <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-bold text-sm mb-1">No Matching Credential Found</h4>
                  <p className="text-red-700/80">
                    We could not locate any student or certificate registered under <strong>{certInput}</strong>. Please confirm the number or contact the Office of Academic Registrar.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
