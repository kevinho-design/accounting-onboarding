import React, { useMemo } from 'react';
import { PinOff } from 'lucide-react';
import {
  FinanceWidgetContent,
  hydratePlacedWidgets,
  getFinanceWidgetPinKey,
  type DashboardFinancialPin,
  type FinancePageWidget,
  type ReportLibraryEntry,
} from './financeWidgetCatalog';
import { cn } from './ui/utils';

function dashboardPinGridClass(widgetId: string): string {
  if (widgetId === 'fho_firm_goals_detail') return 'lg:col-span-4';
  if (
    widgetId === 'fho_operating_cash_detail' ||
    widgetId === 'fho_revenue_detail' ||
    widgetId === 'fho_ar_at_risk_detail' ||
    widgetId === 'fho_runway_detail'
  ) {
    return 'lg:col-span-1';
  }
  if (widgetId === 'fho_iolta_trust_detail' || widgetId === 'fho_unbilled_detail') {
    return 'lg:col-span-2';
  }
  return 'lg:col-span-2';
}

export type DashboardFinancialHealthSectionProps = {
  pins: DashboardFinancialPin[];
  reportLibrary?: readonly ReportLibraryEntry[];
  onUnpinPinKey: (pinKey: string) => void;
  onOpenFullFinancialHealth?: () => void;
  onOpenSourceFinancePage: (pageId: string) => void;
};

export function DashboardFinancialHealthSection({
  pins,
  reportLibrary,
  onUnpinPinKey,
  onOpenFullFinancialHealth,
  onOpenSourceFinancePage,
}: DashboardFinancialHealthSectionProps) {
  const placed = useMemo(
    (): FinancePageWidget[] =>
      pins.map((p) => ({
        instanceId: p.instanceId,
        widgetId: p.widgetId,
        layoutSize: p.layoutSize,
        reportName: p.reportName,
        reportView: p.reportView,
      })),
    [pins],
  );

  const hydrated = useMemo(() => hydratePlacedWidgets(placed, reportLibrary), [placed, reportLibrary]);

  if (pins.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-1">
        No widgets pinned to your Dashboard. Open Finances and use the pin on any widget to show a summary here.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      {pins.map((pin) => {
        const w = hydrated.find((h) => h.instanceId === pin.instanceId);
        if (!w) return null;
        const pinKey = getFinanceWidgetPinKey(pin);
        return (
          <div
            key={pin.instanceId}
            className={cn(
              'relative rounded-[var(--radius)] border border-border bg-background/60 p-4 shadow-sm text-left',
              dashboardPinGridClass(w.id),
            )}
          >
            <button
              type="button"
              onClick={() => onUnpinPinKey(pinKey)}
              className="absolute top-2 right-2 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Unpin from Dashboard"
              aria-label="Unpin from Dashboard"
            >
              <PinOff className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
            <div className="pr-8">
              <FinanceWidgetContent
                id={w.id}
                instanceId={w.instanceId}
                surface="dashboardSummary"
                sourcePageId={pin.sourcePageId}
                onOpenFullFinancialHealth={onOpenFullFinancialHealth}
                onOpenSourceFinancePage={onOpenSourceFinancePage}
                reportName={w.reportName}
                reportView={w.reportView}
                reportLibrary={reportLibrary}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
