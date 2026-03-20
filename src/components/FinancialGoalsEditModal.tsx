import * as React from "react";
import { X, Target, TrendingUp, DollarSign, Shield, Sparkles, CheckCircle, BarChart3, AlertTriangle, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface FinancialGoal {
  goal: string;
  target: string;
  current: string;
  progress: number;
  status: "on-track" | "behind" | "at-risk";
  insight: string;
}

interface FinancialGoalsEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoals: FinancialGoal[];
}

export function FinancialGoalsEditModal({ isOpen, onClose, currentGoals }: FinancialGoalsEditModalProps) {
  const [step, setStep] = React.useState<"overview" | "reassess" | "edit">("overview");
  const [mode, setMode] = React.useState<"suggested" | "advanced">("suggested");
  
  // Goal state
  const [revenueTarget, setRevenueTarget] = React.useState("1500000");
  const [marginTarget, setMarginTarget] = React.useState(40);
  const [dsoTarget, setDsoTarget] = React.useState(45);
  const [cashRunwayTarget, setCashRunwayTarget] = React.useState(90);
  const [collectionRate, setCollectionRate] = React.useState(92);
  
  const [selectedGoals, setSelectedGoals] = React.useState(["revenue", "margin", "dso", "cashRunway"]);

  const toggleGoal = (goalId: string) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleReassess = () => {
    // This would trigger AI re-analysis
    setStep("reassess");
    
    // Simulate AI processing
    setTimeout(() => {
      setStep("edit");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Overview Step */}
        {step === "overview" && (
          <>
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Financial Goals</h2>
                  <p className="text-gray-600 mt-1">Q1 2026 Performance & Targets</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {/* Current Performance Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Progress</h3>
                    <p className="text-sm text-gray-600">3 of 4 goals on track for Q1 2026</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-blue-600">81.8%</div>
                    <div className="text-xs text-gray-600">Average completion</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">1</div>
                    <div className="text-xs text-gray-600">On Track</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-yellow-200">
                    <div className="text-2xl font-bold text-yellow-600">2</div>
                    <div className="text-xs text-gray-600">Behind</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="text-2xl font-bold text-red-600">1</div>
                    <div className="text-xs text-gray-600">At Risk</div>
                  </div>
                </div>
              </div>

              {/* Detailed Goal Breakdown */}
              <div className="space-y-4 mb-6">
                {currentGoals.map((goal, idx) => (
                  <div key={idx} className={`p-5 rounded-xl border-2 ${
                    goal.status === 'on-track' ? 'bg-green-50 border-green-200' :
                    goal.status === 'behind' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{goal.goal}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            goal.status === 'on-track' ? 'bg-green-100 text-green-700' :
                            goal.status === 'behind' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {goal.status === 'on-track' ? 'On Track' :
                             goal.status === 'behind' ? 'Behind' :
                             'At Risk'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Current: <span className="font-semibold text-gray-900">{goal.current}</span></span>
                          <span>→</span>
                          <span>Target: <span className="font-semibold text-gray-900">{goal.target}</span></span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full ${
                              goal.status === 'on-track' ? 'bg-green-500' :
                              goal.status === 'behind' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="flex items-start gap-2 bg-white/80 rounded-lg p-3">
                          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-gray-700">
                            <span className="font-semibold">AI Insight:</span> {goal.insight}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Re-assessment Option */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Reassessment Available</h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Your AI can analyze 3 months of new financial data since you last set these goals. Get updated recommendations based on actual performance trends, market conditions, and your firm's growth trajectory.
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleReassess}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Run AI Reassessment
                      </Button>
                      <Button
                        onClick={() => setStep("edit")}
                        variant="outline"
                        className="border-gray-300"
                      >
                        Manual Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-300"
              >
                Close
              </Button>
            </div>
          </>
        )}

        {/* Reassessment Step */}
        {step === "reassess" && (
          <>
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">AI Reassessment in Progress</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Analyzing Your Financial Data</h3>
                <p className="text-gray-600 mb-6">
                  AI is reviewing 3 months of transactions, revenue trends, expense patterns, and collection rates to provide updated goal recommendations...
                </p>
                <div className="space-y-2 text-sm text-left bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Analyzed 2,450 transactions</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Evaluated revenue trends (Q4 2025 - Q1 2026)</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 animate-pulse">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span>Calculating recommended targets...</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Edit Step */}
        {step === "edit" && (
          <>
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Edit Financial Goals</h2>
                  <p className="text-gray-600 mt-1">Customize your targets and priorities</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                <button
                  onClick={() => setMode("suggested")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === "suggested"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  AI Suggested
                </button>
                <button
                  onClick={() => setMode("advanced")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    mode === "advanced"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">
              {mode === "suggested" ? (
                // Suggested Mode
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Updated AI Recommendations</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Based on Q4 2025 - Q1 2026 performance and industry benchmarks for litigation firms:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                        <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">Quarterly Revenue Target: $1.5M</div>
                          <div className="text-sm text-gray-600 mb-2">
                            Increase from $1.2M based on 12% growth trend. You're 65% there with 30 days left in Q1.
                          </div>
                          <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded inline-block">
                            On Track to Exceed
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                        <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">Operating Margin: 40%</div>
                          <div className="text-sm text-gray-600 mb-2">
                            Currently at 37%. Reduce research expenses by $12K to hit target this quarter.
                          </div>
                          <div className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded inline-block">
                            Needs Attention
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                        <BarChart3 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">Days Sales Outstanding: ≤ 45 days</div>
                          <div className="text-sm text-gray-600 mb-2">
                            Currently 52 days. Focus on 3 high-risk collections to improve by 7 days.
                          </div>
                          <div className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded inline-block">
                            Needs Improvement
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-white rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">Cash Runway: ≥ 90 days</div>
                          <div className="text-sm text-gray-600 mb-2">
                            Currently 74 days. Convert $52K in unbilled time to add 12 days runway.
                          </div>
                          <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded inline-block">
                            Critical Priority
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Advanced Mode
                <div className="space-y-6">
                  {/* Revenue Target */}
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-900 mb-1">
                          Quarterly Revenue Target
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                          Set your revenue goal for Q1 2026
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">$</span>
                          <input
                            type="number"
                            value={revenueTarget}
                            onChange={(e) => setRevenueTarget(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          Current: $987K (65.8% of target)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operating Margin */}
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-900 mb-1">
                          Operating Margin Target
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                          Target profit margin percentage
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Current: 37%</span>
                          <span className="text-lg font-semibold text-blue-600">{marginTarget}%</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="50"
                          value={marginTarget}
                          onChange={(e) => setMarginTarget(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>30%</span>
                          <span>50%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DSO Target */}
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-900 mb-1">
                          Days Sales Outstanding (DSO) Target
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                          Maximum acceptable collection period
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Current: 52 days</span>
                          <span className="text-lg font-semibold text-blue-600">{dsoTarget} days</span>
                        </div>
                        <input
                          type="range"
                          min="30"
                          max="60"
                          value={dsoTarget}
                          onChange={(e) => setDsoTarget(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>30 days</span>
                          <span>60 days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cash Runway Target */}
                  <div className="p-5 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <label className="block font-semibold text-gray-900 mb-1">
                          Minimum Cash Runway Target
                        </label>
                        <p className="text-sm text-gray-600 mb-3">
                          Days of operating expenses to maintain
                        </p>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Current: 74 days</span>
                          <span className="text-lg font-semibold text-blue-600">{cashRunwayTarget} days</span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="180"
                          value={cashRunwayTarget}
                          onChange={(e) => setCashRunwayTarget(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>60 days</span>
                          <span>180 days</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-between">
              <Button
                onClick={() => setStep("overview")}
                variant="outline"
                className="border-gray-300"
              >
                Back to Overview
              </Button>
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Goals
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
