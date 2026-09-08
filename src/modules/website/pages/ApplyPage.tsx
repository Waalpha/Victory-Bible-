import React, { useState } from 'react';
import { 
  GraduationCap, CheckCircle2, ArrowRight, ArrowLeft, 
  User, Mail, Phone, Church, BookOpen, ShieldCheck, FileCheck, Copy, ExternalLink 
} from 'lucide-react';
import { erpService } from '../../../services/erpService';

interface ApplyPageProps {
  initialProgramId?: string | null;
  onNavigate: (route: string) => void;
}

export const ApplyPage: React.FC<ApplyPageProps> = ({ initialProgramId, onNavigate }) => {
  const programs = erpService.getPrograms();
  const settings = erpService.getWebsiteSettings();

  const [currentStep, setCurrentStep] = useState(1);
  const [copiedAppNum, setCopiedAppNum] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    nationality: 'Kenyan',
    nationalId: '',
    
    // Step 2: Residence & Next of Kin
    address: '',
    nextOfKinName: '',
    nextOfKinPhone: '',
    nextOfKinRelation: 'Parent / Spouse',

    // Step 3: Christian Testimony & Church
    churchName: '',
    churchPastor: '',
    pastorPhone: '',
    baptismYear: '',
    salvationTestimony: '',

    // Step 4: Academic History
    highestQualification: 'Secondary School Certificate (KCSE)',
    previousInstitution: '',
    graduationYear: '2024',

    // Step 5: Program & Intake
    programId: initialProgramId || programs[0]?.id || '',
    intake: 'September Main Intake 2026/2027',
    studyMode: 'Residential Full-Time',

    // Step 6: Referees
    refereeName: '',
    refereePhone: '',
    refereeRole: 'Senior Pastor',

    // Step 7: Agreement
    agreedToTerms: false
  });

  const [submittedAppNumber, setSubmittedAppNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations per step
    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setErrorMessage('Please fill in your full name, email address, and phone number.');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.address.trim() || !formData.nextOfKinName.trim() || !formData.nextOfKinPhone.trim()) {
        setErrorMessage('Please provide your address and next of kin details.');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.churchName.trim() || !formData.churchPastor.trim() || !formData.pastorPhone.trim()) {
        setErrorMessage('Please provide your home church and pastoral reference contact.');
        return;
      }
    } else if (currentStep === 4) {
      if (!formData.previousInstitution.trim()) {
        setErrorMessage('Please provide your previous school or institution.');
        return;
      }
    } else if (currentStep === 5) {
      if (!formData.programId) {
        setErrorMessage('Please select an academic program.');
        return;
      }
    } else if (currentStep === 6) {
      if (!formData.refereeName.trim() || !formData.refereePhone.trim()) {
        setErrorMessage('Please provide referee contact information.');
        return;
      }
    }

    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      setErrorMessage('Please review and agree to the institutional code of conduct and faith statement.');
      return;
    }

    const selectedProg = programs.find(p => p.id === formData.programId);
    const appNum = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Add to ERP & Firestore
    erpService.addApplicant({
      applicationNumber: appNum,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth || '2000-01-01',
      nationality: formData.nationality,
      address: formData.address,
      nextOfKinName: formData.nextOfKinName,
      nextOfKinPhone: formData.nextOfKinPhone,
      churchName: formData.churchName,
      churchPastor: formData.churchPastor,
      refereeName: formData.refereeName,
      refereePhone: formData.refereePhone,
      programId: formData.programId,
      programName: selectedProg?.name || 'Theological Degree',
      intake: formData.intake,
      status: 'Submitted',
      applicationFeePaid: true,
      applicationFeeRef: `MPESA-${Math.floor(10000000 + Math.random() * 90000000)}`,
      submittedAt: new Date().toISOString().substring(0, 10)
    });

    setSubmittedAppNumber(appNum);
  };

  const copyNumber = () => {
    if (submittedAppNumber) {
      navigator.clipboard.writeText(submittedAppNumber);
      setCopiedAppNum(true);
      setTimeout(() => setCopiedAppNum(false), 2000);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedAppNumber) {
    const selectedProg = programs.find(p => p.id === formData.programId);
    return (
      <div className="w-full bg-slate-50 min-h-screen py-16 text-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl text-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-md ring-8 ring-emerald-50">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-3 inline-block">
              Application Successfully Submitted
            </span>

            <h1 className="font-serif font-black text-2xl sm:text-3xl text-slate-950 mb-3">
              Welcome to Grace Seminary, {formData.fullName.split(' ')[0]}!
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              Your formal application for admission into the <span className="font-bold text-slate-900">{selectedProg?.name}</span> has been received and routed to the Academic Registrar and Admissions Committee.
            </p>

            {/* Application Tracking Box */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8 text-left">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Application Reference Number
                </span>
                <button
                  onClick={copyNumber}
                  className="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedAppNum ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <div className="font-mono font-black text-2xl text-slate-950 tracking-wider mb-4">
                {submittedAppNumber}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Intake Term</span>
                  <span className="font-bold text-slate-800">{formData.intake}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Study Mode</span>
                  <span className="font-bold text-slate-800">{formData.studyMode}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Registered Email</span>
                  <span className="font-bold text-slate-800 truncate block">{formData.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Home Church</span>
                  <span className="font-bold text-slate-800 truncate block">{formData.churchName}</span>
                </div>
              </div>
            </div>

            {/* Next Steps Checklist */}
            <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-200/80 text-left mb-8">
              <h4 className="font-serif font-bold text-sm text-amber-900 mb-2">
                Next Steps in Your Admission Journey:
              </h4>
              <ul className="text-xs text-amber-900/80 space-y-2">
                <li>• An official confirmation email has been dispatched with your admissions portal login credentials.</li>
                <li>• Our Admissions Officer will contact Pastor {formData.churchPastor} to verify pastoral recommendation.</li>
                <li>• You will be invited for a 20-minute Zoom or on-campus interview within 5 business days.</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('/')}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Return to Seminary Homepage
              </button>
              <button
                onClick={() => onNavigate('/programs')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Explore More Programs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 7-STEP APPLICATION WIZARD
  return (
    <div className="w-full bg-slate-50 min-h-screen py-12 text-slate-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200 inline-block mb-2">
            Official Online Admissions Form
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-slate-950 tracking-tight">
            Application for Theological Study
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            2026/2027 Academic Year • Victory International Apostolic Biblical Institute
          </p>
        </div>

        {/* Multi-Step Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8 flex items-center justify-between overflow-x-auto scrollbar-none gap-2">
          {[
            { num: 1, label: 'Personal' },
            { num: 2, label: 'Contact' },
            { num: 3, label: 'Church' },
            { num: 4, label: 'Education' },
            { num: 5, label: 'Program' },
            { num: 6, label: 'Referee' },
            { num: 7, label: 'Submit' }
          ].map((s) => (
            <div 
              key={s.num}
              className={`flex items-center gap-2 shrink-0 ${
                currentStep === s.num ? 'text-amber-700 font-bold' : currentStep > s.num ? 'text-emerald-700' : 'text-slate-400'
              }`}
            >
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentStep === s.num 
                    ? 'bg-amber-500 text-slate-950 shadow-xs' 
                    : currentStep > s.num 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {currentStep > s.num ? '✓' : s.num}
              </div>
              <span className="text-xs hidden sm:inline">{s.label}</span>
              {s.num < 7 && <span className="text-slate-300 ml-1">›</span>}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between">
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={currentStep === 7 ? handleFinalSubmit : handleNext}>
            {/* STEP 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-slate-950 border-b border-slate-100 pb-3">
                  Step 1: Personal Information
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Caleb Koech"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john.koech@gmail.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 712 345 678"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => handleChange('nationality', e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Address & Next of Kin */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-slate-950 border-b border-slate-100 pb-3">
                  Step 2: Contact & Next of Kin
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Permanent Residential Address / Town *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="P.O. Box 4500, Karen, Nairobi"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Next of Kin Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Mary Koech"
                      value={formData.nextOfKinName}
                      onChange={(e) => handleChange('nextOfKinName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Next of Kin Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 722 000 111"
                      value={formData.nextOfKinPhone}
                      onChange={(e) => handleChange('nextOfKinPhone', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Christian Testimony */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-slate-950 border-b border-slate-100 pb-3">
                  Step 3: Christian Testimony & Church Membership
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Home Church Name & Denomination *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Grace Baptist Church, Karen"
                    value={formData.churchName}
                    onChange={(e) => handleChange('churchName', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Senior Pastor Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Rev. Dr. David Maina"
                      value={formData.churchPastor}
                      onChange={(e) => handleChange('churchPastor', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Pastor Phone / Email *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+254 700 987 654"
                      value={formData.pastorPhone}
                      onChange={(e) => handleChange('pastorPhone', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Brief Statement of Faith & Ministry Calling (2-3 sentences)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="I trusted Christ as Lord and Savior in 2018. Over the past 4 years I have served in youth leadership and feel a distinct conviction toward pastoral preaching..."
                    value={formData.salvationTestimony}
                    onChange={(e) => handleChange('salvationTestimony', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* STEP 4: Educational Background */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-slate-950 border-b border-slate-100 pb-3">
                  Step 4: Academic Background
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Highest Completed Academic Qualification
                  </label>
                  <select
                    value={formData.highestQualification}
                    onChange={(e) => handleChange('highestQualification', e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    <option value="Secondary School Certificate (KCSE)">Secondary School Certificate (KCSE / High School)</option>
                    <option value="Diploma in Theology">Diploma in Theology / Biblical Studies</option>
                    <option value="Bachelor Degree (Secular or Theology)">Bachelor's Degree (Any Discipline)</option>
                    <option value="Master of Arts / Divinity">Master of Divinity / Master of Theology</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Previous School / College / University *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alliance High School / Kenyatta University"
                      value={formData.previousInstitution}
                      onChange={(e) => handleChange('previousInstitution', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Year Completed
                    </label>
                    <input
                      type="text"
                      value={formData.graduationYear}
                      onChange={(e) => handleChange('graduationYear', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Program Selection */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-slate-950 border-b border-slate-100 pb-3">
                  Step 5: Academic Program & Intake Selection
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Select Theological Program *
                  </label>
                  <select
                    value={formData.programId}
                    onChange={(e) => handleChange('programId', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.awardType}: {p.name} ({p.durationYears} {p.durationYears === 1 ? 'Year' : 'Years'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Preferred Enrollment Intake
                    </label>
                    <select
                      value={formData.intake}
                      onChange={(e) => handleChange('intake', e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    >
                      <option value="September Main Intake 2026/2027">September Main Intake 2026/2027</option>
                      <option value="January Intake 2027">January Intake 2027</option>
                      <option value="May Modular Intensive 2027">May Modular Intensive 2027</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Study Mode
                    </label>
                    <select
                      value={formData.studyMode}
                      onChange={(e) => handleChange('studyMode', e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    >
                      <option value="Residential Full-Time">Residential Full-Time (On-Campus)</option>
                      <option value="Commuter Day Student">Commuter Day Student</option>
                      <option value="Modular Block Intensive">Modular Block Intensive (Pastors)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Character Referee */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="font-serif font-bold text-xl text-slate-950 border-b border-slate-100 pb-3">
                  Step 6: Character & Academic Referee
                </h3>

                <p className="text-xs text-slate-500">
                  Please provide a second referee (church elder, Christian employer, or former teacher) who can testify to your Christian character and moral conduct.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Referee Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Elder James Wanyonyi"
                      value={formData.refereeName}
                      onChange={(e) => handleChange('refereeName', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Referee Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 733 444 555"
                      value={formData.refereePhone}
                      onChange={(e) => handleChange('refereePhone', e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: Review & Final Submission */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <h3 className="font-serif font-bold text-xl text-slate-950 border-b border-slate-100 pb-3">
                  Step 7: Review & Formal Declaration
                </h3>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Applicant:</span>
                    <span className="font-bold text-slate-900">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email & Phone:</span>
                    <span className="font-bold text-slate-900">{formData.email} • {formData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Selected Program:</span>
                    <span className="font-bold text-amber-700">
                      {programs.find(p => p.id === formData.programId)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Intake Term:</span>
                    <span className="font-bold text-slate-900">{formData.intake}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Church & Pastor:</span>
                    <span className="font-bold text-slate-900">{formData.churchName} (Pastor {formData.churchPastor})</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreedToTerms}
                      onChange={(e) => handleChange('agreedToTerms', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I solemnly affirm that the information supplied is true and accurate. I affirm my personal faith in the Lord Jesus Christ and promise to abide by the spiritual and academic statutes of Victory International Apostolic Biblical Institute.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('/programs')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Back to Catalogue
                </button>
              )}

              {currentStep < 7 ? (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Step {currentStep + 1}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 transition-all"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Submit Application</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
