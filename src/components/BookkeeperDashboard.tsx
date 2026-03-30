import * as React from "react";
import {
  CheckCircle,
  CircleAlert,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Receipt,
} from "lucide-react";
import { PulsatingCloudBackground } from "./PulsatingCloudBackground";
import { Exception, AgentAction } from "./agents/AgentTypes";
import { AI_PROCESSED, INITIAL_FLAGGED_COUNT } from "./accounting/UnifiedTransactionInbox";

interface BookkeeperDashboardProps {
  onExceptionsChange?: (exceptions: Exception[]) => void;
  onRecentActionsChange?: (actions: AgentAction[]) => void;
  onNavigateToTransactions?: () => void;
  onNavigateToTransactionsFiltered?: (filter: string, month?: string) => void;
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

// ─── Component ───────────────────────────────────────────────────────────────

export function BookkeeperDashboard({
  onExceptionsChange,
  onRecentActionsChange,
  onNavigateToTransactions,
  onNavigateToTransactionsFiltered,
}: BookkeeperDashboardProps) {
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
              <h1 className="text-2xl font-semibold text-foreground">Good morning, Sarah</h1>
              <span className="px-2.5 py-0.5 bg-accent text-primary text-xs font-semibold rounded-full">
                Bookkeeper · Hartwell &amp; Morris
              </span>
            </div>
            <p className="text-muted-foreground text-sm">Tuesday, March 18, 2026</p>
          </div>

          {/* Transactions — full width */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-sm">
                <Receipt className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-base font-semibold text-foreground">Transactions</h2>
            </div>

            {/* Reconciliation status card */}
            {(() => {
              const trustAtRisk = 2;
              const ioltaMatters = 12;
              const pct = Math.round(((AI_PROCESSED - INITIAL_FLAGGED_COUNT) / AI_PROCESSED) * 100);
              const isReady = INITIAL_FLAGGED_COUNT === 0;
              return (
                <div className="mt-3 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/60 mb-0.5">March 2026</p>
                        <p className="text-sm font-semibold text-foreground">Reconciliation Status</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {isReady ? (
                          <button
                            type="button"
                            onClick={() => onNavigateToTransactionsFiltered?.("all")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all hover:opacity-90 shadow-sm"
                            style={{ background: "linear-gradient(135deg, #16A34A, #15803D)", color: "#FFFFFF", fontWeight: 600 }}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Close March
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onNavigateToTransactionsFiltered?.("missing_info")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all hover:opacity-90"
                            style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A", color: "#B45309", fontWeight: 600 }}
                          >
                            Review flagged
                          </button>
                        )}
                        <div className="text-right">
                          <p className="text-2xl font-bold leading-none" style={{ color: isReady ? "#16A34A" : "#17181C" }}>{pct}%</p>
                          <p className="text-[10px] text-muted-foreground/60 mt-0.5">readiness</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#10B981" }} />
                        <span className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">{AI_PROCESSED.toLocaleString()}</span> auto-processed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: INITIAL_FLAGGED_COUNT > 0 ? "#F59E0B" : "#10B981" }} />
                        <span className="text-[11px] text-muted-foreground"><span className="font-semibold text-foreground">{INITIAL_FLAGGED_COUNT}</span> need review</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trustAtRisk > 0 ? "#EF4444" : "#14B8A6" }} />
                        <span className="text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground">{trustAtRisk > 0 ? `${trustAtRisk} at risk` : `${ioltaMatters} compliant`}</span> IOLTA
                        </span>
                      </div>
                    </div>
                    {pct < 86 && (
                      <button
                        type="button"
                        onClick={() => onNavigateToTransactionsFiltered?.("missing_info")}
                        className="flex items-center gap-1 hover:underline"
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      >
                        <CircleAlert className="w-3 h-3 flex-shrink-0 text-amber-500" />
                        <span className="text-[11px] font-semibold text-amber-600">Not close-ready</span>
                      </button>
                    )}
                  </div>
                  <div className="h-1.5 w-full bg-muted">
                    <div className="h-1.5 bg-emerald-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })()}

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl border border-border shadow-sm px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">Bank Feed</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-foreground">Live · 2 min ago</span>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border shadow-sm px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">Auto-coded today</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-foreground">89 transactions</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Recent transactions
              </h3>

              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 px-4 py-2.5 border-b border-border/60 bg-background">
                  <span className="col-span-2 text-xs font-medium text-muted-foreground">Date</span>
                  <span className="col-span-4 text-xs font-medium text-muted-foreground">Vendor / Description</span>
                  <span className="col-span-3 text-xs font-medium text-muted-foreground text-right">Amount</span>
                  <span className="col-span-3 text-xs font-medium text-muted-foreground text-right">Account</span>
                </div>

                <div className="divide-y divide-gray-50">
                  {RECENT_TRANSACTIONS.map((tx, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-12 items-center px-4 py-3 hover:bg-background transition-colors cursor-pointer ${tx.flagged ? 'bg-amber-50/40' : ''}`}
                    >
                      <span className="col-span-2 text-xs text-muted-foreground">{tx.date}</span>
                      <div className="col-span-4 flex items-center gap-2 min-w-0">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          tx.type === 'credit' ? 'bg-emerald-100' : 'bg-muted'
                        }`}>
                          {tx.type === 'credit'
                            ? <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                            : <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                          }
                        </div>
                        <span className="text-xs text-foreground font-medium truncate">{tx.vendor}</span>
                        {tx.flagged && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" title="Flagged" />
                        )}
                      </div>
                      <span className={`col-span-3 text-xs font-medium text-right tabular-nums ${
                        tx.type === 'credit' ? 'text-emerald-700' : 'text-foreground'
                      }`}>
                        {tx.type === 'credit' ? '+' : ''}
                        {tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                      <span className="col-span-3 text-xs text-muted-foreground/60 text-right truncate">{tx.account}</span>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 border-t border-border/60 bg-background flex items-center justify-between">
                  <span className="text-xs text-muted-foreground/60">Showing last 10 of 141 transactions this month</span>
                  <button
                    type="button"
                    onClick={() => onNavigateToTransactions?.()}
                    className="text-xs text-primary hover:text-primary font-medium flex items-center gap-1"
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
  );
}
