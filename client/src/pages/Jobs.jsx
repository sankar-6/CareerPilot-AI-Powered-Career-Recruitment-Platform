// client/src/pages/Jobs.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import { Search, MapPin, Briefcase, DollarSign, Clock, CheckCircle, XCircle, Send, Loader2, Sparkles, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Jobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (jobType) params.jobType = jobType;
      if (location) params.location = location;

      const { data } = await api.get('/jobs', { params });
      setJobs(data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApply = async (jobId) => {
    setApplying(true);
    try {
      await api.post(`/jobs/${jobId}/apply`);
      toast.success('Successfully applied for the job!');
      setSelectedJob(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary-400" />
            Smart Job Portal
          </h1>
          <p className="text-slate-400 text-sm mt-1">Browse jobs and see your AI-computed skill match percentage instantly.</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
            {message.text}
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search by job title, skills, or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-dark-900/80 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white focus:border-primary-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition"
            >
              Search Jobs
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Type:
            </span>
            {['', 'Full-time', 'Part-time', 'Internship', 'Contract'].map((type) => (
              <button
                key={type}
                onClick={() => setJobType(type)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition ${
                  jobType === type
                    ? 'bg-primary-600 text-white border border-primary-500'
                    : 'bg-dark-900/60 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {type || 'All Types'}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <p className="text-slate-400">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id || job.id}
                className="glass rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-primary-500/40 transition group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary-300 transition">
                        {job.title}
                      </h3>
                      <p className="text-slate-400 text-sm font-medium">{job.company}</p>
                    </div>
                    
                    {/* Skill Match Badge */}
                    <div
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 border ${
                        job.matchScore >= 75
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : job.matchScore >= 50
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {job.matchScore || 80}% Match
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-4">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-primary-400" /> {job.location}</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-accent-400" /> {job.jobType}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> {job.salary || 'Competitive'}</span>
                  </div>

                  <p className="text-slate-300 text-sm mt-3 line-clamp-2">{job.description}</p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {job.requiredSkills?.map((skill, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-dark-900/80 border border-white/10 text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-semibold text-primary-400 hover:underline"
                  >
                    View Match Details
                  </button>

                  {user?.role === 'JOB_SEEKER' && (
                    <button
                      onClick={() => handleApply(job._id)}
                      disabled={applying}
                      className="bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 hover:opacity-90 transition disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" /> Apply Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Match Detail Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass max-w-lg w-full rounded-2xl p-6 space-y-6 animate-scale-up border border-primary-500/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedJob.title}</h3>
                  <p className="text-slate-400 text-sm">{selectedJob.company} • {selectedJob.location}</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Match Score Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-dark-900/60 p-4 rounded-xl">
                  <span className="text-sm font-semibold text-white">Overall Skill Alignment</span>
                  <span className="text-xl font-extrabold text-primary-400">{selectedJob.matchScore || 80}%</span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Required Skills Breakdown</h4>
                  <div className="space-y-2">
                    {selectedJob.matchDetails?.matchedSkills?.map((skill, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span>✓ {skill}</span>
                        <span className="text-xs font-bold">Matched</span>
                      </div>
                    ))}
                    {selectedJob.matchDetails?.missingSkills?.map((skill, i) => (
                      <div key={i} className="flex items-center justify-between text-sm p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                        <span>✗ {skill}</span>
                        <span className="text-xs font-bold">Missing</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Close
                </button>
                {user?.role === 'JOB_SEEKER' && (
                  <button
                    onClick={() => handleApply(selectedJob._id)}
                    disabled={applying}
                    className="bg-primary-600 text-white font-semibold text-sm px-5 py-2 rounded-xl flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Apply for Job
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};

export default Jobs;
