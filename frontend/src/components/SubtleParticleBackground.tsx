import { useEffect, useState, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

interface SubtleParticleBackgroundProps {
  intensity?: 'light' | 'medium' | 'dark';
  enabled?: boolean;
}

/**
 * Subtle particle background optimized for reading page
 * Non-distracting ambient effect
 * Performance optimized to prevent browser crashes
 */
export const SubtleParticleBackground = ({ 
  intensity = 'dark',
  enabled = true 
}: SubtleParticleBackgroundProps) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, [enabled]);

  const particleCount = useMemo(() => {
    switch (intensity) {
      case 'light': return 8;
      case 'medium': return 12;
      case 'dark': return 15;
    }
  }, [intensity]);

  const particleOpacity = useMemo(() => {
    switch (intensity) {
      case 'light': return { min: 0.1, max: 0.2 };
      case 'medium': return { min: 0.12, max: 0.25 };
      case 'dark': return { min: 0.15, max: 0.3 };
    }
  }, [intensity]);

  if (!init || !enabled) {
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
        fpsLimit: 20, // Further reduced to 20 FPS for better performance
        particles: {
          color: {
            value: ['#a855f7', '#ec4899', '#f97316'],
          },
          links: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 0.15, // Further reduced speed
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
              width: 1920,
              height: 1080,
            },
          },
          opacity: {
            value: particleOpacity,
            animation: {
              enable: true,
              speed: 0.15, // Slower opacity animation
              sync: false,
            },
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 2 },
            animation: {
              enable: false,
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
            resize: {
              enable: true,
              delay: 0.5,
            },
          },
        },
        detectRetina: false, // Disable retina detection to reduce load
        smooth: false, // Disable smooth rendering to reduce GPU load
        reduceDuplicates: true,
      }}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};
