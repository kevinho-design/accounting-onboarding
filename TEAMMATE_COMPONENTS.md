# Clio Teammate Components

Two reusable components for a Clio Accounting prototype: a **floating chat bar** that sits at the bottom of the screen, and a **slide-in AI rail** with Attention, Your Team, and Chat tabs.

---

## What You're Getting

| Component | File | What it does |
|---|---|---|
| `FloatingChatBar` | `FloatingChatBar.tsx` | Persistent chat input bar, fixed at the bottom of the screen. Shows suggested queries on focus. Submitting a message or clicking the sparkle icon opens the rail. |
| `SpecializedTeammateRail` | `SpecializedTeammateRail.tsx` | Slide-in right panel with 3 tabs: **Attention** (AI-flagged exceptions), **Your Team** (active agents + recent actions), **Chat** (conversational AI). |
| Supporting files | `agents/AgentTypes.ts`, `agents/AgentCard.tsx`, `agents/ExplainableAction.tsx` | Type definitions and sub-components required by the rail. |

---

## 1. Install Dependencies

```bash
npm install lucide-react motion sonner
```

You also need **shadcn/ui** with at least the `Button` and `Tabs` components. If you don't have it set up:

```bash
npx shadcn@latest init
npx shadcn@latest add button tabs
```

---

## 2. File Structure

Create this folder structure in your `src/components/` directory:

```
src/components/
├── FloatingChatBar.tsx
├── SpecializedTeammateRail.tsx
└── agents/
    ├── AgentTypes.ts
    ├── AgentCard.tsx
    └── ExplainableAction.tsx
```

---

## 3. Copy These Files

### `src/components/agents/AgentTypes.ts`

```typescript
// Specialized agent definitions for Clio Accounting

export type AgentType =
  | "trust-compliance"
  | "matching"
  | "revenue-forecasting"
  | "matter-profitability"
  | "collections"
  | "cash-flow";

export interface Agent {
  id: AgentType;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: "active" | "idle" | "working";
}

export const AGENTS: Record<AgentType, Agent> = {
  "trust-compliance": {
    id: "trust-compliance",
    name: "Trust Compliance Agent",
    description: "Monitors IOLTA compliance and three-way reconciliation",
    color: "from-green-500 to-emerald-600",
    icon: "Shield",
    status: "active",
  },
  matching: {
    id: "matching",
    name: "Matching Agent",
    description: "Auto-matches bank transactions to GL accounts",
    color: "from-blue-500 to-cyan-600",
    icon: "GitMerge",
    status: "active",
  },
  "revenue-forecasting": {
    id: "revenue-forecasting",
    name: "Revenue Forecasting Skill",
    description: "Predicts cash flow and revenue based on pipeline",
    color: "from-purple-500 to-violet-600",
    icon: "TrendingUp",
    status: "active",
  },
  "matter-profitability": {
    id: "matter-profitability",
    name: "Matter Profitability Skill",
    description: "Analyzes matter-level performance and realization",
    color: "from-orange-500 to-red-600",
    icon: "BarChart3",
    status: "idle",
  },
  collections: {
    id: "collections",
    name: "Collections Agent",
    description: "Monitors AR aging and payment risk",
    color: "from-yellow-500 to-orange-600",
    icon: "DollarSign",
    status: "active",
  },
  "cash-flow": {
    id: "cash-flow",
    name: "Cash Flow Agent",
    description: "Tracks runway and working capital health",
    color: "from-pink-500 to-rose-600",
    icon: "Waves",
    status: "active",
  },
};

export interface AgentAction {
  id?: string;
  agentId: AgentType;
  timestamp: Date;
  action: string;
  reasoning: string;
  data?: any;
  isEditable: boolean;
  isReversible: boolean;
}

export interface Exception {
  id: string;
  agentId: AgentType;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  impact?: string;
  suggestedAction?: string;
  data?: any;
  createdAt: Date;
}
```

---

### `src/components/agents/AgentCard.tsx`

