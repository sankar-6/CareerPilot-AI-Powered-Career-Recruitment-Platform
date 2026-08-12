// client/src/pages/Applications.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import AppLayout from '../components/layout/AppLayout';
import { ClipboardList, Building2, MapPin, Calendar, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const statusStyles = {
  Applied: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'Under Review': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Shortlisted: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  Selected: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
};

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const { data } = await api.get('/applications');
        setApps(data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-primary-400" />
            Application Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track the status of all your submitted job applications.</p>
        </div>

        {apps.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center space-y-3">
            <ClipboardList className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-xl font-bold text-white">No Applications Yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Explore the Smart Job Portal to find positions matching your skills and submit your first application.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {apps.map((app) => {
              const job = app.jobId || {};
              const badgeStyle = statusStyles[app.status] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

              return (
                <div
                  key={app._id || app.id}
                  className="glass rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-primary-500/30 transition"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{job.title || 'Software Position'}</h3>
                    <p className="text-slate-300 font-medium text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary-400" /> {job.company || 'Tech Company'}
                      {job.location && (
                        <span className="flex items-center gap-1 text-slate-400 text-xs">
                          • <MapPin className="w-3.5 h-3.5" /> {job.location}
                        </span>
                      )}
                    </p>
                    <p className="text-slate-500 text-xs flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5" /> Applied on {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className={`px-4 py-1.5 rounded-xl text-xs font-bold border ${badgeStyle}`}>
                      {app.status || 'Applied'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Applications;
