import * as React from "react";
import { 
  TrendingDown, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ChevronRight,
  DollarSign,
  Calendar,
  FileText,
  ArrowUpRight,
  Target,
  Edit,
  Zap,
  Send,
  Download,
  BarChart3,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MigrationReviewDrawer } from "./MigrationReviewDrawer";
import { MigrationReportModal } from "./MigrationReportModal";
import { FinancialGoalsEditModal } from "./FinancialGoalsEditModal";
import { PulsatingCloudBackground } from "./PulsatingCloudBackground";
import { CFOAvatar } from "./CFOAvatar";
import { AICFOMessage } from "./AICFOMessage";

interface PostMigrationDashboardProps {
  onReviewFinancialGoals?: () => void;
}

export function PostMigrationDashboard({ onReviewFinancialGoals }: PostMigrationDashboardProps) {
  const [showMigrationReport, setShowMigrationReport] = React.useState(true);
  const [showReviewDrawer, setShowReviewDrawer] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showGoalsModal, setShowGoalsModal] = React.useState(false);

  const migrationStats = [
    { label: "Transactions Mapped", value: "34,279 of 34,520", percentage: "99.3%", status: "success" as const },
    { label: "Accounts Configured", value: "49 of 52", percentage: "94.2%", status: "success" as const },
    { label: "Vendors Enriched", value: "127", percentage: "100%", status: "success" as const },
    { label: "Items Requiring Review", value: "14", percentage: "", status: "warning" as const },
  ];

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

  return (
    <div className="flex-1 h-screen overflow-hidden relative">
      <PulsatingCloudBackground />
      
      <div className="h-full overflow-y-auto relative z-10">
        <div className="max-w-6xl mx-auto px-8 py-12">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-[40px] font-semibold text-gray-900 mb-2">Welcome back, Jennifer</h1>
            <p className="text-gray-600 text-lg">Tuesday, March 17, 2024</p>
          </div>

          {/* Migration Health Report - Collapsible */}
          {showMigrationReport && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-12">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900">Migration Complete</h2>
                  </div>
                  <p className="text-gray-600 text-lg">
                    Your 3 years of financial history has been migrated with 99.3% success rate.
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowMigrationReport(false)}
                  className="text-gray-500 hover:bg-white/50"
                >
                  Dismiss
                </Button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                {migrationStats.map((stat) => (
                  <div key={stat.label} className="p-5 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                    {stat.percentage && (
                      <div className={`text-sm font-medium ${
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
                  onClick={() => setShowReviewDrawer(!showReviewDrawer)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Review 14 Items <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button 
                  variant="outline" 
                  className="border-gray-300 bg-white hover:bg-gray-50"
                  onClick={() => setShowReportModal(true)}
                >
                  View Full Migration Report
                </Button>
              </div>
            </div>
          )}

          {/* This Week's Priorities */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <CFOAvatar size="md" />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Your Teammate analyzed your data</h2>
                <p className="text-sm text-gray-600">Here's what needs your attention this week</p>
              </div>
            </div>

            {/* AI Welcome Message */}
            <div className="mb-6">
              <AICFOMessage
                type="celebration"
                message="🎉 Great news, Jennifer! Your migration is complete and I've already started monitoring your financial health. I've identified 3 high-impact actions that could improve your cash position by $126K and add 19 days to your runway. Let's tackle them together."
              />
            </div>

            <div className="space-y-4">
              {/* Priority 1 */}
              <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600">1</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Speed up collections on 3 high-risk invoices</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      $73,700 revenue at risk • 12 days overdue
                    </p>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                      <Send className="w-4 h-4 mr-2" />
                      Send Payment Reminders
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-red-600">$73.7K</div>
                    <div className="text-sm text-gray-600">At Risk</div>
                  </div>
                </div>
              </div>

              {/* Priority 2 */}
              <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-orange-600">2</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Convert aged unbilled time to invoices</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      $52,500 in unbilled time • 38-day average aging
                    </p>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Generate Invoices
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-600">$52.5K</div>
                    <div className="text-sm text-gray-600">Unbilled</div>
                  </div>
                </div>
              </div>

              {/* Priority 3 */}
              <div className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">3</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Complete month-end close by March 22</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Trust reconciliation + financial reports due • 5 days remaining
                    </p>
                    <Button variant="outline" className="border-gray-300">
                      <FileText className="w-4 h-4 mr-2" />
                      View Close Checklist
                    </Button>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">25%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Metrics Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Financial Overview</h2>
            
            {/* AI Insight about runway */}
            <div className="mb-6">
              <AICFOMessage
                type="alert"
                message="I noticed your cash runway is below target at 74 days. Based on your current pipeline, if you convert $52.5K in aged unbilled time this week, you'll extend your runway to 86 days—much closer to your 90-day goal. Want me to help you prioritize which matters to bill first?"
                action={{
                  label: "Show me the best candidates",
                  onClick: () => console.log("Show billing candidates")
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Cash Runway */}
              <div className="p-8 bg-white rounded-2xl border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Cash Runway</div>
                    <div className="text-4xl font-bold text-gray-900">74</div>
                    <div className="text-sm text-gray-600">days</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Below 90-day target. Convert unbilled time to add 12 days runway.
                </p>
                <Button variant="outline" className="w-full border-gray-300">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Review Forecast
                </Button>
              </div>

              {/* Collections Risk */}
              <div className="p-8 bg-white rounded-2xl border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">At-Risk AR</div>
                    <div className="text-4xl font-bold text-gray-900">$73.7K</div>
                    <div className="text-sm text-gray-600">3 invoices</div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  High-risk invoices overdue. DSO currently at 52 days vs 45-day target.
                </p>
                <Button variant="outline" className="w-full border-gray-300">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminders
                </Button>
              </div>
            </div>

            {/* Financial Goals */}
            <div className="p-8 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Q1 2026 Financial Goals</h3>
                  </div>
                  <p className="text-gray-600">3 of 4 goals on track</p>
                </div>
                <Button 
                  onClick={() => setShowGoalsModal(true)}
                  variant="outline" 
                  className="border-gray-300 bg-white hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Goals
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {financialGoals.map((goal, idx) => (
                  <div key={idx} className="p-5 bg-white rounded-xl">
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
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          goal.status === 'on-track' ? 'bg-green-500' :
                          goal.status === 'behind' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compliance & Systems */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Compliance & Systems</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Trust Compliance */}
              <div className="p-8 bg-white rounded-2xl border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">Trust Compliance</div>
                    <div className="text-4xl font-bold text-green-600">100%</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Three-way reconciliation current</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>All client ledgers balanced</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Massachusetts bar compliance verified</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-gray-300">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>

              {/* Bank Feeds */}
              <div className="p-8 bg-white rounded-2xl border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Bank Feeds</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <div className="text-lg font-semibold text-gray-900">All Systems Live</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        BOA
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Bank of America</div>
                        <div className="text-xs text-gray-600">Operating Account</div>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                        TD
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">TD Bank</div>
                        <div className="text-xs text-gray-600">IOLTA Trust</div>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                        AX
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">American Express</div>
                        <div className="text-xs text-gray-600">Corporate Card</div>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Migration Review Drawer */}
      <MigrationReviewDrawer 
        isOpen={showReviewDrawer}
        onClose={() => setShowReviewDrawer(false)}
      />

      {/* Migration Report Modal */}
      <MigrationReportModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />

      {/* Financial Goals Edit Modal */}
      <FinancialGoalsEditModal 
        isOpen={showGoalsModal}
        onClose={() => setShowGoalsModal(false)}
        currentGoals={financialGoals}
      />
    </div>
  );
}