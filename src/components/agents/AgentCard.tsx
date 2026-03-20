import * as React from "react";
import { Shield, GitMerge, TrendingUp, BarChart3, DollarSign, Waves, Loader2 } from "lucide-react";
import { Agent } from "./AgentTypes";
import { cn } from "../ui/utils";

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

const iconMap = {
  Shield,
  GitMerge,
  TrendingUp,
  BarChart3,
  DollarSign,
  Waves,
};

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const Icon = iconMap[agent.icon as keyof typeof iconMap] || Shield;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
        <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center", agent.color)}>
          {agent.status === "working" ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Icon className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{agent.name}</div>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              agent.status === "active" ? "bg-green-500 animate-pulse" :
              agent.status === "working" ? "bg-blue-500 animate-pulse" :
              "bg-gray-400"
            )} />
            <span className="text-xs text-gray-600 capitalize">{agent.status}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200">
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center", agent.color)}>
          {agent.status === "working" ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Icon className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{agent.name}</h4>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full",
              agent.status === "active" ? "bg-green-500 animate-pulse" :
              agent.status === "working" ? "bg-blue-500 animate-pulse" :
              "bg-gray-400"
            )} />
            <span className="text-xs text-gray-600 capitalize">{agent.status}</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{agent.description}</p>
    </div>
  );
}
