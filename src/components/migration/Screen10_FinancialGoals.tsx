import * as React from "react";
import {
  Target,
  TrendingUp,
  DollarSign,
  Shield,
  Sparkles,
  CheckCircle,
  Plus,
  X,
  Send,
  Trash2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";
import { ConfigModeToggle } from "./ConfigModeToggle";

interface Screen10Props {
  onComplete: () => void;
  onBack?: () => void;
}

interface Goal {
  id: string;
  text: string;
}

const EXAMPLE_PLACEHOLDERS = [
  "Grow net revenue by 15% year-over-year",
  "Reduce average days-to-collect from 38 to 28 days",
  "Maintain a minimum 60-day operating cash reserve",
  "Increase profit margin to 35% by end of year",
];

export function Screen10_FinancialGoals({ onComplete, onBack }: Screen10Props) {
  const [mode, setMode] = React.useState<"suggested" | "advanced">("suggested");
  const [goals, setGoals] = React.useState(["cashRunway", "reduceAR", "compliance"]);
  const [collectionRate, setCollectionRate] = React.useState(92);
  const [nlGoals, setNlGoals] = React.useState<Goal[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [goalAdded, setGoalAdded] = React.useState(false);
  const [visibleCards, setVisibleCards] = React.useState({ goals: true, collection: true });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleGoal = (goalId: string) => {
    if (goals.includes(goalId)) {
      setGoals(goals.filter((g) => g !== goalId));
    } else {
      setGoals([...goals, goalId]);
    }
  };

  const addGoal = () => {
    const text = inputValue.trim();
    if (!text) return;
    setNlGoals((prev) => [...prev, { id: Date.now().toString(), text }]);
    setInputValue("");
    setGoalAdded(true);
    setTimeout(() => setGoalAdded(false), 1500);
  };

  const removeGoal = (id: string) => {
    setNlGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addGoal();
  };

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 my-8">
          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Configuration • Financial Goals
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Financial Goals</h2>
            <p className="text-gray-600 text-lg">
              Define your firm's financial priorities to get personalized AI insights.
            </p>
          </div>

          <ConfigModeToggle mode={mode} onModeChange={setMode} />

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Configuration Progress</span>
              <span className="text-sm font-semibold text-blue-600">Step 4 of 4</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
            </div>
          </div>

          {mode === "suggested" ? (
            <div className="space-y-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Recommended Financial Goals</h3>
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
                      <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded inline-block">High Priority</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Reduce Outstanding AR by 20%</div>
                      <div className="text-sm text-gray-600 mb-2">
                        You have $47,800 in unbilled time over 52 days old. We'll identify collection opportunities weekly.
                      </div>
                      <div className="text-xs text-purple-700 bg-purple-100 px-2 py-1 rounded inline-block">Medium Priority</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Maintain Trust Compliance</div>
                      <div className="text-sm text-gray-600 mb-2">
                        Stay audit-ready with automatic three-way reconciliation and Delaware IOLTA compliance.
                      </div>
                      <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded inline-block">Required for Delaware</div>
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
            <div className="space-y-6 mb-8">

              {/* ── Natural language goals input ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Add a goal in plain language
                </label>

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={EXAMPLE_PLACEHOLDERS[placeholderIndex]}
                    className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  <button
                    onClick={addGoal}
                    disabled={!inputValue.trim()}
                    className="flex items-center gap-1.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {/* Confirmation */}
                {goalAdded && (
                  <p className="text-xs text-green-600 font-medium mt-2 transition-opacity">Goal added</p>
                )}

                <div className="flex flex-col gap-2">
                  {nlGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg group"
                    >
                      <Plus className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="flex-1 text-sm text-gray-800">{goal.text}</span>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  You can add, edit, or remove goals anytime in{" "}
                  <span className="text-blue-500 font-medium">Settings → Financial Goals</span>
                </p>
              </div>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Or configure individually</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Goal Selection */}
              {visibleCards.goals && (
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-900 mb-1">
                        What are your firm's financial priorities?
                      </label>
                      <p className="text-sm text-gray-600">
                        Select all that apply — we'll track progress and provide insights
                      </p>
                    </div>
                    <button
                      onClick={() => setVisibleCards((v) => ({ ...v, goals: false }))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {[
                      { id: "cashRunway", icon: DollarSign, color: "text-blue-600", label: "Maintain 90+ days cash runway", sub: "Track operating account health and get alerts when runway dips below target" },
                      { id: "reduceAR", icon: TrendingUp, color: "text-purple-600", label: "Reduce outstanding AR by 20%", sub: "Identify collection opportunities and improve payment velocity" },
                      { id: "profitMargin", icon: TrendingUp, color: "text-green-600", label: "Increase profit margin to 35%", sub: "Monitor profitability trends and identify cost optimization opportunities" },
                      { id: "compliance", icon: Shield, color: "text-blue-600", label: "Improve trust compliance audit readiness", sub: "Maintain perfect three-way reconciliation and documentation" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <label
                          key={item.id}
                          className="flex items-start gap-3 p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
                          style={{ backgroundColor: goals.includes(item.id) ? "#EFF6FF" : "#FFFFFF" }}
                        >
                          <input
                            type="checkbox"
                            checked={goals.includes(item.id)}
                            onChange={() => toggleGoal(item.id)}
                            className="w-5 h-5 text-blue-600 rounded mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className={`w-5 h-5 ${item.color}`} />
                              <div className="font-semibold text-gray-900">{item.label}</div>
                            </div>
                            <div className="text-sm text-gray-600">{item.sub}</div>
                          </div>
                          {goals.includes(item.id) && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Collection Rate Target */}
              {visibleCards.collection && (
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-900 mb-1">Target collection rate</label>
                      <p className="text-sm text-gray-600">
                        What percentage of invoices should be collected within 60 days?
                      </p>
                    </div>
                    <button
                      onClick={() => setVisibleCards((v) => ({ ...v, collection: false }))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-700 px-4 py-6 shrink-0">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              Complete Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
