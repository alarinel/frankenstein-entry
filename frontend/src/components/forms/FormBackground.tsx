import {FloatingBats} from '@/components/spooky/FloatingBats';

/**
 * Background effects for the story form
 * Simplified for better performance - removed heavy particle effects
 */
export const FormBackground = () => {
  return (
    <>
      {/* Reduced to minimal effects to prevent Chrome GPU issues */}
      <FloatingBats count={2} />
    </>
  );
};
