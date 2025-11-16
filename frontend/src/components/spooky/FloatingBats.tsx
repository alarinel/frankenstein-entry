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
          duration: 8 + Math.random() * 8, // Slower: 8-16s instead of 6-12s
          startY: position === 'top' 
            ? Math.random() * 30 
            : 70 + Math.random() * 20,
          size: 2 + Math.random() * 2,
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
            className="absolute will-change-transform"
            style={{
              top: `${bat.startY}%`,
              fontSize: `${bat.size}rem`,
            }}
            initial={{ 
              x: isLTR ? '-100px' : 'calc(100vw + 100px)',
              scaleX: isLTR ? 1 : -1,
            }}
            animate={{
              x: isLTR ? ['0vw', '110vw'] : ['100vw', '-10vw'],
              y: [0, -20, -40, -20, 0], // Simplified from 7 to 5 keyframes
            }}
            transition={{
              duration: bat.duration,
              delay: bat.delay,
              repeat: Infinity,
              ease: 'linear', // Linear is more performant than easeInOut
            }}
          >
            🦇
          </motion.div>
        );
      })}
    </div>
  );
};
