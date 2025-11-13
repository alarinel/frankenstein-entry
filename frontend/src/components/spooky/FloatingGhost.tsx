import { motion } from 'framer-motion';

interface FloatingGhostProps {
  emoji?: string;
  delay?: number;
  duration?: number;
  startX?: string;
  startY?: string;
  className?: string;
}

export const FloatingGhost = ({
  emoji = '👻',
  delay = 0,
  duration = 4,
  startX = '10%',
  startY = '20%',
  className = '',
}: FloatingGhostProps) => {
  return (
    <motion.div
      className={`absolute text-6xl ${className}`}
      style={{ left: startX, top: startY }}
      animate={{
        y: [0, -25, 0],
        x: [0, 10, 0, -10, 0],
        rotate: [0, 5, 0, -5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.div>
  );
};

export const GhostCluster = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      <FloatingGhost emoji="👻" delay={0} startX="5%" startY="10%" duration={5} />
      <FloatingGhost emoji="👻" delay={1} startX="85%" startY="15%" duration={6} />
      <FloatingGhost emoji="👻" delay={2} startX="15%" startY="70%" duration={4.5} />
      <FloatingGhost emoji="👻" delay={3} startX="90%" startY="65%" duration={5.5} />
      <FloatingGhost emoji="🎃" delay={0.5} startX="50%" startY="5%" duration={4} />
      <FloatingGhost emoji="🎃" delay={2.5} startX="75%" startY="80%" duration={4.5} />
    </div>
  );
};
