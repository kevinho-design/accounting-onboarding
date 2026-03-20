import * as React from "react";
import { X, Sparkles, Target, TrendingUp, AlertCircle, ChevronRight, ChevronDown, Building2, User, Briefcase, FileText, Calendar, DollarSign, Clock, Scale, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface DrillDownPanelProps {
  metricId: string;
  onClose: () => void;
}

export function DrillDownPanel({ metricId, onClose }: DrillDownPanelProps) {
  const [expandedLevel, setExpandedLevel] = React.useState<number | null>(null);
  const [selectedPath, setSelectedPath] = React.useState<string[]>([]);
  const content = getEnhancedContent(metricId);

  if (!content) return null;

  // Handle level selection - update the selected path
  const handleLevelClick = (levelIndex: number, itemId: string) => {
    // If clicking the same level that's already expanded, collapse it
    if (expandedLevel === levelIndex) {
      setExpandedLevel(null);
      return;
    }
    
    const newPath = [...selectedPath];
    newPath[levelIndex] = itemId;
    // Clear any deeper levels when selecting a new item
    newPath.length = levelIndex + 1;
    setSelectedPath(newPath);
    setExpandedLevel(levelIndex);
  };

  // Handle selecting a different item at the same level
  const handleItemSwitch = (levelIndex: number, itemId: string) => {
    const newPath = [...selectedPath];
    newPath[levelIndex] = itemId;
    // Clear any deeper levels when switching items
    newPath.length = levelIndex + 1;
    setSelectedPath(newPath);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold text-gray-900">Firm-wide Drill Down</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <h3 className="text-lg text-gray-600">{content.title}</h3>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-8">
        
        {/* AI Analysis Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">AI Analysis</h4>
          </div>
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-100">
            {content.aiAnalysis}
          </div>
        </section>

        {/* Goal Impact Section */}
        {content.goalImpact && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Goal Impact Analysis</h4>
            </div>
            
            {/* Q1 Goals Affected */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Q1 Goals Affected:</p>
              {content.goalImpact.affected.map((goal, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">{goal.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{goal.current}</span>
                    <span className="text-xs text-gray-500">/</span>
                    <span className="text-sm text-gray-600">{goal.target}</span>
                    {goal.status === "at-risk" && (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Scenario Modeling */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Scenario Modeling:</p>
              <div className="space-y-3">
                {content.goalImpact.scenarios.map((scenario, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border-2 ${
                      scenario.recommended 
                        ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-300' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">{scenario.title}</p>
                      {scenario.recommended && (
                        <span className="px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded uppercase">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-3">{scenario.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-700"><span className="font-medium">Timeline:</span> {scenario.timeline}</p>
                      <p className="text-xs text-gray-700"><span className="font-medium">Effort:</span> {scenario.effort}</p>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs font-medium text-gray-900 mb-1">Impact:</p>
                        {scenario.impact.map((impact, i) => (
                          <p key={i} className="text-xs text-gray-700 ml-2">• {impact}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Firm-wide Data Drill-Down */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Firm-wide Data Drill-Down</h4>
          </div>
          
          <p className="text-xs text-gray-500 mb-3">Click any level to expand details. Click items in expanded view to switch selection.</p>
          
          {/* Hierarchy visualization */}
          <div className="space-y-2">
            {content.hierarchy.map((level, idx) => (
              <div key={idx}>
                <div 
                  className={`p-4 rounded-xl transition-all cursor-pointer border-2 ${
                    expandedLevel === idx 
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  style={{ marginLeft: `${idx * 16}px` }}
                  onClick={() => handleLevelClick(idx, level.label)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {level.icon && <level.icon className={`w-4 h-4 ${expandedLevel === idx ? 'text-blue-600' : 'text-gray-500'}`} />}
                      <div>
                        <p className={`text-xs uppercase ${expandedLevel === idx ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                          {level.level}
                        </p>
                        <p className={`text-sm font-medium ${expandedLevel === idx ? 'text-blue-900' : 'text-gray-900'}`}>
                          {level.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {level.percentage && (
                        <span className="text-xs text-gray-500">{level.percentage}</span>
                      )}
                      <span className={`text-sm font-bold ${expandedLevel === idx ? 'text-blue-900' : 'text-gray-900'}`}>
                        {level.value}
                      </span>
                      {expandedLevel === idx ? (
                        <ChevronDown className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedLevel === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 ml-0 p-4 bg-white rounded-xl border border-blue-200"
                    style={{ marginLeft: `${(idx + 1) * 16}px` }}
                  >
                    {getExpandedLevelData(metricId, idx, selectedPath, handleItemSwitch)}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recommended Actions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Recommended Actions</h4>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">Prioritized by impact:</p>
          
          <div className="space-y-4">
            {content.actions.map((action, idx) => (
              <div key={idx} className="p-5 bg-white border border-gray-200 rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-white">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-gray-900 mb-1">{action.title}</h5>
                    <p className="text-xs text-gray-600 mb-3">{action.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase mb-0.5">Impact</p>
                        <p className="text-xs font-medium text-green-600">{action.impact}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase mb-0.5">Effort</p>
                        <p className="text-xs font-medium text-gray-900">{action.effort}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase mb-0.5">Timeline</p>
                        <p className="text-xs font-medium text-gray-900">{action.timeline}</p>
                      </div>
                    </div>

                    {action.details && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        {action.details.map((detail, i) => (
                          <p key={i} className="text-xs text-gray-700 mb-1 last:mb-0">• {detail}</p>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        {action.primaryCTA}
                      </Button>
                      {action.secondaryCTA && (
                        <Button size="sm" variant="outline" className="border-gray-300">
                          {action.secondaryCTA}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}

// Get enhanced content for each metric
function getEnhancedContent(metricId: string) {
  switch (metricId) {
    case "cash-runway":
      return {
        title: "Cash Runway",
        aiAnalysis: (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Current Runway: 74 days</p>
              <p className="text-sm text-gray-700 mb-1">Daily Burn Rate: $18,234</p>
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-red-600" />
                <span className="font-medium text-red-600">Trend:</span> ↓ Decreasing (was 78 days last week)
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Based on your current spending patterns and revenue pipeline, your runway is trending downward. 
              You're 16 days short of your Q1 goal of 90 days.
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Confidence:</span> High (95%) - Based on 12 months of data
            </p>
          </div>
        ),
        goalImpact: {
          affected: [
            {
              name: "Cash Runway",
              current: "74 days",
              target: "90 days",
              status: "at-risk"
            }
          ],
          scenarios: [
            {
              title: "Scenario 1: Convert Unbilled Time ($52.5K)",
              description: "Invoice all 90+ day aged unbilled time",
              timeline: "2-3 weeks",
              effort: "Low (invoices ready to send)",
              impact: [
                "Runway: 74 days → 86 days (+12 days)",
                "Goal Progress: 82% → 96%",
                "Still 4 days short of goal"
              ],
              recommended: false
            },
            {
              title: "Scenario 2: Collect Overdue AR ($73.7K)",
              description: "Follow up on 3 high-risk invoices",
              timeline: "1-2 weeks",
              effort: "Medium (follow-up required)",
              impact: [
                "Runway: 74 days → 81 days (+7 days)",
                "Goal Progress: 82% → 90%",
                "Still 9 days short of goal",
                "BONUS: Also improves DSO goal"
              ],
              recommended: false
            },
            {
              title: "Scenario 3: Combined Approach",
              description: "Invoice unbilled time AND collect overdue AR",
              timeline: "3-4 weeks",
              effort: "Medium",
              impact: [
                "Runway: 74 days → 93 days (+19 days)",
                "Goal Progress: 82% → 103% ✅ EXCEEDS GOAL",
                "BONUS: Also improves DSO and Operating Margin"
              ],
              recommended: true
            }
          ]
        },
        hierarchy: [
          {
            level: "Firm",
            label: "Current Cash Runway",
            value: "74 Days",
            icon: Building2
          },
          {
            level: "Component",
            label: "Daily Burn Rate",
            value: "$18,234/day",
            icon: TrendingUp,
            percentage: "Based on 90 days"
          },
          {
            level: "Component",
            label: "Available Cash & Receivables",
            value: "$1.35M",
            icon: DollarSign
          }
        ],
        actions: [
          {
            title: "Invoice Top 3 Aged Unbilled Matters",
            description: "Send invoices for aged unbilled time to improve runway",
            impact: "+9 days runway (74 → 83 days)",
            effort: "Low",
            timeline: "This week",
            details: [
              "Venture Partners M&A: $18.2K (95 days aged)",
              "Tech Startup Inc: $12.4K (87 days aged)",
              "Harbor LLC: $8.9K (82 days aged)"
            ],
            primaryCTA: "Send Invoices",
            secondaryCTA: "Preview Drafts"
          },
          {
            title: "Accelerate Collections on 3 High-Risk AR",
            description: "Follow up on overdue invoices within 3 business days",
            impact: "+7 days runway (74 → 81 days)",
            effort: "Medium",
            timeline: "3 business days",
            details: [
              "Acme Corp: $32.5K (18 days overdue)",
              "Tech Solutions: $24.2K (15 days overdue)",
              "Global Industries: $17K (12 days overdue)"
            ],
            primaryCTA: "Send Payment Reminders",
            secondaryCTA: "View Collection Strategy"
          },
          {
            title: "Review Discretionary Spending",
            description: "Identify opportunities to reduce burn rate",
            impact: "+3-5 days runway",
            effort: "Low",
            timeline: "This week",
            details: [
              "Research/Subscriptions: $8.4K/mo",
              "Professional Development: $3.2K/mo"
            ],
            primaryCTA: "Review Expenses",
            secondaryCTA: "Optimize Subscriptions"
          }
        ]
      };

    case "collections":
      return {
        title: "AR at Risk",
        aiAnalysis: (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Total AR 60+ Days: $73,700 (3 invoices)</p>
              <p className="text-sm text-gray-700 mb-1">Average Age: 15 days overdue</p>
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
                <span className="font-medium">Risk Level:</span> High
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-900">Collection Probability Analysis:</p>
              <p className="text-xs text-gray-700">• Acme Corp ($32.5K): 85% likely to pay (good history)</p>
              <p className="text-xs text-gray-700">• Tech Solutions ($24.2K): 70% likely (1 prior late payment)</p>
              <p className="text-xs text-gray-700">• Global Industries ($17K): 60% likely (new client, &lt;6mo)</p>
            </div>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Historical Performance:</span> Your firm typically collects 89% of 60+ day AR within 30 days.
            </p>
          </div>
        ),
        goalImpact: {
          affected: [
            {
              name: "Days Sales Outstanding",
              current: "52 days",
              target: "≤45 days",
              status: "behind"
            },
            {
              name: "Cash Runway",
              current: "74 days",
              target: "90 days",
              status: "at-risk"
            }
          ],
          scenarios: [
            {
              title: "Collect All 3 Invoices ($73.7K)",
              description: "Successfully collect all overdue receivables",
              timeline: "2-4 weeks",
              effort: "Medium",
              impact: [
                "DSO: 52 days → 45 days (-7 days) ✅ GOAL MET",
                "Goal Progress: 86.5% → 100%",
                "Cash Runway: 74 days → 81 days (+7 days)",
                "Runway Goal Progress: 82% → 90%"
              ],
              recommended: true
            },
            {
              title: "Collect Top 2 Invoices ($56.7K)",
              description: "Focus on highest probability collections first",
              timeline: "1-2 weeks",
              effort: "Low-Medium",
              impact: [
                "DSO: 52 days → 47 days (-5 days)",
                "Goal Progress: 86.5% → 96% (2 days from goal)",
                "Cash Runway: 74 days → 79 days (+5 days)"
              ],
              recommended: false
            }
          ]
        },
        hierarchy: [
          {
            level: "Firm",
            label: "AR 60+ Days Overdue",
            value: "$73,700",
            icon: Building2
          },
          {
            level: "Practice Area",
            label: "Commercial Litigation",
            value: "$56,700",
            icon: Briefcase,
            percentage: "77%"
          },
          {
            level: "Attorney",
            label: "Sarah Chen",
            value: "$32,500",
            icon: User,
            percentage: "44%"
          },
          {
            level: "Matter",
            label: "Acme Corp - Contract Dispute",
            value: "$32,500",
            icon: FileText
          }
        ],
        actions: [
          {
            title: "Acme Corp - $32,500 (18 days overdue)",
            description: "Highest value, highest probability collection",
            impact: "85% collection probability",
            effort: "Low",
            timeline: "This week",
            details: [
              "Recommended Approach: Friendly phone call",
              "Strong payment history (always paid within 45 days)",
              "Suggest: Offer payment plan if needed"
            ],
            primaryCTA: "Call Client",
            secondaryCTA: "Send Reminder"
          },
          {
            title: "Tech Solutions - $24,200 (15 days overdue)",
            description: "Medium probability, requires follow-up",
            impact: "70% collection probability",
            effort: "Medium",
            timeline: "Within 3 days",
            details: [
              "Recommended Approach: Email + phone follow-up",
              "Note: One prior late payment (45 days in 2025)"
            ],
            primaryCTA: "Send Email",
            secondaryCTA: "Schedule Call"
          },
          {
            title: "Global Industries - $17,000 (12 days overdue)",
            description: "New client relationship, handle carefully",
            impact: "60% collection probability",
            effort: "Medium",
            timeline: "Partner outreach",
            details: [
              "Recommended Approach: Partner-level outreach",
              "Note: New client relationship (<6 months)",
              "Consider: Relationship management priority"
            ],
            primaryCTA: "Assign to Partner",
            secondaryCTA: "View Client Profile"
          }
        ]
      };

    case "operating":
      return {
        title: "Operating Cash",
        aiAnalysis: (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Current Balance: $142,847</p>
              <p className="text-sm text-gray-700 mb-1">8.1 days of operating expenses</p>
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="font-medium text-green-600">Trend:</span> ↑ Growing +8% MoM
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Your operating cash is healthy and well above your 5-day safety buffer. This provides cushion for unexpected expenses.
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Daily Operating Expenses:</span> $17,600 average
            </p>
          </div>
        ),
        goalImpact: null,
        hierarchy: [
          {
            level: "Firm",
            label: "Total Operating Cash",
            value: "$142,847",
            icon: Building2
          },
          {
            level: "Account Type",
            label: "Primary Operating",
            value: "$98,234",
            icon: DollarSign,
            percentage: "69%"
          },
          {
            level: "Bank",
            label: "TD Bank - Operating (***4892)",
            value: "$98,234",
            icon: Building2
          }
        ],
        actions: [
          {
            title: "View All Transactions",
            description: "Review recent operating account activity",
            impact: "Full visibility",
            effort: "Low",
            timeline: "Immediate",
            details: null,
            primaryCTA: "View Transactions",
            secondaryCTA: null
          }
        ]
      };

    case "revenue":
      return {
        title: "Revenue",
        aiAnalysis: (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">March 2026 MTD: $284,500</p>
              <p className="text-sm text-gray-700 mb-1">Daily Average: $16,735</p>
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                <span className="font-medium text-green-600">Trend:</span> ↗ +12% vs February
              </p>
            </div>
            <p className="text-sm text-gray-700">
              You're on pace to generate approximately $520K in revenue this month, which would exceed 
              your Q1 target of $1.5M (currently at $987K with 14 days remaining in the quarter).
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Forecast Confidence:</span> High (92%) - Based on 12 active matters and historical billing patterns
            </p>
          </div>
        ),
        goalImpact: {
          affected: [
            {
              name: "Q1 Revenue Target",
              current: "$987K",
              target: "$1.5M",
              status: "on-track"
            }
          ],
          scenarios: [
            {
              title: "Current Pace (Recommended)",
              description: "Maintain current billing velocity",
              timeline: "Through March 31",
              effort: "Current state",
              impact: [
                "Q1 Revenue: $987K → $1.62M (+$633K)",
                "Goal Progress: 65.8% → 108% ✅ EXCEEDS TARGET",
                "Sets strong baseline for Q2"
              ],
              recommended: true
            },
            {
              title: "Accelerate Invoicing",
              description: "Convert all aged unbilled time this month",
              timeline: "Next 2 weeks",
              effort: "Medium",
              impact: [
                "Additional revenue recognition: +$52.5K",
                "Q1 Revenue: $987K → $1.67M",
                "Improves cash runway and working capital"
              ],
              recommended: false
            }
          ]
        },
        hierarchy: [
          {
            level: "Firm",
            label: "Total Revenue MTD",
            value: "$284,500",
            icon: Building2
          },
          {
            level: "Practice Area",
            label: "Commercial Litigation",
            value: "$142,800",
            icon: Briefcase,
            percentage: "50%"
          },
          {
            level: "Attorney",
            label: "Sarah Chen",
            value: "$89,200",
            icon: User,
            percentage: "31%"
          },
          {
            level: "Matter",
            label: "Tech Solutions - IP Litigation",
            value: "$45,600",
            icon: FileText,
            percentage: "16%"
          }
        ],
        actions: [
          {
            title: "Review Active Matter Pipeline",
            description: "Analyze revenue potential from 12 active matters",
            impact: "Forecast accuracy",
            effort: "Low",
            timeline: "This week",
            details: [
              "12 matters with active billing",
              "Average matter value: $43K",
              "Estimated Q1 contribution: $520K"
            ],
            primaryCTA: "View Pipeline",
            secondaryCTA: "Generate Report"
          },
          {
            title: "Monitor Daily Billing Velocity",
            description: "Track daily revenue to maintain Q1 pace",
            impact: "Goal attainment",
            effort: "Low",
            timeline: "Daily",
            primaryCTA: "View Dashboard",
            secondaryCTA: "Set Alerts"
          }
        ]
      };

    case "trust":
      return {
        title: "IOLTA Trust",
        aiAnalysis: (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Bank Balance: $89,235</p>
              <p className="text-sm text-gray-700 mb-1">Client Ledgers: $89,235</p>
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span className="font-medium text-green-600">Status:</span> Three-way reconciled
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Your IOLTA trust account is fully reconciled and MA bar compliant. Bank balance matches 
              client ledgers exactly across 15 active client matters. All trust transactions are properly 
              allocated and documented.
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Last Reconciliation:</span> 2 minutes ago (automated)
            </p>
          </div>
        ),
        goalImpact: {
          affected: [
            {
              name: "Trust Compliance",
              current: "100%",
              target: "100%",
              status: "on-track"
            }
          ],
          scenarios: [
            {
              title: "Maintain Current Compliance",
              description: "Continue automated three-way reconciliation",
              timeline: "Ongoing",
              effort: "Automated",
              impact: [
                "Zero manual reconciliation required",
                "Real-time compliance monitoring",
                "Audit-ready at all times"
              ],
              recommended: true
            }
          ]
        },
        hierarchy: [
          {
            level: "Firm",
            label: "Total Trust Balance",
            value: "$89,235",
            icon: Building2
          },
          {
            level: "Practice Area",
            label: "Real Estate",
            value: "$42,500",
            icon: Briefcase,
            percentage: "48%"
          },
          {
            level: "Attorney",
            label: "Michael Rodriguez",
            value: "$28,750",
            icon: User,
            percentage: "32%"
          },
          {
            level: "Client",
            label: "Harbor Properties LLC",
            value: "$28,750",
            icon: Scale,
            percentage: "32%"
          }
        ],
        actions: [
          {
            title: "Review Client Trust Balances",
            description: "Verify all client matters have proper trust allocations",
            impact: "Maintain compliance",
            effort: "Low",
            timeline: "Monthly",
            details: [
              "15 active client matters",
              "All balances reconciled",
              "No discrepancies detected"
            ],
            primaryCTA: "View Client Ledgers",
            secondaryCTA: "Download Report"
          },
          {
            title: "Generate Three-Way Reconciliation",
            description: "Export MA bar-compliant reconciliation report",
            impact: "Audit readiness",
            effort: "Low",
            timeline: "On demand",
            primaryCTA: "Download Report",
            secondaryCTA: "Schedule Email"
          }
        ]
      };

    case "unbilled":
      return {
        title: "Unbilled Time",
        aiAnalysis: (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Total Unbilled 90+ Days: $52,500</p>
              <p className="text-sm text-gray-700 mb-1">Hours: 40.4 hours across 8 matters</p>
              <p className="text-sm text-gray-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />
                <span className="font-medium">Opportunity:</span> Revenue at risk
              </p>
            </div>
            <p className="text-sm text-gray-700">
              You have significant aged unbilled time that should be converted to invoices. The top 3 
              matters account for $39.5K (75%) of this total. Converting this unbilled time could 
              extend your cash runway by 12 days.
            </p>
            <p className="text-xs text-gray-600">
              <span className="font-medium">Risk:</span> Time entries older than 90 days have 23% lower collection rates
            </p>
          </div>
        ),
        goalImpact: {
          affected: [
            {
              name: "Cash Runway",
              current: "74 days",
              target: "90 days",
              status: "at-risk"
            },
            {
              name: "Revenue Recognition",
              current: "$987K",
              target: "$1.5M",
              status: "on-track"
            }
          ],
          scenarios: [
            {
              title: "Invoice All Aged Unbilled Time",
              description: "Convert all 90+ day unbilled time to invoices",
              timeline: "This week",
              effort: "Low (ready to invoice)",
              impact: [
                "Immediate revenue recognition: +$52.5K",
                "Cash runway: 74 days → 86 days (+12 days)",
                "Q1 revenue: $987K → $1.04M"
              ],
              recommended: true
            },
            {
              title: "Invoice Top 3 Matters Only",
              description: "Focus on highest-value matters first",
              timeline: "This week",
              effort: "Low",
              impact: [
                "Revenue recognition: +$39.5K",
                "Cash runway: 74 days → 83 days (+9 days)",
                "75% of aged unbilled converted"
              ],
              recommended: false
            }
          ]
        },
        hierarchy: [
          {
            level: "Firm",
            label: "Total Unbilled 90+ Days",
            value: "$52,500",
            icon: Building2
          },
          {
            level: "Practice Area",
            label: "Corporate Law",
            value: "$28,400",
            icon: Briefcase,
            percentage: "54%"
          },
          {
            level: "Attorney",
            label: "James Wilson",
            value: "$18,200",
            icon: User,
            percentage: "35%"
          },
          {
            level: "Matter",
            label: "Venture Partners - M&A Advisory",
            value: "$18,200",
            icon: FileText,
            percentage: "35%"
          }
        ],
        actions: [
          {
            title: "Generate Invoices for Top 3 Matters",
            description: "Prioritize highest-value aged unbilled time",
            impact: "+9 days runway",
            effort: "Low",
            timeline: "This week",
            details: [
              "Venture Partners M&A: $18.2K (95 days aged)",
              "Tech Startup Inc: $12.4K (87 days aged)",
              "Harbor LLC: $8.9K (82 days aged)"
            ],
            primaryCTA: "Generate Invoices",
            secondaryCTA: "Preview Drafts"
          },
          {
            title: "Review All 8 Aged Matters",
            description: "Assess collectibility and client communication needs",
            impact: "Risk mitigation",
            effort: "Medium",
            timeline: "This week",
            details: [
              "8 total matters with 90+ day aged time",
              "Total exposure: $52.5K",
              "Average age: 88 days"
            ],
            primaryCTA: "Review Matters",
            secondaryCTA: "View Aging Report"
          },
          {
            title: "Implement Billing Calendar",
            description: "Set up automated reminders to prevent future aging",
            impact: "Process improvement",
            effort: "Low",
            timeline: "One-time setup",
            primaryCTA: "Configure Alerts",
            secondaryCTA: "View Best Practices"
          }
        ]
      };

    default:
      return null;
  }
}

// Get expanded level data for each metric
function getExpandedLevelData(metricId: string, levelIndex: number, selectedPath: string[], handleItemSwitch: (levelIndex: number, itemId: string) => void) {
  const content = getEnhancedContent(metricId);
  if (!content || !content.hierarchy[levelIndex]) return null;

  const level = content.hierarchy[levelIndex];
  
  // Collections / AR at Risk drill-down
  if (metricId === "collections") {
    if (levelIndex === 0) {
      // Firm level → Show all Practice Areas
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Breakdown by Practice Area:</p>
          <div className="space-y-2">
            {[
              { area: "Commercial Litigation", amount: "$56,700", percentage: "77%", color: "bg-orange-500" },
              { area: "Employment Law", amount: "$12,000", percentage: "16%", color: "bg-yellow-500" },
              { area: "Corporate Law", amount: "$5,000", percentage: "7%", color: "bg-blue-500" },
            ].map((item, idx) => {
              const isSelected = selectedPath[0] === item.area;
              return (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer border-2 ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
                      : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => handleItemSwitch(0, item.area)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-8 rounded ${item.color}`} />
                    <span className={`text-xs ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>{item.area}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{item.amount}</div>
                    <div className="text-[10px] text-gray-500">{item.percentage}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (levelIndex === 1) {
      // Practice Area level → Show all Attorneys
      const practiceArea = selectedPath[0] || "Commercial Litigation";
      
      // Different attorneys for different practice areas
      const attorneyData: Record<string, Array<{attorney: string; amount: string; matters: string}>> = {
        "Commercial Litigation": [
          { attorney: "Sarah Chen", amount: "$32,500", matters: "1 matter" },
          { attorney: "David Park", amount: "$17,200", matters: "1 matter" },
          { attorney: "Emily Watson", amount: "$7,000", matters: "1 matter" },
        ],
        "Employment Law": [
          { attorney: "Michael Torres", amount: "$8,500", matters: "2 matters" },
          { attorney: "Lisa Anderson", amount: "$3,500", matters: "1 matter" },
        ],
        "Corporate Law": [
          { attorney: "Robert Kim", amount: "$5,000", matters: "1 matter" },
        ],
      };
      
      const attorneys = attorneyData[practiceArea] || [];
      
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 mb-2">{practiceArea} Attorneys:</p>
          <div className="space-y-2">
            {attorneys.map((item, idx) => {
              const isSelected = selectedPath[1] === item.attorney;
              return (
                <div 
                  key={idx} 
                  className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer border-2 ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
                      : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => handleItemSwitch(1, item.attorney)}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <div>
                      <div className={`text-xs font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{item.attorney}</div>
                      <div className="text-[10px] text-gray-500">{item.matters}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{item.amount}</div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (levelIndex === 2) {
      // Attorney level → Show all Matters
      const attorney = selectedPath[1] || "Sarah Chen";
      
      // Different matters for different attorneys
      const matterData: Record<string, Array<{client: string; matter: string; amount: string; daysOverdue: string; status: string}>> = {
        "Sarah Chen": [
          { client: "Acme Corp", matter: "Contract Dispute", amount: "$32,500", daysOverdue: "18 days", status: "High Priority" },
        ],
        "David Park": [
          { client: "Tech Solutions", matter: "Employment Litigation", amount: "$17,200", daysOverdue: "12 days", status: "Medium Priority" },
        ],
        "Emily Watson": [
          { client: "Global Industries", matter: "Commercial Dispute", amount: "$7,000", daysOverdue: "8 days", status: "Low Priority" },
        ],
        "Michael Torres": [
          { client: "ABC Company", matter: "Wrongful Termination", amount: "$5,500", daysOverdue: "22 days", status: "High Priority" },
          { client: "XYZ Corp", matter: "Discrimination Case", amount: "$3,000", daysOverdue: "15 days", status: "Medium Priority" },
        ],
        "Lisa Anderson": [
          { client: "Smith & Co", matter: "Harassment Claim", amount: "$3,500", daysOverdue: "10 days", status: "Medium Priority" },
        ],
        "Robert Kim": [
          { client: "Startup Ventures", matter: "Securities Dispute", amount: "$5,000", daysOverdue: "25 days", status: "High Priority" },
        ],
      };
      
      const matters = matterData[attorney] || [];
      
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 mb-2">{attorney}'s Matters:</p>
          <div className="space-y-2">
            {matters.map((item, idx) => {
              const isSelected = selectedPath[2] === item.client;
              return (
                <div 
                  key={idx} 
                  className={`p-3 rounded-lg transition-all cursor-pointer border-2 ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
                      : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => handleItemSwitch(2, item.client)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      <div>
                        <div className={`text-xs font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{item.client}</div>
                        <div className="text-[10px] text-gray-500">{item.matter}</div>
                      </div>
                    </div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{item.amount}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-medium rounded">{item.daysOverdue} overdue</span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[9px] font-medium rounded">{item.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (levelIndex === 3) {
      // Matter level → Show Invoice Details
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Invoice Details:</p>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice #:</span>
                <span className="font-medium text-gray-900">INV-2026-0042</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Issue Date:</span>
                <span className="text-gray-700">Feb 28, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="text-gray-700">Mar 14, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days Overdue:</span>
                <span className="font-medium text-red-600">18 days</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-gray-900">$32,500</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-[10px] text-gray-500 mb-1">Collection Probability: 85%</p>
              <p className="text-[10px] text-gray-500">Last Contact: Mar 10, 2026</p>
            </div>
          </div>
        </div>
      );
    }
  }

  // Revenue drill-down
  if (metricId === "revenue") {
    if (levelIndex === 0) {
      // Firm level → Show all Practice Areas
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Revenue by Practice Area (MTD):</p>
          <div className="space-y-2">
            {[
              { area: "Commercial Litigation", amount: "$142,800", percentage: "50%", trend: "+15%" },
              { area: "Corporate Law", amount: "$89,200", percentage: "31%", trend: "+8%" },
              { area: "Real Estate", amount: "$52,500", percentage: "18%", trend: "+12%" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-700">{item.area}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-green-600 font-medium">{item.trend}</span>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-900">{item.amount}</div>
                    <div className="text-[10px] text-gray-500">{item.percentage}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (levelIndex === 1) {
      // Practice Area level → Show all Attorneys
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Commercial Litigation Attorneys:</p>
          <div className="space-y-2">
            {[
              { attorney: "Sarah Chen", amount: "$89,200", matters: "4 active", hours: "127.3h" },
              { attorney: "David Park", amount: "$35,600", matters: "3 active", hours: "78.2h" },
              { attorney: "Emily Watson", amount: "$18,000", matters: "2 active", hours: "42.1h" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <div>
                    <div className="text-xs font-medium text-gray-900">{item.attorney}</div>
                    <div className="text-[10px] text-gray-500">{item.matters} • {item.hours}</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-900">{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (levelIndex === 2) {
      // Attorney level → Show all Matters
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Sarah Chen's Active Matters:</p>
          <div className="space-y-2">
            {[
              { client: "Tech Solutions", matter: "IP Litigation", amount: "$45,600", hours: "67.2h" },
              { client: "Acme Corp", matter: "Contract Dispute", amount: "$28,400", hours: "38.5h" },
              { client: "Global Industries", matter: "Employment Matter", amount: "$10,200", hours: "15.8h" },
              { client: "Venture Partners", matter: "Shareholder Dispute", amount: "$5,000", hours: "5.8h" },
            ].map((item, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <div>
                      <div className="text-xs font-medium text-gray-900">{item.client}</div>
                      <div className="text-[10px] text-gray-500">{item.matter}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-900">{item.amount}</div>
                    <div className="text-[10px] text-gray-500">{item.hours}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (levelIndex === 3) {
      // Matter level → Show Time Entries
      return (
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-700 mb-2">Recent Time Entries:</p>
          <div className="space-y-2">
            {[
              { date: "Mar 17", description: "Client meeting and case strategy", hours: "3.5h", amount: "$1,750" },
              { date: "Mar 15", description: "Document review and analysis", hours: "4.2h", amount: "$2,100" },
              { date: "Mar 12", description: "Legal research on IP precedents", hours: "5.8h", amount: "$2,900" },
              { date: "Mar 10", description: "Deposition preparation", hours: "6.0h", amount: "$3,000" },
            ].map((item, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded-lg text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">{item.date}</span>
                  <div className="text-right">
                    <span className="font-medium text-gray-900">{item.amount}</span>
                    <span className="text-gray-500 ml-2">({item.hours})</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  // Default fallback
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-gray-700 mb-2">Details:</p>
      <p className="text-xs text-gray-500">• {level.label}: {level.value}</p>
      {level.percentage && <p className="text-xs text-gray-500">• {level.percentage}</p>}
    </div>
  );
}