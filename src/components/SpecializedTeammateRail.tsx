import * as React from "react";
import { Send, Sparkles, X, AlertCircle, Zap, Calendar, MessageSquare, ChevronDown, ChevronUp, Shield, GitMerge, TrendingUp, BarChart3, DollarSign, Waves, WifiOff, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { AGENTS, AgentAction, Exception } from "./agents/AgentTypes";
import { ExplainableAction } from "./agents/ExplainableAction";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const SIMULATED_RESPONSES: Record<string, string> = {
  default: "I'm reviewing your firm's data. Based on current accounts, Hartwell & Morris has 74 days of operating cash runway and $52,500 in unbilled time. Is there something specific you'd like me to dig into?",
  cash: "Your current operating balance is $142,847. At your current burn rate of $57,900/month, you have approximately 74 days of runway — down from 91 days last month. The main driver is a 12% increase in operating expenses in October.",
  trust: "I've reviewed all IOLTA trust accounts. Two transactions from last week are flagged against Delaware state bar rules — both are retainer deposits that need client matter assignment. Suggested fixes are ready for your review.",
  invoice: "You have 14 invoices over 30 days past due, totalling $47,200. The highest risk is Chen & Associates ($18,400, 62 days). Based on historical payment patterns, I estimate a 78% probability of collection within the next 30 days without intervention.",
  realization: "Your firm's realization rate this month is 87.3%, up from 84.1% last month. Litigation matters are performing best at 92%. Family law is lagging at 79% — primarily due to two matters with write-downs over $5,000.",
};

function getSimulatedResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("cash") || q.includes("runway") || q.includes("balance")) return SIMULATED_RESPONSES.cash;
  if (q.includes("trust") || q.includes("iolta") || q.includes("compliance")) return SIMULATED_RESPONSES.trust;
  if (q.includes("invoice") || q.includes("ar") || q.includes("overdue") || q.includes("collect")) return SIMULATED_RESPONSES.invoice;
  if (q.includes("reali") || q.includes("rate") || q.includes("billing")) return SIMULATED_RESPONSES.realization;
  return SIMULATED_RESPONSES.default;
}

interface SpecializedTeammateRailProps {
  isVisible?: boolean;
  onToggle?: () => void;
  recentActions?: AgentAction[];
  exceptions?: Exception[];
  initialMessage?: string;
  onMessageConsumed?: () => void;
}

export function SpecializedTeammateRail({
  isVisible = true,
  onToggle,
  recentActions = [],
  exceptions = [],
  initialMessage,
  onMessageConsumed,
}: SpecializedTeammateRailProps) {
  const [activeTab, setActiveTab] = React.useState<"today" | "chat">("today");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [question, setQuestion] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Consume incoming message from the floating bar
  React.useEffect(() => {
    if (initialMessage && isVisible) {
      if (initialMessage === "__sparkle__") {
        setActiveTab("today");
      } else {
        setActiveTab("chat");
        sendMessage(initialMessage);
      }
      onMessageConsumed?.();
    }
  }, [initialMessage, isVisible]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", text: trimmed, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsTyping(true);
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: getSimulatedResponse(trimmed),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-[400px] h-full flex-shrink-0 border-l border-[#1C60FF] flex flex-col"
      style={{ backgroundColor: "#F8FAFF" }}
    >
      {/* Header */}
      <div className="border-b border-blue-100 p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-900">Teammate</span>
        </div>
        {onToggle && (
          <button onClick={onToggle} className="p-1 hover:bg-blue-50 rounded transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <div className="flex">
          <button
            onClick={() => setActiveTab("today")}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors relative ${
              activeTab === "today" ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today</span>
              {exceptions?.length > 0 && (
                <div className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {exceptions.length}
                </div>
              )}
            </div>
            {activeTab === "today" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors relative ${
              activeTab === "chat" ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
              {messages.length > 0 && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </div>
            {activeTab === "chat" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "today" ? (
        <div className="flex-1 overflow-y-auto">
          <TodayTab exceptions={exceptions} recentActions={recentActions} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-12 text-xs text-gray-400">
                Ask your Teammate anything about your firm's finances.
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    {[0, 150, 300].map((delay) => (
                      <span key={delay} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !isTyping) sendMessage(question); }}
                placeholder="Ask about your finances..."
                disabled={isTyping}
                className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder:text-gray-400 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(question)}
                disabled={isTyping || !question.trim()}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white transition-colors flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TodayTab({ exceptions, recentActions }: { exceptions: Exception[]; recentActions: AgentAction[] }) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const AGENT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    "trust-compliance": Shield,
    "matching": GitMerge,
    "revenue-forecasting": TrendingUp,
    "matter-profitability": BarChart3,
    "collections": DollarSign,
    "cash-flow": Waves,
  };
  const ICON_OVERRIDES: Record<string, React.ComponentType<{ className?: string }>> = {
    "sys-bank-disconnect": WifiOff,
    "sys-trust-balance": AlertTriangle,
  };
  const COLOR_OVERRIDES: Record<string, string> = {
    "sys-bank-disconnect": "from-red-500 to-red-600",
    "sys-trust-balance": "from-amber-500 to-orange-500",
  };

  return (
    <div className="p-4 space-y-6">
      {/* Section 1: Needs your input */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
          Needs your input
        </h4>
        {exceptions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">All clear!</p>
            <p className="text-xs text-gray-500">Nothing needs your attention right now.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {exceptions.map((exception) => {
              const agent = AGENTS[exception.agentId];
              const AgentIcon = ICON_OVERRIDES[exception.id] ?? AGENT_ICONS[exception.agentId] ?? Sparkles;
              const agentColor = COLOR_OVERRIDES[exception.id] ?? AGENTS[exception.agentId]?.color ?? "from-blue-500 to-blue-600";
              const isExpanded = expandedId === exception.id;
              return (
                <div
                  key={exception.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* Collapsed header — always visible */}
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : exception.id)}
                  >
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${agentColor} flex items-center justify-center flex-shrink-0`}>
                      <AgentIcon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{exception.title}</p>
                      <p className="text-xs text-gray-500 truncate">{agent.name}</p>
                    </div>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    }
                  </button>

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                          <p className="text-xs text-gray-600 mb-3">{exception.description}</p>
                          {exception.impact && (
                            <div className="flex items-start gap-1.5 p-2 bg-amber-50 rounded-lg text-xs text-amber-800 mb-3">
                              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{exception.impact}</span>
                            </div>
                          )}
                          {exception.suggestedAction && (
                            <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs cursor-pointer">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {exception.suggestedAction}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Handled for you */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">Handled for you</h4>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>3 agents active</span>
          </div>
        </div>
        {recentActions.length === 0 ? (
          <div className="text-xs text-gray-400 text-center py-4">No recent activity</div>
        ) : (
          <div className="space-y-2">
            {recentActions.map((action) => (
              <ExplainableAction
                key={action.id}
                action={action}
                onEdit={action.isEditable ? () => {} : undefined}
                onReverse={action.isReversible ? () => {} : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
