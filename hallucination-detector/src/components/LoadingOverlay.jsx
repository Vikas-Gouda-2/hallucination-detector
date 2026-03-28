import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const LoadingOverlay = ({ message = 'Interrogating AI...' }) => {
  const steps = ['Extracting Claims', 'Cross-Examining', 'Verifying Consistency'];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-8 max-w-md w-full mx-4 glass"
      >
        {/* Scanning animation */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-5xl"
          >
            🔍
          </motion.div>
        </div>

        <p className="text-center text-lg font-display font-semibold text-white mb-2">
          {message}
        </p>

        <motion.p
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-center text-sm font-mono mb-6"
          style={{ color: '#818cf8' }}
        >
          → {steps[currentStep]}
        </motion.p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(148, 163, 184, 0.08)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #f43f5e, #f59e0b, #10b981)' }}
              animate={{ width: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <p className="text-xs text-slate-500 text-center font-mono">Processing...</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingOverlay;
