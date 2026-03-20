import * as React from "react";

export function PulsatingCloudBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100" />
      
      {/* Pulsating cloud orbs */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-300/60 to-purple-300/50 rounded-full blur-3xl animate-pulse-background" />
      <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-gradient-to-br from-purple-300/50 to-pink-300/50 rounded-full blur-3xl animate-pulse-secondary" />
      <div className="absolute bottom-[10%] left-[25%] w-[450px] h-[450px] bg-gradient-to-br from-pink-300/40 to-blue-300/50 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute top-[50%] left-[50%] w-[350px] h-[350px] bg-gradient-to-br from-indigo-300/40 to-cyan-300/45 rounded-full blur-3xl animate-pulse-background" />
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-white/30" />
    </div>
  );
}