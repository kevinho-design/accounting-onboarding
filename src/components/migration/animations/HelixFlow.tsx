import * as React from "react";

/**
 * Variation 3: DNA Helix Flow
 * Double helix pattern with flowing gradient particles
 */
export function HelixFlow() {
  const particleCount = 40;
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setOffset(prev => (prev + 1) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Helix strand 1 */}
      {Array.from({ length: particleCount }).map((_, i) => {
        const progress = i / particleCount;
        const angle = (progress * 720 + offset) % 360; // 2 full rotations
        const yProgress = (progress * 100 + (offset / 360)) % 1;
        
        const x = Math.cos((angle * Math.PI) / 180) * 60;
        const y = (yProgress - 0.5) * 200;
        
        // Gradient color based on position
        const hue = (progress * 180 + 200) % 360; // Blue to yellow spectrum
        const opacity = Math.sin(yProgress * Math.PI) * 0.8 + 0.2;
        
        return (
          <div
            key={`helix1-${i}`}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              background: `hsl(${hue}, 70%, 60%)`,
              opacity,
              width: 8,
              height: 8,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              boxShadow: `0 0 12px hsl(${hue}, 70%, 60%)`,
              transition: 'transform 0.03s linear',
            }}
          />
        );
      })}
      
      {/* Helix strand 2 (opposite phase) */}
      {Array.from({ length: particleCount }).map((_, i) => {
        const progress = i / particleCount;
        const angle = (progress * 720 + offset + 180) % 360; // Opposite phase
        const yProgress = (progress * 100 + (offset / 360)) % 1;
        
        const x = Math.cos((angle * Math.PI) / 180) * 60;
        const y = (yProgress - 0.5) * 200;
        
        const hue = (progress * 180 + 80) % 360; // Green to cyan spectrum
        const opacity = Math.sin(yProgress * Math.PI) * 0.8 + 0.2;
        
        return (
          <div
            key={`helix2-${i}`}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              background: `hsl(${hue}, 70%, 60%)`,
              opacity,
              width: 8,
              height: 8,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              boxShadow: `0 0 12px hsl(${hue}, 70%, 60%)`,
              transition: 'transform 0.03s linear',
            }}
          />
        );
      })}
    </div>
  );
}
