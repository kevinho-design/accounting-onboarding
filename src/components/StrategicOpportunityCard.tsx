"use client";

import * as React from "react";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Badge } from "./ui/badge";

interface StrategicOpportunityCardProps {
  onModelScenario: () => void;
}

export function StrategicOpportunityCard({ onModelScenario }: StrategicOpportunityCardProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setMousePosition({ x, y });
  };

  const getGradientStyle = () => {
    const xOffset = (mousePosition.x - 0.5) * 20;
    const yOffset = (mousePosition.y - 0.5) * 20;
    
    return {
      background: `radial-gradient(circle at ${50 + xOffset}% ${50 + yOffset}%, 
        rgba(16, 24, 40, 0.95) 0%, 
        rgba(12, 18, 30, 0.98) 40%, 
        rgba(8, 12, 20, 1) 100%), 
        linear-gradient(135deg, 
        rgba(59, 130, 246, 0.1) 0%, 
        rgba(147, 51, 234, 0.1) 50%, 
        rgba(236, 72, 153, 0.1) 100%)`,
      transition: 'background 0.3s ease'
    };
  };

  return (
    <div 
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl shadow-sm cursor-pointer group"
      style={getGradientStyle()}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Inner shadow overlay */}
      <div className="absolute inset-0 rounded-2xl shadow-inner opacity-30" 
           style={{ boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)' }} />
      
      {/* Content container */}
      <div className="relative z-10 p-6 h-full">
        {/* Top row: Icon and Badge */}
        <div className="flex items-start justify-between mb-6">
          {/* Lightbulb icon */}
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <Lightbulb className="h-5 w-5 text-amber-300" />
          </div>
          
          {/* Badge with confidence */}
          <div className="flex items-center gap-3">
            <Badge 
              variant="secondary" 
              className="bg-white/10 backdrop-blur-sm text-white border-white/20 text-xs px-3 py-1"
            >
              Strategic Opportunity
            </Badge>
            <span className="text-xs text-white/70 font-medium">Confidence: High</span>
          </div>
        </div>

        {/* Main headline with subtle glow */}
        <div className="mb-4">
          <h3 
            className="text-white font-semibold text-lg leading-tight mb-0"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
          >
            Leads suggest demand for Immigration Law — potential +$278K/year with 1 new associate
          </h3>
        </div>

        {/* Body copy */}
        <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">
          Based on current market trends and your firm's capacity, expanding into Immigration Law could increase annual revenue by 18–22% with moderate risk.
        </p>

        {/* Call-to-action button */}
        <button
          onClick={onModelScenario}
          className="group/btn relative inline-flex items-center gap-2 px-4 py-2.5 bg-transparent border border-white/30 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:border-white/50 hover:bg-white/5 hover:shadow-lg hover:shadow-white/20"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span>Model this scenario</span>
          <ArrowRight 
            className={`h-4 w-4 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
            }`} 
          />
        </button>
      </div>
      
      {/* Ambient light effect */}
      <div 
        className="absolute inset-0 opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 50%)`
        }}
      />
    </div>
  );
}