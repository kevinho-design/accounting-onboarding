import * as React from "react";
import { motion } from "motion/react";

/**
 * Variation 1: Particle Swirl
 * Multiple spiraling streams of particles with gradient colors
 */
export function ParticleSwirl() {
  const streams = 6; // Number of spiral streams
  const particlesPerStream = 24;
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {Array.from({ length: streams }).map((_, streamIndex) => {
        const baseAngle = (streamIndex * 360) / streams;
        
        return (
          <div key={streamIndex}>
            {Array.from({ length: particlesPerStream }).map((_, particleIndex) => {
              const progress = particleIndex / particlesPerStream;
              const angle = baseAngle + rotation + (progress * 720); // 2 full rotations
              const radius = 20 + (progress * 100); // Spiral outward
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              // Color gradient from blue -> teal -> yellow -> cream
              const colors = [
                '#3B82F6', // blue
                '#06B6D4', // cyan
                '#10B981', // emerald
                '#84CC16', // lime
                '#EAB308', // yellow
                '#FDE68A', // cream
              ];
              const colorIndex = Math.floor(progress * (colors.length - 1));
              const color = colors[colorIndex];
              
              // Opacity fades as particles go outward
              const opacity = 1 - (progress * 0.7);
              
              // Size varies slightly
              const size = 6 + Math.sin(progress * Math.PI * 4) * 2;
              
              return (
                <motion.div
                  key={particleIndex}
                  className="absolute top-1/2 left-1/2 rounded-full"
                  style={{
                    backgroundColor: color,
                    opacity,
                    width: size,
                    height: size,
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: progress * 0.5,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
