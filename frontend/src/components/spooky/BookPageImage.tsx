import { motion, AnimatePresence } from 'framer-motion';
import { READING_CONSTANTS } from '@/constants/reading';

interface BookPageImageProps {
  imageUrl: string;
  pageNumber: number;
  currentPage: number;
}

export const BookPageImage = ({ imageUrl, pageNumber, currentPage }: BookPageImageProps) => {
  const { BOOK_BORDER_RADIUS } = READING_CONSTANTS.STYLES;
  const { IMAGE_LAYER } = READING_CONSTANTS.Z_INDEX;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`spread-${currentPage}`}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`absolute inset-0 z-${IMAGE_LAYER}`}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <img
          src={imageUrl}
          alt={`Page ${pageNumber}`}
          className={`absolute inset-0 w-full h-full object-cover ${BOOK_BORDER_RADIUS}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
          }}
        />
        {/* Enhanced gradient overlays for depth and readability */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 ${BOOK_BORDER_RADIUS}`} />
        <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30 ${BOOK_BORDER_RADIUS}`} />
        {/* Vignette effect */}
        <div className={`absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.3)] ${BOOK_BORDER_RADIUS}`} />
      </motion.div>
    </AnimatePresence>
  );
};
