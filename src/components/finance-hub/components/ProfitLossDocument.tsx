import React from 'react';
import { FIRM_NAME } from '../data/prototypePersona';
import {
  deriveProfitLossRows,
  periodPresetLabel,
  profitLossBasisLabel,
  profitLossCollectionIndex,
  profitLossPeriodLabel,
  type ProfitLossViewState,
} from '../data/profitLossReportModel';
import { ProfitLossReportChrome } from './ProfitLossReportChrome';
import { ProfitLossTable } from './ProfitLossTable';
import { ReportTableExportActions, ReportTablePeriodChip } from './ReportTablePeriodChrome';

type ProfitLossDocumentProps = {
  viewState: ProfitLossViewState;
  onViewChange: (patch: Partial<ProfitLossViewState>) => void;
};

export function ProfitLossDocument({ viewState, onViewChange }: ProfitLossDocumentProps) {
  const rows = React.useMemo(() => deriveProfitLossRows(viewState), [viewState]);
  const coll = profitLossCollectionIndex(viewState);

  return (
    <div className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden">
      <ProfitLossReportChrome
        state={viewState}
        onChange={onViewChange}
        collectionHint={coll?.label ?? null}
        className="rounded-none border-0 shadow-none bg-muted/30"
      />
      <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
        <h2 className="text-lg font-bold text-gray-900">{FIRM_NAME}</h2>
        <p className="text-xs text-gray-500 mt-0.5">Profit and loss statement</p>
      </div>
      <div className="border-t border-gray-100">
        <ProfitLossTable
          rows={rows}
          showPrior={viewState.comparison !== 'none'}
          showBudgetVariance={viewState.showBudgetVariance}
          showPctColumn={viewState.showPctOfRevenue}
          pctColumnHeader="% of rev."
          surface="flush"
          toolbarLeading={
            <>
              <ReportTablePeriodChip
                presetLabel={periodPresetLabel(viewState.period)}
                rangeLabel={profitLossPeriodLabel(viewState)}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                Basis: {profitLossBasisLabel(viewState)}
              </span>
              {coll ? (
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  DSO index: {coll.dso} days
                </span>
              ) : null}
            </>
          }
          toolbarTrailing={<ReportTableExportActions />}
        />
      </div>
    </div>
  );
}
