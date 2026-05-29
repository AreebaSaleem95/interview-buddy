import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/usersApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/TextField';
import { SelectField } from '../components/ui/SelectField';
import { getErrorMessage } from '../utils/errors';
import { AnimatedCounter } from '../components/ui/Premium';

const DOMAINS = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'general', label: 'General' }
];

function StatItem({ label, value, icon, loading = false }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted dark:text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-bold text-ink dark:text-white">
        {loading ? '—' : value}
      </p>
    </div>
  );
}

function DomainBadge({ domain, value }) {
  const domainConfig = {
    frontend: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300' },
    backend: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300' },
    devops: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300' },
    general: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' }
  };

  const config = domainConfig[domain] || domainConfig.general;
  const domainLabel = DOMAINS.find(d => d.value === domain)?.label || domain;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full ${config.bg} ${config.text} px-3 py-1.5 text-sm font-medium`}
    >
      <span>{value}</span>
      <span className="capitalize">{domainLabel}</span>
    </motion.div>
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
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-ink dark:text-white">Your Profile</h1>
          <p className="mt-2 text-ink-muted dark:text-slate-400">
            Manage your account, view your progress, and customize your preferences.
          </p>
        </div>

        {/* Profile Avatar & Name */}
        <div className="flex items-center gap-4 pt-4">
          <div className="h-16 w-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-xl font-bold text-ink dark:text-white">{user?.name}</p>
            <p className="text-sm text-ink-muted dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <StatItem label="Total Interviews" value={totalInterviews} icon="📊" />
        <StatItem label="Completed" value={completedInterviews} icon="✅" />
        <StatItem label="Average Score" value={`${avgScore}%`} icon="⭐" />
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800 mb-6">
            <h2 className="font-display text-lg font-bold text-ink dark:text-white flex items-center gap-2">
              <span>⚙️</span> Account Settings
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-400">
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
              <option value="">Select a domain...</option>
              {DOMAINS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </SelectField>

            {primaryDomain && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-brand-50 dark:bg-brand-900/20 px-4 py-3"
              >
                <p className="text-sm text-brand-700 dark:text-brand-300">
                  ✓ You'll get more {DOMAINS.find(d => d.value === primaryDomain)?.label.toLowerCase()} interview questions
                </p>
              </motion.div>
            )}

            <Button
              type="submit"
              loading={saving}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              Save changes
            </Button>
          </form>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-orange-200 dark:border-orange-900/50">
          <div className="pb-6 border-b border-orange-200 dark:border-orange-900/50 mb-6">
            <h2 className="font-display text-lg font-bold text-ink dark:text-white flex items-center gap-2">
              <span>🔒</span> Session & Security
            </h2>
            <p className="mt-2 text-sm text-ink-muted dark:text-slate-400">
              Manage your active sessions and sign out if needed.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/20 p-4 border border-orange-200 dark:border-orange-900/50">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                💡 <strong>Tip:</strong> Sign out if you're using a shared computer or want to reset your session.
              </p>
            </div>

            <Button
              type="button"
              variant="danger"
              onClick={handleLogout}
              disabled={saving}
              className="w-full"
            >
              Sign out
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="rounded-lg border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900"
      >
        <p className="text-sm text-ink-muted dark:text-slate-400">
          💪 Keep practicing! Every interview brings you closer to your goal.
        </p>
      </motion.div>
    </div>
  );
}
