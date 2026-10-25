import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { JobMatchesView } from './components/JobMatchesView';
import { ResumeTailorView } from './components/ResumeTailorView';
import { ApplicationCopilotView } from './components/ApplicationCopilotView';
import { TrackerView } from './components/TrackerView';
import { MasterProfileView } from './components/MasterProfileView';
import { ChatbotCopilot } from './components/ChatbotCopilot';
import { ResumeUploadModal } from './components/ResumeUploadModal';
import { WelcomeModal } from './components/WelcomeModal';
import { MasterProfile, ApplicationRecord, ApplicationStatus, RecommendedJob } from './types';
import { defaultMasterProfile, seedApplications } from './data/seedData';
import { CheckCircle2, ShieldCheck, MessageSquareText, UploadCloud, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [profile, setProfile] = useState<MasterProfile>(defaultMasterProfile);
  const [applications, setApplications] = useState<ApplicationRecord[]>(seedApplications);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  // Copilot handover state
  const [copilotJobTitle, setCopilotJobTitle] = useState('Junior Product Analyst');
  const [copilotCompany, setCopilotCompany] = useState('Spotify');
  const [copilotJobUrl, setCopilotJobUrl] = useState('https://www.lifeatspotify.com/jobs/junior-product-analyst-nyc');

  // Track applied job IDs
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  // Load initial data from backend
  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && data.personalInfo) {
          setProfile(data);
        }
      })
      .catch(err => console.log('Using local seed profile:', err));

    fetch('/api/applications')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setApplications(data);
          setAppliedJobIds(data.map(a => a.id));
        }
      })
      .catch(err => console.log('Using local seed applications:', err));

    // Check if first-time user
    const hasSeenWelcome = localStorage.getItem('datapulse_welcome_seen');
    if (!hasSeenWelcome) {
      setIsWelcomeModalOpen(true);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Profile save
  const handleSaveProfile = async (updated: MasterProfile) => {
    setProfile(updated);
    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      showToast('Master Profile saved to database.');
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  // Add new application
  const handleSaveApplication = async (newApp: Partial<ApplicationRecord>) => {
    const record: ApplicationRecord = {
      id: newApp.id || `app-${Date.now()}`,
      company_name: newApp.company_name || 'Target Company',
      job_title: newApp.job_title || 'Data Analyst',
      job_url: newApp.job_url || '',
      match_score: newApp.match_score || 85,
      tailored_resume_path: newApp.tailored_resume_path || '/resumes/Tailored_Resume.pdf',
      applied_date: new Date().toISOString().split('T')[0],
      status: (newApp.status as ApplicationStatus) || 'APPLIED',
      last_updated: new Date().toISOString().split('T')[0],
      notes: newApp.notes || '',
      salary_range: newApp.salary_range || '$85,000 - $95,000',
      location: newApp.location || 'Remote / Hybrid',
      missing_skills: newApp.missing_skills || [],
      matched_skills: newApp.matched_skills || [],
      applied_via: newApp.applied_via || 'DataPulse Copilot'
    };

    setApplications(prev => [record, ...prev]);
    setAppliedJobIds(prev => [...prev, record.id]);

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
      showToast(`Recorded application for ${record.company_name}!`);
    } catch (err) {
      console.error('Error saving application:', err);
    }
  };

  // 1-Click Direct Apply for recommended job
  const handleApplyDirectly = async (job: RecommendedJob) => {
    const record: ApplicationRecord = {
      id: `app-direct-${Date.now()}`,
      company_name: job.company,
      job_title: job.title,
      job_url: job.jobUrl,
      match_score: job.matchScore,
      tailored_resume_path: `/resumes/${profile.personalInfo.fullName.replace(/\s+/g, '_')}_${job.company}_Tailored.pdf`,
      applied_date: new Date().toISOString().split('T')[0],
      status: 'APPLIED',
      last_updated: new Date().toISOString().split('T')[0],
      notes: `Directly applied via AI Match Engine. Matched: ${job.matchedSkills.join(', ')}.`,
      salary_range: job.salary,
      location: job.location,
      matched_skills: job.matchedSkills,
      missing_skills: job.missingSkills,
      applied_via: '1-Click Direct Apply Copilot'
    };

    setCopilotJobTitle(job.title);
    setCopilotCompany(job.company);
    setCopilotJobUrl(job.jobUrl);

    setApplications(prev => [record, ...prev]);
    setAppliedJobIds(prev => [...prev, job.id, record.id]);

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
    } catch (err) {
      console.error('Error logging direct application:', err);
    }

    showToast(`Direct application logged for ${job.title} at ${job.company}`);
    setActiveTab('copilot');
  };

  // Handover from Job Matches to Resume Tailor Studio
  const handleTailorForJob = (job: RecommendedJob) => {
    setCopilotJobTitle(job.title);
    setCopilotCompany(job.company);
    setCopilotJobUrl(job.jobUrl);
    setActiveTab('tailor');
  };

  // Update status (1-click)
  const handleUpdateStatus = async (id: string, status: ApplicationStatus) => {
    setApplications(prev =>
      prev.map(a => (a.id === id ? { ...a, status, last_updated: new Date().toISOString().split('T')[0] } : a))
    );

    try {
      await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      showToast(`Status updated to ${status}.`);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Update full application
  const handleUpdateApplication = async (updated: ApplicationRecord) => {
    setApplications(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    try {
      await fetch(`/api/applications/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      showToast('Application record updated.');
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  // Delete application
  const handleDeleteApplication = async (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    try {
      await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      showToast('Application removed.');
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  // Handover from Resume Tailor to Copilot
  const handleOpenCopilot = (title: string, comp: string, url: string) => {
    setCopilotJobTitle(title);
    setCopilotCompany(comp);
    setCopilotJobUrl(url);
    setActiveTab('copilot');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#29251E] flex flex-col font-sans selection:bg-[#E5D0A7] selection:text-[#382C13]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-[#D8C49F] text-[#4F3C16] px-4 py-2.5 rounded-2xl shadow-[0_8px_24px_rgba(180,140,70,0.18),inset_0_1px_0_rgba(255,255,255,1)] flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#8C6B28]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        applications={applications}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenWelcomeModal={() => setIsWelcomeModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardView
            applications={applications}
            onNavigateToTailor={() => setActiveTab('tailor')}
            onNavigateToTracker={() => setActiveTab('tracker')}
            onNavigateToMatches={() => setActiveTab('matches')}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'matches' && (
          <JobMatchesView
            profile={profile}
            onApplyDirectly={handleApplyDirectly}
            onTailorForJob={handleTailorForJob}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            appliedJobIds={appliedJobIds}
          />
        )}

        {activeTab === 'tailor' && (
          <ResumeTailorView
            profile={profile}
            onSaveApplication={handleSaveApplication}
            onOpenCopilot={handleOpenCopilot}
          />
        )}

        {activeTab === 'copilot' && (
          <ApplicationCopilotView
            profile={profile}
            initialJobTitle={copilotJobTitle}
            initialCompany={copilotCompany}
            initialJobUrl={copilotJobUrl}
            onSaveApplication={handleSaveApplication}
          />
        )}

        {activeTab === 'tracker' && (
          <TrackerView
            applications={applications}
            onUpdateStatus={handleUpdateStatus}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
            onAddNewApplication={handleSaveApplication}
          />
        )}

        {activeTab === 'chat' && (
          <ChatbotCopilot
            profile={profile}
            applications={applications}
            onNavigateToMatches={() => setActiveTab('matches')}
            onNavigateToTailor={() => setActiveTab('tailor')}
          />
        )}

        {activeTab === 'profile' && (
          <MasterProfileView
            profile={profile}
            onSaveProfile={handleSaveProfile}
          />
        )}
      </main>

      {/* Floating Chat Trigger Button (when not on chat tab) */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => setActiveTab('chat')}
          className="btn-gold-3d fixed bottom-6 left-6 z-40 p-3 rounded-2xl flex items-center space-x-2"
          title="Open AI Career Chatbot"
        >
          <MessageSquareText className="w-5 h-5 text-white" />
          <span className="hidden sm:inline text-xs font-bold">Ask AI Copilot</span>
        </button>
      )}

      {/* Resume Upload Modal */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProfileUpdated={(updated) => {
          setProfile(updated);
          showToast(`Resume uploaded & parsed for ${updated.personalInfo.fullName}!`);
        }}
        onNavigateToJobMatches={() => {
          setActiveTab('matches');
        }}
      />

      {/* First-Time User Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        onStartUpload={() => setIsUploadModalOpen(true)}
        onStartJobMatches={() => setActiveTab('matches')}
        onStartDashboard={() => setActiveTab('dashboard')}
      />

      {/* Footer */}
      <footer className="border-t border-[#E8DAC5] bg-[#FAF8F5] py-6 text-center text-xs text-[#7B7161]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#3B3528]">DataPulse</span>
            <span className="text-[#D0C0A5]">·</span>
            <span>AI Job Application & Direct Apply Copilot</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-[#786E5E]">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8F6C2C]" />
              <span>Anti-Hallucination Grounded</span>
            </span>
            <span className="text-[#D0C0A5]">·</span>
            <span>Human-in-the-Loop Safe</span>
            <span className="text-[#D0C0A5]">·</span>
            <span>Gemini 3.8 Flash Powered</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
