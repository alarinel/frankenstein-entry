import { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

interface SubtleParticleBackgroundProps {
  intensity?: 'light' | 'medium' | 'dark';
}

/**
 * Subtle particle background optimized for reading page
 * Non-distracting ambient effect
 */
export const SubtleParticleBackground = ({ intensity = 'dark' }: SubtleParticleBackgroundProps) => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particleCount = useMemo(() => {
    switch (intensity) {
      case 'light': return 20;
      case 'medium': return 30;
      case 'dark': return 40;
    }
  }, [intensity]);

  const particleOpacity = useMemo(() => {
    switch (intensity) {
      case 'light': return { min: 0.1, max: 0.3 };
      case 'medium': return { min: 0.15, max: 0.4 };
      case 'dark': return { min: 0.2, max: 0.5 };
    }
  }, [intensity]);

  return (
    <Particles
      id="subtle-particles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 30, // Lower FPS for better performance
        particles: {
          color: {
            value: ['#a855f7', '#ec4899', '#f97316'],
          },
          links: {
            enable: false, // No links for cleaner look
          },
          move: {
            enable: true,
            speed: 0.3, // Very slow movement
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'out',
            },
          },
          number: {
            value: particleCount,
            density: {
              enable: true,
              area: 1200,
            },
          },
          opacity: {
            value: particleOpacity,
            animation: {
              enable: true,
              speed: 0.3,
              minimumValue: 0.05,
            },
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 2 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.5,
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: false, // Disable interaction to prevent distraction
            },
            onClick: {
              enable: false,
            },
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};
