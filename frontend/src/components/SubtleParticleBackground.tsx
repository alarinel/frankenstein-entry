import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

interface SubtleParticleBackgroundProps {
  intensity?: 'light' | 'medium' | 'dark';
}

/**
 * Subtle particle background optimized for reading page
 * Non-distracting ambient effect
 */
export const SubtleParticleBackground = ({ intensity = 'dark' }: SubtleParticleBackgroundProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particleCount = useMemo(() => {
    switch (intensity) {
      case 'light': return 15;
      case 'medium': return 20;
      case 'dark': return 25;
    }
  }, [intensity]);

  const particleOpacity = useMemo(() => {
    switch (intensity) {
      case 'light': return { min: 0.1, max: 0.25 };
      case 'medium': return { min: 0.15, max: 0.35 };
      case 'dark': return { min: 0.2, max: 0.4 };
    }
  }, [intensity]);

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="subtle-particles"
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 24, // Reduced from 30 to 24 FPS
        particles: {
          color: {
            value: ['#a855f7', '#ec4899', '#f97316'],
          },
          links: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 0.2, // Reduced from 0.3 to 0.2
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
            },
          },
          opacity: {
            value: particleOpacity,
            animation: {
              enable: true,
              speed: 0.2, // Reduced from 0.3 to 0.2
              sync: false,
            },
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 2 },
            animation: {
              enable: false, // Disabled size animation
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: false,
            },
            onClick: {
              enable: false,
            },
          },
        },
        detectRetina: true,
        smooth: true, // Enable smooth rendering
        reduceDuplicates: true, // Optimize particle rendering
      }}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};
