import * as React from "react";
import { cn } from "./ui/utils";

interface AmbientInsightCardProps {
  narrative: string;
  label?: string;
  showPip?: boolean;
  className?: string;
  onClick?: () => void;
}

export function AmbientInsightCard({ 
  narrative, 
  label, 
  showPip = true, 
  className,
  onClick 
}: AmbientInsightCardProps) {
  return (
    <div 
      className={cn(
        "relative bg-white rounded-xl p-4 cursor-pointer transition-all duration-200",
        "shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
        "hover:shadow-[0_4px_16px_rgba(0,87,255,0.15)]",
        className
      )}
      onClick={onClick}
    >
      {/* Contextual Pip - Top Right Corner */}
      {showPip && (
        <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-[#0057FF]"
          style={{
            boxShadow: '0 0 4px 2px rgba(0, 87, 255, 0.6)'
          }}
        />
      )}

      {/* Label - Utility Style */}
      {label && (
        <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-2">
          {label}
        </div>
      )}

      {/* Narrative - Main Content */}
      <div className="text-[15px] font-medium text-gray-900 leading-relaxed">
        {narrative}
      </div>
    </div>
  );
}
