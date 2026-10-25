import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Briefcase, 
  Building, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  Send, 
  Zap, 
  Filter, 
  TrendingUp,
  RefreshCw,
  UploadCloud,
  Check
} from 'lucide-react';
import { RecommendedJob, MasterProfile, ApplicationRecord } from '../types';

interface JobMatchesViewProps {
  profile: MasterProfile;
  onApplyDirectly: (job: RecommendedJob) => void;
  onTailorForJob: (job: RecommendedJob) => void;
  onOpenUploadModal: () => void;
  appliedJobIds: string[];
}

export const JobMatchesView: React.FC<JobMatchesViewProps> = ({
  profile,
  onApplyDirectly,
  onTailorForJob,
  onOpenUploadModal,
  appliedJobIds
}) => {
  const [jobs, setJobs] = useState<RecommendedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [directApplyingId, setDirectApplyingId] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recommend-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      const data = await res.json();
      if (data && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch job recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [profile]);

  const domains = ['ALL', ...Array.from(new Set(jobs.map(j => j.domain).filter(Boolean)))];

  const filteredJobs = jobs.filter(j => {
    if (selectedDomain === 'ALL') return true;
    return j.domain === selectedDomain;
  });

  const handleDirectApplyClick = async (job: RecommendedJob) => {
    setDirectApplyingId(job.id);
    await onApplyDirectly(job);
    setTimeout(() => {
      setDirectApplyingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="card-3d-elevated bg-gradient-to-br from-[#FFFDFB] via-[#FAF4EA] to-[#F4E9D5] border border-[#DFCBA7] p-6 sm:p-9 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF3E6] border border-[#DEC8A2] text-[#8C6926] text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E44]" />
            <span>AI Match Engine · Grounded in {profile.personalInfo.fullName}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#29251D] tracking-tight">
            Tailored Data Analytics Job Opportunities
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#5F5646] leading-relaxed">
            Curated roles matched to your verified technical skills (SQL, Python, Tableau, dbt, BI). Review match scores, inspect why each role fits your background, and apply directly with 1-click.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onOpenUploadModal}
              className="btn-gold-3d inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload New Resume to Re-Match</span>
            </button>

            <button
              onClick={fetchRecommendations}
              disabled={isLoading}
              className="btn-white-3d inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#A8803A] ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Matches</span>
            </button>
          </div>
        </div>
      </div>

      {/* Domain Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 card-3d p-4 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-[#8C754E]" />
          <span className="text-[#6A604E] font-medium">Filter Domain:</span>
          <div className="flex flex-wrap gap-1.5">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDomain === d
                    ? 'bg-[#FAF4E8] text-[#846224] border border-[#D5BF96] shadow-sm'
                    : 'text-[#6A604E] hover:text-[#2A251D] hover:bg-[#F5EFE4]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <span className="text-[#7D7464] text-xs font-medium">
          Showing {filteredJobs.length} opportunities
        </span>
      </div>

      {/* Job Matches Grid in 3D White Cards */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C8A058] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#7A7160]">Analyzing your resume against market positions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobIds.includes(job.id) || appliedJobIds.some(id => id.includes(job.company.toLowerCase()));
            const isApplying = directApplyingId === job.id;

            return (
              <div
                key={job.id}
                className="card-3d-interactive p-6 space-y-4 flex flex-col justify-between group"
              >
                <div>
                  {/* Top line: Company & Match Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[#2A251E] text-base group-hover:text-[#8E6A26] transition-colors">
                          {job.title}
                        </span>
                        {job.urgency && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF4E6] text-[#866324] border border-[#DECDB3]">
                            {job.urgency}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-[#6F6656] mt-1.5">
                        <span className="font-bold text-[#3B3528]">{job.company}</span>
                        <span className="text-[#D0C0A5]">·</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-[#9A8F7D]" />
                          <span>{job.location}</span>
                        </span>
                        <span className="text-[#D0C0A5]">·</span>
                        <span className="flex items-center space-x-1 font-semibold text-[#446A3A]">
                          <DollarSign className="w-3 h-3" />
                          <span>{job.salary}</span>
                        </span>
                      </div>
                    </div>

                    {/* 3D Match Score Badge */}
                    <div className="flex flex-col items-center bg-gradient-to-b from-[#FFFDF9] to-[#FAF3E6] border border-[#DFCBA7] px-3 py-1.5 rounded-xl shrink-0 shadow-[0_2px_6px_rgba(180,140,70,0.1),inset_0_1px_0_rgba(255,255,255,1)]">
                      <span className="text-lg font-black text-[#84601F]">{job.matchScore}%</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#9E7730]">Match</span>
                    </div>
                  </div>

                  {/* Why Suitable Box */}
                  <div className="mt-3.5 p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#E9DAC5] text-xs text-[#524B3E] leading-relaxed shadow-sm">
                    <strong className="text-[#84601F] block mb-0.5">Why it fits your profile:</strong>
                    {job.whySuitable}
                  </div>

                  {/* Matched Skills */}
                  <div className="mt-3.5 space-y-1.5 text-xs">
                    <span className="text-[#786E5E] font-semibold block text-[11px]">Matched Strengths:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchedSkills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-[#F4F9F2] border border-[#D5E6D0] text-[#3E6833] text-[11px] font-medium">
                          ✓ {s}
                        </span>
                      ))}
                      {job.missingSkills && job.missingSkills.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF4EA] border border-[#E8D7BE] text-[#866324] text-[11px] font-medium">
                          + Learn {job.missingSkills[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-[#EFE5D5] flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#7B7262] hover:text-[#2A251E] inline-flex items-center space-x-1 font-medium"
                  >
                    <span>View Posting</span>
                    <ExternalLink className="w-3 h-3 text-[#A8803A]" />
                  </a>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onTailorForJob(job)}
                      className="btn-white-3d px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#A8803A]" />
                      <span>Tailor Resume</span>
                    </button>

                    <button
                      onClick={() => handleDirectApplyClick(job)}
                      disabled={isApplying || hasApplied}
                      className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        hasApplied
                          ? 'bg-[#EFF6EC] text-[#3B6631] border border-[#CFE3C7]'
                          : 'btn-gold-3d'
                      }`}
                    >
                      {isApplying ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Preparing...</span>
                        </>
                      ) : hasApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#3B6631]" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Apply Directly</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
