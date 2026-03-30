import * as React from 'react';
import {
  Sparkles,
  AlertCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Shield,
  GitMerge,
  TrendingUp,
  BarChart3,
  DollarSign,
  Waves,
  AlertTriangle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AGENTS, type AgentAction, type Exception } from './agents/AgentTypes';
import { ExplainableAction } from './agents/ExplainableAction';
import { TrustAssignCTA } from '../../../accounting/TrustAssign';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

const PAYROLL_SHORTFALL_ID = 'payroll-shortfall-gap';

const SEVERITY_ORDER: Record<Exception['severity'], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function sortExceptionsForToday(exceptions: Exception[]): Exception[] {
  return [...exceptions].sort((a, b) => {
    const aPayroll = a.id === PAYROLL_SHORTFALL_ID;
    const bPayroll = b.id === PAYROLL_SHORTFALL_ID;
    if (aPayroll && !bPayroll) return -1;
    if (bPayroll && !aPayroll) return 1;
    return SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
  });
}

export function TeammateTodayTab({
  exceptions,
  recentActions,
  onAskAboutException,
  onExceptionPrimaryAction,
}: {
  exceptions: Exception[];
  recentActions: AgentAction[];
  onAskAboutException: (exceptionTitle: string) => void;
  /** Primary CTA (e.g. payroll scenario prompt); rail is already open so this switches to Chat + sends. */
  onExceptionPrimaryAction: (exception: Exception) => void;
}) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const sortedExceptions = React.useMemo(() => sortExceptionsForToday(exceptions), [exceptions]);

  const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    'trust-compliance': Shield,
    matching: GitMerge,
    'revenue-forecasting': TrendingUp,
    'matter-profitability': BarChart3,
    collections: DollarSign,
    'cash-flow': Waves,
  };
  const ICON_OVERRIDES: Record<string, React.ComponentType<{ className?: string }>> = {
    [PAYROLL_SHORTFALL_ID]: AlertTriangle,
    'sys-bank-disconnect': AlertTriangle,
    'sys-trust-balance': AlertTriangle,
  };
  const COLOR_OVERRIDES: Record<string, string> = {
    [PAYROLL_SHORTFALL_ID]: 'from-rose-600 to-red-600',
    'sys-bank-disconnect': 'from-amber-500 to-orange-500',
    'sys-trust-balance': 'from-amber-500 to-orange-500',
  };

  return (
    <div className="space-y-6 pb-2">
      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500">Needs your input</h4>
        {exceptions.length === 0 ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-900">All clear!</p>
            <p className="text-xs text-gray-500">Nothing needs your attention right now.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedExceptions.map((exception) => {
              const agent = AGENTS[exception.agentId];
              const AgentIcon = ICON_OVERRIDES[exception.id] ?? AGENT_ICONS[exception.agentId] ?? Sparkles;
              const agentColor =
                COLOR_OVERRIDES[exception.id] ?? AGENTS[exception.agentId]?.color ?? 'from-blue-500 to-blue-600';
              const isExpanded = expandedId === exception.id;
              const isPayrollShortfall = exception.id === PAYROLL_SHORTFALL_ID;
              return (
                <div
                  key={exception.id}
                  className={cn(
                    'overflow-hidden rounded-xl border bg-white',
                    isPayrollShortfall ? 'border-rose-300 ring-1 ring-rose-200' : 'border-gray-200',
                  )}
                >
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                    onClick={() => setExpandedId(isExpanded ? null : exception.id)}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br',
                        agentColor,
                      )}
                    >
                      <AgentIcon className="h-3 w-3 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{exception.title}</p>
                      <p className="truncate text-xs text-gray-500">
                        {isPayrollShortfall ? 'High priority' : agent.name}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-100 px-4 pb-4 pt-1">
                          <p className="mb-3 line-clamp-2 text-xs text-gray-600">{exception.description}</p>
                          {exception.impact && (
                            <div className="mb-3 flex items-start gap-1.5 rounded-lg bg-amber-50 p-2 text-xs text-amber-800">
                              <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0" />
                              <span>{exception.impact}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {exception.id === 'sys-trust-balance' ? (
                              <TrustAssignCTA
                                compact
                                buttonClassName="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-[12px] font-medium text-white transition-all hover:bg-blue-700"
                                buttonStyle={{}}
                              />
                            ) : (
                              exception.suggestedAction && (
                                <Button
                                  size="sm"
                                  className="flex-1 cursor-pointer bg-blue-600 text-xs text-white hover:bg-blue-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onExceptionPrimaryAction(exception);
                                  }}
                                >
                                  {exception.suggestedAction}
                                  <ChevronRight className="ml-1 h-3 w-3" />
                                </Button>
                              )
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-shrink-0 cursor-pointer border-gray-200 text-xs text-gray-600 hover:bg-gray-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                onAskAboutException(exception.title);
                              }}
                            >
                              <Sparkles className="mr-1 h-3 w-3 text-blue-500" />
                              Ask Clio
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">Handled for you</h4>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            <span>3 agents active</span>
          </div>
        </div>
        {recentActions.length === 0 ? (
          <div className="py-4 text-center text-xs text-gray-400">No recent activity</div>
        ) : (
          <div className="space-y-2">
            {recentActions.map((action) => (
              <ExplainableAction
                key={action.id ?? `${action.agentId}-${action.timestamp?.getTime?.()}`}
                action={action}
                onEdit={action.isEditable ? () => {} : undefined}
                onReverse={action.isReversible ? () => {} : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
