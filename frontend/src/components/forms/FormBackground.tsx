import {ParticleBackground} from '@/components/ParticleBackground';
import {FloatingBats} from '@/components/spooky/FloatingBats';
import {FloatingCandles} from '@/components/spooky/FloatingCandles';
import {GhostCluster} from '@/components/spooky/FloatingGhost';

/**
 * Background effects for the story form
 * Groups all floating and particle effects
 */
export const FormBackground = () => {
  return (
    <>
      <ParticleBackground />
      <FloatingBats count={4} />
      <FloatingCandles />
      <GhostCluster />
    </>
  );
};
