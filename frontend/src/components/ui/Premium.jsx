import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Animated counter that increments from 0 to the target value
 * Used in stats cards and results pages
 */
export function AnimatedCounter({ value, duration = 2, suffix = '', prefix = '', decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const step = value / (duration * 60); // 60 frames per second
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplayValue(value);
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
    brand: '#2563eb',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444'
  };

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
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-slate-200 dark:text-slate-700"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colorMap[color] || colorMap.brand}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={animate ? offset : 0}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ filter: 'drop-shadow(0 0 4px rgba(37, 99, 235, 0.2))' }}
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
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="rounded-2xl border border-border bg-surface p-6 shadow-card hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-brand-sm transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-muted">{label}</p>
          <p className="mt-3 font-display text-3xl font-bold tracking-tight text-text-primary">
            {typeof value === 'number' ? (
              <AnimatedCounter value={value} duration={2} decimals={value % 1 !== 0 ? 1 : 0} />
            ) : (
              value
            )}
          </p>
        </div>
        {icon && <div className="text-3xl select-none">{icon}</div>}
      </div>

      {hint && <p className="mt-3 text-xs text-text-secondary">{hint}</p>}

      {trend !== null && trend !== undefined && (
        <motion.div 
          className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            isPositive 
              ? 'bg-success/10 text-success' 
              : 'bg-error/10 text-error'
          }`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
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
    <motion.div 
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
      initial={{ opacity: 0, y: -10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <h2 className="font-display text-2xl font-bold text-slate-950 dark:text-white">{title}</h2>
        {subText && (
          <p className="mt-1 text-slate-500 dark:text-slate-400">{subText}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="rounded-2xl bg-white p-8 shadow-xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-950"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
