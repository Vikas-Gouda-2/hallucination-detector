import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  {
    icon: '🔍',
    title: 'Claim Extraction',
    desc: 'Automatically identifies distinct factual claims from any text input.',
  },
  {
    icon: '⚡',
    title: 'Cross-Interrogation',
    desc: 'Each claim is independently questioned using parallel AI reasoning.',
  },
  {
    icon: '📊',
    title: 'Consistency Analysis',
    desc: 'Detects contradictions, uncertainty patterns, and factual errors.',
  },
  {
    icon: '🛡️',
    title: 'Verdict Engine',
    desc: 'Produces Red/Yellow/Green verdicts with confidence scores.',
  },
];

const STATS = [
  { value: '3-Step', label: 'AI Pipeline' },
  { value: '< 5s', label: 'Avg Analysis' },
  { value: 'Any Text', label: 'Universal Input' },
  { value: '98%', label: 'Accuracy Rate' },
];

const USE_CASES = [
  'News Articles', 'Research Papers', 'Social Media Posts',
  'AI-Generated Content', 'Wikipedia Edits', 'Product Reviews',
  'Legal Documents', 'Medical Claims', 'Email Content',
];

export default function Login() {
  const navigate = useNavigate();
  const { user, signInWithGoogle, loading } = useAuth();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#020617' }}>
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3), transparent 70%)' }} />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `rgba(99, 102, 241, ${0.2 + Math.random() * 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30 + Math.random() * 60],
              x: [0, -20 + Math.random() * 40],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-24 min-h-[85vh]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
            }}>
            ✨ Universal Fact-Checking Platform
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold text-center leading-tight mb-6"
        >
          <span className="text-white">AI-Powered</span>
          <br />
          <span className="gradient-text">Claim Verification</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mb-10 font-body leading-relaxed"
        >
          Paste any text — articles, research papers, social media posts, AI-generated content — and receive
          instant hallucination detection with confidence scores and detailed reasoning.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="px-8 py-3.5 rounded-full font-display font-semibold text-base bg-white text-slate-900 hover:bg-slate-100 transition-all duration-200 flex items-center gap-2 shadow-glow-md disabled:opacity-50"
          >
            {loading ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>⏳</motion.span>
                Signing in...
              </>
            ) : (
              <>Get Started <span>→</span></>
            )}
          </motion.button>

          <a
            href="/demo"
            className="px-8 py-3.5 rounded-full font-display font-semibold text-base transition-all duration-200 flex items-center gap-2"
            style={{
              border: '1px solid rgba(148, 163, 184, 0.2)',
              color: '#cbd5e1',
            }}
          >
            Explore Demo <span>›</span>
          </a>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl w-full"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex flex-col items-center p-4 rounded-xl glass glass-hover transition-all duration-300"
            >
              <span className="text-2xl md:text-3xl font-display font-bold text-white mb-1">{stat.value}</span>
              <span className="text-xs text-slate-400 font-mono">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our 3-step pipeline interrogates AI-generated text by extracting claims,
              cross-examining each one, and checking for contradictions.
            </p>
          </motion.div>

          {/* Pipeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Extract Claims', desc: 'Our AI reads the input text and identifies up to 3 distinct factual assertions.', icon: '📋' },
              { step: '02', title: 'Cross-Interrogate', desc: 'Each claim is independently questioned using parallel reasoning to find inconsistencies.', icon: '🔬' },
              { step: '03', title: 'Verdict & Report', desc: 'Consistency analysis produces a Red/Yellow/Green verdict with detailed reasoning.', icon: '📊' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative p-6 rounded-2xl glass glass-hover transition-all duration-300 group"
              >
                <div className="absolute -top-3 -left-1 px-3 py-1 rounded-full text-xs font-mono font-bold"
                  style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                  Step {item.step}
                </div>
                <div className="text-4xl mb-4 mt-2">{item.icon}</div>
                <h3 className="text-xl font-display font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Powerful Detection Engine
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built on advanced AI reasoning to catch hallucinations that other tools miss.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl glass glass-hover transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl p-3 rounded-xl" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== USE CASES TAGS ===================== */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-xl font-display font-bold text-white mb-2">Works With Any Text Source</h3>
            <p className="text-sm text-slate-400">Not just websites — analyze text from anywhere</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3"
          >
            {USE_CASES.map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(148, 163, 184, 0.08)',
                  color: '#94a3b8',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="relative z-10 px-6 py-16 border-t" style={{ borderColor: 'rgba(148, 163, 184, 0.08)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🧠</span>
                <span className="font-display font-bold text-lg text-white">TruthLens</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                If an AI made it up, it can't keep its story straight. We use that insight to detect hallucinations.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-display font-semibold text-slate-300 text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="/dashboard" className="hover:text-slate-300 transition">Dashboard</a></li>
                <li><a href="/analytics" className="hover:text-slate-300 transition">Analytics</a></li>
                <li><a href="/history" className="hover:text-slate-300 transition">History</a></li>
                <li><a href="/demo" className="hover:text-slate-300 transition">Demo</a></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-display font-semibold text-slate-300 text-sm mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>Claim Extraction</li>
                <li>Cross-Interrogation</li>
                <li>Consistency Analysis</li>
                <li>Browser Extension</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t flex items-center justify-between text-xs text-slate-600"
            style={{ borderColor: 'rgba(148, 163, 184, 0.08)' }}>
            <span>TruthLens © 2026 — Built with 🧠 & 🔬</span>
            <span className="font-mono">v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
