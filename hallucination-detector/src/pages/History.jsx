import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { getHistory } from "../lib/api";
import VerdictBadge from '../components/VerdictBadge';

export const History = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!user) return;
    const loadHistory = async () => {
      try {
        const response = await getHistory(user.uid);
        setScans(response?.data?.scans || []);
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };
    loadHistory();
  }, [user]);

  const filteredScans = scans.filter((scan) => {
    if (filter === 'All') return true;
    return scan.verdict?.status === filter;
  });

  const exportCSV = () => {
    const headers = ['Scan ID', 'Verdict', 'Confidence', 'Consistency Score', 'Text', 'Date'];
    const rows = filteredScans.map((scan) => [
      scan.scan_id,
      scan.verdict?.status,
      scan.verdict?.confidence,
      scan.verdict?.consistency_score,
      `"${scan.original_text?.replace(/"/g, '""')}"`,
      new Date(scan.created_at).toLocaleString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'truthlens-history.csv';
    a.click();
  };

  const FILTERS = ['All', 'Red', 'Yellow', 'Green'];

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#020617' }}>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Scan History</h1>
          <p className="text-slate-400">Browse and export your past analyses</p>
        </motion.div>

        {/* Filters + Export */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-500 border border-slate-800 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {f === 'Red' ? '🔴 ' : f === 'Yellow' ? '🟡 ' : f === 'Green' ? '🟢 ' : ''}{f}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-full text-sm font-display font-semibold transition-all duration-200"
            style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}
          >
            📥 Export CSV
          </button>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl glass overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)' }}>
                  <th className="px-6 py-4 text-left text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Verdict</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Text</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-left text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredScans.length > 0 ? (
                  filteredScans.map((scan) => (
                    <tr key={scan.scan_id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.04)' }}>
                      <td className="px-6 py-4">
                        <VerdictBadge status={scan.verdict?.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                        {scan.original_text?.substring(0, 60)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                        {scan.verdict?.consistency_score || 0}%
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                        {new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="text-4xl mb-3 opacity-30">📜</div>
                      <p className="text-slate-500 text-sm">No scan history yet</p>
                      <p className="text-slate-600 text-xs mt-1 font-mono">Analyze some text to see results here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;
