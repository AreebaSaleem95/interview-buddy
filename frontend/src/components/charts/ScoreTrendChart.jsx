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
  // Map index + 1 as question label if not present
  const formattedData = data.map((item, idx) => ({
    question: item.question || `Q${idx + 1}`,
    score: item.score || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-100 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
            Score: {payload[0].value}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
          <XAxis
            dataKey="question"
            stroke="#94a3b8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
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
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#3b82f6' }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
