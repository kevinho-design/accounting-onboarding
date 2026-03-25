import * as React from "react";
import {
  CheckCircle,
  CircleAlert,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Info,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
  WifiOff,
  AlertTriangle,
  Shield,
  GitMerge,
  TrendingUp,
  DollarSign,
  BarChart3,
  Waves,
  ShieldCheck,
} from "lucide-react";
import { PulsatingCloudBackground } from "./PulsatingCloudBackground";
import { motion } from "motion/react";
import { Exception, AgentAction, AGENTS } from "./agents/AgentTypes";
import { Button } from "./ui/button";
import { TrustAssignCTA } from "./accounting/TrustAssign";
import { AI_PROCESSED, INITIAL_FLAGGED_COUNT } from "./accounting/UnifiedTransactionInbox";

interface BookkeeperDashboardProps {
  onAskTeammate?: (message: string) => void;
  onOpenRail?: () => void;
  onExceptionsChange?: (exceptions: Exception[]) => void;
  onRecentActionsChange?: (actions: AgentAction[]) => void;
  onNavigateToTransactions?: () => void;
  onNavigateToTransactionsFiltered?: (filter: string, month?: string) => void;
  onNavigateToConnections?: () => void;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const SARAH_EXCEPTIONS: Exception[] = [
  {
    id: "sys-bank-disconnect",
    agentId: "matching",
    severity: "high",
    title: "Chase ··4892 connection expires in 5 days",
    description: "Re-authenticate now to avoid interruption to your bank feed.",
    impact: "If the connection expires, new transactions will stop syncing automatically.",
    suggestedAction: "Re-authenticate",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  },
  {
    id: "sys-trust-balance",
    agentId: "trust-compliance",
    severity: "critical",
    title: "Jane Doe's trust will drop below the $1,000 floor",
    description: "A $1,250 filing fee will leave only $592 in the account.",
    impact: "Trust balance will fall to $592 — $408 below the required $1,000 floor for this matter.",
    suggestedAction: "Assign request",
    createdAt: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: "sys-feb-recon-blocker",
    agentId: "matching",
    severity: "high",
    title: "February operating account not fully reconciled",
    description: "Check #847 to Henderson & Associates ($2,858.19) cleared Feb 14 but was never recorded. 311 of 312 transactions matched automatically.",
    impact: "Trust account reconciled. Operating cannot close until this cleared cheque is recorded as an expense.",
    suggestedAction: "Review blocker",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: "sys-pending-approvals",
    agentId: "matching",
    severity: "high",
    title: "3 payments pending partner approval",
    description: "$21,800 total across 3 transactions exceeding the $5,000 threshold. Approve to unblock posting.",
    suggestedAction: "Review approvals",
    createdAt: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: "s1", agentId: "matching", severity: "high",
    title: "2 duplicate ACH transactions held",
    description: "$6,800 total on Mar 15 — same vendor, same amount, 4 hours apart",
    impact: "Will double-post to Operating Account if not resolved before close",
    suggestedAction: "Review duplicates",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "s2", agentId: "matching", severity: "high",
    title: "14 Brex transactions blocking reconciliation",
    description: "AI confidence below 95% — March close cannot complete until resolved",
    impact: "March reconciliation stuck at 78% until these are categorized",
    suggestedAction: "Review transactions",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: "s3", agentId: "trust-compliance", severity: "medium",
    title: "$12,000 transfer needs client matter attached",
    description: "Large inbound transfer flagged — no client matter linked before trust posting",
    impact: "Cannot post to IOLTA without a verified matter association",
    suggestedAction: "Assign client matter",
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
  },
  {
    id: "s4", agentId: "matching", severity: "medium",
    title: "3 expense reports pending your approval",
    description: "$4,380 total submitted by staff Mar 14–17 — pending before they can post",
    impact: "Staff reimbursements are blocked until approved; two are over 5 days old",
    suggestedAction: "Review expenses",
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
  },
  {
    id: "s5", agentId: "matching", severity: "high",
    title: "Bank of America feed gap on Mar 16",
    description: "6-hour sync outage detected — up to 4 transactions may be missing from the ledger",
    impact: "March reconciliation may be understated; gap must be reconciled before month-end close",
    suggestedAction: "Review gap",
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
  },
];

export const SARAH_AGENT_ACTIONS: AgentAction[] = [
  {
    id: "sa1", agentId: "matching",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    action: "Auto-coded 89 transactions to existing GL accounts",
    reasoning: "Vendor names and amounts matched prior transactions with 97%+ confidence. All mapped to accounts 6100–6400.",
    isEditable: true, isReversible: true,
  },
  {
    id: "sa2", agentId: "trust-compliance",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    action: "IOLTA three-way reconciliation passed for City National",
    reasoning: "Bank balance ($89,234.67) matches sum of all client ledgers exactly. Delaware bar compliance verified.",
    isEditable: false, isReversible: false,
  },
  {
    id: "sa3", agentId: "matching",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    action: "Detected and held 2 duplicate ACH debits",
    reasoning: "Two identical ACH debits of $3,400 from same vendor within 4 hours. Held pending your review to prevent double-posting.",
    isEditable: false, isReversible: true,
  },
];

const EXCEPTION_ASK_PROMPTS: Record<string, string> = {
  s1: "Walk me through the 2 duplicate ACH transactions held on Mar 15 — what should I look for before dismissing one?",
  s2: "Help me categorize the 14 Brex transactions blocking March reconciliation. What's the fastest way to resolve these?",
  s3: "A $12,000 inbound transfer needs a client matter before it can post to IOLTA. How do I find and assign the right matter?",
  s4: "I have 3 expense reports totalling $4,380 pending approval. Can you summarize what each one is for?",
  s5: "There's a 6-hour Bank of America feed gap on Mar 16. How do I identify which transactions are missing and add them?",
};

const RECENT_TRANSACTIONS = [
  { date: "Mar 17", vendor: "Westfield & Partners", amount: -3400.00, account: "6200 · Operating Exp", type: "debit" as const },
  { date: "Mar 17", vendor: "Chen & Associates", amount: 18400.00, account: "1100 · AR", type: "credit" as const },
  { date: "Mar 16", vendor: "Brex Corporate Card", amount: -1240.50, account: "6400 · Uncategorized", type: "debit" as const, flagged: true },
  { date: "Mar 16", vendor: "IOLTA Retainer — Case #4421", amount: 12000.00, account: "2000 · Trust", type: "credit" as const, flagged: true },
  { date: "Mar 15", vendor: "Westfield & Partners (DUP)", amount: -3400.00, account: "6200 · Held", type: "debit" as const, flagged: true },
  { date: "Mar 15", vendor: "Payroll — March 15", amount: -28750.00, account: "6100 · Payroll", type: "debit" as const },
  { date: "Mar 14", vendor: "Harbor LLC", amount: 8900.00, account: "1100 · AR", type: "credit" as const },
  { date: "Mar 14", vendor: "Adobe Creative Cloud", amount: -149.99, account: "6300 · Software", type: "debit" as const },
  { date: "Mar 13", vendor: "Tech Startup Inc.", amount: 12400.00, account: "1100 · AR", type: "credit" as const },
  { date: "Mar 13", vendor: "Comcast Business", amount: -215.00, account: "6300 · Utilities", type: "debit" as const },
];

const severityColors: Record<string, string> = {
  critical: "from-red-500 to-red-600",
  high: "from-orange-500 to-orange-600",
  medium: "from-yellow-500 to-yellow-600",
  low: "from-blue-500 to-blue-600",
};

// ─── Component ───────────────────────────────────────────────────────────────

export function BookkeeperDashboard({ onAskTeammate, onOpenRail, onExceptionsChange, onRecentActionsChange, onNavigateToTransactions, onNavigateToTransactionsFiltered, onNavigateToConnections }: BookkeeperDashboardProps) {
  const [expandedExceptionId, setExpandedExceptionId] = React.useState<string | null>(null);
  const [resolved, setResolved] = React.useState<Set<string>>(new Set());

  React.useEffect(() => { onExceptionsChange?.(SARAH_EXCEPTIONS); }, [onExceptionsChange, SARAH_EXCEPTIONS]);
  React.useEffect(() => { onRecentActionsChange?.(SARAH_AGENT_ACTIONS); }, [onRecentActionsChange]);

  return (
    <div className="flex-1 h-screen overflow-hidden relative">
      <PulsatingCloudBackground />

      <div className="h-full overflow-y-auto relative z-10">
        <div className="px-8 py-10 pb-24">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-gray-900">Good morning, Sarah</h1>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                Bookkeeper · Hartwell &amp; Morris
              </span>
            </div>
            <p className="text-gray-500 text-sm">Tuesday, March 18, 2026</p>
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-12 gap-8">

            {/* LEFT COLUMN — System of Action */}
            <div className="col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Today</h2>
                <span className="text-xs text-gray-400 font-normal">— {SARAH_EXCEPTIONS.length} items need your input</span>
              </div>

              <div className="space-y-2">
                {SARAH_EXCEPTIONS.slice(0, 5).map((exc) => {
                  const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
                    "trust-compliance": Shield,
                    "matching": GitMerge,
                    "revenue-forecasting": TrendingUp,
                    "matter-profitability": BarChart3,
                    "collections": DollarSign,
                    "cash-flow": Waves,
                  };
                  const ICON_OVERRIDES: Record<string, React.ComponentType<{ className?: string }>> = {
                    "sys-bank-disconnect": AlertTriangle,
                    "sys-trust-balance": AlertTriangle,
                    "sys-feb-recon-blocker": AlertTriangle,
                    "sys-pending-approvals": ShieldCheck,
                  };
                  const COLOR_OVERRIDES: Record<string, string> = {
                    "sys-bank-disconnect": "from-amber-500 to-orange-500",
                    "sys-feb-recon-blocker": "from-amber-500 to-orange-500",
                    "sys-pending-approvals": "from-blue-500 to-blue-600",
                    "sys-trust-balance": "from-amber-500 to-orange-500",
                  };
                  const AgentIcon = ICON_OVERRIDES[exc.id] ?? AGENT_ICONS[exc.agentId] ?? Sparkles;
                  const agentColor = COLOR_OVERRIDES[exc.id] ?? AGENTS[exc.agentId]?.color ?? "from-blue-500 to-blue-600";
                  const isExpanded = expandedExceptionId === exc.id;
                  const isResolved = resolved.has(exc.id);
                  const askPrompt = EXCEPTION_ASK_PROMPTS[exc.id];

                  return (
                    <div
                      key={exc.id}
                      className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${isResolved ? "opacity-60" : ""}`}
                    >
                      <button
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setExpandedExceptionId(isExpanded ? null : exc.id)}
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${agentColor} flex items-center justify-center flex-shrink-0`}>
                          {isResolved
                            ? <CheckCircle className="w-3 h-3 text-white" />
                            : <AgentIcon className="w-3 h-3 text-white" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 leading-snug">{exc.title}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{exc.description}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4 pt-1 border-t border-gray-100"
                        >
                          {exc.impact && (
                            <div className="flex items-start gap-1.5 p-2.5 bg-amber-50 rounded-lg text-xs text-amber-800 mb-3">
                              <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{exc.impact}</span>
                            </div>
                          )}
                          {isResolved ? (
                            <div className="flex items-center gap-2 text-green-700 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              <span className="font-medium">Resolved</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {exc.id === "sys-trust-balance" ? (
                                <TrustAssignCTA compact />
                              ) : (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (exc.id === "sys-bank-disconnect") {
                                    onNavigateToConnections?.();
                                  } else if (exc.id === "sys-feb-recon-blocker") {
                                    onNavigateToTransactionsFiltered?.("missing_info", "feb");
                                  } else if (exc.id === "sys-pending-approvals") {
                                    onNavigateToTransactionsFiltered?.("approval");
                                  } else {
                                    onNavigateToTransactionsFiltered?.("all");
                                  }
                                }}
                              >
                                {exc.suggestedAction}
                                <ChevronRight className="w-3 h-3 ml-1" />
                              </Button>
                              )}
                              {onAskTeammate && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-300 text-gray-600 hover:bg-gray-50 text-xs cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAskTeammate(askPrompt);
                                  }}
                                >
                                  <Sparkles className="w-3 h-3 mr-1 text-blue-500" />
                                  Ask Teammate
                                </Button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>
                  );
                })}

                {SARAH_EXCEPTIONS.length > 3 && onOpenRail && (
                  <button
                    onClick={onOpenRail}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    See all {SARAH_EXCEPTIONS.length} items in Today
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Handled for you */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Handled for you</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>3 agents active</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {SARAH_AGENT_ACTIONS.map((action) => {
                    const timeDiff = Date.now() - action.timestamp.getTime();
                    const mins = Math.floor(timeDiff / 60000);
                    const timeLabel = mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`;
                    return (
                      <div key={action.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-800 leading-snug">{action.action}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{timeLabel}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — System of Record */}
            <div className="col-span-7">
              {/* Reconciliation status card */}
              {(() => {
                const trustAtRisk = 2;
                const ioltaMatters = 12;
                const pct = Math.round(((AI_PROCESSED - INITIAL_FLAGGED_COUNT) / AI_PROCESSED) * 100);
                const isReady = INITIAL_FLAGGED_COUNT === 0;
                return (
                  <div className="mt-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4">
                      {/* Top row: heading | CTA + large % */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">March 2026</p>
                          <p className="text-sm font-bold text-gray-900">Reconciliation Status</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {isReady ? (
                            <button
                              onClick={() => onNavigateToTransactionsFiltered?.("all")}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all hover:opacity-90 shadow-sm"
                              style={{ background: "linear-gradient(135deg, #16A34A, #15803D)", color: "#FFFFFF", fontWeight: 600 }}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Close March
                            </button>
                          ) : (
                            <button
                              onClick={() => onNavigateToTransactionsFiltered?.("missing_info")}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all hover:opacity-90"
                              style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#B45309", fontWeight: 600 }}
                            >
                              Review flagged
                            </button>
                          )}
                          <div className="text-right">
                            <p className="text-2xl font-bold leading-none" style={{ color: isReady ? "#16A34A" : "#0F172A" }}>{pct}%</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">readiness</p>
                          </div>
                        </div>
                      </div>
                      {/* Stat row */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#10B981" }} />
                          <span className="text-[11px] text-gray-600"><span className="font-semibold text-gray-900">{AI_PROCESSED.toLocaleString()}</span> auto-processed</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: INITIAL_FLAGGED_COUNT > 0 ? "#F59E0B" : "#10B981" }} />
                          <span className="text-[11px] text-gray-600"><span className="font-semibold text-gray-900">{INITIAL_FLAGGED_COUNT}</span> need review</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trustAtRisk > 0 ? "#EF4444" : "#14B8A6" }} />
                          <span className="text-[11px] text-gray-600">
                            <span className="font-semibold text-gray-900">{trustAtRisk > 0 ? `${trustAtRisk} at risk` : `${ioltaMatters} compliant`}</span> IOLTA
                          </span>
                        </div>
                      </div>
                      {/* Not close-ready — only when pct < 86 */}
                      {pct < 86 && (
                        <button
                          onClick={() => onNavigateToTransactionsFiltered?.("missing_info")}
                          className="flex items-center gap-1 hover:underline"
                          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                        >
                          <CircleAlert className="w-3 h-3 flex-shrink-0 text-amber-500" />
                          <span className="text-[11px] font-semibold text-amber-600">Not close-ready</span>
                        </button>
                      )}
                    </div>
                    {/* Progress bar pinned to bottom */}
                    <div className="h-1.5 w-full bg-gray-100">
                      <div className="h-1.5 bg-emerald-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })()}

              {/* Bank feed status */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Bank Feed</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-gray-800">Live · 2 min ago</span>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                  <p className="text-xs text-gray-500 mb-1">Auto-coded today</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-gray-800">89 transactions</span>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-sm">
                    <Receipt className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">Recent Transactions</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="grid grid-cols-12 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                    <span className="col-span-2 text-xs font-medium text-gray-500">Date</span>
                    <span className="col-span-4 text-xs font-medium text-gray-500">Vendor / Description</span>
                    <span className="col-span-3 text-xs font-medium text-gray-500 text-right">Amount</span>
                    <span className="col-span-3 text-xs font-medium text-gray-500 text-right">Account</span>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {RECENT_TRANSACTIONS.map((tx, i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-12 items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${tx.flagged ? 'bg-amber-50/40' : ''}`}
                      >
                        <span className="col-span-2 text-xs text-gray-500">{tx.date}</span>
                        <div className="col-span-4 flex items-center gap-2 min-w-0">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            tx.type === 'credit' ? 'bg-emerald-100' : 'bg-gray-100'
                          }`}>
                            {tx.type === 'credit'
                              ? <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                              : <ArrowUpRight className="w-3 h-3 text-gray-500" />
                            }
                          </div>
                          <span className="text-xs text-gray-800 font-medium truncate">{tx.vendor}</span>
                          {tx.flagged && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" title="Flagged" />
                          )}
                        </div>
                        <span className={`col-span-3 text-xs font-medium text-right tabular-nums ${
                          tx.type === 'credit' ? 'text-emerald-700' : 'text-gray-800'
                        }`}>
                          {tx.type === 'credit' ? '+' : ''}
                          {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                        </span>
                        <span className="col-span-3 text-xs text-gray-400 text-right truncate">{tx.account}</span>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Showing last 10 of 141 transactions this month</span>
                    <button
                      onClick={() => onNavigateToTransactions?.()}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      View all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
