import * as React from "react";
import { Target, TrendingUp, DollarSign, Shield, Sparkles, CheckCircle, X } from "lucide-react";
import { Button } from "./ui/button";
import { ConfigModeToggle } from "./migration/ConfigModeToggle";

interface FinancialGoalsViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FinancialGoalsViewModal({ isOpen, onClose }: FinancialGoalsViewModalProps) {
  const [mode, setMode] = React.useState<"suggested" | "advanced">("suggested");
  const [goals, setGoals] = React.useState(["cashRunway", "reduceAR", "compliance"]);
  const [collectionRate, setCollectionRate] = React.useState(92);

  const toggleGoal = (goalId: string) => {
    if (goals.includes(goalId)) {
      setGoals(goals.filter(g => g !== goalId));
    } else {
      setGoals([...goals, goalId]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-10 py-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-1">
                Financial Goals
              </h2>
              <p className="text-gray-600 text-lg">
                Your firm's financial priorities and AI-powered insights
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-10 py-6">
          <ConfigModeToggle mode={mode} onModeChange={setMode} />

          {mode === "suggested" ? (
            // Suggested Mode - Simple View
            <div className="space-y-6 mb-6 mt-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">AI-Recommended Financial Goals</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Based on your firm's current financial position and industry benchmarks for litigation firms:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Maintain 90+ Days Cash Runway</div>
                      <div className="text-sm text-gray-600 mb-2">
                        Your current runway is 74 days. We'll alert you when it dips below 30 days and provide cash flow forecasting.
                      </div>
                      <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded inline-block">
                        High Priority
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Reduce Outstanding AR by 20%</div>
                      <div className="text-sm text-gray-600 mb-2">
                        You have $47,800 in unbilled time over 52 days old. We'll identify collection opportunities weekly.
                      </div>
                      <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded inline-block">
                        Medium Priority
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Maintain Trust Compliance</div>
                      <div className="text-sm text-gray-600 mb-2">
                        Stay audit-ready with automatic three-way reconciliation and Delaware IOLTA compliance.
                      </div>
                      <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded inline-block">
                        Required for Delaware
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <TrendingUp className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">92% Collection Rate Target</div>
                      <div className="text-sm text-gray-600">
                        Collect 92% of invoices within 60 days (up from current 87%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Advanced Mode - Detailed Controls
            <div className="space-y-6 mb-6 mt-8">
              {/* Goal Selection */}
              <div className="p-5 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold text-gray-900 mb-1">
                      What are your firm's financial priorities?
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Select all that apply — we'll track progress and provide insights
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
                    style={{
                      backgroundColor: goals.includes("cashRunway") ? "#EFF6FF" : "#FFFFFF"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={goals.includes("cashRunway")}
                      onChange={() => toggleGoal("cashRunway")}
                      className="w-5 h-5 text-blue-600 rounded mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <div className="font-semibold text-gray-900">Maintain 90+ days cash runway</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Track operating account health and get alerts when runway dips below target
                      </div>
                    </div>
                    {goals.includes("cashRunway") && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
                    style={{
                      backgroundColor: goals.includes("reduceAR") ? "#EFF6FF" : "#FFFFFF"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={goals.includes("reduceAR")}
                      onChange={() => toggleGoal("reduceAR")}
                      className="w-5 h-5 text-blue-600 rounded mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        <div className="font-semibold text-gray-900">Reduce outstanding AR by 20%</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Identify collection opportunities and improve payment velocity
                      </div>
                    </div>
                    {goals.includes("reduceAR") && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
                    style={{
                      backgroundColor: goals.includes("profitMargin") ? "#EFF6FF" : "#FFFFFF"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={goals.includes("profitMargin")}
                      onChange={() => toggleGoal("profitMargin")}
                      className="w-5 h-5 text-blue-600 rounded mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div className="font-semibold text-gray-900">Increase profit margin to 35%</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Monitor profitability trends and identify cost optimization opportunities
                      </div>
                    </div>
                    {goals.includes("profitMargin") && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                  </label>

                  <label className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
                    style={{
                      backgroundColor: goals.includes("compliance") ? "#EFF6FF" : "#FFFFFF"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={goals.includes("compliance")}
                      onChange={() => toggleGoal("compliance")}
                      className="w-5 h-5 text-blue-600 rounded mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div className="font-semibold text-gray-900">Improve trust compliance audit readiness</div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Maintain perfect three-way reconciliation and documentation
                      </div>
                    </div>
                    {goals.includes("compliance") && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                  </label>
                </div>
              </div>

              {/* Collection Rate Target */}
              <div className="p-5 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold text-gray-900 mb-1">
                      Target collection rate
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      What percentage of invoices should be collected within 60 days?
                    </p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current: 87%</span>
                    <span className="text-lg font-semibold text-blue-600">{collectionRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="85"
                    max="100"
                    value={collectionRate}
                    onChange={(e) => setCollectionRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>85%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-gray-200 flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-300 bg-white hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
