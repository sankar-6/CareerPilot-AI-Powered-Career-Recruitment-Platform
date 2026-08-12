import { Link } from 'react-router-dom';
import {
  Rocket,
  FileSearch,
  BriefcaseBusiness,
  Brain,
  Target,
  ClipboardCheck,
  ChevronRight,
  Sparkles,
  Shield,
  BarChart3,
  Users,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'AI Resume Analyzer',
    description: 'Get instant AI-powered feedback on your resume with scoring, strengths, and improvement suggestions.',
    color: 'from-primary-500 to-primary-700',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Smart Job Search',
    description: 'Browse and filter jobs by title, skills, location, and type. Find your perfect match effortlessly.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: Target,
    title: 'Job Match Score',
    description: 'See exactly how your skills align with job requirements. Know your match percentage instantly.',
    color: 'from-success-500 to-success-600',
  },
  {
    icon: Brain,
    title: 'AI Interview Practice',
    description: 'Practice with AI-generated interview questions tailored to your role and get instant scoring.',
    color: 'from-warning-500 to-danger-500',
  },
  {
    icon: ClipboardCheck,
    title: 'Application Tracking',
    description: 'Track all your job applications in one place. Monitor status from Applied to Selected.',
    color: 'from-primary-400 to-accent-500',
  },
  {
    icon: BarChart3,
    title: 'Career Dashboard',
    description: 'A comprehensive dashboard with your resume score, applications, interviews, and recommendations.',
    color: 'from-accent-400 to-primary-600',
  },
];

const stats = [
  { value: 'AI-Powered', label: 'Resume Analysis' },
  { value: 'Smart', label: 'Job Matching' },
  { value: 'Real-time', label: 'Application Tracking' },
  { value: 'Practice', label: 'AI Interviews' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      {/* ─── Navbar ──────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                AI CareerPilot
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-dark-300 hover:text-white transition-colors duration-200 text-sm font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-dark-300 hover:text-white transition-colors duration-200 text-sm font-medium">
                How It Works
              </a>
              <a href="#roles" className="text-dark-300 hover:text-white transition-colors duration-200 text-sm font-medium">
                For Recruiters
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-dark-300 hover:text-white transition-colors duration-200 px-4 py-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-gradient-to-r from-primary-600 to-accent-600 text-white px-5 py-2 rounded-lg hover:from-primary-500 hover:to-accent-500 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-primary-300">AI-Powered Career Platform</span>
            </div>

            {/* Heading */}
            <h1 className="animate-slide-up text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6">
              <span className="text-white">Navigate Your </span>
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent animate-gradient">
                Career Journey
              </span>
              <br />
              <span className="text-white">with </span>
              <span className="bg-gradient-to-r from-accent-400 to-primary-400 bg-clip-text text-transparent">
                AI Guidance
              </span>
            </h1>

            {/* Subtitle */}
            <p className="animate-slide-up stagger-2 opacity-0 text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Build your profile, analyze your resume, find matching jobs, track applications, 
              and practice interviews — all powered by AI, all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="animate-slide-up stagger-3 opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-0.5"
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 glass text-dark-200 font-medium px-8 py-3.5 rounded-xl hover:bg-dark-800/60 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="animate-slide-up stagger-4 opacity-0 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center hover:bg-dark-800/40 transition-colors duration-300">
                <div className="text-lg font-bold text-primary-400">{stat.value}</div>
                <div className="text-xs text-dark-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Section ────────────────────────── */}
      <section id="features" className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                Land Your Dream Job
              </span>
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              From resume analysis to interview practice, we've got every step of your career journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group glass rounded-2xl p-6 hover:bg-dark-800/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/5"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────── */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Get started in minutes. Our platform guides you through every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Create Profile', desc: 'Sign up and build your professional profile with skills, education, and projects.', icon: Users },
              { step: '02', title: 'Upload Resume', desc: 'Upload your resume and get instant AI analysis with actionable feedback.', icon: FileSearch },
              { step: '03', title: 'Find & Apply', desc: 'Search jobs, check your match score, and apply with one click.', icon: Target },
              { step: '04', title: 'Practice & Grow', desc: 'Take AI-powered mock interviews and continuously improve.', icon: Zap },
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary-500/30 to-transparent"></div>
                )}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 flex items-center justify-center mx-auto mb-4 group-hover:border-primary-500/50 transition-colors duration-300">
                  <item.icon className="w-8 h-8 text-primary-400" />
                </div>
                <div className="text-xs font-bold text-primary-500 mb-2">{item.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-dark-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Roles Section ───────────────────────────── */}
      <section id="roles" className="py-20 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/30 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for Everyone
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Whether you're looking for your dream job or the perfect candidate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Job Seeker */}
            <div className="glass rounded-2xl p-8 hover:bg-dark-800/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Job Seekers</h3>
              <p className="text-dark-400 mb-6">Everything you need to find and land your perfect role.</p>
              <ul className="space-y-3">
                {['Create professional profile', 'AI resume analysis & scoring', 'Smart job search & filtering', 'Skill match percentage', 'Application tracking', 'AI interview practice'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-dark-300">
                    <div className="w-5 h-5 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-3 h-3 text-primary-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recruiter */}
            <div className="glass rounded-2xl p-8 hover:bg-dark-800/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BriefcaseBusiness className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Recruiters</h3>
              <p className="text-dark-400 mb-6">Streamline your hiring process with powerful tools.</p>
              <ul className="space-y-3">
                {['Post & manage job listings', 'Company profile setup', 'View candidate applications', 'Access applicant profiles', 'Update application status', 'Recruiter analytics dashboard'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-dark-300">
                    <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                      <ChevronRight className="w-3 h-3 text-accent-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────── */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Launch Your Career?
              </h2>
              <p className="text-dark-400 text-lg max-w-xl mx-auto mb-8">
                Join AI CareerPilot today and let AI guide you to your dream career.
              </p>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold px-10 py-4 rounded-xl hover:from-primary-500 hover:to-accent-500 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/25 hover:-translate-y-0.5 text-lg"
              >
                Get Started Free
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────── */}
      <footer className="border-t border-dark-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">AI CareerPilot</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-dark-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-dark-400 hover:text-white transition-colors">How It Works</a>
              <a href="#roles" className="text-sm text-dark-400 hover:text-white transition-colors">Roles</a>
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-500">
              <Shield className="w-4 h-4" />
              <span>© 2026 AI CareerPilot. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
