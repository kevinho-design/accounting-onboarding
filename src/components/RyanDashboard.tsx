import * as React from "react";
import {
  CheckCircle,
  Sparkles,
  TrendingUp,
  Target,
  ChevronRight,
  Info,
  AlertTriangle,
  ChevronDown,
  ShieldCheck,
  DollarSign,
  ClipboardList,
  UserCheck,
} from "lucide-react";
import { Button } from "./ui/button";
import { PulsatingCloudBackground } from "./PulsatingCloudBackground";
import { motion } from "motion/react";
import { AgentAction } from "./agents/AgentTypes";
import { TrustAssignCTA, TRUST_ASSIGN_COMPACT_TRIGGER_CLASS } from "./accounting/TrustAssign";
import type { FhoTeammatePlan } from "./finance-hub/data/fhoTeammateBreakdowns";
import { getPayrollShortfallTeammatePlan } from "./finance-hub/data/fhoTeammateBreakdowns";
import { firmGoalsOnTrackCount, useFirmGoalsState } from "./finance-hub/data/firmGoals";

interface RyanDashboardProps {
  onRecentActionsChange?: (actions: AgentAction[]) => void;
  onExceptionsChange?: (exceptions: unknown[]) => void;
  onAskTeammate?: (message: string) => void;
  onTeammateExplorePlan?: (plan: FhoTeammatePlan) => void;
  onOpenRail?: () => void;
  onNavigateToTransactions?: () => void;
  onNavigateToTransactionsFiltered?: (filter: string, month?: string) => void;
  onNavigateToConnections?: () => void;
  onNavigateToFinancialHealth?: (scrollTo?: string) => void;
}

type TodayItemKind = "approval" | "assigned";

interface TodayItem {
  id: string;
  kind: TodayItemKind;
  /** Critical financial health item (e.g. payroll shortfall) */
  priority?: "critical";
  title: string;
  description: string;
  impact?: string;
  meta?: string;
  assignedBy?: string;
}

const TODAY_ITEMS: TodayItem[] = [
  {
    id: "payroll-shortfall-critical",
    kind: "approval",
    priority: "critical",
    title: "Payroll Shortfall — Operating Account Gap",
    description:
      "Payroll is due in 3 days with a $15.7k operating cash gap — the highest-impact risk to firm financial health right now.",
    impact:
      "Posting payroll on time and protecting your operating reserve depend on closing this gap. Firm Intelligence ranked internal liquidity options first.",
    meta: "Critical",
  },
  {
    id: "ap1",
    kind: "approval",
    title: "3 payments pending your approval",
    description: "$21,800 total across 3 transactions exceeding the $5,000 approval threshold.",
    impact: "Posting is blocked until approved. Vendor payments are 2 days overdue.",
    meta: "$21,800",
  },
  {
    id: "ap2",
    kind: "approval",
    title: "Trust disbursement authorization required",
    description: "A $14,500 settlement distribution to Harrison v. Acme Corp requires managing partner sign-off.",
    impact: "Client is awaiting funds. Matter cannot close until disbursement is authorized.",
    meta: "$14,500",
  },
  {
    id: "ap3",
    kind: "approval",
    title: "Vendor contract renewal — Henderson & Associates",
    description: "Annual retainer renewal at $36,000/year is pending your approval before the March 31 deadline.",
    impact: "Contract lapses if not approved by end of month.",
    meta: "$36,000/yr",
  },
  {
    id: "as1",
    kind: "assigned",
    title: "Connect Financial Tools",
    description: "Jennifer assigned this step during onboarding. Admin credentials for ADP and Bank of America are needed to complete the connection.",
    assignedBy: "Jennifer Chen",
  },
  {
    id: "as2",
    kind: "assigned",
    title: "Workflow & Approvals",
    description: "Jennifer assigned this step during onboarding. Approval thresholds and signatory rules need to be confirmed by the managing partner.",
    assignedBy: "Jennifer Chen",
  },
];

