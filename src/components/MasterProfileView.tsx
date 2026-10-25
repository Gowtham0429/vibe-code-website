import React, { useState } from 'react';
import { 
  User, 
  Save, 
  Plus, 
  Trash2, 
  FileJson, 
  UploadCloud, 
  CheckCircle2, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Sparkles
} from 'lucide-react';
import { MasterProfile, WorkExperience, ProjectItem } from '../types';

interface MasterProfileViewProps {
  profile: MasterProfile;
  onSaveProfile: (profile: MasterProfile) => void;
}

export const MasterProfileView: React.FC<MasterProfileViewProps> = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<MasterProfile>(profile);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState<'info' | 'skills' | 'experience' | 'projects' | 'education'>('experience');

  const handlePersonalInfoChange = (field: keyof MasterProfile['personalInfo'], val: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: val }
    }));
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Add / Remove bullet helper
  const handleUpdateExperienceBullet = (expIndex: number, bulletIndex: number, val: string) => {
    const updated = [...formData.experience];
    updated[expIndex].bullets[bulletIndex] = val;
    setFormData({ ...formData, experience: updated });
  };

  const handleAddExperienceBullet = (expIndex: number) => {
    const updated = [...formData.experience];
    updated[expIndex].bullets.push("Engineered and optimized data pipelines delivering measurable analytical insights.");
    setFormData({ ...formData, experience: updated });
  };

  const handleRemoveExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...formData.experience];
    updated[expIndex].bullets.splice(bulletIndex, 1);
    setFormData({ ...formData, experience: updated });
  };

  // JSON Export / Import
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_Master_Profile.json`;
    a.click();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (parsed.personalInfo && parsed.skills) {
          setFormData(parsed);
          onSaveProfile(parsed);
          alert('Master profile loaded successfully!');
        }
      } catch (err) {
        alert('Invalid JSON profile file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="card-3d-elevated bg-white/95 border border-[rgba(218,196,156,0.45)] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF3E5] border border-[#DFCBA7] text-[#8C6D2D] text-xs font-semibold mb-2">
              <User className="w-3.5 h-3.5 text-[#B88E44]" />
              <span>Ground Truth Database</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#2A2318]">
              Candidate Master Profile
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6F5D] mt-1">
              Your source of truth. The AI resume tailoring engine strictly reframes from this data to prevent fake metric hallucination.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJson}
              className="btn-white-3d inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[#5A4E38] text-xs font-medium"
            >
              <FileJson className="w-4 h-4 text-[#B88E44]" />
              <span>Export JSON</span>
            </button>

            <label className="btn-white-3d inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[#5A4E38] text-xs font-medium cursor-pointer">
              <UploadCloud className="w-4 h-4 text-[#B88E44]" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <button
              onClick={handleSave}
              className="btn-gold-3d inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? 'Saved to DB!' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="mt-6 pt-4 border-t border-[rgba(218,196,156,0.35)] flex flex-wrap gap-2">
          {[
            { id: 'experience', label: 'Work Experience', icon: Briefcase },
            { id: 'skills', label: 'Technical Skills Matrix', icon: Sparkles },
            { id: 'projects', label: 'Analytics Projects', icon: FolderGit2 },
            { id: 'info', label: 'Contact & Work Auth', icon: User },
            { id: 'education', label: 'Education & Certifications', icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'btn-gold-3d text-white shadow-sm'
                    : 'bg-[#FAF7F0] text-[#7A6F5D] hover:text-[#2A2318] border border-[rgba(218,196,156,0.4)] hover:bg-[#F5EFE3]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: Work Experience */}
      {activeSection === 'experience' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2A2318]">Work Experience ({formData.experience.length})</h2>
            <button
              onClick={() => {
                const newExp: WorkExperience = {
                  id: `exp-${Date.now()}`,
                  role: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: true,
                  bullets: [
                    'Led data querying and dashboarding initiatives using SQL and analytics tooling.'
                  ]
                };
                setFormData({ ...formData, experience: [newExp, ...formData.experience] });
              }}
              className="text-xs text-[#8C6D2D] hover:text-[#644D1E] font-semibold inline-flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Position</span>
            </button>
          </div>

          <div className="space-y-6">
            {formData.experience.map((exp, expIdx) => (
              <div key={exp.id} className="card-3d bg-white border border-[rgba(218,196,156,0.45)] rounded-2xl p-6 shadow-sm space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[#6B5E4A] block mb-1 font-medium">Role Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const copy = [...formData.experience];
                        copy[expIdx].role = e.target.value;
                        setFormData({ ...formData, experience: copy });
                      }}
                      className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-2.5 py-1.5 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B5E4A] block mb-1 font-medium">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...formData.experience];
                        copy[expIdx].company = e.target.value;
                        setFormData({ ...formData, experience: copy });
                      }}
                      className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-2.5 py-1.5 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B5E4A] block mb-1 font-medium">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => {
                        const copy = [...formData.experience];
                        copy[expIdx].location = e.target.value;
                        setFormData({ ...formData, experience: copy });
                      }}
                      className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-2.5 py-1.5 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B5E4A] block mb-1 font-medium">Dates</label>
                    <div className="flex items-center space-x-1">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const copy = [...formData.experience];
                          copy[expIdx].startDate = e.target.value;
                          setFormData({ ...formData, experience: copy });
                        }}
                        className="w-1/2 bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-2 py-1.5 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
                      />
                      <span className="text-[#9E9280]">-</span>
                      <input
                        type="text"
                        value={exp.current ? 'Present' : exp.endDate}
                        onChange={(e) => {
                          const copy = [...formData.experience];
                          copy[expIdx].endDate = e.target.value;
                          setFormData({ ...formData, experience: copy });
                        }}
                        className="w-1/2 bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-2 py-1.5 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#3B3224]">Experience Accomplishments / Bullets:</span>
                    <button
                      onClick={() => handleAddExperienceBullet(expIdx)}
                      className="text-[11px] text-[#8C6D2D] hover:underline inline-flex items-center space-x-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Bullet</span>
                    </button>
                  </div>

                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-start space-x-2">
                      <span className="text-[#B88E44] text-sm mt-2">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleUpdateExperienceBullet(expIdx, bIdx, e.target.value)}
                        className="flex-1 bg-[#FCFAF7] border border-[rgba(218,196,156,0.45)] rounded-xl p-2.5 text-xs text-[#2A2318] focus:outline-none focus:border-[#C89F56] focus:bg-white leading-relaxed"
                      />
                      <button
                        onClick={() => handleRemoveExperienceBullet(expIdx, bIdx)}
                        className="p-2 text-[#9E9280] hover:text-rose-600 transition-colors"
                        title="Delete bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Technical Skills Matrix */}
      {activeSection === 'skills' && (
        <div className="card-3d bg-white border border-[rgba(218,196,156,0.45)] rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-[#2A2318]">Data Analytics Skills Matrix</h2>
            <p className="text-xs text-[#7A6F5D] mt-0.5">
              Categorized technical skills used for JD keyword matching. Comma-separated.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[#4E4332] font-semibold block mb-1">
                SQL & Database Management
              </label>
              <input
                type="text"
                value={formData.skills.sqlAndDatabases.join(', ')}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    skills: { ...formData.skills, sqlAndDatabases: e.target.value.split(',').map(s => s.trim()) }
                  });
                }}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-xl px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[#4E4332] font-semibold block mb-1">
                Python & Analytics Scripting (Pandas, NumPy, etc.)
              </label>
              <input
                type="text"
                value={formData.skills.programmingAndScripting.join(', ')}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    skills: { ...formData.skills, programmingAndScripting: e.target.value.split(',').map(s => s.trim()) }
                  });
                }}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-xl px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[#4E4332] font-semibold block mb-1">
                BI & Visualization (Tableau, Power BI, Looker)
              </label>
              <input
                type="text"
                value={formData.skills.biAndVisualization.join(', ')}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    skills: { ...formData.skills, biAndVisualization: e.target.value.split(',').map(s => s.trim()) }
                  });
                }}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-xl px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[#4E4332] font-semibold block mb-1">
                Cloud Warehouses & ETL (BigQuery, Snowflake, dbt)
              </label>
              <input
                type="text"
                value={formData.skills.cloudAndWarehouses.join(', ')}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    skills: { ...formData.skills, cloudAndWarehouses: e.target.value.split(',').map(s => s.trim()) }
                  });
                }}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-xl px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-[#4E4332] font-semibold block mb-1">
                Statistical Methods & Analytical Frameworks
              </label>
              <input
                type="text"
                value={formData.skills.analyticsAndStatistics.join(', ')}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    skills: { ...formData.skills, analyticsAndStatistics: e.target.value.split(',').map(s => s.trim()) }
                  });
                }}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-xl px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Analytics Projects */}
      {activeSection === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2A2318]">Portfolio Projects ({formData.projects.length})</h2>
          </div>

          <div className="space-y-6">
            {formData.projects.map((proj, idx) => (
              <div key={proj.id} className="card-3d bg-white border border-[rgba(218,196,156,0.45)] rounded-2xl p-6 shadow-sm space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#6B5E4A] block mb-1 font-medium">Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const copy = [...formData.projects];
                        copy[idx].title = e.target.value;
                        setFormData({ ...formData, projects: copy });
                      }}
                      className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#6B5E4A] block mb-1 font-medium">Tools Used (comma separated)</label>
                    <input
                      type="text"
                      value={proj.tools.join(', ')}
                      onChange={(e) => {
                        const copy = [...formData.projects];
                        copy[idx].tools = e.target.value.split(',').map(t => t.trim());
                        setFormData({ ...formData, projects: copy });
                      }}
                      className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#6B5E4A] block mb-1 font-medium">Brief Description</label>
                  <input
                    type="text"
                    value={proj.description}
                    onChange={(e) => {
                      const copy = [...formData.projects];
                      copy[idx].description = e.target.value;
                      setFormData({ ...formData, projects: copy });
                    }}
                    className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Personal Info & Work Auth */}
      {activeSection === 'info' && (
        <div className="card-3d bg-white border border-[rgba(218,196,156,0.45)] rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h2 className="text-base font-bold text-[#2A2318] mb-2">Personal Information & ATS Auto-Fill Values</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[#6B5E4A] block mb-1 font-medium">Full Legal Name</label>
              <input
                type="text"
                value={formData.personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[#6B5E4A] block mb-1 font-medium">Email Address</label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[#6B5E4A] block mb-1 font-medium">Phone Number</label>
              <input
                type="text"
                value={formData.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[#6B5E4A] block mb-1 font-medium">Location / Residence</label>
              <input
                type="text"
                value={formData.personalInfo.location}
                onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[#6B5E4A] block mb-1 font-medium">LinkedIn Profile</label>
              <input
                type="text"
                value={formData.personalInfo.linkedIn}
                onChange={(e) => handlePersonalInfoChange('linkedIn', e.target.value)}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>
            <div>
              <label className="text-[#6B5E4A] block mb-1 font-medium">GitHub / Portfolio URL</label>
              <input
                type="text"
                value={formData.personalInfo.github}
                onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                className="w-full bg-[#FCFAF7] border border-[rgba(218,196,156,0.5)] rounded-lg px-3 py-2 text-[#2A2318] focus:border-[#C89F56] focus:bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Education & Certifications */}
      {activeSection === 'education' && (
        <div className="card-3d bg-white border border-[rgba(218,196,156,0.45)] rounded-2xl p-6 shadow-sm space-y-4 text-xs">
          <h2 className="text-base font-bold text-[#2A2318] mb-2">Education & Certifications</h2>
          {formData.education.map((edu) => (
            <div key={edu.id} className="p-4 rounded-xl bg-[#FAF7F0] border border-[rgba(218,196,156,0.4)] space-y-1">
              <div className="font-semibold text-[#2A2318]">{edu.degree}</div>
              <div className="text-[#7A6F5D]">{edu.institution} • Graduated {edu.graduationYear} (GPA: {edu.gpa})</div>
            </div>
          ))}

          <h3 className="text-sm font-semibold text-[#2A2318] pt-2">Certifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {formData.certifications.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#FAF7F0] border border-[rgba(218,196,156,0.4)]">
                <div className="font-semibold text-[#2A2318]">{c.name}</div>
                <div className="text-[#7A6F5D]">{c.issuer} ({c.year})</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
