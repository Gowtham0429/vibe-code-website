import React from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  Compass, 
  FileText, 
  Bot, 
  Layers, 
  ArrowRight, 
  X, 
  TrendingUp
} from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartUpload: () => void;
  onStartJobMatches: () => void;
  onStartDashboard: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onStartUpload,
  onStartJobMatches,
  onStartDashboard
}) => {
  if (!isOpen) return null;

  const handleDismiss = () => {
    localStorage.setItem('datapulse_welcome_seen', 'true');
    onClose();
  };

  const handleUploadClick = () => {
    handleDismiss();
    onStartUpload();
  };

  const handleMatchesClick = () => {
    handleDismiss();
    onStartJobMatches();
  };

  const handleDashboardClick = () => {
    handleDismiss();
    onStartDashboard();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#262016]/50 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="card-3d-elevated bg-white border border-[rgba(218,196,156,0.55)] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-200 my-8">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-[#8C7E6A] hover:text-[#2A2318] p-1 rounded-lg transition-colors"
          title="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF3E5] border border-[#DFCBA7] text-[#8C6D2D] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E44]" />
            <span>Welcome to DataPulse</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2A2318] tracking-tight">
            Your AI Job Application & Tracking Copilot
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E4A] leading-relaxed">
            DataPulse is purpose-built for early-career Data Analytics professionals to accelerate landing high-paying roles (Junior Data Analyst, BI Developer, Analytics Engineer) with personalized AI tooling.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          {/* Feature 1 */}
          <div className="card-3d p-3.5 rounded-2xl bg-[#FCFAF7] border border-[rgba(218,196,156,0.4)] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#8C6D2D] font-bold">
              <UploadCloud className="w-4 h-4 text-[#B88E44]" />
              <span>1. Resume Ingestion & Profile</span>
            </div>
            <p className="text-[#6B5E4A] leading-relaxed text-[11.5px]">
              Upload your PDF or text resume. DataPulse parses your SQL, Python, Tableau, dbt, and cloud warehouse skills automatically.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-3d p-3.5 rounded-2xl bg-[#FCFAF7] border border-[rgba(218,196,156,0.4)] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#8C6D2D] font-bold">
              <Compass className="w-4 h-4 text-[#B88E44]" />
              <span>2. AI Job Matches & Direct Apply</span>
            </div>
            <p className="text-[#6B5E4A] leading-relaxed text-[11.5px]">
              Explore curated positions matching your exact profile, view suitability scores, and 1-click apply with tailored materials.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-3d p-3.5 rounded-2xl bg-[#FCFAF7] border border-[rgba(218,196,156,0.4)] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#8C6D2D] font-bold">
              <FileText className="w-4 h-4 text-[#B88E44]" />
              <span>3. Anti-Hallucination Resume Tailor</span>
            </div>
            <p className="text-[#6B5E4A] leading-relaxed text-[11.5px]">
              Reframes your experience bullets to match target JDs without inventing fake metrics or unearned tools. Exports an ATS-clean PDF.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="card-3d p-3.5 rounded-2xl bg-[#FCFAF7] border border-[rgba(218,196,156,0.4)] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#8C6D2D] font-bold">
              <Bot className="w-4 h-4 text-[#B88E44]" />
              <span>4. Application Copilot (Pre-Filler)</span>
            </div>
            <p className="text-[#6B5E4A] leading-relaxed text-[11.5px]">
              Pre-fills contact and screening answers for Greenhouse and Lever. Intentionally pauses for your final review approval.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="card-3d p-3.5 rounded-2xl bg-[#FCFAF7] border border-[rgba(218,196,156,0.4)] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#8C6D2D] font-bold">
              <Layers className="w-4 h-4 text-[#B88E44]" />
              <span>5. Lifecycle Pipeline & Kanban</span>
            </div>
            <p className="text-[#6B5E4A] leading-relaxed text-[11.5px]">
              One-click stage updates from Applied to Shortlisted and Interview. Stores notes, salary targets, and recruiter feedback.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="card-3d p-3.5 rounded-2xl bg-[#FCFAF7] border border-[rgba(218,196,156,0.4)] space-y-1.5">
            <div className="flex items-center space-x-2 text-[#8C6D2D] font-bold">
              <TrendingUp className="w-4 h-4 text-[#B88E44]" />
              <span>6. Skill Gap Analytics & Chatbot</span>
            </div>
            <p className="text-[#6B5E4A] leading-relaxed text-[11.5px]">
              Pinpoints high-ROI learning areas from rejected roles. Practice technical SQL questions anytime with the 24/7 AI chatbot.
            </p>
          </div>
        </div>

        {/* Where to Start Guidance */}
        <div className="mt-6 pt-5 border-t border-[rgba(218,196,156,0.35)] space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#3B3224]">
            <span>Where would you like to start?</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={handleUploadClick}
              className="btn-gold-3d flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload My Resume (Recommended)</span>
            </button>

            <button
              onClick={handleMatchesClick}
              className="btn-white-3d inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl text-[#5A4E38] font-semibold text-xs"
            >
              <Compass className="w-4 h-4 text-[#B88E44]" />
              <span>Browse Job Matches</span>
            </button>

            <button
              onClick={handleDashboardClick}
              className="inline-flex items-center justify-center space-x-1 px-3 py-2.5 rounded-xl text-[#7A6F5D] hover:text-[#2A2318] text-xs font-medium transition-colors"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
