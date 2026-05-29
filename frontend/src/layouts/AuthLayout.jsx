import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-card">
              IB
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink dark:text-white">
              Interview Buddy
            </span>
          </Link>
          <h1 className="mt-8 font-display text-2xl font-bold text-ink dark:text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-ink-muted dark:text-slate-400">{subtitle}</p>}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
