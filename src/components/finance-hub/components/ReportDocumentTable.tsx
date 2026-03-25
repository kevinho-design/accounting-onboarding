import React from 'react';
import { periodPresetLabel } from '../data/profitLossReportModel';
import type { ReportTableRow } from '../data/reportDocumentSeed';
import {
  DEFAULT_STANDARD_REPORT_VIEW_STATE,
  standardReportBasisLabel,
  standardReportPeriodLabel,
} from '../data/standardReportModel';
import { ReportDataTablePolaris } from './ReportDataTablePolaris';
import { ReportTableExportActions, ReportTablePeriodChip } from './ReportTablePeriodChrome';
import { ReportTableToolbar } from './ReportTableToolbar';
import { reportRowsToPolarisModel } from './reportTableAdapters';
import { useReportTableState } from './useReportTableState';

type ReportDocumentTableProps = {
  rows: ReportTableRow[];
  /** Tighter padding for widget embed */
  compact?: boolean;
  /** Use inside an existing card (no double chrome). */
  surface?: 'card' | 'flush';
};

const SIMPLE_REPORT_STUB = DEFAULT_STANDARD_REPORT_VIEW_STATE;

export function ReportDocumentTable({ rows, compact, surface }: ReportDocumentTableProps) {
  const effectiveSurface = surface ?? (compact ? 'flush' : 'card');
  const model = React.useMemo(() => reportRowsToPolarisModel(rows), [rows]);
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

  return (
    <ReportDataTablePolaris
      surface={effectiveSurface}
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
      fixedFirstColumns={!compact ? 1 : 0}
      truncate={false}
      verticalAlign="top"
      footerContent={
        compact ? undefined : (
          <span>Sample report data for prototyping · not connected to a live ledger</span>
        )
      }
      toolbar={
        compact ? null : (
          <ReportTableToolbar
            leading={
              <>
                <ReportTablePeriodChip
                  presetLabel={periodPresetLabel(SIMPLE_REPORT_STUB.period)}
                  rangeLabel={standardReportPeriodLabel(SIMPLE_REPORT_STUB)}
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Basis: {standardReportBasisLabel(SIMPLE_REPORT_STUB)}
                </span>
              </>
            }
            trailing={<ReportTableExportActions />}
            value={st.searchQuery}
            onChange={st.setSearchQuery}
            onReset={st.reset}
          />
        )
      }
      pagination={pagination}
      scrollClassName={
        compact ? 'max-h-[min(70vh,480px)]' : 'max-h-[min(70vh,560px)] min-h-[500px]'
      }
    />
  );
}
