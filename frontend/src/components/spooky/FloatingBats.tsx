import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const FloatingBats = ({ count = 5 }: { count?: number }) => {
  const [bats, setBats] = useState<Array<{ id: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    setBats(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 4,
      }))
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {bats.map((bat) => (
        <motion.div
          key={bat.id}
          className="absolute text-4xl"
          style={{
            top: `${Math.random() * 50}%`,
          }}
          initial={{ x: '-100px' }}
          animate={{
            x: ['0vw', '110vw'],
            y: [0, -30, -60, -30, 0],
          }}
          transition={{
            duration: bat.duration,
            delay: bat.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🦇
        </motion.div>
      ))}
    </div>
  );
};
