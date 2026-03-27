/**
 * Firm-level goals Firm Intelligence uses to filter insights, alerts, and recommendations.
 * @see prototypePersona for primary user name (Jennifer).
 */

import * as React from 'react';
import { USER_FIRST_NAME } from './prototypePersona';
import { getFinancialGoalTemplate } from './financialGoalTemplates';
import type { FirmGoalValueFormat } from './financialGoalTemplates';

export type { FirmGoalValueFormat } from './financialGoalTemplates';
export { FINANCIAL_GOAL_TEMPLATES, getFinancialGoalTemplate } from './financialGoalTemplates';

export type FirmGoalStatus = 'on_track' | 'behind' | 'at_risk';

export type FirmGoalDefinition = {
  id: string;
  /** Catalog entry defining what is measured (vs user-editable `title`). */
  goalTemplateId: string;
  title: string;
  /** Short line under the title (how we measure it in the prototype). */
  metricHint: string;
  progressCurrentLabel: string;
  progressTargetLabel: string;
  /** 0–100 for progress bar */
  progressPct: number;
  status: FirmGoalStatus;
  /** Dashboard card copy */
  dashboardInsight: string;
  valueFormat: FirmGoalValueFormat;
  currentValue: number;
  targetValue: number;
  targetDeadline: string;
  benchmark: {
    trailingAverage: number;
    peerRegionalAverage: number;
    regionLabel: string;
  };
  aiOptimization: {
    recommendedTargetValue: number;
    rationale: string;
    billingVelocityNote: string;
    operationalChangesNote: string;
  };
};

export type FirmGoalDashboardCard = {
  id: string;
  goal: string;
  /** Catalog label for the goal type (subtitle on cards). */
  templateLabel: string;
  target: string;
  current: string;
  progress: number;
  status: 'on-track' | 'behind' | 'at-risk';
  insight: string;
};

export const FIRM_INTELLIGENCE_GOALS_FILTER_NARRATIVE = `Every insight, alert, and recommendation Firm Intelligence delivers is now filtered through these goals. The system knows what ${USER_FIRST_NAME} is trying to achieve—not just what the numbers say.`;

