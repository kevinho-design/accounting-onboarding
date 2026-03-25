/**
 * Cumulative financial snapshot after users execute "Take Action" / briefing plans.
 * Drives strategic series + widget charts so dashboards reflect applied plans.
 */

import type { BriefingInsightId } from './briefingPanelContent';
import { strategicData, type StrategicMonthRow } from './strategicDashboardSeed';
import {
  buildBaseExpenseStackedTrend,
  buildBaseRevenueStreamsTrend,
  computeProfitabilityMarginTrend,
  type ExpenseStackedMonthRow,
  type ProfitabilityMarginMonthRow,
  type RevenueStreamMonthRow,
} from './profitabilitySeed';

export type ArAgingBucket = { name: string; value: number; color: string };
export type ExpenseBucket = { name: string; value: number; color: string };

export type BriefingFinancialSnapshot = {
  strategicRows: StrategicMonthRow[];
  runwayTrend: { month: string; runway: number }[];
  cashFlowBars: { month: string; in: number; out: number }[];
  arAging: ArAgingBucket[];
  expenseRep: ExpenseBucket[];
  revenue: {
    pieCurrent: number;
    pieRemaining: number;
    centerPct: number;
    subtitle: string;
    footerAmount: number;
  };
  financialGoals: {
    q3Current: number;
    q3Target: number;
    q3ProgressPct: number;
    reserveCurrent: number;
    reserveTarget: number;
    reserveProgressPct: number;
  };
  /** Revenue streams ($k) by month — profitability widget */
  revenueStreamsTrend: RevenueStreamMonthRow[];
  /** Expense categories ($k) stacked by month */
  expenseStackedTrend: ExpenseStackedMonthRow[];
  /** Revenue, expenses, operating margin % by month */
  profitabilityMarginTrend: ProfitabilityMarginMonthRow[];
};

const DEFAULT_AR: ArAgingBucket[] = [
  { name: '0-30 Days', value: 45000, color: 'var(--chart-ocean)' },
  { name: '31-60 Days', value: 25000, color: 'var(--chart-cobalt)' },
  { name: '61-90 Days', value: 10000, color: 'var(--chart-sky)' },
  { name: '90+ Days', value: 5000, color: 'var(--chart-coral)' },
];

const DEFAULT_EXPENSES: ExpenseBucket[] = [
  { name: 'Payroll', value: 45000, color: 'var(--chart-cobalt)' },
  { name: 'Marketing', value: 15000, color: 'var(--chart-emerald)' },
  { name: 'Software', value: 8000, color: 'var(--brand-amber)' },
  { name: 'Office', value: 4000, color: 'color-mix(in srgb, var(--brand-carbon) 45%, #ffffff)' },
];

function cloneStrategicRows(): StrategicMonthRow[] {
  return strategicData.map((r) => ({ ...r }));
}

function cloneAr(): ArAgingBucket[] {
  return DEFAULT_AR.map((b) => ({ ...b }));
}

function cloneExpenses(): ExpenseBucket[] {
  return DEFAULT_EXPENSES.map((b) => ({ ...b }));
}

function clampRunway(row: StrategicMonthRow): StrategicMonthRow {
  const runway = Number((row.cash / row.burn).toFixed(1));
  return { ...row, runway: Math.min(30, Math.max(8, runway)) };
}

/** Percent 0–100 with one decimal (e.g. 66.7). */
function pctToward(numer: number, denom: number): number {
  if (denom <= 0) return 0;
  return Math.min(100, Math.round((numer / denom) * 1000) / 10);
}

/** Operating-style in/out bars scaled from cash path + burn (updates when baseline moves). */
export function strategicRowsToCashFlowBars(
  rows: Pick<StrategicMonthRow, 'month' | 'cash' | 'burn'>[],
): { month: string; in: number; out: number }[] {
  return rows.map((row, i) => {
    const prev = rows[i - 1];
    const out = Math.max(85, Math.round(row.burn / 450));
    const netCash = prev ? row.cash - prev.cash : 0;
    const inN = Math.max(95, Math.round(row.burn / 350 + netCash / 8000));
    return { month: row.month, in: inN, out };
  });
}

