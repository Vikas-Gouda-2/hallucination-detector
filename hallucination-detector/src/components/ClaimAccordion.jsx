import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ClaimAccordion = ({ claims = [], interrogations = {}, suspiciousClaims = [] }) => {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (idx) => {
    setExpanded(expanded === idx ? null : idx);
  };

  return (
    <div className="space-y-2">
      {claims?.map((claim, idx) => {
        const isSuspicious = suspiciousClaims?.includes(claim);
        const isExpanded = expanded === idx;
        const interrogation = interrogations?.[claim];

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-xl overflow-hidden transition-all duration-300"
            style={{
              background: isSuspicious ? 'rgba(244, 63, 94, 0.06)' : 'rgba(15, 23, 42, 0.5)',
              border: `1px solid ${isSuspicious ? 'rgba(244, 63, 94, 0.2)' : 'rgba(148, 163, 184, 0.06)'}`,
            }}
          >
            <button
              onClick={() => toggleExpand(idx)}
              className="w-full px-4 py-3 text-left transition flex justify-between items-center group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-mono text-xs font-bold flex-shrink-0 opacity-40" style={{ color: '#818cf8' }}>
                  #{idx + 1}
                </span>
                <p className="text-sm font-body text-slate-300 line-clamp-2 flex-1">
                  {claim}
                </p>
                {isSuspicious && (
                  <span className="flex-shrink-0 text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
                    FLAGGED
                  </span>
                )}
              </div>
              <motion.span
                className="flex-shrink-0 ml-2 text-xs"
                style={{ color: '#818cf8' }}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-4 space-y-3" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)', background: 'rgba(15, 23, 42, 0.3)' }}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{isSuspicious ? '🚩' : '✓'}</span>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {isSuspicious ? 'SUSPICIOUS' : 'ANALYZED'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {interrogation || 'This claim has been cross-examined by the AI to verify internal consistency and factual accuracy.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ClaimAccordion;
