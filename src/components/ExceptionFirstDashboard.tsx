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
  WifiOff,
  Shield,
  GitMerge,
  DollarSign,
  BarChart3,
  Waves,
} from "lucide-react";
import { Button } from "./ui/button";
import { PulsatingCloudBackground } from "./PulsatingCloudBackground";
import { AGENTS, Exception, AgentAction } from "./agents/AgentTypes";
import { DrillDownPanel } from "./DrillDownPanel";
import { MigrationReportModal } from "./MigrationReportModal";
import { FinancialGoalsViewModal } from "./FinancialGoalsViewModal";
import { motion } from "motion/react";
import { TrustAssignCTA } from "./accounting/TrustAssign";

export const JENNIFER_EXCEPTIONS: Exception[] = [
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
    description: "We downloaded your bank statement and matched 311 of 312 transactions. 1 unmatched $2,858.19 charge needs your review.",
    impact: "Trust account reconciled successfully. Operating cannot close until this is resolved.",
    suggestedAction: "Review blocker",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: "m1",
    agentId: "trust-compliance",
    severity: "high",
    title: "8 possible duplicate vendors to merge",
    description: "We found vendor records that may be the same entity under different names — likely created separately in QuickBooks over time.",
    impact: "Duplicate vendors cause split payment history and inflate your vendor count. Merging takes about 2 minutes.",
    suggestedAction: "Review & merge vendors",
    createdAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: "m2",
    agentId: "matching",
    severity: "medium",
    title: "4 transactions need a category",
    description: "These couldn't be auto-matched with high confidence during import. One quick confirmation each.",
    impact: "Uncategorized transactions will be excluded from financial reports until assigned.",
    suggestedAction: "Categorize transactions",
    createdAt: new Date(Date.now() - 8 * 60 * 1000)
  },
  {
    id: "m3",
    agentId: "trust-compliance",
    severity: "high",
    title: "2 IOLTA trust items flagged",
    description: "Two transactions flagged against Delaware state bar rules — both are retainer deposits that need client matter assignment.",
    impact: "Potential compliance issue if not resolved. Suggested fixes are pre-drafted and ready to apply.",
    suggestedAction: "Apply pre-drafted fixes",
    createdAt: new Date(Date.now() - 6 * 60 * 1000)
  },
  {
    id: "o1",
    agentId: "collections",
    severity: "high",
    title: "3 high-risk invoices overdue 12+ days",
    description: "$73,700 revenue at risk across Acme Corp, Tech Solutions, and Global Industries.",
    impact: "Could delay cash runway by 7 days if not collected this week.",
    suggestedAction: "Send payment reminders",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: "o2",
    agentId: "matching",
    severity: "medium",
    title: "Bank reconciliation has unmatched transactions",
    description: "Several recent transactions couldn't be matched to GL accounts with high confidence.",
    impact: "March reconciliation will remain incomplete until these are resolved.",
    suggestedAction: "Review unmatched items",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    id: "o3",
    agentId: "revenue-forecasting",
    severity: "medium",
    title: "Cash runway below 90-day target",
    description: "74 days current vs 90-day goal set during onboarding.",
    impact: "$52.5K in aged unbilled time could extend runway by 12 days if invoiced this week.",
    suggestedAction: "Convert unbilled time to invoices",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

interface ExceptionFirstDashboardProps {
  onReviewFinancialGoals?: () => void;
  onRecentActionsChange?: (actions: AgentAction[]) => void;
  onExceptionsChange?: (exceptions: Exception[]) => void;
  onAskTeammate?: (message: string) => void;
  onOpenRail?: () => void;
  onNavigateToTransactions?: () => void;
  onNavigateToTransactionsFiltered?: (filter: "all" | "critical" | "high" | "medium" | "processed", month?: string) => void;
  onNavigateToConnections?: () => void;
}

export function ExceptionFirstDashboard({ onReviewFinancialGoals, onRecentActionsChange, onExceptionsChange, onAskTeammate, onOpenRail, onNavigateToTransactions, onNavigateToTransactionsFiltered, onNavigateToConnections }: ExceptionFirstDashboardProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);
  const [showMigrationBanner, setShowMigrationBanner] = React.useState(true);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showGoalsModal, setShowGoalsModal] = React.useState(false);
  const [goalsExpanded, setGoalsExpanded] = React.useState(false);
  const [expandedExceptionId, setExpandedExceptionId] = React.useState<string | null>(null);

  // Migration stats
  const migrationStats = [
    { label: "Transactions Mapped", value: "34,279 of 34,520", percentage: "99.3%", status: "success" as const },
    { label: "Accounts Configured", value: "49 of 52", percentage: "94.2%", status: "success" as const },
    { label: "Vendors Enriched", value: "127", percentage: "100%", status: "success" as const },
    { label: "Items Requiring Review", value: "14", percentage: "", status: "warning" as const },
  ];

  // Financial goals data
  const financialGoals = [
    { 
      goal: "Quarterly Revenue Target", 
      target: "$1.5M", 
      current: "$987K", 
      progress: 65.8,
      status: "on-track" as const,
      insight: "12 active matters suggest you'll exceed target by 8%"
    },
    { 
      goal: "Operating Margin", 
      target: "40%", 
      current: "37%", 
      progress: 92.5,
      status: "behind" as const,
      insight: "Reduce research expenses by $12K to hit target"
    },
    { 
      goal: "Days Sales Outstanding (DSO)", 
      target: "≤ 45 days", 
      current: "52 days", 
      progress: 86.5,
      status: "behind" as const,
      insight: "Speed up 3 high-risk collections to improve by 7 days"
    },
    { 
      goal: "Cash Runway", 
      target: "≥ 90 days", 
      current: "74 days", 
      progress: 82.2,
      status: "at-risk" as const,
      insight: "Convert unbilled time faster to add 12 days runway"
    }
  ];

  // Migration items surface first, followed by ongoing operational exceptions
  const exceptions = JENNIFER_EXCEPTIONS;

  // Mock recent agent actions
  const recentActions: AgentAction[] = [
    {
      id: "1",
      agentId: "matching",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      action: "Auto-matched 127 transactions to 'Office Supplies'",
      reasoning: "Vendor name 'Staples' appears in 47 previous transactions to account 6100 (Office Supplies). Transaction amount ($234.56) falls within typical range ($50-$500). Confidence: 98.4%",
      isEditable: true,
      isReversible: true
    },
    {
      id: "2",
      agentId: "trust-compliance",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      action: "Verified three-way reconciliation for TD Bank IOLTA",
      reasoning: "Bank balance ($89,234.67) matches sum of client ledgers exactly. All trust transactions posted to correct client matters. Massachusetts bar compliance verified.",
      isEditable: false,
      isReversible: false
    },
    {
      id: "3",
      agentId: "revenue-forecasting",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      action: "Updated cash runway forecast to 74 days",
      reasoning: "Based on current burn rate ($1,930/day), AR aging (52 days DSO), and pipeline conversion (67% historical rate). Factored in your 90-day runway goal.",
      isEditable: false,
      isReversible: false
    }
  ];

  // Pass recent actions to AI rail via callback
  React.useEffect(() => {
    if (onRecentActionsChange) {
      onRecentActionsChange(recentActions);
    }
  }, [onRecentActionsChange]);

  // Pass exceptions to AI rail via callback
  React.useEffect(() => {
    if (onExceptionsChange) {
      onExceptionsChange(exceptions);
    }
  }, [onExceptionsChange, exceptions]);

  // Check if we have any exceptions
  const hasExceptions = exceptions.length > 0;
  const criticalCount = exceptions.filter(e => e.severity === "critical").length;
  const highCount = exceptions.filter(e => e.severity === "high").length;
  const mediumCount = exceptions.filter(e => e.severity === "medium").length;
  const totalAttentionCount = criticalCount + highCount + mediumCount;

  return (
    <div className="flex-1 h-screen overflow-hidden relative">
      <PulsatingCloudBackground />
      
      <div className="h-full overflow-y-auto relative z-10">
        <div className="px-8 py-10">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back, Jennifer</h1>
            <p className="text-gray-500 text-sm">Tuesday, March 18, 2026</p>
          </div>

          {/* Migration Success Banner - full width, dismissible */}
          {showMigrationBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">Migration Complete</h2>
                    <p className="text-sm text-gray-500">Your financial team started monitoring immediately. During migration, they found items that need your review.</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setShowMigrationBanner(false)}
                  className="border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-sm flex-shrink-0"
                >
                  Dismiss
                </Button>
              </div>

              {/* Migration Stats */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                {migrationStats.map((stat) => (
                  <div key={stat.label} className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900 mb-0.5">{stat.value}</div>
                    <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                    {stat.percentage && (
                      <div className={`text-xs font-medium ${stat.status === 'success' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {stat.percentage}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={() => onOpenRail?.()} className="bg-blue-600 hover:bg-blue-700 text-white text-sm cursor-pointer">
                  Review items in Teammate
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
                <Button variant="outline" className="border-gray-300 bg-white hover:bg-gray-50 text-sm" onClick={() => setShowReportModal(true)}>
                  View Full Migration Report
                </Button>
              </div>
            </motion.div>
          )}

          {/* 2-column layout */}
          <div className="grid grid-cols-12 gap-8">

            {/* LEFT COLUMN — System of Action */}
            <div className="col-span-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Today</h2>
                <span className="text-xs text-gray-400 font-normal">— {exceptions.length} items need your input</span>
              </div>

              {hasExceptions ? (
                <div className="space-y-2">
                  {exceptions.slice(0, 5).map((exception) => {
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
                    };
                    const COLOR_OVERRIDES: Record<string, string> = {
                      "sys-bank-disconnect": "from-amber-500 to-orange-500",
                      "sys-feb-recon-blocker": "from-amber-500 to-orange-500",
                      "sys-trust-balance": "from-amber-500 to-orange-500",
                    };
                    const AgentIcon = ICON_OVERRIDES[exception.id] ?? AGENT_ICONS[exception.agentId] ?? Sparkles;
                    const agentColor = COLOR_OVERRIDES[exception.id] ?? AGENTS[exception.agentId]?.color ?? "from-blue-500 to-blue-600";
                    const isExpanded = expandedExceptionId === exception.id;

                    return (
                      <div key={exception.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        {/* Collapsed header */}
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setExpandedExceptionId(isExpanded ? null : exception.id)}
                        >
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${agentColor} flex items-center justify-center flex-shrink-0`}>
                            <AgentIcon className="w-3 h-3 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 leading-snug">{exception.title}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{exception.description}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="px-4 pb-4 pt-1 border-t border-gray-100"
                          >
                            {exception.impact && (
                              <div className="flex items-start gap-1.5 p-2.5 bg-amber-50 rounded-lg text-xs text-amber-800 mb-3">
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{exception.impact}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              {exception.id === "sys-trust-balance" ? (
                                <TrustAssignCTA compact />
                              ) : exception.suggestedAction && (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (exception.id === "sys-bank-disconnect") {
                                      onNavigateToConnections?.();
                                    } else if (exception.id === "sys-feb-recon-blocker") {
                                      onNavigateToTransactionsFiltered?.("high", "feb");
                                    } else {
                                      onNavigateToTransactionsFiltered?.(exception.severity as "critical" | "high" | "medium" | "processed");
                                    }
                                  }}
                                >
                                  {exception.suggestedAction}
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
                                    onAskTeammate(`Help me with: "${exception.title}"`);
                                  }}
                                >
                                  <Sparkles className="w-3 h-3 mr-1 text-blue-500" />
                                  Ask Teammate
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}

                  {exceptions.length > 3 && onOpenRail && (
                    <button
                      onClick={onOpenRail}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-blue-200 text-blue-600 text-sm font-medium hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      See all {exceptions.length} items in Today
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">You're all caught up!</p>
                  <p className="text-xs text-gray-500">Your financial team is actively monitoring.</p>
                </div>
              )}

              {/* Handled for you */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide text-xs">Handled for you</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span>3 agents active</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {recentActions.map((action) => {
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
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <h2 className="text-base font-semibold text-gray-900">Financial Health</h2>
              </div>

              {/* Goals card */}
              <div className="bg-white rounded-xl border border-gray-200 mb-4">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setGoalsExpanded(!goalsExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Target className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Q1 2026 Financial Goals</p>
                      <p className="text-xs text-gray-500">3 of 4 on track • 1 at risk</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-300 bg-white hover:bg-gray-50 text-xs"
                      onClick={(e) => { e.stopPropagation(); setShowGoalsModal(true); }}
                    >
                      Review Goals
                    </Button>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${goalsExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {goalsExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-gray-100 p-4 grid grid-cols-2 gap-3"
                  >
                    {financialGoals.map((goal, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-gray-700">{goal.goal}</p>
                          <div className={`w-2 h-2 rounded-full ${goal.status === 'on-track' ? 'bg-green-500' : goal.status === 'behind' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        </div>
                        <div className="flex items-baseline gap-1.5 mb-2">
                          <span className="text-xl font-bold text-gray-900">{goal.current}</span>
                          <span className="text-xs text-gray-500">of {goal.target}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
                          <div className={`h-1 rounded-full ${goal.status === 'on-track' ? 'bg-green-500' : goal.status === 'behind' ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${goal.progress}%` }} />
                        </div>
                        <p className="text-xs text-gray-500">{goal.insight}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* 2x2 metric cards */}
              <div className="grid grid-cols-2 gap-3 mb-4" style={{ gridAutoRows: "200px" }}>
                {/* Operating Cash */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer flex gap-4 relative" onClick={() => setSelectedMetric("operating")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Healthy</span>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-gray-500 mb-1">Operating Cash</p>
                    <p className="text-xs text-gray-400 mb-2">March 2026</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">$142,847</p>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 rounded text-xs font-medium text-emerald-700">
                      <TrendingUp className="w-3 h-3" />+8% MoM
                    </div>
                  </div>
                  <div className="flex-1 flex items-end min-w-0">
                    <svg className="w-full h-24" viewBox="0 0 200 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient2" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                      <path d="M0,45 Q25,35 50,30 T100,25 Q125,20 150,15 T200,10 L200,60 L0,60 Z" fill="url(#areaGradient2)" />
                      <path d="M0,45 Q25,35 50,30 T100,25 Q125,20 150,15 T200,10" fill="none" stroke="#6EE7B7" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Revenue */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer flex gap-4 relative" onClick={() => setSelectedMetric("revenue")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">On Track</span>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-gray-500 mb-1">Revenue</p>
                    <p className="text-xs text-gray-400 mb-2">March 2026 MTD</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">$284,500</p>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 rounded text-xs font-medium text-emerald-700">
                      <TrendingUp className="w-3 h-3" />+12% MoM
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end min-w-0">
                    <div className="flex items-end gap-0.5 h-24">
                      {[25,15,65,70,68,72,60,20,18,75,78,80,76,70,22,16,82].map((h, i) => (
                        <div key={i} className={`flex-1 rounded-t ${i === 16 ? 'bg-blue-500' : h < 30 ? 'bg-gray-200' : 'bg-emerald-400'}`} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* AR at Risk */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer flex gap-4 relative" onClick={() => setSelectedMetric("collections")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">Behind Goal</span>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-gray-500 mb-1">AR at Risk</p>
                    <p className="text-xs text-gray-400 mb-2">60+ Days Overdue</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">$73,700</p>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 rounded text-xs font-medium text-orange-700">
                      <AlertTriangle className="w-3 h-3" />3 invoices
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end min-w-0">
                    <div className="flex items-end gap-1 h-24">
                      {[{h:45,c:'bg-emerald-200'},{h:60,c:'bg-blue-200'},{h:35,c:'bg-yellow-200'},{h:50,c:'bg-orange-300'},{h:75,c:'bg-red-400'}].map((b,i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end h-full">
                          <div className={`w-full rounded-t ${b.c}`} style={{ height: `${b.h}%` }} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {['Current','1-30','31-60','61-90','90+'].map((l,i) => (
                        <div key={i} className={`flex-1 text-center text-[9px] ${i === 4 ? 'text-red-500 font-medium' : 'text-gray-400'}`}>{l}</div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cash Runway */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer flex gap-4 relative" onClick={() => setSelectedMetric("cash-runway")}>
                  <span className="absolute top-3 right-3 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold rounded uppercase">Behind Goal</span>
                  <div className="flex-shrink-0">
                    <p className="text-xs font-medium text-gray-500 mb-1">Runway</p>
                    <p className="text-xs text-gray-400 mb-2">vs 90-day target</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">74 Days</p>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-yellow-100 rounded text-xs font-medium text-yellow-700">
                      <Info className="w-3 h-3" />-16 days from goal
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center min-w-0">
                    <div className="relative w-full flex items-end justify-center">
                      {(() => {
                        const r = 42;
                        const cx = 55;
                        const cy = 56;
                        const halfCirc = Math.PI * r;
                        const pct = 0.82;
                        return (
                          <svg className="w-full" viewBox="0 0 110 62" fill="none" preserveAspectRatio="xMidYMax meet">
                            <path
                              d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                              stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round"
                              fill="none"
                            />
                            <path
                              d={`M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`}
                              stroke="#FCD34D" strokeWidth="8" strokeLinecap="round"
                              fill="none"
                              strokeDasharray={`${halfCirc}`}
                              strokeDashoffset={`${halfCirc * (1 - pct)}`}
                            />
                          </svg>
                        );
                      })()}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xl font-bold text-gray-700">82%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust + Unbilled */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedMetric("trust")}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-xs font-medium text-gray-500">IOLTA Trust</p>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Compliant</span>
                      </div>
                      <p className="text-xs text-gray-400">March 2026</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <div>
                      <p className="text-xl font-bold text-gray-900">$89,234.67</p>
                      <p className="text-xs text-gray-500">Bank Balance</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900">$89,234.67</p>
                      <p className="text-xs text-gray-500">Client Ledgers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                    <p className="text-xs text-gray-700"><span className="font-medium">Three-way reconciled</span> • 2 min ago</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-gray-500">Unbilled Time</p>
                    <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">Opportunity</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">90+ Days Aged</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">$52,500</p>
                  <p className="text-xs text-gray-500 mb-3">40.4 hours • 8 matters</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">• Venture Partners M&A: $18.2K</p>
                    <p className="text-xs text-gray-500">• Tech Startup Inc: $12.4K</p>
                    <p className="text-xs text-gray-500">• Harbor LLC: $8.9K</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Drill-Down Panel */}
      {selectedMetric && (
        <DrillDownPanel metricId={selectedMetric} onClose={() => setSelectedMetric(null)} />
      )}

      {/* Migration Report Modal */}
      <MigrationReportModal isOpen={showReportModal} stats={migrationStats} onClose={() => setShowReportModal(false)} />

      {/* Financial Goals View Modal */}
      <FinancialGoalsViewModal isOpen={showGoalsModal} onClose={() => setShowGoalsModal(false)} />
    </div>
  );
}