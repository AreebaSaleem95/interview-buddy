import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { startInterview } from '../api/interviewsApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SelectField } from '../components/ui/SelectField';
import { getErrorMessage } from '../utils/errors';

const DOMAINS = [
  { value: 'frontend', label: 'Frontend', icon: '💻', desc: 'React, CSS, Browser Performance & JS Engines' },
  { value: 'backend', label: 'Backend', icon: '⚙️', desc: 'Node.js, Databases, System Design & APIs' },
  { value: 'devops', label: 'DevOps', icon: '🚀', desc: 'CI/CD, Docker, Kubernetes & Cloud Architecture' },
  { value: 'general', label: 'General Stack', icon: '🎯', desc: 'Data Structures, Software Principles & Algorithms' }
];

const DIFFICULTIES = [
  { value: 'easy', label: 'Easy', icon: '🌱', desc: 'Foundational concepts & syntax' },
  { value: 'medium', label: 'Medium', icon: '⚡', desc: 'Mid-level principles & trade-offs' },
  { value: 'hard', label: 'Hard', icon: '🔥', desc: 'System scale, bottlenecks & edge-cases' }
];

export function StartInterviewPage() {
  const navigate = useNavigate();
  const [domain, setDomain] = useState('backend');
  const [difficulty, setDifficulty] = useState('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await startInterview({
        domain,
        difficulty,
        numberOfQuestions: Number(numberOfQuestions)
      });
      if (!res.success || !res.data?.interviewId) {
        throw new Error(res.message || 'Could not start interview');
      }
      toast.success('Interview session initialized! 🎉');
      navigate(`/interview/${res.data.interviewId}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Step 1: Configuration</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
          Initialize New Mock Session
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Customize your experience by selecting a focus domain and difficulty target. AI will generate specialized scenarios.
        </p>
      </motion.div>

      <form onSubmit={handleStart} className="space-y-8">
        
        {/* Domain Visual Grid */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-350 uppercase tracking-wider block">
            1. Select Tech Focus
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {DOMAINS.map((d) => {
              const selected = domain === d.value;
              return (
                <motion.div
                  key={d.value}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDomain(d.value)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all flex items-start gap-4 ${
                    selected
                      ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20 shadow-md ring-1 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-850 dark:bg-slate-900/40 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-3xl p-2 bg-slate-100 dark:bg-slate-950 rounded-xl select-none">
                    {d.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-905 dark:text-white text-sm">
                      {d.label}
                    </h3>
                    <p className="text-xs text-slate-450 dark:text-slate-400 mt-1 leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Visual Grid */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-350 uppercase tracking-wider block">
            2. Choose Difficulty Level
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            {DIFFICULTIES.map((df) => {
              const selected = difficulty === df.value;
              return (
                <motion.div
                  key={df.value}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDifficulty(df.value)}
                  className={`cursor-pointer rounded-2xl border p-4 text-center transition-all flex flex-col items-center justify-center ${
                    selected
                      ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20 shadow-md ring-1 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-850 dark:bg-slate-900/40 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl mb-2 select-none">{df.icon}</span>
                  <h3 className="font-semibold text-slate-905 dark:text-white text-sm">
                    {df.label}
                  </h3>
                  <p className="text-[11px] text-slate-450 dark:text-slate-455 mt-1 leading-normal">
                    {df.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Question Count Select */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-6 dark:border-slate-800 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm space-y-4 max-w-md mx-auto">
          <SelectField
            id="count"
            label="3. Session Length"
            value={String(numberOfQuestions)}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
            className="dark:bg-slate-950 focus:ring-blue-500/20"
          >
            {[3, 5, 7, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} Interview Scenarios
              </option>
            ))}
          </SelectField>
        </div>

        {/* Action Button Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-slate-205 dark:border-slate-850">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto border-slate-200 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium"
          >
            Launch Interview Session
          </Button>
        </div>

      </form>
    </div>
  );
}