/** Four Q1 2026 firm goals aligned with the Jennifer dashboard. */
/** Reassign (do not mutate in place) so `useSyncExternalStore` snapshots change after updates. */
export let FIRM_GOAL_DEFINITIONS: FirmGoalDefinition[] = [
  {
    id: 'quarterly_revenue',
    goalTemplateId: 'revenue_quarterly',
    title: 'Hit Q1 quarterly revenue target of $1.5M',
    metricHint: 'Q1 2026 billed revenue vs $1.5M target',
    progressCurrentLabel: '$987K current',
    progressTargetLabel: '$1.5M target',
    progressPct: 65.8,
    status: 'on_track',
    dashboardInsight: "12 active matters suggest you'll exceed target by 8%",
    valueFormat: 'currency',
    currentValue: 987000,
    targetValue: 1500000,
    targetDeadline: '2026-09-30',
    benchmark: {
      trailingAverage: 1410000,
      peerRegionalAverage: 1630000,
      regionLabel: 'Pacific Northwest mid-market firms',
    },
    aiOptimization: {
      recommendedTargetValue: 1560000,
      rationale:
        'Ambient CFO projects a realistic stretch target based on trailing billing velocity, a stronger collections trend, and expected productivity from recent associate onboarding.',
      billingVelocityNote: 'Current billed pace annualizes to ~$1.48M if sustained.',
      operationalChangesNote: 'Two recent hires are expected to lift billable capacity by ~6% over the next two quarters.',
    },
  },
  {
    id: 'operating_margin',
    goalTemplateId: 'operating_margin',
    title: 'Maintain operating margin at 40%',
    metricHint: 'Operating income ÷ gross revenue (MTD)',
    progressCurrentLabel: '37% current',
    progressTargetLabel: '40% target',
    progressPct: 92.5,
    status: 'on_track',
    dashboardInsight: 'Operating margin holding steady at 37%—on pace for Q1 target',
    valueFormat: 'percent',
    currentValue: 37,
    targetValue: 40,
    targetDeadline: '2026-12-31',
    benchmark: {
      trailingAverage: 36.2,
      peerRegionalAverage: 39.4,
      regionLabel: 'Pacific Northwest mid-market firms',
    },
    aiOptimization: {
      recommendedTargetValue: 39,
      rationale:
        'Ambient CFO recommends a pragmatic margin target given current expense pressure and likely realization rates through year-end.',
      billingVelocityNote: 'Current realization supports a steady-state margin around 38–39%.',
      operationalChangesNote: 'New team capacity should improve leverage, but onboarding cost keeps near-term margin expansion moderate.',
    },
  },
  {
    id: 'days_sales_outstanding',
    goalTemplateId: 'dso_days',
    title: 'Reduce days sales outstanding to ≤ 45 days',
    metricHint: 'Firmwide invoice-to-cash (rolling 90 days)',
    progressCurrentLabel: '52 days current',
    progressTargetLabel: '≤ 45 days target',
    progressPct: 86.5,
    status: 'on_track',
    dashboardInsight: 'DSO at 52 days—improving trend puts Q1 target within reach',
    valueFormat: 'days',
    currentValue: 52,
    targetValue: 45,
    targetDeadline: '2026-08-31',
    benchmark: {
      trailingAverage: 50,
      peerRegionalAverage: 43,
      regionLabel: 'Pacific Northwest mid-market firms',
    },
    aiOptimization: {
      recommendedTargetValue: 44,
      rationale:
        'Ambient CFO sees an achievable reduction in days-to-collect through targeted reminder campaigns and faster draft-invoice turnarounds.',
      billingVelocityNote: 'Recent invoice cycle-time improvements should reduce collection lag by 6-8 days.',
      operationalChangesNote: 'Additional billing support improves follow-up cadence on aging receivables.',
    },
  },
  {
    id: 'cash_runway',
    goalTemplateId: 'cash_runway_days',
    title: 'Maintain cash runway of ≥ 90 days',
    metricHint: 'Operating cash ÷ average daily burn',
    progressCurrentLabel: '74 days current',
    progressTargetLabel: '≥ 90 days target',
    progressPct: 82.2,
    status: 'at_risk',
    dashboardInsight: 'Convert unbilled time faster to add 12 days runway',
    valueFormat: 'days',
    currentValue: 74,
    targetValue: 90,
    targetDeadline: '2026-10-31',
    benchmark: {
      trailingAverage: 76,
      peerRegionalAverage: 88,
      regionLabel: 'Pacific Northwest mid-market firms',
    },
    aiOptimization: {
      recommendedTargetValue: 84,
      rationale:
        'Ambient CFO recommends a staged runway goal that balances payroll certainty with current burn-rate reality.',
      billingVelocityNote: 'Collections + WIP conversion mix supports a near-term runway stabilization in the mid-80-day range.',
      operationalChangesNote: 'Recent hiring raises burn initially, then improves throughput as utilization ramps.',
    },
  },
];

const firmGoalListeners = new Set<() => void>();

function emitFirmGoalChange() {
  for (const listener of firmGoalListeners) listener();
}

function formatValue(value: number, format: FirmGoalValueFormat): string {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (format === 'percent') return `${value}%`;
  return `${value} days`;
}

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Number(n.toFixed(1))));
}

function calcProgressPct(goal: Pick<FirmGoalDefinition, 'valueFormat' | 'currentValue' | 'targetValue'>): number {
  if (goal.targetValue <= 0) return 0;
  if (goal.valueFormat === 'days') return clampPct((goal.targetValue / goal.currentValue) * 100);
  return clampPct((goal.currentValue / goal.targetValue) * 100);
}

function inferStatus(progressPct: number): FirmGoalStatus {
  if (progressPct >= 100) return 'on_track';
  if (progressPct >= 85) return 'behind';
  return 'at_risk';
}

function recomputeDerived(goal: FirmGoalDefinition): FirmGoalDefinition {
  const currentLabel = `${formatValue(goal.currentValue, goal.valueFormat)} current`;
  const targetPrefix = goal.valueFormat === 'days' ? '≤ ' : '';
  const targetLabel = `${targetPrefix}${formatValue(goal.targetValue, goal.valueFormat)} target`;
  const progressPct = calcProgressPct(goal);
  return {
    ...goal,
    progressCurrentLabel: currentLabel,
    progressTargetLabel: targetLabel,
    progressPct,
    status: inferStatus(progressPct),
  };
}

export function subscribeFirmGoals(listener: () => void): () => void {
  firmGoalListeners.add(listener);
  return () => {
    firmGoalListeners.delete(listener);
  };
}

export function getFirmGoalsSnapshot(): FirmGoalDefinition[] {
  return FIRM_GOAL_DEFINITIONS;
}

export function useFirmGoalsState(): FirmGoalDefinition[] {
  return React.useSyncExternalStore(subscribeFirmGoals, getFirmGoalsSnapshot, getFirmGoalsSnapshot);
}

