import { motion } from 'framer-motion';

export const FloatingCandles = () => {
  const candles = [
    { emoji: '🕯️', top: '15%', left: '5%', delay: 0 },
    { emoji: '🕯️', top: '75%', right: '12%', delay: 1.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {candles.map((candle, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl will-change-transform"
          style={{
            top: candle.top,
            left: candle.left,
            right: candle.right,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: candle.delay,
            ease: 'linear',
          }}
        >
          {candle.emoji}
        </motion.div>
      ))}
    </div>
  );
};
