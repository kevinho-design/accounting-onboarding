import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { getFinanceWidgetExploreCopy } from '../data/financeWidgetExploreCopy';

export type FinanceWidgetExploreDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  widgetId: string | null;
  /** Human-readable title when copy is missing */
  fallbackTitle?: string;
  onNavigateReport: (reportName: string) => void;
  onNavigatePage: (pageId: string) => void;
};

export function FinanceWidgetExploreDialog({
  open,
  onOpenChange,
  widgetId,
  fallbackTitle = 'Widget details',
  onNavigateReport,
  onNavigatePage,
}: FinanceWidgetExploreDialogProps) {
  const copy = widgetId ? getFinanceWidgetExploreCopy(widgetId) : null;

  const handleFollowUp = React.useCallback(() => {
    if (!copy?.followUp) return;
    onOpenChange(false);
    if (copy.followUp.reportName) {
      onNavigateReport(copy.followUp.reportName);
      return;
    }
    if (copy.followUp.pageId) {
      onNavigatePage(copy.followUp.pageId);
    }
  }, [copy, onOpenChange, onNavigateReport, onNavigatePage]);

  if (!widgetId) return null;

  const title = copy?.title ?? fallbackTitle;
  const subtitle = copy?.subtitle;
  const bullets = copy?.bullets ?? [
    'This widget summarizes prototype data. In a live product, you would drill to underlying transactions, matters, or reports from here.',
  ];
  const hasFollowUp = Boolean(copy?.followUp?.label && (copy.followUp.reportName || copy.followUp.pageId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {subtitle ? <DialogDescription>{subtitle}</DialogDescription> : null}
        </DialogHeader>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {hasFollowUp ? (
            <Button type="button" onClick={handleFollowUp}>
              {copy!.followUp!.label}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
