import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { getErrorMessage } from '../utils/errors';
import { validateName, validateEmail, validatePassword } from '../utils/formValidation';

const benefits = [
  { icon: '✨', text: 'Premium AI question library across 10+ tech domains' },
  { icon: '🎯', text: 'Real-time evaluation with detailed scoring rubrics' },
  { icon: '📈', text: 'Category performance tracking and skill radar charts' },
  { icon: '🏆', text: 'Difficulty levels from junior to staff engineer' },
];

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (nameError) newErrors.name = nameError;
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
      await register(name.trim(), email.trim(), password);
      toast.success('Account created! Welcome aboard 🚀');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = getErrorMessage(err);
      setErrors({ submit: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#090D16] text-white">

      {/* Left panel with background stock image */}
      <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-12 relative overflow-hidden border-r border-white/10">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 opacity-35"
          style={{ backgroundImage: "url('/images/auth-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/75 to-[#090D16]/40 z-0" />

        {/* Ambient Glows */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-30 bg-indigo-600 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 -right-20 h-64 w-64 rounded-full opacity-25 bg-violet-600 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black text-white btn-primary-glow shadow-brand-sm">
              AI
            </div>
            <span className="font-display font-extrabold text-white text-xl tracking-tight group-hover:text-indigo-400 transition-colors">
              InterviewBuddy
            </span>
          </Link>

          <div className="mt-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Free Developer Account
            </div>
            <h2 className="font-display text-4xl font-black text-white leading-tight">
              Scale your<br />
              <span className="text-gradient">interview prep.</span>
            </h2>
            <p className="mt-4 text-slate-300 leading-relaxed max-w-sm text-sm">
              Practice scenario-based interviews, receive granular feedback, and master technical communication.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-4 my-8">
          {benefits.map((b, i) => (
            <motion.div
              key={b.text}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                {b.icon}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>

        <p className="relative z-10 text-xs text-slate-400">
          © {new Date().getFullYear()} InterviewBuddy. Precision AI Engineering Interview Coach.
        </p>
      </div>

      {/* Right panel: form */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center px-6 py-16 lg:px-16 relative">
        <div className="w-full max-w-[420px] space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black text-white btn-primary-glow shadow-brand-sm">
              AI
            </div>
            <span className="font-display font-extrabold text-white text-lg">InterviewBuddy</span>
          </div>

          <div>
            <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">Create your account</h1>
            <p className="mt-2 text-sm text-slate-400">Start practicing mock interviews in under a minute.</p>
          </div>

          {/* Form card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400"
                  >
                    {errors.submit}
                  </motion.div>
                )}
              </AnimatePresence>

              <TextField
                id="name" label="Full name" type="text"
                autoComplete="name" required value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe" error={errors.name} disabled={loading}
              />
              <TextField
                id="email" label="Email address" type="email"
                autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" error={errors.email} disabled={loading}
              />
              <div>
                <TextField
                  id="password" label="Password" type="password"
                  autoComplete="new-password" required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" error={errors.password} disabled={loading}
                />
                <p className="mt-1.5 text-[11px] text-slate-400 leading-tight">
                  Must be 8+ characters with uppercase, lowercase, and a number.
                </p>
              </div>

              <Button type="submit" className="w-full mt-3" size="lg" loading={loading} disabled={loading}>
                Create Free Account →
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-400 font-medium">or sign up with</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Google', icon: 'G' },
                { label: 'GitHub', icon: '⌥' },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => toast(`${p.label} authentication connected`)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-200 hover:border-indigo-500/40 hover:bg-slate-700/80 transition-all shadow-sm"
                >
                  <span className="font-bold text-sm text-indigo-400">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
