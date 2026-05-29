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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-slate-100 bg-white/90 p-3 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{payload[0].payload.category}</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
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
        <BarChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:stroke-slate-800" />
          <XAxis
            dataKey="category"
            stroke="#94a3b8"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            domain={[0, 10]}
            tickLine={false}
            axisLine={false}
            tickCount={6}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" radius={[4, 4, 0, 0]} animationDuration={1500}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
