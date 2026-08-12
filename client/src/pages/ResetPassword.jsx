import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader2, Rocket, KeyRound, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.put(`/auth/resetpassword/${token}`, { password });
      toast.success('Password updated successfully!');
      
      const { token: jwtToken, user } = data.data;
      login(jwtToken, user);
      
      const targetPath = user.role === 'RECRUITER' ? '/recruiter' : '/dashboard';
      navigate(targetPath, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-between">
      {/* Navbar */}
      <nav className="w-full glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-105 transition">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
            AI CareerPilot
          </span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12 flex-1">
        <div className="w-full max-w-md bg-dark-900 p-8 rounded-2xl glass shadow-2xl border border-white/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Create New Password</h2>
            <p className="text-slate-400 text-xs">Enter your new secure password below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-dark-800/80 border border-white/10 text-white focus:outline-none focus:border-primary-500 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl bg-dark-800/80 border border-white/10 text-white focus:outline-none focus:border-primary-500 px-4 py-2.5 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 text-sm"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {submitting ? 'Updating...' : 'Update Password & Login'}
            </button>
          </form>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/5">
        © 2026 AI CareerPilot. All rights reserved.
      </footer>
    </div>
  );
}
