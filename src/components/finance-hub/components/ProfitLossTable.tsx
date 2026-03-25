import * as React from 'react';
import { ReportDataTablePolaris } from './ReportDataTablePolaris';
import { ReportTableToolbar } from './ReportTableToolbar';
import { metricsRowsToPolarisModel, type MetricsTableRow } from './reportTableAdapters';
import { useReportTableState } from './useReportTableState';

type ProfitLossTableProps = {
  rows: MetricsTableRow[];
  showPrior: boolean;
  showBudgetVariance: boolean;
  /** When true, show % column (P&amp;L: revenue; other reports: grand total). */
  showPctColumn: boolean;
  pctColumnHeader?: string;
  compact?: boolean;
  showToolbar?: boolean;
  /** Nested inside document card when `flush`. */
  surface?: 'card' | 'flush';
  /** Period chip / basis hints — table toolbar `leading`. */
  toolbarLeading?: React.ReactNode;
  /** Filter, print, export — table toolbar before Reset. */
  toolbarTrailing?: React.ReactNode;
};

export function ProfitLossTable({
  rows,
  showPrior,
  showBudgetVariance,
  showPctColumn,
  pctColumnHeader = '% of rev.',
  compact,
  showToolbar = true,
  surface = 'flush',
  toolbarLeading,
  toolbarTrailing,
}: ProfitLossTableProps) {
  const model = React.useMemo(
    () =>
      metricsRowsToPolarisModel(rows, {
        showPrior,
        showBudgetVariance,
        showPctColumn,
        pctColumnHeader,
      }),
    [rows, showPrior, showBudgetVariance, showPctColumn, pctColumnHeader],
  );

  const st = useReportTableState(model.polarisRows, {
    enablePagination: !compact,
    defaultPageSize: 25,
  });

  const showPagination = !compact && st.enablePagination && st.totalRows > st.pageSize;
  const pagination = showPagination
    ? {
        page: st.page,
        pageSize: st.pageSize,
        totalRows: st.totalRows,
        onNext: st.goNext,
        onPrevious: st.goPrevious,
        onPageSizeChange: st.setPageSize,
      }
    : null;

  const manyCols = model.headings.length > 3;

  return (
    <ReportDataTablePolaris
      surface={surface}
      headings={model.headings}
      columnContentTypes={model.columnContentTypes}
      rows={st.displayedRows}
      sortable={model.sortable}
      sortColumn={st.sortColumn}
      sortDirection={st.sortDirection}
      onSortColumn={(col) => st.cycleSort(col, Boolean(model.sortable[col]))}
      stickyHeader
      zebra
      increasedTableDensity={Boolean(compact)}
      compact={Boolean(compact)}
      hoverable
      fixedFirstColumns={!compact && manyCols ? 1 : 0}
      truncate={false}
      verticalAlign="top"
      footerContent={
        compact ? undefined : (
          <span>Sample report data for prototyping · filters affect derived rows only</span>
        )
      }
      toolbar={
        showToolbar && !compact ? (
          <ReportTableToolbar
            leading={toolbarLeading}
            trailing={toolbarTrailing}
            value={st.searchQuery}
            onChange={st.setSearchQuery}
            onReset={st.reset}
          />
        ) : null
      }
      pagination={pagination}
    />
  );
}
