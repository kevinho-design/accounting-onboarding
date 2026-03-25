import type * as React from 'react';

export type ReportPolarisColumnType = 'text' | 'numeric';

export type ReportPolarisRowKind = 'section' | 'data' | 'subtotal' | 'grandtotal';

export type ReportPolarisRow = {
  key: string;
  kind: ReportPolarisRowKind;
  /** Cell content */
  cells: React.ReactNode[];
  /** Plain text for search (usually first column label) */
  searchText: string;
  /** Optional numeric values per column for sorting (null = not sortable on that column) */
  sortValues?: (number | null)[];
  dimmed?: boolean;
};

export type SortDirection = 'ascending' | 'descending' | 'none';

export function inferRowKind(flags: {
  isHeader?: boolean;
  isTotal?: boolean;
  isGrandTotal?: boolean;
}): ReportPolarisRowKind {
  if (flags.isGrandTotal) return 'grandtotal';
  if (flags.isTotal) return 'subtotal';
  if (flags.isHeader && !flags.isTotal) return 'section';
  return 'data';
}
