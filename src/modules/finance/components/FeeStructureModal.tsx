import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calculator, Sparkles, Check, Globe, HelpCircle, Layers } from 'lucide-react';
import { FeeStructure, FeeStructureItem, Program } from '../../../types';

interface FeeStructureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fee: FeeStructure) => void;
  initialData?: FeeStructure | null;
  programs: Program[];
}

const PRESET_TEMPLATES = [
  {
    name: 'Certificate Program (1 Year)',
    tuition: 25000,
    reg: 2500,
    lib: 3000,
    exam: 2000,
    act: 1500,
    hostel: 15000,
    notes: 'Includes foundational textbooks and chapel discipleship materials',
    customItems: [
      { id: 'c-1', name: 'ICT & Campus Wi-Fi', amount: 2000, category: 'Ancillary' as const }
    ]
  },
  {
    name: 'Diploma Program (2 Years)',
    tuition: 38000,
    reg: 2500,
    lib: 3000,
    exam: 2000,
    act: 1500,
    hostel: 15000,
    notes: 'Includes practical ministry field mentorship and supervision',
    customItems: [
      { id: 'c-2', name: 'Practical Ministry Practicum', amount: 3000, category: 'Other' as const },
      { id: 'c-3', name: 'ICT & Digital Resources', amount: 2000, category: 'Ancillary' as const }
    ]
  },
  {
    name: 'Bachelor of Theology (B.Th.)',
    tuition: 52000,
    reg: 2500,
    lib: 3000,
    exam: 2000,
    act: 1500,
    hostel: 15000,
    notes: 'Includes biblical Hebrew & Greek language labs and research journals',
    customItems: [
      { id: 'c-4', name: 'Biblical Hebrew & Greek Language Labs', amount: 3500, category: 'Laboratory' as const },
      { id: 'c-5', name: 'ICT & Theological Journal Access', amount: 2500, category: 'Ancillary' as const }
    ]
  },
  {
    name: 'Master of Divinity (M.Div.)',
    tuition: 68000,
    reg: 3000,
    lib: 4000,
    exam: 2500,
    act: 2000,
    hostel: 32000,
    notes: 'Full graduate research privileges and faculty mentoring',
    customItems: [
      { id: 'c-6', name: 'Graduate Research Seminar', amount: 4500, category: 'Ancillary' as const }
    ]
  },
  {
    name: 'Doctor of Ministry (D.Min.)',
    tuition: 95000,
    reg: 5000,
    lib: 5000,
    exam: 4000,
    act: 2000,
    hostel: 0,
    notes: 'Doctoral colloquiums and faculty dissertation mentoring',
    customItems: [
      { id: 'c-7', name: 'Doctoral Colloquium & Dissertation Supervision', amount: 15000, category: 'Other' as const }
    ]
  }
];

