import * as React from 'react';
import { AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import { getPayrollShortfallTeammatePlan, type FhoTeammatePlan } from '../data/fhoTeammateBreakdowns';
import type { Exception } from '../../agents/AgentTypes';
import { TrustAssignCTA, TRUST_ASSIGN_COMPACT_TRIGGER_CLASS } from '../../accounting/TrustAssign';

const PAYROLL_SHORTFALL_ID = 'payroll-shortfall-gap';

/** Matches FHO widget shell in `FinancePageWidgetGrid` (financial health widgets). */
const WIDGET_CARD_CLASS =
  'rounded-[8px] border border-border bg-card p-4 shadow-sm flex flex-col gap-3 transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] motion-reduce:transition-none hover:border-primary/25 relative overflow-hidden';

export function FinancialHealthCriticalTodaySection({
  exceptions,
  onTeammateExplorePlan,
  onAskTeammate,
}: {
  exceptions: Exception[];
  onTeammateExplorePlan: (plan: FhoTeammatePlan) => void;
  onAskTeammate?: (msg: string) => void;
}) {
  const payrollException = React.useMemo(
    () => exceptions.find((e) => e.id === PAYROLL_SHORTFALL_ID),
    [exceptions],
  );

  if (!payrollException) return null;

  return (
    <section
      className={cn(WIDGET_CARD_CLASS, 'border-rose-300 ring-1 ring-rose-200')}
      aria-label="Payroll shortfall"
    >
      <div className="flex gap-3 border-b border-border/60 pb-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-600 to-red-600">
          <AlertTriangle className="h-4 w-4 text-white" aria-hidden />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium leading-snug text-foreground">{payrollException.title}</h3>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 bg-rose-100 text-rose-800">
              Critical
            </span>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{payrollException.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {payrollException.suggestedAction ? (
          <Button
            size="sm"
            className="h-8 cursor-pointer bg-primary text-xs text-primary-foreground hover:bg-primary/90"
            type="button"
            onClick={() => onTeammateExplorePlan(getPayrollShortfallTeammatePlan())}
          >
            {payrollException.suggestedAction}
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        ) : null}
        <TrustAssignCTA compact buttonClassName={TRUST_ASSIGN_COMPACT_TRIGGER_CLASS} />
        {onAskTeammate ? (
          <Button
            size="sm"
            variant="outline"
            type="button"
            className="h-8 cursor-pointer border-border text-xs text-muted-foreground hover:bg-muted/60"
            onClick={() => onAskTeammate(`Help me with: "${payrollException.title}"`)}
          >
            <Sparkles className="mr-1 h-3 w-3 text-primary" />
            Ask Teammate
          </Button>
        ) : null}
      </div>
    </section>
  );
}
