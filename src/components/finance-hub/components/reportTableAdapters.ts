import type * as React from 'react';
import type { ReportTableRow } from '../data/reportDocumentSeed';
import { parseReportCurrency, parseReportPercent } from '../data/reportTableParse';
import type { ProfitLossDisplayRow } from '../data/profitLossReportModel';
import type { FilteredReportDisplayRow } from '../data/standardReportModel';
import type { ReportPolarisColumnType, ReportPolarisRow } from './reportPolarisTypes';
import { inferRowKind } from './reportPolarisTypes';

export type MetricsTableRow = ProfitLossDisplayRow | FilteredReportDisplayRow;

function rowPctColumn(r: MetricsTableRow): string | undefined {
  if ('pctOfRev' in r && r.pctOfRev) return r.pctOfRev;
  if ('pctOfTotal' in r && r.pctOfTotal) return r.pctOfTotal;
  return undefined;
}

export function reportRowsToPolarisModel(rows: ReportTableRow[]): {
  headings: string[];
  columnContentTypes: ReportPolarisColumnType[];
  sortable: boolean[];
  polarisRows: ReportPolarisRow[];
} {
  const polarisRows: ReportPolarisRow[] = rows.map((r, i) => ({
    key: `${r.account}-${i}`,
    kind: inferRowKind(r),
    searchText: r.account,
    cells: [r.account, r.amount],
    sortValues: [null, parseReportCurrency(r.amount)],
  }));
  return {
    headings: ['Account', 'Total'],
    columnContentTypes: ['text', 'numeric'],
    sortable: [true, true],
    polarisRows,
  };
}

export function metricsRowsToPolarisModel(
  rows: MetricsTableRow[],
  opts: {
    showPrior: boolean;
    showBudgetVariance: boolean;
    showPctColumn: boolean;
    pctColumnHeader: string;
  },
): {
  headings: string[];
  columnContentTypes: ReportPolarisColumnType[];
  sortable: boolean[];
  polarisRows: ReportPolarisRow[];
} {
  const headings: string[] = ['Account', 'Current'];
  const columnContentTypes: ReportPolarisColumnType[] = ['text', 'numeric'];
  const sortable: boolean[] = [true, true];
  if (opts.showPrior) {
    headings.push('Prior');
    columnContentTypes.push('numeric');
    sortable.push(true);
  }
  if (opts.showBudgetVariance) {
    headings.push('Budget', 'Variance');
    columnContentTypes.push('numeric', 'numeric');
    sortable.push(true, true);
  }
  if (opts.showPctColumn) {
    headings.push(opts.pctColumnHeader);
    columnContentTypes.push('numeric');
    sortable.push(true);
  }

  const polarisRows: ReportPolarisRow[] = rows.map((r, i) => {
    const cells: React.ReactNode[] = [r.account, r.amount];
    const sortValues: (number | null)[] = [
      null,
      parseReportCurrency(r.amount),
    ];

    if (opts.showPrior) {
      cells.push(r.prior ?? (r.isHeader && !r.isTotal ? '' : '—'));
      sortValues.push(r.prior ? parseReportCurrency(r.prior) : null);
    }
    if (opts.showBudgetVariance) {
      cells.push(r.budget ?? '—', r.variance ?? '—');
      sortValues.push(
        r.budget ? parseReportCurrency(r.budget) : null,
        r.variance ? parseReportCurrency(r.variance) : null,
      );
    }
    if (opts.showPctColumn) {
      const pct = rowPctColumn(r);
      cells.push(pct ?? '—');
      sortValues.push(pct ? parseReportPercent(pct) : null);
    }

    return {
      key: `${r.account}-${i}`,
      kind: inferRowKind(r),
      searchText: r.account,
      cells,
      sortValues,
      dimmed: 'dimmed' in r ? r.dimmed : undefined,
    };
  });

  return { headings, columnContentTypes, sortable, polarisRows };
}
