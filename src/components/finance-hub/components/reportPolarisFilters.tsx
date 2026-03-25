import * as React from 'react';
import { cn } from './ui/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

export type PolarisFilterOption = { value: string; label: string };

/** Polaris-inspired filter field: sentence-case label + compact select (Index filters / Filters bar style). */
export function PolarisFilterField({
  label,
  value,
  onValueChange,
  options,
  minWidthClass = 'min-w-[160px]',
  disabled,
  id: idProp,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: PolarisFilterOption[];
  minWidthClass?: string;
  disabled?: boolean;
  id?: string;
}) {
  const id = idProp ?? React.useId();
  return (
    <div className={cn('flex flex-col gap-1', minWidthClass)}>
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id={id} size="sm" className="h-8 text-xs font-normal shadow-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-xs">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Outer shell for report filters above the data table (LegacyCard / Polaris page chrome). */
export function PolarisReportFiltersChromeShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-b border-border bg-muted/35 px-4 py-3 text-foreground',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Horizontal rule between filter groups (Polaris divider). */
export function PolarisFiltersGroupDivider() {
  return <div className="border-t border-border/80" role="presentation" />;
}

/** Toggles row: bordered inset strip like Polaris choice / setting controls. */
export function PolarisFiltersToggleStrip({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-background/90 px-3 py-2.5 shadow-sm">
      <div className="flex flex-wrap gap-x-6 gap-y-3 items-center">{children}</div>
    </div>
  );
}

export function PolarisFilterSwitch({
  id,
  checked,
  onCheckedChange,
  label,
  disabled,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
      <Label htmlFor={id} className="text-xs font-medium text-foreground cursor-pointer">
        {label}
      </Label>
    </div>
  );
}
