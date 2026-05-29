import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { getErrorMessage } from '../utils/errors';
import { validateEmail, validatePassword } from '../utils/formValidation';

const highlights = [
  { icon: '⚡', title: 'Real-time AI Evaluation', desc: 'Scoring rubrics, model answers, and growth steps after every question.' },
  { icon: '📊', title: 'Visual Progress Tracking', desc: 'Score trends, category breakdowns, and improvement insights.' },
  { icon: '🎯', title: 'Scenario-based Questions', desc: 'Real-world engineering challenges across Frontend, Backend, DevOps & more.' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err);
      setErrors({ submit: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background">

      {/* Left panel */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 relative overflow-hidden border-r border-border">
        {/* Blobs */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366F1, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-20 -right-20 h-64 w-64 rounded-full opacity-12"
          style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-sm font-black text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 20px rgba(99,102,241,0.5)' }}>
              AI
            </div>
            <span className="font-display font-extrabold text-text-primary text-lg tracking-tight group-hover:text-gradient transition-all">
              InterviewBuddy
            </span>
          </Link>

          <div className="mt-16">
            <h2 className="font-display text-4xl font-black text-text-primary leading-tight">
              Level up your<br />
              <span className="text-gradient">technical prep.</span>
            </h2>
            <p className="mt-4 text-text-secondary leading-relaxed max-w-xs">
              AI-driven mock interviews with instant scoring and domain-specific feedback.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          {highlights.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="flex gap-4 items-start"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg border border-primary/20 bg-primary/8">
                {h.icon}
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">{h.title}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{h.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="relative z-10 text-xs text-text-muted">
          © {new Date().getFullYear()} InterviewBuddy. All rights reserved.
        </p>
      </div>

      {/* Right panel: form */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center px-6 py-16 lg:px-16">
        <div className="w-full max-w-[400px] space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black text-white"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>AI</div>
            <span className="font-display font-extrabold text-text-primary">InterviewBuddy</span>
          </div>

          <div>
            <h1 className="font-display text-3xl font-extrabold text-text-primary tracking-tight">Welcome back</h1>
            <p className="mt-2 text-sm text-text-secondary">Continue your preparation journey.</p>
          </div>

          {/* Form card */}
          <div className="rounded-2xl border border-border bg-surface p-7 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-error/25 bg-error/8 px-4 py-3 text-sm font-medium text-error"
                  >
                    {errors.submit}
                  </motion.div>
                )}
              </AnimatePresence>

              <TextField
                id="email" label="Email address" type="email"
                autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" error={errors.email} disabled={loading}
              />
              <TextField
                id="password" label="Password" type="password"
                autoComplete="current-password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" error={errors.password} disabled={loading}
              />

              <Button type="submit" className="w-full mt-2" size="lg" loading={loading} disabled={loading}>
                Sign in to Dashboard
              </Button>
            </form>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted font-medium">or continue with</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Google', icon: 'G' },
                { label: 'GitHub', icon: '⌥' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => toast(`${p.label} login coming soon`)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold text-text-secondary hover:border-primary/40 hover:bg-surface-elevated transition-colors"
                >
                  <span className="font-bold text-sm">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
