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
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary:
      "btn-primary-glow text-white border border-primary/30",
    secondary:
      "bg-surface-elevated border border-border text-text-primary hover:border-primary/50 hover:bg-primary/10",
    danger:
      "bg-error/10 border border-error/30 text-error hover:bg-error/20",
    ghost:
      "bg-transparent text-text-secondary hover:bg-surface-elevated hover:text-text-primary border border-transparent hover:border-border",
    outline:
      "bg-transparent border border-border text-text-primary hover:border-primary/60 hover:bg-primary/8",
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
