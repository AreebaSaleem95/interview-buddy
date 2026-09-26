import { Spinner } from './Spinner';

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  icon = null,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none btn-focus";

  const variants = {
    primary:
      "btn-primary-glow text-white border border-indigo-400/30 shadow-brand-sm",
    secondary:
      "bg-slate-800/90 border border-slate-700/80 text-slate-100 hover:border-indigo-500/50 hover:bg-slate-700/90 shadow-sm",
    danger:
      "bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50",
    ghost:
      "bg-transparent text-slate-400 hover:bg-slate-800/60 hover:text-white border border-transparent hover:border-slate-700",
    outline:
      "bg-transparent border border-slate-700 text-slate-200 hover:border-indigo-500/60 hover:bg-indigo-500/10",
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${sizes[size] ?? sizes.md} ${variants[variant] ?? ''} ${className}`}
      {...props}
    >
      {icon && !loading && <span className="shrink-0">{icon}</span>}
      {loading && <Spinner className="h-4 w-4 border-2" />}
      {children}
    </button>
  );
}
export default Button;
