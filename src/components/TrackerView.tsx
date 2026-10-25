import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Award, 
  FileText, 
  Trash2, 
  Edit3, 
  Calendar, 
  DollarSign, 
  MapPin,
  TrendingUp,
  LayoutGrid,
  List
} from 'lucide-react';
import { ApplicationRecord, ApplicationStatus } from '../types';

interface TrackerViewProps {
  applications: ApplicationRecord[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onUpdateApplication: (app: ApplicationRecord) => void;
  onDeleteApplication: (id: string) => void;
  onAddNewApplication: (app: Partial<ApplicationRecord>) => void;
}

const STATUS_COLUMNS: { key: ApplicationStatus; label: string; color: string; badge: string }[] = [
  { key: 'APPLIED', label: 'Applied', color: 'border-[#DFCDB4] bg-[#F7F3EA]', badge: 'bg-[#FAF4E6] text-[#866324] border border-[#DECDB3]' },
  { key: 'UNDER_REVIEW', label: 'Under Review', color: 'border-[#EAD5AF] bg-[#FAF3E4]', badge: 'bg-[#FAF0DE] text-[#9E6D18] border border-[#ECD9B8]' },
  { key: 'SHORTLISTED', label: 'Shortlisted', color: 'border-[#D0E2C8] bg-[#F2F8EF]', badge: 'bg-[#EEF5EB] text-[#4C7541] border border-[#D5E5CE]' },
  { key: 'INTERVIEW', label: 'Interviewing', color: 'border-[#E8CADC] bg-[#FAF0F5]', badge: 'bg-[#F8EEF4] text-[#864D73] border border-[#ECCFDF]' },
  { key: 'REJECTED', label: 'Archived', color: 'border-[#ECCBCB] bg-[#FAF2F2]', badge: 'bg-[#FAF0F0] text-[#995555] border border-[#EED0D0]' }
];

export const TrackerView: React.FC<TrackerViewProps> = ({
  applications,
  onUpdateStatus,
  onUpdateApplication,
  onDeleteApplication,
  onAddNewApplication
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationRecord | null>(null);

  // New application form state
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newScore, setNewScore] = useState(85);
  const [newSalary, setNewSalary] = useState('');
  const [newLocation, setNewLocation] = useState('Remote / Hybrid');
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('APPLIED');
  const [newNotes, setNewNotes] = useState('');

  // Filtering
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.location && app.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newTitle.trim()) return;

    onAddNewApplication({
      company_name: newCompany,
      job_title: newTitle,
      job_url: newUrl,
      match_score: Number(newScore),
      salary_range: newSalary,
      location: newLocation,
      status: newStatus,
      notes: newNotes,
      applied_date: new Date().toISOString().split('T')[0],
      tailored_resume_path: `/resumes/${newCompany}_Tailored.pdf`,
      applied_via: 'Manual Entry'
    });

