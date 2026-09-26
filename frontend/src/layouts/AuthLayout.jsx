import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#090D16] text-white relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-25 bg-cover bg-center mix-blend-screen"
        style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#090D16]/60 via-[#090D16]/85 to-[#090D16]" />

      <div className="relative z-10 mx-auto w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl btn-primary-glow text-sm font-black text-white shadow-brand-sm">
              AI
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              InterviewBuddy
            </span>
          </Link>
          <h1 className="mt-8 font-display text-3xl font-extrabold text-white tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
