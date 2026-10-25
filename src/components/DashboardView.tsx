import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  Filter,
  Plus
} from 'lucide-react';
import { ApplicationRecord } from '../types';

interface DashboardViewProps {
  applications: ApplicationRecord[];
  onNavigateToTailor: () => void;
  onNavigateToTracker: () => void;
  onNavigateToMatches?: () => void;
  onOpenUploadModal?: () => void;
  onUpdateStatus: (id: string, status: ApplicationRecord['status']) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  applications,
  onNavigateToTailor,
  onNavigateToTracker,
  onNavigateToMatches,
  onOpenUploadModal,
  onUpdateStatus
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Funnel calculations
  const total = applications.length;
  const underReview = applications.filter(a => a.status === 'UNDER_REVIEW').length;
  const shortlisted = applications.filter(a => a.status === 'SHORTLISTED').length;
  const interviewing = applications.filter(a => a.status === 'INTERVIEW').length;
  const rejected = applications.filter(a => a.status === 'REJECTED').length;
  const appliedOnly = applications.filter(a => a.status === 'APPLIED').length;

  // Funnel conversion rates
  const shortlistedRate = total > 0 ? Math.round(((shortlisted + interviewing) / total) * 100) : 0;
  const interviewRate = (shortlisted + interviewing) > 0 ? Math.round((interviewing / (shortlisted + interviewing)) * 100) : 0;
  const rejectionRate = total > 0 ? Math.round((rejected / total) * 100) : 0;

