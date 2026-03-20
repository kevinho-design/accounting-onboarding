import * as React from "react";
import { Sparkles } from "lucide-react";

interface CFOAvatarProps {
  size?: "sm" | "md" | "lg";
  showPulse?: boolean;
}

export function CFOAvatar({ size = "md", showPulse = true }: CFOAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className="relative">
      {/* Pulsing glow ring */}
      {showPulse && (
        <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-30 animate-ping`} />
      )}
      
      {/* Avatar */}
      <div className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg`}>
        <Sparkles className={`${iconSizes[size]} text-white`} />
      </div>
    </div>
  );
}
