import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/usersApi';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { SelectField } from '../components/ui/SelectField';
import { getErrorMessage } from '../utils/errors';

const DOMAINS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'general', label: 'General' }
];

function IconChartBar({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function IconCheckCircle({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconStar({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function IconCog({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconLock({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function IconLightbulb({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  );
}

function IconTrendingUp({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

function StatItem({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 text-center shadow-xl">
      <div className="flex justify-center text-indigo-400 mb-3">{icon}</div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-black text-white">
        {value}
      </p>
    </div>
  );
}

export function ProfilePage() {
  const { user, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [education, setEducation] = useState('');
  const [primaryDomain, setPrimaryDomain] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEducation(user.education || '');
      setPrimaryDomain(user.preferredDomains?.[0] || '');
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { name: name.trim() };
      if (phone.trim()) body.phone = phone.trim();
      if (education.trim()) body.education = education.trim();
      if (primaryDomain) body.preferredDomains = [primaryDomain];

      const res = await updateProfile(body);
      if (!res.success) {
        throw new Error(res.message || 'Update failed');
      }
      await refreshProfile();
      toast.success('Profile saved successfully! 🎉');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    toast.success('Signed out');
  };

  const totalInterviews = user?.stats?.totalInterviews || 0;
  const avgScore = Math.round(user?.stats?.averageScore || 0);
  const completedInterviews = user?.stats?.completedInterviews || 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header & Avatar Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">Your Profile</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your account, view your progress, and customize your preferences.
          </p>
        </div>

        <div className="flex items-center gap-5 p-6 sm:p-8 rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl btn-primary-glow flex items-center justify-center text-white text-3xl font-black shadow-brand ring-4 ring-indigo-500/20">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-display text-2xl font-black text-white">{user?.name || 'Engineer'}</p>
            <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* 3 Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatItem label="Total Interviews" value={totalInterviews} icon={<IconChartBar />} />
        <StatItem label="Completed" value={completedInterviews} icon={<IconCheckCircle />} />
        <StatItem label="Average Score" value={`${avgScore}%`} icon={<IconStar />} />
      </div>

      {/* Account Settings */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-7 sm:p-8 shadow-xl">
        <div className="pb-5 border-b border-white/10 mb-6">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <IconCog className="h-5 w-5" />
            </span>
            Account Settings
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Update your personal information and preferences.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              id="name"
              label="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              required
            />
            <TextField
              id="phone"
              label="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              disabled={saving}
            />
          </div>

          <TextField
            id="education"
            label="Education (optional)"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g., BS Computer Science, University of..."
            disabled={saving}
          />

          <SelectField
            id="domain"
            label="Primary focus domain"
            value={primaryDomain}
            onChange={(e) => setPrimaryDomain(e.target.value)}
            disabled={saving}
          >
            <option value="" className="bg-slate-900 text-slate-400">Select a domain...</option>
            {DOMAINS.map((d) => (
              <option key={d.value} value={d.value} className="bg-slate-900 text-white">
                {d.label}
              </option>
            ))}
          </SelectField>

          {primaryDomain && (
            <div className="rounded-xl bg-indigo-500/10 px-4 py-3 border border-indigo-500/20">
              <p className="text-xs text-indigo-300 flex items-center gap-2">
                <IconCheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                You'll get more {DOMAINS.find(d => d.value === primaryDomain)?.label.toLowerCase()} interview questions generated for your sessions.
              </p>
            </div>
          )}

          <Button
            type="submit"
            loading={saving}
            disabled={saving}
            className="w-full sm:w-auto shadow-brand-sm"
          >
            Save Changes
          </Button>
        </form>
      </div>

      {/* Session & Security */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-7 sm:p-8 shadow-xl">
        <div className="pb-5 border-b border-white/10 mb-6">
          <h2 className="font-display text-lg font-bold text-white flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <IconLock className="h-5 w-5" />
            </span>
            Session & Security
          </h2>
          <p className="mt-1.5 text-xs text-slate-400">
            Manage your active sessions and sign out if needed.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl bg-amber-500/10 p-4 border border-amber-500/20">
            <p className="text-xs text-amber-300 flex items-start gap-2 leading-relaxed">
              <IconLightbulb className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span><strong>Security Tip:</strong> Always sign out if you're using a shared device or want to reset your local authentication session tokens.</span>
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            onClick={handleLogout}
            disabled={saving}
            className="w-full sm:w-auto"
          >
            Sign out of this session
          </Button>
        </div>
      </div>

      {/* Motivational Banner */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 text-center shadow-xl">
        <p className="text-sm text-slate-300 flex items-center justify-center gap-2.5 font-medium">
          <IconTrendingUp className="h-5 w-5 text-indigo-400" />
          Keep practicing! Every mock scenario brings you closer to your target engineering offer.
        </p>
      </div>
    </div>
  );
}
