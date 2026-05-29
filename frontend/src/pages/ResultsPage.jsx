import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { fetchInterview } from '../api/interviewsApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing, SectionHeader, AnimatedCounter } from '../components/ui/Premium';
import { ResultsSkeleton } from '../components/ui/SkeletonLoader';
import ScoreTrendChart from '../components/charts/ScoreTrendChart';
import SkillRadarChart from '../components/charts/SkillRadarChart';
import CategoryBarChart from '../components/charts/CategoryBarChart';
import { getErrorMessage } from '../utils/errors';

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

  if (loading || !interview) {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <ResultsSkeleton />
      </div>
    );
  }

  const pct = interview.percentage != null ? Number(interview.percentage) : 0;
  const grade = interview.grade || 'N/A';
  const passed = interview.passed;
  const strengths = interview.strengths?.length ? interview.strengths : ['Demonstrated basic familiarity with key domain components.'];
  const weaknesses = interview.weaknesses?.length ? interview.weaknesses : ['Elaborate further on edge cases and architectural trade-offs.'];

  const getScoreColor = (score) => {
    if (score >= 90) return 'brand'; // excellent
    if (score >= 80) return 'success'; // good
    if (score >= 60) return 'warning'; // average
    return 'danger'; // needs work
  };

  const getScoreColorClass = (score) => {
    if (score >= 90) return 'text-blue-600 dark:text-blue-400';
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-450';
    if (score >= 60) return 'text-amber-500 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-450';
  };

  const scoreColor = getScoreColor(pct);

  const avgTime = interview.totalQuestions > 0
    ? Math.round((interview.questions?.reduce((sum, q) => sum + (q.timeTaken || 0), 0) || 0) / interview.totalQuestions)
    : 0;

  // Chart Data Processing
  // 1. Score trend per question
  const scorePerQuestion = (interview.questions || []).map((q, idx) => ({
    question: `Q${idx + 1}`,
    score: q.score != null ? q.score : 0,
  }));

  // 2. Skill breakdown (accuracy, clarity, completeness) aggregated from AI evaluation
  const getMetricValue = (level) => {
    const lvl = String(level).toLowerCase();
    if (lvl === 'high') return 9;
    if (lvl === 'medium') return 7;
    if (lvl === 'low') return 4;
    return 6; // fallback
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
    // Fallback using similarity score and overall percentage
    const totalSimilarity = interview.questions?.reduce((sum, q) => sum + (q.similarityScore || 0) * 10, 0) || 0;
    const avgSim = interview.totalQuestions ? Math.round(totalSimilarity / interview.totalQuestions) : 6;
    skillBreakdown = [
      { skill: "Technical Accuracy", score: Math.max(4, avgSim) },
      { skill: "Explanation Clarity", score: Math.max(4, Math.round(pct / 10)) },
      { skill: "Completeness", score: Math.max(3, Math.round(pct / 10) - 1) }
    ];
  }

  // 3. Category scores
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
        <p className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Interactive Report</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Performance Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 capitalize">
          {interview.domain} • {interview.difficulty} difficulty • Completed on {new Date(interview.completedAt || interview.updatedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </motion.div>

      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-slate-200/80 bg-white/50 p-8 dark:border-slate-800 dark:bg-slate-900/30 backdrop-blur-md shadow-lg"
      >
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          {/* Circular Progress (200px) */}
          <div className="relative flex items-center justify-center">
            <ProgressRing percentage={pct} size={200} strokeWidth={6} color={scoreColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-display text-5xl font-black text-slate-950 dark:text-white">
                <AnimatedCounter value={Math.round(pct)} />
              </p>
              <p className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">Score Percentage</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="text-center md:text-left space-y-4 max-w-sm w-full">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Evaluation Summary
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {interview.overallFeedback || 'Your technical interview has been evaluated. Review the category insights and individual answers below to master your weaker modules.'}
            </p>

            <div className="flex items-center gap-3 pt-2 justify-center md:justify-start">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-2.5 dark:border-slate-800/80 dark:bg-slate-900">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Overall Grade</p>
                <p className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">{grade}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 px-5 py-2.5 dark:border-slate-800/80 dark:bg-slate-900">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Average Score</p>
                <p className={`mt-1 font-display text-2xl font-bold ${getScoreColorClass(pct)}`}>
                  {Number(interview.overallScore || (pct / 10)).toFixed(1)} / 10
                </p>
              </div>
            </div>

            {passed !== undefined && (
              <div className="pt-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                  passed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/30'
                    : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/30'
                }`}>
                  <span>{passed ? '✓ Passed' : '📈 Under'}</span> pass threshold (60%)
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/50 p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Total Questions</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter value={interview.totalQuestions} />
            </p>
          </div>
          <div className="text-2xl bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl">📋</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/50 p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Avg Response Time</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              <AnimatedCounter value={avgTime} suffix="s" />
            </p>
          </div>
          <div className="text-2xl bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl">⏱️</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/50 p-6 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider">Interview Duration</p>
            <p className="mt-2 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
              {Math.round((interview.questions?.reduce((sum, q) => sum + (q.timeTaken || 0), 0) || 0) / 60)}m
            </p>
          </div>
          <div className="text-2xl bg-violet-50 dark:bg-violet-950/40 p-2.5 rounded-xl">⌛</div>
        </motion.div>
      </div>

      {/* Charts Section (NEW) */}
      <div className="space-y-4">
        <SectionHeader title="Performance Analytics Charts" subtitle="Interactive drilldown of technical parameters" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Score Trend Line Chart */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Score Progression</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">Performance trend per question</p>
            </div>
            <div className="mt-4">
              <ScoreTrendChart data={scorePerQuestion} />
            </div>
          </Card>

          {/* Skill Radar Chart */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Skill Breakdown</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">Parameters rated by AI model</p>
            </div>
            <div className="mt-4">
              <SkillRadarChart data={skillBreakdown} />
            </div>
          </Card>

          {/* Category Scores Bar Chart */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Category Performance</h3>
              <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">Average score grouped by topic</p>
            </div>
            <div className="mt-4">
              <CategoryBarChart data={categoryScores} />
            </div>
          </Card>

        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">✨</span>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white">Key Strengths</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {strengths.map((s, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400 items-start"
                >
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          <Card className="h-full border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">💡</span>
              <h3 className="font-display font-semibold text-slate-900 dark:text-white">Growth Opportunities</h3>
            </div>
            <ul className="mt-4 space-y-2.5">
              {weaknesses.map((w, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400 items-start"
                >
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Recommended Resources (if present) */}
      {interview.recommendations && interview.recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50"
        >
          <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>📚</span> Recommended Learning Resources
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {interview.recommendations.map((rec, i) => (
              <a
                key={i}
                href={rec.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-2xl border border-slate-100 hover:border-slate-300 bg-slate-50/50 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 transition-all group"
              >
                <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                  {rec.topic || 'Resource Topic'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {rec.resource || 'Recommended training links'}
                </p>
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Question Breakdown */}
      <div className="space-y-4">
        <SectionHeader title="Detailed Question Breakdown" subtitle="Drilldown metrics and model answers" />
        <div className="space-y-4">
          {(interview.questions || []).map((q, i) => (
            <motion.div
              key={q._id || i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex-1 space-y-2.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
                        QUESTION {i + 1}
                      </span>
                      {q.category && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                          {q.category}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white leading-relaxed">{q.questionText || q.question}</p>
                    <div className="text-sm text-slate-650 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                      <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block mb-1">Your Response:</span>
                      <p className="italic text-slate-800 dark:text-slate-200">
                        {q.userAnswer || 'No answer submitted.'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Score Indicator */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-3 flex-shrink-0 self-start">
                    <div className="relative flex h-12 w-12 items-center justify-center">
                      <ProgressRing percentage={((q.score || 0) / 10) * 100} size={48} strokeWidth={3} color={getScoreColor((q.score || 0) * 10)} />
                      <span className="absolute text-xs font-black text-slate-900 dark:text-slate-100">{q.score || 0}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">{q.timeTaken || 0}s taken</p>
                  </div>
                </div>

                {/* AI / Evaluation feedback */}
                {q.feedback && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Evaluation:</span>
                    <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-450">
                      {q.feedback}
                    </p>
                  </div>
                )}

                {/* Model response suggestion */}
                {q.evaluation?.ideal_answer && (
                  <div className="mt-3 p-3 bg-blue-50/50 dark:bg-blue-950/10 rounded-xl border border-blue-100/30 dark:border-blue-900/20 text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">Ideal Model Answer:</span>
                    <p className="text-slate-700 dark:text-slate-350">{q.evaluation.ideal_answer}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col gap-6 rounded-3xl border border-slate-200/85 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/50 sm:flex-row sm:items-center sm:justify-between shadow-md"
      >
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Review Complete! Ready for another?</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Launch a new session to challenge yourself in a different language, role, or difficulty.</p>
        </div>
        <Link to="/interview/new" className="flex-shrink-0">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold">Start New Mock Session</Button>
        </Link>
      </motion.div>

      {/* Footer Link */}
      <div className="flex justify-center gap-4 pb-8">
        <Link to="/dashboard">
          <Button variant="secondary" className="border-slate-250 hover:bg-slate-50">Return to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
