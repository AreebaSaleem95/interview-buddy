import { motion } from 'framer-motion';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: '⬡', end: true },
  { to: '/interview/new', label: 'New Interview', icon: '◈' },
  { to: '/profile', label: 'Profile', icon: '◉' },
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
    <div className="min-h-screen bg-background text-text-primary flex flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-border"
        style={{ background: 'rgba(4,6,15,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2.5 group shrink-0">
              <motion.div
                whileHover={{ scale: 1.08 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}
              >
                AI
              </motion.div>
              <span className="hidden font-display font-extrabold text-text-primary sm:inline text-sm tracking-tight group-hover:text-gradient transition-all">
                InterviewBuddy
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right: Theme + User */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={toggleTheme}
              className="rounded-lg p-2 text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors border border-transparent hover:border-border"
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

            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
              >
                {getInitials(user?.name)}
              </div>
              <span className="hidden max-w-[110px] truncate text-sm font-medium text-text-secondary sm:inline">
                {user?.name || 'User'}
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-text-muted hover:text-error hover:bg-error/8 transition-colors border border-transparent hover:border-error/20"
            >
              Sign out
            </motion.button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 md:hidden no-scrollbar"
          style={{ background: 'rgba(4,6,15,0.9)' }}>
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Page content */}
      <motion.main
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow w-full"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
