import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { getReportTableRows } from '../data/reportDocumentSeed';
import type { ProfitLossViewState } from '../data/profitLossReportModel';
import { FIRM_NAME } from '../data/prototypePersona';
import { FilteredReportDocument } from './FilteredReportDocument';
import { ProfitLossDocument } from './ProfitLossDocument';
import { ReportDocumentTable } from './ReportDocumentTable';
import type { StandardReportViewState } from '../data/standardReportModel';
import { cn } from './ui/utils';

export interface ReportDetailProps {
  reportName: string;
  onBack: () => void;
  brandColor?: string;
  profitLossViewState?: ProfitLossViewState;
  onProfitLossChange?: (patch: Partial<ProfitLossViewState>) => void;
  standardReportViewState?: StandardReportViewState;
  onStandardReportChange?: (patch: Partial<StandardReportViewState>) => void;
}

function ReportDocumentCard({
  data,
  reportName,
}: {
  data: ReturnType<typeof getReportTableRows>;
  reportName: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-[12px] shadow-sm overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-6">
        <h2 className="text-lg font-bold text-gray-900">{FIRM_NAME}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{reportName}</p>
      </div>
      <ReportDocumentTable rows={data} surface="flush" />
    </div>
  );
}

export const ReportDetail: React.FC<ReportDetailProps> = ({
  reportName,
  onBack,
  profitLossViewState,
  onProfitLossChange,
  standardReportViewState,
  onStandardReportChange,
}) => {
  const data = getReportTableRows(reportName);
  const isProfitLoss =
    reportName === 'Profit and Loss' && profitLossViewState != null && onProfitLossChange != null;
  const isFilteredStandard =
    reportName !== 'Profit and Loss' &&
    standardReportViewState != null &&
    onStandardReportChange != null;

  const shellClass = cn(
    'mx-auto p-8 pb-32 animate-in fade-in duration-300',
    !isProfitLoss && !isFilteredStandard ? 'max-w-6xl' : 'max-w-[1600px]',
  );

  return (
    <div className={shellClass}>
      <div className="mb-8">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{reportName}</h1>
      </div>

      {isProfitLoss ? (
        <ProfitLossDocument viewState={profitLossViewState} onViewChange={onProfitLossChange} />
      ) : isFilteredStandard ? (
        <FilteredReportDocument
          reportName={reportName}
          viewState={standardReportViewState}
          onViewChange={onStandardReportChange}
        />
      ) : (
        <ReportDocumentCard data={data} reportName={reportName} />
      )}
    </div>
  );
};
