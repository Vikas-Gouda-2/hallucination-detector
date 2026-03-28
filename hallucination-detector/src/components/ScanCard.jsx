import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VerdictBadge from './VerdictBadge';

const getVerdictAccent = (status) => {
  const s = status?.toUpperCase();
  if (s === 'RED') return '#f43f5e';
  if (s === 'YELLOW') return '#f59e0b';
  if (s === 'GREEN') return '#10b981';
  return '#64748b';
};

export const ScanCard = ({ scan, onClick }) => {
  const navigate = useNavigate();

  if (!scan) return null;

  const textSnippet = (scan.original_text || scan.text || 'Unknown text').substring(0, 120);
  const accent = getVerdictAccent(scan.status);
  const createdAt = scan.created_at
    ? new Date(scan.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : '';
  const dateStr = scan.created_at
    ? new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '';

  const handleClick = () => {
    if (onClick) onClick();
    if (scan.scan_id) navigate(`/scan/${scan.scan_id}`);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005, translateY: -2 }}
      whileTap={{ scale: 0.995 }}
      onClick={handleClick}
      className="w-full text-left rounded-2xl p-5 transition-all duration-300 group overflow-hidden"
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(148, 163, 184, 0.08)',
        borderLeft: `3px solid ${accent}`,
      }}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <VerdictBadge status={scan.status} size="sm" />
          <div className="text-right">
            <div className="text-xs text-slate-500 font-mono">{createdAt}</div>
            <div className="text-xs text-slate-600">{dateStr}</div>
          </div>
        </div>

        {/* Text Snippet */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed group-hover:text-slate-300 transition">
          {textSnippet}
          {textSnippet.length < (scan.original_text || scan.text || '').length && '…'}
        </p>

        {/* Footer: Confidence */}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }}>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono">Confidence</span>
            <div className="h-1.5 rounded-full w-24 overflow-hidden" style={{ background: 'rgba(148, 163, 184, 0.08)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: accent }}
                initial={{ width: 0 }}
                animate={{ width: `${scan.confidence || 0}%` }}
                transition={{ delay: 0.2, duration: 0.6 }}
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">{Math.round(scan.confidence || 0)}%</span>
          </div>
          <span className="text-indigo-400 group-hover:translate-x-1 transition-transform text-sm">→</span>
        </div>
      </div>
    </motion.button>
  );
};

export default ScanCard;
