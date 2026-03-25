/**
 * Shared filters + derived rows for non–P&L reports (Balance Sheet, Cash Flow, etc.).
 */

import { getReportTableRows } from './reportDocumentSeed';
import { parseReportCurrency } from './reportTableParse';
import {
  matterFilterScale,
  reportPeriodScale,
  reportPriorPeriodFactor,
  type LeadAttorneyId,
  type MatterTypeId,
  type PlBasis,
  type PlComparison,
  type PlPeriodPreset,
  type PracticeAreaId,
} from './profitLossReportModel';

export type StandardReportViewState = {
  practiceArea: PracticeAreaId;
  leadAttorney: LeadAttorneyId;
  matterType: MatterTypeId;
  basis: PlBasis;
  period: PlPeriodPreset;
  comparison: PlComparison;
  showPctOfTotal: boolean;
  showBudgetVariance: boolean;
};

export const DEFAULT_STANDARD_REPORT_VIEW_STATE: StandardReportViewState = {
  practiceArea: 'all',
  leadAttorney: 'all',
  matterType: 'all',
  basis: 'accrual',
  period: 'this_month',
  comparison: 'none',
  showPctOfTotal: false,
  showBudgetVariance: false,
};

export type FilteredReportDisplayRow = {
  account: string;
  amount: string;
  prior?: string;
  budget?: string;
  variance?: string;
  pctOfTotal?: string;
  isHeader?: boolean;
  isTotal?: boolean;
  isGrandTotal?: boolean;
  payroll?: boolean;
};

function parseCell(s: string): number | null {
  return parseReportCurrency(s);
}

function fmtCurrency(n: number): string {
  const abs = Math.abs(n);
  const fmt = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n < 0) return `($${fmt})`;
  if (n === 0) return '—';
  return `$${fmt}`;
}

/** Apply matter/period/basis scaling + optional comparison, budget, % of grand total. */
export function deriveFilteredReportRows(
  reportName: string,
  state: StandardReportViewState,
): FilteredReportDisplayRow[] {
  const base = getReportTableRows(reportName);
  const dim = matterFilterScale(state);
  const pScale = reportPeriodScale(state.period);
  const priorF = reportPriorPeriodFactor(state.comparison, state.period);
  const basisAdj = state.basis === 'cash' ? 0.97 : 1;
  const global = dim * pScale * basisAdj;

  const scaled = base.map((r) => {
    const n = parseCell(r.amount);
    return n == null ? null : n * global;
  });

  let denom = 0;
  const grandIdx = base.findIndex((r) => r.isGrandTotal);
  if (grandIdx >= 0 && scaled[grandIdx] != null) {
    denom = Math.abs(scaled[grandIdx]!);
  }
  if (denom < 1) {
    denom = scaled.reduce((m, n) => (n != null ? Math.max(m, Math.abs(n)) : m), 0) || 1;
  }

  return base.map((r, i) => {
    const cur = scaled[i];
    const row: FilteredReportDisplayRow = {
      account: r.account,
      amount: cur == null ? r.amount : fmtCurrency(cur),
      isHeader: r.isHeader,
      isTotal: r.isTotal,
      isGrandTotal: r.isGrandTotal,
      payroll: r.payroll,
    };
    if (cur == null) return row;
    if (state.comparison !== 'none') {
      row.prior = fmtCurrency(cur * priorF);
    }
    if (state.showBudgetVariance) {
      const budgetNoise = 0.92 + (i % 7) * 0.015;
      const bud = cur * budgetNoise;
      row.budget = fmtCurrency(bud);
      row.variance = fmtCurrency(cur - bud);
    }
    if (state.showPctOfTotal) {
      row.pctOfTotal = `${((cur / denom) * 100).toFixed(1)}%`;
    }
    return row;
  });
}

export function standardReportPeriodLabel(state: StandardReportViewState): string {
  switch (state.period) {
    case 'this_month':
      return 'Jan 1 – Jan 31, 2026';
    case 'last_month':
      return 'Dec 1 – Dec 31, 2025';
    case 'ytd':
      return 'Jan 1 – Jan 31, 2026 (YTD slice)';
    default:
      return '';
  }
}

export function standardReportBasisLabel(state: StandardReportViewState): string {
  return state.basis === 'accrual' ? 'Accrual' : 'Cash';
}
