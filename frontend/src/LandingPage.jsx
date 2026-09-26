import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function IconBolt({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function IconTarget({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 12H18M7.757 15.243l-1.59 1.59M6 12H4.5m15.364 6.364l-1.591-1.591M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
    </svg>
  );
}

function IconChart({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function IconFire({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  );
}

const features = [
  {
    icon: IconBolt,
    title: 'AI Question Generation',
    desc: 'Domain-specific, adaptive questions tailored to your exact skill level and target role.',
  },
  {
    icon: IconTarget,
    title: 'Instant AI Feedback',
    desc: 'Receive detailed scoring rubrics, ideal answers, and growth steps the moment you submit.',
  },
  {
    icon: IconChart,
    title: 'Performance Analytics',
    desc: 'Track confidence trends, category averages, and score trajectories across all sessions.',
  },
  {
    icon: IconFire,
    title: 'Multiple Difficulty Levels',
    desc: 'From foundational concepts to staff-level architecture — customize every session to your goals.',
  },
];

const steps = [
  { num: '01', title: 'Create an Account', desc: 'Sign up free and choose your interview domain and experience level.' },
  { num: '02', title: 'Start a Session', desc: 'AI generates tailored scenario questions for your stack and difficulty.' },
  { num: '03', title: 'Answer & Submit', desc: 'Type your responses in a distraction-free professional interview environment.' },
  { num: '04', title: 'Review & Improve', desc: 'Get scored feedback, model answers, and a detailed analytics report.' },
];

const stats = [
  { val: '10+', label: 'Tech Domains' },
  { val: '3', label: 'Difficulty Levels' },
  { val: 'AI', label: 'Powered Review' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-white overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient background stock visual with subtle overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-25 bg-cover bg-top mix-blend-screen"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#07090E]/60 via-[#07090E]/90 to-[#07090E]" />

      {/* Floating glow spheres */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #6366F1 0%, rgba(139,92,246,0.3) 50%, transparent 70%)', filter: 'blur(80px)' }} 
        />
        <div 
          className="absolute top-1/3 -right-32 h-[450px] w-[450px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)', filter: 'blur(90px)' }} 
        />
        <div 
          className="absolute bottom-1/4 -left-32 h-[400px] w-[400px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #38BDF8 0%, transparent 70%)', filter: 'blur(90px)' }} 
        />
      </div>

      {/* Navigation Header */}
      <header className="relative z-30 border-b border-white/10 bg-[#07090E]/80 backdrop-blur-xl sticky top-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white btn-primary-glow shadow-brand-sm">
              AI
            </div>
            <span className="font-display font-extrabold text-white text-lg tracking-tight group-hover:text-indigo-400 transition-colors">
              InterviewBuddy
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link 
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-850 transition-all"
            >
              Sign in
            </Link>
            <Link 
              to="/register"
              className="btn-primary-glow px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-brand-sm"
            >
              Get Started →
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-20 sm:pt-28 sm:pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400 mb-8 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Powered by Google Gemini AI
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
            Ace every <span className="text-gradient">technical</span><br />interview you face
          </h1>

          <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl mx-auto">
            Practice with AI-generated scenario questions, receive instant structured feedback, and track your improvement across every session.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link 
              to="/register"
              className="btn-primary-glow px-8 py-3.5 rounded-2xl text-base font-bold w-full sm:w-auto shadow-brand transition-all hover:scale-[1.02]"
            >
              Start Practicing Free →
            </Link>
            <Link 
              to="/login"
              className="px-8 py-3.5 rounded-2xl text-base font-semibold text-slate-200 border border-white/10 hover:border-indigo-500/40 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 backdrop-blur-xl transition-all w-full sm:w-auto shadow-lg"
            >
              Sign in to Dashboard
            </Link>
          </div>

          {/* 3 Main Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {stats.map(({ val, label }) => (
              <div key={label} className="p-4 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-md text-center shadow-lg">
                <div className="font-display text-2xl sm:text-3xl font-black text-indigo-400">{val}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-semibold uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Everything You Need to Prepare */}
      <section className="relative z-10 py-20 border-t border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              Everything you need to prepare
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              A complete AI-powered environment built specifically for technical interview preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-7 shadow-xl hover:border-indigo-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 group-hover:scale-105 transition-transform">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white mb-1.5 group-hover:text-indigo-400 transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              How it works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              Four simple steps to a better interview performance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div 
                key={s.num}
                className="relative rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-7 shadow-xl hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="font-display text-3xl font-black text-indigo-400 mb-4 opacity-90">{s.num}</div>
                <h3 className="font-display font-bold text-lg text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-4xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-950 p-10 sm:p-14 text-center shadow-2xl backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent pointer-events-none" />
          
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white mb-4 tracking-tight relative z-10">
            Ready to level up your prep?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto text-base sm:text-lg mb-8 relative z-10">
            Join thousands of engineers using AI-powered mock interviews to land their dream jobs.
          </p>

          <Link
            to="/register"
            className="btn-primary-glow inline-flex items-center justify-center px-9 py-4 rounded-2xl text-base font-bold shadow-brand transition-all hover:scale-105 relative z-10"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#06080D] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black text-white btn-primary-glow shadow-brand-sm">
              AI
            </div>
            <span className="text-xs text-slate-400">
              © {new Date().getFullYear()} InterviewBuddy. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <Link to="/login" className="hover:text-white transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-indigo-400 font-semibold transition-colors">Get started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