export const FeeStructureModal: React.FC<FeeStructureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  programs
}) => {
  const [formData, setFormData] = useState<Partial<FeeStructure>>({
    name: '',
    programId: programs[0]?.id || '',
    programName: programs[0]?.name || '',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    currency: 'KES',
    tuitionFee: 45000,
    registrationFee: 2500,
    libraryFee: 3000,
    examinationFee: 2000,
    activityFee: 1500,
    hostelFee: 15000,
    customItems: [],
    totalAmount: 69000,
    notes: 'Approved by the Board of Trustees and Academic Senate',
    publishedToWebsite: true
  });

  const [customItemName, setCustomItemName] = useState('');
  const [customItemAmount, setCustomItemAmount] = useState<number | ''>('');
  const [customItemCategory, setCustomItemCategory] = useState<'Tuition' | 'Ancillary' | 'Accommodation' | 'Laboratory' | 'Other'>('Ancillary');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        customItems: initialData.customItems || []
      });
    } else {
      setFormData({
        name: programs[0] ? `${programs[0].name} (2026/2027)` : 'General Fee Structure',
        programId: programs[0]?.id || '',
        programName: programs[0]?.name || '',
        academicYear: '2026/2027',
        semester: 'Semester 1',
        currency: 'KES',
        tuitionFee: 45000,
        registrationFee: 2500,
        libraryFee: 3000,
        examinationFee: 2000,
        activityFee: 1500,
        hostelFee: 15000,
        customItems: [
          { id: 'ci-' + Date.now(), name: 'ICT & Digital Campus Wi-Fi', amount: 2000, category: 'Ancillary' }
        ],
        totalAmount: 71000,
        notes: 'Approved by Seminary Board for the academic session',
        publishedToWebsite: true
      });
    }
  }, [initialData, programs, isOpen]);

  // Recalculate total amount whenever any fee component updates
  const calculateTotal = (data: Partial<FeeStructure>): number => {
    const tuition = Number(data.tuitionFee) || 0;
    const reg = Number(data.registrationFee) || 0;
    const lib = Number(data.libraryFee) || 0;
    const exam = Number(data.examinationFee) || 0;
    const act = Number(data.activityFee) || 0;
    const hostel = Number(data.hostelFee) || 0;
    const customTotal = (data.customItems || []).reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    return tuition + reg + lib + exam + act + hostel + customTotal;
  };

  const handleFieldChange = (field: keyof FeeStructure, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'programId') {
        const prog = programs.find(p => p.id === value);
        if (prog) {
          updated.programName = prog.name;
          if (!prev.name || prev.name.includes('(')) {
            updated.name = `${prog.name} (${updated.academicYear || '2026/2027'})`;
          }
        }
      }
      updated.totalAmount = calculateTotal(updated);
      return updated;
    });
  };

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim() || customItemAmount === '' || Number(customItemAmount) <= 0) return;

    const newItem: FeeStructureItem = {
      id: 'ci-' + Date.now(),
      name: customItemName.trim(),
      amount: Number(customItemAmount),
      category: customItemCategory
    };

    setFormData(prev => {
      const updatedItems = [...(prev.customItems || []), newItem];
      const updated = { ...prev, customItems: updatedItems };
      updated.totalAmount = calculateTotal(updated);
      return updated;
    });

    setCustomItemName('');
    setCustomItemAmount('');
  };

  const handleRemoveCustomItem = (id: string) => {
    setFormData(prev => {
      const updatedItems = (prev.customItems || []).filter(item => item.id !== id);
      const updated = { ...prev, customItems: updatedItems };
      updated.totalAmount = calculateTotal(updated);
      return updated;
    });
  };

  const handleApplyTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        tuitionFee: template.tuition,
        registrationFee: template.reg,
        libraryFee: template.lib,
        examinationFee: template.exam,
        activityFee: template.act,
        hostelFee: template.hostel,
        notes: template.notes,
        customItems: template.customItems.map((ci, idx) => ({ ...ci, id: 'ci-' + Date.now() + '-' + idx }))
      };
      updated.totalAmount = calculateTotal(updated);
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTotal = calculateTotal(formData);
    const feeToSave: FeeStructure = {
      id: initialData?.id || 'fee-' + Date.now(),
      name: formData.name?.trim() || `${formData.programName || 'Program'} Fee Structure`,
      programId: formData.programId || (programs[0]?.id ?? 'prog-1'),
      programName: formData.programName || (programs[0]?.name ?? 'Theology Program'),
      academicYear: formData.academicYear || '2026/2027',
      semester: formData.semester || 'Semester 1',
      currency: formData.currency || 'KES',
      tuitionFee: Number(formData.tuitionFee) || 0,
      registrationFee: Number(formData.registrationFee) || 0,
      libraryFee: Number(formData.libraryFee) || 0,
      examinationFee: Number(formData.examinationFee) || 0,
      activityFee: Number(formData.activityFee) || 0,
      hostelFee: Number(formData.hostelFee) || 0,
      customItems: formData.customItems || [],
      totalAmount: finalTotal,
      notes: formData.notes || '',
      publishedToWebsite: formData.publishedToWebsite !== false,
      createdAt: initialData?.createdAt || new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10)
    };

    onSave(feeToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                {initialData ? 'Edit Fee Structure' : 'Create Custom Fee Structure'}
              </h3>
              <p className="text-xs text-slate-400">
                Define tuition, semester ancillary rates, housing, and dynamic custom line items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Quick Presets / Templates Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2 text-amber-950 font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Load Theological Program Template (Optional Fast Setup):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_TEMPLATES.map((tmpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="px-3 py-1.5 bg-white hover:bg-amber-100/70 border border-amber-200 text-amber-900 rounded-xl font-semibold transition-colors cursor-pointer text-[11px]"
                >
                  {tmpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Core Info: Program, Title, Academic Period */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">Target Academic Program</label>
              <select
                value={formData.programId}
                onChange={e => handleFieldChange('programId', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                {programs.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code}) — {p.awardType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Currency Code</label>
              <select
                value={formData.currency}
                onChange={e => handleFieldChange('currency', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold font-mono focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="KES">KES (Kenyan Shilling)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="NGN">NGN (₦)</option>
                <option value="UGX">UGX (Uganda Shilling)</option>
                <option value="TZS">TZS (Tanzania Shilling)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">Fee Structure Title</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={e => handleFieldChange('name', e.target.value)}
                placeholder="e.g., Bachelor of Theology (2026/2027)"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Academic Year</label>
                <input
                  type="text"
                  required
                  value={formData.academicYear || ''}
                  onChange={e => handleFieldChange('academicYear', e.target.value)}
                  placeholder="2026/2027"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Semester / Term</label>
                <select
                  value={formData.semester}
                  onChange={e => handleFieldChange('semester', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Trimester 1">Trimester 1</option>
                  <option value="Trimester 2">Trimester 2</option>
                  <option value="Trimester 3">Trimester 3</option>
                  <option value="Modular Cohort">Modular Cohort</option>
                  <option value="Annual">Annual (Full Year)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Standard Fee Breakdown Components */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>Standard Fee Breakdown ({formData.currency})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Tuition Fee <span className="text-amber-600 font-mono">({formData.currency})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.tuitionFee}
                  onChange={e => handleFieldChange('tuitionFee', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Core teaching & faculty credits</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Registration Fee <span className="text-amber-600 font-mono">({formData.currency})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.registrationFee}
                  onChange={e => handleFieldChange('registrationFee', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Matriculation & enrollment</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Theological Library <span className="text-amber-600 font-mono">({formData.currency})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.libraryFee}
                  onChange={e => handleFieldChange('libraryFee', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Physical & digital database access</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Examination & Assessment <span className="text-amber-600 font-mono">({formData.currency})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.examinationFee}
                  onChange={e => handleFieldChange('examinationFee', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Invigilation & moderation fees</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Chapel & Student Welfare <span className="text-amber-600 font-mono">({formData.currency})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.activityFee}
                  onChange={e => handleFieldChange('activityFee', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Devotions, guild, and community care</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label className="block font-bold text-slate-800 mb-1">
                  Hostel / Dormitory <span className="text-amber-600 font-mono">({formData.currency})</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.hostelFee}
                  onChange={e => handleFieldChange('hostelFee', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Campus boarding (leave 0 if non-residential)</span>
              </div>
            </div>
          </div>

          {/* Dynamic Custom Line Items */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Custom Line Items & Special Fees</h4>
                <p className="text-[11px] text-slate-500">
                  Add program-specific fees such as Greek/Hebrew labs, ICT Wi-Fi, Practicum field attachment, or medical cover
                </p>
              </div>
            </div>

            {/* List of current custom items */}
            {formData.customItems && formData.customItems.length > 0 ? (
              <div className="space-y-2">
                {formData.customItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {item.category || 'Ancillary'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900">
                        {formData.currency} {item.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-slate-400 text-xs italic bg-white/60 rounded-xl border border-dashed border-slate-200">
                No custom line items added yet. You can add one below.
              </div>
            )}

            {/* Add Custom Item Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-2 border-t border-slate-200">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Item Name (e.g. Greek Language Lab)"
                  value={customItemName}
                  onChange={e => setCustomItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="number"
                  min="0"
                  placeholder="Amount"
                  value={customItemAmount}
                  onChange={e => setCustomItemAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-mono font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <select
                  value={customItemCategory}
                  onChange={e => setCustomItemCategory(e.target.value as any)}
                  className="w-full px-2 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium"
                >
                  <option value="Ancillary">Ancillary</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Tuition">Tuition</option>
                  <option value="Accommodation">Hostel</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  className="w-full h-full px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notes & Remarks */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Remarks & Prospectus Notes</label>
            <input
              type="text"
              value={formData.notes || ''}
              onChange={e => handleFieldChange('notes', e.target.value)}
              placeholder="e.g. Includes biblical Hebrew & Greek language labs and physical textbooks"
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900"
            />
          </div>

          {/* Website Publishing Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold block text-xs text-white">Publish to Public Website Fee Schedule</span>
                <span className="text-[10px] text-slate-400">
                  When enabled, this fee structure is instantly visible to prospective students on the public website (<code className="text-amber-300 font-mono">/fees</code>)
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.publishedToWebsite !== false}
                onChange={e => handleFieldChange('publishedToWebsite', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          {/* Live Total Calculation Card */}
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                Total Semester Package Fee
              </span>
              <p className="text-[11px] text-amber-800">
                Sum of tuition, registration, ancillary services, hostel and custom items
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-amber-800 mr-1.5">{formData.currency}</span>
              <span className="text-3xl font-black font-mono text-slate-950">
                {calculateTotal(formData).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Save Changes' : 'Save & Publish Fee Structure'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
