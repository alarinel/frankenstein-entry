import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Bat {
  id: number;
  delay: number;
  duration: number;
  startY: number;
  size: number;
  direction: 'ltr' | 'rtl';
  position: 'top' | 'bottom';
}

export const FloatingBats = ({ count = 5 }: { count?: number }) => {
  const [bats, setBats] = useState<Bat[]>([]);

  useEffect(() => {
    setBats(
      Array.from({ length: count }, (_, i) => {
        const position = i % 2 === 0 ? 'top' : 'bottom';
        const direction = Math.random() > 0.5 ? 'ltr' : 'rtl';
        
        return {
          id: i,
          delay: Math.random() * 10,
          duration: 6 + Math.random() * 6,
          startY: position === 'top' 
            ? Math.random() * 30 
            : 70 + Math.random() * 20,
          size: 2 + Math.random() * 2, // 2rem to 4rem
          direction,
          position,
        };
      })
    );
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {bats.map((bat) => {
        const isLTR = bat.direction === 'ltr';
        
        return (
          <motion.div
            key={bat.id}
            className="absolute"
            style={{
              top: `${bat.startY}%`,
              fontSize: `${bat.size}rem`,
              filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))',
            }}
            initial={{ 
              x: isLTR ? '-100px' : 'calc(100vw + 100px)',
              scaleX: isLTR ? 1 : -1,
            }}
            animate={{
              x: isLTR ? ['0vw', '110vw'] : ['100vw', '-10vw'],
              y: [0, -20, -40, -60, -40, -20, 0],
              rotate: [0, 5, -5, 0, 5, -5, 0],
              scale: [1, 1.1, 0.9, 1.1, 0.9, 1],
            }}
            transition={{
              duration: bat.duration,
              delay: bat.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🦇
          </motion.div>
        );
      })}
    </div>
  );
};
