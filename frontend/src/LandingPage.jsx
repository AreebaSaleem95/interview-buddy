import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '⚡',
    title: 'AI Question Generation',
    desc: 'Domain-specific, adaptive questions tailored to your exact skill level and target role.',
    color: '#818CF8',
    glow: 'rgba(99,102,241,0.25)',
  },
  {
    icon: '🎯',
    title: 'Instant AI Feedback',
    desc: 'Receive detailed scoring rubrics, ideal answers, and growth steps the moment you submit.',
    color: '#34D399',
    glow: 'rgba(52,211,153,0.2)',
  },
  {
    icon: '📊',
    title: 'Performance Analytics',
    desc: 'Track confidence trends, category averages, and score trajectories across all sessions.',
    color: '#60A5FA',
    glow: 'rgba(96,165,250,0.2)',
  },
  {
    icon: '🔥',
    title: 'Multiple Difficulty Levels',
    desc: 'From foundational to senior-level system design — customize every session to your goals.',
    color: '#FBBF24',
    glow: 'rgba(251,191,36,0.2)',
  },
];

const steps = [
  { num: '01', title: 'Create an Account', desc: 'Sign up free and choose your interview domain and experience level.' },
  { num: '02', title: 'Start a Session', desc: 'AI generates tailored scenario questions for your stack and difficulty.' },
  { num: '03', title: 'Answer & Submit', desc: 'Type your responses in a distraction-free interview environment.' },
  { num: '04', title: 'Review & Improve', desc: 'Get scored feedback, model answers, and a detailed analytics report.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary overflow-x-hidden">

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(ellipse, #6366F1 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #8B5CF6 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 -left-40 h-[300px] w-[300px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(ellipse, #38BDF8 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-border"
        style={{ background: 'rgba(4,6,15,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}>
              AI
            </div>
            <span className="font-display font-extrabold text-text-primary tracking-tight">InterviewBuddy</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/login"
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors">
              Sign in
            </Link>
            <Link to="/register"
              className="btn-primary-glow px-4 py-2 rounded-xl text-sm font-semibold text-white">
              Get Started →
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Powered by Google Gemini AI
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            Ace every{' '}
            <span className="text-gradient">technical</span>
            <br />interview you face
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-text-secondary leading-relaxed mb-10">
            Practice with AI-generated scenario questions, receive instant structured feedback,
            and track your improvement across every session.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register"
              className="btn-primary-glow px-8 py-3.5 rounded-xl text-base font-bold text-white w-full sm:w-auto">
              Start Practicing Free →
            </Link>
            <Link to="/login"
              className="px-8 py-3.5 rounded-xl text-base font-semibold text-text-secondary border border-border hover:border-primary/40 hover:text-text-primary hover:bg-surface-elevated transition-all w-full sm:w-auto">
              Sign in to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto"
        >
          {[['10+', 'Tech Domains'], ['3', 'Difficulty Levels'], ['AI', 'Powered Review']].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl font-black text-gradient">{val}</div>
              <div className="text-xs text-text-muted mt-1 font-medium">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-black text-text-primary mb-3">
            Everything you need to prepare
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            A complete AI-powered environment built specifically for technical interview preparation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group rounded-2xl border border-border bg-surface p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                  style={{ background: `rgba(${f.glow.slice(5,-1)}, 0.15)`, boxShadow: `0 0 16px ${f.glow}`, border: `1px solid ${f.color}30` }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">{f.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-black text-text-primary mb-3">How it works</h2>
          <p className="text-text-secondary">Four simple steps to a better interview performance.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative rounded-2xl border border-border bg-surface p-6"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
            >
              <div className="font-display text-3xl font-black text-gradient mb-3">{s.num}</div>
              <h4 className="font-semibold text-text-primary text-sm mb-2">{s.title}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-text-muted text-lg">→</div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl p-10 text-center border border-primary/20 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
            boxShadow: '0 0 60px rgba(99,102,241,0.15)',
          }}
        >
          <h2 className="font-display text-3xl sm:text-4xl font-black text-text-primary mb-4">
            Ready to level up your prep?
          </h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            Join thousands of engineers using AI-powered mock interviews to land their dream jobs.
          </p>
          <Link to="/register"
            className="btn-primary-glow inline-block px-10 py-4 rounded-xl text-base font-bold text-white">
            Create Free Account →
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 mt-8">
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded text-xs font-black text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>AI</div>
            <span>© {new Date().getFullYear()} InterviewBuddy</span>
          </div>
          <div className="flex gap-6 text-xs">
            <a href="#" className="hover:text-text-primary transition-colors">About</a>
            <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
