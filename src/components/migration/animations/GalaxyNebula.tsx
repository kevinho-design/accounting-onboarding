import * as React from "react";

/**
 * Variation 5: Galaxy Nebula
 * Swirling galaxy-like pattern with varied particle sizes and speeds
 */
export function GalaxyNebula() {
  const armCount = 4;
  const particlesPerArm = 30;
  const [rotation, setRotation] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-96 h-96 flex items-center justify-center overflow-hidden">
      {/* Central core */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 rounded-full bg-white opacity-30 blur-3xl animate-pulse" />
        <div className="absolute inset-0 w-24 h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 opacity-70 blur-2xl" />
        <div className="absolute inset-0 w-12 h-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-90 blur-md" />
      </div>

      {/* Galaxy arms */}
      {Array.from({ length: armCount }).map((_, armIndex) => {
        const baseAngle = (armIndex * 360) / armCount;
        
        return (
          <div key={armIndex}>
            {Array.from({ length: particlesPerArm }).map((_, particleIndex) => {
              const progress = particleIndex / particlesPerArm;
              
              // Logarithmic spiral formula for galaxy arms
              const spiralTightness = 0.3;
              const angle = baseAngle + rotation + (progress * 360 * 2);
              const radius = 15 + (progress * 160 * (1 + Math.log(1 + progress)));
              
              // Add some noise to make it more organic
              const noise = Math.sin(particleIndex * 2.5 + rotation * 0.1) * 12;
              
              const x = Math.cos((angle * Math.PI) / 180) * (radius + noise);
              const y = Math.sin((angle * Math.PI) / 180) * (radius + noise);
              
              // Color gradient from center to edge
              const colorProgress = progress;
              const colors = [
                '#60A5FA', // light blue (center)
                '#34D399', // emerald
                '#FBBF24', // amber
                '#F87171', // red
                '#C084FC', // purple (edge)
              ];
              
              const colorIndex = Math.min(
                Math.floor(colorProgress * (colors.length - 1)),
                colors.length - 1
              );
              const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
              const colorBlend = (colorProgress * (colors.length - 1)) % 1;
              
              const color = colors[colorIndex];
              
              // Size decreases with distance - LARGER PARTICLES
              const baseSize = 14 - (progress * 8);
              const sizeVariation = Math.sin(particleIndex * 1.7) * 3;
              const size = Math.max(4, baseSize + sizeVariation);
              
              // Opacity decreases with distance
              const opacity = 0.9 - (progress * 0.6);
              
              // Blur increases with distance for depth - MORE BLUR
              const blur = 2 + (progress * 4);
              
              return (
                <div
                  key={particleIndex}
                  className="absolute top-1/2 left-1/2 rounded-full"
                  style={{
                    backgroundColor: color,
                    opacity,
                    width: size,
                    height: size,
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    boxShadow: `0 0 ${16 + blur * 4}px ${color}`,
                    filter: `blur(${blur}px)`,
                    transition: 'transform 0.03s linear',
                  }}
                />
              );
            })}
          </div>
        );
      })}

      {/* Scattered dust particles for depth */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i * 137.5 + rotation * 0.2) % 360; // Golden angle distribution
        const radius = 30 + (Math.random() * 150);
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        
        return (
          <div
            key={`dust-${i}`}
            className="absolute top-1/2 left-1/2 rounded-full bg-white"
            style={{
              opacity: Math.random() * 0.4,
              width: 3,
              height: 3,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              filter: 'blur(1px)',
              transition: 'transform 0.03s linear',
            }}
          />
        );
      })}
    </div>
  );
}