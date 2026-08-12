// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { Sparkles, FileText, ClipboardList, Brain, Award, Briefcase, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';

/* ─── Stat Card ─────────────────────────────────────────── */
const StatCard = ({ icon, label, value, color }) => (
  <div className="glass rounded-2xl p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-300">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get('/dashboard');
        setDashData(data?.data || {});
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? 'Good morning' : greetingHour < 18 ? 'Good afternoon' : 'Good evening';

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full min-h-screen">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="p-8 text-red-400">{error}</div>
      </AppLayout>
    );
  }

  const stats = dashData?.stats || {};
  const recommendedJobs = dashData?.recommendedJobs || [];
  const recentApplications = dashData?.recentApplications || [];
  const resume = dashData?.resume;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 space-y-8 max-w-6xl mx-auto">

        {/* Header */}
        <header>
          <p className="text-slate-400 text-sm font-medium">{greeting}, 👋</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-1 text-white">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">{user?.name || 'User'}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here is your AI-powered career dashboard overview.</p>
        </header>

        {/* Stats Grid */}
        <section aria-label="Career statistics">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<FileText className="w-6 h-6 text-white" />}
              label="Resume Score"
              value={stats.resumeScore ? `${stats.resumeScore}%` : '0%'}
              color="bg-primary-600/80"
            />
            <StatCard
              icon={<ClipboardList className="w-6 h-6 text-white" />}
              label="Applications"
              value={stats.applicationsCount || 0}
              color="bg-violet-600/80"
            />
            <StatCard
              icon={<Award className="w-6 h-6 text-white" />}
              label="Shortlisted"
              value={stats.shortlistedCount || 0}
              color="bg-emerald-600/80"
            />
            <StatCard
              icon={<Brain className="w-6 h-6 text-white" />}
              label="AI Interviews"
              value={stats.interviewsCount || 0}
              color="bg-accent-600/80"
            />
          </div>
        </section>

        {/* Recommended Jobs & Resume Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recommended Jobs (2 cols) */}
          <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-400" /> AI Recommended Jobs
              </h2>
              <Link to="/jobs" className="text-xs font-semibold text-primary-400 hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">No job recommendations yet. Update your skills in profile to get matched!</p>
            ) : (
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <div key={job._id} className="p-4 bg-dark-900/60 rounded-xl border border-white/10 flex items-center justify-between gap-4 hover:border-primary-500/30 transition">
                    <div>
                      <h3 className="font-bold text-white text-base">{job.title}</h3>
                      <p className="text-xs text-slate-400">{job.company} • {job.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {job.matchScore}% Match
                      </span>
                      <Link to="/jobs" className="p-2 rounded-xl bg-primary-600/20 text-primary-300 hover:bg-primary-600/30">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resume & Recent Apps Status (1 col) */}
          <div className="space-y-6">
            {/* Resume Banner */}
            <div className="glass rounded-2xl p-6 space-y-4 border border-primary-500/30">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-400" /> Resume Status
              </h3>
              {resume ? (
                <div className="space-y-3">
                  <div className="p-3 bg-dark-900/60 rounded-xl">
                    <p className="text-sm font-semibold text-white truncate">{resume.fileName}</p>
                    <p className="text-xs text-emerald-400 mt-1">✓ AI Score: {resume.analysis?.score || 80}/100</p>
                  </div>
                  <Link to="/resume" className="block text-center text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white py-2 rounded-xl transition">
                    Re-Analyze Resume
                  </Link>
                </div>
              ) : (
                <div className="text-center py-2 space-y-3">
                  <p className="text-slate-400 text-xs">No resume uploaded yet.</p>
                  <Link to="/resume" className="block text-center text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white py-2 rounded-xl transition">
                    Upload & Analyze Resume
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Recent Applications */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-400" /> Recent Applications
              </h3>
              {recentApplications.length === 0 ? (
                <p className="text-slate-400 text-xs py-2">No applications submitted yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentApplications.map((app) => (
                    <div key={app._id} className="flex items-center justify-between text-xs p-2.5 bg-dark-900/40 rounded-xl">
                      <span className="font-semibold text-white truncate max-w-[140px]">{app.jobId?.title || 'Job'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
};

export default Dashboard;
