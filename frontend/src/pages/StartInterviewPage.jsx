import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { startInterview } from '../api/interviewsApi';
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
  { value: 'easy', label: 'Easy', icon: '🌱', desc: 'Foundational concepts & syntax', border: 'border-emerald-500', glow: 'bg-emerald-500/10 text-emerald-400' },
  { value: 'medium', label: 'Medium', icon: '⚡', desc: 'Mid-level principles & trade-offs', border: 'border-amber-500', glow: 'bg-amber-500/10 text-amber-400' },
  { value: 'hard', label: 'Hard', icon: '🔥', desc: 'System scale, bottlenecks & edge-cases', border: 'border-rose-500', glow: 'bg-rose-500/10 text-rose-400' }
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
        <p className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Step 1: Configuration</p>
        <h1 className="mt-1.5 font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          Initialize New Mock Session
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
          Customize your experience by selecting a focus domain and difficulty target. AI will generate specialized scenario-based questions.
        </p>
      </motion.div>

      <form onSubmit={handleStart} className="space-y-8">
        
        {/* Domain Visual Grid */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            1. Select Tech Focus
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            {DOMAINS.map((d) => {
              const selected = domain === d.value;
              return (
                <div
                  key={d.value}
                  onClick={() => setDomain(d.value)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all flex items-start gap-4 ${
                    selected
                      ? 'border-indigo-500 bg-indigo-500/15 ring-2 ring-indigo-500/30 shadow-brand-sm text-white'
                      : 'border-white/10 bg-slate-900/70 hover:border-indigo-500/40 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <span className="text-2xl p-2.5 bg-slate-800/90 rounded-xl select-none shrink-0 border border-white/5">
                    {d.icon}
                  </span>
                  <div>
                    <h3 className={`font-semibold text-sm ${selected ? 'text-white' : 'text-slate-100'}`}>
                      {d.label}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {d.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Visual Grid */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            2. Choose Difficulty Level
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            {DIFFICULTIES.map((df) => {
              const selected = difficulty === df.value;
              return (
                <div
                  key={df.value}
                  onClick={() => setDifficulty(df.value)}
                  className={`cursor-pointer rounded-2xl border p-4 text-center transition-all flex flex-col items-center justify-center ${
                    selected
                      ? `${df.border} ${df.glow} ring-2 ring-indigo-500/30 shadow-lg`
                      : 'border-white/10 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <span className="text-2xl mb-2 select-none">{df.icon}</span>
                  <h3 className={`font-semibold text-sm ${selected ? 'text-white font-bold' : 'text-slate-200'}`}>
                    {df.label}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                    {df.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Question Count Select */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 backdrop-blur-xl shadow-xl space-y-4 max-w-md mx-auto">
          <SelectField
            id="count"
            label="3. Session Length"
            value={String(numberOfQuestions)}
            onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
          >
            {[3, 5, 7, 10, 15, 20].map((n) => (
              <option key={n} value={n} className="bg-slate-900 text-white">
                {n} Interview Scenarios
              </option>
            ))}
          </SelectField>
        </div>

        {/* Action Button Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-white/10">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            loading={loading}
            className="w-full sm:w-auto shadow-brand"
          >
            Launch Interview Session →
          </Button>
        </div>

      </form>
    </div>
  );
}
