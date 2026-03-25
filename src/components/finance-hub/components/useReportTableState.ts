import * as React from 'react';
import type { ReportPolarisRow, SortDirection } from './reportPolarisTypes';

type Segment = { header: ReportPolarisRow | null; body: ReportPolarisRow[] };

function splitIntoSegments(rows: ReportPolarisRow[]): Segment[] {
  const segments: Segment[] = [];
  let current: Segment = { header: null, body: [] };

  for (const row of rows) {
    if (row.kind === 'section') {
      if (current.header !== null || current.body.length > 0) {
        segments.push(current);
      }
      current = { header: row, body: [] };
    } else {
      current.body.push(row);
    }
  }
  if (current.header !== null || current.body.length > 0) {
    segments.push(current);
  }
  return segments;
}

function flattenSegments(segments: Segment[]): ReportPolarisRow[] {
  const out: ReportPolarisRow[] = [];
  for (const seg of segments) {
    if (seg.header) out.push(seg.header);
    out.push(...seg.body);
  }
  return out;
}

/** Split body into sortable prefix (data) and suffix (subtotal/grandtotal kept in order). */
function partitionBodyForSort(body: ReportPolarisRow[]): {
  data: ReportPolarisRow[];
  tail: ReportPolarisRow[];
} {
  let i = body.length;
  while (i > 0) {
    const k = body[i - 1]!.kind;
    if (k === 'subtotal' || k === 'grandtotal') i -= 1;
    else break;
  }
  const data = body.slice(0, i);
  const tail = body.slice(i);
  return { data, tail };
}

function compareRows(
  a: ReportPolarisRow,
  b: ReportPolarisRow,
  col: number,
  dir: Exclude<SortDirection, 'none'>,
): number {
  const av = a.sortValues?.[col];
  const bv = b.sortValues?.[col];
  const aHas = av != null && !Number.isNaN(av);
  const bHas = bv != null && !Number.isNaN(bv);
  if (aHas && bHas) {
    const c = av! - bv!;
    return dir === 'ascending' ? c : -c;
  }
  if (aHas !== bHas) return aHas ? (dir === 'ascending' ? 1 : -1) : dir === 'ascending' ? -1 : 1;
  const as = a.searchText.toLowerCase();
  const bs = b.searchText.toLowerCase();
  const t = as.localeCompare(bs, undefined, { numeric: true });
  return dir === 'ascending' ? t : -t;
}

function sortSegmentBody(body: ReportPolarisRow[], col: number, dir: Exclude<SortDirection, 'none'>): ReportPolarisRow[] {
  const { data, tail } = partitionBodyForSort(body);
  const sorted = [...data].sort((x, y) => compareRows(x, y, col, dir));
  return [...sorted, ...tail];
}

export function sortReportPolarisRows(
  rows: ReportPolarisRow[],
  sortColumn: number,
  direction: Exclude<SortDirection, 'none'>,
): ReportPolarisRow[] {
  const hasSection = rows.some((r) => r.kind === 'section');
  if (!hasSection) {
    return [...rows].sort((a, b) => compareRows(a, b, sortColumn, direction));
  }
  const segments = splitIntoSegments(rows);
  const next = segments.map((seg) => ({
    ...seg,
    body: sortSegmentBody(seg.body, sortColumn, direction),
  }));
  return flattenSegments(next);
}

function filterRowsBySearch(rows: ReportPolarisRow[], query: string): ReportPolarisRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  const kept = rows.filter((r) => {
    if (r.kind !== 'data') return true;
    return r.searchText.toLowerCase().includes(q);
  });
  return stripOrphanSectionHeaders(kept);
}

function stripOrphanSectionHeaders(rows: ReportPolarisRow[]): ReportPolarisRow[] {
  const out: ReportPolarisRow[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;
    if (row.kind !== 'section') {
      out.push(row);
      continue;
    }
    const next = rows[i + 1];
    if (!next || next.kind === 'section') continue;
    out.push(row);
  }
  return out;
}

export type UseReportTableStateOptions = {
  defaultPageSize?: number;
  /** When false, all rows shown (still filter + sort). */
  enablePagination?: boolean;
};

export function useReportTableState(
  sourceRows: ReportPolarisRow[],
  options: UseReportTableStateOptions = {},
) {
  const {
    defaultPageSize = 25,
    enablePagination = true,
  } = options;

  const [searchQuery, setSearchQuery] = React.useState('');
  const [sort, setSort] = React.useState<{ col: number | null; dir: SortDirection }>({
    col: null,
    dir: 'none',
  });
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);

  const sortColumn = sort.col;
  const sortDirection = sort.dir;

  const filtered = React.useMemo(
    () => filterRowsBySearch(sourceRows, searchQuery),
    [sourceRows, searchQuery],
  );

  const sorted = React.useMemo(() => {
    if (sort.col == null || sort.dir === 'none') return filtered;
    return sortReportPolarisRows(filtered, sort.col, sort.dir);
  }, [filtered, sort.col, sort.dir]);

  const totalForPagination = sorted.length;
  const totalPages = enablePagination ? Math.max(1, Math.ceil(totalForPagination / pageSize)) : 1;

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const displayedRows = React.useMemo(() => {
    if (!enablePagination) return sorted;
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize, enablePagination]);

  const cycleSort = React.useCallback((col: number, sortable: boolean) => {
    if (!sortable) return;
    setPage(1);
    setSort((prev) => {
      if (prev.col !== col) return { col, dir: 'ascending' };
      if (prev.dir === 'ascending') return { col, dir: 'descending' };
      if (prev.dir === 'descending') return { col: null, dir: 'none' };
      return { col, dir: 'ascending' };
    });
  }, []);

  const reset = React.useCallback(() => {
    setSearchQuery('');
    setSort({ col: null, dir: 'none' });
    setPage(1);
    setPageSize(defaultPageSize);
  }, [defaultPageSize]);

  const goNext = React.useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  const goPrevious = React.useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const setPageSizeAndReset = React.useCallback((n: number) => {
    setPageSize(n);
    setPage(1);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    sortColumn,
    sortDirection,
    cycleSort,
    page,
    setPage,
    pageSize,
    setPageSize: setPageSizeAndReset,
    displayedRows,
    reset,
    totalRows: totalForPagination,
    totalPages,
    goNext,
    goPrevious,
    enablePagination,
  };
}

