"use client";

import * as React from "react";
import { MessageSquare, BarChart3, Calendar, ArrowRight } from "lucide-react";

interface QuickActionsPillsProps {
  onOpenChat: () => void;
  onOpenScenario: () => void;
}

export function QuickActionsPills({ onOpenChat, onOpenScenario }: QuickActionsPillsProps) {
  const [hoveredPill, setHoveredPill] = React.useState<string | null>(null);

  const pills = [
    {
      id: "chat",
      label: "Ask AI CFO Assistant",
      icon: MessageSquare,
      onClick: onOpenChat,
      color: "blue"
    },
    {
      id: "scenario",
      label: "Scenario Planning",
      icon: BarChart3,
      onClick: onOpenScenario,
      color: "green"
    },
    {
      id: "planning",
      label: "Financial Planning",
      icon: Calendar,
      onClick: () => {},
      color: "purple"
    }
  ];

  const getIconColor = (color: string) => {
    switch (color) {
      case "blue":
        return "text-blue-600";
      case "green":
        return "text-green-600";
      case "purple":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {pills.map((pill) => (
        <button
          key={pill.id}
          onClick={pill.onClick}
          onMouseEnter={() => setHoveredPill(pill.id)}
          onMouseLeave={() => setHoveredPill(null)}
          className="group flex items-center gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:shadow-sm hover:bg-gray-50"
        >
          <pill.icon className={`h-4 w-4 ${getIconColor(pill.color)}`} />
          <span>{pill.label}</span>
          <ArrowRight 
            className={`h-4 w-4 text-gray-400 transition-all duration-200 ${
              hoveredPill === pill.id 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-2'
            }`}
          />
        </button>
      ))}
    </div>
  );
}