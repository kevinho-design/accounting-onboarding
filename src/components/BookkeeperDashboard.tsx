import * as React from "react";
import {
  CheckCircle,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Shield,
  RefreshCw,
  Info,
} from "lucide-react";
import { PulsatingCloudBackground } from "./PulsatingCloudBackground";
import { motion } from "motion/react";
import { Exception, AgentAction, AGENTS } from "./agents/AgentTypes";

interface BookkeeperDashboardProps {
  onAskTeammate?: (message: string) => void;
  onOpenRail?: () => void;
  onExceptionsChange?: (exceptions: Exception[]) => void;
  onRecentActionsChange?: (actions: AgentAction[]) => void;
}

// ─── Data ────────────────────────────────────────────────────────────────────

export const SARAH_EXCEPTIONS: Exception[] = [
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
    impact: "March reconciliation stuck at 90% until these are categorized",
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

// Per-exception action config
const EXCEPTION_ACTIONS: Record<string, { label: string; askPrompt: string }> = {
  s1: { label: "Review duplicates", askPrompt: "Walk me through the 2 duplicate ACH transactions held on Mar 15 — what should I look for before dismissing one?" },
  s2: { label: "Categorize transactions", askPrompt: "Help me categorize the 14 Brex transactions blocking March reconciliation. What's the fastest way to resolve these?" },
  s3: { label: "Assign client matter", askPrompt: "A $12,000 inbound transfer needs a client matter before it can post to IOLTA. How do I find and assign the right matter?" },
  s4: { label: "Review expenses", askPrompt: "I have 3 expense reports totalling $4,380 pending approval. Can you summarize what each one is for so I can approve quickly?" },
  s5: { label: "Review feed gap", askPrompt: "There's a 6-hour Bank of America feed gap on Mar 16. How do I identify which transactions are missing and add them?" },
};

const severityColors: Record<string, string> = {
  critical: "from-red-500 to-red-600",
  high: "from-orange-500 to-orange-600",
  medium: "from-yellow-500 to-yellow-600",
  low: "from-blue-500 to-blue-600",
};

// ─── Component ───────────────────────────────────────────────────────────────

export function BookkeeperDashboard({ onAskTeammate, onOpenRail, onExceptionsChange, onRecentActionsChange }: BookkeeperDashboardProps) {
  const [resolved, setResolved] = React.useState<Set<string>>(new Set());
  const [queueExpanded, setQueueExpanded] = React.useState(true);
  const [overnightExpanded, setOvernightExpanded] = React.useState(true);

  React.useEffect(() => { onExceptionsChange?.(SARAH_EXCEPTIONS); }, [onExceptionsChange]);
  React.useEffect(() => { onRecentActionsChange?.(SARAH_AGENT_ACTIONS); }, [onRecentActionsChange]);

  return (
    <div className="flex-1 h-screen overflow-hidden relative">
      <PulsatingCloudBackground />

      <div className="h-full overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto px-8 py-12">

          {/* Header — matches Jennifer exactly */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-semibold text-gray-900">Good morning, Sarah</h1>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                Bookkeeper · Hartwell &amp; Morris
              </span>
            </div>
            <p className="text-gray-600 text-lg">Tuesday, March 18, 2026</p>
          </div>

          {/* ── Section 1: Today's Queue ── */}
          <div className="mb-12">
            <div
              className="flex items-center justify-between mb-6 cursor-pointer group"
              onClick={() => setQueueExpanded(v => !v)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl blur-md opacity-75 animate-pulse" />
                  <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {SARAH_EXCEPTIONS.length} {SARAH_EXCEPTIONS.length === 1 ? "item" : "items"} need your attention today
                  </h2>
                  <p className="text-sm text-gray-500">
                    Your AI teammate flagged these — they need a human call
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform group-hover:text-gray-600 ${queueExpanded ? "rotate-0" : "-rotate-90"}`} />
            </div>

            {queueExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {SARAH_EXCEPTIONS.slice(0, 3).map((exc, idx) => {
                  const isResolved = resolved.has(exc.id);
                  const action = EXCEPTION_ACTIONS[exc.id];
                  const iconGradient = severityColors[exc.severity] ?? "from-blue-500 to-blue-600";

                  return (
                    <motion.div
                      key={exc.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07 }}
                      className={`p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow ${isResolved ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${iconGradient} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-sm font-bold text-white">{idx + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900">{exc.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">{exc.description}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 rounded-lg">
                        <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">{exc.impact}</p>
                      </div>

                      {isResolved ? (
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Resolved</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            onClick={() => setResolved(prev => new Set([...prev, exc.id]))}
                          >
                            {action.label}
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          {onAskTeammate && (
                            <button
                              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
                              onClick={() => onAskTeammate(action.askPrompt)}
                            >
                              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                              Ask Teammate
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {/* See all link */}
                {onOpenRail && SARAH_EXCEPTIONS.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="pt-1"
                  >
                    <button
                      onClick={onOpenRail}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      See all {SARAH_EXCEPTIONS.length} items
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* ── Section 2: What AI did overnight ── */}
          <div className="mb-12">
            <div
              className="flex items-center justify-between mb-6 cursor-pointer group"
              onClick={() => setOvernightExpanded(v => !v)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">What your AI did overnight</h2>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform group-hover:text-gray-600 ${overnightExpanded ? "rotate-0" : "-rotate-90"}`} />
            </div>

            {overnightExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-3 gap-6">

                  {/* Auto-coded */}
                  <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-500">Auto-coded</div>
                      <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">Done</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-4">Last night · 2:14 AM</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">89</div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded text-xs font-medium text-emerald-700 mb-4">
                      <Sparkles className="w-3 h-3" />
                      97% avg confidence
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">All matched to existing vendor patterns</p>
                    </div>
                  </div>

                  {/* IOLTA status */}
                  <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-500">IOLTA Status</div>
                      <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded uppercase">Clear</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-4">Verified · 3:01 AM</div>
                    <div className="flex items-center mb-2">
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 rounded text-xs font-medium text-emerald-700 mb-4">
                      <Shield className="w-3 h-3" />
                      Three-way reconciled
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">City National balance matches all client ledgers</p>
                    </div>
                  </div>

                  {/* Reconciliation */}
                  <div className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm font-medium text-gray-500">March Reconciliation</div>
                      <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded uppercase">Open</div>
                    </div>
                    <div className="text-xs text-gray-400 mb-4">Updated · 5:30 AM</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">90%</div>
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded text-xs font-medium text-yellow-700 mb-4">
                      <RefreshCw className="w-3 h-3" />
                      14 unmatched
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                      <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: "90%" }} />
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-800">127/141 matched — Brex card needs your review</p>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
