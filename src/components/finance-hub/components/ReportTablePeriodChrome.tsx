import { Calendar, Download, Filter, Printer } from 'lucide-react';
import * as React from 'react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

/** Period / date range chip in the data table toolbar (Polaris-style). */
export function ReportTablePeriodChip({
  presetLabel,
  rangeLabel,
  className,
}: {
  presetLabel: string;
  rangeLabel: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'inline-flex max-w-full items-center gap-0 rounded-md border border-border bg-background px-2.5 py-1.5 text-sm shadow-sm',
        className,
      )}
    >
      <Calendar className="mr-1.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <span className="shrink-0 font-medium text-foreground">{presetLabel}</span>
      <div className="mx-2 h-4 w-px shrink-0 bg-border" aria-hidden />
      <span className="min-w-0 truncate text-muted-foreground">{rangeLabel}</span>
    </div>
  );
}

/** Prototype filter / print / export controls beside search in the table toolbar. */
export function ReportTableExportActions() {
  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="outline" size="icon" className="size-9 shrink-0 shadow-sm" title="Filters">
        <Filter className="size-4" />
        <span className="sr-only">Filters</span>
      </Button>
      <Button type="button" variant="outline" size="icon" className="size-9 shrink-0 shadow-sm" title="Print">
        <Printer className="size-4" />
        <span className="sr-only">Print</span>
      </Button>
      <Button type="button" variant="outline" size="sm" className="h-9 gap-1.5 px-3 shadow-sm">
        <Download className="size-4" />
        Export
      </Button>
    </div>
  );
}
