import { ParticleBackground } from '@/components/ParticleBackground';
import { FloatingBats } from '@/components/spooky/FloatingBats';
import { FloatingCandles } from '@/components/spooky/FloatingCandles';
import { FloatingSpiders } from '@/components/spooky/FloatingSpiders';
import { GhostCluster } from '@/components/spooky/FloatingGhost';

/**
 * Background effects for the story form
 * Groups all floating and particle effects
 */
export const FormBackground = () => {
  return (
    <>
      <ParticleBackground />
      <FloatingBats count={12} />
      <FloatingSpiders count={5} />
      <FloatingCandles />
      <GhostCluster />
    </>
  );
};
