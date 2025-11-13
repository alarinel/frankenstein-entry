import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface FloatingSpidersProps {
  count?: number;
}

/**
 * Floating spiders that crawl from bottom to top and top to bottom
 * Similar to bats but with vertical movement
 */
export const FloatingSpiders = ({ count = 4 }: FloatingSpidersProps) => {
  const spiders = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      startY: i % 2 === 0 ? -10 : 110,
      endY: i % 2 === 0 ? 110 : -10,
      x: Math.random() * 100,
      delay: i * 4, // Increased stagger
      duration: 20 + Math.random() * 10, // Slower: 20-30s instead of 15-25s
      size: 0.8 + Math.random() * 0.6,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {spiders.map((spider) => (
        <motion.div
          key={spider.id}
          className="absolute will-change-transform"
          style={{
            left: `${spider.x}%`,
            fontSize: `${spider.size}rem`,
          }}
          initial={{
            y: `${spider.startY}vh`,
            opacity: 0,
          }}
          animate={{
            y: `${spider.endY}vh`,
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: spider.duration,
            delay: spider.delay,
            repeat: Infinity,
            ease: 'linear',
            opacity: {
              times: [0, 0.1, 0.9, 1],
            },
          }}
        >
          🕷️
        </motion.div>
      ))}
    </div>
  );
};
