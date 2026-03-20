import * as React from "react";

/**
 * Variation 4: Orbital Rings
 * Concentric rings with particles orbiting at different speeds
 */
export function OrbitalRings() {
  const rings = 5;
  const particlesPerRing = [12, 16, 20, 24, 28];
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-60 blur-xl" />
        <div className="absolute inset-0 w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-300 to-purple-500 opacity-80" />
      </div>

      {Array.from({ length: rings }).map((_, ringIndex) => {
        const radius = 30 + (ringIndex * 20);
        const particleCount = particlesPerRing[ringIndex];
        const speed = 1 + (ringIndex * 0.4);
        const direction = ringIndex % 2 === 0 ? 1 : -1; // Alternate directions
        
        return (
          <div key={ringIndex}>
            {Array.from({ length: particleCount }).map((_, particleIndex) => {
              const baseAngle = (particleIndex * 360) / particleCount;
              const angle = baseAngle + (rotation * speed * direction);
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              // Color based on ring position and rotation
              const colors = [
                { bg: '#3B82F6', shadow: '#3B82F6' }, // blue
                { bg: '#10B981', shadow: '#10B981' }, // emerald
                { bg: '#F59E0B', shadow: '#F59E0B' }, // amber
                { bg: '#8B5CF6', shadow: '#8B5CF6' }, // violet
                { bg: '#06B6D4', shadow: '#06B6D4' }, // cyan
              ];
              const colorSet = colors[ringIndex];
              
              // Vary size based on position in orbit
              const sizeVariation = Math.sin((angle * Math.PI) / 180) * 1.5;
              const size = 5 + sizeVariation;
              
              // Opacity pulses based on angle
              const opacity = 0.4 + (Math.cos((angle * Math.PI) / 180) * 0.3);
              
              return (
                <div
                  key={particleIndex}
                  className="absolute top-1/2 left-1/2 rounded-full"
                  style={{
                    backgroundColor: colorSet.bg,
                    opacity,
                    width: size,
                    height: size,
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    boxShadow: `0 0 10px ${colorSet.shadow}`,
                    transition: 'all 0.03s linear',
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
