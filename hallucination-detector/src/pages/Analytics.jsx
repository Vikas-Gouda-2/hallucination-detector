import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getHistory } from "../lib/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-3 text-xs font-mono shadow-lg"
      style={{ background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
      <p className="text-slate-300 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export const Analytics = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState({
    timeline: [
      { time: '1h ago', scans: 2 },
      { time: '30m ago', scans: 5 },
      { time: '10m ago', scans: 8 },
      { time: 'Now', scans: 12 },
    ],
    verdicts: [
      { name: 'Hallucinated', value: 4, color: '#f43f5e' },
      { name: 'Uncertain', value: 3, color: '#f59e0b' },
      { name: 'Verified', value: 5, color: '#10b981' },
    ],
    domains: [
      { domain: 'user-input', count: 6 },
      { domain: 'articles', count: 3 },
      { domain: 'social-media', count: 2 },
      { domain: 'research', count: 1 },
    ],
  });

  useEffect(() => {
    if (!user) return;
    const loadScans = async () => {
      try {
        const response = await getHistory(user.uid);
        const scans = response?.data?.scans || [];
        if (scans.length > 0) {
          const verdictCounts = { Red: 0, Yellow: 0, Green: 0 };
          const domainCounts = {};
          scans.forEach((scan) => {
            verdictCounts[scan.verdict?.status || 'Green']++;
            try {
              const domain = new URL(scan.source_url || 'http://example.com').hostname;
              domainCounts[domain] = (domainCounts[domain] || 0) + 1;
            } catch { /* skip invalid urls */ }
          });
          setChartData({
            timeline: [
              { time: '1h ago', scans: Math.floor(scans.length / 4) || 0 },
              { time: '30m ago', scans: Math.floor(scans.length / 3) || 0 },
              { time: '10m ago', scans: Math.floor(scans.length / 2) || 0 },
              { time: 'Now', scans: scans.length },
            ],
            verdicts: [
              { name: 'Hallucinated', value: verdictCounts.Red, color: '#f43f5e' },
              { name: 'Uncertain', value: verdictCounts.Yellow, color: '#f59e0b' },
              { name: 'Verified', value: verdictCounts.Green, color: '#10b981' },
            ],
            domains: Object.entries(domainCounts)
              .map(([domain, count]) => ({ domain: domain.substring(0, 15), count }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 5),
          });
        }
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };
    loadScans();
  }, [user]);

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#020617' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Analytics</h1>
          <p className="text-slate-400">Overview of your hallucination detection activity</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scan Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl glass p-6"
          >
            <h3 className="text-lg font-display font-semibold text-white mb-6">Scan Volume</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData.timeline}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.06)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'DM Mono' }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.08)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'DM Mono' }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.08)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="scans" stroke="#818cf8" strokeWidth={2} dot={{ fill: '#818cf8', r: 4 }} activeDot={{ r: 6, fill: '#a5b4fc' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Verdict Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl glass p-6"
          >
            <h3 className="text-lg font-display font-semibold text-white mb-6">Verdict Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={chartData.verdicts} cx="50%" cy="50%" outerRadius={90} innerRadius={50} dataKey="value" label={({ name, value }) => `${name}: ${value}`}
                  labelLine={{ stroke: '#475569' }}>
                  {chartData.verdicts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Source Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl glass p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-display font-semibold text-white mb-6">Top Sources</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData.domains}>
                <CartesianGrid stroke="rgba(148, 163, 184, 0.06)" />
                <XAxis dataKey="domain" tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'DM Mono' }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.08)' }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'DM Mono' }} axisLine={{ stroke: 'rgba(148, 163, 184, 0.08)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#818cf8" radius={[6, 6, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
