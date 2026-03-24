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
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";
import { ConfigModeToggle } from "./ConfigModeToggle";
import { WizardProgress } from "./WizardProgress";

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

interface AIGoal {
  id: string;
  icon: React.ElementType;
  iconColor: string;
  title: string;
  current: string;
  peerAvg: string;
  target: string;
  trajectory: string;
  reasoning: string;
  priority: "high" | "medium" | "required";
}

const AI_GOALS: AIGoal[] = [
  {
    id: "cashRunway",
    icon: DollarSign,
    iconColor: "text-blue-600",
    title: "Maintain 90+ days cash runway",
    current: "74 days",
    peerAvg: "82 days",
    target: "90+ days by Q3 2026",
    trajectory: "↑ 22% improvement",
    reasoning:
      "Your runway has trended down from 91 days last month. Comparable firms maintain a 90-day minimum as a buffer against seasonal billing dips.",
    priority: "high",
  },
  {
    id: "reduceAR",
    icon: TrendingUp,
    iconColor: "text-purple-600",
    title: "Reduce days-to-collect from 52 to 35 days",
    current: "52 days avg",
    peerAvg: "38 days",
    target: "35 days by Q4 2026",
    trajectory: "↓ 33% faster collections",
    reasoning:
      "You have $52,500 in unbilled time aging past 52 days. Delaware litigation firms in our network average 38 days — a 35-day target is achievable within 12 months.",
    priority: "high",
  },
  {
    id: "collectionRate",
    icon: TrendingUp,
    iconColor: "text-orange-600",
    title: "Reach 92% invoice collection rate",
    current: "87% collected",
    peerAvg: "91% avg",
    target: "92% within 60 days",
    trajectory: "↑ 5% improvement",
    reasoning:
      "Your 3-year average collection rate is 87%. Similar 50-attorney firms collect 91% within 60 days. Closing this gap represents an estimated $83,000 in additional annual cash flow.",
    priority: "medium",
  },
  {
    id: "compliance",
    icon: Shield,
    iconColor: "text-green-600",
    title: "Maintain Delaware IOLTA compliance",
    current: "7 items flagged",
    peerAvg: "0 violations",
    target: "Zero violations",
    trajectory: "Continuous monitoring",
    reasoning:
      "Your migration identified 7 trust transactions requiring remediation. Ongoing three-way reconciliation keeps you audit-ready at all times — required under Delaware bar rules.",
    priority: "required",
  },
];

const PRIORITY_STYLES = {
  high: { badge: "bg-blue-100 text-blue-700", label: "High Priority" },
  medium: { badge: "bg-purple-100 text-purple-700", label: "Medium Priority" },
  required: { badge: "bg-green-100 text-green-700", label: "Required · Delaware" },
};

export function Screen10_FinancialGoals({ onComplete, onBack }: Screen10Props) {
  const [mode, setMode] = React.useState<"suggested" | "advanced">("suggested");
  const [acceptedGoals, setAcceptedGoals] = React.useState<string[]>(["cashRunway", "reduceAR", "collectionRate", "compliance"]);
  const [expandedGoal, setExpandedGoal] = React.useState<string | null>(null);
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

  const toggleAccepted = (id: string) => {
    setAcceptedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

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

  // 90-day review date
  const reviewDate = new Date();
  reviewDate.setDate(reviewDate.getDate() + 90);
  const reviewDateStr = reviewDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 my-8">
          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Step 4 of 4 · Financial Goals
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Your Firm's North Star</h2>
            <p className="text-gray-600 text-lg">
              Your AI Teammate analyzed 3 years of Hartwell & Morris data and benchmarked against comparable firms to recommend these goals.
            </p>
          </div>

          <WizardProgress currentStep={4} />

          <ConfigModeToggle mode={mode} onModeChange={setMode} />

          {mode === "suggested" ? (
            <div className="space-y-4 mb-8">

              {/* Analysis provenance banner */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Firm CFO Analysis Complete</p>
                  <p className="text-xs text-gray-600">
                    Benchmarked against <span className="font-medium text-blue-700">47 comparable Delaware litigation firms</span> · Based on 34,520 transactions
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
                  <Users className="w-3.5 h-3.5" />
                  <span>47 peer firms</span>
                </div>
              </div>

              {/* AI Goal Cards */}
              {AI_GOALS.map((goal) => {
                const Icon = goal.icon;
                const isAccepted = acceptedGoals.includes(goal.id);
                const isExpanded = expandedGoal === goal.id;
                const priorityStyle = PRIORITY_STYLES[goal.priority];

                return (
                  <div
                    key={goal.id}
                    className={`rounded-xl border transition-all ${
                      isAccepted
                        ? "border-blue-200 bg-blue-50/50"
                        : "border-gray-200 bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Accept/reject toggle */}
                        <button
                          onClick={() => toggleAccepted(goal.id)}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                            isAccepted
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isAccepted && <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className={`w-4 h-4 ${goal.iconColor} flex-shrink-0`} />
                              <span className="font-semibold text-gray-900 text-sm">{goal.title}</span>
                            </div>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${priorityStyle.badge}`}>
                              {priorityStyle.label}
                            </span>
                          </div>

                          {/* Benchmark comparison row */}
                          <div className="flex items-center gap-4 mb-2">
                            <div className="text-xs text-gray-500">
                              <span className="font-medium text-gray-700">You: </span>{goal.current}
                            </div>
                            <div className="text-xs text-gray-400">·</div>
                            <div className="text-xs text-gray-500">
                              <span className="font-medium text-gray-700">Peers: </span>{goal.peerAvg}
                            </div>
                            <div className="text-xs text-gray-400">·</div>
                            <div className="text-xs text-blue-700 font-semibold">{goal.trajectory}</div>
                          </div>

                          <div className="text-xs font-medium text-blue-800 bg-blue-100 px-2 py-1 rounded inline-block mb-2">
                            Target: {goal.target}
                          </div>

                          {/* Expand for reasoning */}
                          <button
                            onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                            className="text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            {isExpanded ? "Hide reasoning" : "Why this goal?"}
                          </button>

                          {isExpanded && (
                            <div className="mt-2 p-3 bg-white rounded-lg border border-blue-100 text-xs text-gray-600 leading-relaxed">
                              {goal.reasoning}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 90-day review checkpoint */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <p className="text-xs text-gray-600">
                  Your first goal review checkpoint is scheduled for{" "}
                  <span className="font-semibold text-gray-800">{reviewDateStr}</span>{" "}
                  — 90 days from today. You'll get a full progress report against each goal.
                </p>
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
              {mode === "suggested"
                ? `Set ${acceptedGoals.length} Goal${acceptedGoals.length !== 1 ? "s" : ""} as Firm North Star`
                : "Complete Configuration"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
