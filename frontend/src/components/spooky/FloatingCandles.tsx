import { motion } from 'framer-motion';

export const FloatingCandles = () => {
  const candles = [
    { emoji: '🕯️', top: '15%', left: '5%', delay: 0 },
    { emoji: '🕯️', top: '25%', right: '8%', delay: 0.5 },
    { emoji: '🕯️', top: '65%', left: '10%', delay: 1 },
    { emoji: '🕯️', top: '75%', right: '12%', delay: 1.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {candles.map((candle, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl"
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
            duration: 3,
            repeat: Infinity,
            delay: candle.delay,
            ease: 'easeInOut',
          }}
        >
          {candle.emoji}
          {/* Flame flicker */}
          <motion.div
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🔥
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
