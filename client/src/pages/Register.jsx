import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { Loader2, Rocket, UserCheck, Building, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'JOB_SEEKER' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const data = await registerUser(form);
      const { token, user } = data.data;
      login(token, user);
      const targetPath = user.role === 'RECRUITER' ? '/recruiter' : '/dashboard';
      navigate(targetPath, { replace: true });
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-between">
      {/* ── Navbar Navigation ────────────────────── */}
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
            to="/"
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            to="/login"
            className="text-xs font-semibold bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-xl transition"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* ── Main Register Form ───────────────────── */}
      <div className="flex items-center justify-center px-4 py-12 flex-1">
        <div className="w-full max-w-md bg-dark-900 p-8 rounded-2xl glass shadow-2xl border border-white/10 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto shadow-lg shadow-primary-500/20">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
            <p className="text-slate-400 text-xs">Join AI CareerPilot to launch your career</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-xs font-medium text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'JOB_SEEKER' })}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2 ${
                    form.role === 'JOB_SEEKER'
                      ? 'bg-primary-600/20 border-primary-500 text-white'
                      : 'bg-dark-800/60 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-primary-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Job Seeker</p>
                    <p className="text-[10px] text-slate-400">Students / Freshers</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: 'RECRUITER' })}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2 ${
                    form.role === 'RECRUITER'
                      ? 'bg-accent-600/20 border-accent-500 text-white'
                      : 'bg-dark-800/60 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Building className="w-4 h-4 text-accent-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold">Recruiter</p>
                    <p className="text-[10px] text-slate-400">Employers / Companies</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl bg-dark-800/80 border border-white/10 text-white focus:outline-none focus:border-primary-500 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-dark-800/80 border border-white/10 text-white focus:outline-none focus:border-primary-500 px-4 py-2.5 text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl bg-dark-800/80 border border-white/10 text-white focus:outline-none focus:border-primary-500 px-4 py-2.5 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 text-sm"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/10">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/5">
        © 2026 AI CareerPilot. All rights reserved.
      </footer>
    </div>
  );
}
