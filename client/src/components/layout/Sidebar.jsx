// client/src/components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, User, FileText, Search, ClipboardList, Brain, Building, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isRecruiter = user?.role === 'RECRUITER';

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/profile', label: 'Profile', icon: User },
    ...(isRecruiter
      ? [{ to: '/recruiter', label: 'Recruiter Hub', icon: Building }]
      : [
          { to: '/resume', label: 'AI Resume Analyzer', icon: FileText },
          { to: '/jobs', label: 'Smart Job Search', icon: Search },
          { to: '/applications', label: 'Applications', icon: ClipboardList },
          { to: '/interviews', label: 'AI Interview Practice', icon: Brain },
        ]),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      id="app-sidebar"
      className="fixed inset-y-0 left-0 w-64 flex flex-col glass border-r border-white/10 z-40"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <span className="text-white font-bold text-sm">CP</span>
        </div>
        <div>
          <span className="text-white font-bold text-base tracking-tight">AI CareerPilot</span>
          <span className="block text-[10px] text-primary-400 font-semibold uppercase">{user?.role || 'Job Seeker'}</span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-slate-400 text-xs truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          id="btn-logout"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
