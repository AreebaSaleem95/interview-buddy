export function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-primary/20 border-t-primary ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
