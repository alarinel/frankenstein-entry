import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const CelebrationFireworks = () => {
  const [fireworks, setFireworks] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newFirework = {
        id: Date.now(),
        x: Math.random() * 100,
        y: 20 + Math.random() * 60,
      };
      setFireworks((prev) => [...prev, newFirework]);

      // Remove after animation
      setTimeout(() => {
        setFireworks((prev) => prev.filter((f) => f.id !== newFirework.id));
      }, 2000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="absolute"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
          }}
        >
          {/* Center burst */}
          <motion.div
            className="absolute text-4xl"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            ✨
          </motion.div>

          {/* Particles */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            const distance = 80;
            const x = Math.cos((angle * Math.PI) / 180) * distance;
            const y = Math.sin((angle * Math.PI) / 180) * distance;

            return (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x,
                  y,
                  opacity: 0,
                  scale: 0.5,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {['⭐', '💫', '✨', '🌟'][i % 4]}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
