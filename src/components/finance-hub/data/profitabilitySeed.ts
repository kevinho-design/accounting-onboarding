/**
 * Synthetic monthly P&L-style series aligned to strategic dashboard months.
 * Used by Finances profitability widgets; merged into BriefingFinancialSnapshot.
 */

import { strategicData } from './strategicDashboardSeed';

export type RevenueStreamMonthRow = {
  month: string;
  hourly: number;
  flatFee: number;
  referral: number;
  other: number;
};

export type ExpenseStackedMonthRow = {
  month: string;
  Payroll: number;
  Marketing: number;
  Software: number;
  Office: number;
};

export type ProfitabilityMarginMonthRow = {
  month: string;
  /** Total revenue ($k) */
  revenue: number;
  /** Total operating expenses ($k) */
  expenses: number;
  /** (revenue - expenses) / revenue × 100 */
  operatingMarginPct: number;
};

/** Colors aligned with expense_rep / DEFAULT_EXPENSES */
export const EXPENSE_STACK_COLORS: Record<keyof Omit<ExpenseStackedMonthRow, 'month'>, string> = {
  Payroll: 'var(--chart-cobalt)',
  Marketing: 'var(--chart-emerald)',
  Software: 'var(--brand-amber)',
  Office: 'color-mix(in srgb, var(--brand-carbon) 45%, #ffffff)',
};

export const REVENUE_STREAM_COLORS = {
  hourly: 'var(--chart-ocean)',
  flatFee: 'var(--chart-cobalt)',
  referral: 'var(--chart-emerald)',
  other: 'color-mix(in srgb, var(--brand-carbon) 38%, #ffffff)',
} as const;

export const REVENUE_STREAM_LABELS: Record<keyof Omit<RevenueStreamMonthRow, 'month'>, string> = {
  hourly: 'Hourly',
  flatFee: 'Flat fee',
  referral: 'Referral / co-counsel',
  other: 'Other',
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Baseline revenue streams ($k) derived from a modest growth path with seasonal noise. */
export function buildBaseRevenueStreamsTrend(): RevenueStreamMonthRow[] {
  return strategicData.map((row, i) => {
    const base = 560 + i * 14 + (i % 4) * 18 - (i > 6 ? 22 : 0);
    const hourly = round1(base * 0.5);
    const flatFee = round1(base * 0.3);
    const referral = round1(base * 0.1);
    const other = round1(Math.max(28, base - hourly - flatFee - referral));
    return {
      month: row.month,
      hourly,
      flatFee,
      referral,
      other,
    };
  });
}

/** Baseline expense stacks ($k) — shares loosely track monthly burn shape. */
export function buildBaseExpenseStackedTrend(): ExpenseStackedMonthRow[] {
  return strategicData.map((row) => {
    const b = row.burn / 1000;
    const payroll = round1(b * 0.63);
    const marketing = round1(b * 0.2);
    const software = round1(b * 0.11);
    const office = round1(Math.max(2.5, b - payroll - marketing - software));
    return {
      month: row.month,
      Payroll: payroll,
      Marketing: marketing,
      Software: software,
      Office: office,
    };
  });
}

export function computeProfitabilityMarginTrend(
  streams: readonly RevenueStreamMonthRow[],
  expenses: readonly ExpenseStackedMonthRow[],
): ProfitabilityMarginMonthRow[] {
  return streams.map((s, i) => {
    const e = expenses[i];
    const revenue = round1(s.hourly + s.flatFee + s.referral + s.other);
    const expT = e
      ? round1(e.Payroll + e.Marketing + e.Software + e.Office)
      : 0;
    const operatingMarginPct =
      revenue > 0 ? round1(((revenue - expT) / revenue) * 100) : 0;
    return {
      month: s.month,
      revenue,
      expenses: expT,
      operatingMarginPct,
    };
  });
}

export function buildBaseProfitabilityPackage(): {
  revenueStreamsTrend: RevenueStreamMonthRow[];
  expenseStackedTrend: ExpenseStackedMonthRow[];
  profitabilityMarginTrend: ProfitabilityMarginMonthRow[];
} {
  const revenueStreamsTrend = buildBaseRevenueStreamsTrend();
  const expenseStackedTrend = buildBaseExpenseStackedTrend();
  const profitabilityMarginTrend = computeProfitabilityMarginTrend(
    revenueStreamsTrend,
    expenseStackedTrend,
  );
  return { revenueStreamsTrend, expenseStackedTrend, profitabilityMarginTrend };
}
