import { Search, X } from 'lucide-react';
import * as React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from './ui/utils';

export type ReportTableToolbarProps = {
  value: string;
  onChange: (value: string) => void;
  onReset: () => void;
  placeholder?: string;
  /** Period chip, basis text, etc. — left of search (inside table card). */
  leading?: React.ReactNode;
  /** Filter / print / export — between search and Reset table. */
  trailing?: React.ReactNode;
  className?: string;
};

/**
 * Polaris-style toolbar row above the data table: context chips, search, actions, reset.
 */
export function ReportTableToolbar({
  value,
  onChange,
  onReset,
  placeholder = 'Search accounts…',
  leading,
  trailing,
  className,
}: ReportTableToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center', className)}>
      {leading ? (
        <div className="flex min-w-0 flex-wrap items-center gap-2 sm:max-w-[min(100%,28rem)]">{leading}</div>
      ) : null}
      <div className="relative min-w-[200px] flex-1 max-w-lg">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 pl-9 pr-9 text-sm shadow-sm border-border bg-background"
          placeholder={placeholder}
          aria-label="Search accounts"
        />
        {value ? (
          <button
            type="button"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Clear search"
            onClick={() => onChange('')}
          >
            <X className="size-4" />
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {trailing}
        <Button type="button" variant="secondary" size="sm" className="h-9 shrink-0 shadow-sm" onClick={onReset}>
          Reset table
        </Button>
      </div>
    </div>
  );
}
