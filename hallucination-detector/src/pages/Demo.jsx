import { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeScan } from '../lib/api';
import VerdictBadge from '../components/VerdictBadge';
import SentenceHighlighter from '../components/SentenceHighlighter';

const SAMPLE_TEXTS = {
  hallucinated: {
    label: '🔴 Hallucinated Content',
    text: `The 1912 Martian Meteorite was discovered in London by renowned astronomer Sir Arthur Conan Doyle. It was named the Victoria Stone after Queen Victoria and is now housed in the British Museum's secret underground vault. The meteorite was said to contain crystalline structures that proved the existence of ancient Martian civilizations.`,
  },
  mixed: {
    label: '🟡 Mixed Content',
    text: `Carbon dioxide was discovered in 1754 by Scottish chemist Joseph Black. It plays a vital role in photosynthesis and is also used in carbonated beverages. Some scientists estimate it comprises about 0.5% of Earth's atmosphere.`,
  },
  factual: {
    label: '🟢 Factual Content',
    text: `Water is a transparent, colorless chemical substance that is the main constituent of Earth's hydrosphere. It exists in solid, liquid, and gaseous forms. The chemical formula of water is H2O, consisting of two hydrogen atoms and one oxygen atom.`,
  },
};

export default function Demo() {
  const [selectedSample, setSelectedSample] = useState('hallucinated');
  const [customText, setCustomText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (textToAnalyze) => {
    if (!textToAnalyze || textToAnalyze.length < 5) return;
    
    try {
      setLoading(true);
      setResult(null);
      const response = await analyzeScan(textToAnalyze, 'demo://truthlens', 'demo-user');
      setResult(response.data);
    } catch (error) {
      console.error('Demo scan error:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeText = customText || SAMPLE_TEXTS[selectedSample]?.text || '';

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#020617' }}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono"
            style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
            🧪 Interactive Demo
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
            Try <span className="gradient-text">TruthLens</span> Live
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Select a sample text or paste your own to see AI hallucination detection in action.
            Works with any text from any source.
          </p>
        </motion.div>

        {/* Sample Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {Object.entries(SAMPLE_TEXTS).map(([key, sample]) => (
            <button
              key={key}
              onClick={() => { setSelectedSample(key); setCustomText(''); setResult(null); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedSample === key && !customText
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-500 border border-slate-800 hover:border-slate-600 hover:text-slate-300'
              }`}
            >
              {sample.label}
            </button>
          ))}
          <button
            onClick={() => { setCustomText(' '); setResult(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              customText
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-500 border border-slate-800 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            ✏️ Custom Text
          </button>
        </motion.div>

        {/* Text Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl glass p-6"
        >
          <label className="text-sm font-display font-semibold text-slate-300 mb-3 block">
            {customText ? '✏️ Your Custom Text' : `📄 Sample: ${SAMPLE_TEXTS[selectedSample]?.label}`}
          </label>
          
          {customText !== '' ? (
            <textarea
              value={customText === ' ' ? '' : customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste any text here to analyze for hallucinations (minimum 5 characters)..."
              className="w-full h-40 rounded-xl p-4 text-slate-300 placeholder-slate-600 font-body resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '2px dashed rgba(148, 163, 184, 0.15)',
              }}
              autoFocus
            />
          ) : (
            <div className="rounded-xl p-5 text-slate-300 leading-relaxed font-body"
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(148, 163, 184, 0.08)',
              }}>
              {SAMPLE_TEXTS[selectedSample]?.text}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleAnalyze(activeText.trim())}
            disabled={loading || activeText.trim().length < 5}
            className="mt-4 w-full py-3 rounded-xl font-display font-semibold transition-all duration-200 disabled:opacity-30 flex items-center justify-center gap-2"
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
            }}
          >
            {loading ? (
              <>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>🔍</motion.span>
                Analyzing...
              </>
            ) : (
              <>⚡ Analyze Now</>
            )}
          </motion.button>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Verdict Card */}
            <div className="rounded-2xl glass p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-display font-bold text-white mb-1">Analysis Verdict</h3>
                  <p className="text-sm text-slate-400">{result.reasoning}</p>
                </div>
                <VerdictBadge status={result.status} size="lg" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)' }}>
                  <div className="text-xs text-slate-500 font-mono uppercase mb-1">Confidence</div>
                  <div className="text-2xl font-display font-bold text-white">{result.confidence}%</div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)' }}>
                  <div className="text-xs text-slate-500 font-mono uppercase mb-1">Consistency</div>
                  <div className="text-2xl font-display font-bold text-white">{result.consistency_score}%</div>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)' }}>
                  <div className="text-xs text-slate-500 font-mono uppercase mb-1">Claims Found</div>
                  <div className="text-2xl font-display font-bold text-white">{result.claims?.length || 0}</div>
                </div>
              </div>
            </div>

            {/* Sentence Highlights */}
            {result.sentence_verdicts?.length > 0 && (
              <div className="rounded-2xl glass p-6">
                <h3 className="text-lg font-display font-semibold text-white mb-4">Sentence-Level Analysis</h3>
                <SentenceHighlighter text={activeText.trim()} sentenceVerdicts={result.sentence_verdicts} />
              </div>
            )}

            {/* Suspicious Claims */}
            {result.suspicious_claims?.length > 0 && (
              <div className="rounded-2xl p-6" style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.15)' }}>
                <h3 className="text-lg font-display font-semibold text-rose-300 mb-3">⚠️ Flagged Claims</h3>
                <ul className="space-y-2">
                  {result.suspicious_claims.map((claim, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-rose-200/80">
                      <span className="text-rose-400 mt-0.5">•</span>
                      {claim}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl glass p-6"
        >
          <h3 className="font-display font-semibold text-slate-300 mb-4 flex items-center gap-2">
            💡 How to Use
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">1.</span>
                Select a sample text or paste your own content from any source
              </p>
              <p className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">2.</span>
                Click "Analyze Now" to run the 3-step detection pipeline
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">3.</span>
                Review the verdict, confidence score, and flagged claims
              </p>
              <p className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">4.</span>
                Install the browser extension for on-page analysis
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
