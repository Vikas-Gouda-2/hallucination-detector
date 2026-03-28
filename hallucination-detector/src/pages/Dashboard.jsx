import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { analyzeScan } from '../lib/api';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ScanCard } from '../components/ScanCard';
import { RiskGauge } from '../components/RiskGauge';

const PIPELINE_STEPS = [
  { icon: '📋', label: 'Paste Text', active: true },
  { icon: '🔍', label: 'Extract Claims', active: false },
  { icon: '⚡', label: 'AI Analysis', active: false },
  { icon: '📊', label: 'Get Verdict', active: false },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [stats, setStats] = useState({ total: 0, red: 0, yellow: 0, green: 0, avgConfidence: 0 });
  const [activeStep, setActiveStep] = useState(0);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      setActiveStep(1);
      
      const stepInterval = setInterval(() => {
        setActiveStep(prev => {
          if (prev >= 3) { clearInterval(stepInterval); return 3; }
          return prev + 1;
        });
      }, 1200);
      
      const response = await analyzeScan(text, 'user-input://dashboard', user?.uid);
      clearInterval(stepInterval);
      setActiveStep(3);
      
      const newScan = { ...response.data, created_at: new Date().toISOString() };
      setScans([newScan, ...scans]);
      setText('');
      
      setStats(prev => ({
        total: prev.total + 1,
        red: prev.red + (newScan.status === 'Red' ? 1 : 0),
        yellow: prev.yellow + (newScan.status === 'Yellow' ? 1 : 0),
        green: prev.green + (newScan.status === 'Green' ? 1 : 0),
        avgConfidence: prev.total === 0 
          ? (newScan.confidence || 0) 
          : Math.round((prev.avgConfidence * prev.total + (newScan.confidence || 0)) / (prev.total + 1)),
      }));
      
      setTimeout(() => setActiveStep(0), 2000);
    } catch (error) {
      console.error('Scan error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#020617' }}>
      {loading && <LoadingOverlay />}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            Welcome back, <span className="gradient-text">{user?.displayName?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 font-body">Analyze any text for AI hallucinations in real-time</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Scans', value: stats.total, icon: '📊', color: '#818cf8' },
            { label: 'Hallucinated', value: stats.red, icon: '🔴', color: '#f43f5e' },
            { label: 'Uncertain', value: stats.yellow, icon: '🟡', color: '#f59e0b' },
            { label: 'Verified True', value: stats.green, icon: '🟢', color: '#10b981' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="p-5 rounded-2xl glass glass-hover transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-mono uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-display font-bold mt-1" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-3xl opacity-60">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pipeline Steps Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 md:gap-4 py-4"
        >
          {PIPELINE_STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-4">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-500 ${
                activeStep >= i + 1 
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                  : activeStep === i 
                    ? 'bg-white/5 text-white border border-white/10'
                    : 'text-slate-600'
              }`}>
                <span>{step.icon}</span>
                <span className="hidden md:inline">{step.label}</span>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className={`w-6 md:w-10 h-px transition-all duration-500 ${
                  activeStep > i ? 'bg-indigo-500/50' : 'bg-slate-700'
                }`} />
              )}
            </div>
          ))}
        </motion.div>

        {/* Main Input + Risk Gauge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Text Input - Drag/Paste Zone Style */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl glass p-6">
              <label className="flex items-center gap-2 text-sm font-display font-semibold text-slate-300 mb-4">
                <span className="text-lg">📝</span> Analyze Text
              </label>
              
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste any text here — articles, research papers, social media posts, AI-generated content, emails, documents..."
                  className="w-full h-36 rounded-xl p-4 text-slate-300 placeholder-slate-600 font-body resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '2px dashed rgba(148, 163, 184, 0.15)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(148, 163, 184, 0.15)'; }}
                />
                {!text && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center opacity-30">
                    <div className="text-4xl mb-2">📋</div>
                    <div className="text-xs text-slate-500 font-mono">Drag & drop or paste text</div>
                  </div>
                )}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAnalyze}
                disabled={!text.trim() || loading}
                className="mt-4 w-full py-3 px-4 rounded-xl font-display font-semibold text-base transition-all duration-200 disabled:opacity-30 flex items-center justify-center gap-2"
                style={{
                  background: text.trim() ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${text.trim() ? 'rgba(99, 102, 241, 0.3)' : 'rgba(148, 163, 184, 0.08)'}`,
                  color: text.trim() ? '#a5b4fc' : '#475569',
                }}
              >
                ⚡ Analyze Text
              </motion.button>
            </div>
          </div>

          {/* Risk Gauge */}
          <div>
            <RiskGauge score={stats.avgConfidence} />
          </div>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-display font-semibold text-slate-300 flex items-center gap-2">
            📋 Recent Scans
          </h2>
          {scans.length === 0 ? (
            <div className="text-center py-16 rounded-2xl glass">
              <div className="text-4xl mb-3 opacity-30">🔍</div>
              <p className="text-slate-500 text-sm font-body">Analyze some text to get started!</p>
              <p className="text-slate-600 text-xs mt-1 font-mono">Results will appear here</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {scans.map((scan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ScanCard scan={scan} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
