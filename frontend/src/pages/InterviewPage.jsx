import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { completeInterview, fetchInterview, submitAnswer } from '../api/interviewsApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextArea } from '../components/ui/TextField';
import { ProgressRing } from '../components/ui/Premium';
import { getErrorMessage } from '../utils/errors';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getScoreColor(score) {
  const s = score * 10;
  if (s >= 90) return 'brand';
  if (s >= 80) return 'success';
  if (s >= 60) return 'warning';
  return 'danger';
}

export function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [autosaved, setAutosaved] = useState(false);
  
  // AI Feedback Modal state
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);

  const indexInitialized = useRef(false);
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    indexInitialized.current = false;
    setLoading(true);
  }, [id]);

  const load = useCallback(async () => {
    const res = await fetchInterview(id);
    if (!res.success || !res.data) {
      throw new Error(res.message || 'Interview not found');
    }
    if (res.data.status === 'completed') {
      navigate(`/results/${id}`, { replace: true });
      return null;
    }
    return res.data;
  }, [id, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await load();
        if (!cancelled && data) {
          setInterview(data);
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(getErrorMessage(e));
          navigate('/dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load, navigate]);

  useEffect(() => {
    if (!interview?.questions?.length || indexInitialized.current) return;
    const firstOpen = interview.questions.findIndex((q) => !q.userAnswer?.trim());
    if (firstOpen === -1) {
      setIndex(Math.max(0, interview.questions.length - 1));
    } else {
      setIndex(firstOpen);
    }
    indexInitialized.current = true;
  }, [interview]);

  useEffect(() => {
    if (!interview?.questions?.[index]) return;
    const q = interview.questions[index];
    setAnswer(q.userAnswer || '');
    questionStartRef.current = Date.now();
    setElapsed(0);
  }, [interview, index]);

  useEffect(() => {
    if (!interview?.questions?.length) return;
    
    const timerInterval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - questionStartRef.current) / 1000));
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [index, interview?.questions?.length]);

  // Auto-save answer every 5 seconds if changed
  useEffect(() => {
    const autoSaveTimer = setTimeout(async () => {
      if (answer.trim() && interview?.questions?.[index]?.userAnswer !== answer.trim()) {
        try {
          const timeOnQuestion = Math.floor((Date.now() - questionStartRef.current) / 1000);
          await submitAnswer(id, {
            questionIndex: index,
            answer: answer.trim(),
            timeTaken: timeOnQuestion
          });
          setAutosaved(true);
          setTimeout(() => setAutosaved(false), 2000);
        } catch (e) {
          // Fail silently on auto-save
        }
      }
    }, 5000);

    return () => clearTimeout(autoSaveTimer);
  }, [answer, index, interview, id]);

  const total = interview?.totalQuestions || 0;
  const current = interview?.questions?.[index];

  const handleNext = async () => {
    if (!current) return;
    if (!answer.trim()) {
      toast.error('Please enter your answer before continuing.');
      return;
    }
    setSaving(true);
    try {
      const timeOnQuestion = Math.floor((Date.now() - questionStartRef.current) / 1000);
      const resSubmit = await submitAnswer(id, {
        questionIndex: index,
        answer: answer.trim(),
        timeTaken: timeOnQuestion
      });
      
      if (!resSubmit.success) {
        throw new Error(resSubmit.message || 'Failed to save answer');
      }

      // Check if AI evaluation was returned
      const evaluation = resSubmit.data?.evaluation || resSubmit.evaluation;
      
      if (evaluation) {
        // Show detailed evaluation in modal
        setCurrentEvaluation(evaluation);
        setShowFeedbackModal(true);
        toast.success(`Scored: ${evaluation.score}/10`);
      } else {
        // Fallback: Proceed directly if AI evaluation is not active
        await proceedToNext();
      }
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const proceedToNext = async () => {
    const isLast = index >= total - 1;
    if (isLast) {
      const resComplete = await completeInterview(id);
      if (!resComplete.success) {
        throw new Error(resComplete.message || 'Could not complete interview');
      }
      toast.success('Interview completed! 🎉');
      navigate(`/results/${id}`);
      return;
    }

    toast.success('Answer saved!');
    const refreshed = await load();
    if (refreshed) setInterview(refreshed);
    setIndex((i) => i + 1);
  };

  const handleModalClose = async () => {
    setShowFeedbackModal(false);
    try {
      await proceedToNext();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  if (loading || !interview?.questions?.length || !current) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          <div className="h-12 w-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
        <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  const charCount = answer.length;
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const progressPercentage = total ? Math.round(((index + 1) / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 items-start">
      {/* Main Interview Panel */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Timer, Category and Progress Bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/70 dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-sm p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                {interview.domain} · {interview.difficulty}
              </span>
              <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">
                Question {index + 1} of {total}
              </h1>
            </div>
            
            {/* Minimalist Clock Timer */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span className="text-blue-500 animate-pulse">⏱️</span>
              {formatTime(elapsed)}
            </div>
          </div>

          {/* Premium Animated Progress Bar */}
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-450 dark:text-slate-500 font-medium">
              <span>Progress</span>
              <span>{progressPercentage}% Completed</span>
            </div>
          </div>
        </div>

        {/* Question Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Card className="border-l-4 border-l-blue-600 dark:border-l-blue-500 bg-white dark:bg-slate-900 p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-[10px] font-bold text-blue-500/20 select-none uppercase font-mono">
                {current.category || 'Domain Question'}
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
                  SCENARIO / CONCEPT
                </span>
                <p className="text-lg leading-relaxed text-slate-900 dark:text-slate-100 font-medium">
                  {current.questionText || current.question}
                </p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Answer Input Panel */}
        <Card className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="answer" className="text-sm font-semibold text-slate-900 dark:text-slate-250">
                Your Professional Answer
              </label>
              <div className="flex items-center gap-2">
                {autosaved && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Auto-saved
                  </motion.span>
                )}
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {wordCount} words · {charCount} chars
                </span>
              </div>
            </div>
            
            <TextArea
              id="answer"
              placeholder="Provide a detailed answer with examples and best practices. Your answer will be evaluated by an AI technical interviewer."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={11}
              disabled={saving}
              className="font-sans text-base leading-relaxed dark:bg-slate-950 dark:border-slate-850 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={saving}
              className="w-full sm:w-auto border-slate-250 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950"
            >
              Save & Exit to Dashboard
            </Button>
            <Button
              type="button"
              loading={saving}
              onClick={handleNext}
              className="w-full sm:w-auto bg-blue-650 hover:bg-blue-600 text-white font-medium"
            >
              {index >= total - 1 ? 'Finish & Evaluate' : 'Submit Answer'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Pro Tips Sidebar */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-sm shadow-md space-y-5"
        >
          <div>
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">💡 Pro Tips</h3>
            <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">Make your response more impact-driven</p>
          </div>

          <ul className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400">
            <li className="flex items-start gap-2.5">
              <span className="text-blue-500 text-sm">✓</span>
              <span>
                <strong className="text-slate-800 dark:text-slate-300">STAR Method:</strong> Detail the Situation, Task, Action, and Result for practical scenarios.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-blue-500 text-sm">✓</span>
              <span>
                <strong className="text-slate-800 dark:text-slate-300">Trade-offs:</strong> Mention architectural trade-offs or alternative options to show seniority.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-blue-500 text-sm">✓</span>
              <span>
                <strong className="text-slate-800 dark:text-slate-300">Edge Cases:</strong> Explicitly mention error cases, scaling limits, or accessibility concerns.
              </span>
            </li>
          </ul>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Shortcuts</h4>
            <div className="flex gap-2 text-[10px] text-slate-450 dark:text-slate-500 font-mono">
              <span className="bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-800">Ctrl + Enter</span>
              <span className="self-center">Submit answer</span>
            </div>
          </div>
        </motion.div>

        {/* Expected Evaluation Criteria (if present) */}
        {current.expectedTopics && current.expectedTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-2xl border border-slate-200/80 bg-white/70 p-6 dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-sm shadow-md"
          >
            <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-2">🎯 Topics to Address</h3>
            <div className="flex flex-wrap gap-2">
              {current.expectedTopics.map((topic, i) => (
                <span
                  key={i}
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 text-xs px-2.5 py-1 rounded-lg"
                >
                  {topic}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Real-time AI Evaluation Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && currentEvaluation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              {/* Top Score Display */}
              <div className="flex flex-col items-center text-center">
                <ProgressRing 
                  percentage={(currentEvaluation.score / 10) * 100}
                  size={110}
                  strokeWidth={6}
                  color={getScoreColor(currentEvaluation.score)}
                />
                <h3 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white mt-3">
                  Score: {currentEvaluation.score}/10
                </h3>
                <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mt-1 font-mono">
                  Accuracy: {currentEvaluation.accuracy || 'medium'} · Clarity: {currentEvaluation.clarity || 'medium'}
                </p>
              </div>

              {/* General Feedback */}
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-250 uppercase tracking-wider">AI Evaluation</h4>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-450 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                  {currentEvaluation.feedback}
                </p>
              </div>

              {/* Strengths and Area to Improve Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider flex items-center gap-1.5">
                    ✅ Strengths
                  </h4>
                  <ul className="space-y-1">
                    {currentEvaluation.strengths?.map((s, idx) => (
                      <li key={idx} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="text-emerald-500">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                    {(!currentEvaluation.strengths || currentEvaluation.strengths.length === 0) && (
                      <li className="text-xs text-slate-400 italic">None highlighted</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    💡 Growth Areas
                  </h4>
                  <ul className="space-y-1">
                    {currentEvaluation.improvements?.map((imp, idx) => (
                      <li key={idx} className="text-xs text-slate-650 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                    {(!currentEvaluation.improvements || currentEvaluation.improvements.length === 0) && (
                      <li className="text-xs text-slate-400 italic">None highlighted</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Model Answer */}
              {currentEvaluation.ideal_answer && (
                <div className="space-y-1.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 p-4 rounded-xl">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Model Response
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-350">
                    {currentEvaluation.ideal_answer}
                  </p>
                </div>
              )}

              {/* Close Button / Continue */}
              <div className="pt-2">
                <Button
                  onClick={handleModalClose}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200"
                >
                  {index >= total - 1 ? 'Finish & Generate Report →' : 'Next Question →'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
