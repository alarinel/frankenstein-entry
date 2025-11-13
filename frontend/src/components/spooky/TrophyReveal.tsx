import { motion } from 'framer-motion';

export const TrophyReveal = () => {
  return (
    <motion.div
      className="relative inline-block"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        delay: 0.5,
      }}
    >
      {/* Trophy */}
      <motion.div
        className="text-8xl"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🏆
      </motion.div>

      {/* Sparkles around trophy */}
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        const radius = 60;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 text-2xl"
            style={{
              x,
              y,
            }}
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          >
            ✨
          </motion.div>
        );
      })}

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-spooky-orange-500 via-spooky-pink-500 to-spooky-purple-500 opacity-50 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};
