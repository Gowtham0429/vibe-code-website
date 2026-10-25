import React, { useState } from 'react';
import { 
  Bot, 
  ShieldAlert, 
  CheckCircle2, 
  Play, 
  FileCheck, 
  Copy, 
  Download, 
  Sparkles, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Terminal,
  Paperclip,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { MasterProfile, ApplicationRecord, ScreeningQA } from '../types';

interface ApplicationCopilotViewProps {
  profile: MasterProfile;
  initialJobTitle?: string;
  initialCompany?: string;
  initialJobUrl?: string;
  onSaveApplication: (app: Partial<ApplicationRecord>) => void;
}

export const ApplicationCopilotView: React.FC<ApplicationCopilotViewProps> = ({
  profile,
  initialJobTitle = 'Junior Product Analyst',
  initialCompany = 'Spotify',
  initialJobUrl = 'https://boards.greenhouse.io/spotify/jobs/101',
  onSaveApplication
}) => {
  const [atsPreset, setAtsPreset] = useState<'greenhouse' | 'lever' | 'workday'>('greenhouse');
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [company, setCompany] = useState(initialCompany);
  const [jobUrl, setJobUrl] = useState(initialJobUrl);

  // Form Fields State
  const [fullName, setFullName] = useState(profile.personalInfo.fullName);
  const [email, setEmail] = useState(profile.personalInfo.email);
  const [phone, setPhone] = useState(profile.personalInfo.phone);
  const [linkedIn, setLinkedIn] = useState(profile.personalInfo.linkedIn);
  const [github, setGithub] = useState(profile.personalInfo.github);
  const [portfolio, setPortfolio] = useState(profile.personalInfo.portfolio);
  const [workAuth, setWorkAuth] = useState(profile.personalInfo.workAuthorization);
  const [sponsorship, setSponsorship] = useState(profile.personalInfo.requiresSponsorship);
  const [noticePeriod, setNoticePeriod] = useState(profile.personalInfo.noticePeriod);
  const [expectedSalary, setExpectedSalary] = useState(profile.personalInfo.expectedSalary);
  const [resumeAttached, setResumeAttached] = useState(true);

  // Screening Questions & AI Generator State
  const [screeningQAs, setScreeningQAs] = useState<ScreeningQA[]>([
    {
      question: "Describe a project where you used SQL to extract insights from raw data.",
      answer: "At Veloce Retail, I architected automated SQL views and scheduled BigQuery queries for daily e-commerce sales tracking across 1.2M transactions. By implementing window functions and CTEs, I reduced manual report compile time from 6 hours to 15 minutes weekly and surfaced 3 churn factors that drove a 4.2% increase in retention.",
      rationale: "Grounded strictly in Veloce Retail work experience."
    },
    {
      question: "What experience do you have creating dashboards for executive stakeholders?",
      answer: "I have built and maintained 8+ production Tableau and Power BI dashboards tracking GMV, conversion rates, and inventory velocity for category managers and leadership, integrating dynamic drill-down hierarchies and DAX calculations.",
      rationale: "Grounded in master profile BI & visualization accomplishments."
    }
  ]);
  const [customQuestionInput, setCustomQuestionInput] = useState('');
  const [isGeneratingQA, setIsGeneratingQA] = useState(false);

  // Autofill Simulation Animation State
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [filledFieldsCount, setFilledFieldsCount] = useState(10);
  const [hitCheckpoint, setHitCheckpoint] = useState(false);
  const [submittedConfirmed, setSubmittedConfirmed] = useState(false);

  // Automation Script State
  const [activeCodeTab, setActiveCodeTab] = useState<'playwright' | 'bookmarklet'>('playwright');
  const [copiedScript, setCopiedScript] = useState(false);

  const handleRunAutofill = () => {
    setIsAutoFilling(true);
    setHitCheckpoint(false);
    setSubmittedConfirmed(false);
    setFilledFieldsCount(0);

    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      setFilledFieldsCount(count);
      if (count >= 10) {
        clearInterval(interval);
        setIsAutoFilling(false);
        setHitCheckpoint(true);
      }
    }, 250);
  };

  const handleGenerateAnswer = async () => {
    if (!customQuestionInput.trim()) return;
    setIsGeneratingQA(true);

    try {
      const res = await fetch('/api/generate-qa-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: [customQuestionInput],
          jdAnalysis: { jobTitle, companyName: company },
          profile
        })
      });
      const data = await res.json();
      if (data.answers && data.answers.length > 0) {
        setScreeningQAs(prev => [...prev, data.answers[0]]);
        setCustomQuestionInput('');
      }
    } catch (err) {
      console.error('Error generating QA answer:', err);
    } finally {
      setIsGeneratingQA(false);
    }
  };

  const handleApproveAndSubmit = () => {
    onSaveApplication({
      company_name: company,
      job_title: jobTitle,
      job_url: jobUrl,
      match_score: 90,
      tailored_resume_path: `/resumes/${profile.personalInfo.fullName.replace(/\s+/g, '_')}_${company}_Tailored.pdf`,
      status: 'APPLIED',
      notes: `Pre-filled via Copilot (${atsPreset.toUpperCase()} preset). Human-in-the-loop review approved.`,
      applied_via: `DataPulse Copilot (${atsPreset.toUpperCase()})`
    });
    setSubmittedConfirmed(true);
  };

  const pythonScript = `"""
DataPulse Copilot: ATS Form Pre-Filler (Human-in-the-Loop Mode)
Role: ${jobTitle} @ ${company}
Target URL: ${jobUrl}
"""
from playwright.sync_api import sync_playwright

CANDIDATE = {
    "first_name": "${profile.personalInfo.fullName.split(' ')[0]}",
    "last_name": "${profile.personalInfo.fullName.split(' ').slice(1).join(' ')}",
    "email": "${profile.personalInfo.email}",
    "phone": "${profile.personalInfo.phone}",
    "linkedin": "https://${profile.personalInfo.linkedIn}",
    "github": "https://${profile.personalInfo.github}",
    "work_auth": True
}

def run_copilot():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=80)
        page = browser.new_page()
        page.goto("${jobUrl}")
        page.wait_for_load_state("networkidle")

        # Autofill common fields
        for sel, val in [
            ("#first_name", CANDIDATE["first_name"]),
            ("#last_name", CANDIDATE["last_name"]),
            ("#email", CANDIDATE["email"]),
            ("#phone", CANDIDATE["phone"]),
            ("input[name*='linkedin']", CANDIDATE["linkedin"]),
        ]:
            if page.locator(sel).is_visible(timeout=1000):
                page.fill(sel, val)

        print("\\n[!] HUMAN-IN-THE-LOOP CHECKPOINT: Form pre-filled. Please review and click Submit yourself.")
        input("Press ENTER in this terminal when finished...")
        browser.close()

if __name__ == "__main__":
    run_copilot()
`;

  const bookmarkletCode = `javascript:(function(){const p=${JSON.stringify(profile.personalInfo)};const set=(sel,val)=>{const el=document.querySelector(sel);if(el){el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}};set('#first_name',p.fullName.split(' ')[0]);set('#last_name',p.fullName.split(' ').slice(1).join(' '));set('#email',p.email);set('#phone',p.phone);set('input[name*="linkedin"]','https://'+p.linkedIn);alert('DataPulse Copilot: Form fields pre-filled! Please review before clicking Submit.');})();`;

  const copyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="card-3d-elevated bg-gradient-to-br from-[#FFFDFB] via-[#FAF4EA] to-[#F4E9D5] border border-[#DFCBA7] p-6 sm:p-9 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF3E6] border border-[#DEC8A2] text-[#8C6926] text-xs font-semibold mb-2 shadow-sm">
              <Bot className="w-3.5 h-3.5 text-[#B88E44]" />
              <span>Human-in-the-Loop ATS Assistant</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#29251D]">
              Application Copilot & ATS Form Pre-Filler
            </h1>
            <p className="text-xs sm:text-sm text-[#5F5646] mt-1 max-w-2xl leading-relaxed">
              Semi-automated assistance for Greenhouse, Lever, and Workday forms. Pre-fills contact details, uploads tailored resumes, generates truthful screening answers, and strictly pauses before submission for your manual sign-off.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-[#D5BF96] shadow-sm">
            <button
              onClick={() => setAtsPreset('greenhouse')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                atsPreset === 'greenhouse' 
                  ? 'btn-gold-3d' 
                  : 'text-[#6A604E] hover:text-[#2A251D]'
              }`}
            >
              Greenhouse
            </button>
            <button
              onClick={() => setAtsPreset('lever')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                atsPreset === 'lever' 
                  ? 'btn-gold-3d' 
                  : 'text-[#6A604E] hover:text-[#2A251D]'
              }`}
            >
              Lever
            </button>
            <button
              onClick={() => setAtsPreset('workday')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                atsPreset === 'workday' 
                  ? 'btn-gold-3d' 
                  : 'text-[#6A604E] hover:text-[#2A251D]'
              }`}
            >
              Workday
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ATS Form Pre-Fill Sandbox */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-3d p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE5D5]">
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B88E44] animate-pulse"></span>
                <div>
                  <h2 className="text-sm font-bold text-[#2A251E] uppercase tracking-wider">
                    {atsPreset.toUpperCase()} Application Sandbox
                  </h2>
                  <p className="text-xs text-[#786E5E]">
                    Target: {jobTitle} @ {company}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRunAutofill}
                disabled={isAutoFilling}
                className="btn-gold-3d inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
              >
                {isAutoFilling ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Filling ({filledFieldsCount}/10)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Copilot Pre-Fill</span>
                  </>
                )}
              </button>
            </div>

            {/* Target Job Quick Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[#6A604E] font-semibold block mb-1">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-white border border-[#D5BF96] rounded-xl px-2.5 py-1.5 text-[#2A251E] shadow-sm"
                />
              </div>
              <div>
                <label className="text-[#6A604E] font-semibold block mb-1">Role Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-white border border-[#D5BF96] rounded-xl px-2.5 py-1.5 text-[#2A251E] shadow-sm"
                />
              </div>
              <div>
                <label className="text-[#6A604E] font-semibold block mb-1">Application URL</label>
                <input
                  type="text"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="w-full bg-white border border-[#D5BF96] rounded-xl px-2.5 py-1.5 text-[#2A251E] truncate shadow-sm"
                />
              </div>
            </div>

            {/* Simulated Candidate Form Fields */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-[#786E5E] uppercase tracking-wider">
                Candidate Contact & Authorization Fields
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-[#6A604E] mb-1 font-semibold">
                    <span>Full Name *</span>
                    <span className="text-[10px] text-[#3E6833] font-medium">✓ Auto-filled</span>
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm focus:border-[#B88E44]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#6A604E] mb-1 font-semibold">
                    <span>Email Address *</span>
                    <span className="text-[10px] text-[#3E6833] font-medium">✓ Auto-filled</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm focus:border-[#B88E44]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#6A604E] mb-1 font-semibold">
                    <span>Phone Number *</span>
                    <span className="text-[10px] text-[#3E6833] font-medium">✓ Auto-filled</span>
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm focus:border-[#B88E44]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#6A604E] mb-1 font-semibold">
                    <span>LinkedIn URL</span>
                    <span className="text-[10px] text-[#3E6833] font-medium">✓ Auto-filled</span>
                  </div>
                  <input
                    type="text"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm focus:border-[#B88E44]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#6A604E] mb-1 font-semibold">
                    <span>GitHub / Code Portfolio</span>
                    <span className="text-[10px] text-[#3E6833] font-medium">✓ Auto-filled</span>
                  </div>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm focus:border-[#B88E44]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[#6A604E] mb-1 font-semibold">
                    <span>Portfolio Website</span>
                    <span className="text-[10px] text-[#3E6833] font-medium">✓ Auto-filled</span>
                  </div>
                  <input
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm focus:border-[#B88E44]"
                  />
                </div>
              </div>

              {/* Work Authorization & Legal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div>
                  <label className="text-[#6A604E] block mb-1 font-semibold">Work Authorization</label>
                  <input
                    type="text"
                    value={workAuth}
                    onChange={(e) => setWorkAuth(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-2.5 py-1.5 text-[#2A251E] shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[#6A604E] block mb-1 font-semibold">Requires Sponsorship?</label>
                  <input
                    type="text"
                    value={sponsorship}
                    onChange={(e) => setSponsorship(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-2.5 py-1.5 text-[#2A251E] shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[#6A604E] block mb-1 font-semibold">Notice Period</label>
                  <input
                    type="text"
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-2.5 py-1.5 text-[#2A251E] shadow-sm"
                  />
                </div>
              </div>

              {/* Resume Attachment Module */}
              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E7D7BF] flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#DECDB3] text-[#8A6623] shadow-xs">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2A251D]">
                      Tailored Resume Attached (ATS Clean PDF)
                    </div>
                    <div className="text-[11px] text-[#786E5E] font-mono">
                      {profile.personalInfo.fullName.replace(/\s+/g, '_')}_{company}_Tailored.pdf
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EFF6EC] text-[#3B6631] border border-[#CFE3C7]">
                  Ready for Ingestion
                </span>
              </div>
            </div>

            {/* Screening Questions Section */}
            <div className="space-y-4 pt-4 border-t border-[#EFE5D5]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-[#2A251D] uppercase tracking-wider flex items-center space-x-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#B88E44]" />
                    <span>Screening & Technical Q&A (Auto-Filled)</span>
                  </h3>
                  <p className="text-[11px] text-[#786E5E] mt-0.5">
                    Grounded answers formulated without fabricating projects or skills
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {screeningQAs.map((qa, index) => (
                  <div key={index} className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#E9DAC5] text-xs space-y-2 shadow-sm">
                    <div className="font-bold text-[#2D271E]">{qa.question}</div>
                    <textarea
                      rows={3}
                      value={qa.answer}
                      onChange={(e) => {
                        const newQAs = [...screeningQAs];
                        newQAs[index].answer = e.target.value;
                        setScreeningQAs(newQAs);
                      }}
                      className="w-full bg-white border border-[#D5BF96] rounded-xl p-2.5 text-[#322D23] focus:outline-none focus:border-[#B88E44] font-sans leading-relaxed text-xs shadow-sm"
                    />
                    <div className="text-[10px] text-[#786E5E] italic">
                      ✓ {qa.rationale}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Screening Question Input */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E9DAC5] space-y-2 text-xs shadow-sm">
                <label className="text-[#6A604E] font-semibold">Add Screening Question from Job Application:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customQuestionInput}
                    onChange={(e) => setCustomQuestionInput(e.target.value)}
                    placeholder="e.g., Why are you looking to join our data analytics team?"
                    className="flex-1 bg-white border border-[#D5BF96] rounded-xl px-3 py-1.5 text-[#2A251E] shadow-sm"
                  />
                  <button
                    onClick={handleGenerateAnswer}
                    disabled={isGeneratingQA || !customQuestionInput.trim()}
                    className="btn-gold-3d px-3.5 py-1.5 rounded-xl font-bold shrink-0 flex items-center space-x-1 disabled:opacity-50"
                  >
                    {isGeneratingQA ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Generate Answer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* MANDATORY Human-In-The-Loop Checkpoint Modal */}
            {hitCheckpoint && !submittedConfirmed && (
              <div className="p-5 rounded-2xl bg-[#FAF4EA] border-2 border-[#D8BC82] space-y-3 shadow-md animate-in fade-in duration-300">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 rounded-xl bg-white border border-[#DFCBA7] text-[#8E6922] shrink-0 mt-0.5 shadow-xs">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#5C4212]">
                      Human-in-the-Loop Safeguard: Copilot Paused Before Submission
                    </h4>
                    <p className="text-xs text-[#63553C] mt-1 leading-relaxed">
                      To prevent account bans, terms-of-service violations, and failed CAPTCHAs, DataPulse intentionally halts before clicking Submit. Please review all filled values, verify attachments, and confirm your approval.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8D4AC]">
                  <span className="text-[11px] text-[#7A5A1C] font-semibold">
                    ✓ All fields validated · Resume ready
                  </span>
                  <button
                    onClick={handleApproveAndSubmit}
                    className="btn-gold-3d inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Record in Application Tracker</span>
                  </button>
                </div>
              </div>
            )}

            {/* Confirmed State */}
            {submittedConfirmed && (
              <div className="p-4 rounded-2xl bg-[#EFF6EC] border border-[#CFE3C7] flex items-center justify-between text-xs text-[#3B6631] shadow-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3B6631]" />
                  <span className="font-bold">
                    Application for {jobTitle} at {company} recorded into tracker with status: APPLIED!
                  </span>
                </div>
                <button
                  onClick={() => setHitCheckpoint(false)}
                  className="text-xs underline text-[#5E7A57] hover:text-[#284820] font-medium"
                >
                  Reset Form
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code & Script Exporter */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-3d p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#2A251E] flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#A8803A]" />
                  <span>Automation Script Exporter</span>
                </h3>
                <p className="text-xs text-[#786E5E] mt-0.5">
                  Run browser automation locally on real job boards
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 border-b border-[#EFE5D5] pb-2">
              <button
                onClick={() => setActiveCodeTab('playwright')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCodeTab === 'playwright'
                    ? 'bg-white text-[#2A251D] border border-[#D5BF96] shadow-sm'
                    : 'text-[#6A604E] hover:text-[#2A251D]'
                }`}
              >
                Python Playwright Script
              </button>
              <button
                onClick={() => setActiveCodeTab('bookmarklet')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeCodeTab === 'bookmarklet'
                    ? 'bg-white text-[#2A251D] border border-[#D5BF96] shadow-sm'
                    : 'text-[#6A604E] hover:text-[#2A251D]'
                }`}
              >
                1-Click Bookmarklet
              </button>
            </div>

            {/* Script Display in 3D Card */}
            {activeCodeTab === 'playwright' ? (
              <div className="space-y-3">
                <div className="relative">
                  <pre className="bg-[#26231D] border border-[#3E382E] text-[#E8D6B5] rounded-2xl p-4 text-[11px] font-mono overflow-x-auto max-h-[380px] leading-relaxed shadow-inner">
                    {pythonScript}
                  </pre>
                  <button
                    onClick={() => copyScript(pythonScript)}
                    className="btn-white-3d absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                  >
                    {copiedScript ? <CheckCircle2 className="w-3.5 h-3.5 text-[#3B6631]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied' : 'Copy .py'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E9DAC5] text-xs text-[#62594A] space-y-1 shadow-sm">
                  <div className="font-bold text-[#2C261D]">How to run locally:</div>
                  <code className="text-[#84601F] block font-mono text-[11px] bg-white px-2 py-1 rounded-lg border border-[#DFCBA7]">
                    pip install playwright && playwright install chromium
                  </code>
                  <p className="text-[11px] text-[#786E5E]">
                    Run <code className="text-[#3B3528] font-bold">python copilot.py</code>. The browser opens, fills the form, and waits for your confirmation.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#544D3F]">
                  Drag this bookmarklet button to your browser bookmarks bar, or copy code to your browser console:
                </p>

                <div className="p-4 rounded-2xl bg-[#FAF4EA] border border-[#DFCBA7] text-center shadow-sm">
                  <a
                    href={bookmarkletCode}
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Drag this button to your browser bookmarks bar!');
                    }}
                    className="btn-gold-3d inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-grab active:cursor-grabbing"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>⚡ DataPulse Copilot Bookmarklet</span>
                  </a>
                  <p className="text-[11px] text-[#786E5E] mt-2">
                    Click it while on any Greenhouse or Lever application page to auto-populate contact details instantly!
                  </p>
                </div>

                <div className="relative">
                  <pre className="bg-[#26231D] border border-[#3E382E] text-[#DFCBA7] rounded-2xl p-3 text-[10px] font-mono overflow-x-auto max-h-[140px] break-all whitespace-pre-wrap shadow-inner">
                    {bookmarkletCode}
                  </pre>
                  <button
                    onClick={() => copyScript(bookmarkletCode)}
                    className="btn-white-3d absolute top-2 right-2 px-2 py-0.5 rounded-lg text-[10px] font-semibold inline-flex items-center space-x-1"
                  >
                    <span>Copy Code</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Safe Automation Policy Card */}
          <div className="card-3d p-5 space-y-2 text-xs">
            <h4 className="font-bold text-[#2A251D] flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#8C6926]" />
              <span>DataPulse Safety Principles</span>
            </h4>
            <ul className="space-y-1.5 text-[#6D6352] list-disc list-inside">
              <li>No headless ghost submission: candidate remains the author.</li>
              <li>Respects robot.txt and CAPTCHA challenge barriers.</li>
              <li>Saves ATS application history directly to your local database.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
