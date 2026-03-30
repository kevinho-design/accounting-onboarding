/**
 * Single Clio Teammate "Today" feed for Financial Oversight (Ryan): combines Setup (Jennifer)
 * and Daily Bookkeeping (Sarah) prototype items so the rail is never empty on that pillar.
 */
import type { AgentAction, Exception } from './agents/AgentTypes';
import { JENNIFER_EXCEPTIONS, JENNIFER_AGENT_ACTIONS } from './ExceptionFirstDashboard';
import { SARAH_EXCEPTIONS, SARAH_AGENT_ACTIONS } from './BookkeeperDashboard';

function mergeExceptionsById(primary: Exception[], secondary: Exception[]): Exception[] {
  const seen = new Set(primary.map((e) => e.id));
  return [...primary, ...secondary.filter((e) => !seen.has(e.id))];
}

export const UNIFIED_TEAMMATE_TODAY_EXCEPTIONS = mergeExceptionsById(
  JENNIFER_EXCEPTIONS,
  SARAH_EXCEPTIONS,
);

export const UNIFIED_TEAMMATE_TODAY_ACTIONS: AgentAction[] = [
  ...JENNIFER_AGENT_ACTIONS,
  ...SARAH_AGENT_ACTIONS,
];

/** Financial Oversight (Ryan): completed work framed for a Managing Partner — dashboard + Teammate Today. */
export const RYAN_HANDLED_AGENT_ACTIONS: AgentAction[] = [
  {
    id: "ryan-h1",
    agentId: "collections",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    action:
      "Prepared a partner-ready AR digest: $73.7K 60+ overdue across 3 matters, ranked by firm goals",
    reasoning:
      "Mapped overdue balances to your stated goals (DSO 38→28 days, cash reserve). Highlighted collection levers tied to payroll runway so you can delegate or approve in one pass.",
    isEditable: false,
    isReversible: false,
  },
  {
    id: "ryan-h2",
    agentId: "revenue-forecasting",
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    action: "Drafted this week’s financial briefing against your firm goals (revenue, runway, collections)",
    reasoning:
      "Compared March MTD revenue (+12% MoM) and 74-day runway vs your 90-day target. Surfaced unbilled time ($52.5K) as the largest single lever before month-end.",
    isEditable: false,
    isReversible: false,
  },
  {
    id: "ryan-h3",
    agentId: "trust-compliance",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    action: "Confirmed IOLTA three-way tie-out and flagged no trust exceptions for leadership review",
    reasoning:
      "Bank, client ledgers, and matter-level trust balances reconciled. No items require partner sign-off; bookkeeper queue is clear on trust for March close.",
    isEditable: false,
    isReversible: false,
  },
];
