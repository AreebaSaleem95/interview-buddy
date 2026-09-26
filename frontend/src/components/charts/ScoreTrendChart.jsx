import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function ScoreTrendChart({ data = [] }) {
  const formattedData = data.map((item, idx) => ({
    question: item.question || `Q${idx + 1}`,
    score: item.score || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-indigo-500/30 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400">{label}</p>
          <p className="text-sm font-bold text-indigo-400 mt-0.5">
            Score: {payload[0].value}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full rounded-xl bg-slate-950/50 border border-white/10 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 12, right: 12, left: -20, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
          <XAxis
            dataKey="question"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={12}
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366F1"
            strokeWidth={3}
            dot={{ r: 4, stroke: '#6366F1', strokeWidth: 2, fill: '#8B5CF6' }}
            activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#A855F7' }}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
