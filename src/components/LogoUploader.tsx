import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, Link as LinkIcon, Trash2, CheckCircle, 
  AlertCircle, Loader2, Sparkles, ShieldCheck, Check
} from 'lucide-react';
import { brandingService, getInstitutionId } from '../services/brandingService';

interface LogoUploaderProps {
  currentLogoUrl?: string;
  onLogoChange: (url: string) => void;
  institutionName?: string;
  institutionId?: string;
  onUploadStateChange?: (uploading: boolean) => void;
}

const PRESET_CRESTS = [
  {
    name: 'Apostolic Cross & Bible',
    desc: 'Golden open scripture & Latin cross',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=240'
  },
  {
    name: 'Seminary Seal & Crest',
    desc: 'Deep royal blue with golden laurels',
    url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=240'
  },
  {
    name: 'Redeemer Dove & Flame',
    desc: 'Holy Spirit fire and apostolic mission',
    url: 'https://images.unsplash.com/photo-1507842229451-79731e71a802?auto=format&fit=crop&q=80&w=240'
  },
  {
    name: 'Ancient Codex Scripture',
    desc: 'Historical Greek-Hebrew biblical heritage',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=240'
  }
];

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl = '',
  onLogoChange,
  institutionName = 'Victory International Apostolic Biblical Institute',
  institutionId,
  onUploadStateChange
}) => {
  const activeInstitutionId = institutionId || getInstitutionId();

  const [logoUrl, setLogoUrl] = useState<string>(currentLogoUrl || '');
  const [urlInput, setUrlInput] = useState<string>(currentLogoUrl || '');
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [previewMode, setPreviewMode] = useState<'navy' | 'white'>('navy');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when currentLogoUrl prop changes (e.g. after async Firestore load)
  useEffect(() => {
    if (currentLogoUrl !== undefined && !uploading && !savingUrl) {
      setLogoUrl(currentLogoUrl || '');
      setUrlInput(currentLogoUrl || '');
    }
  }, [currentLogoUrl, uploading, savingUrl]);

  const updateUploadState = (isBusy: boolean) => {
    setUploading(isBusy);
    if (onUploadStateChange) {
      onUploadStateChange(isBusy);
    }
  };

  const handleFileProcess = async (file: File) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Invalid file format. Please upload an image (PNG, JPG, SVG, WebP).');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    // Create a temporary object URL strictly for visual preview during upload
    const tempUrl = URL.createObjectURL(file);
    setTempPreviewUrl(tempUrl);
    updateUploadState(true);

    try {
      // Upload directly to Firebase Storage: institutions/{institutionId}/branding/logo
      // And automatically persist download URL to Firestore: institutions/{institutionId}/settings/website
      const downloadUrl = await brandingService.uploadInstitutionLogo(file, activeInstitutionId);

      // Clean up temporary object URL
      URL.revokeObjectURL(tempUrl);
      setTempPreviewUrl(null);

      // Update local state and inform parent of new permanent Firebase Storage URL
      setLogoUrl(downloadUrl);
      setUrlInput(downloadUrl);
      onLogoChange(downloadUrl);
      setSuccessMessage('Logo successfully uploaded to Firebase Storage and persisted to Firestore.');
    } catch (err: any) {
      console.error('Firebase Storage upload failed:', err);
      // Clean up temp preview
      URL.revokeObjectURL(tempUrl);
      setTempPreviewUrl(null);

      // Requirement 7: Keep previous saved logo and show clear error message
      setErrorMessage(err.message || 'Firebase Storage upload failed. Previous logo was preserved.');
    } finally {
      updateUploadState(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleUrlApply = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmed = urlInput.trim();
    if (!trimmed) {
      setErrorMessage('Please enter an image URL.');
      return;
    }

    if (trimmed.startsWith('data:')) {
      setErrorMessage('Base64 data URLs cannot be saved. Please upload the image file directly.');
      return;
    }

    setSavingUrl(true);
    try {
      const validatedUrl = await brandingService.saveExternalLogoUrl(trimmed, activeInstitutionId);
      setLogoUrl(validatedUrl);
      onLogoChange(validatedUrl);
      setSuccessMessage('External logo URL applied and saved to Firestore.');
    } catch (err: any) {
      console.error('Failed to apply external URL:', err);
      setErrorMessage(err.message || 'Could not validate or save the provided URL.');
    } finally {
      setSavingUrl(false);
    }
  };

  const handleClear = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await brandingService.removeInstitutionLogo(activeInstitutionId);
      setLogoUrl('');
      setUrlInput('');
      setTempPreviewUrl(null);
      onLogoChange('');
      setSuccessMessage('Logo removed from Firestore and institution branding.');
    } catch (err: any) {
      console.error('Failed to remove logo:', err);
      setErrorMessage('Failed to remove logo from Firestore. Please try again.');
    }
  };

  const handlePresetSelect = async (presetUrl: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    setSavingUrl(true);
    try {
      const validatedUrl = await brandingService.saveExternalLogoUrl(presetUrl, activeInstitutionId);
      setLogoUrl(validatedUrl);
      setUrlInput(validatedUrl);
      onLogoChange(validatedUrl);
      setSuccessMessage('Official preset seal selected and saved to Firestore.');
    } catch (err: any) {
      console.error('Failed to apply preset logo:', err);
      setErrorMessage('Could not apply preset logo.');
    } finally {
      setSavingUrl(false);
    }
  };

  const displayLogo = tempPreviewUrl || logoUrl;

  return (
    <div className="bg-slate-900/5 border border-slate-200 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>Institution Logo & Seal</span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              Firebase Storage + Firestore
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Upload your official institution emblem or coat of arms. It will persist permanently in Firebase Storage and Firestore.
          </p>
        </div>

        {logoUrl && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Logo</span>
          </button>
        )}
      </div>

      {/* Notifications: Error and Success banners */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Logo Upload Error</p>
            <p>{errorMessage}</p>
          </div>
          <button 
            type="button"
            onClick={() => setErrorMessage(null)} 
            className="text-rose-500 hover:text-rose-800 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 font-medium animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Persistence Confirmed</p>
            <p>{successMessage}</p>
          </div>
          <button 
            type="button"
            onClick={() => setSuccessMessage(null)} 
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Drop zone & file picker */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
              uploading 
                ? 'border-amber-400 bg-amber-50/50 cursor-wait' 
                : isDragging 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-slate-300 hover:border-amber-500 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                  e.target.value = ''; // Reset input so same file can be re-uploaded if needed
                }
              }}
            />

            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-3 shadow-xs">
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
              ) : (
                <Upload className="w-6 h-6" />
              )}
            </div>

            <p className="text-sm font-bold text-slate-800 mb-1">
              {uploading ? 'Uploading to Firebase Storage...' : 'Click to Upload or Drag & Drop'}
            </p>
            <p className="text-xs text-slate-500">
              High resolution PNG with transparent background recommended (max 5MB). Stored at <span className="font-mono text-[11px] text-slate-700 bg-slate-100 px-1 py-0.5 rounded">institutions/{activeInstitutionId}/branding/logo</span>
            </p>
          </div>

          {/* Direct URL input option */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste an image URL (https://...)"
                disabled={uploading || savingUrl}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 disabled:bg-slate-100"
              />
            </div>
            <button
              type="button"
              onClick={handleUrlApply}
              disabled={uploading || savingUrl || !urlInput.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              {savingUrl ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Apply URL</span>
              )}
            </button>
          </div>
        </div>

        {/* Live Logo Preview Box */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>Live Logo Preview</span>
              {uploading && (
                <span className="text-[10px] text-amber-600 font-bold animate-pulse">
                  (Uploading...)
                </span>
              )}
            </div>
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setPreviewMode('navy')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                  previewMode === 'navy' ? 'bg-[#0A192F] text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dark Nav
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('white')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                  previewMode === 'white' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Light
              </button>
            </div>
          </div>

          <div 
            className={`h-36 rounded-xl flex items-center justify-center p-4 transition-colors border ${
              previewMode === 'navy' 
                ? 'bg-[#0A192F] border-slate-800 text-white' 
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {displayLogo ? (
              <div className="flex items-center gap-3 max-w-full">
                <img
                  src={displayLogo}
                  alt="Institution Logo"
                  className="max-h-20 max-w-[120px] object-contain rounded-md"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    console.warn('Could not load provided logo image url');
                  }}
                />
                <div className="text-left min-w-0">
                  <div className="font-serif font-black text-sm leading-tight truncate max-w-[160px]">
                    {institutionName}
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-semibold">
                    Seminary Seal
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
                  ✝
                </div>
                <div className="text-xs text-slate-400 font-medium">Default Cross Seal Active</div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 text-center space-y-1">
            <p>
              {displayLogo 
                ? (tempPreviewUrl ? '⏳ Uploading to Firebase Storage...' : '✓ Permanent logo persisted in Firestore') 
                : 'No custom image set; default institution seal is active'}
            </p>
            {logoUrl && logoUrl.startsWith('https://firebasestorage.googleapis.com') && (
              <p className="text-[10px] font-mono text-emerald-600 font-semibold truncate max-w-xs mx-auto">
                ✓ Cloud Storage Verified
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Theological Presets */}
      <div className="pt-2 border-t border-slate-200/80">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Quick Theological Crest Presets (Click to use)</span>
          </div>
          <span className="text-[10px] text-slate-500">Auto-saves to Firestore</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_CRESTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              disabled={uploading || savingUrl}
              onClick={() => handlePresetSelect(preset.url)}
              className={`flex items-center gap-2.5 p-2 rounded-xl bg-white border hover:border-amber-500 hover:shadow-xs text-left transition-all group cursor-pointer ${
                logoUrl === preset.url ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="w-9 h-9 rounded-lg object-cover group-hover:scale-105 transition-transform shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-600 flex items-center justify-between">
                  <span>{preset.name}</span>
                  {logoUrl === preset.url && (
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate">{preset.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