function applyInsightStrategic(rows: StrategicMonthRow[], id: BriefingInsightId): StrategicMonthRow[] {
  switch (id) {
    case 'insight-1': {
      const bumps = [0, 8000, 16000, 21000, 0, 0, 0, 0, 0, 0];
      return rows.map((row, i) => ({
        ...row,
        cash: row.cash + (bumps[i] ?? 0),
      }));
    }
    case 'insight-2': {
      return rows.map((row, i) => ({
        ...row,
        cash: row.cash + (i === 0 ? 120000 : 0),
      }));
    }
    case 'insight-3': {
      return rows.map((row, i) =>
        i >= 2 ? { ...row, burn: Math.max(38000, row.burn - 1600) } : { ...row },
      );
    }
    case 'insight-4': {
      /** Collections + invoicing + payroll bridge: stronger near-term cash path than insight-1 alone */
      const bumps = [0, 12000, 26000, 34000, 28000, 15000, 0, 0, 0, 0];
      return rows.map((row, i) => ({
        ...row,
        cash: row.cash + (bumps[i] ?? 0),
      }));
    }
    default:
      return rows;
  }
}

function applyInsightAr(ar: ArAgingBucket[], id: BriefingInsightId): ArAgingBucket[] {
  const next = ar.map((b) => ({ ...b }));
  const idx = (name: string) => next.find((b) => b.name === name);
  if (id === 'insight-1') {
    const b030 = idx('0-30 Days');
    const b3160 = idx('31-60 Days');
    const b6190 = idx('61-90 Days');
    if (b030 && b3160 && b6190) {
      const move3160 = 12000;
      const move6190 = 8000;
      b3160.value = Math.max(0, b3160.value - move3160);
      b6190.value = Math.max(0, b6190.value - move6190);
      b030.value += move3160 + move6190;
    }
  }
  if (id === 'insight-2') {
    const b030 = idx('0-30 Days');
    if (b030) b030.value += 12000;
  }
  if (id === 'insight-4') {
    const b030 = idx('0-30 Days');
    const b3160 = idx('31-60 Days');
    const b90 = idx('90+ Days');
    if (b030 && b3160 && b90) {
      const from3160 = 18000;
      const from90 = 6000;
      b3160.value = Math.max(0, b3160.value - from3160);
      b90.value = Math.max(0, b90.value - from90);
      b030.value += from3160 + from90;
    }
  }
  return next;
}

function applyInsightExpenses(exp: ExpenseBucket[], id: BriefingInsightId): ExpenseBucket[] {
  const next = exp.map((b) => ({ ...b }));
  if (id === 'insight-3') {
    const sw = next.find((b) => b.name === 'Software');
    if (sw) sw.value = Math.max(2000, sw.value - 2800);
  }
  return next;
}

function cloneRevenueStreams(rows: RevenueStreamMonthRow[]): RevenueStreamMonthRow[] {
  return rows.map((r) => ({ ...r }));
}

function cloneExpenseStacked(rows: ExpenseStackedMonthRow[]): ExpenseStackedMonthRow[] {
  return rows.map((r) => ({ ...r }));
}

