import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link as LinkIcon, Trash2, Check, Sparkles, RefreshCw } from 'lucide-react';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface LogoUploaderProps {
  currentLogoUrl?: string;
  onLogoChange: (url: string) => void;
  institutionName?: string;
}

const PRESET_CRESTS = [
  {
    name: 'Veritas Cross Crest',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=240',
    desc: 'Classic classical seal'
  },
  {
    name: 'Open Scriptures & Light',
    url: 'https://images.unsplash.com/photo-1507842229451-79731e71a802?auto=format&fit=crop&q=80&w=240',
    desc: 'Golden open bible'
  },
  {
    name: 'Seminary Tower & Cross',
    url: 'https://images.unsplash.com/photo-1548625361-195fe57e937d?auto=format&fit=crop&q=80&w=240',
    desc: 'Historical collegiate crest'
  },
  {
    name: 'Sola Scriptura Shield',
    url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&q=80&w=240',
    desc: 'Reformation academic emblem'
  }
];

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl = '',
  onLogoChange,
  institutionName = 'Grace Theological Seminary'
}) => {
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [urlInput, setUrlInput] = useState(currentLogoUrl);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'navy' | 'white'>('navy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    setUploading(true);
    try {
      // First create local base64 data url for instant reliable preview & offline persistence
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Url = e.target?.result as string;
        setLogoUrl(base64Url);
        setUrlInput(base64Url);
        onLogoChange(base64Url);

        // Optionally upload to Firebase Storage in background if online
        try {
          if (storage) {
            const storageRef = ref(storage, `logos/institution_logo_${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadUrl = await getDownloadURL(snapshot.ref);
            if (downloadUrl) {
              setLogoUrl(downloadUrl);
              setUrlInput(downloadUrl);
              onLogoChange(downloadUrl);
            }
          }
        } catch (storageErr) {
          console.warn('Firebase storage upload fallback to data URL:', storageErr);
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('File processing error:', err);
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      setLogoUrl(urlInput.trim());
      onLogoChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    setLogoUrl('');
    setUrlInput('');
    onLogoChange('');
  };

  return (
    <div className="bg-slate-900/5 border border-slate-200 rounded-2xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-serif font-bold text-slate-900 text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-600" />
            <span>Institution Logo & Seal</span>
          </h3>
          <p className="text-xs text-slate-500">
            Upload your official institution emblem, coat of arms, or logo. It will appear on the public website header, footer, admissions letter, and ERP portal.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Drop zone & file picker */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
              isDragging 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-slate-300 hover:border-amber-500 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileProcess(e.target.files[0]);
                }
              }}
            />

            <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-3 shadow-xs">
              <Upload className={`w-6 h-6 ${uploading ? 'animate-bounce' : ''}`} />
            </div>

            <p className="text-sm font-bold text-slate-800 mb-1">
              {uploading ? 'Processing Image...' : 'Click to Upload or Drag & Drop'}
            </p>
            <p className="text-xs text-slate-500">
              High resolution PNG with transparent background recommended (max 5MB). SVG, JPG, WebP also supported.
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
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>
            <button
              type="button"
              onClick={handleUrlApply}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors"
            >
              Apply URL
            </button>
          </div>
        </div>

        {/* Live Logo Preview Box */}
        <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Live Logo Preview</span>
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
            {logoUrl ? (
              <div className="flex items-center gap-3 max-w-full">
                <img
                  src={logoUrl}
                  alt="Institution Logo"
                  className="max-h-20 max-w-[120px] object-contain rounded-md"
                  onError={() => {
                    console.warn('Could not load provided logo image url');
                  }}
                />
                <div className="text-left">
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

          <p className="text-[11px] text-slate-500 text-center">
            {logoUrl ? '✓ Custom logo configured and synced' : 'No custom image set; using default institution seal'}
          </p>
        </div>
      </div>

      {/* Recommended Theological Presets */}
      <div className="pt-2 border-t border-slate-200/80">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Quick Theological Crest Presets (Click to use)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRESET_CRESTS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setLogoUrl(preset.url);
                setUrlInput(preset.url);
                onLogoChange(preset.url);
              }}
              className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:shadow-xs text-left transition-all group cursor-pointer"
            >
              <img
                src={preset.url}
                alt={preset.name}
                className="w-8 h-8 rounded-lg object-cover group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-600">
                  {preset.name}
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
