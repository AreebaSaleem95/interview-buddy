export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-5 shadow-card transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
export default Card;
