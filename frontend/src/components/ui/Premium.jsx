import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Animated counter that increments from 0 to the target value
 * Used in stats cards and results pages
 */
export function AnimatedCounter({ value, duration = 1.5, suffix = '', prefix = '', decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const num = Number(value) || 0;
    const step = num / (duration * 60);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= num) {
        setDisplayValue(num);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current * Math.pow(10, decimals)) / Math.pow(10, decimals));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [value, duration, decimals]);

  const formatted = decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue);

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/**
 * Progress ring for circular progress visualization
 */
export function ProgressRing({ 
  percentage = 0, 
  size = 120, 
  strokeWidth = 8,
  animate = true,
  color = 'brand'
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    brand: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#38BDF8',
  };

  const strokeColor = colorMap[color] || colorMap.brand;

  return (
    <svg 
      width={size} 
      height={size} 
      className="transform -rotate-90"
      role="progressbar" 
      aria-valuenow={percentage} 
      aria-valuemin="0" 
      aria-valuemax="100"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.08)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={animate ? offset : 0}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 6px ${strokeColor}66)` }}
      />
    </svg>
  );
}

/**
 * Enhanced stat card with clean, minimal styling and trend indicators
 */
export function StatCard({ 
  label, 
  value, 
  hint, 
  icon = null,
  trend = null,
  animate = true,
  index = 0
}) {
  const isPositive = typeof trend === 'number' ? trend >= 0 : !String(trend).startsWith('-');
  const trendText = typeof trend === 'number' ? (trend >= 0 ? `+${trend}%` : `${trend}%`) : trend;

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 15 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 shadow-xl hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-brand-sm transition-all duration-300"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 opacity-70 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-start justify-between gap-4 pt-1">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-3 font-display text-3xl font-black tracking-tight text-white">
            {typeof value === 'number' ? (
              <AnimatedCounter value={value} duration={1.5} decimals={value % 1 !== 0 ? 1 : 0} />
            ) : (
              value
            )}
          </p>
        </div>
        {icon && (
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-inner-soft group-hover:scale-105 transition-transform">
            {icon}
          </div>
        )}
      </div>

      {hint && <p className="mt-3 text-xs text-slate-400 leading-normal">{hint}</p>}

      {trend !== null && trend !== undefined && (
        <motion.div 
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
            isPositive 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span>{isPositive ? '↗' : '↘'}</span>
          <span>{trendText}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

/**
 * Section header with optional description/subtitle
 */
export function SectionHeader({ title, subtitle, description, action = null, className = '' }) {
  const subText = subtitle || description;
  return (
    <div 
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className="border-l-4 border-indigo-500 pl-4">
        <h2 className="font-display text-2xl font-black text-white">{title}</h2>
        {subText && (
          <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">{subText}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * Loading overlay with spinner
 */
export function LoadingOverlay({ message = 'Loading...', visible = true }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="rounded-2xl bg-slate-900/90 p-8 shadow-2xl border border-white/10"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-indigo-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <p className="text-sm font-medium text-slate-300">{message}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
