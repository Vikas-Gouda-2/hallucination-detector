import { motion } from 'framer-motion';

export const VerdictBadge = ({ status = 'Red', size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : size === 'lg' ? 'px-5 py-2.5 text-base' : 'px-3.5 py-1.5 text-sm';

  const getVerdictConfig = () => {
    const verdict = status?.toUpperCase() || 'RED';
    switch (verdict) {
      case 'RED':
        return {
          bg: 'rgba(244, 63, 94, 0.12)',
          border: 'rgba(244, 63, 94, 0.3)',
          text: '#fb7185',
          icon: '❌',
          label: 'HALLUCINATION',
        };
      case 'YELLOW':
        return {
          bg: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.3)',
          text: '#fbbf24',
          icon: '⚠️',
          label: 'UNCERTAIN',
        };
      case 'GREEN':
        return {
          bg: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.3)',
          text: '#34d399',
          icon: '✅',
          label: 'VERIFIED',
        };
      default:
        return {
          bg: 'rgba(148, 163, 184, 0.1)',
          border: 'rgba(148, 163, 184, 0.2)',
          text: '#94a3b8',
          icon: '❓',
          label: 'UNKNOWN',
        };
    }
  };

  const config = getVerdictConfig();

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`${sizeClass} rounded-full font-mono font-semibold flex items-center gap-2 cursor-default transition-all duration-300`}
      style={{
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
      }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </motion.div>
  );
};

export default VerdictBadge;