const financialGoals = [
  {
    goal: "Quarterly Revenue Target",
    target: "$1.5M",
    current: "$987K",
    progress: 65.8,
    status: "on-track" as const,
    insight: "12 active matters suggest you'll exceed target by 8%",
    scrollTarget: "fho_w_k2",
  },
  {
    goal: "Operating Margin",
    target: "40%",
    current: "37%",
    progress: 92.5,
    status: "behind" as const,
    insight: "Reduce research expenses by $12K to hit target",
    scrollTarget: "fho_w_goals",
  },
  {
    goal: "Days Sales Outstanding (DSO)",
    target: "≤ 45 days",
    current: "52 days",
    progress: 86.5,
    status: "behind" as const,
    insight: "Speed up 3 high-risk collections to improve by 7 days",
    scrollTarget: "fho_w_k3",
  },
  {
    goal: "Cash Runway",
    target: "≥ 90 days",
    current: "74 days",
    progress: 82.2,
    status: "at-risk" as const,
    insight: "Convert unbilled time faster to add 12 days runway",
    scrollTarget: "fho_w_k4",
  },
];

export function RyanDashboard({
  onAskTeammate,
  onTeammateExplorePlan,
  onOpenRail,
  onNavigateToTransactionsFiltered,
  onNavigateToFinancialHealth,
}: RyanDashboardProps) {
  useFirmGoalsState();
  const goalCounts = firmGoalsOnTrackCount();
  const [goalsExpanded, setGoalsExpanded] = React.useState(true);
  const [expandedItemId, setExpandedItemId] = React.useState<string | null>(null);
  const [approvedIds, setApprovedIds] = React.useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = React.useState<Set<string>>(new Set());

  const visibleItems = TODAY_ITEMS.filter(
    (item) => !approvedIds.has(item.id) && !completedIds.has(item.id)
  );

  const approvalCount = visibleItems.filter((i) => i.kind === "approval").length;
  const assignedCount = visibleItems.filter((i) => i.kind === "assigned").length;
  const totalCount = visibleItems.length;

  return (
    <div className="flex-1 h-screen overflow-hidden relative">
      <PulsatingCloudBackground />

      <div className="h-full overflow-y-auto relative z-10">
        <div className="px-8 py-10 pb-24">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">Welcome back, Ryan</h1>
            <p className="text-muted-foreground text-sm">Managing Partner · Tuesday, March 18, 2026</p>
          </div>

          {/* Firm's Financial Goals */}
          <div className="bg-card rounded-xl border border-border shadow-sm mb-8">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-background transition-colors"
              onClick={() => setGoalsExpanded(!goalsExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Firm's Financial Goals</p>
                  <p className="text-xs text-muted-foreground">3 of 4 on track • 1 at risk</p>
                  <p className="text-sm font-semibold text-foreground">Q1 2026 Financial Goals</p>
                  <p className="text-xs text-muted-foreground">{goalCounts.onTrack} of {goalCounts.total} on track • {goalCounts.total - goalCounts.onTrack} at risk</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-border bg-white hover:bg-background text-xs"
                  onClick={(e) => { e.stopPropagation(); onNavigateToFinancialHealth?.("fho_w_goals"); }}
                >
                  Review Goals
                </Button>
                <ChevronDown className={`w-4 h-4 text-muted-foreground/60 transition-transform ${goalsExpanded ? "rotate-180" : ""}`} />
              </div>
            </div>
            {goalsExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-border/60 p-4 grid grid-cols-4 gap-3"
              >
                {financialGoals.map((goal, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-background rounded-xl cursor-pointer hover:shadow-md transition-all"
                    onClick={() => onNavigateToFinancialHealth?.(goal.scrollTarget)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-foreground/80">{goal.goal}</p>
                      <div className={`w-2 h-2 rounded-full ${goal.status === "on-track" ? "bg-green-500" : goal.status === "behind" ? "bg-yellow-500" : "bg-red-500"}`} />
                    </div>
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-xl font-bold text-foreground">{goal.current}</span>
                      <span className="text-xs text-muted-foreground">of {goal.target}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1 mb-2">
                      <div
                        className={`h-1 rounded-full ${goal.status === "on-track" ? "bg-green-500" : goal.status === "behind" ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{goal.insight}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-12 gap-8">

            {/* LEFT — Today */}
            <div className="col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Today</h2>
                <span className="text-xs text-muted-foreground/60 font-normal">
                  — {totalCount} item{totalCount !== 1 ? "s" : ""} need your input
                </span>
              </div>

              {visibleItems.length > 0 ? (
                <div className="space-y-2">
                  {visibleItems.map((item) => {
                    const isExpanded = expandedItemId === item.id;
                    const isApproval = item.kind === "approval";

                    return (
                      <div
                        key={item.id}
                        className={`bg-card rounded-xl border shadow-sm overflow-hidden ${
                          item.priority === "critical"
                            ? "border-rose-300 ring-1 ring-rose-200"
                            : "border-border"
                        }`}
                      >
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-background transition-colors cursor-pointer"
                          onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                        >
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${isApproval ? "from-blue-500 to-blue-600" : "from-purple-500 to-purple-600"} flex items-center justify-center flex-shrink-0`}>
                            {isApproval
                              ? <ShieldCheck className="w-3 h-3 text-white" />
                              : <ClipboardList className="w-3 h-3 text-white" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
                              {isApproval && item.meta && (
                                <span
                                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                    item.priority === "critical"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-blue-100 text-blue-700"
                                  }`}
                                >
                                  {item.meta}
                                </span>
                              )}
                              {!isApproval && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 flex-shrink-0">Assigned to you</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground/60 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        </button>

                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4 pt-1 border-t border-border/60"
                          >
                            {item.impact && (
                              <div className="flex items-start gap-1.5 p-2.5 bg-amber-50 rounded-lg text-xs text-amber-800 mb-3">
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{item.impact}</span>
                              </div>
                            )}
                            {item.assignedBy && (
                              <div className="flex items-center gap-1.5 p-2.5 bg-purple-50 rounded-lg text-xs text-purple-800 mb-3">
                                <UserCheck className="w-3 h-3 flex-shrink-0" />
                                <span>Assigned by <span className="font-semibold">{item.assignedBy}</span> during onboarding setup</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {isApproval ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90 text-white text-xs cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (item.id === "payroll-shortfall-critical") {
                                        onTeammateExplorePlan?.(getPayrollShortfallTeammatePlan());
                                      } else if (item.id === "ap1") {
                                        onNavigateToTransactionsFiltered?.("approval");
                                      } else {
                                        setApprovedIds((prev) => new Set([...prev, item.id]));
                                        setExpandedItemId(null);
                                      }
                                    }}
                                  >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {item.id === "payroll-shortfall-critical" ? "View suggestions" : "Approve"}
                                  </Button>
                                  <TrustAssignCTA compact buttonClassName={TRUST_ASSIGN_COMPACT_TRIGGER_CLASS} />
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  className="bg-primary hover:bg-primary/90 text-white text-xs cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCompletedIds((prev) => new Set([...prev, item.id]));
                                    setExpandedItemId(null);
                                  }}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Mark Complete
                                </Button>
                              )}
                              {onAskTeammate && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-border text-muted-foreground hover:bg-background text-xs cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onAskTeammate(`Help me with: "${item.title}"`);
                                  }}
                                >
                                  <Sparkles className="w-3 h-3 mr-1 text-primary/70" />
                                  Ask Teammate
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">You're all caught up!</p>
                  <p className="text-xs text-muted-foreground">No pending approvals or assigned tasks.</p>
                </div>
              )}
            </div>

            {/* RIGHT — Financial Health */}
            <div className="col-span-7">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">Financial Health</h2>
                </div>
                <button
                  onClick={() => onNavigateToFinancialHealth?.()}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  View full analysis
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* 2×2 metric cards */}
              <div className="grid grid-cols-2 gap-3 mb-4" style={{ gridAutoRows: "200px" }}>
                {/* Operating Cash */}
                <div className="p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 relative" onClick={() => onNavigateToFinancialHealth?.("fho_w_k1")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Healthy</span>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Operating Cash</p>
                    <p className="text-xs text-muted-foreground/60 mb-2">March 2026</p>
                    <p className="text-2xl font-bold text-foreground mb-1">$142,847</p>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 rounded text-xs font-medium text-emerald-700">
                      <TrendingUp className="w-3 h-3" />+8% MoM
                    </div>
                  </div>
                  <div className="flex-1 flex items-end min-w-0">
                    <svg className="w-full h-24" viewBox="0 0 200 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="ryanAreaGrad1" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#018B7D" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#018B7D" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                      <path d="M0,45 Q25,35 50,30 T100,25 Q125,20 150,15 T200,10 L200,60 L0,60 Z" fill="url(#ryanAreaGrad1)" />
                      <path d="M0,45 Q25,35 50,30 T100,25 Q125,20 150,15 T200,10" fill="none" stroke="#018B7D" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Revenue */}
                <div className="p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 relative" onClick={() => onNavigateToFinancialHealth?.("fho_w_k2")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">On Track</span>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Revenue</p>
                    <p className="text-xs text-muted-foreground/60 mb-2">March 2026 MTD</p>
                    <p className="text-2xl font-bold text-foreground mb-1">$284,500</p>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 rounded text-xs font-medium text-emerald-700">
                      <TrendingUp className="w-3 h-3" />+12% MoM
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end min-w-0">
                    <div className="flex items-end gap-0.5 h-24">
                      {[25,15,65,70,68,72,60,20,18,75,78,80,76,70,22,16,82].map((h, i) => (
                        <div key={i} className={`flex-1 rounded-t ${i === 16 ? "bg-primary" : h < 30 ? "bg-primary/20" : "bg-emerald-400"}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AR at Risk */}
                <div className="p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 relative" onClick={() => onNavigateToFinancialHealth?.("fho_w_k3")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">Behind Goal</span>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">AR at Risk</p>
                    <p className="text-xs text-muted-foreground/60 mb-2">60+ Days Overdue</p>
                    <p className="text-2xl font-bold text-foreground mb-1">$73,700</p>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 rounded text-xs font-medium text-orange-700">
                      <AlertTriangle className="w-3 h-3" />3 invoices
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end min-w-0">
                    <div className="flex items-end gap-1 h-24">
                      {[{h:45,c:"bg-emerald-300"},{h:60,c:"bg-emerald-200"},{h:35,c:"bg-primary/20"},{h:50,c:"bg-primary/30"},{h:75,c:"bg-primary"}].map((b,i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full">
                          <div className={`w-full rounded-t ${b.c}`} style={{ height: `${b.h}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {["Current","1-30","31-60","61-90","90+"].map((l,i) => (
                        <div key={i} className={`flex-1 text-center text-[9px] ${i === 4 ? "text-primary font-medium" : "text-muted-foreground/60"}`}>{l}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cash Runway */}
                <div className="p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 relative" onClick={() => onNavigateToFinancialHealth?.("fho_w_k4")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">Behind Goal</span>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Runway</p>
                    <p className="text-xs text-muted-foreground/60 mb-2">vs 90-day target</p>
                    <p className="text-2xl font-bold text-foreground mb-1">74 Days</p>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-100 rounded text-xs font-medium text-yellow-700">
                      <Info className="w-3 h-3" />-16 days from goal
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center min-w-0">
                    <div className="relative flex items-end justify-center h-full" style={{ aspectRatio: "110/62", maxWidth: "100%" }}>
                      {(() => {
                        const r = 42; const cx = 55; const cy = 56;
                        const halfCirc = Math.PI * r;
                        const pct = 0.82;
                        return (
                          <svg className="w-full" viewBox="0 0 110 62" fill="none" preserveAspectRatio="xMidYMax meet">
                            <path d={`M ${cx-r},${cy} A ${r},${r} 0 0,1 ${cx+r},${cy}`} stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" fill="none" />
                            <path d={`M ${cx-r},${cy} A ${r},${r} 0 0,1 ${cx+r},${cy}`} stroke="#0070E0" strokeWidth="8" strokeLinecap="round" fill="none"
                              strokeDasharray={`${halfCirc}`} strokeDashoffset={`${halfCirc * (1 - pct)}`} />
                          </svg>
                        );
                      })()}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xl font-bold text-foreground/80">82%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust + Unbilled */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer relative" onClick={() => onNavigateToFinancialHealth?.("fho_w_trust")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Compliant</span>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">IOLTA Trust</p>
                  <p className="text-xs text-muted-foreground/60 mb-3">March 2026</p>
                  <div className="flex items-baseline gap-3 mb-3">
                    <div>
                      <p className="text-xl font-bold text-foreground">$89,234.67</p>
                      <p className="text-xs text-muted-foreground">Bank Balance</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">$89,234.67</p>
                      <p className="text-xs text-muted-foreground">Client Ledgers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-background rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    <p className="text-xs text-foreground/80"><span className="font-medium">Three-way reconciled</span> • 2 min ago</p>
                  </div>
                </div>

                <div className="p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => onNavigateToFinancialHealth?.("fho_w_unbilled")}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-muted-foreground">Unbilled Time</p>
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">Opportunity</span>
                  </div>
                  <p className="text-xs text-muted-foreground/60 mb-2">90+ Days Aged</p>
                  <p className="text-2xl font-bold text-foreground mb-1">$52,500</p>
                  <p className="text-xs text-muted-foreground mb-3">40.4 hours • 8 matters</p>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">• Venture Partners M&A: $18.2K</p>
                    <p className="text-xs text-muted-foreground">• Tech Startup Inc: $12.4K</p>
                    <p className="text-xs text-muted-foreground">• Harbor LLC: $8.9K</p>
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
