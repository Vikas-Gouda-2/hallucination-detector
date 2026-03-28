import { motion } from 'framer-motion';

export const RiskGauge = ({ score = 50, label = 'Average Trust Score' }) => {
  const percentage = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 70) return '#10b981';
    if (percentage >= 40) return '#f59e0b';
    return '#f43f5e';
  };

  const getLabel = () => {
    if (percentage >= 70) return 'High Confidence';
    if (percentage >= 40) return 'Moderate Confidence';
    if (percentage > 0) return 'Low Confidence';
    return 'No Data';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass h-full">
      <div className="relative w-44 h-44 mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <defs>
            <filter id="gauge-glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(148, 163, 184, 0.06)" strokeWidth="5" />

          <motion.circle
            cx="50" cy="50" r="45" fill="none"
            stroke={getColor()}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
            filter="url(#gauge-glow)"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-4xl font-display font-bold"
            style={{ color: getColor() }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {Math.round(percentage)}
          </motion.div>
          <motion.div
            className="text-xs text-slate-500 font-mono mt-0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            %
          </motion.div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-mono text-slate-500 mb-1">{label}</p>
        <motion.p
          className="text-base font-display font-semibold"
          style={{ color: getColor() }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {getLabel()}
        </motion.p>
      </div>
    </div>
  );
};

export default RiskGauge;