/** Nudge profitability trends when briefing plans execute (prototype). */
function applyInsightProfitabilityTrends(
  streams: RevenueStreamMonthRow[],
  stacked: ExpenseStackedMonthRow[],
  id: BriefingInsightId,
): void {
  if (id === 'insight-1') {
    for (let i = 0; i < Math.min(4, streams.length); i++) {
      streams[i]!.hourly = Math.round((streams[i]!.hourly + 14) * 10) / 10;
    }
  }
  if (id === 'insight-2') {
    for (const r of streams) {
      r.hourly = Math.round(r.hourly * 1.038 * 10) / 10;
      r.flatFee = Math.round(r.flatFee * 1.038 * 10) / 10;
      r.referral = Math.round(r.referral * 1.038 * 10) / 10;
      r.other = Math.round(r.other * 1.038 * 10) / 10;
    }
  }
  if (id === 'insight-3') {
    for (let i = 2; i < stacked.length; i++) {
      stacked[i]!.Software = Math.max(1.5, Math.round(stacked[i]!.Software * 0.62 * 10) / 10);
      stacked[i]!.Marketing = Math.round(Math.max(2, stacked[i]!.Marketing - 1.2) * 10) / 10;
    }
  }
  if (id === 'insight-4') {
    for (let i = 0; i < Math.min(5, streams.length); i++) {
      streams[i]!.hourly = Math.round((streams[i]!.hourly + 10) * 10) / 10;
      streams[i]!.flatFee = Math.round((streams[i]!.flatFee + 6) * 10) / 10;
    }
  }
}

/** Build full dashboard snapshot from executed briefing plans (order-preserving, de-duped by caller). */
export function buildBriefingFinancialSnapshot(
  executedInsights: readonly BriefingInsightId[],
): BriefingFinancialSnapshot {
  let rows = cloneStrategicRows();
  let ar = cloneAr();
  let expenses = cloneExpenses();
  let revenue = {
    pieCurrent: 75,
    pieRemaining: 25,
    centerPct: 75,
    subtitle: 'of $1M goal',
    footerAmount: 750000,
  };
  let financialGoals = {
    q3Current: 450000,
    q3Target: 500000,
    q3ProgressPct: 90,
    reserveCurrent: 80000,
    reserveTarget: 120000,
    reserveProgressPct: pctToward(80000, 120000),
  };

  let revenueStreamsTrend = cloneRevenueStreams(buildBaseRevenueStreamsTrend());
  let expenseStackedTrend = cloneExpenseStacked(buildBaseExpenseStackedTrend());

  for (const id of executedInsights) {
    rows = applyInsightStrategic(rows, id).map(clampRunway);
    ar = applyInsightAr(ar, id);
    expenses = applyInsightExpenses(expenses, id);
    applyInsightProfitabilityTrends(revenueStreamsTrend, expenseStackedTrend, id);

    if (id === 'insight-2') {
      revenue = {
        pieCurrent: 82,
        pieRemaining: 18,
        centerPct: 82,
        subtitle: 'of $1M goal',
        footerAmount: 820000,
      };
      financialGoals = {
        ...financialGoals,
        q3Current: 480000,
      };
    }
    if (id === 'insight-1') {
      financialGoals = {
        ...financialGoals,
        reserveCurrent: Math.min(financialGoals.reserveTarget, financialGoals.reserveCurrent + 12000),
      };
    }
    if (id === 'insight-3') {
      financialGoals = {
        ...financialGoals,
        reserveCurrent: Math.min(financialGoals.reserveTarget, financialGoals.reserveCurrent + 8000),
      };
    }
    if (id === 'insight-4') {
      financialGoals = {
        ...financialGoals,
        reserveCurrent: Math.min(financialGoals.reserveTarget, financialGoals.reserveCurrent + 18000),
      };
    }
  }

  financialGoals = {
    ...financialGoals,
    q3ProgressPct: pctToward(financialGoals.q3Current, financialGoals.q3Target),
    reserveProgressPct: pctToward(financialGoals.reserveCurrent, financialGoals.reserveTarget),
  };

  const runwayTrend = rows.map((r) => ({ month: r.month, runway: r.runway }));
  const cashFlowBars = strategicRowsToCashFlowBars(rows);
  const profitabilityMarginTrend = computeProfitabilityMarginTrend(
    revenueStreamsTrend,
    expenseStackedTrend,
  );

  return {
    strategicRows: rows,
    runwayTrend,
    cashFlowBars,
    arAging: ar,
    expenseRep: expenses,
    revenue,
    financialGoals,
    revenueStreamsTrend,
    expenseStackedTrend,
    profitabilityMarginTrend,
  };
}
