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
