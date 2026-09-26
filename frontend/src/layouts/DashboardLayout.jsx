import { motion } from 'framer-motion';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const nav = [
  { to: '/dashboard', label: 'Dashboard', end: true },
  { to: '/interview/new', label: 'New Interview' },
  { to: '/profile', label: 'Profile' },
];

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col relative overflow-x-hidden">
      {/* Background with stock image ambience */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-20 bg-cover bg-center mix-blend-screen"
        style={{ backgroundImage: "url('/images/dashboard-bg.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-[#090D16]/80 to-[#090D16]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white shadow-brand-sm btn-primary-glow"
              >
                AI
              </motion.div>
              <span className="font-display font-extrabold text-white text-base tracking-tight group-hover:text-indigo-400 transition-colors">
                InterviewBuddy
              </span>
            </Link>

            <nav className="hidden items-center gap-1.5 md:flex">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-brand-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors border border-transparent hover:border-indigo-500/20"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-3.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
              <div className="h-8 w-8 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 btn-primary-glow shadow-brand-sm">
                {getInitials(user?.name)}
              </div>
              <span className="hidden max-w-[130px] truncate text-sm font-semibold text-slate-300 sm:inline">
                {user?.name || 'Engineer'}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
            >
              Sign out
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex gap-1 overflow-x-auto border-t border-white/10 px-4 py-2.5 md:hidden no-scrollbar bg-slate-950/90">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow w-full">
        <Outlet />
      </main>
    </div>
  );
}
