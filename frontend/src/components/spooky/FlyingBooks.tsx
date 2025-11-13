import { motion } from 'framer-motion';

export const FlyingBooks = () => {
  const books = ['📕', '📗', '📘', '📙', '📔', '📓'];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {books.map((book, i) => (
        <motion.div
          key={i}
          className="absolute text-6xl"
          style={{
            top: `${20 + Math.random() * 60}%`,
          }}
          initial={{ x: '-100px', rotate: -45 }}
          animate={{
            x: ['0vw', '110vw'],
            y: [0, -50, -100, -50, 0],
            rotate: [-45, 0, 45, 0, -45],
          }}
          transition={{
            duration: 10 + i * 2,
            delay: i * 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {book}
        </motion.div>
      ))}
    </div>
  );
};
