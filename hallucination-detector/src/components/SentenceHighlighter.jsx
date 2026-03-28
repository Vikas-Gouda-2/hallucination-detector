import { motion } from 'framer-motion';
import { useState } from 'react';

const SentenceHighlighter = ({ text, sentenceVerdicts }) => {
  const [hoveredSentence, setHoveredSentence] = useState(null);

  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  const matchSentenceToVerdict = (sentence) => {
    const trimmed = sentence.trim();
    return sentenceVerdicts?.find(
      (sv) => trimmed.includes(sv.sentence) || sv.sentence.includes(trimmed)
    ) || null;
  };

  const getVerdictStyles = (verdict) => {
    if (!verdict) return {};
    const v = verdict.verdict?.toUpperCase();
    switch (v) {
      case 'RED':
        return {
          background: 'rgba(244, 63, 94, 0.1)',
          borderBottom: '2px solid rgba(244, 63, 94, 0.5)',
          color: '#fecdd3',
        };
      case 'YELLOW':
        return {
          background: 'rgba(245, 158, 11, 0.1)',
          borderBottom: '2px solid rgba(245, 158, 11, 0.5)',
          color: '#fde68a',
        };
      case 'GREEN':
        return {
          background: 'rgba(16, 185, 129, 0.1)',
          borderBottom: '2px solid rgba(16, 185, 129, 0.5)',
          color: '#a7f3d0',
        };
      default:
        return {};
    }
  };

  return (
    <div className="space-y-5">
      {/* Legend */}
      <div className="flex gap-5 flex-wrap px-4 py-3 rounded-xl"
        style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(244, 63, 94, 0.3)', borderBottom: '2px solid #f43f5e' }}></div>
          <span className="text-xs" style={{ color: '#fb7185' }}>Incorrect</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(245, 158, 11, 0.3)', borderBottom: '2px solid #f59e0b' }}></div>
          <span className="text-xs" style={{ color: '#fbbf24' }}>Uncertain</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(16, 185, 129, 0.3)', borderBottom: '2px solid #10b981' }}></div>
          <span className="text-xs" style={{ color: '#34d399' }}>Correct</span>
        </div>
      </div>

      {/* Highlighted Text */}
      <div className="p-5 rounded-xl leading-relaxed text-base space-x-1"
        style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid rgba(148, 163, 184, 0.06)' }}>
        {sentences.map((sentence, idx) => {
          const verdict = matchSentenceToVerdict(sentence);
          const styles = getVerdictStyles(verdict);

          return (
            <motion.span
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.06 }}
              className="relative inline px-1 py-0.5 rounded cursor-help transition-all duration-200"
              style={verdict ? styles : { color: '#cbd5e1' }}
              onMouseEnter={() => verdict && setHoveredSentence(idx)}
              onMouseLeave={() => setHoveredSentence(null)}
            >
              {sentence}

              {hoveredSentence === idx && verdict && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
                >
                  <div className="rounded-lg p-3 whitespace-nowrap shadow-lg"
                    style={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      backdropFilter: 'blur(20px)',
                    }}>
                    <div className="flex items-center gap-2 mb-1">
                      {verdict.verdict === 'Red' && <span style={{ color: '#f43f5e' }}>❌</span>}
                      {verdict.verdict === 'Yellow' && <span style={{ color: '#f59e0b' }}>⚠️</span>}
                      {verdict.verdict === 'Green' && <span style={{ color: '#10b981' }}>✅</span>}
                      <span className="font-mono text-sm font-semibold text-white">{verdict.verdict}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Confidence: <span style={{ color: '#818cf8' }}>{verdict.confidence}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

export default SentenceHighlighter;