```tsx
import * as React from "react";
import { Shield, GitMerge, TrendingUp, BarChart3, DollarSign, Waves, Loader2 } from "lucide-react";
import { Agent } from "./AgentTypes";

// Replace with your own cn() utility if you have one, or use this simple version
function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

const iconMap = { Shield, GitMerge, TrendingUp, BarChart3, DollarSign, Waves };

export function AgentCard({ agent, compact = false }: AgentCardProps) {
  const Icon = iconMap[agent.icon as keyof typeof iconMap] || Shield;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
        <div className={cn("w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center", agent.color)}>
          {agent.status === "working" ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Icon className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{agent.name}</div>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              agent.status === "active" ? "bg-green-500 animate-pulse" :
              agent.status === "working" ? "bg-blue-500 animate-pulse" : "bg-gray-400"
            )} />
            <span className="text-xs text-gray-600 capitalize">{agent.status}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-white border border-gray-200">
      <div className="flex items-start gap-3 mb-3">
        <div className={cn("w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center", agent.color)}>
          {agent.status === "working" ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Icon className="w-5 h-5 text-white" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{agent.name}</h4>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full",
              agent.status === "active" ? "bg-green-500 animate-pulse" :
              agent.status === "working" ? "bg-blue-500 animate-pulse" : "bg-gray-400"
            )} />
            <span className="text-xs text-gray-600 capitalize">{agent.status}</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{agent.description}</p>
    </div>
  );
}
```

---

### `src/components/agents/ExplainableAction.tsx`

```tsx
import * as React from "react";
import { Info, Edit2, RotateCcw, ChevronUp } from "lucide-react";
import { AgentAction, AGENTS } from "./AgentTypes";
import { motion } from "motion/react";

interface ExplainableActionProps {
  action: AgentAction;
  onEdit?: () => void;
  onReverse?: () => void;
}

export function ExplainableAction({ action, onEdit, onReverse }: ExplainableActionProps) {
  const [showReasoning, setShowReasoning] = React.useState(false);
  const agent = AGENTS[action.agentId];

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xs font-medium text-gray-600">{agent.name}</div>
            <div className="text-xs text-gray-400">•</div>
            <div className="text-xs text-gray-500">
              {new Date(action.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
          <div className="text-sm text-gray-900">{action.action}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Show reasoning"
          >
            {showReasoning ? <ChevronUp className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          </button>
          {action.isEditable && onEdit && (
            <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {action.isReversible && onReverse && (
            <button onClick={onReverse} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {showReasoning && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200 bg-white p-3"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-gray-900 mb-1">Why this happened:</div>
              <p className="text-xs text-gray-600 leading-relaxed">{action.reasoning}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

---

### `src/components/FloatingChatBar.tsx`

```tsx
import * as React from "react";
import { Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FloatingChatBarProps {
  onOpen: () => void;
  onSubmitMessage?: (message: string) => void;
  notificationCount?: number;
  isVisible: boolean;
  activeUser?: "jennifer" | "sarah"; // swap for your own user roles
}

// Customise these for your prototype's user/context
const SUGGESTIONS = [
  "What's my current cash position?",
  "Are there any trust compliance issues?",
  "Which clients have overdue invoices?",
  "What's our realization rate this month?",
];

export function FloatingChatBar({
  onOpen,
  onSubmitMessage,
  notificationCount = 0,
  isVisible,
}: FloatingChatBarProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  const handleSparkleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
    onSubmitMessage?.("__sparkle__");
  };

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onOpen();
    onSubmitMessage?.(trimmed);
    setInputValue("");
    setIsFocused(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="chat-bar"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
        >
          {/* Suggested queries — appears on focus */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="mb-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Suggested Queries
                </p>
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onMouseDown={() => handleSubmit(q)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    {q}
                  </button>
                ))}
                <div className="h-2" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSubmit(inputValue); }}
            className="flex items-center gap-3 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2.5 hover:shadow-xl transition-shadow"
          >
            {/* Sparkle — opens rail */}
            <div className="relative flex-shrink-0" onClick={handleSparkleClick}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow">
                  {notificationCount}
                </span>
              )}
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Ask your AI Teammate anything..."
              className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent outline-none"
            />

            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white transition-colors flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

### `src/components/SpecializedTeammateRail.tsx`

