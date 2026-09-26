import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchInterview } from '../api/interviewsApi';
import { Button } from '../components/ui/Button';
import { ProgressRing, SectionHeader, AnimatedCounter } from '../components/ui/Premium';
import { ResultsSkeleton } from '../components/ui/SkeletonLoader';
import ScoreTrendChart from '../components/charts/ScoreTrendChart';
import SkillRadarChart from '../components/charts/SkillRadarChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import { getErrorMessage } from '../utils/errors';

function IconClipboardList({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
    </svg>
  );
}

function IconClock({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconHourglass({ className = 'h-6 w-6' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconSparkles({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

function IconLightbulb({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  );
}

function IconBookOpen({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

function IconCheckCircle({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconTrendingUp({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  );
}

export function ResultsPage() {
  const { id } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchInterview(id);
        if (!cancelled && res.success && res.data) {
          setInterview(res.data);
        } else if (!cancelled) {
          toast.error(res.message || 'Could not load results');
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
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <ResultsSkeleton />
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold font-display text-white">Interview Not Found</h2>
        <p className="text-slate-400">The requested interview evaluation could not be loaded.</p>
        <Link to="/dashboard">
          <Button variant="primary">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const pct = interview.percentage || 0;
  const grade = interview.grade || 'C';
  const passed = interview.passed;

  const scorePerQuestion = (interview.questions || []).map((q, idx) => ({
    question: `Q${idx + 1}`,
    score: q.score || 0
  }));

  const strengths = interview.strengths?.length > 0
    ? interview.strengths
    : (interview.questions || []).flatMap(q => q.evaluation?.strengths || []).slice(0, 5);

  const weaknesses = interview.areasForImprovement?.length > 0
    ? interview.areasForImprovement
    : (interview.questions || []).flatMap(q => q.evaluation?.improvements || []).slice(0, 5);

  const totalTimeTaken = interview.questions?.reduce((sum, q) => sum + (q.timeTaken || 0), 0) || 0;
  const avgTime = interview.totalQuestions ? Math.round(totalTimeTaken / interview.totalQuestions) : 0;

  const scoreColor = pct >= 85 ? 'brand' : pct >= 70 ? 'success' : pct >= 50 ? 'warning' : 'danger';

  const getScoreColorClass = (val) => {
    if (val >= 85) return 'text-indigo-400';
    if (val >= 70) return 'text-emerald-400';
    if (val >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getMetricValue = (val) => {
    if (val === 'high') return 9;
    if (val === 'medium') return 6;
    if (val === 'low') return 3;
    return 6;
  };

  const evaluatedQuestions = interview.questions?.filter(q => q.evaluation) || [];
  
  let skillBreakdown = [];
  if (evaluatedQuestions.length > 0) {
    const totalAccuracy = evaluatedQuestions.reduce((sum, q) => sum + getMetricValue(q.evaluation.accuracy), 0);
    const totalClarity = evaluatedQuestions.reduce((sum, q) => sum + getMetricValue(q.evaluation.clarity), 0);
    const totalCompleteness = evaluatedQuestions.reduce((sum, q) => sum + getMetricValue(q.evaluation.completeness), 0);
    
    skillBreakdown = [
      { skill: "Technical Accuracy", score: Math.round(totalAccuracy / evaluatedQuestions.length) },
      { skill: "Explanation Clarity", score: Math.round(totalClarity / evaluatedQuestions.length) },
      { skill: "Completeness", score: Math.round(totalCompleteness / evaluatedQuestions.length) }
    ];
  } else {
    const totalSimilarity = interview.questions?.reduce((sum, q) => sum + (q.similarityScore || 0) * 10, 0) || 0;
    const avgSim = interview.totalQuestions ? Math.round(totalSimilarity / interview.totalQuestions) : 6;
    skillBreakdown = [
      { skill: "Technical Accuracy", score: Math.max(4, avgSim) },
      { skill: "Explanation Clarity", score: Math.max(4, Math.round(pct / 10)) },
      { skill: "Completeness", score: Math.max(3, Math.round(pct / 10) - 1) }
    ];
  }

  const categoryMap = {};
  (interview.questions || []).forEach(q => {
    const cat = q.category || 'General';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { total: 0, count: 0 };
    }
    categoryMap[cat].total += q.score || 0;
    categoryMap[cat].count += 1;
  });

  const categoryScores = Object.keys(categoryMap).map(cat => ({
    category: cat.length > 15 ? cat.substring(0, 12) + '...' : cat,
    score: Math.round((categoryMap[cat].total / categoryMap[cat].count) * 10) / 10
  }));

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400 mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Interactive Report
        </div>
        <h1 className="mt-1 font-display text-4xl sm:text-5xl font-extrabold text-white leading-tight">
          Performance Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-400 capitalize">
          {interview.domain} • {interview.difficulty} difficulty • Completed on {new Date(interview.completedAt || interview.updatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Main Score Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-4xl border border-white/10 bg-slate-900/80 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-around gap-8 relative z-10">
          <div className="relative flex items-center justify-center">
            <ProgressRing percentage={pct} size={200} strokeWidth={6} color={scoreColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-5xl font-black text-white">
                <AnimatedCounter value={Math.round(pct)} />%
              </p>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mt-0.5">Score</p>
            </div>
          </div>

          <div className="text-center md:text-left space-y-4 max-w-sm w-full">
            <h2 className="text-2xl font-bold font-display text-white">
              Evaluation Summary
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {interview.overallFeedback || 'Your technical interview has been evaluated. Review the category insights and individual answers below to master your weaker modules.'}
            </p>

            <div className="flex items-center gap-3 pt-2 justify-center md:justify-start">
              <div className="rounded-2xl border border-white/10 bg-slate-800/90 px-5 py-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Overall Grade</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">{grade}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-800/90 px-5 py-2.5">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Average Score</p>
                <p className={`mt-1 font-display text-2xl font-bold ${getScoreColorClass(pct)}`}>
                  {Number(interview.overallScore || (pct / 10)).toFixed(1)} / 10
                </p>
              </div>
            </div>

            {passed !== undefined && (
              <div className="pt-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                  passed
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {passed ? (
                    <><IconCheckCircle className="h-3.5 w-3.5" /> Passed</>
                  ) : (
                    <><IconTrendingUp className="h-3.5 w-3.5" /> Under</>
                  )} pass threshold (60%)
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* 3 Metric Pills */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Questions</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-white">
              <AnimatedCounter value={interview.totalQuestions} />
            </p>
          </div>
          <div className="bg-indigo-500/10 text-indigo-400 p-3 rounded-2xl border border-indigo-500/20">
            <IconClipboardList className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Response Time</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-white">
              <AnimatedCounter value={avgTime} suffix="s" />
            </p>
          </div>
          <div className="bg-amber-500/10 text-amber-400 p-3 rounded-2xl border border-amber-500/20">
            <IconClock className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Interview Duration</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-white">
              {Math.max(1, Math.round((interview.questions?.reduce((sum, q) => sum + (q.timeTaken || 0), 0) || 0) / 60))}m
            </p>
          </div>
          <div className="bg-violet-500/10 text-violet-400 p-3 rounded-2xl border border-violet-500/20">
            <IconHourglass className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="space-y-4">
        <SectionHeader title="Performance Analytics Charts" subtitle="Interactive drilldown of technical parameters" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-sm font-semibold text-white">Score Progression</h3>
              <p className="text-xs text-slate-400 mt-0.5">Performance trend per question</p>
            </div>
            <div className="mt-4">
              <ScoreTrendChart data={scorePerQuestion} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <h3 className="text-sm font-semibold text-white">Skill Breakdown</h3>
              <p className="text-xs text-slate-400 mt-0.5">Parameters rated by AI model</p>
            </div>
            <div className="mt-4">
              <SkillRadarChart data={skillBreakdown} />
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 flex flex-col justify-between md:col-span-2 lg:col-span-1 shadow-xl">
            <div>
              <h3 className="text-sm font-semibold text-white">Category Performance</h3>
              <p className="text-xs text-slate-400 mt-0.5">Average score grouped by topic</p>
            </div>
            <div className="mt-4">
              <CategoryBarChart data={categoryScores} />
            </div>
          </div>

        </div>
      </div>

      {/* Strengths & Growth Areas */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-7 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <IconSparkles className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Key Strengths</h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {strengths.map((s, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-sm text-slate-300 items-start bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20"
              >
                <span className="text-emerald-400 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-7 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <IconLightbulb className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Growth Opportunities</h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {weaknesses.map((w, i) => (
              <li
                key={i}
                className="flex gap-2.5 text-sm text-slate-300 items-start bg-amber-500/10 p-3 rounded-xl border border-amber-500/20"
              >
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Learning Resources */}
      {interview.recommendations && interview.recommendations.length > 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-7 shadow-xl">
          <h3 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <IconBookOpen className="h-5 w-5" />
            </span>
            Recommended Learning Resources
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {interview.recommendations.map((rec, i) => (
              <a
                key={i}
                href={rec.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-2xl border border-white/10 hover:border-indigo-500/50 bg-slate-800/80 hover:bg-slate-800 transition-all group shadow-sm"
              >
                <h4 className="text-sm font-semibold text-indigo-400 group-hover:underline">
                  {rec.topic || 'Resource Topic'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {rec.resource || 'Recommended training material'}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Question Breakdown */}
      <div className="space-y-4">
        <SectionHeader title="Detailed Question Breakdown" subtitle="Drilldown metrics and model answers" />
        <div className="space-y-4">
          {(interview.questions || []).map((q, i) => (
            <div
              key={q._id || i}
              className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-7 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex-1 space-y-2.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-indigo-400 font-mono">
                      QUESTION {i + 1}
                    </span>
                    {q.category && (
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-medium border border-white/10">
                        {q.category}
                      </span>
                    )}
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">{q.questionText || q.question}</p>
                  
                  <div className="text-sm text-slate-300 bg-slate-800/90 p-4 rounded-2xl border border-white/10">
                    <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block mb-1">Your Response:</span>
                    <p className="italic text-slate-200">
                      {q.userAnswer || 'No answer submitted.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0 self-start">
                  <div className="relative flex h-12 w-12 items-center justify-center">
                    <ProgressRing 
                      percentage={((q.score || 0) / 10) * 100} 
                      size={48} 
                      strokeWidth={3} 
                      color={q.score >= 8 ? 'brand' : q.score >= 6 ? 'success' : q.score >= 4 ? 'warning' : 'danger'} 
                    />
                    <span className="absolute text-xs font-black text-white">{q.score || 0}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 font-mono">{q.timeTaken || 0}s taken</p>
                </div>
              </div>

              {q.feedback && (
                <div className="mt-4 pt-3 border-t border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Evaluation:</span>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {q.feedback}
                  </p>
                </div>
              )}

              {q.evaluation?.ideal_answer && (
                <div className="mt-3 p-4 bg-indigo-950/40 rounded-2xl border border-indigo-500/30 text-xs">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider block mb-1">Ideal Model Answer:</span>
                  <p className="text-slate-300 leading-relaxed">{q.evaluation.ideal_answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Review Complete Bottom CTA */}
      <div className="flex flex-col gap-6 rounded-4xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 to-slate-900/90 p-8 sm:p-10 sm:flex-row sm:items-center sm:justify-between shadow-2xl backdrop-blur-2xl">
        <div>
          <h3 className="font-display text-xl font-bold text-white">Review Complete! Ready for another?</h3>
          <p className="mt-1 text-sm text-slate-300">Launch a new session to challenge yourself in a different domain, stack, or difficulty.</p>
        </div>
        <Link to="/interview/new" className="flex-shrink-0">
          <Button variant="primary" className="font-semibold shadow-brand">Start New Mock Session →</Button>
        </Link>
      </div>

      <div className="flex justify-center gap-4 pb-8">
        <Link to="/dashboard">
          <Button variant="secondary">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
