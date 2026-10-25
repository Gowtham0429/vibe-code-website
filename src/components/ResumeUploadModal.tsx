import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  FileUp, 
  ArrowRight
} from 'lucide-react';
import { MasterProfile } from '../types';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: (profile: MasterProfile) => void;
  onNavigateToJobMatches: () => void;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onProfileUpdated,
  onNavigateToJobMatches
}) => {
  const [activeMode, setActiveMode] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parsedCandidateName, setParsedCandidateName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      let payload: any = {};

      if (activeMode === 'file') {
        if (!selectedFile) {
          setErrorMessage('Please select a resume file (PDF or TXT).');
          setIsProcessing(false);
          return;
        }

        // Convert file to base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Strip data:application/pdf;base64, prefix if present
            const base64 = result.includes(',') ? result.split(',')[1] : result;
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        payload = {
          fileBase64: base64Data,
          mimeType: selectedFile.type || 'application/pdf',
          fileName: selectedFile.name
        };
      } else {
        if (!resumeText.trim()) {
          setErrorMessage('Please paste your resume content.');
          setIsProcessing(false);
          return;
        }
        payload = {
          resumeText
        };
      }

      const res = await fetch('/api/upload-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to parse resume');
      }

      if (data.profile) {
        onProfileUpdated(data.profile);
        setParsedCandidateName(data.profile.personalInfo.fullName);
        setUploadSuccess(true);
      }
    } catch (err: any) {
      console.error('Resume upload error:', err);
      setErrorMessage(err.message || 'Error processing resume. Please try pasting the text instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#262016]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card-3d-elevated bg-white border border-[rgba(218,196,156,0.55)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8C7E6A] hover:text-[#2A2318] p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!uploadSuccess ? (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF3E5] border border-[#DFCBA7] text-[#8C6D2D] text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B88E44]" />
                <span>AI Resume Ingestion Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2A2318] tracking-tight">
                Upload Your Resume
              </h2>
              <p className="text-xs sm:text-sm text-[#7A6F5D] mt-1">
                Upload your existing resume (PDF or TXT). DataPulse will extract your skills and work history, suggest high-match roles, and allow you to apply directly!
              </p>
            </div>

            {/* Toggle File vs Text */}
            <div className="flex bg-[#F5EFE4] p-1 rounded-xl border border-[rgba(218,196,156,0.5)] text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveMode('file')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeMode === 'file' 
                    ? 'btn-gold-3d text-white shadow-sm' 
                    : 'text-[#7A6F5D] hover:text-[#2A2318]'
                }`}
              >
                Upload File (PDF / TXT)
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('text')}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  activeMode === 'text' 
                    ? 'btn-gold-3d text-white shadow-sm' 
                    : 'text-[#7A6F5D] hover:text-[#2A2318]'
                }`}
              >
                Paste Plain Text
              </button>
            </div>

            {/* File Dropzone */}
            {activeMode === 'file' ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[rgba(200,159,86,0.45)] hover:border-[#C89F56] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#FAF7F0]/80 hover:bg-[#F7EFE1]"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#FAF2E2] to-[#F1E3CB] border border-[#DFCBA7] text-[#8C6D2D] flex items-center justify-center mb-3 shadow-sm">
                  <UploadCloud className="w-7 h-7 text-[#B88E44]" />
                </div>
                {selectedFile ? (
                  <div>
                    <span className="font-semibold text-[#2A2318] text-sm block">{selectedFile.name}</span>
                    <span className="text-xs text-[#7A6F5D]">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Click to change file
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="font-semibold text-[#2A2318] text-sm block">
                      Click to choose or drag & drop your resume
                    </span>
                    <span className="text-xs text-[#7A6F5D] mt-1 block">
                      Supports PDF, TXT (ATS parsable format)
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="text-xs font-medium text-[#6B5E4A] block mb-1">
                  Paste Resume Content (Work Experience, Skills, Education)
                </label>
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                  className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-xl p-3 text-xs text-[#2A2318] placeholder-[#9E9280] focus:outline-none focus:border-[#C89F56] focus:bg-white font-mono leading-relaxed"
                />
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-2 border-t border-[rgba(218,196,156,0.35)]">
              <button
                type="button"
                onClick={onClose}
                className="btn-white-3d px-4 py-2 rounded-xl text-[#6B5E4A] text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isProcessing}
                className="btn-gold-3d inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all"
              >
                {isProcessing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Extracting Profile with Gemini...</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4" />
                    <span>Parse & Match Jobs</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#FAF4EA] to-[#F1E5D1] border border-[#DFCBA7] text-[#8C6D2D] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-[#B88E44]" />
            </div>

            <h3 className="text-xl font-bold text-[#2A2318]">
              Resume Successfully Ingested!
            </h3>
            <p className="text-xs sm:text-sm text-[#6B5E4A] max-w-md mx-auto">
              Welcome, <strong className="text-[#8C6D2D]">{parsedCandidateName || 'Candidate'}</strong>! Your master profile has been updated. We have generated tailored Data Analytics role recommendations matching your exact technical skills.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onNavigateToJobMatches();
                }}
                className="btn-gold-3d w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-white font-bold text-xs shadow-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>View My Recommended Jobs & Apply</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
