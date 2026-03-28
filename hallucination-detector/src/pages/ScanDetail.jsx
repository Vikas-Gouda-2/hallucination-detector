import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getScan, postFeedback } from "../lib/api";
import { useAuth } from '../hooks/useAuth';
import VerdictBadge from '../components/VerdictBadge';
import ClaimAccordion from '../components/ClaimAccordion';
import ConsistencyRadar from '../components/ConsistencyRadar';
import SentenceHighlighter from '../components/SentenceHighlighter';

export const ScanDetail = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    const loadScan = async () => {
      try {
        const response = await getScan(scanId);
        setScan(response.data);
      } catch (error) {
        console.error('Error loading scan:', error);
      } finally {
        setLoading(false);
      }
    };
    loadScan();
  }, [scanId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: '#020617' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-5xl">
          🔍
        </motion.div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4" style={{ background: '#020617' }}>
        <div className="text-5xl">🔎</div>
        <p className="text-slate-400 font-display">Scan not found</p>
        <button onClick={() => navigate('/dashboard')} className="px-4 py-2 rounded-full text-sm glass text-indigo-300 hover:text-white transition">
          ← Back to Dashboard
        </button>
      </div>
    );
  }

  const handleFeedback = async (feedback) => {
    try {
      await postFeedback(scanId, user.uid, feedback);
      setFeedbackSent(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const verdict = scan.verdict || {};

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ background: '#020617' }}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm glass text-slate-300 hover:text-white transition group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Dashboard
        </motion.button>

        {/* Verdict Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass p-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-white mb-2">Scan Results</h2>
              <p className="text-slate-400 leading-relaxed max-w-xl">{verdict.reasoning}</p>
            </div>
            <VerdictBadge status={verdict.status} size="lg" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Confidence', value: `${verdict.confidence || 0}%` },
              { label: 'Consistency', value: `${verdict.consistency_score || 0}/100` },
              { label: 'Claims', value: scan.claims?.length || 0 },
              { label: 'Processing', value: `${scan.processing_time_ms || 0}ms` },
            ].map((m, i) => (
              <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)' }}>
                <div className="text-xs text-slate-500 font-mono uppercase mb-1">{m.label}</div>
                <div className="text-xl font-display font-bold text-white">{m.value}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grid: Claims + Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl glass p-6"
          >
            <h3 className="text-lg font-display font-semibold text-white mb-4">Claims Analysis</h3>
            <ClaimAccordion
              claims={scan.claims}
              interrogations={scan.interrogations}
              suspiciousClaims={verdict.suspicious_claims}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ConsistencyRadar consistencyScore={verdict.consistency_score} />
          </motion.div>
        </div>

        {/* Original Text with Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl glass p-6"
        >
          <h3 className="text-lg font-display font-semibold text-white mb-4">Original Text</h3>
          {verdict.sentence_verdicts?.length > 0 ? (
            <SentenceHighlighter text={scan.original_text} sentenceVerdicts={verdict.sentence_verdicts} />
          ) : (
            <p className="text-slate-300 leading-relaxed">{scan.original_text}</p>
          )}
        </motion.div>

        {/* Feedback */}
        {!feedbackSent ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4"
          >
            <button
              onClick={() => handleFeedback('agree')}
              className="flex-1 py-3 rounded-xl font-display font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}
            >
              👍 Agree with Verdict
            </button>
            <button
              onClick={() => handleFeedback('disagree')}
              className="flex-1 py-3 rounded-xl font-display font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fda4af' }}
            >
              👎 Disagree with Verdict
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 rounded-xl glass text-indigo-300 text-sm font-display"
          >
            ✅ Thank you for your feedback!
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScanDetail;
