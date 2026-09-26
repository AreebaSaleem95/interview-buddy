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

function IconClipboard({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

function IconCheckCircle({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconStar({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function IconTarget({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 12H18M7.757 15.243l-1.59 1.59M6 12H4.5m15.364 6.364l-1.591-1.591M12 18.75a6.75 6.75 0 100-13.5 6.75 6.75 0 000 13.5z" />
    </svg>
  );
}

function IconLightbulb({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  );
}

function difficultyBar(difficulty) {
  if (difficulty === 'hard') return 'bg-rose-500';
  if (difficulty === 'medium') return 'bg-amber-500';
  return 'bg-emerald-500';
}

function difficultyBadge(difficulty) {
  if (difficulty === 'hard') return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
  if (difficulty === 'medium') return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
  return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
}

function statusBadge(status) {
  const map = {
    completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    'in-progress': 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    pending: 'bg-slate-800 text-slate-300 border border-slate-700'
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
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="h-full"
    >
      <Link 
        to={isCompleted ? `/results/${interview._id}` : `/interview/${interview._id}`}
        className="block h-full group focus-visible:outline-none"
      >
        <div className="flex flex-col h-full min-h-[220px] justify-between rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-5 shadow-xl hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-brand-sm transition-all duration-300 relative overflow-hidden">
          <div className={`absolute top-0 left-0 right-0 h-[3px] ${difficultyBar(interview.difficulty)}`} />

          <div className="pt-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {interview.domain ? interview.domain.toUpperCase() : 'GENERAL'}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${difficultyBadge(interview.difficulty)}`}>
                    {interview.difficulty || 'medium'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">
                  {interview.totalQuestions} Questions · {
                    isCompleted ? `Final Grade: ${grade}` : 'Active session in progress'
                  }
                </p>
              </div>
              {isCompleted && (
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="relative flex h-11 w-11 items-center justify-center">
                    <ProgressRing 
                      percentage={parseInt(score)} 
                      size={44} 
                      strokeWidth={3} 
                      color={parseInt(score) >= 90 ? 'brand' : parseInt(score) >= 80 ? 'success' : parseInt(score) >= 60 ? 'warning' : 'danger'} 
                    />
                    <span className="absolute text-[10px] font-bold text-white">{score}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-400">
              {interview.createdAt ? new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
            </p>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusBadge(interview.status)}`}>
              {interview.status?.replace('-', ' ')}
            </span>
          </div>
        </div>
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
    if (score >= 90) return 'Outstanding performance! You are fully prepared to ace your real interviews!';
    if (score >= 80) return 'Great progress! You are on the right track to mastering these domains.';
    if (score >= 70) return 'Good work! A few more practice sessions and you will lock in a top score!';
    if (score >= 60) return 'Consistent progress! Let\'s target the key feedback areas next.';
    return 'Every session counts! Focus on the suggested improvements to boost your score.';
  };

  if (loading) {
    return (
      <div className="space-y-10 max-w-7xl mx-auto">
        <div className="h-64 rounded-3xl bg-slate-900/60 animate-pulse border border-white/10" />
        <div className="space-y-4">
          <div className="h-6 w-32 rounded bg-slate-800 animate-pulse" />
          <StatCardSkeleton count={4} />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-40 rounded bg-slate-800 animate-pulse" />
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
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-4xl p-8 sm:p-10 lg:p-12 border border-indigo-500/20 bg-slate-900/80 shadow-2xl backdrop-blur-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-stretch gap-8 justify-between">
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-3 w-fit mx-auto lg:mx-0">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Interactive Workspace
            </div>
            <h1 className="font-display text-3xl font-extrabold sm:text-5xl text-white tracking-tight leading-tight">
              {user?.name ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Ready to practice?'}
            </h1>
            <p className="mt-3 text-base text-slate-300 max-w-xl leading-relaxed">
              {getMotivationalMessage()}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/interview/new">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto shadow-brand-sm font-semibold"
                >
                  Start New Interview →
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center items-end min-w-[280px]">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5 flex flex-col items-center text-center backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                  <IconClipboard className="h-5 w-5" />
                </div>
                <div className="font-display text-2xl font-bold text-white">{meta.total}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">Attempted</div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-800/80 p-5 flex flex-col items-center text-center backdrop-blur-md">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
                  <IconStar className="h-5 w-5" />
                </div>
                <div className="font-display text-2xl font-bold text-white">{avgScore ? `${avgScore}%` : '—'}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">Avg Score</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Summary */}
      <div className="space-y-4">
        <div className="border-l-4 border-indigo-500 pl-4">
          <h2 className="font-display text-xl font-black text-white tracking-tight">Performance Summary</h2>
          <p className="text-xs text-slate-400 mt-0.5">Key metrics aggregated across all mock interview sessions</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Interviews"
            value={meta.total}
            hint="All sessions started"
            icon={<IconClipboard />}
            animate={true}
            index={0}
            className="h-full"
          />
          <StatCard
            label="Completed"
            value={completed}
            hint={`${inProgress} active session${inProgress !== 1 ? 's' : ''}`}
            icon={<IconCheckCircle />}
            animate={true}
            index={1}
            className="h-full"
          />
          <StatCard
            label="Average Score"
            value={avgScore ? `${avgScore}%` : '—'}
            hint={avgScore ? 'Targeting above 85%' : 'No graded sessions'}
            icon={<IconStar />}
            animate={true}
            index={2}
            className="h-full"
          />
          <StatCard
            label="Current Level"
            value={user?.experienceLevel ? user.experienceLevel.charAt(0).toUpperCase() + user.experienceLevel.slice(1) : 'Beginner'}
            hint="Based on domain selection"
            icon={<IconTarget />}
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
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-2 backdrop-blur-xl">
          <EmptyState
            title="Ready to begin?"
            description="Create your first AI-driven interview in seconds. Select your tech stack, role difficulty, and start answering custom scenario-based questions."
            action={
              <Link to="/interview/new">
                <Button size="lg" variant="primary" className="shadow-brand font-semibold">
                  Launch Your First Interview →
                </Button>
              </Link>
            }
          />
        </div>
      )}

      {/* Preparation Strategy Banner */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-7 shadow-xl backdrop-blur-xl">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <IconLightbulb className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">Preparation Strategy & Tips</h3>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-400 leading-relaxed">
              <li>• <span className="font-semibold text-slate-200">Simulate Real Environments:</span> Type out complete, well-formed answers without pasting generated code.</li>
              <li>• <span className="font-semibold text-slate-200">Review AI Recommendations:</span> Pay close attention to the Areas for Improvement and Model Answers in your Results.</li>
              <li>• <span className="font-semibold text-slate-200">Target Specific Topics:</span> Focus on category weaknesses (e.g. system design, edge cases) highlighted in your breakdown charts.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
