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
      // Alternate between top-to-bottom and bottom-to-top
      startY: i % 2 === 0 ? -10 : 110,
      endY: i % 2 === 0 ? 110 : -10,
      // Random horizontal position
      x: Math.random() * 100,
      // Stagger delays
      delay: i * 3,
      // Random duration between 15-25 seconds
      duration: 15 + Math.random() * 10,
      // Random size
      size: 0.8 + Math.random() * 0.6,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-5">
      {spiders.map((spider) => (
        <motion.div
          key={spider.id}
          className="absolute"
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
            rotate: [0, 10, -10, 0],
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
          <motion.div
            animate={{
              // Slight swinging motion
              x: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🕷️
          </motion.div>
          
          {/* Spider web thread */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{
              width: '1px',
              height: spider.startY < 50 ? '100px' : '0px',
              background: 'linear-gradient(to bottom, rgba(200, 200, 200, 0.3), transparent)',
              top: spider.startY < 50 ? '-100px' : 'auto',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
