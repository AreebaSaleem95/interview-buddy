export function TextField({
  label,
  id,
  error,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border bg-slate-900/90 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
          error ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700/80 hover:border-slate-600'
        } ${inputClassName}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}

export function TextArea({
  label,
  id,
  error,
  className = '',
  rows = 5,
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full resize-y rounded-xl border bg-slate-900/90 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all ${
          error ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700/80 hover:border-slate-600'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}
