import * as React from 'react';
import { ChevronDown, X, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';
import {
  getPayrollShortfallTeammatePlan,
  isFhoWorkflowDualAction,
  isFhoWorkflowOperatingTransfer,
  isPlanWorkflowCardAction,
  type FhoTeammatePlan,
  type FhoWorkflowOperatingTransferStep,
} from '../../data/fhoTeammateBreakdowns';
import type { AgentAction, Exception } from '../../../agents/AgentTypes';
import { TrustAssignCTA, TRUST_ASSIGN_COMPACT_TRIGGER_CLASS } from '../../../accounting/TrustAssign';
import { TeammateTodayTab } from './TeammateTodayTab';

function PlanOperatingTransferCard({
  action,
  brandColor,
  stepIndex,
}: {
  action: FhoWorkflowOperatingTransferStep;
  brandColor: string;
  stepIndex: number;
}) {
  const firstId = action.sourceAccounts[0]?.id ?? '';
  const [sourceAccountId, setSourceAccountId] = React.useState(firstId);
  const [amountInput, setAmountInput] = React.useState(String(action.defaultTransferAmount));

  const selected = action.sourceAccounts.find((a) => a.id === sourceAccountId);

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/40 p-3 shadow-sm">
      <div className="flex gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200/90 text-[11px] font-bold text-gray-700">
          {stepIndex + 1}
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-sm font-semibold leading-snug text-gray-900">{action.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-600">{action.description}</p>
          </div>
          <div className="rounded-md border border-amber-200/80 bg-amber-50/60 px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-900/80">
              Payroll shortfall (Operating)
            </p>
            <p className="mt-0.5 text-sm font-bold tabular-nums text-amber-950">{action.shortfallDisplay}</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`transfer-from-${action.id}`} className="text-[11px] font-semibold text-gray-700">
              Transfer from
            </label>
            <select
              id={`transfer-from-${action.id}`}
              value={sourceAccountId}
              onChange={(e) => setSourceAccountId(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            >
              {action.sourceAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.label} — {acc.balanceDisplay} available
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`transfer-amt-${action.id}`} className="text-[11px] font-semibold text-gray-700">
              Amount (USD)
            </label>
            <input
              id={`transfer-amt-${action.id}`}
              type="number"
              min={0}
              step={0.01}
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-xs tabular-nums text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
            <p className="text-[10px] text-gray-500">Defaults to the shortfall; change if you are moving a different amount.</p>
          </div>
          <Button
            type="button"
            size="sm"
            className="w-full text-xs font-medium leading-snug text-white sm:w-auto"
            style={{ backgroundColor: brandColor }}
            onClick={() => {
              const amt = amountInput.trim() === '' ? 0 : Number(amountInput);
              const amtLabel = Number.isFinite(amt) ? `$${amt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : amountInput;
              toast.message(
                `${action.primaryCta} — prototype: would move ${amtLabel} from ${selected?.label ?? 'selected account'} to Operating (payroll account).`,
              );
            }}
          >
            {action.primaryCta}
          </Button>
        </div>
      </div>
    </div>
  );
}

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
  /** When incremented (e.g. Finances widget "View suggestions"), switch to the Plan tab. */
  focusPlanTabNonce?: number;
  /** Content for Financial Health "View suggestions" — shown on Plan, not as chat. */
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

  React.useEffect(() => {
    setExpandedOptionId(null);
  }, [teammatePlan]);

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
              <div
                className={cn(
                  'rounded-xl border p-4',
                  teammatePlan.planSummaryVariant === 'payroll_shortfall'
                    ? 'border-rose-300 bg-white ring-1 ring-rose-200'
                    : 'border-gray-200 bg-gray-50/80',
                )}
              >
                {teammatePlan.planSummaryVariant === 'payroll_shortfall' &&
                teammatePlan.shortfallAmountDisplay ? (
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-rose-200/80 bg-rose-50/60 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-900/80">
                      Projected operating gap
                    </p>
                    <p className="text-lg font-semibold tabular-nums text-rose-700">
                      {teammatePlan.shortfallAmountDisplay}
                    </p>
                  </div>
                ) : null}
                <h3 className="text-sm font-semibold text-gray-900">{teammatePlan.title}</h3>
                {teammatePlan.context ? (
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">{teammatePlan.context}</p>
                ) : null}
                {teammatePlan.planSummaryVariant === 'payroll_shortfall' ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <TrustAssignCTA compact buttonClassName={TRUST_ASSIGN_COMPACT_TRIGGER_CLASS} />
                  </div>
                ) : null}
              </div>
              <div className="space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Suggested options
                </p>
                {teammatePlan.options.map((opt, optIndex) => {
                  const isOpen = expandedOptionId === opt.id;
                  const showRecommended = optIndex === 0;
                  return (
                    <div
                      key={opt.id}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedOptionId(isOpen ? null : opt.id)}
                        className="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50/90 motion-reduce:transition-none"
                        aria-expanded={isOpen}
                        aria-controls={`plan-option-steps-${opt.id}`}
                        id={`plan-option-trigger-${opt.id}`}
                      >
                        <div className="min-w-0 flex-1">
                          {showRecommended ? (
                            <span className="mb-1.5 inline-flex w-fit items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary ring-1 ring-primary/15">
                              Recommended
                            </span>
                          ) : null}
                          <h4 className="text-sm font-semibold text-gray-900">{opt.title}</h4>
                          {opt.summary ? (
                            <p className="mt-1 text-xs leading-relaxed text-gray-600">{opt.summary}</p>
                          ) : null}
                        </div>
                        <ChevronDown
                          className={cn(
                            'mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ease-out motion-reduce:transition-none',
                            isOpen ? 'rotate-180' : 'rotate-0',
                          )}
                          aria-hidden
                        />
                      </button>
                      {isOpen ? (
                        <div
                          id={`plan-option-steps-${opt.id}`}
                          role="region"
                          aria-labelledby={`plan-option-trigger-${opt.id}`}
                          className="border-t border-gray-100 px-3 pb-3 pt-2"
                        >
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                            Workflows
                          </p>
                          {opt.actions.some(isPlanWorkflowCardAction) ? (
                            <div className="space-y-3">
                              {opt.actions.map((action, idx) =>
                                isFhoWorkflowOperatingTransfer(action) ? (
                                  <PlanOperatingTransferCard
                                    key={action.id}
                                    action={action}
                                    brandColor={brandColor}
                                    stepIndex={idx}
                                  />
                                ) : isFhoWorkflowDualAction(action) ? (
                                  <div
                                    key={action.id}
                                    className="rounded-lg border border-gray-100 bg-gray-50/40 p-3 shadow-sm"
                                  >
                                    <div className="flex gap-3">
                                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200/90 text-[11px] font-bold text-gray-700">
                                        {idx + 1}
                                      </span>
                                      <div className="min-w-0 flex-1 space-y-2">
                                        <p className="text-sm font-semibold leading-snug text-gray-900">
                                          {action.title}
                                        </p>
                                        <p className="text-xs leading-relaxed text-gray-600">{action.description}</p>
                                        <div className="flex flex-wrap gap-2 pt-1">
                                          <Button
                                            type="button"
                                            size="sm"
                                            className="min-w-0 flex-1 text-xs font-medium leading-snug text-white sm:flex-initial"
                                            style={{ backgroundColor: brandColor }}
                                            onClick={() =>
                                              toast.message(
                                                `${action.aiCta} — prototype: Firm Intelligence would run this workflow on your behalf.`,
                                              )
                                            }
                                          >
                                            <span className="truncate">{action.aiCta}</span>
                                          </Button>
                                          {action.manualHref ? (
                                            <Button
                                              asChild
                                              variant="outline"
                                              size="sm"
                                              className="min-w-0 flex-1 border-gray-200 text-xs font-medium leading-snug text-gray-600 hover:bg-gray-50 sm:flex-initial"
                                            >
                                              <a
                                                href={action.manualHref}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                {action.manualCta}
                                              </a>
                                            </Button>
                                          ) : (
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              className="min-w-0 flex-1 border-gray-200 text-xs font-medium leading-snug text-gray-600 hover:bg-gray-50 sm:flex-initial"
                                              onClick={() =>
                                                toast.message(
                                                  `${action.manualCta} — prototype: opens the manual path in Manage / Billing.`,
                                                )
                                              }
                                            >
                                              {action.manualCta}
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div key={action.id} className="flex gap-2 text-sm">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                                      {idx + 1}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium leading-snug text-gray-900">{action.label}</p>
                                      {action.detail ? (
                                        <p className="mt-1 text-xs leading-relaxed text-gray-600">{action.detail}</p>
                                      ) : null}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <ol className="space-y-3">
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
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
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
                Use <span className="font-semibold text-gray-700">View suggestions</span> on a Financial Health widget to
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
