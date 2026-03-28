import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

export const ConsistencyRadar = ({ consistencyScore = 50 }) => {
  const data = [
    { name: 'Internal Consistency', value: consistencyScore, ideal: 100 },
    { name: 'Factual Verifiability', value: Math.max(0, consistencyScore - 10), ideal: 100 },
    { name: 'Detail Specificity', value: Math.max(0, consistencyScore - 15), ideal: 100 },
    { name: 'Logical Coherence', value: Math.max(0, consistencyScore - 5), ideal: 100 },
    { name: 'Evidence Support', value: Math.max(0, consistencyScore - 20), ideal: 100 },
  ];

  return (
    <div className="w-full rounded-2xl glass p-6 h-full">
      <h3 className="text-sm font-display font-semibold text-slate-300 mb-4 flex items-center gap-2">
        📡 Consistency Analysis
      </h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
            <defs>
              <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <PolarGrid stroke="rgba(148, 163, 184, 0.08)" />

            <PolarAngleAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'Inter' }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: '#475569', fontFamily: 'DM Mono' }}
            />

            <Radar
              name="Actual"
              dataKey="value"
              stroke="#818cf8"
              fill="url(#radarGrad)"
              fillOpacity={0.5}
              dot={{ fill: '#818cf8', r: 3 }}
            />

            <Radar
              name="Ideal"
              dataKey="ideal"
              stroke="rgba(148, 163, 184, 0.1)"
              fill="none"
              strokeDasharray="4 4"
              dot={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center justify-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: '#818cf8' }}></div>
          <span style={{ color: '#818cf8' }}>Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full border opacity-30" style={{ borderColor: '#818cf8' }}></div>
          <span className="text-slate-500">Ideal</span>
        </div>
      </div>
    </div>
  );
};

export default ConsistencyRadar;
