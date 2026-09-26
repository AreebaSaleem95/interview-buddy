export function SelectField({ label, id, error, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-xl border bg-slate-900/90 px-4 py-2.5 text-sm text-slate-100 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer ${
          error ? 'border-rose-500/70 focus:border-rose-500' : 'border-slate-700/80 hover:border-slate-600'
        }`}
        style={{ colorScheme: 'dark' }}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-400">{error}</p>}
    </div>
  );
}
