import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import type { ReportPolarisColumnType, ReportPolarisRow, SortDirection } from './reportPolarisTypes';
import { cn } from './ui/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

export type ReportDataTablePolarisPagination = {
  page: number;
  pageSize: number;
  totalRows: number;
  onNext: () => void;
  onPrevious: () => void;
  onPageSizeChange?: (n: number) => void;
};

export type TableVerticalAlign = 'top' | 'middle' | 'bottom' | 'baseline';

export type ReportDataTablePolarisProps = {
  headings: string[];
  columnContentTypes: ReportPolarisColumnType[];
  rows: ReportPolarisRow[];
  sortable?: boolean[];
  sortColumn: number | null;
  sortDirection: SortDirection;
  onSortColumn?: (col: number) => void;
  /** Summary row values; length must match headings. */
  totalsRow?: React.ReactNode[] | null;
  /** Polaris `showTotalsInFooter` — render totals in `<tfoot>` instead of under headings. */
  showTotalsInFooter?: boolean;
  /** Polaris `totalsName`: label for first column of the totals row (e.g. “Total”). */
  totalsName?: React.ReactNode;
  stickyHeader?: boolean;
  /** Polaris `hasZebraStripingOnData` */
  zebra?: boolean;
  /** Polaris `increasedTableDensity` */
  increasedTableDensity?: boolean;
  /** @deprecated Prefer `increasedTableDensity`; kept for wrappers. */
  dense?: boolean;
  hoverable?: boolean;
  /** Polaris `footerContent`: centered full-width row inside `<tfoot>`. */
  footerContent?: React.ReactNode;
  /** Slot above the scroll region (search, query, actions). */
  toolbar?: React.ReactNode;
  compact?: boolean;
  pagination?: ReportDataTablePolarisPagination | null;
  /** `flush` = no outer chrome (nested in a LegacyCard). */
  surface?: 'card' | 'flush';
  /** Polaris `truncate`: first column single-line ellipsis (default false = wrap). */
  truncate?: boolean;
  /** Polaris `verticalAlign` for body cells. */
  verticalAlign?: TableVerticalAlign;
  /** Pin the first column on horizontal scroll (Polaris `fixedFirstColumns`; first column only in this build). */
  fixedFirstColumns?: number;
  className?: string;
  scrollClassName?: string;
};

function ariaSortFor(col: number, sortColumn: number | null, sortDirection: SortDirection): 'none' | 'ascending' | 'descending' {
  if (sortColumn !== col || sortDirection === 'none') return 'none';
  return sortDirection;
}

function sortAriaLabel(heading: string, ariaSort: 'none' | 'ascending' | 'descending'): string {
  if (ariaSort === 'none') return `Sort by ${heading}, not sorted`;
  if (ariaSort === 'ascending') return `Sort by ${heading}, sorted ascending`;
  return `Sort by ${heading}, sorted descending`;
}

function verticalAlignClass(v: TableVerticalAlign): string {
  switch (v) {
    case 'middle':
      return 'align-middle';
    case 'bottom':
      return 'align-bottom';
    case 'baseline':
      return 'align-baseline';
    default:
      return 'align-top';
  }
}

