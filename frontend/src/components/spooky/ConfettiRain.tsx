import { motion } from 'framer-motion';

export const ConfettiRain = () => {
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    emoji: ['🎊', '🎉', '🎈', '🎀', '⭐', '💫', '✨'][Math.floor(Math.random() * 7)],
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-3xl"
          style={{
            left: `${item.x}%`,
            top: '-50px',
          }}
          animate={{
            y: ['0vh', '120vh'],
            x: [0, (Math.random() - 0.5) * 100],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
};
