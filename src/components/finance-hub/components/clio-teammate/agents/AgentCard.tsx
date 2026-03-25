import * as React from 'react';
import { Shield, GitMerge, TrendingUp, BarChart3, DollarSign, Waves, Loader2 } from 'lucide-react';
import { cn } from '../../ui/utils';
import type { Agent } from './AgentTypes';

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

const iconMap = { Shield, GitMerge, TrendingUp, BarChart3, DollarSign, Waves };

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const Icon = iconMap[agent.icon as keyof typeof iconMap] || Shield;

  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br', agent.color)}>
          {agent.status === 'working' ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Icon className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-gray-900">{agent.name}</div>
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                agent.status === 'active'
                  ? 'animate-pulse bg-green-500'
                  : agent.status === 'working'
                    ? 'animate-pulse bg-blue-500'
                    : 'bg-gray-400',
              )}
            />
            <span className="text-xs capitalize text-gray-600">{agent.status}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-start gap-3">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br', agent.color)}>
          {agent.status === 'working' ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Icon className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="mb-1 text-sm font-semibold text-gray-900">{agent.name}</h4>
          <div className="flex items-center gap-1.5">
            <div
              className={cn(
                'h-2 w-2 rounded-full',
                agent.status === 'active'
                  ? 'animate-pulse bg-green-500'
                  : agent.status === 'working'
                    ? 'animate-pulse bg-blue-500'
                    : 'bg-gray-400',
              )}
            />
            <span className="text-xs capitalize text-gray-600">{agent.status}</span>
          </div>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-gray-600">{agent.description}</p>
    </div>
  );
}
