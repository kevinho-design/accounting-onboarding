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
    status: "active"
  },
  "matching": {
    id: "matching",
    name: "Matching Agent",
    description: "Auto-matches bank transactions to GL accounts",
    color: "from-blue-500 to-cyan-600",
    icon: "GitMerge",
    status: "active"
  },
  "revenue-forecasting": {
    id: "revenue-forecasting",
    name: "Revenue Forecasting Skill",
    description: "Predicts cash flow and revenue based on pipeline",
    color: "from-purple-500 to-violet-600",
    icon: "TrendingUp",
    status: "active"
  },
  "matter-profitability": {
    id: "matter-profitability",
    name: "Matter Profitability Skill",
    description: "Analyzes matter-level performance and realization",
    color: "from-orange-500 to-red-600",
    icon: "BarChart3",
    status: "idle"
  },
  "collections": {
    id: "collections",
    name: "Collections Agent",
    description: "Monitors AR aging and payment risk",
    color: "from-yellow-500 to-orange-600",
    icon: "DollarSign",
    status: "active"
  },
  "cash-flow": {
    id: "cash-flow",
    name: "Cash Flow Agent",
    description: "Tracks runway and working capital health",
    color: "from-pink-500 to-rose-600",
    icon: "Waves",
    status: "active"
  }
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