export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-4 shadow-card transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
export default Card;
