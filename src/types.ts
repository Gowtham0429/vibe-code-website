export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED' | 'INTERVIEW';

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tools: string[];
  description: string;
  bullets: string[];
  link?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  graduationYear: string;
  gpa?: string;
  location?: string;
}

export interface CertificationItem {
  id?: string;
  name: string;
  issuer: string;
  year: string;
}

export interface MasterProfile {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    github: string;
    portfolio: string;
    workAuthorization: string;
    requiresSponsorship: string;
    noticePeriod: string;
    expectedSalary: string;
    yearsOfExperience: string;
  };
  headline: string;
  summary: string;
  skills: {
    sqlAndDatabases: string[];
    programmingAndScripting: string[];
    biAndVisualization: string[];
    cloudAndWarehouses: string[];
    analyticsAndStatistics: string[];
    toolsAndWorkflow: string[];
    softSkills: string[];
  };
  experience: WorkExperience[];
  projects: ProjectItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
}

export interface JobDescriptionAnalysis {
  companyName: string;
  jobTitle: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salaryRange?: string;
  requiredHardSkills: string[];
  preferredHardSkills: string[];
  softSkills: string[];
  qualifications: string[];
  keyResponsibilities: string[];
  domain: string;
  rawText: string;
}

export interface TailoredBulletDiff {
  id: string;
  original: string;
  tailored: string;
  rationale: string;
  keywordsIntegrated: string[];
}

export interface TailoredExperience {
  id: string;
  company: string;
  role: string;
  bullets: TailoredBulletDiff[];
}

export interface TailoredProject {
  id: string;
  title: string;
  tools: string[];
  bullets: TailoredBulletDiff[];
}

export interface TailoredResumeResult {
  jobTitle: string;
  companyName: string;
  matchScore: number;
  scoreBreakdown: {
    hardSkills: number;
    softSkills: number;
    experience: number;
    keywordDensity: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  tailoredSummary: string;
  originalSummary: string;
  tailoredExperience: TailoredExperience[];
  tailoredProjects: TailoredProject[];
  tailoredSkills: {
    category: string;
    skills: string[];
  }[];
  antiHallucinationAudit: {
    isFullyGrounded: boolean;
    verificationNotes: string;
    prohibitedInventionsChecked: string[];
    reframedPointsCount: number;
  };
  atsRecommendations: string[];
}

export interface ApplicationRecord {
  id: string;
  company_name: string;
  job_title: string;
  job_url: string;
  match_score: number;
  tailored_resume_path: string;
  applied_date: string;
  status: ApplicationStatus;
  last_updated: string;
  notes?: string;
  salary_range?: string;
  location?: string;
  missing_skills?: string[];
  matched_skills?: string[];
  applied_via?: string;
}

export interface ScreeningQA {
  question: string;
  answer: string;
  rationale: string;
}

export interface RecommendedJob {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  whySuitable: string;
  jdText: string;
  jobUrl: string;
  domain: string;
  urgency?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'apply' | 'tailor' | 'view_tracker';
    label: string;
    payload?: any;
  };
}

