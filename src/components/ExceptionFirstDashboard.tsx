import * as React from "react";
import { 
  CheckCircle, 
  Sparkles,
  TrendingUp,
  Target,
  ChevronRight,
  Info,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { PulsatingCloudBackground } from "./PulsatingCloudBackground";
import { AGENTS, Exception, AgentAction } from "./agents/AgentTypes";
import { AgentCard } from "./agents/AgentCard";
import { ExplainableAction } from "./agents/ExplainableAction";
import { DrillDownPanel } from "./DrillDownPanel";
import { MigrationReportModal } from "./MigrationReportModal";
import { FinancialGoalsViewModal } from "./FinancialGoalsViewModal";
import { motion } from "motion/react";

interface ExceptionFirstDashboardProps {
  onReviewFinancialGoals?: () => void;
  onRecentActionsChange?: (actions: AgentAction[]) => void;
  onExceptionsChange?: (exceptions: Exception[]) => void;
  onAskTeammate?: (message: string) => void;
  onOpenRail?: () => void;
}

export function ExceptionFirstDashboard({ onReviewFinancialGoals, onRecentActionsChange, onExceptionsChange, onAskTeammate, onOpenRail }: ExceptionFirstDashboardProps) {
  const [selectedMetric, setSelectedMetric] = React.useState<string | null>(null);
  const [showMigrationBanner, setShowMigrationBanner] = React.useState(true);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showGoalsModal, setShowGoalsModal] = React.useState(false);
  const [goalsExpanded, setGoalsExpanded] = React.useState(false);
  
  // Collapsible sections state
  const [exceptionsExpanded, setExceptionsExpanded] = React.useState(true);
  const [financialHealthExpanded, setFinancialHealthExpanded] = React.useState(true);

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
  const exceptions: Exception[] = [
    {
      id: "m1",
      agentId: "trust-compliance",
      severity: "high",
      title: "8 possible duplicate vendors to merge",
      description: "We found vendor records that may be the same entity under different names — likely created separately in QuickBooks over time.",
      impact: "Duplicate vendors cause split payment history and inflate your vendor count. Merging takes about 2 minutes.",
      suggestedAction: "Review & merge vendors",
      createdAt: new Date(Date.now() - 10 * 60 * 1000) // surfaced during migration
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
      reasoning: "Based on current burn rate ($18.2K/day), AR aging (52 days DSO), and pipeline conversion (67% historical rate). Factored in your 90-day runway goal.",
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
  }, [onExceptionsChange]);

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
        <div className="max-w-6xl mx-auto px-8 py-12">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome back, Jennifer</h1>
            <p className="text-gray-600 text-lg">Tuesday, March 17, 2026</p>
          </div>

          {/* Migration Success Banner - Dismissible */}
          {showMigrationBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-200 p-8 mb-12"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Migration Complete</h2>
                    <p className="text-gray-600">Your financial team started monitoring immediately. During migration, they already found 3 things that need your attention — see below.</p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setShowMigrationBanner(false)}
                  className="border-white/60 bg-white/70 hover:bg-white text-gray-700 flex-shrink-0"
                >
                  Dismiss
                </Button>
              </div>

              {/* Agent Roster */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {Object.values(AGENTS).map(agent => (
                  <AgentCard key={agent.id} agent={agent} compact />
                ))}
              </div>

              {/* Migration Stats Summary */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {migrationStats.map((stat) => (
                  <div key={stat.label} className="p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-xs text-gray-600 mb-2">{stat.label}</div>
                    {stat.percentage && (
                      <div className={`text-xs font-medium ${
                        stat.status === 'success' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {stat.percentage}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => onOpenRail?.()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Review items in Teammate
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-300 bg-white hover:bg-gray-50"
                  onClick={() => setShowReportModal(true)}
                >
                  View Full Migration Report
                </Button>
              </div>
            </motion.div>
          )}

          {/* Exception-First Content */}
          {hasExceptions ? (
            <>
              {/* Exception Summary - Collapsible */}
              <div className="mb-8">
                <div 
                  className="flex items-center justify-between mb-6 cursor-pointer group"
                  onClick={() => setExceptionsExpanded(!exceptionsExpanded)}
                >
                  <div className="flex items-center gap-3">
                    {/* AI Icon */}
                    <div className="relative">
                      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {exceptions.length} {exceptions.length === 1 ? 'item' : 'items'} need your attention
                      </h2>
                      <p className="text-sm text-gray-500">
                        Your financial team flagged these exceptions that require human judgment
                      </p>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`w-6 h-6 text-gray-400 transition-transform group-hover:text-gray-600 ${exceptionsExpanded ? 'rotate-0' : '-rotate-90'}`} 
                  />
                </div>

                {/* Exception Queue */}
                {exceptionsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {exceptions.slice(0, 3).map((exception, idx) => {
                      const agent = AGENTS[exception.agentId];
                      const severityColors = {
                        critical: "from-red-500 to-red-600",
                        high: "from-orange-500 to-orange-600",
                        medium: "from-yellow-500 to-yellow-600",
                        low: "from-blue-500 to-blue-600"
                      };

                      return (
                        <motion.div
                          key={exception.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-6 bg-white rounded-2xl border border-gray-200"
                        >
                          <div className="flex items-start justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${severityColors[exception.severity]} flex items-center justify-center flex-shrink-0`}>
                                  <span className="text-sm font-bold text-white">{idx + 1}</span>
                                </div>
                                <div>
                                  <h3 className="text-base font-semibold text-gray-900">{exception.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">{agent.name}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(exception.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mb-2">{exception.description}</p>
                              {exception.impact && (
                                <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 rounded-lg">
                                  <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-amber-800">{exception.impact}</p>
                                </div>
                              )}
                              {exception.suggestedAction && (
                                <div className="flex items-center gap-2">
                                  <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                    {exception.suggestedAction}
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                  {onAskTeammate && (
                                    <Button
                                      variant="outline"
                                      className="border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onAskTeammate(`Help me with this exception: "${exception.title}" — ${exception.description}${exception.impact ? `. Impact: ${exception.impact}` : ""}`);
                                      }}
                                    >
                                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                                      Ask Teammate
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* See all pill */}
                    {exceptions.length > 3 && onOpenRail && (
                      <div className="flex justify-center pt-2">
                        <button
                          onClick={onOpenRail}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-medium transition-colors"
                        >
                          See all {exceptions.length} items
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Financial Health Overview - Controller Metrics */}
              <div className="mb-12">
                <div 
                  className="flex items-center justify-between mb-6 cursor-pointer group"
                  onClick={() => setFinancialHealthExpanded(!financialHealthExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Financial Health Overview</h2>
                  </div>
                  <ChevronDown 
                    className={`w-6 h-6 text-gray-400 transition-transform group-hover:text-gray-600 ${financialHealthExpanded ? 'rotate-0' : '-rotate-90'}`} 
                  />
                </div>
                
                {financialHealthExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Goal Progress - Expandable */}
                    <div className="p-6 bg-white rounded-2xl border border-gray-200 mb-6">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setGoalsExpanded(!goalsExpanded)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Target className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-gray-900">Q1 2026 Financial Goals</h3>
                            <p className="text-sm text-gray-600">3 of 4 on track • 1 at risk (Cash Runway)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowGoalsModal(true);
                            }}
                            variant="outline" 
                            className="border-gray-300 bg-white hover:bg-gray-50"
                          >
                            Review Goals
                          </Button>
                          <ChevronDown 
                            className={`w-5 h-5 text-gray-400 transition-transform ${goalsExpanded ? 'rotate-0' : '-rotate-90'}`} 
                          />
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {goalsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 grid grid-cols-2 gap-4"
                        >
                          {financialGoals.map((goal, idx) => (
                            <div key={idx} className="p-5 bg-white rounded-xl border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-gray-900">{goal.goal}</div>
                                <div className={`w-2 h-2 rounded-full ${
                                  goal.status === 'on-track' ? 'bg-green-500' :
                                  goal.status === 'behind' ? 'bg-yellow-500' : 'bg-red-500'
                                }`} />
                              </div>
                              <div className="flex items-baseline gap-2 mb-2">
                                <div className="text-2xl font-bold text-gray-900">{goal.current}</div>
                                <div className="text-sm text-gray-600">of {goal.target}</div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    goal.status === 'on-track' ? 'bg-green-500' :
                                    goal.status === 'behind' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>
                              <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-800">{goal.insight}</p>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    {/* Top Row - 4 Key Metrics */}
                    <div className="grid grid-cols-4 gap-6 mb-6">
                      
                      {/* Operating Cash */}
                      <div 
                        className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedMetric("operating")}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-gray-500">Operating Cash</div>
                          <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">Healthy</div>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">March 2026</div>
                        
                        <div className="text-3xl font-bold text-gray-900 mb-1">$142,847</div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded text-xs font-medium text-emerald-700 mb-3">
                          <TrendingUp className="w-3 h-3" />
                          +8% MoM
                        </div>

                        {/* Mini area chart */}
                        <svg className="w-full h-12" viewBox="0 0 200 60">
                          <defs>
                            <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.3"/>
                              <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.05"/>
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,45 Q25,35 50,30 T100,25 Q125,20 150,15 T200,10 L200,60 L0,60 Z"
                            fill="url(#areaGradient)"
                          />
                          <path
                            d="M0,45 Q25,35 50,30 T100,25 Q125,20 150,15 T200,10"
                            fill="none"
                            stroke="#6EE7B7"
                            strokeWidth="2"
                          />
                        </svg>

                      </div>

                      {/* Revenue MTD */}
                      <div 
                        className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedMetric("revenue")}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-gray-500">Revenue</div>
                          <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">On Track</div>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">March 2026 MTD</div>
                        
                        <div className="text-3xl font-bold text-gray-900 mb-1">$284,500</div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded text-xs font-medium text-emerald-700 mb-3">
                          <TrendingUp className="w-3 h-3" />
                          +12% MoM
                        </div>

                        {/* Daily revenue bars for March 1-17 */}
                        <div className="flex items-end justify-between h-12 gap-0.5">
                          {[
                            { height: 25, day: 1 },
                            { height: 15, day: 2 },
                            { height: 65, day: 3 },
                            { height: 70, day: 4 },
                            { height: 68, day: 5 },
                            { height: 72, day: 6 },
                            { height: 60, day: 7 },
                            { height: 20, day: 8 },
                            { height: 18, day: 9 },
                            { height: 75, day: 10 },
                            { height: 78, day: 11 },
                            { height: 80, day: 12 },
                            { height: 76, day: 13 },
                            { height: 70, day: 14 },
                            { height: 22, day: 15 },
                            { height: 16, day: 16 },
                            { height: 82, day: 17, isToday: true },
                          ].map((bar, i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-t transition-all ${
                                bar.isToday 
                                  ? 'bg-blue-500' 
                                  : bar.height < 30 
                                    ? 'bg-gray-200' 
                                    : 'bg-emerald-400'
                              }`}
                              style={{ height: `${bar.height}%` }}
                              title={`Mar ${bar.day}${bar.isToday ? ' (Today)' : ''}`}
                            />
                          ))}
                        </div>

                      </div>

                      {/* Collections / AR Risk */}
                      <div 
                        className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedMetric("collections")}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-gray-500">AR at Risk</div>
                          <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded uppercase">Behind Goal</div>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">60+ Days Overdue</div>
                        
                        <div className="text-3xl font-bold text-gray-900 mb-1">$73,700</div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 rounded text-xs font-medium text-orange-700 mb-3">
                          <AlertTriangle className="w-3 h-3" />
                          3 invoices
                        </div>

                        {/* AR Aging Buckets */}
                        <div>
                          <div className="flex items-end gap-1 h-12">
                            {[
                              { height: 45, label: 'Current', color: 'bg-emerald-200' },
                              { height: 60, label: '1-30', color: 'bg-blue-200' },
                              { height: 35, label: '31-60', color: 'bg-yellow-200' },
                              { height: 50, label: '61-90', color: 'bg-orange-300' },
                              { height: 75, label: '90+', color: 'bg-red-400' },
                            ].map((bucket, i) => (
                              <div key={i} className="flex-1 flex flex-col justify-end h-full">
                                <div
                                  className={`w-full rounded-t ${bucket.color}`}
                                  style={{ height: `${bucket.height}%` }}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {[
                              { label: 'Current', className: 'text-gray-400' },
                              { label: '1-30', className: 'text-gray-400' },
                              { label: '31-60', className: 'text-gray-400' },
                              { label: '61-90', className: 'text-gray-400' },
                              { label: '90+', className: 'text-red-500 font-medium' },
                            ].map((item, i) => (
                              <div key={i} className={`flex-1 text-center text-[9px] ${item.className}`}>
                                {item.label}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Cash Runway */}
                      <div 
                        className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedMetric("cash-runway")}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-gray-500">Runway</div>
                          <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded uppercase">Behind Goal</div>
                        </div>
                        <div className="text-xs text-gray-400 mb-2">vs 90-day target</div>
                        
                        <div className="text-3xl font-bold text-gray-900 mb-1">74 Days</div>
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded text-xs font-medium text-yellow-700 mb-3">
                          <Info className="w-3 h-3" />
                          -16 days from goal
                        </div>

                        {/* Gauge/Arc visualization */}
                        <div className="relative h-16 flex items-end justify-center pb-1">
                          <svg className="w-28 h-16" viewBox="0 0 120 65" preserveAspectRatio="xMidYMid meet">
                            <path
                              d="M 10,50 A 50,50 0 0,1 110,50"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                            <path
                              d="M 10,50 A 50,50 0 0,1 102,23"
                              fill="none"
                              stroke="#FCD34D"
                              strokeWidth="8"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-sm font-semibold text-gray-700">82%</div>
                        </div>

                      </div>

                    </div>

                    {/* Bottom Row - Trust Compliance & Unbilled Time */}
                    <div className="grid grid-cols-2 gap-6">
                      
                      {/* Trust Account Status */}
                      <div 
                        className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => setSelectedMetric("trust")}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-sm font-medium text-gray-500">IOLTA Trust</div>
                              <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">MA Compliant</div>
                            </div>
                            <div className="text-xs text-gray-400">March 2026</div>
                          </div>
                          <div className="text-gray-300">•••</div>
                        </div>
                        
                        <div className="flex items-baseline gap-4 mb-4">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">$89,235</div>
                            <div className="text-xs text-gray-500">Bank Balance</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900">$89,235</div>
                            <div className="text-xs text-gray-500">Client Ledgers</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-3">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <div className="text-xs text-green-800">
                            <span className="font-medium">Three-way reconciled</span> • Last check: 2 min ago
                          </div>
                        </div>

                      </div>

                      {/* Unbilled Time Opportunity */}
                      <div 
                        className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium text-gray-500">Unbilled Time</div>
                          <div className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded uppercase">Opportunity</div>
                        </div>
                        <div className="text-xs text-gray-400 mb-4">90+ Days Aged</div>
                        
                        <div className="text-3xl font-bold text-gray-900 mb-2">$52,500</div>
                        <div className="text-xs text-gray-500 mb-4">40.4 hours • 8 matters</div>

                        <div className="space-y-1 mb-3">
                          <p className="text-xs text-gray-700">Top 3 aged matters:</p>
                          <p className="text-xs text-gray-500 ml-3">• Venture Partners M&A: $18.2K</p>
                          <p className="text-xs text-gray-500 ml-3">• Tech Startup Inc: $12.4K</p>
                          <p className="text-xs text-gray-500 ml-3">• Harbor LLC: $8.9K</p>
                        </div>

                      </div>

                    </div>
                  </motion.div>
                )}
              </div>
            </>
          ) : (
            /* All Clear State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">You're all caught up!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your financial team is actively monitoring. We'll alert you when something needs attention.
              </p>
              
              {/* Reconciliation Status */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-700 font-medium">Last reconciled: 2 minutes ago</span>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      {/* Drill-Down Panel */}
      {selectedMetric && (
        <DrillDownPanel
          metricId={selectedMetric}
          onClose={() => setSelectedMetric(null)}
        />
      )}

      {/* Migration Report Modal */}
      <MigrationReportModal
        isOpen={showReportModal}
        stats={migrationStats}
        onClose={() => setShowReportModal(false)}
      />

      {/* Financial Goals View Modal */}
      <FinancialGoalsViewModal
        isOpen={showGoalsModal}
        onClose={() => setShowGoalsModal(false)}
      />
    </div>
  );
}