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
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border bg-surface-elevated px-4 py-2.5 text-sm text-text-primary shadow-inner placeholder:text-text-muted focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
          error ? 'border-error/60' : 'border-border'
        } ${inputClassName}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-error">{error}</p>}
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
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full resize-y rounded-xl border bg-surface-elevated px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
          error ? 'border-error/60' : 'border-border'
        }`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs font-medium text-error">{error}</p>}
    </div>
  );
}
