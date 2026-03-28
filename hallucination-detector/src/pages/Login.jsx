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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

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
      {/* Animated Background gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3), transparent 70%)',
        }}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3), transparent 70%)',
        }}
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 50, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating animated particles */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `rgba(99, 102, 241, ${0.2 + Math.random() * 0.3})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${5 + Math.random() * 10}px rgba(99, 102, 241, 0.5)`,
            }}
            animate={{
              y: [0, -50 + Math.random() * 100],
              x: [0, -30 + Math.random() * 60],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ===================== HERO SECTION ===================== */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-24 min-h-[90vh]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-4xl"
        >
          {/* Badge with animation */}
          <motion.div
            variants={itemVariants}
            className="mb-10 flex justify-center"
          >
            <motion.span
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium cursor-default"
              style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                color: '#c7d2fe',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                ✨
              </motion.span>
              Universal Fact-Checking Platform
            </motion.span>
          </motion.div>

          {/* Main heading with staggered text */}
          <motion.div
            variants={itemVariants}
            className="mb-8 text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-center leading-tight mb-4">
              <motion.span
                className="block text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                AI-Powered
              </motion.span>
              <motion.span
                className="block gradient-text"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Claim Verification
              </motion.span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-400 text-center max-w-2xl mx-auto mb-12 font-body leading-relaxed"
          >
            Paste any text — articles, research papers, social media posts, AI-generated content — and receive
            instant hallucination detection with confidence scores and detailed reasoning.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="px-8 py-4 rounded-full font-display font-semibold text-base bg-white text-slate-900 hover:bg-slate-100 transition-all duration-200 flex items-center gap-3 shadow-lg disabled:opacity-50 group"
              style={{
                boxShadow: '0 10px 40px rgba(99, 102, 241, 0.2)',
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⏳
                  </motion.span>
                  Signing in...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Get Started
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </motion.button>

            <motion.a
              href="/demo"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-display font-semibold text-base transition-all duration-200 flex items-center gap-3 group"
              style={{
                border: '1.5px solid rgba(148, 163, 184, 0.25)',
                color: '#cbd5e1',
                background: 'rgba(30, 41, 59, 0.3)',
              }}
            >
              📊 Explore Demo
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ›
              </motion.span>
            </motion.a>
          </motion.div>

          {/* Stats Grid with stagger */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl w-full mx-auto"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  scale: 1.08,
                  y: -5,
                  boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)',
                }}
                className="flex flex-col items-center p-5 rounded-2xl glass glass-hover transition-all duration-300 cursor-default"
              >
                <span className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{stat.value}</span>
                <span className="text-xs text-slate-400 font-mono text-center">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Our 3-step pipeline interrogates AI-generated text by extracting claims, cross-examining each one, and checking for contradictions.</p>
          </motion.div>

          {/* Pipeline Steps with connecting lines */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { step: '01', title: 'Extract Claims', desc: 'Our AI reads the input text and identifies up to 3 distinct factual assertions.', icon: '📋', color: 'from-blue-500 to-indigo-500' },
                { step: '02', title: 'Cross-Interrogate', desc: 'Each claim is independently questioned using parallel reasoning to find inconsistencies.', icon: '🔬', color: 'from-indigo-500 to-purple-500' },
                { step: '03', title: 'Verdict & Report', desc: 'Consistency analysis produces a Red/Yellow/Green verdict with detailed reasoning.', icon: '📊', color: 'from-purple-500 to-pink-500' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  whileHover={{
                    y: -10,
                    boxShadow: '0 30px 60px rgba(99, 102, 241, 0.3)',
                  }}
                  className="relative p-8 rounded-3xl glass glass-hover transition-all duration-300 group"
                >
                  {/* Step badge with gradient */}
                  <motion.div
                    className="absolute -top-4 -left-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold"
                    style={{
                      background: `linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))`,
                      border: '1px solid rgba(99, 102, 241, 0.35)',
                      color: '#c7d2fe',
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    Step {item.step}
                  </motion.div>

                  {/* Icon with glow */}
                  <motion.div
                    className="text-5xl mb-6 mt-3 inline-block p-4 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))`,
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {item.icon}
                  </motion.div>

                  <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-base">{item.desc}</p>

                  {/* Connecting arrow */}
                  {i < 2 && (
                    <motion.div
                      className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.3 }}
                    >
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-2xl"
                      >
                        →
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="relative z-10 px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5">Powerful Detection Engine</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">Built on advanced AI reasoning to catch hallucinations that other tools miss.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{
                  y: -8,
                  boxShadow: '0 30px 60px rgba(99, 102, 241, 0.2)',
                }}
                className="p-8 rounded-2xl glass glass-hover transition-all duration-300 group cursor-default"
              >
                <div className="flex items-start gap-5">
                  <motion.div
                    className="text-4xl p-4 rounded-xl flex-shrink-0"
                    style={{ background: 'rgba(99, 102, 241, 0.15)' }}
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -10, 10, 0],
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {feat.icon}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-display font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== USE CASES TAGS ===================== */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-display font-bold text-white mb-3">Works With Any Text Source</h3>
            <p className="text-slate-400 text-lg">Not just websites — analyze text from anywhere</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4"
          >
            {USE_CASES.map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                whileHover={{
                  scale: 1.1,
                  y: -3,
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.2)',
                }}
                className="px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 cursor-default"
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  color: '#cbd5e1',
                }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="relative z-10 px-6 py-16 backdrop-blur-sm" style={{ borderTopColor: 'rgba(148, 163, 184, 0.1)', borderTopWidth: '1px' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🧠</span>
                <span className="font-display font-bold text-xl text-white">TruthLens</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                If an AI made it up, it can't keep its story straight. We use that insight to detect hallucinations.
              </p>
            </motion.div>

            {/* Platform */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-display font-semibold text-slate-300 text-sm mb-4">Platform</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {['/dashboard', '/analytics', '/history', '/demo'].map((link, i) => (
                  <li key={i}>
                    <motion.a
                      href={link}
                      className="hover:text-slate-300 transition"
                      whileHover={{ x: 5 }}
                    >
                      {link === '/dashboard' && 'Dashboard'}
                      {link === '/analytics' && 'Analytics'}
                      {link === '/history' && 'History'}
                      {link === '/demo' && 'Demo'}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-display font-semibold text-slate-300 text-sm mb-4">Features</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>Claim Extraction</li>
                <li>Cross-Interrogation</li>
                <li>Consistency Analysis</li>
                <li>Browser Extension</li>
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600"
            style={{ borderColor: 'rgba(148, 163, 184, 0.08)' }}
          >
            <span>TruthLens © 2026 — Built with 🧠 & 🔬</span>
            <span className="font-mono">v1.0.0</span>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
