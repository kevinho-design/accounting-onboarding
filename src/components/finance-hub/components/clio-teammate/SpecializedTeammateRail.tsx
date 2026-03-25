import * as React from 'react';
import { X, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import { AgentCard } from './agents/AgentCard';
import { ExplainableAction } from './agents/ExplainableAction';
import { AGENTS, type Agent, type AgentAction, type Exception } from './agents/AgentTypes';

export type TeammateChatMessage = { role: 'user' | 'ai'; content: string; id?: string };

const MOCK_EXCEPTIONS: Exception[] = [
  {
    id: 'ex-1',
    agentId: 'trust-compliance',
    severity: 'high',
    title: 'IOLTA reconciliation variance',
    description: 'Trust account #4892 shows $2,400 unmatched between bank and ledger this week.',
    impact: 'May affect compliance attestation for Q1.',
    suggestedAction: 'Run three-way match and attach supporting transfers.',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    id: 'ex-2',
    agentId: 'collections',
    severity: 'medium',
    title: 'A/R bucket shift',
    description: 'Three matters moved from 31–60 to 61–90 days past due.',
    suggestedAction: 'Review collections playbook for Johnson matter cluster.',
    createdAt: new Date(Date.now() - 3600000 * 28),
  },
  {
    id: 'ex-3',
    agentId: 'cash-flow',
    severity: 'low',
    title: 'Runway cushion tightening',
    description: 'Projected runway decreased by 6 days vs. last forecast.',
    createdAt: new Date(Date.now() - 3600000 * 72),
  },
];

const MOCK_ACTIONS: AgentAction[] = [
  {
    agentId: 'matching',
    timestamp: new Date(Date.now() - 120000),
    action: 'Matched 14 bank lines to expense GL with 98% confidence.',
    reasoning:
      'Vendor names and amounts aligned with recurring payroll and utility patterns; two items flagged for partner review.',
    isEditable: true,
    isReversible: true,
  },
  {
    agentId: 'revenue-forecasting',
    timestamp: new Date(Date.now() - 3600000),
    action: 'Updated Q2 revenue forecast +3.2% based on pipeline stage changes.',
    reasoning: 'Three large matters moved to “negotiation” in Clio; historical conversion applied.',
    isEditable: false,
    isReversible: true,
  },
];

function severityStyles(severity: Exception['severity']) {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-amber-100 text-amber-900 border-amber-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

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
}

export function SpecializedTeammateRail({
  open,
  onOpenChange,
  chatHistory,
  onUserSend,
  onClearChat,
  brandColor = '#0069D1',
  dock = false,
}: SpecializedTeammateRailProps) {
  const [tab, setTab] = React.useState('chat');
  const [draft, setDraft] = React.useState('');

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

  const agentList: Agent[] = Object.values(AGENTS);

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
            <p className="text-xs text-gray-500">Attention · Your team · Chat</p>
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
          <TabsTrigger value="attention" className="flex-1 text-xs sm:text-sm">
            Attention
          </TabsTrigger>
          <TabsTrigger value="team" className="flex-1 text-xs sm:text-sm">
            Your team
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex-1 text-xs sm:text-sm">
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attention" className="min-h-0 flex-1 overflow-y-auto custom-scrollbar pb-4">
          <div className="space-y-3">
            {MOCK_EXCEPTIONS.map((ex) => {
              const agent = AGENTS[ex.agentId];
              return (
                <div key={ex.id} className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                        severityStyles(ex.severity),
                      )}
                    >
                      {ex.severity}
                    </span>
                    <span className="text-xs text-gray-500">{agent.name}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{ex.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{ex.description}</p>
                  {ex.impact ? (
                    <p className="mt-2 text-xs text-gray-500">
                      <span className="font-medium text-gray-700">Impact:</span> {ex.impact}
                    </p>
                  ) : null}
                  {ex.suggestedAction ? (
                    <p className="mt-2 text-xs text-blue-700">
                      <span className="font-semibold">Suggested:</span> {ex.suggestedAction}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="team" className="min-h-0 flex-1 overflow-y-auto custom-scrollbar pb-4">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Active agents</p>
              <div className="grid gap-2 sm:grid-cols-1">
                {agentList.map((a) => (
                  <AgentCard key={a.id} agent={a} compact />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">Recent actions</p>
              <div className="space-y-2">
                {MOCK_ACTIONS.map((act, i) => (
                  <ExplainableAction key={i} action={act} />
                ))}
              </div>
            </div>
          </div>
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
