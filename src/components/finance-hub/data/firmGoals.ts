/**
 * Firm-level goals Firm Intelligence uses to filter insights, alerts, and recommendations.
 * @see prototypePersona for primary user name (Jennifer).
 */

import { USER_FIRST_NAME } from './prototypePersona';

export type FirmGoalStatus = 'on_track' | 'behind' | 'at_risk';

export type FirmGoalDefinition = {
  id: string;
  title: string;
  /** Short line under the title (how we measure it in the prototype). */
  metricHint: string;
  progressCurrentLabel: string;
  progressTargetLabel: string;
  /** 0–100 for progress bar */
  progressPct: number;
  status: FirmGoalStatus;
};

export const FIRM_INTELLIGENCE_GOALS_FILTER_NARRATIVE = `Every insight, alert, and recommendation Firm Intelligence delivers is now filtered through these goals. The system knows what ${USER_FIRST_NAME} is trying to achieve—not just what the numbers say.`;

/** Four Q1 2026 firm goals aligned with the Jennifer dashboard. */
export const FIRM_GOAL_DEFINITIONS: FirmGoalDefinition[] = [
  {
    id: 'quarterly_revenue',
    title: 'Hit Q1 quarterly revenue target of $1.5M',
    metricHint: 'Q1 2026 billed revenue vs $1.5M target',
    progressCurrentLabel: '$987K current',
    progressTargetLabel: '$1.5M target',
    progressPct: 65.8,
    status: 'on_track',
  },
  {
    id: 'operating_margin',
    title: 'Maintain operating margin at 40%',
    metricHint: 'Operating income ÷ gross revenue (MTD)',
    progressCurrentLabel: '37% current',
    progressTargetLabel: '40% target',
    progressPct: 92.5,
    status: 'behind',
  },
  {
    id: 'days_sales_outstanding',
    title: 'Reduce days sales outstanding to ≤ 45 days',
    metricHint: 'Firmwide invoice-to-cash (rolling 90 days)',
    progressCurrentLabel: '52 days current',
    progressTargetLabel: '≤ 45 days target',
    progressPct: 86.5,
    status: 'behind',
  },
  {
    id: 'cash_runway',
    title: 'Maintain cash runway of ≥ 90 days',
    metricHint: 'Operating cash ÷ average daily burn',
    progressCurrentLabel: '74 days current',
    progressTargetLabel: '≥ 90 days target',
    progressPct: 82.2,
    status: 'at_risk',
  },
];

export function firmGoalsOnTrackCount(): { onTrack: number; total: number } {
  const total = FIRM_GOAL_DEFINITIONS.length;
  const onTrack = FIRM_GOAL_DEFINITIONS.filter((g) => g.status === 'on_track').length;
  return { onTrack, total };
}
