import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

export default function CategoryBarChart({ data = [] }) {
  const formattedData = data.map(item => ({
    category: item.category || item.name || '',
    score: item.score || item.value || 0,
  }));

  const COLORS = ['#6366F1', '#8B5CF6', '#38BDF8', '#10B981', '#F59E0B', '#EC4899'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-indigo-500/30 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400">{payload[0].payload.category}</p>
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
        <BarChart
          data={formattedData}
          margin={{ top: 12, right: 12, left: -20, bottom: 4 }}
          barSize={24}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
          <XAxis
            dataKey="category"
            stroke="#94A3B8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={11}
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} animationDuration={1200}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
