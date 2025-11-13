import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export const LightningEffect = () => {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlash(true);
        setTimeout(() => setFlash(false), 100);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Lightning flash overlay */}
      <motion.div
        className="fixed inset-0 bg-white pointer-events-none z-50"
        animate={{
          opacity: flash ? [0, 0.3, 0, 0.2, 0] : 0,
        }}
        transition={{
          duration: 0.3,
        }}
      />

      {/* Lightning bolt */}
      {flash && (
        <motion.div
          className="fixed top-0 left-1/2 transform -translate-x-1/2 text-9xl z-40 pointer-events-none"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: [0, 1, 0], y: 0 }}
          transition={{ duration: 0.3 }}
        >
          ⚡
        </motion.div>
      )}
    </>
  );
};