    setNewCompany('');
    setNewTitle('');
    setNewUrl('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="card-3d-elevated bg-gradient-to-br from-[#FFFDFB] via-[#FAF4EA] to-[#F4E9D5] border border-[#DFCBA7] p-6 sm:p-9 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF3E6] border border-[#DEC8A2] text-[#8C6926] text-xs font-semibold mb-2 shadow-sm">
              <Layers className="w-3.5 h-3.5 text-[#B88E44]" />
              <span>Relational Lifecycle Tracker</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#29251D]">
              Application Pipeline & Status Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#5F5646] mt-1">
              One-click stage updating, recruiter follow-ups, and interview tracking across {applications.length} applications.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white p-1 rounded-2xl border border-[#D5BF96] shadow-sm">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'kanban' 
                    ? 'btn-gold-3d' 
                    : 'text-[#6A604E] hover:text-[#2A251D]'
                }`}
                title="Kanban Board View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  viewMode === 'table' 
                    ? 'btn-gold-3d' 
                    : 'text-[#6A604E] hover:text-[#2A251D]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-gold-3d inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold"
            >
              <Plus className="w-4 h-4" />
              <span>Add Application</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-4 border-t border-[#E8DAC5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#9E927E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, role, location..."
              className="w-full bg-white border border-[#D5BF96] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2A251E] placeholder-[#9E927E] focus:outline-none focus:border-[#B88E44] shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-[#88785E]" />
            <span className="text-xs text-[#6E6453] font-medium">Filter Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#D5BF96] text-xs text-[#2A251E] font-medium rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#B88E44] shadow-sm"
            >
              <option value="ALL">All ({applications.length})</option>
              <option value="APPLIED">Applied</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview</option>
              <option value="REJECTED">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {STATUS_COLUMNS.map((col) => {
            const colApps = filteredApps.filter((a) => a.status === col.key);

            return (
              <div
                key={col.key}
                className={`rounded-2xl border ${col.color} p-3.5 space-y-3 min-h-[500px] flex flex-col shadow-inner`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#EADAC5]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#2A251E]">{col.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                      {colApps.length}
                    </span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      className="card-3d-interactive p-4 space-y-2.5 group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-[#2A251D] group-hover:text-[#8E6A26] transition-colors">
                            {app.company_name}
                          </h4>
                          <p className="text-[11px] text-[#5C5344] font-medium">{app.job_title}</p>
                        </div>

                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FAF4E6] text-[#866324] border border-[#DECDB3]">
                          {app.match_score}%
                        </span>
                      </div>

                      {/* Location & Salary */}
                      {(app.location || app.salary_range) && (
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#7A7161]">
                          {app.location && (
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-2.5 h-2.5 text-[#A29683]" />
                              <span className="truncate max-w-[120px]">{app.location}</span>
                            </span>
                          )}
                          {app.salary_range && (
                            <span className="flex items-center space-x-1 font-semibold text-[#446A3A]">
                              <DollarSign className="w-2.5 h-2.5" />
                              <span>{app.salary_range}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Notes snippet */}
                      {app.notes && (
                        <p className="text-[11px] text-[#695F4F] line-clamp-2 bg-[#FAF6EE] p-2 rounded-xl border border-[#E9DAC5]">
                          {app.notes}
                        </p>
                      )}

                      {/* Quick One-Click Status Selector */}
                      <div className="pt-2 border-t border-[#EFE5D5] flex items-center justify-between text-[11px]">
                        <span className="text-[#8C8170]">{app.applied_date}</span>
                        <select
                          value={app.status}
                          onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                          className="bg-white border border-[#D5BF96] text-[10px] text-[#2A251E] font-medium rounded-lg px-2 py-0.5 focus:outline-none shadow-2xs"
                        >
                          <option value="APPLIED">Applied</option>
                          <option value="UNDER_REVIEW">Review</option>
                          <option value="SHORTLISTED">Shortlist</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="REJECTED">Archive</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="text-center py-12 text-xs text-[#9E927E]">
                      No applications in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="card-3d shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#524B3E]">
              <thead className="uppercase bg-[#FAF6F0] text-[#7A7160] border-b border-[#E7DAC7] font-semibold">
                <tr>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">ATS Match</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4">Location / Salary</th>
                  <th className="py-3 px-4">Notes & Recruiter Context</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE5D5]">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FAF6EE] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#2A251D] text-sm">{app.company_name}</div>
                      <div className="text-[#6A604F]">{app.job_title}</div>
                      {app.job_url && (
                        <a
                          href={app.job_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-[#8C6926] hover:underline inline-flex items-center space-x-0.5 mt-0.5 font-medium"
                        >
                          <span>Posting Link</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-[#3E6833]">{app.match_score}%</span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                        className="bg-white border border-[#D5BF96] text-xs text-[#2A251E] font-medium rounded-xl px-2 py-1 focus:outline-none shadow-sm"
                      >
                        <option value="APPLIED">APPLIED</option>
                        <option value="UNDER_REVIEW">UNDER REVIEW</option>
                        <option value="SHORTLISTED">SHORTLISTED</option>
                        <option value="INTERVIEW">INTERVIEW</option>
                        <option value="REJECTED">ARCHIVED</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-[#786E5E]">{app.applied_date}</td>

                    <td className="py-3 px-4">
                      <div>{app.location || 'Remote'}</div>
                      <div className="text-[#8C8170]">{app.salary_range || 'Not specified'}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="line-clamp-2 text-[#4A4234]">{app.notes || '—'}</p>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteApplication(app.id)}
                        className="p-1.5 text-[#9A8F7C] hover:text-[#8D4B4B] rounded-lg hover:bg-[#FAF0F0] transition-colors"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2A241C]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-3d-elevated p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE5D5]">
              <h3 className="text-base font-bold text-[#2A251D]">Log New Job Application</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9A8F7D] hover:text-[#2A251D]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#6A604E] block mb-1 font-semibold">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g., Snowflake"
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[#6A604E] block mb-1 font-semibold">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Junior Analytics Engineer"
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#6A604E] block mb-1 font-semibold">Job Description URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://company.com/jobs/..."
                  className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#6A604E] block mb-1 font-semibold">Match Score (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newScore}
                    onChange={(e) => setNewScore(Number(e.target.value))}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-[#6A604E] block mb-1 font-semibold">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm"
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="UNDER_REVIEW">UNDER REVIEW</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                    <option value="REJECTED">ARCHIVED</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#6A604E] block mb-1 font-semibold">Salary Range</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    placeholder="$85k - $95k"
                    className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#6A604E] block mb-1 font-semibold">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="New York, NY / Remote"
                  className="w-full bg-white border border-[#D5BF96] rounded-xl px-3 py-2 text-[#2A251E] shadow-sm"
                />
              </div>

              <div>
                <label className="text-[#6A604E] block mb-1 font-semibold">Recruiter Notes / Next Steps</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Recruiter reached out on LinkedIn; screening scheduled..."
                  className="w-full bg-white border border-[#D5BF96] rounded-xl p-2.5 text-[#2A251E] shadow-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#EFE5D5]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-white-3d px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold-3d px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
