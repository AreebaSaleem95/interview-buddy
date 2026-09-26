import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { completeInterview, fetchInterview, submitAnswer } from '../api/interviewsApi';
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
  if (s >= 85) return 'brand';
  if (s >= 70) return 'success';
  if (s >= 50) return 'warning';
  return 'danger';
}

function IconClock({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function IconCheck({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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

function IconCheckCircle({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
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
        if (cancelled || !data) return;
        setInterview(data);
        if (!indexInitialized.current && data.questions?.length) {
          const firstUnanswered = data.questions.findIndex(
            (q) => !q.userAnswer && q.score === undefined
          );
          const targetIndex = firstUnanswered >= 0 ? firstUnanswered : 0;
          setIndex(targetIndex);
          setAnswer(data.questions[targetIndex]?.userAnswer || '');
          indexInitialized.current = true;
          questionStartRef.current = Date.now();
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
  }, [load]);

  const questions = interview?.questions || [];
  const current = questions[index];
  const total = questions.length;

  useEffect(() => {
    if (loading || !interview) return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, interview]);

  useEffect(() => {
    if (!current) return;
    setAnswer(current.userAnswer || '');
    questionStartRef.current = Date.now();
  }, [index, current]);

  useEffect(() => {
    if (!current || current.userAnswer === answer) return;
    const handler = setTimeout(() => {
      localStorage.setItem(`interview_${id}_q${index}`, answer);
      setAutosaved(true);
      setTimeout(() => setAutosaved(false), 2000);
    }, 1500);

    return () => clearTimeout(handler);
  }, [answer, current, id, index]);

  const proceedToNext = async () => {
    const fresh = await load();
    if (!fresh) return;
    setInterview(fresh);

    if (index >= total - 1) {
      setSaving(true);
      try {
        const finishRes = await completeInterview(id);
        if (!finishRes.success) {
          throw new Error(finishRes.message || 'Could not complete interview');
        }
        toast.success('Interview successfully completed!');
        navigate(`/results/${id}`);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setSaving(false);
      }
    } else {
      setIndex((i) => i + 1);
    }
  };

  const handleNext = async () => {
    if (!answer.trim()) {
      toast.error('Please type your response before proceeding.');
      return;
    }
    const qId = current?._id || current?.questionId;
    if (!qId) {
      toast.error('Question id missing');
      return;
    }

    const timeTaken = Math.max(1, Math.round((Date.now() - questionStartRef.current) / 1000));
    setSaving(true);
    try {
      const res = await submitAnswer(id, {
        questionId: qId,
        userAnswer: answer.trim(),
        timeTaken,
      });

      if (!res.success) {
        throw new Error(res.message || 'Failed to submit response');
      }

      if (res.data?.evaluation) {
        setCurrentEvaluation(res.data.evaluation);
        setShowFeedbackModal(true);
      } else {
        toast.success('Answer recorded!');
        await proceedToNext();
      }
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
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
          <div className="h-10 w-48 bg-slate-800 rounded-lg" />
          <div className="h-12 w-28 bg-slate-800 rounded-2xl" />
        </div>
        <div className="h-32 bg-slate-800 rounded-2xl" />
        <div className="h-64 bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  const charCount = answer.length;
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const progressPercentage = total ? Math.round(((index + 1) / total) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 items-start">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Progress & Timer Header */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase">
                {interview.domain} · {interview.difficulty}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                Question {index + 1} of {total}
              </h1>
            </div>
            
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 font-mono text-sm font-bold text-white shadow-brand-sm">
              <span className="text-indigo-400"><IconClock /></span>
              {formatTime(elapsed)}
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 shadow-brand-sm"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Progress</span>
              <span>{progressPercentage}% Completed</span>
            </div>
          </div>
        </div>

        {/* Question Prompt Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="rounded-3xl border border-white/10 border-l-4 border-l-indigo-500 bg-slate-900/80 backdrop-blur-xl p-7 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-[10px] font-bold text-indigo-400/40 select-none uppercase font-mono">
                {current.category || 'Domain Question'}
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold text-indigo-400 font-mono tracking-wider">
                  SCENARIO / CONCEPT
                </span>
                <p className="text-lg sm:text-xl leading-relaxed text-white font-medium">
                  {current.questionText || current.question}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Answer Box */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-7 space-y-5 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="answer" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Professional Answer
              </label>
              <div className="flex items-center gap-2">
                {autosaved && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Auto-saved
                  </motion.span>
                )}
                <span className="text-xs text-slate-400">
                  {wordCount} words · {charCount} chars
                </span>
              </div>
            </div>
            
            <TextArea
              id="answer"
              placeholder="Provide a detailed answer with architecture considerations, trade-offs, and real-world best practices. Your answer will be evaluated by the AI interviewer."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={11}
              disabled={saving}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              Save & Exit to Dashboard
            </Button>
            <Button
              type="button"
              loading={saving}
              onClick={handleNext}
              variant="primary"
              className="w-full sm:w-auto font-semibold shadow-brand-sm"
            >
              {index >= total - 1 ? 'Finish & Evaluate →' : 'Submit Answer →'}
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Tips & Topics */}
      <div className="space-y-6">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <IconLightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base">Pro Tips</h3>
              <p className="text-xs text-slate-400">Make your response more impact-driven</p>
            </div>
          </div>

          <ul className="space-y-3.5 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 mt-0.5"><IconCheck className="h-4 w-4" /></span>
              <span>
                <strong className="text-white">STAR Method:</strong> Detail the Situation, Task, Action, and Result for practical scenarios.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 mt-0.5"><IconCheck className="h-4 w-4" /></span>
              <span>
                <strong className="text-white">Trade-offs:</strong> Mention architectural trade-offs or alternative options to show seniority.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 mt-0.5"><IconCheck className="h-4 w-4" /></span>
              <span>
                <strong className="text-white">Edge Cases:</strong> Explicitly mention error cases, scaling limits, or security concerns.
              </span>
            </li>
          </ul>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Shortcuts</h4>
            <div className="flex gap-2 text-[10px] text-slate-300 font-mono">
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-white/10">Ctrl + Enter</span>
              <span className="self-center">Submit answer</span>
            </div>
          </div>
        </div>

        {current.expectedTopics && current.expectedTopics.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <IconTarget className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Topics to Address</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {current.expectedTopics.map((topic, i) => (
                <span
                  key={i}
                  className="bg-slate-800/90 border border-white/10 text-slate-200 text-xs px-3 py-1 rounded-lg"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Evaluation Modal */}
      <AnimatePresence>
        {showFeedbackModal && currentEvaluation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-3xl border border-indigo-500/30 bg-slate-900 p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-white relative"
            >
              <div className="flex flex-col items-center text-center">
                <ProgressRing 
                  percentage={(currentEvaluation.score / 10) * 100}
                  size={110}
                  strokeWidth={6}
                  color={getScoreColor(currentEvaluation.score)}
                />
                <h3 className="text-2xl font-extrabold font-display text-white mt-3">
                  Score: {currentEvaluation.score}/10
                </h3>
                <p className="text-xs font-semibold tracking-wider uppercase text-slate-400 mt-1 font-mono">
                  Accuracy: {currentEvaluation.accuracy || 'medium'} · Clarity: {currentEvaluation.clarity || 'medium'}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Evaluation</h4>
                <p className="text-sm leading-relaxed text-slate-200 bg-slate-800/80 p-4 rounded-2xl border border-white/10">
                  {currentEvaluation.feedback}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <IconCheckCircle className="h-4 w-4" /> Strengths
                  </h4>
                  <ul className="space-y-1.5">
                    {currentEvaluation.strengths?.map((s, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                    {(!currentEvaluation.strengths || currentEvaluation.strengths.length === 0) && (
                      <li className="text-xs text-slate-400 italic">None highlighted</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <IconLightbulb className="h-4 w-4" /> Growth Areas
                  </h4>
                  <ul className="space-y-1.5">
                    {currentEvaluation.improvements?.map((imp, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                    {(!currentEvaluation.improvements || currentEvaluation.improvements.length === 0) && (
                      <li className="text-xs text-slate-400 italic">None highlighted</li>
                    )}
                  </ul>
                </div>
              </div>

              {currentEvaluation.ideal_answer && (
                <div className="space-y-1.5 bg-indigo-950/40 border border-indigo-500/30 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Model Response
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-300 mt-1">
                    {currentEvaluation.ideal_answer}
                  </p>
                </div>
              )}

              <div className="pt-2">
                <Button
                  onClick={handleModalClose}
                  variant="primary"
                  className="w-full shadow-brand"
                >
                  {index >= total - 1 ? 'Finish & Generate Report →' : 'Continue to Next Question →'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
