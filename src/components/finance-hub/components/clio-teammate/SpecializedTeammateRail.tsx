import * as React from 'react';
import { CheckCircle2, ChevronDown, Loader2, X, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import {
  getExecuteOutcomeForOption,
  getPayrollShortfallTeammatePlan,
  type FhoExecuteOutcome,
  type FhoTeammatePlan,
  type FhoWorkflowOption,
} from '../../data/fhoTeammateBreakdowns';
import type { AgentAction, Exception } from '../../../agents/AgentTypes';
import { TeammateTodayTab } from './TeammateTodayTab';

export type TeammateChatMessage = { role: 'user' | 'ai'; content: string; id?: string };

export interface SpecializedTeammateRailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatHistory: TeammateChatMessage[];
  onUserSend: (text: string) => void;
  onClearChat?: () => void;
  brandColor?: string;
  /**
   * When true, the panel sits beside main content (pushes layout) instead of overlaying with a scrim.
   */
  dock?: boolean;
  /** When incremented (e.g. Finances widget "Explore actions"), switch to the Plan tab. */
  focusPlanTabNonce?: number;
  /** Content for Financial Health "Explore actions" — shown on Plan, not as chat. */
  teammatePlan?: FhoTeammatePlan | null;
  onTeammateExplorePlan?: (plan: FhoTeammatePlan) => void;
  /** Accounting shell exceptions + agent actions for the Today tab. */
  exceptions?: Exception[];
  recentActions?: AgentAction[];
  /** Injected when opening from the floating bar (e.g. `__sparkle__` → Today tab). */
  initialMessage?: string;
  onMessageConsumed?: () => void;
}