```tsx
import * as React from "react";
import { ChevronDown, ChevronUp, Send, Sparkles, X, AlertCircle, Zap, Activity, MessageSquare } from "lucide-react";
import { Button } from "./ui/button"; // shadcn Button
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

// Replace with your own simulated or real responses
const SIMULATED_RESPONSES: Record<string, string> = {
  default: "I'm reviewing your firm's data. Based on current accounts, Hartwell & Morris has 74 days of operating cash runway and $47,800 in outstanding AR. Is there something specific you'd like me to dig into?",
  cash: "Your current operating balance is $284,500. At your current burn rate of $38,400/month, you have approximately 74 days of runway — down from 91 days last month.",
  trust: "I've reviewed all IOLTA trust accounts. Two transactions are flagged against Delaware state bar rules — both are retainer deposits that need client matter assignment.",
  invoice: "You have 14 invoices over 30 days past due, totalling $47,200. The highest risk is Chen & Associates ($18,400, 62 days).",
  realization: "Your firm's realization rate this month is 87.3%, up from 84.1% last month. Litigation matters are at 92%. Family law is lagging at 79%.",
};

function getSimulatedResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("cash") || q.includes("runway")) return SIMULATED_RESPONSES.cash;
  if (q.includes("trust") || q.includes("iolta")) return SIMULATED_RESPONSES.trust;
  if (q.includes("invoice") || q.includes("ar") || q.includes("overdue")) return SIMULATED_RESPONSES.invoice;
  if (q.includes("reali") || q.includes("rate")) return SIMULATED_RESPONSES.realization;
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

  // Consume incoming message from FloatingChatBar
  React.useEffect(() => {
    if (initialMessage && isVisible) {
      setActiveTab("chat");
      sendMessage(initialMessage);
      onMessageConsumed?.();
    }
  }, [initialMessage, isVisible]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  React.useEffect(() => {
    if (exceptions?.length > 0 && messages.length === 0) {
      setActiveTab("attention");
    }
  }, [exceptions]);

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
          {[
            { key: "attention" as const, label: "Attention", icon: AlertCircle, badge: exceptions?.length > 0 ? exceptions.length : null },
            { key: "team" as const, label: "Your Team", icon: Activity, badge: null },
            { key: "chat" as const, label: "Chat", icon: MessageSquare, badge: messages.length > 0 ? true : null },
          ].map(({ key, label, icon: Icon, badge }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 px-3 py-3 text-xs font-medium transition-colors relative ${
                activeTab === key ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                {typeof badge === "number" && (
                  <div className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                    {badge}
                  </div>
                )}
                {badge === true && <div className="w-2 h-2 rounded-full bg-blue-500" />}
              </div>
              {activeTab === key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "attention" ? (
        <div className="flex-1 overflow-y-auto">
          <AttentionTab exceptions={exceptions} />
        </div>
      ) : activeTab === "team" ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center gap-2 flex-shrink-0 bg-white">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">{activeAgents.length} agents active and monitoring</span>
            <button onClick={() => setIsRosterExpanded(!isRosterExpanded)} className="ml-auto text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1">
              Roster {isRosterExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
          <AnimatePresence>
            {isRosterExpanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-b border-gray-100 flex-shrink-0">
                <div className="p-3 space-y-2 bg-white">
                  {Object.values(AGENTS).map((agent) => <AgentCard key={agent.id} agent={agent} compact />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-900 mb-1">Zero-Day Reconciliation</div>
                  <p className="text-xs text-green-800 leading-relaxed">Matching Agent reconciled all accounts 2 minutes ago. Trust Compliance Agent verified three-way reconciliation.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-green-700">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span>Continuous monitoring active</span>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {recentActions.length > 0 ? (
                  recentActions.map((action) => (
                    <ExplainableAction key={action.id} action={action} onEdit={action.isEditable ? () => {} : undefined} onReverse={action.isReversible ? () => {} : undefined} />
                  ))
                ) : (
                  <div className="text-xs text-gray-500 text-center py-4">No recent activity</div>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm border-gray-300 bg-white hover:bg-gray-50">View All Agent Actions</Button>
                <Button variant="outline" className="w-full justify-start text-sm border-gray-300 bg-white hover:bg-gray-50">Configure Agent Rules</Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-12 text-xs text-gray-400">Ask your Teammate anything about your firm's finances.</div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"}`}>
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
          <p className="text-sm text-gray-600">Your financial team is actively monitoring. We'll alert you when something needs attention.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{exceptions.length} {exceptions.length === 1 ? "item" : "items"} need your attention</h3>
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
```

---

## 4. Wire It Up in Your App

Here's the minimum state and wiring needed in your root `App.tsx`:

```tsx
import * as React from "react";
import { FloatingChatBar } from "./components/FloatingChatBar";
import { SpecializedTeammateRail } from "./components/SpecializedTeammateRail";
import { Exception, AgentAction } from "./components/agents/AgentTypes";