export function ReportDataTablePolaris({
  headings,
  columnContentTypes,
  rows,
  sortable,
  sortColumn,
  sortDirection,
  onSortColumn,
  totalsRow,
  showTotalsInFooter = false,
  totalsName,
  stickyHeader = true,
  zebra = true,
  increasedTableDensity,
  dense = false,
  hoverable = true,
  footerContent,
  toolbar,
  compact = false,
  pagination,
  surface = 'card',
  truncate = false,
  verticalAlign = 'top',
  fixedFirstColumns = 0,
  className,
  scrollClassName,
}: ReportDataTablePolarisProps) {
  const isDense = Boolean(increasedTableDensity ?? dense ?? compact);
  const py = isDense ? 'py-1.5' : 'py-2.5';
  const thPad = isDense ? 'py-2 px-3' : 'py-3 px-4';
  const tdPx = isDense ? 'px-3' : 'px-4';
  const pWrap = compact ? 'p-0' : 'p-8';
  const vAlign = verticalAlignClass(verticalAlign);
  /** Sticky second column needs measured width; Polaris supports N — we pin the account column only. */
  const fixFirst = Math.min(Math.min(fixedFirstColumns, headings.length), 1);

  const stickyTh = (ci: number) =>
    fixFirst > 0 && ci === 0
      ? 'sticky left-0 z-[3] bg-muted/70 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.12)]'
      : undefined;

  const stickyTd = (ci: number, stickyBg: string) =>
    fixFirst > 0 && ci === 0
      ? cn('sticky left-0 z-[2] shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)]', stickyBg)
      : undefined;

  let dataZebraIdx = 0;

  const renderTotalsRow = (placement: 'head' | 'foot') => {
    if (!totalsRow || totalsRow.length !== headings.length) return null;
    const rowClass =
      placement === 'foot'
        ? 'border-t border-border bg-muted/45 font-medium'
        : 'bg-muted/40 border-b border-border';
    const stickyBg = placement === 'foot' ? 'bg-muted/45' : 'bg-muted/40';
    return (
      <tr className={rowClass}>
        {totalsRow.map((cell, i) => {
          const align = columnContentTypes[i] === 'numeric' ? 'text-right' : 'text-left';
          const isFirst = i === 0;
          const content = isFirst && totalsName != null ? totalsName : cell;
          return (
            <td
              key={i}
              className={cn(
                thPad,
                align,
                'text-xs text-foreground',
                isFirst && totalsName != null && 'font-semibold',
                fixFirst > 0 && stickyTd(i, stickyBg),
              )}
            >
              {content}
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div
      className={cn(
        surface === 'card' &&
          'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
        surface === 'flush' && 'rounded-none border-0 shadow-none bg-transparent text-foreground',
        'overflow-hidden',
        className,
      )}
    >
      {toolbar ? (
        <div className="border-b border-border bg-muted/25 px-3 py-2.5">{toolbar}</div>
      ) : null}
      <div
        className={cn(
          pWrap,
          compact ? 'min-h-0' : 'min-h-[400px]',
          'overflow-auto max-h-[min(70vh,640px)]',
          scrollClassName,
        )}
      >
        <table className={cn('w-full min-w-[520px] text-sm border-collapse caption-bottom', vAlign)}>
          <thead className={cn(stickyHeader && 'sticky top-0 z-[1] shadow-[0_1px_0_0_hsl(var(--border))]')}>
            <tr className="bg-muted/70 border-b border-border">
              {headings.map((h, i) => {
                const align = columnContentTypes[i] === 'numeric' ? 'text-right' : 'text-left';
                const canSort = sortable?.[i] && onSortColumn;
                const ariaSort = ariaSortFor(i, sortColumn, sortDirection);
                return (
                  <th
                    key={i}
                    scope="col"
                    aria-sort={canSort ? ariaSort : undefined}
                    className={cn(
                      thPad,
                      align,
                      'text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap',
                      stickyHeader && 'bg-muted/70',
                      stickyTh(i),
                    )}
                  >
                    {canSort ? (
                      <button
                        type="button"
                        aria-label={sortAriaLabel(h, ariaSort)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md -mx-1 px-1 py-0.5',
                          'text-foreground hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          align === 'text-right' && 'flex-row-reverse',
                        )}
                        onClick={() => onSortColumn!(i)}
                      >
                        <span>{h}</span>
                        <span className="text-muted-foreground shrink-0" aria-hidden>
                          {ariaSort === 'ascending' ? (
                            <ChevronUp className="size-3.5" />
                          ) : ariaSort === 'descending' ? (
                            <ChevronDown className="size-3.5" />
                          ) : (
                            <ChevronsUpDown className="size-3.5 opacity-50" />
                          )}
                        </span>
                      </button>
                    ) : (
                      h
                    )}
                  </th>
                );
              })}
            </tr>
            {!showTotalsInFooter ? renderTotalsRow('head') : null}
          </thead>
          <tbody>
            {rows.map((row) => {
              const isData = row.kind === 'data';
              const zebraOn = zebra && isData;
              const zebraOdd = zebraOn && dataZebraIdx % 2 === 1;
              if (zebraOn) dataZebraIdx += 1;
              const zebraClass = zebraOn && zebraOdd ? 'bg-muted/30' : '';
              const stickyBase =
                row.kind === 'section'
                  ? 'bg-card'
                  : row.kind === 'grandtotal' || row.kind === 'subtotal'
                    ? 'bg-card'
                    : zebraOdd
                      ? 'bg-muted/30'
                      : 'bg-card';
              return (
                <tr
                  key={row.key}
                  className={cn(
                    'group border-b border-border/80 last:border-0',
                    row.kind === 'section' && 'bg-transparent',
                    row.kind === 'section' && !isDense && !compact && 'pt-2',
                    row.kind === 'subtotal' && 'border-t border-border font-semibold',
                    row.kind === 'grandtotal' && 'border-t-2 border-b-2 border-foreground/20 font-bold text-base',
                    hoverable && isData && 'hover:bg-muted/40',
                    zebraClass,
                    row.dimmed && 'opacity-40',
                  )}
                >
                  {row.cells.map((cell, ci) => {
                    const align =
                      columnContentTypes[ci] === 'numeric' ? 'text-right whitespace-nowrap' : 'text-left';
                    const firstColTruncate = truncate && ci === 0 && row.kind === 'data';
                    const stickyBg =
                      fixFirst > 0 && ci === 0
                        ? cn(
                            stickyBase,
                            hoverable && isData && 'group-hover:bg-muted/40',
                          )
                        : '';
                    return (
                      <td
                        key={ci}
                        className={cn(
                          tdPx,
                          py,
                          vAlign,
                          align,
                          firstColTruncate && 'max-w-[min(280px,40vw)] truncate',
                          !firstColTruncate && ci === 0 && row.kind === 'data' && 'max-w-[min(480px,55vw)] break-words',
                          row.kind === 'section' && ci === 0 && 'font-bold text-foreground pt-4',
                          row.kind === 'data' && ci === 0 && 'pl-6 text-muted-foreground',
                          row.kind === 'data' && ci > 0 && 'text-foreground',
                          row.kind === 'subtotal' && 'text-foreground',
                          row.kind === 'grandtotal' && 'text-foreground',
                          fixFirst > 0 && ci === 0 && stickyTd(0, stickyBg),
                        )}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          {showTotalsInFooter || footerContent ? (
            <tfoot>
              {showTotalsInFooter ? renderTotalsRow('foot') : null}
              {footerContent ? (
                <tr className="border-t border-border bg-muted/20">
                  <td
                    colSpan={headings.length}
                    className="px-4 py-2.5 text-center text-xs text-muted-foreground"
                  >
                    {footerContent}
                  </td>
                </tr>
              ) : null}
            </tfoot>
          ) : null}
        </table>
      </div>
      {pagination && pagination.totalRows > 0 ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-3 py-3 border-t border-border bg-muted/25 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>
              Page {pagination.page} of {Math.max(1, Math.ceil(pagination.totalRows / pagination.pageSize))}
            </span>
            <span className="text-border">|</span>
            <span>
              {Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.totalRows)}–
              {Math.min(pagination.page * pagination.pageSize, pagination.totalRows)} of {pagination.totalRows}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {pagination.onPageSizeChange ? (
              <div className="flex items-center gap-2 mr-2">
                <span className="sr-only">Rows per page</span>
                <Select
                  value={String(pagination.pageSize)}
                  onValueChange={(v) => pagination.onPageSizeChange!(Number(v))}
                >
                  <SelectTrigger className="h-8 w-[4.5rem] text-xs" aria-label="Rows per page">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              disabled={pagination.page <= 1}
              onClick={pagination.onPrevious}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              disabled={pagination.page >= Math.max(1, Math.ceil(pagination.totalRows / pagination.pageSize))}
              onClick={pagination.onNext}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