export function SpecializedTeammateRail({
  open,
  onOpenChange,
  chatHistory,
  onUserSend,
  onClearChat,
  brandColor = '#0069D1',
  dock = false,
  focusPlanTabNonce = 0,
  teammatePlan = null,
  onTeammateExplorePlan,
  exceptions = [],
  recentActions = [],
  initialMessage,
  onMessageConsumed,
}: SpecializedTeammateRailProps) {
  const [tab, setTab] = React.useState('today');
  const [draft, setDraft] = React.useState('');
  const [expandedOptionId, setExpandedOptionId] = React.useState<string | null>(null);
  const [executingOptionId, setExecutingOptionId] = React.useState<string | null>(null);
  const [completedByOptionId, setCompletedByOptionId] = React.useState<Record<string, FhoExecuteOutcome>>(
    {},
  );
  const executeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setExpandedOptionId(null);
    setExecutingOptionId(null);
    setCompletedByOptionId({});
  }, [teammatePlan]);

  React.useEffect(() => {
    return () => {
      if (executeTimerRef.current) clearTimeout(executeTimerRef.current);
    };
  }, []);

  const runExecuteWorkflow = (opt: FhoWorkflowOption) => {
    if (completedByOptionId[opt.id] || executingOptionId) return;
    setExecutingOptionId(opt.id);
    if (executeTimerRef.current) clearTimeout(executeTimerRef.current);
    executeTimerRef.current = setTimeout(() => {
      executeTimerRef.current = null;
      const outcome = getExecuteOutcomeForOption(opt);
      setCompletedByOptionId((prev) => ({ ...prev, [opt.id]: outcome }));
      setExecutingOptionId(null);
    }, 650);
  };

  React.useEffect(() => {
    if (focusPlanTabNonce > 0) setTab('plan');
  }, [focusPlanTabNonce]);

  React.useEffect(() => {
    if (!open || !initialMessage) return;
    if (initialMessage === '__sparkle__') {
      setTab('today');
    } else {
      setTab('chat');
      onUserSend(initialMessage);
    }
    onMessageConsumed?.();
  }, [initialMessage, open, onUserSend, onMessageConsumed]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  const sendDraft = () => {
    const t = draft.trim();
    if (!t) return;
    onUserSend(t);
    setDraft('');
  };

  const panelBody = (
    <>
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50">
            <Sparkles className="h-4 w-4 text-blue-600" strokeWidth={1.75} />
          </div>
          <div>
            <h2 id="teammate-rail-title" className="text-sm font-bold text-gray-900">
              Clio Teammate
            </h2>
            <p className="text-xs text-gray-500">Today · Chat · Plan</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex min-h-0 min-w-0 flex-1 flex-col gap-0 px-4 pt-3">
        <TabsList className="mb-3 h-auto w-full flex-wrap justify-start gap-1 rounded-xl bg-gray-100 p-1">
          <TabsTrigger value="today" className="flex-1 text-xs sm:text-sm">
            Today
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex-1 text-xs sm:text-sm">
            Chat
          </TabsTrigger>
          <TabsTrigger value="plan" className="flex-1 text-xs sm:text-sm">
            Plan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="min-h-0 flex-1 overflow-y-auto custom-scrollbar pb-4">
          <TeammateTodayTab
            exceptions={exceptions}
            recentActions={recentActions}
            onAskAboutException={(title) => {
              setTab('chat');
              onUserSend(`Help me with: "${title}"`);
            }}
            onExceptionPrimaryAction={(ex) => {
              if (ex.id === 'payroll-shortfall-gap') {
                onTeammateExplorePlan?.(getPayrollShortfallTeammatePlan());
                return;
              }
              setTab('chat');
              onUserSend(`Help me with: "${ex.title}"`);
            }}
          />
        </TabsContent>

        <TabsContent value="chat" className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden pb-4">
          <div className="flex items-center justify-end">
            {onClearChat && chatHistory.length > 0 ? (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClearChat}>
                Clear chat
              </Button>
            ) : null}
          </div>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/50 p-3 custom-scrollbar">
            {chatHistory.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">
                Ask Firm Intelligence anything — messages appear here.
              </p>
            ) : (
              chatHistory.map((msg, i) => (
                <div
                  key={msg.id ?? `${msg.role}-${i}-${String(msg.content ?? '').slice(0, 24)}`}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'ai' && (
                    <div className="mb-1 mr-2 flex h-8 w-8 shrink-0 items-center justify-center self-end rounded-full border border-blue-200 bg-blue-100">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-[16px] p-3 text-[13px] leading-relaxed shadow-sm',
                      msg.role === 'user'
                        ? 'rounded-br-[4px] bg-blue-600 text-white'
                        : 'rounded-bl-[4px] border border-gray-200 bg-white text-gray-800 whitespace-pre-wrap break-words',
                    )}
                  >
                    {msg.role === 'ai' && i === chatHistory.length - 1 && msg.content === '...' ? (
                      <div className="flex h-5 items-center gap-1 px-1">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                        <div
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.15s' }}
                        />
                        <div
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                          style={{ animationDelay: '0.3s' }}
                        />
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex gap-2 border-t border-gray-100 pt-3">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendDraft();
                }
              }}
              placeholder="Message Firm Intelligence…"
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Button
              type="button"
              onClick={sendDraft}
              className="shrink-0 text-white"
              style={{ backgroundColor: brandColor }}
            >
              Send
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="plan" className="min-h-0 flex-1 overflow-y-auto custom-scrollbar pb-4">
          {teammatePlan ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
                <h3 className="text-sm font-semibold text-gray-900">{teammatePlan.title}</h3>
                {teammatePlan.context ? (
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">{teammatePlan.context}</p>
                ) : null}
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Workflow options
                </p>
                {teammatePlan.options.map((opt) => {
                  const isOpen = expandedOptionId === opt.id;
                  const isDone = Boolean(completedByOptionId[opt.id]);
                  const isExecuting = executingOptionId === opt.id;
                  const outcome = completedByOptionId[opt.id];
                  const anyExecuting = executingOptionId !== null;
                  return (
                    <div
                      key={opt.id}
                      className={cn(
                        'rounded-xl border bg-white p-3 shadow-sm transition-colors',
                        isDone ? 'border-emerald-200/80 bg-emerald-50/40' : 'border-gray-200',
                      )}
                      aria-busy={isExecuting}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-gray-900">{opt.title}</h4>
                            {opt.summary ? (
                              <p className="mt-1 text-xs leading-relaxed text-gray-600">{opt.summary}</p>
                            ) : null}
                          </div>
                          {isDone ? (
                            <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-100/90 px-2 py-0.5 text-[11px] font-semibold text-emerald-900">
                              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                              Completed
                            </span>
                          ) : null}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            disabled={isDone || (anyExecuting && !isExecuting)}
                            className={cn(
                              'text-white',
                              !isDone && 'disabled:opacity-60',
                              isDone && 'pointer-events-none bg-emerald-600/90 text-white',
                            )}
                            style={
                              isDone
                                ? undefined
                                : {
                                    backgroundColor: brandColor,
                                  }
                            }
                            onClick={() => runExecuteWorkflow(opt)}
                          >
                            {isExecuting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                                Working…
                              </>
                            ) : isDone ? (
                              'Completed'
                            ) : (
                              'Execute'
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="gap-1 border-gray-200"
                            onClick={() => setExpandedOptionId(isOpen ? null : opt.id)}
                            aria-expanded={isOpen}
                          >
                            Explore
                            <ChevronDown
                              className={cn(
                                'h-4 w-4 transition-transform',
                                isOpen ? 'rotate-180' : 'rotate-0',
                              )}
                            />
                          </Button>
                        </div>
                      </div>
                      {isDone && outcome ? (
                        <div
                          className="mt-3 rounded-lg border border-emerald-100 bg-white/90 p-3 shadow-sm"
                          aria-live="polite"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900/90">
                            What Firm Intelligence did
                          </p>
                          <p className="mt-2 text-xs leading-relaxed text-gray-800">{outcome.summary}</p>
                          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-snug text-gray-700">
                            {outcome.bullets.map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {isOpen ? (
                        <ol className="mt-3 space-y-3 border-t border-gray-100 pt-3">
                          {opt.actions.map((action, idx) => (
                            <li key={action.id} className="text-sm">
                              <div className="flex gap-2">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                                  {idx + 1}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium leading-snug text-gray-900">{action.label}</p>
                                  {action.detail ? (
                                    <p className="mt-1 text-xs leading-relaxed text-gray-600">{action.detail}</p>
                                  ) : null}
                                  {action.ctaLabel && action.ctaKind !== 'none' ? (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="mt-2 h-7 px-2 text-xs text-blue-700"
                                      onClick={() =>
                                        toast.message(
                                          action.ctaKind === 'toast'
                                            ? `${action.ctaLabel} — prototype: Firm Intelligence would complete this step.`
                                            : action.ctaLabel,
                                        )
                                      }
                                    >
                                      {action.ctaLabel}
                                    </Button>
                                  ) : null}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ol>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
              <p className="text-sm font-medium text-gray-700">No plan loaded yet</p>
              <p className="mt-1 text-xs text-gray-500">
                Use <span className="font-semibold text-gray-700">Explore actions</span> on a Financial Health widget to
                see recommended steps and options here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );

  if (dock) {
    /**
     * Fixed positioning — do not participate in the main+rail flex row. A flex sibling with %-based
     * width competes with `main` (`flex-1 min-w-0`) and can shrink the report to 0 width (“blank” screen).
     * Main gets matching `md:pr-*` padding from App when open.
     */
    return (
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="teammate-rail-title"
        aria-hidden={!open}
        className={cn(
          'fixed inset-y-0 right-0 z-[45] flex min-h-0 w-full max-w-md flex-col bg-white shadow-2xl motion-reduce:transition-none overflow-hidden border-l border-gray-200 transition-transform duration-300 ease-out lg:w-[28rem] lg:max-w-none',
          open ? 'translate-x-0' : 'translate-x-full pointer-events-none',
        )}
      >
        {open ? panelBody : null}
      </aside>
    );
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close teammate panel"
            className="fixed inset-0 z-[60] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="teammate-rail-title"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {panelBody}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