export default function App() {
  const [isRailOpen, setIsRailOpen] = React.useState(false);
  const [isChatBarVisible, setIsChatBarVisible] = React.useState(true);
  const [pendingMessage, setPendingMessage] = React.useState<string | undefined>();
  const [exceptions, setExceptions] = React.useState<Exception[]>([]);
  const [recentActions, setRecentActions] = React.useState<AgentAction[]>([]);

  // Notification count clears once rail has been seen
  const [railSeen, setRailSeen] = React.useState(false);
  const notificationCount = railSeen ? 0 : exceptions.length;

  const handleOpenRail = () => {
    setIsRailOpen(true);
    setRailSeen(true);
  };

  const handleSubmitMessage = (message: string) => {
    setPendingMessage(message);
    handleOpenRail();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Your main content */}
      <div className="flex-1 overflow-hidden relative">
        <YourDashboard
          onExceptionsChange={setExceptions}
          onRecentActionsChange={setRecentActions}
        />

        {/* Floating chat bar */}
        <FloatingChatBar
          isVisible={isChatBarVisible && !isRailOpen}
          onOpen={handleOpenRail}
          onSubmitMessage={handleSubmitMessage}
          notificationCount={notificationCount}
        />
      </div>

      {/* AI rail */}
      {isRailOpen && (
        <SpecializedTeammateRail
          isVisible={isRailOpen}
          onToggle={() => setIsRailOpen(false)}
          exceptions={exceptions}
          recentActions={recentActions}
          initialMessage={pendingMessage}
          onMessageConsumed={() => setPendingMessage(undefined)}
        />
      )}
    </div>
  );
}
```

---

## 5. Populate with Your Own Data

### Exceptions (Attention tab)

```tsx
import { Exception } from "./components/agents/AgentTypes";

const MY_EXCEPTIONS: Exception[] = [
  {
    id: "exc-1",
    agentId: "trust-compliance",       // must be a valid AgentType
    severity: "high",                  // "critical" | "high" | "medium" | "low"
    title: "Trust balance discrepancy",
    description: "Client Matter #1042 trust balance is $200 below the required minimum.",
    impact: "Potential IOLTA violation if not resolved within 48 hours.",
    suggestedAction: "Review & Transfer Funds",
    createdAt: new Date(),
  },
  // add more...
];
```

### Recent Agent Actions (Your Team tab)

```tsx
import { AgentAction } from "./components/agents/AgentTypes";

const MY_ACTIONS: AgentAction[] = [
  {
    id: "act-1",
    agentId: "matching",
    timestamp: new Date(),
    action: "Auto-matched 43 bank transactions to GL accounts",
    reasoning: "Matched based on payee name pattern and historical categorisation rules.",
    isEditable: true,
    isReversible: true,
  },
];
```

---

## 6. Customise the Chat Responses

Edit `getSimulatedResponse()` in `SpecializedTeammateRail.tsx` to match your prototype's domain. The function takes the user's message as a string and returns a response string. Replace the keyword-matching logic with whatever fits your scenario.

---

## Notes

- The rail expects to live inside a `flex h-screen` container alongside your main content — it's a fixed-width `400px` sidebar, not an overlay.
- The chat bar hides itself when the rail is open (controlled by the `isVisible` prop).
- The orange notification badge on the sparkle icon is driven by `notificationCount` — set it to `exceptions.length` and clear it when the rail is first opened.
- `initialMessage` is how the chat bar passes a submitted query into the rail's Chat tab. Pass it in, then clear it via `onMessageConsumed` to prevent re-sending on re-render.
