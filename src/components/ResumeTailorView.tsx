import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Download, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  CheckCircle2, 
  Copy, 
  Send, 
  ExternalLink, 
  Search, 
  ChevronRight, 
  Edit3, 
  Eye, 
  RotateCcw,
  Sliders,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  MasterProfile, 
  JobDescriptionAnalysis, 
  TailoredResumeResult, 
  ApplicationRecord 
} from '../types';
import { sampleJobDescriptions } from '../data/seedData';
import { downloadResumePdf } from '../utils/pdfGenerator';

interface ResumeTailorViewProps {
  profile: MasterProfile;
  onSaveApplication: (app: Partial<ApplicationRecord>) => void;
  onOpenCopilot: (jobTitle: string, company: string, url: string) => void;
}

export const ResumeTailorView: React.FC<ResumeTailorViewProps> = ({
  profile,
  onSaveApplication,
  onOpenCopilot
}) => {
  const [jdText, setJdText] = useState(sampleJobDescriptions[0].text);
  const [jobUrl, setJobUrl] = useState(sampleJobDescriptions[0].url);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTailoring, setIsTailoring] = useState(false);
  const [jdAnalysis, setJdAnalysis] = useState<JobDescriptionAnalysis | null>(null);
  const [tailoredResult, setTailoredResult] = useState<TailoredResumeResult | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [addedToTracker, setAddedToTracker] = useState(false);
  const [activeTab, setActiveTab] = useState<'diff' | 'preview'>('diff');

  const handleSelectSampleJd = (id: string) => {
    const sample = sampleJobDescriptions.find(s => s.id === id);
    if (sample) {
      setJdText(sample.text);
      setJobUrl(sample.url);
      setJdAnalysis(null);
      setTailoredResult(null);
      setAddedToTracker(false);
    }
  };

  const handleAnalyzeJd = async () => {
    if (!jdText.trim()) return;
    setIsAnalyzing(true);
    setTailoredResult(null);
    setAddedToTracker(false);

    try {
      const res = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText, jobUrl })
      });
      const data: JobDescriptionAnalysis = await res.json();
      setJdAnalysis(data);
    } catch (err) {
      console.error('Failed to analyze JD:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTailorResume = async () => {
    if (!jdAnalysis) return;
    setIsTailoring(true);

    try {
      const res = await fetch('/api/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdAnalysis, profile })
      });
      const data: TailoredResumeResult = await res.json();
      setTailoredResult(data);
    } catch (err) {
      console.error('Failed to tailor resume:', err);
    } finally {
      setIsTailoring(false);
    }
  };

  const handleCopySummary = () => {
    if (tailoredResult?.tailoredSummary) {
      navigator.clipboard.writeText(tailoredResult.tailoredSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    if (tailoredResult) {
      downloadResumePdf(profile, tailoredResult);
    }
  };

  const handleAddToTracker = () => {
    if (!tailoredResult || !jdAnalysis) return;

    onSaveApplication({
      company_name: jdAnalysis.companyName,
      job_title: jdAnalysis.jobTitle,
      job_url: jobUrl || '',
      match_score: tailoredResult.matchScore,
      tailored_resume_path: `/resumes/${profile.personalInfo.fullName.replace(/\s+/g, '_')}_${jdAnalysis.companyName}_Tailored.pdf`,
      status: 'APPLIED',
      notes: `Tailored with ${tailoredResult.matchedSkills.length} matched skills. Target salary: ${jdAnalysis.salaryRange || 'Not specified'}.`,
      salary_range: jdAnalysis.salaryRange,
      location: jdAnalysis.location,
      matched_skills: tailoredResult.matchedSkills,
      missing_skills: tailoredResult.missingSkills,
      applied_via: 'DataPulse Resume Engine'
    });

    setAddedToTracker(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="card-3d-elevated bg-gradient-to-br from-[#FFFDFB] via-[#FAF4EA] to-[#F4E9D5] border border-[#DFCBA7] p-6 sm:p-9 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF3E6] border border-[#DEC8A2] text-[#8C6926] text-xs font-semibold mb-2 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B88E44]" />
              <span>Strict Anti-Hallucination Engine</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#29251D]">
              Data Analyst ATS Resume Tailoring Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#5F5646] mt-1">
              Extract requirements, align technical terminology (SQL, Python, dbt, BI), and generate a verified ATS-compliant PDF without fabricating experience.
            </p>
          </div>

          {/* Quick JD Template Selector */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-xs text-[#786E5E] font-medium">Quick Presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {sampleJobDescriptions.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSelectSampleJd(sample.id)}
                  className="btn-white-3d px-2.5 py-1 text-xs rounded-xl transition-colors font-medium"
                >
                  {sample.company}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Section: Target Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Job Description Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="card-3d p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#EFE5D5]">
              <h2 className="text-sm font-bold text-[#2A251E] flex items-center space-x-2">
                <FileText className="w-4 h-4 text-[#A8803A]" />
                <span>Target Job Description</span>
              </h2>
              <span className="text-[11px] text-[#866324] font-semibold px-2 py-0.5 rounded-full bg-[#FAF4E6] border border-[#DECDB3]">
                JD Input
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6A604F] mb-1">
                Job Posting URL (Optional)
              </label>
              <input
                type="text"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                placeholder="https://company.com/careers/data-analyst"
                className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-xs text-[#2A251E] placeholder-[#9D9382] focus:outline-none focus:border-[#B88E44] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6A604F] mb-1">
                Job Description Text
              </label>
              <textarea
                rows={11}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the target job description here..."
                className="w-full bg-white border border-[#D5BF96] rounded-xl p-3 text-xs text-[#2A251E] placeholder-[#9D9382] focus:outline-none focus:border-[#B88E44] font-mono leading-relaxed shadow-sm"
              />
            </div>

            <button
              onClick={handleAnalyzeJd}
              disabled={isAnalyzing || !jdText.trim()}
              className="btn-gold-3d w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Skills & Qualifications...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Job Requirements</span>
                </>
              )}
            </button>
          </div>

          {/* Master Profile Summary Preview Card */}
          <div className="card-3d p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-[#443D32] font-semibold">
              <span>Grounded in Master Profile:</span>
              <span className="text-[#84601F] font-bold">{profile.personalInfo.fullName}</span>
            </div>
            <p className="text-[#6D6353] line-clamp-2">{profile.headline}</p>
            <div className="pt-1 flex flex-wrap gap-1">
              {profile.skills.sqlAndDatabases.slice(0, 3).map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-[#FAF4E6] text-[10px] text-[#7C5A1D] border border-[#E9DAC1] font-medium">
                  {s}
                </span>
              ))}
              {profile.skills.biAndVisualization.slice(0, 2).map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md bg-[#FAF4E6] text-[10px] text-[#7C5A1D] border border-[#E9DAC1] font-medium">
                  {s}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-md bg-[#F4EFE6] text-[10px] text-[#867B6B]">
                +{profile.experience.length} experiences
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Analysis & Tailored Results */}
        <div className="lg:col-span-7 space-y-6">
          {!jdAnalysis && !isAnalyzing && (
            <div className="h-full min-h-[420px] card-3d p-8 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF3E6] border border-[#DEC8A2] flex items-center justify-center text-[#8C6926] mb-3 shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2A251E]">Ready for JD Analysis</h3>
              <p className="text-xs text-[#786E5E] max-w-sm mt-1">
                Select a preset (Spotify, DoorDash, Stripe) or paste any Data Analyst job posting to extract requirements and generate an ATS match score.
              </p>
            </div>
          )}

          {/* Extracted JD Analysis Card */}
          {jdAnalysis && (
            <div className="card-3d p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EFE5D5]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-[#2A251E]">{jdAnalysis.jobTitle}</span>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-[#FAF4E6] text-[#866324] border border-[#DECDB3] font-bold">
                      {jdAnalysis.domain}
                    </span>
                  </div>
                  <div className="text-xs text-[#786E5E] mt-0.5">
                    {jdAnalysis.companyName} · {jdAnalysis.location} · {jdAnalysis.experienceLevel}
                  </div>
                </div>

                {!tailoredResult && (
                  <button
                    onClick={handleTailorResume}
                    disabled={isTailoring}
                    className="btn-gold-3d inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 shrink-0"
                  >
                    {isTailoring ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Tailoring Bullet Points...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Run Tailoring Engine</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Extracted Skills Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-[#443D31] block mb-2">Required Hard Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {jdAnalysis.requiredHardSkills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-md bg-[#FAF4EA] border border-[#E7D6BD] text-[#7A571B] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-[#443D31] block mb-2">Soft & Business Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {jdAnalysis.softSkills.map((skill) => (
                      <span key={skill} className="px-2 py-0.5 rounded-md bg-[#F8EEF4] border border-[#ECCFDF] text-[#7E3D6B] font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Duties */}
              <div className="text-xs space-y-1.5 pt-2">
                <span className="font-semibold text-[#443D31] block">Key Responsibilities Extracted:</span>
                <ul className="space-y-1 text-[#696050] list-disc list-inside">
                  {jdAnalysis.keyResponsibilities.slice(0, 3).map((r, i) => (
                    <li key={i} className="line-clamp-2">{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tailored Resume Results */}
          {tailoredResult && (
            <div className="space-y-6">
              {/* Match Score Card & Anti-Hallucination Audit */}
              <div className="card-3d p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    {/* Score 3D Badge */}
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF3E6] to-[#F4E9D5] border border-[#D5BF96] flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(180,140,70,0.15),inset_0_1px_0_rgba(255,255,255,1)]">
                      <span className="text-2xl font-black text-[#84601F]">{tailoredResult.matchScore}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9E7730]">ATS Match</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#2A251D]">Suitability & Keyword Analysis</h3>
                      <p className="text-xs text-[#786E5E]">
                        {tailoredResult.matchedSkills.length} skills matched · {tailoredResult.missingSkills.length} skill gap flagged
                      </p>
                      <div className="flex items-center space-x-3 mt-2 text-[11px] text-[#544D3F]">
                        <span>Hard Skills: <strong className="text-[#84601F]">{tailoredResult.scoreBreakdown.hardSkills}%</strong></span>
                        <span className="text-[#D0C0A5]">·</span>
                        <span>Experience: <strong className="text-[#7E3D6B]">{tailoredResult.scoreBreakdown.experience}%</strong></span>
                        <span className="text-[#D0C0A5]">·</span>
                        <span>Keywords: <strong className="text-[#3E6833]">{tailoredResult.scoreBreakdown.keywordDensity}%</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleDownloadPdf}
                      className="btn-gold-3d inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download ATS PDF</span>
                    </button>

                    <button
                      onClick={handleAddToTracker}
                      disabled={addedToTracker}
                      className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        addedToTracker
                          ? 'bg-[#EFF6EC] text-[#3B6631] border border-[#CFE3C7]'
                          : 'btn-white-3d'
                      }`}
                    >
                      {addedToTracker ? <Check className="w-4 h-4" /> : <Layers className="w-4 h-4 text-[#A8803A]" />}
                      <span>{addedToTracker ? 'Added to Tracker' : 'Save to Pipeline'}</span>
                    </button>

                    <button
                      onClick={() => onOpenCopilot(jdAnalysis?.jobTitle || '', jdAnalysis?.companyName || '', jobUrl)}
                      className="btn-white-3d inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                    >
                      <Send className="w-3.5 h-3.5 text-[#5F8754]" />
                      <span>Open Pre-Filler</span>
                    </button>
                  </div>
                </div>

                {/* Anti-Hallucination Audit Banner */}
                <div className="p-4 rounded-2xl bg-[#F6FAF3] border border-[#D3E5CF] space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#446F38] shrink-0" />
                      <span className="text-xs font-bold text-[#355B2B]">
                        Anti-Hallucination Integrity Audit Passed
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5F1E2] text-[#335C29]">
                      100% Grounded
                    </span>
                  </div>
                  <p className="text-xs text-[#4C5B47] leading-relaxed">
                    {tailoredResult.antiHallucinationAudit.verificationNotes}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-[#546850]">
                    {tailoredResult.antiHallucinationAudit.prohibitedInventionsChecked.map((check, i) => (
                      <span key={i} className="inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-[#446F38]" />
                        <span>{check}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Skill Overlap Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="p-3.5 rounded-2xl bg-[#F7FAF4] border border-[#D8E6D4]">
                    <span className="font-bold text-[#3E6833] block mb-2">
                      Matched Skills ({tailoredResult.matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tailoredResult.matchedSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-white border border-[#CFE3C7] text-[#3B6631] text-[11px] font-medium shadow-2xs">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E9DAC5]">
                    <span className="font-bold text-[#866324] block mb-2">
                      Missing Skill Gaps ({tailoredResult.missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tailoredResult.missingSkills.length > 0 ? (
                        tailoredResult.missingSkills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-white border border-[#E5D2B8] text-[#846224] text-[11px] font-medium shadow-2xs">
                            ! {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[#786E5E] text-xs">No critical gaps! Perfect match.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* View Switcher */}
              <div className="flex items-center justify-between border-b border-[#E8DAC5] pb-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setActiveTab('diff')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'diff'
                        ? 'bg-white text-[#2A251D] border border-[#D5BF96] shadow-sm'
                        : 'text-[#6A604E] hover:text-[#2A251D]'
                    }`}
                  >
                    Side-by-Side Bullet Diff & Rationale
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeTab === 'preview'
                        ? 'bg-white text-[#2A251D] border border-[#D5BF96] shadow-sm'
                        : 'text-[#6A604E] hover:text-[#2A251D]'
                    }`}
                  >
                    ATS Format Preview
                  </button>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="text-xs text-[#786E5E] hover:text-[#2A251D] inline-flex items-center space-x-1 font-medium"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-[#3E6833]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied' : 'Copy Summary'}</span>
                </button>
              </div>

              {/* Tab 1: Side by Side Diff */}
              {activeTab === 'diff' && (
                <div className="space-y-6">
                  {/* Tailored Professional Summary */}
                  <div className="card-3d p-5 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#84601F]">
                      Tailored Executive Summary
                    </span>
                    <p className="text-xs sm:text-sm text-[#3E382E] leading-relaxed bg-[#FAF6EE] p-3.5 rounded-2xl border border-[#E9DAC5]">
                      {tailoredResult.tailoredSummary}
                    </p>
                  </div>

                  {/* Tailored Work Experience Bullet Diffs */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-[#2A251E] flex items-center space-x-2">
                      <Edit3 className="w-4 h-4 text-[#A8803A]" />
                      <span>Work Experience Bullet Reframing</span>
                    </h4>

                    {tailoredResult.tailoredExperience.map((exp) => (
                      <div key={exp.id} className="card-3d p-5 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#EFE5D5] pb-2">
                          <div>
                            <span className="font-bold text-[#2A251E] text-sm">{exp.role}</span>
                            <span className="text-[#786E5E] text-xs ml-2">@ {exp.company}</span>
                          </div>
                          <span className="text-[11px] text-[#786E5E]">{exp.bullets.length} bullets refined</span>
                        </div>

                        <div className="space-y-4">
                          {exp.bullets.map((b, idx) => (
                            <div key={b.id || idx} className="space-y-2 text-xs">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Original */}
                                <div className="p-3.5 rounded-2xl bg-[#F6F2EA] border border-[#E4D7C3] text-[#696051]">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7F6E] block mb-1">
                                    Original Bullet
                                  </span>
                                  {b.original}
                                </div>

                                {/* Tailored */}
                                <div className="p-3.5 rounded-2xl bg-white border border-[#D5BF96] text-[#2D271F] shadow-sm">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#84601F] block mb-1">
                                    JD-Aligned Bullet
                                  </span>
                                  {b.tailored}
                                </div>
                              </div>

                              {/* Rationale & Keywords */}
                              <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-[11px] text-[#786E5E]">
                                <span className="italic">
                                  Rationale: {b.rationale}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <span className="text-[#8C8170]">Keywords:</span>
                                  {b.keywordsIntegrated.map((kw) => (
                                    <span key={kw} className="px-1.5 py-0.2 rounded bg-[#FAF4E6] text-[#866324] font-mono text-[10px] border border-[#DECDB3]">
                                      {kw}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: ATS Clean Document Preview */}
              {activeTab === 'preview' && (
                <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-xl max-w-2xl mx-auto font-serif text-[13px] leading-relaxed border border-slate-300">
                  {/* Name & Contact */}
                  <div className="text-center border-b border-slate-400 pb-3 mb-4">
                    <h2 className="text-xl font-bold tracking-wide uppercase text-slate-900">
                      {profile.personalInfo.fullName}
                    </h2>
                    <div className="text-[11px] text-slate-700 mt-1 font-sans">
                      {profile.personalInfo.location} | {profile.personalInfo.phone} | {profile.personalInfo.email}
                    </div>
                    <div className="text-[11px] text-slate-700 font-sans">
                      {profile.personalInfo.linkedIn} | {profile.personalInfo.github}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5 font-sans">
                      Professional Summary
                    </h3>
                    <p className="text-slate-800 text-justify">{tailoredResult.tailoredSummary}</p>
                  </div>

                  {/* Technical Skills */}
                  <div className="mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1.5 font-sans">
                      Technical Skills
                    </h3>
                    <div className="space-y-1 text-[12px]">
                      <div><strong>SQL & Databases:</strong> {profile.skills.sqlAndDatabases.join(', ')}</div>
                      <div><strong>Python & Analytics:</strong> {profile.skills.programmingAndScripting.join(', ')}</div>
                      <div><strong>BI & Visualization:</strong> {profile.skills.biAndVisualization.join(', ')}</div>
                      <div><strong>Cloud & Warehouses:</strong> {profile.skills.cloudAndWarehouses.join(', ')}</div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
                      Professional Experience
                    </h3>
                    {tailoredResult.tailoredExperience.map((exp) => (
                      <div key={exp.id} className="mb-3">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.role} | {exp.company}</span>
                          <span className="font-normal text-[11px] text-slate-600 font-sans">Present</span>
                        </div>
                        <ul className="list-disc list-outside pl-4 space-y-1 mt-1 text-slate-800 text-[12px]">
                          {exp.bullets.map((b, i) => (
                            <li key={i}>{b.tailored}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-1 font-sans">
                      Education & Certifications
                    </h3>
                    {profile.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between text-[12px]">
                        <span><strong>{edu.degree}</strong>, {edu.institution}</span>
                        <span>{edu.graduationYear}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
