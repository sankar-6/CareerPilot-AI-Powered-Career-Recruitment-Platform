// client/src/pages/RecruiterDashboard.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import { Briefcase, Plus, Users, CheckCircle, Clock, Trash2, Edit3, Send, Loader2, Sparkles, Building } from 'lucide-react';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplicants: 0, shortlistedCandidates: 0 });
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [selectedJobApplicants, setSelectedJobApplicants] = useState(null);
  const [applicantsList, setApplicantsList] = useState([]);
  const [saving, setSaving] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    requiredSkills: '',
    location: '',
    salary: '',
    experience: '0-2 years',
    jobType: 'Full-time',
    applicationDeadline: '',
  });

  const fetchData = async () => {
    try {
      const { data } = await api.get('/dashboard');
      if (data?.data?.stats) setStats(data.data.stats);
      if (data?.data?.myJobs) setMyJobs(data.data.myJobs);

      const jobsRes = await api.get('/jobs/recruiter/my-jobs');
      if (jobsRes.data?.data) setMyJobs(jobsRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      company: '',
      description: '',
      requiredSkills: '',
      location: '',
      salary: '',
      experience: '0-2 years',
      jobType: 'Full-time',
      applicationDeadline: '',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJobId(job._id);
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      description: job.description || '',
      requiredSkills: (job.requiredSkills || []).join(', '),
      location: job.location || '',
      salary: job.salary || '',
      experience: job.experience || '0-2 years',
      jobType: job.jobType || 'Full-time',
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, jobForm);
      } else {
        await api.post('/jobs', jobForm);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const handleViewApplicants = async (job) => {
    setSelectedJobApplicants(job);
    try {
      const { data } = await api.get(`/jobs/${job._id}/applicants`);
      setApplicantsList(data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      setApplicantsList((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Building className="w-8 h-8 text-primary-400" />
              Recruiter Portal
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage job postings, review candidate profiles, and update application statuses.</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-5">
            <p className="text-3xl font-extrabold text-white">{stats.totalJobs}</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Total Jobs Posted</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-3xl font-extrabold text-emerald-400">{stats.activeJobs}</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Active Postings</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-3xl font-extrabold text-indigo-400">{stats.totalApplicants}</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Total Applicants</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="text-3xl font-extrabold text-purple-400">{stats.shortlistedCandidates}</p>
            <p className="text-xs text-slate-400 uppercase mt-1">Shortlisted</p>
          </div>
        </div>

        {/* Posted Jobs List */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" /> Your Posted Jobs
          </h2>

          {myJobs.length === 0 ? (
            <p className="text-slate-400 text-sm">No jobs posted yet. Click "Post New Job" to get started.</p>
          ) : (
            <div className="space-y-4">
              {myJobs.map((job) => (
                <div key={job._id} className="p-4 bg-dark-900/60 rounded-xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{job.company} • {job.location} • {job.jobType}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {job.requiredSkills?.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary-500/10 text-primary-300 border border-primary-500/20">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewApplicants(job)}
                      className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
                    >
                      <Users className="w-3.5 h-3.5" /> Applicants
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(job)}
                      className="p-2 text-slate-300 hover:bg-white/10 rounded-xl transition"
                      title="Edit Job"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* View Applicants Modal */}
        {selectedJobApplicants && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass max-w-2xl w-full rounded-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto border border-primary-500/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Applicants for {selectedJobApplicants.title}</h3>
                  <p className="text-slate-400 text-xs">{applicantsList.length} candidate(s) applied</p>
                </div>
                <button onClick={() => setSelectedJobApplicants(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              {applicantsList.length === 0 ? (
                <p className="text-slate-400 text-sm py-4">No candidates have applied for this job yet.</p>
              ) : (
                <div className="space-y-4">
                  {applicantsList.map((app) => (
                    <div key={app._id} className="p-4 bg-dark-900/80 rounded-xl border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-white">{app.applicantId?.name || 'Applicant'}</p>
                          <p className="text-xs text-slate-400">{app.applicantId?.email}</p>
                        </div>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="bg-dark-950 border border-white/10 text-xs font-semibold text-white rounded-xl px-3 py-1.5 outline-none focus:border-indigo-500"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Candidate Skills */}
                      {app.profile?.skills && (
                        <div>
                          <p className="text-[11px] text-slate-500 uppercase font-semibold">Candidate Skills:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {app.profile.skills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Post/Edit Job Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass max-w-xl w-full rounded-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto border border-primary-500/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold text-white">
                  {editingJobId ? 'Edit Job Opening' : 'Post New Job Opening'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleSaveJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      placeholder="TechCorp Inc."
                      className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Location</label>
                    <input
                      type="text"
                      required
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      placeholder="Remote / New York, NY"
                      className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Required Skills (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={jobForm.requiredSkills}
                    onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                    placeholder="Java, Node.js, React, MongoDB, Docker"
                    className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2 text-white outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Job Type</label>
                    <select
                      value={jobForm.jobType}
                      onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                      className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2 text-white outline-none text-sm"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      placeholder="$80,000 - $110,000"
                      className="w-full bg-dark-900/80 border border-white/10 rounded-xl px-4 py-2 text-white outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Job Description</label>
                  <textarea
                    rows="4"
                    required
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    placeholder="Describe key responsibilities and expectations..."
                    className="w-full bg-dark-900/80 border border-white/10 rounded-xl p-3 text-white outline-none text-sm"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-slate-400">Cancel</button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm px-6 py-2 rounded-xl flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {saving ? 'Saving...' : editingJobId ? 'Update Job' : 'Publish Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default RecruiterDashboard;
