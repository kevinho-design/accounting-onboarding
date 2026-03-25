import React from 'react';
import { FIRM_NAME } from '../data/prototypePersona';
import { periodPresetLabel } from '../data/profitLossReportModel';
import {
  deriveFilteredReportRows,
  standardReportBasisLabel,
  standardReportPeriodLabel,
  type StandardReportViewState,
} from '../data/standardReportModel';
import { ProfitLossTable } from './ProfitLossTable';
import { StandardReportFiltersChrome } from './StandardReportFiltersChrome';
import { ReportTableExportActions, ReportTablePeriodChip } from './ReportTablePeriodChrome';

type FilteredReportDocumentProps = {
  reportName: string;
  viewState: StandardReportViewState;
  onViewChange: (patch: Partial<StandardReportViewState>) => void;
};

export function FilteredReportDocument({
  reportName,
  viewState,
  onViewChange,
}: FilteredReportDocumentProps) {
  const rows = React.useMemo(
    () => deriveFilteredReportRows(reportName, viewState),
    [reportName, viewState],
  );

  return (
    <div className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden">
      <StandardReportFiltersChrome
        state={viewState}
        onChange={onViewChange}
        className="rounded-none border-0 shadow-none bg-muted/30"
      />
      <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
        <h2 className="text-lg font-bold text-gray-900">{FIRM_NAME}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{reportName}</p>
      </div>
      <div className="border-t border-gray-100">
        <ProfitLossTable
          rows={rows}
          showPrior={viewState.comparison !== 'none'}
          showBudgetVariance={viewState.showBudgetVariance}
          showPctColumn={viewState.showPctOfTotal}
          pctColumnHeader="% of total"
          surface="flush"
          toolbarLeading={
            <>
              <ReportTablePeriodChip
                presetLabel={periodPresetLabel(viewState.period)}
                rangeLabel={standardReportPeriodLabel(viewState)}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Basis: {standardReportBasisLabel(viewState)}
              </span>
            </>
          }
          toolbarTrailing={<ReportTableExportActions />}
        />
      </div>
    </div>
  );
}
