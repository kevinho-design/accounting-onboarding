import * as React from "react";
import { ChevronDown, ChevronUp, Send, Sparkles, X, AlertCircle, Zap, Activity, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { AGENTS, AgentType, AgentAction, Exception } from "./agents/AgentTypes";
import { AgentCard } from "./agents/AgentCard";
import { ExplainableAction } from "./agents/ExplainableAction";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const SIMULATED_RESPONSES: Record<string, string> = {
  default: "I'm reviewing your firm's data. Based on current accounts, Hartwell & Morris has 74 days of operating cash runway and $47,800 in outstanding AR. Is there something specific you'd like me to dig into?",
  cash: "Your current operating balance is $284,500. At your current burn rate of $38,400/month, you have approximately 74 days of runway — down from 91 days last month. The main driver is a 12% increase in operating expenses in October.",
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
  const [activeTab, setActiveTab] = React.useState<"attention" | "team" | "chat">("attention");
  const [activeAgents] = React.useState<AgentType[]>(["trust-compliance", "matching", "revenue-forecasting", "collections", "cash-flow"]);
  const [isRosterExpanded, setIsRosterExpanded] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [question, setQuestion] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Consume incoming message from the floating bar
  React.useEffect(() => {
    if (initialMessage && isVisible) {
      setActiveTab("chat");
      sendMessage(initialMessage);
      onMessageConsumed?.();
    }
  }, [initialMessage, isVisible]);

  // Auto-scroll to bottom of chat
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-switch to attention tab when exceptions exist (only if no chat started)
  React.useEffect(() => {
    if (exceptions?.length > 0 && messages.length === 0) {
      setActiveTab("attention");
    }
  }, [exceptions]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getSimulatedResponse(trimmed);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isTyping) sendMessage(question);
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
            onClick={() => setActiveTab("attention")}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors relative ${
              activeTab === "attention" ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Attention</span>
              {exceptions?.length > 0 && (
                <div className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {exceptions.length}
                </div>
              )}
            </div>
            {activeTab === "attention" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`flex-1 px-3 py-3 text-xs font-medium transition-colors relative ${
              activeTab === "team" ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Your Team</span>
            </div>
            {activeTab === "team" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
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
              {messages.length > 0 && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </div>
            {activeTab === "chat" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "attention" ? (
        <div className="flex-1 overflow-y-auto">
          <AttentionTab exceptions={exceptions} />
        </div>
      ) : activeTab === "team" ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Agent status bar */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 flex-shrink-0 bg-white">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">{activeAgents.length} agents active and monitoring</span>
            <button
              onClick={() => setIsRosterExpanded(!isRosterExpanded)}
              className="ml-auto text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              Roster {isRosterExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Agent roster (collapsible) */}
          <AnimatePresence>
            {isRosterExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-gray-100 flex-shrink-0"
              >
                <div className="p-3 space-y-2 bg-white">
                  {Object.values(AGENTS).map((agent) => (
                    <AgentCard key={agent.id} agent={agent} compact />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Team content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Zero-Day Reconciliation status */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-900 mb-1">Zero-Day Reconciliation</div>
                  <p className="text-xs text-green-800 leading-relaxed">
                    Matching Agent reconciled all accounts 2 minutes ago. Trust Compliance Agent verified three-way reconciliation.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Continuous monitoring active</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {recentActions && recentActions.length > 0 ? (
                  recentActions.map((action) => (
                    <ExplainableAction
                      key={action.id}
                      action={action}
                      onEdit={action.isEditable ? () => console.log("Edit action", action) : undefined}
                      onReverse={action.isReversible ? () => console.log("Reverse action", action) : undefined}
                    />
                  ))
                ) : (
                  <div className="text-xs text-gray-500 text-center py-4">No recent activity</div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm border-gray-300 bg-white hover:bg-gray-50">
                  View All Agent Actions
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm border-gray-300 bg-white hover:bg-gray-50">
                  Configure Agent Rules
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Chat tab */
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat messages */}
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
                <div
                  className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
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

function AttentionTab({ exceptions }: { exceptions: Exception[] }) {
  const severityColors = {
    critical: "from-red-500 to-red-600",
    high: "from-orange-500 to-orange-600",
    medium: "from-yellow-500 to-yellow-600",
    low: "from-blue-500 to-blue-600",
  };

  if (!exceptions || exceptions.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-sm text-gray-600">
            Your financial team is actively monitoring. We'll alert you when something needs attention.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {exceptions.length} {exceptions.length === 1 ? "item" : "items"} need your attention
        </h3>
        <p className="text-sm text-gray-600">Your financial team flagged these exceptions</p>
      </div>
      <div className="space-y-3">
        {exceptions.map((exception, idx) => {
          const agent = AGENTS[exception.agentId];
          return (
            <div key={exception.id} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${severityColors[exception.severity]} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xs font-bold text-white">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{exception.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{agent.name}</span>
                    <span>•</span>
                    <span>{new Date(exception.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{exception.description}</p>
                  {exception.impact && (
                    <div className="flex items-start gap-1.5 p-2 bg-amber-50 rounded text-xs text-amber-800 mb-3">
                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{exception.impact}</span>
                    </div>
                  )}
                  {exception.suggestedAction && (
                    <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {exception.suggestedAction}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
