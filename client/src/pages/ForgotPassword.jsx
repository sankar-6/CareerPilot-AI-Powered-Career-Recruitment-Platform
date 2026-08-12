import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2, Rocket, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/forgotpassword', { email });
      setResetInfo(data);
      toast.success('Password reset link generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request password reset');
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

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-12 flex-1">
        <div className="w-full max-w-md bg-dark-900 p-8 rounded-2xl glass shadow-2xl border border-white/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <KeyRound className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Reset Your Password</h2>
            <p className="text-slate-400 text-xs">Enter your account email to receive password reset instructions</p>
          </div>

          {!resetInfo ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-dark-800/80 border border-white/10 text-white focus:outline-none focus:border-primary-500 px-4 py-2.5 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 text-sm"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl text-center animate-fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Reset Link Ready</h3>
              <p className="text-xs text-slate-300">
                Click the button below to proceed to the secure password reset page:
              </p>
              <Link
                to={resetInfo.resetUrl}
                className="inline-block w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg shadow-emerald-600/20"
              >
                Proceed to Reset Password
              </Link>
            </div>
          )}

          <div className="text-center pt-2 border-t border-white/10">
            <p className="text-xs text-slate-400">
              Remembered your password?{' '}
              <Link to="/login" className="text-primary-400 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/5">
        © 2026 AI CareerPilot. All rights reserved.
      </footer>
    </div>
  );
}
