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
} from "lucide-react";
import { Button } from "./ui/button";
import { PulsatingCloudBackground } from "./PulsatingCloudBackground";
import { motion } from "motion/react";
import type { AgentAction } from "./agents/AgentTypes";
import { TrustAssignCTA, TRUST_ASSIGN_COMPACT_TRIGGER_CLASS } from "./accounting/TrustAssign";
import type { FhoTeammatePlan } from "./finance-hub/data/fhoTeammateBreakdowns";
import { getPayrollShortfallTeammatePlan } from "./finance-hub/data/fhoTeammateBreakdowns";
import { firmGoalsOnTrackCount, useFirmGoalsState } from "./finance-hub/data/firmGoals";

interface RyanDashboardProps {
  onRecentActionsChange?: (actions: AgentAction[]) => void;
  onExceptionsChange?: (exceptions: unknown[]) => void;
  onAskTeammate?: (message: string) => void;
  onTeammateExplorePlan?: (plan: FhoTeammatePlan) => void;
  onNavigateToFinancialHealth?: (scrollTo?: string) => void;
}

const PAYROLL_SHORTFALL_CRITICAL = {
  id: "payroll-shortfall-critical",
  kind: "approval" as const,
  priority: "critical" as const,
  title: "Payroll Shortfall — Operating Account Gap",
  description:
    "Payroll is due in 3 days with a $15.7k operating cash gap — the highest-impact risk to firm financial health right now.",
  impact:
    "Posting payroll on time and protecting your operating reserve depend on closing this gap. Clio Accounting ranked collection opportunities as recommended.",
  meta: "Critical",
};

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
  onNavigateToFinancialHealth,
}: RyanDashboardProps) {
  useFirmGoalsState();
  const goalCounts = firmGoalsOnTrackCount();
  const [goalsExpanded, setGoalsExpanded] = React.useState(true);
  const [criticalExpanded, setCriticalExpanded] = React.useState(false);

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

          {/* Financial Health — full width */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-foreground">Financial Health</h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToFinancialHealth?.()}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                View full analysis
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mb-4 bg-card rounded-xl border border-rose-300 ring-1 ring-rose-200 shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-background transition-colors cursor-pointer"
                  onClick={() => setCriticalExpanded((e) => !e)}
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-red-600">
                    <AlertTriangle className="h-3 w-3 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground leading-snug">{PAYROLL_SHORTFALL_CRITICAL.title}</p>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 bg-rose-100 text-rose-800">
                        {PAYROLL_SHORTFALL_CRITICAL.meta}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{PAYROLL_SHORTFALL_CRITICAL.description}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground/60 flex-shrink-0 transition-transform ${criticalExpanded ? "rotate-180" : ""}`} />
                </button>

                {criticalExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 pt-1 border-t border-border/60"
                  >
                    <div className="flex items-start gap-1.5 p-2.5 bg-amber-50 rounded-lg text-xs text-amber-800 mb-3">
                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{PAYROLL_SHORTFALL_CRITICAL.impact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white text-xs cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTeammateExplorePlan?.(getPayrollShortfallTeammatePlan());
                        }}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        View suggestions
                      </Button>
                      <TrustAssignCTA compact buttonClassName={TRUST_ASSIGN_COMPACT_TRIGGER_CLASS} />
                      {onAskTeammate && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border text-muted-foreground hover:bg-background text-xs cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAskTeammate(`Help me with: "${PAYROLL_SHORTFALL_CRITICAL.title}"`);
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
  );
}
