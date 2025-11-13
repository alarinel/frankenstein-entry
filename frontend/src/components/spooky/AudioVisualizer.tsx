import { motion } from 'framer-motion';

interface AudioVisualizerProps {
  isPlaying: boolean;
}

export const AudioVisualizer = ({ isPlaying }: AudioVisualizerProps) => {
  const bars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex items-end justify-center gap-1 h-8">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-spooky-purple-600 to-spooky-pink-400 rounded-full"
          animate={{
            height: isPlaying
              ? [
                  `${20 + Math.random() * 20}%`,
                  `${50 + Math.random() * 50}%`,
                  `${20 + Math.random() * 20}%`,
                ]
              : '20%',
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: isPlaying ? Infinity : 0,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};
