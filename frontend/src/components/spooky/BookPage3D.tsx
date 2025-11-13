import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BookPage3DProps {
  children: ReactNode;
  side: 'left' | 'right';
  isFlipping: boolean;
  pageKey: string;
}

export const BookPage3D = ({ children, side, isFlipping, pageKey }: BookPage3DProps) => {
  const isLeft = side === 'left';

  return (
    <motion.div
      key={pageKey}
      className="relative h-full w-full"
      style={{
        perspective: '2000px',
        transformStyle: 'preserve-3d',
      }}
      initial={{
        opacity: 0,
        rotateY: isFlipping ? (isLeft ? -90 : 90) : 0,
      }}
      animate={{
        opacity: 1,
        rotateY: 0,
      }}
      exit={{
        opacity: 0,
        rotateY: isLeft ? 90 : -90,
      }}
      transition={{
        duration: 0.8,
        ease: 'easeInOut',
      }}
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Page shadow effect */}
      <div
        className={`absolute inset-y-0 w-8 ${isLeft ? 'right-0' : 'left-0'} bg-gradient-to-${
          isLeft ? 'l' : 'r'
        } from-gray-800/20 to-transparent pointer-events-none`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      />
    </motion.div>
  );
};
