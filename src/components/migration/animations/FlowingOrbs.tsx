import * as React from "react";
import { motion } from "motion/react";

/**
 * Variation 2: Flowing Orbs
 * Smooth flowing orbs along curved paths with trails
 */
export function FlowingOrbs() {
  const orbCount = 5;
  const [time, setTime] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.02);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {/* Gradient definitions */}
          <radialGradient id="orbGlow1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orbGlow2">
            <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orbGlow3">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="1" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orbGlow4">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orbGlow5">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="1" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {Array.from({ length: orbCount }).map((_, i) => {
          const pathIndex = i;
          const offset = (i / orbCount) * Math.PI * 2;
          const speed = 1 + (i * 0.3);
          
          // Create flowing sine wave path
          const pathPoints = [];
          for (let t = 0; t < 100; t++) {
            const angle = ((time * speed + offset + (t * 0.1)) % (Math.PI * 2));
            const x = 128 + Math.cos(angle) * (60 + Math.sin(angle * 2) * 30);
            const y = 128 + Math.sin(angle) * (60 + Math.cos(angle * 3) * 30);
            pathPoints.push(`${x},${y}`);
          }
          
          const pathD = `M ${pathPoints.join(' L ')}`;
          
          // Calculate current position
          const angle = ((time * speed + offset) % (Math.PI * 2));
          const cx = 128 + Math.cos(angle) * (60 + Math.sin(angle * 2) * 30);
          const cy = 128 + Math.sin(angle) * (60 + Math.cos(angle * 3) * 30);
          
          return (
            <g key={i}>
              {/* Trail */}
              <motion.path
                d={pathD}
                fill="none"
                stroke={`url(#orbGlow${(i % 5) + 1})`}
                strokeWidth="2"
                opacity="0.3"
                strokeLinecap="round"
              />
              
              {/* Main orb with glow */}
              <circle
                cx={cx}
                cy={cy}
                r="16"
                fill={`url(#orbGlow${(i % 5) + 1})`}
                opacity="0.4"
              />
              <circle
                cx={cx}
                cy={cy}
                r="8"
                fill={`url(#orbGlow${(i % 5) + 1})`}
                opacity="0.6"
              />
              <circle
                cx={cx}
                cy={cy}
                r="4"
                fill={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'][i % 5]}
                opacity="1"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
