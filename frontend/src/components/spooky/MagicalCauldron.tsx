import { motion } from 'framer-motion';

export const MagicalCauldron = ({ progress = 0 }: { progress?: number }) => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Cauldron */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-9xl">🧪</div>
      </motion.div>

      {/* Bubbles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-20 left-1/2 text-2xl"
          initial={{ y: 0, x: -12, opacity: 0.8, scale: 0.5 }}
          animate={{
            y: -100,
            x: (Math.random() - 0.5) * 40,
            opacity: 0,
            scale: 1.2,
          }}
          transition={{
            duration: 2 + Math.random(),
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
        >
          💫
        </motion.div>
      ))}

      {/* Sparkles around */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute text-xl"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          ✨
        </motion.div>
      ))}

      {/* Potion liquid level */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-spooky-purple-900/20 rounded-full overflow-hidden border-2 border-spooky-purple-600/40">
        <motion.div
          className="h-full bg-gradient-to-r from-spooky-purple-600 via-spooky-pink-500 to-spooky-orange-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:200%_100%]" />
        </motion.div>
      </div>
    </div>
  );
};