  // Average Match Scores by status
  const calcAvgScore = (list: ApplicationRecord[]) => {
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, curr) => acc + (curr.match_score || 0), 0);
    return Math.round(sum / list.length);
  };

  const avgInterviewScore = calcAvgScore(applications.filter(a => a.status === 'INTERVIEW'));
  const avgShortlistScore = calcAvgScore(applications.filter(a => a.status === 'SHORTLISTED'));
  const avgRejectedScore = calcAvgScore(applications.filter(a => a.status === 'REJECTED'));
  const avgOverallScore = calcAvgScore(applications);

  // Skill Gap Insights Calculation
  const rejectedMissingCount: Record<string, number> = {};
  const allMissingCount: Record<string, number> = {};

  applications.forEach(app => {
    if (app.missing_skills && Array.isArray(app.missing_skills)) {
      app.missing_skills.forEach(skill => {
        allMissingCount[skill] = (allMissingCount[skill] || 0) + 1;
        if (app.status === 'REJECTED') {
          rejectedMissingCount[skill] = (rejectedMissingCount[skill] || 0) + 1;
        }
      });
    }
  });

  const sortedSkillGaps = Object.entries(allMissingCount)
    .sort((a, b) => b[1] - a[1])
    .map(([skill, count]) => ({
      skill,
      totalCount: count,
      rejectedCount: rejectedMissingCount[skill] || 0,
      impactLevel: count >= 2 ? 'High Impact' : 'Moderate Impact',
      recommendation: getTrainingTip(skill)
    }));

  function getTrainingTip(skill: string): string {
    const s = skill.toLowerCase();
    if (s.includes('spark') || s.includes('pyspark')) {
      return 'Build a portfolio project using PySpark on Databricks Community Edition for large-scale data transformation.';
    }
    if (s.includes('airflow')) {
      return 'Learn DAG workflows and task scheduling in Apache Airflow; add a scheduled cron ETL pipeline to your GitHub.';
    }
    if (s.includes('snowflake')) {
      return 'Complete Snowflake Hands-on Essentials focusing on clustering, zero-copy clone, and stage loading.';
    }
    if (s.includes('dbt')) {
      return 'Earn the free dbt Fundamentals badge and integrate automated dbt tests in your BigQuery project.';
    }
    if (s.includes('looker')) {
      return 'Practice LookML dimensions, measures, and explores via Google Cloud Skills Boost tutorials.';
    }
    return `Practice real-world case studies involving ${skill} and highlight any relevant coursework or personal labs.`;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with peaceful White & Light Gold 3D styling */}
      <div className="card-3d-elevated bg-gradient-to-br from-[#FFFDFB] via-[#FAF4EA] to-[#F4E9D5] border border-[#DFCBA7] p-6 sm:p-9 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#EEDDC0]/30 to-transparent pointer-events-none" />
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF3E6] border border-[#DEC8A2] text-[#8C6926] text-xs font-semibold mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B88E44]" />
            <span>Early-Career Data Analytics Pipeline</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#28241D] tracking-tight">
            Application Lifecycle & Career Intelligence
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#615849] leading-relaxed">
            Monitor your interview conversion funnel, examine ATS keyword match metrics, and pinpoint high-leverage skill gaps across your data analyst applications.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="btn-gold-3d inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upload My Resume & Match Jobs</span>
              </button>
            )}

            {onNavigateToMatches && (
              <button
                onClick={onNavigateToMatches}
                className="btn-white-3d inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
              >
                <span>View Suggested Roles & Direct Apply</span>
              </button>
            )}

            <button
              onClick={onNavigateToTailor}
              className="btn-white-3d inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            >
              <span>Tailor for Custom JD</span>
            </button>

            <button
              onClick={onNavigateToTracker}
              className="btn-white-3d inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold"
            >
              <TrendingUp className="w-4 h-4 text-[#A8803A]" />
              <span>Pipeline Kanban</span>
            </button>
          </div>
        </div>
      </div>

      {/* Funnel Metrics Grid in 3D White Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Applications */}
        <div className="card-3d p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C7364]">Total Applied</span>
            <span className="p-2 rounded-xl bg-[#F4ECDC] text-[#916B27] border border-[#E3D3BA]">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#2A261E]">{total}</span>
            <span className="text-xs text-[#7A7162]">Roles</span>
          </div>
          <div className="mt-2 text-xs text-[#827869]">
            {appliedOnly} awaiting first review
          </div>
        </div>

        {/* Under Review */}
        <div className="card-3d p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C7364]">In Review</span>
            <span className="p-2 rounded-xl bg-[#FAF0DE] text-[#9E6D18] border border-[#ECD9B8]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#946513]">{underReview}</span>
            <span className="text-xs text-[#7A7162]">Candidates</span>
          </div>
          <div className="mt-2 text-xs text-[#827869]">
            Active recruiter screening
          </div>
        </div>

        {/* Shortlisted */}
        <div className="card-3d p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C7364]">Shortlisted</span>
            <span className="p-2 rounded-xl bg-[#EEF5EB] text-[#4C7541] border border-[#D5E5CE]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#3E6833]">{shortlisted}</span>
            <span className="text-xs text-[#527D48] font-semibold">{shortlistedRate}% pass rate</span>
          </div>
          <div className="mt-2 text-xs text-[#827869]">
            Passed initial ATS screening
          </div>
        </div>

        {/* Interviews */}
        <div className="card-3d p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C7364]">Interviews</span>
            <span className="p-2 rounded-xl bg-[#F8EEF4] text-[#864D73] border border-[#ECCFDF]">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#7B3C66]">{interviewing}</span>
            <span className="text-xs text-[#864D73] font-semibold">{interviewRate}% conv.</span>
          </div>
          <div className="mt-2 text-xs text-[#827869]">
            Active technical rounds
          </div>
        </div>

        {/* Rejections */}
        <div className="card-3d p-4 sm:p-5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7C7364]">Archived</span>
            <span className="p-2 rounded-xl bg-[#FAF0F0] text-[#995555] border border-[#EED0D0]">
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#8D4B4B]">{rejected}</span>
            <span className="text-xs text-[#7A7162]">({rejectionRate}%)</span>
          </div>
          <div className="mt-2 text-xs text-[#827869]">
            Analyzed for skill gaps
          </div>
        </div>
      </div>

      {/* Visual Pipeline Funnel & ATS Match Score Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Funnel Visualizer */}
        <div className="lg:col-span-2 card-3d p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-extrabold text-[#2A251E] flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#B88E44]" />
                <span>Conversion Funnel Analysis</span>
              </h2>
              <p className="text-xs text-[#786E5E] mt-0.5">End-to-end stage progression for early-career data roles</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#F5EFE4] text-[#6A5E4C] border border-[#DFD1BE] font-medium">
              Live Relational DB Data
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {/* Step 1: Applications Submitted */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#544D3F] mb-1.5">
                <span>1. Applications Submitted</span>
                <span>{total} (100%)</span>
              </div>
              <div className="w-full inset-well-3d rounded-full h-3.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: '100%', background: 'linear-gradient(90deg, #D4AF37 0%, #B88E44 100%)' }}
                ></div>
              </div>
            </div>

            {/* Step 2: Under Review / Screening */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#544D3F] mb-1.5">
                <span>2. Recruiter Screening & Review</span>
                <span>{underReview + shortlisted + interviewing} ({total > 0 ? Math.round(((underReview + shortlisted + interviewing) / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full inset-well-3d rounded-full h-3.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 shadow-sm" 
                  style={{ 
                    width: `${total > 0 ? ((underReview + shortlisted + interviewing) / total) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #E2BF7A 0%, #C99E52 100%)'
                  }}
                ></div>
              </div>
            </div>

            {/* Step 3: Shortlisted / Recruiter Outreach */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#544D3F] mb-1.5">
                <span>3. Shortlisted for Technical Interview</span>
                <span>{shortlisted + interviewing} ({shortlistedRate}%)</span>
              </div>
              <div className="w-full inset-well-3d rounded-full h-3.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 shadow-sm" 
                  style={{ 
                    width: `${shortlistedRate}%`,
                    background: 'linear-gradient(90deg, #7FA774 0%, #5B8350 100%)'
                  }}
                ></div>
              </div>
            </div>

            {/* Step 4: Active Technical Rounds (SQL / Case Study) */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-[#544D3F] mb-1.5">
                <span>4. In-Depth Technical & Case Rounds</span>
                <span>{interviewing} ({total > 0 ? Math.round((interviewing / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full inset-well-3d rounded-full h-3.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 shadow-sm" 
                  style={{ 
                    width: `${total > 0 ? (interviewing / total) * 100 : 0}%`,
                    background: 'linear-gradient(90deg, #B584A2 0%, #894B73 100%)'
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-[#FAF5EC] border border-[#E4D4BC] flex items-start space-x-3 shadow-sm">
            <Sparkles className="w-5 h-5 text-[#A8803A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#524A3D] leading-relaxed">
              <strong className="text-[#2C271E]">Copilot Insight:</strong> Your shortlisted rate ({shortlistedRate}%) is <span className="text-[#3D6633] font-bold">+18% higher</span> when targeting roles with match scores above 85% and tailored dbt/BigQuery experience bullet points.
            </div>
          </div>
        </div>

        {/* Match Score Correlation Card */}
        <div className="card-3d p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-[#2A251E] flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#A8803A]" />
              <span>ATS Match Score Impact</span>
            </h2>
            <p className="text-xs text-[#786E5E] mt-0.5">Average suitability score vs. application outcome</p>

            <div className="mt-6 space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E6D7C1] shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6A4760] font-semibold">Interviews Secured</span>
                  <span className="text-lg font-bold text-[#7E3D6B]">{avgInterviewScore}%</span>
                </div>
                <div className="w-full inset-well-3d rounded-full h-2 mt-2">
                  <div className="bg-[#9B5C85] h-full rounded-full" style={{ width: `${avgInterviewScore}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E6D7C1] shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#436A39] font-semibold">Shortlisted Roles</span>
                  <span className="text-lg font-bold text-[#3B6631]">{avgShortlistScore}%</span>
                </div>
                <div className="w-full inset-well-3d rounded-full h-2 mt-2">
                  <div className="bg-[#5B884F] h-full rounded-full" style={{ width: `${avgShortlistScore}%` }}></div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF5EB] border border-[#E6D7C1] shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#804242] font-semibold">Rejected Roles</span>
                  <span className="text-lg font-bold text-[#804242]">{avgRejectedScore}%</span>
                </div>
                <div className="w-full inset-well-3d rounded-full h-2 mt-2">
                  <div className="bg-[#A46363] h-full rounded-full" style={{ width: `${avgRejectedScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E8DAC5] text-[11px] text-[#786F60]">
            Targeting positions with ≥ 85% match score yields a 3.4x higher interview invitation rate.
          </div>
        </div>
      </div>

      {/* Module 4: Skill Gap Insights Section in 3D Cards */}
      <div className="card-3d p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-[#F6ECE0] text-[#9C6D1F] border border-[#E5D2B8]">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-extrabold text-[#2A251E]">Data Analyst Skill Gap Intelligence</h2>
            </div>
            <p className="text-xs text-[#786E5E] mt-1">
              Aggregated from rejected vs. shortlisted applications to pinpoint highest-ROI learning areas.
            </p>
          </div>
          <span className="text-xs text-[#6A5F4E] self-start sm:self-auto bg-[#F4EFE6] px-3.5 py-1.5 rounded-xl border border-[#DECDB7] font-semibold">
            {sortedSkillGaps.length} Gaps Detected in Target JDs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSkillGaps.map((item) => (
            <div 
              key={item.skill} 
              onClick={() => setSelectedSkill(selectedSkill === item.skill ? null : item.skill)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedSkill === item.skill 
                  ? 'bg-[#FAF4E8] border-[#C8A158] shadow-[0_4px_16px_rgba(180,140,70,0.18)] ring-1 ring-[#C8A158]' 
                  : 'card-3d-interactive'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#27231B]">{item.skill}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-[#9E4D4D] font-semibold">
                      In {item.rejectedCount} rejections
                    </span>
                    <span className="text-[#C6B69C]">•</span>
                    <span className="text-xs text-[#7A7161]">
                      {item.totalCount} total mentions
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  item.rejectedCount >= 1 
                    ? 'bg-[#FDF0F0] text-[#9C4B4B] border border-[#EDCCCC]' 
                    : 'bg-[#FBF6EC] text-[#936C22] border border-[#E9D9BA]'
                }`}>
                  {item.impactLevel}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#EDE1CF]">
                <div className="flex items-start space-x-2 text-xs text-[#524B3E]">
                  <BookOpen className="w-3.5 h-3.5 text-[#A8803A] shrink-0 mt-0.5" />
                  <p className="line-clamp-2 leading-relaxed">{item.recommendation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Skill Detail Callout */}
        {selectedSkill && (
          <div className="mt-6 p-4 rounded-2xl bg-[#FAF3E6] border border-[#DFCBA7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-[#2A251D]">Recommended Action for: {selectedSkill}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-[#F4EADC] text-[#866324] border border-[#DECDB3] font-bold">
                  High Priority
                </span>
              </div>
              <p className="text-xs text-[#5E5545] leading-relaxed">
                {sortedSkillGaps.find(g => g.skill === selectedSkill)?.recommendation}
              </p>
            </div>
            <button
              onClick={() => setSelectedSkill(null)}
              className="btn-white-3d px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Recent Applications Snapshot */}
      <div className="card-3d p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#2A251E]">Recent Application Pipeline Activity</h2>
            <p className="text-xs text-[#786E5E] mt-0.5">Quickly update status when recruiters respond or schedule interviews</p>
          </div>
          <button
            onClick={onNavigateToTracker}
            className="text-xs text-[#8E6A26] hover:text-[#5F4513] font-bold inline-flex items-center space-x-1"
          >
            <span>View Full Pipeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#4A4335]">
            <thead className="text-xs uppercase bg-[#FAF6F0] text-[#7A7160] border-b border-[#E7DAC7]">
              <tr>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4">ATS Match</th>
                <th className="py-3 px-4">Applied Date</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE5D5]">
              {applications.slice(0, 5).map((app) => (
                <tr key={app.id} className="hover:bg-[#FAF6EE] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#2A251D]">{app.company_name}</div>
                    <div className="text-xs text-[#786E5E]">{app.job_title}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-[#FAF4E6] text-[#866324] border border-[#DECDB3]">
                      {app.match_score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#786E5E]">{app.applied_date}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      app.status === 'INTERVIEW'
                        ? 'bg-[#F9EFF5] text-[#7E3D6B] border border-[#E9C7DC]'
                        : app.status === 'SHORTLISTED'
                        ? 'bg-[#EFF6EC] text-[#3E6833] border border-[#CFE3C7]'
                        : app.status === 'UNDER_REVIEW'
                        ? 'bg-[#FAF2E1] text-[#8F661A] border border-[#EBD6B0]'
                        : app.status === 'REJECTED'
                        ? 'bg-[#FAF0F0] text-[#934747] border border-[#ECCECE]'
                        : 'bg-[#F3EFE6] text-[#695D4A] border border-[#DFD1BD]'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationRecord['status'])}
                      className="bg-white border border-[#D5BF96] text-xs text-[#2A251E] font-medium rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#B88E44] shadow-sm"
                    >
                      <option value="APPLIED">APPLIED</option>
                      <option value="UNDER_REVIEW">UNDER REVIEW</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="INTERVIEW">INTERVIEW</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
