import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchMyInterviews } from '../api/interviewsApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/EmptyState';
import { StatCard, SectionHeader, ProgressRing } from '../components/ui/Premium';
import { StatCardSkeleton, InterviewCardSkeleton } from '../components/ui/SkeletonLoader';
import { getErrorMessage } from '../utils/errors';

function statusBadge(status) {
  const map = {
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30',
    'in-progress': 'bg-amber-50 text-amber-755 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30',
    pending: 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50'
  };
  return map[status] || map.pending;
}

function InterviewCard({ interview, index }) {
  const isCompleted = interview.status === 'completed';
  const score = isCompleted ? Number(interview.percentage).toFixed(0) : null;
  const grade = interview.grade || '—';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="h-full"
    >
      <Link to={isCompleted ? `/results/${interview._id}` : `/interview/${interview._id}`}
        className="block h-full group focus-visible:outline-none"
      >
        <Card
          className="flex flex-col h-full min-h-[220px] justify-between transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 backdrop-blur-sm relative overflow-hidden"
        >
          {/* Subtle gradient bar at the top */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${
            interview.difficulty === 'hard'
              ? 'bg-rose-500'
              : interview.difficulty === 'medium'
              ? 'bg-amber-500'
              : 'bg-blue-500'
          }`} />

          <div className="pt-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-semibold text-slate-950 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {interview.domain}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                    interview.difficulty === 'hard'
                      ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border border-rose-100 dark:border-rose-900/20'
                      : interview.difficulty === 'medium'
                      ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 border border-amber-100 dark:border-amber-900/20'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 border border-blue-100 dark:border-blue-900/20'
                  }`}>
                    {interview.difficulty}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {isCompleted
                    ? <>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Score: {score}%</span>
                        <span className="mx-1.5 text-slate-300 dark:text-slate-700">·</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Grade {grade}</span>
                      </>
                    : <>
                        <span className="font-semibold text-slate-650 dark:text-slate-300">Status:</span> {interview.status
                          ? interview.status.replace('-', ' ').charAt(0).toUpperCase() +
                            interview.status.replace('-', ' ').slice(1)
                          : 'Pending'}
                      </>
                  }
                </p>
              </div>
              {isCompleted && (
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="relative flex h-11 w-11 items-center justify-center">
                    <ProgressRing percentage={parseInt(score)} size={44} strokeWidth={3} color={parseInt(score) >= 90 ? 'brand' : parseInt(score) >= 80 ? 'success' : parseInt(score) >= 60 ? 'warning' : 'danger'} />
                    <span className="absolute text-[10px] font-bold text-slate-900 dark:text-slate-150">{score}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {interview.createdAt ? new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
            </p>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadge(interview.status)}`}>
              {interview.status?.replace('-', ' ')}
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export function DashboardPage() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await refreshProfile();
        const res = await fetchMyInterviews({ page: 1, limit: 100 });
        if (!cancelled && res.success && res.data) {
          setInterviews(res.data.interviews || []);
          setMeta({ total: res.data.totalInterviews ?? 0 });
        }
      } catch (e) {
        if (!cancelled) toast.error(getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshProfile]);

  const completed = interviews.filter((i) => i.status === 'completed').length;
  const inProgress = interviews.filter((i) => i.status === 'in-progress').length;
  const recent = interviews.slice(0, 6);

  const avgScore =
    user?.averageScore != null && user.totalInterviews > 0
      ? Number(user.averageScore).toFixed(1)
      : null;

  const getMotivationalMessage = () => {
    if (!avgScore) return 'Start your first technical interview and get instant AI-driven reviews!';
    const score = parseFloat(avgScore);
    if (score >= 90) return '🚀 Outstanding performance! You are fully prepared to ace your real interviews!';
    if (score >= 80) return '✨ Great progress! You are on the right track to mastering these domains.';
    if (score >= 70) return '💪 Good work! A few more practice sessions and you will lock in a top score!';
    if (score >= 60) return '🎯 Consistent progress! Let\'s target the key feedback areas next.';
    return '📈 Every session counts! Focus on the suggested improvements to boost your score.';
  };

  if (loading) {
    return (
      <div className="space-y-10 max-w-7xl mx-auto">
        {/* Skeleton Hero */}
        <div className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200/50 dark:border-slate-800" />
        {/* Skeleton Stats */}
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <StatCardSkeleton count={4} />
        </div>
        {/* Skeleton Interviews */}
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InterviewCardSkeleton />
            <InterviewCardSkeleton />
            <InterviewCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-14 border border-primary/20"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(16,23,40,0.9) 60%, rgba(139,92,246,0.08) 100%)', boxShadow: '0 0 60px rgba(99,102,241,0.12), 0 4px 32px rgba(0,0,0,0.5)' }}
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-8 justify-between">
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">Interactive Workspace</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl text-text-primary tracking-tight leading-none">
              {user?.name ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Ready to practice?'}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed">
              {getMotivationalMessage()}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/interview/new">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Start New Interview
                </Button>
              </Link>
              {completed > 0 && (
                <Link to="/results">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    View Results Archive
                  </Button>
                </Link>
              )}
            </div>
          </div>
          {/* Right side stats banner */}
          <div className="hidden lg:flex flex-col justify-center items-end min-w-[300px]">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="rounded-2xl border border-border bg-surface/80 p-5 flex flex-col items-center shadow-card">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xl mb-2">📝</div>
                <div className="font-display text-2xl font-bold text-text-primary">{meta.total}</div>
                <div className="text-xs text-text-muted mt-1 font-medium">Attempted</div>
              </div>
              <div className="rounded-2xl border border-border bg-surface/80 p-5 flex flex-col items-center shadow-card">
                <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-xl mb-2">⭐</div>
                <div className="font-display text-2xl font-bold text-text-primary">{avgScore ? `${avgScore}%` : '—'}</div>
                <div className="text-xs text-text-muted mt-1 font-medium">Avg Score</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight">Performance Summary</h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Interviews"
            value={meta.total}
            hint="All sessions started"
            icon="📝"
            animate={true}
            index={0}
            className="h-full"
          />
          <StatCard
            label="Completed"
            value={completed}
            hint={`${inProgress} active session${inProgress !== 1 ? 's' : ''}`}
            icon="✅"
            animate={true}
            index={1}
            className="h-full"
          />
          <StatCard
            label="Average Score"
            value={avgScore ? `${avgScore}%` : '—'}
            hint={avgScore ? 'Targeting above 85%' : 'No graded sessions'}
            icon="⭐"
            animate={true}
            index={2}
            className="h-full"
          />
          <StatCard
            label="Current Level"
            value={user?.experienceLevel ? user.experienceLevel.charAt(0).toUpperCase() + user.experienceLevel.slice(1) : 'Beginner'}
            hint="Based on domain selection"
            icon="🎯"
            animate={true}
            index={3}
            className="h-full"
          />
        </div>
      </div>

      {/* Recent Interviews */}
      {recent.length > 0 && (
        <div className="space-y-4">
          <SectionHeader
            title="Recent Interviews"
            subtitle="Review your grading report or resume active sessions"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((iv, idx) => (
              <InterviewCard key={iv._id} interview={iv} index={idx} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recent.length === 0 && (
        <div className="py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/10">
          <EmptyState
            title="Ready to begin?"
            description="Create your first AI-driven interview in seconds. Select your tech stack, role difficulty, and start answering custom scenario-based questions."
            action={
              <Link to="/interview/new">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-500 shadow-md">
                  Launch Your First Interview
                </Button>
              </Link>
            }
          />
        </div>
      )}

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-md"
      >
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 text-2xl select-none">💡</div>
          <div>
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">Preparation Strategy</h3>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
              <li>• <span className="font-medium text-slate-700 dark:text-slate-300">Simulate Real Environments:</span> Try to type out complete, well-formed answers without copying code blocks.</li>
              <li>• <span className="font-medium text-slate-700 dark:text-slate-300">Review AI Recommendations:</span> Pay close attention to the Areas for Improvement and Model Answers in your Results.</li>
              <li>• <span className="font-medium text-slate-700 dark:text-slate-300">Target Specific Topics:</span> Focus on category weaknesses (e.g. state management, system design) highlighted in category charts.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
