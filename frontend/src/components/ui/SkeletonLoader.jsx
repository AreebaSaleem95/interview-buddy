import { motion } from 'framer-motion';

const shimmerTransition = {
  duration: 1.5,
  repeat: Infinity,
  ease: 'easeInOut',
};

const shimmerAnimation = {
  opacity: [0.4, 0.8, 0.4],
};

export function CardSkeleton({ className = '' }) {
  return (
    <motion.div
      className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50 ${className}`}
      animate={shimmerAnimation}
      transition={shimmerTransition}
    >
      <div className="h-6 w-1/3 rounded-lg bg-slate-200 dark:bg-slate-800 mb-4" />
      <div className="h-4 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800 mb-2" />
      <div className="h-4 w-1/2 rounded-lg bg-slate-200 dark:bg-slate-800" />
    </motion.div>
  );
}

export function StatCardSkeleton({ count = 4, className = '' }) {
  return (
    <div className={`grid gap-5 md:grid-cols-2 lg:grid-cols-${count} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50"
          animate={shimmerAnimation}
          transition={{ ...shimmerTransition, delay: i * 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-3 flex-1">
              <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function InterviewCardSkeleton({ className = '' }) {
  return (
    <motion.div
      className={`flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50 ${className}`}
      animate={shimmerAnimation}
      transition={shimmerTransition}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
      <div className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
    </motion.div>
  );
}

export function ChartSkeleton({ className = '' }) {
  return (
    <motion.div
      className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50 ${className}`}
      animate={shimmerAnimation}
      transition={shimmerTransition}
    >
      <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-800 mb-6" />
      <div className="flex items-end justify-between gap-4 h-48 px-4">
        <div className="w-full h-1/3 rounded-t bg-slate-200 dark:bg-slate-800" />
        <div className="w-full h-2/3 rounded-t bg-slate-200 dark:bg-slate-800" />
        <div className="w-full h-1/2 rounded-t bg-slate-200 dark:bg-slate-800" />
        <div className="w-full h-4/5 rounded-t bg-slate-200 dark:bg-slate-800" />
        <div className="w-full h-3/5 rounded-t bg-slate-200 dark:bg-slate-800" />
      </div>
    </motion.div>
  );
}

export function ResultsSkeleton({ className = '' }) {
  return (
    <div className={`space-y-8 ${className}`}>
      <motion.div
        className="flex flex-col items-center text-center space-y-4"
        animate={shimmerAnimation}
        transition={shimmerTransition}
      >
        <div className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-8 w-48 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50"
            animate={shimmerAnimation}
            transition={{ ...shimmerTransition, delay: i * 0.1 }}
          >
            <div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 mb-3" />
            <div className="h-8 w-28 rounded bg-slate-200 dark:bg-slate-800" />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

// Fallback old name for backwards compatibility
export function SkeletonLoader({ type = 'card', count = 1, className = '' }) {
  if (type === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <InterviewCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return <CardSkeleton className={className} />;
}
