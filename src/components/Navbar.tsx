import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Bot, 
  Layers, 
  User, 
  Sparkles, 
  Briefcase, 
  Compass, 
  UploadCloud,
  MessageSquareText,
  HelpCircle
} from 'lucide-react';
import { ApplicationRecord } from '../types';

export type NavTab = 'dashboard' | 'matches' | 'tailor' | 'copilot' | 'tracker' | 'chat' | 'profile';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  applications: ApplicationRecord[];
  onOpenUploadModal: () => void;
  onOpenWelcomeModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  applications,
  onOpenUploadModal,
  onOpenWelcomeModal
}) => {
  const total = applications.length;
  const interviews = applications.filter(a => a.status === 'INTERVIEW').length;
  const shortlisted = applications.filter(a => a.status === 'SHORTLISTED').length;

  return (
    <header className="sticky top-0 z-50 bg-[#FAF8F5]/92 backdrop-blur-md border-b border-[#E7D9C3] shadow-[0_2px_12px_rgba(180,150,100,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#FBF6EC] via-[#F4E9D2] to-[#E8D6B5] border border-[#D4BF96] flex items-center justify-center shadow-[0_3px_8px_rgba(180,140,70,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]">
              <Briefcase className="w-5 h-5 text-[#8F6C2C]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight text-[#2B2720]">
                  DataPulse
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#F4EADC] text-[#866324] border border-[#DECDB3]">
                  Data Analytics
                </span>
              </div>
              <p className="text-[11px] text-[#786E5E] leading-none mt-0.5">Resume Tailor & Direct Apply</p>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="hidden xl:flex items-center space-x-4 bg-[#F3EDE2] px-3.5 py-1.5 rounded-xl border border-[#DFD1BD] shadow-inner text-xs">
            <div className="flex items-center space-x-1.5 text-[#544D40]">
              <span className="w-2 h-2 rounded-full bg-[#B88E44]"></span>
              <span className="text-[#786F60]">Applications:</span>
              <span className="font-bold text-[#2A261F]">{total}</span>
            </div>
            <span className="text-[#C8B89F]">|</span>
            <div className="flex items-center space-x-1.5 text-[#544D40]">
              <span className="w-2 h-2 rounded-full bg-[#658B5B]"></span>
              <span className="text-[#786F60]">Shortlisted:</span>
              <span className="font-bold text-[#4D7543]">{shortlisted}</span>
            </div>
            <span className="text-[#C8B89F]">|</span>
            <div className="flex items-center space-x-1.5 text-[#544D40]">
              <span className="w-2 h-2 rounded-full bg-[#9B6A88]"></span>
              <span className="text-[#786F60]">Interviews:</span>
              <span className="font-bold text-[#865172]">{interviews}</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-white text-[#26231C] font-semibold border border-[#D5BF96] shadow-[0_2px_6px_rgba(180,140,80,0.12),inset_0_1px_0_rgba(255,255,255,1)]' 
                  : 'text-[#696152] hover:text-[#26231C] hover:bg-[#F3ECE0]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#A67E38]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'matches' 
                  ? 'bg-white text-[#26231C] font-semibold border border-[#D5BF96] shadow-[0_2px_6px_rgba(180,140,80,0.12),inset_0_1px_0_rgba(255,255,255,1)]' 
                  : 'text-[#696152] hover:text-[#26231C] hover:bg-[#F3ECE0]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#A67E38]" />
              <span>Job Matches</span>
            </button>

            <button
              onClick={() => setActiveTab('tailor')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'tailor' 
                  ? 'bg-white text-[#26231C] font-semibold border border-[#D5BF96] shadow-[0_2px_6px_rgba(180,140,80,0.12),inset_0_1px_0_rgba(255,255,255,1)]' 
                  : 'text-[#696152] hover:text-[#26231C] hover:bg-[#F3ECE0]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#A67E38]" />
              <span>Tailor Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('copilot')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'copilot' 
                  ? 'bg-white text-[#26231C] font-semibold border border-[#D5BF96] shadow-[0_2px_6px_rgba(180,140,80,0.12),inset_0_1px_0_rgba(255,255,255,1)]' 
                  : 'text-[#696152] hover:text-[#26231C] hover:bg-[#F3ECE0]'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-[#5F8754]" />
              <span>Pre-Filler</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'tracker' 
                  ? 'bg-white text-[#26231C] font-semibold border border-[#D5BF96] shadow-[0_2px_6px_rgba(180,140,80,0.12),inset_0_1px_0_rgba(255,255,255,1)]' 
                  : 'text-[#696152] hover:text-[#26231C] hover:bg-[#F3ECE0]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#A67E38]" />
              <span>Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'chat' 
                  ? 'bg-white text-[#26231C] font-semibold border border-[#D5BF96] shadow-[0_2px_6px_rgba(180,140,80,0.12),inset_0_1px_0_rgba(255,255,255,1)]' 
                  : 'text-[#696152] hover:text-[#26231C] hover:bg-[#F3ECE0]'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5 text-[#885978]" />
              <span>AI Chatbot</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'profile' 
                  ? 'bg-white text-[#26231C] font-semibold border border-[#D5BF96] shadow-[0_2px_6px_rgba(180,140,80,0.12),inset_0_1px_0_rgba(255,255,255,1)]' 
                  : 'text-[#696152] hover:text-[#26231C] hover:bg-[#F3ECE0]'
              }`}
            >
              <User className="w-3.5 h-3.5 text-[#A67E38]" />
              <span className="hidden md:inline">Profile</span>
            </button>

            {/* Upload Resume Direct Action */}
            <button
              onClick={onOpenUploadModal}
              className="btn-gold-3d inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 ml-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Resume</span>
            </button>

            {/* Welcome Guide Trigger */}
            {onOpenWelcomeModal && (
              <button
                onClick={onOpenWelcomeModal}
                className="btn-white-3d p-2 rounded-xl text-[#786E5D] hover:text-[#2A261F] transition-colors shrink-0 ml-1"
                title="Open Welcome Guide & Tour"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
