import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine } from '@tsparticles/engine';

export const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 60,
        particles: {
          color: {
            value: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
          },
          links: {
            enable: false,
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            outModes: {
              default: 'out',
            },
          },
          number: {
            value: 50,
            density: {
              enable: true,
              area: 800,
            },
          },
          opacity: {
            value: { min: 0.3, max: 0.7 },
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
            },
          },
          shape: {
            type: ['circle', 'star'],
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 -z-10"
    />
  );
};
