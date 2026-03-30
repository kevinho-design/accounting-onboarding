import * as React from 'react';
import { Sparkles, Table2 } from 'lucide-react';

export type ReportObserveOverviewProps = {
  reportName: string;
  onViewFullTable: () => void;
  onSwitchToAsk: () => void;
};

export function ReportObserveOverview({
  reportName,
  onViewFullTable,
  onSwitchToAsk,
}: ReportObserveOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 rounded-[12px] border border-blue-100 bg-blue-50/60 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <Sparkles className="h-4 w-4" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">Clio Accounting overview</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-700">
            AI-generated read of <span className="font-medium">{reportName}</span>. Numbers below are illustrative for
            this prototype—use Ask mode or the full table to dig into source data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Net change vs prior', value: '+4.2%', sub: 'Firm-wide' },
          { label: 'Largest variance', value: 'Real Estate', sub: 'Practice area' },
          { label: 'Items flagged', value: '12', sub: 'For partner review' },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-[12px] border border-gray-200 bg-gray-50/90 p-4 shadow-sm"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{k.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{k.value}</p>
            <p className="mt-1 text-xs text-gray-500">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[12px] border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900">Executive summary</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          Revenue and expense lines are broadly aligned with plan this period. Two matter clusters drove most of the
          movement in receivables; trust activity is flat. Collections cadence improved slightly—days-to-collect remains
          the main watch item against your firm goals.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onViewFullTable}
            className="inline-flex items-center gap-2 rounded-[8px] border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
          >
            <Table2 className="h-3.5 w-3.5" strokeWidth={2} />
            View full report table
          </button>
          <button
            type="button"
            onClick={onSwitchToAsk}
            className="rounded-[8px] border border-transparent bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
          >
            Open in Ask mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="min-h-[120px] rounded-[12px] border border-dashed border-gray-200 bg-gray-100/80 p-4">
          <p className="text-xs font-semibold text-gray-500">Trend snapshot</p>
          <p className="mt-2 text-sm text-gray-600">Placeholder for chart or sparkline (observe-first canvas).</p>
        </div>
        <div className="min-h-[120px] rounded-[12px] border border-dashed border-gray-200 bg-gray-100/80 p-4">
          <p className="text-xs font-semibold text-gray-500">Exceptions</p>
          <p className="mt-2 text-sm text-gray-600">Clio Accounting would list rows that need human review.</p>
        </div>
      </div>
    </div>
  );
}
