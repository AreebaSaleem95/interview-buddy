import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function SkillRadarChart({ data = [] }) {
  const formattedData = data.map(item => ({
    skill: item.skill || item.name || '',
    score: item.score || item.value || 0,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-indigo-500/30 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-semibold text-slate-400">{payload[0].payload.skill}</p>
          <p className="text-sm font-bold text-indigo-400 mt-0.5">
            Level: {payload[0].value}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full flex items-center justify-center rounded-xl bg-slate-950/50 border border-white/10 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={formattedData}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
          <PolarAngleAxis
            dataKey="skill"
            tick={{ fill: '#CBD5E1', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: '#64748B', fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="#8B5CF6"
            strokeWidth={2}
            fill="#6366F1"
            fillOpacity={0.4}
            animationDuration={1200}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
