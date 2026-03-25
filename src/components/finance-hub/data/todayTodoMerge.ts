import { BRIEFING_INSIGHT_ITEMS, type BriefingInsightListItem } from './briefingInsights';
import { TODAY_OPERATIONAL_TODOS, type TodayOperationalTodo } from './todayTodoSeed';
import type { BriefingInsightId } from './briefingPanelContent';

export type MergedTodayTodo =
  | {
      kind: 'briefing';
      key: string;
      headline: string;
      sourceLabel: string;
      detail: string;
      insightId: BriefingInsightId;
      timeLabel: string;
    }
  | {
      kind: 'operational';
      key: string;
      headline: string;
      sourceLabel: string;
      detail: string;
      askPrompt: string;
    }
  | {
      kind: 'suggested';
      key: string;
      headline: string;
      sourceLabel: string;
      detail: string;
      query: string;
    };

const SUGGESTED_SOURCE = 'Firm Intelligence';
const MAX_TOTAL_DEFAULT = 12;

function briefingToMerged(insight: BriefingInsightListItem): MergedTodayTodo {
  return {
    kind: 'briefing',
    key: `briefing-${insight.id}`,
    headline: insight.title,
    sourceLabel: insight.todaySourceLabel,
    detail: insight.description,
    insightId: insight.id,
    timeLabel: insight.time,
  };
}

function operationalToMerged(o: TodayOperationalTodo): MergedTodayTodo {
  return {
    kind: 'operational',
    key: `op-${o.id}`,
    headline: o.headline,
    sourceLabel: o.sourceLabel,
    detail: o.detail,
    askPrompt: o.askPrompt,
  };
}

function suggestedToMerged(query: string, index: number): MergedTodayTodo {
  return {
    kind: 'suggested',
    key: `suggested-${index}-${query.slice(0, 24)}`,
    headline: query,
    sourceLabel: SUGGESTED_SOURCE,
    detail: 'Ask Firm Intelligence to run this analysis or open the relevant report from search.',
    query,
  };
}

/**
 * Merge order: briefings, operational seeds, suggested queries. Capped for scroll UX.
 */
export function buildMergedTodayTodos(
  executedBriefingInsightIds: readonly BriefingInsightId[],
  suggestedQueries: readonly string[],
  maxTotal: number = MAX_TOTAL_DEFAULT,
): MergedTodayTodo[] {
  const hidden = new Set(executedBriefingInsightIds);
  const briefings = BRIEFING_INSIGHT_ITEMS.filter((i) => !hidden.has(i.id));
  const out: MergedTodayTodo[] = [];

  for (const b of briefings) {
    if (out.length >= maxTotal) break;
    out.push(briefingToMerged(b));
  }
  for (const o of TODAY_OPERATIONAL_TODOS) {
    if (out.length >= maxTotal) break;
    out.push(operationalToMerged(o));
  }
  const suggestedLimited = suggestedQueries.slice(0, 4);
  for (let i = 0; i < suggestedLimited.length; i++) {
    if (out.length >= maxTotal) break;
    out.push(suggestedToMerged(suggestedLimited[i]!, i));
  }

  return out;
}

export function countMergedTodayTodos(
  executedBriefingInsightIds: readonly BriefingInsightId[],
  suggestedQueries: readonly string[],
  maxTotal: number = MAX_TOTAL_DEFAULT,
): number {
  return buildMergedTodayTodos(executedBriefingInsightIds, suggestedQueries, maxTotal).length;
}