export function updateFirmGoal(
  goalId: string,
  patch: Partial<Pick<FirmGoalDefinition, 'targetValue' | 'targetDeadline' | 'title' | 'goalTemplateId'>>,
): void {
  const idx = FIRM_GOAL_DEFINITIONS.findIndex((g) => g.id === goalId);
  if (idx < 0) return;
  const base = FIRM_GOAL_DEFINITIONS[idx]!;
  let merged: FirmGoalDefinition = { ...base, ...patch };

  if (patch.goalTemplateId !== undefined && patch.goalTemplateId !== base.goalTemplateId) {
    const tpl = getFinancialGoalTemplate(patch.goalTemplateId);
    if (tpl) {
      merged = {
        ...merged,
        goalTemplateId: tpl.id,
        valueFormat: tpl.valueFormat,
        metricHint: tpl.metricHintSeed,
      };
    }
  }

  const next = recomputeDerived(merged);
  FIRM_GOAL_DEFINITIONS = FIRM_GOAL_DEFINITIONS.map((g, i) => (i === idx ? next : g));
  emitFirmGoalChange();
}

export function deleteFirmGoal(goalId: string): boolean {
  const idx = FIRM_GOAL_DEFINITIONS.findIndex((g) => g.id === goalId);
  if (idx < 0) return false;
  FIRM_GOAL_DEFINITIONS = FIRM_GOAL_DEFINITIONS.filter((g) => g.id !== goalId);
  emitFirmGoalChange();
  return true;
}

export function addFirmGoal(): FirmGoalDefinition {
  const defaultTpl = getFinancialGoalTemplate('revenue_quarterly');
  const valueFormat = defaultTpl?.valueFormat ?? 'currency';
  const metricHint = defaultTpl?.metricHintSeed ?? 'Quarter billed revenue vs target';

  const newGoal: FirmGoalDefinition = {
    id: `custom_goal_${Date.now()}`,
    goalTemplateId: 'revenue_quarterly',
    title: 'New financial goal',
    metricHint,
    progressCurrentLabel: '$0 current',
    progressTargetLabel: '$100,000 target',
    progressPct: 0,
    status: 'at_risk',
    dashboardInsight: 'Define a realistic target and deadline, then optimize with Ambient CFO.',
    valueFormat,
    currentValue: 0,
    targetValue: 100000,
    targetDeadline: '2026-12-31',
    benchmark: {
      trailingAverage: 75000,
      peerRegionalAverage: 110000,
      regionLabel: 'Pacific Northwest mid-market firms',
    },
    aiOptimization: {
      recommendedTargetValue: 95000,
      rationale:
        'Ambient CFO uses your current run-rate and peer context to suggest an achievable initial target for this custom goal.',
      billingVelocityNote: 'Current velocity supports a phased ramp toward this target.',
      operationalChangesNote: 'Recent staffing and workflow changes can improve attainment consistency over time.',
    },
  };
  FIRM_GOAL_DEFINITIONS = [...FIRM_GOAL_DEFINITIONS, newGoal];
  emitFirmGoalChange();
  return newGoal;
}

export function mapFirmGoalStatusToDashboard(status: FirmGoalStatus): FirmGoalDashboardCard['status'] {
  if (status === 'on_track') return 'on-track';
  if (status === 'at_risk') return 'at-risk';
  return 'behind';
}

export function getFirmGoalDashboardCards(): FirmGoalDashboardCard[] {
  return FIRM_GOAL_DEFINITIONS.map((goal) => {
    const tpl = getFinancialGoalTemplate(goal.goalTemplateId);
    return {
      id: goal.id,
      goal: goal.title,
      templateLabel: tpl?.label ?? 'Custom goal',
      target: goal.progressTargetLabel.replace(' target', ''),
      current: goal.progressCurrentLabel.replace(' current', ''),
      progress: goal.progressPct,
      status: mapFirmGoalStatusToDashboard(goal.status),
      insight: goal.dashboardInsight,
    };
  });
}

export function getFirmGoalById(goalId: string): FirmGoalDefinition | null {
  return FIRM_GOAL_DEFINITIONS.find((g) => g.id === goalId) ?? null;
}

export function firmGoalsOnTrackCount(): { onTrack: number; total: number } {
  const total = FIRM_GOAL_DEFINITIONS.length;
  const onTrack = FIRM_GOAL_DEFINITIONS.filter((g) => g.status === 'on_track').length;
  return { onTrack, total };
}
