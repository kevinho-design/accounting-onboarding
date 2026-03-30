import React, { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  LineChart,
  MessageSquare,
  Shield,
  Sparkles,
  Link2,
  TrendingUp,
  PieChart,
  Banknote,
  Waves,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';
import type { AgentIconTone, MigrationAgent } from '../data/homeDashboardSeed';
import {
  attentionItems,
  attentionSectionTotal,
  migrationAgents,
  migrationHeroCopy,
  migrationMetrics,
} from '../data/homeDashboardSeed';
import { DashboardFinancialHealthSection } from './DashboardFinancialHealthSection';
import type { DashboardFinancialPin, ReportLibraryEntry } from './financeWidgetCatalog';

const toneIconBg: Record<AgentIconTone, string> = {
  emerald: 'bg-[var(--chart-emerald)]',
  ocean: 'bg-[var(--chart-ocean)]',
  violet: 'bg-violet-500',
  amber: 'bg-[var(--chart-amber)]',
  yellow: 'bg-amber-400',
  pink: 'bg-pink-500',
};

function AgentMiniIcon({ tone }: { tone: AgentIconTone }) {
  const Icon =
    tone === 'emerald'
      ? Shield
      : tone === 'ocean'
        ? Link2
        : tone === 'violet'
          ? TrendingUp
          : tone === 'amber'
            ? PieChart
            : tone === 'yellow'
              ? Banknote
              : Waves;
  return (
    <div
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm',
        toneIconBg[tone],
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
    </div>
  );
}

function StatusPill({ status }: { status: MigrationAgent['status'] }) {
  const active = status === 'active';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        active
          ? 'bg-emerald-500/15 text-[var(--chart-emerald)]'
          : 'bg-muted text-muted-foreground',
      )}
    >
      <span className={cn('h-1 w-1 rounded-full', active ? 'bg-[var(--chart-emerald)]' : 'bg-muted-foreground')} />
      {active ? 'Active' : 'Idle'}
    </span>
  );
}

export type HomeDashboardProps = {
  userFirstName: string;
  onOpenTeammate: () => void;
  onReviewGoals: () => void;
  /** Opens Finances → Financial Health Overview (full widget page). */
  onOpenFinancialHealthOverview?: () => void;
  financialHealthPins: DashboardFinancialPin[];
  reportLibrary?: readonly ReportLibraryEntry[];
  onUnpinFinancialPinKey: (pinKey: string) => void;
  onOpenSourceFinancePage: (pageId: string) => void;
};

export function HomeDashboard({
  userFirstName,
  onOpenTeammate,
  onReviewGoals,
  onOpenFinancialHealthOverview,
  financialHealthPins,
  reportLibrary,
  onUnpinFinancialPinKey,
  onOpenSourceFinancePage,
}: HomeDashboardProps) {
  const [migrationDismissed, setMigrationDismissed] = useState(false);
  const [attentionOpen, setAttentionOpen] = useState(true);
  const [financialOpen, setFinancialOpen] = useState(true);
  const [showAllAttention, setShowAllAttention] = useState(false);

  const dateLine = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );

  const visibleAttention = showAllAttention ? attentionItems : attentionItems.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8 pb-32 animate-in fade-in duration-300">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, {userFirstName}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{dateLine}</p>
      </header>

      {!migrationDismissed && (
        <section
          className="rounded-[var(--radius)] border border-border bg-card p-6 shadow-sm"
          aria-labelledby="migration-complete-title"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--chart-emerald)] text-white shadow-sm"
                aria-hidden
              >
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <h2 id="migration-complete-title" className="text-lg font-bold text-foreground">
                  {migrationHeroCopy.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{migrationHeroCopy.body}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMigrationDismissed(true)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Dismiss
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {migrationAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-3 rounded-[var(--radius)] border border-border bg-background/60 px-3 py-3"
              >
                <AgentMiniIcon tone={agent.tone} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{agent.name}</p>
                  <div className="mt-1">
                    <StatusPill status={agent.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {migrationMetrics.map((m) => (
              <div key={m.id} className="space-y-1">
                <p className="text-xs font-medium leading-snug text-muted-foreground">{m.label}</p>
                {m.pctLabel != null ? (
                  <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-[var(--chart-emerald)]">
                    {m.pctLabel}
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-[var(--chart-emerald)]">
                    {m.highlight}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" className="font-semibold" onClick={onOpenTeammate}>
              Review items in Teammate
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" className="font-semibold bg-card">
              View Full Migration Report
            </Button>
          </div>
        </section>
      )}

      <section className="rounded-[var(--radius)] border border-border bg-card shadow-sm">
        <button
          type="button"
          onClick={() => setAttentionOpen((o) => !o)}
          className="flex w-full items-start gap-3 rounded-t-[var(--radius)] p-5 text-left transition-colors hover:bg-muted/40"
          aria-expanded={attentionOpen}
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-white shadow-sm"
            aria-hidden
          >
            <Sparkles className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-foreground">{attentionSectionTotal} items need your attention</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Your financial team flagged these exceptions that require human judgment.
            </p>
          </div>
          <ChevronDown
            className={cn(
              'mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
              attentionOpen && 'rotate-180',
            )}
          />
        </button>
        {attentionOpen && (
          <div className="space-y-4 border-t border-border px-5 pb-5 pt-4">
            {visibleAttention.map((item) => {
              const n = attentionItems.findIndex((x) => x.id === item.id) + 1;
              return (
                <article
                  key={item.id}
                  className="rounded-[var(--radius)] border border-border bg-background/50 p-4 shadow-sm"
                >
                  <div className="flex gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--chart-amber)] text-sm font-bold text-white"
                      aria-hidden
                    >
                      {n}
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <div>
                        <h3 className="font-bold text-foreground">{item.title}</h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{item.subtitle}</p>
                      </div>
                      <div className="rounded-[var(--radius)] border border-amber-500/25 bg-amber-500/10 px-3 py-2.5 text-xs leading-relaxed text-amber-950 dark:text-amber-100">
                        {item.callout}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" size="sm" className="font-semibold" onClick={onOpenTeammate}>
                          {item.primaryCta}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="bg-card font-semibold"
                          onClick={onOpenTeammate}
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Ask Clio
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            {!showAllAttention && attentionItems.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllAttention(true)}
                className="text-sm font-semibold text-primary hover:underline"
              >
                See all {attentionSectionTotal} items
                <ChevronRight className="ml-0.5 inline h-4 w-4 align-text-bottom" />
              </button>
            )}
          </div>
        )}
      </section>

      <section className="rounded-[var(--radius)] border border-border bg-card shadow-sm">
        <div className="flex w-full items-start gap-3 rounded-t-[var(--radius)] p-5 text-left transition-colors hover:bg-muted/40">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--chart-emerald)] text-white shadow-sm"
            aria-hidden
          >
            <LineChart className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-foreground">Financial Health Overview</h2>
            {onOpenFinancialHealthOverview ? (
              <button
                type="button"
                onClick={onOpenFinancialHealthOverview}
                className="mt-1.5 text-sm font-semibold text-primary hover:underline"
              >
                View full Financial Health Overview in Finances
                <ChevronRight className="ml-0.5 inline h-4 w-4 align-text-bottom" />
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setFinancialOpen((o) => !o)}
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-expanded={financialOpen}
            aria-label={financialOpen ? 'Collapse Financial Health section' : 'Expand Financial Health section'}
          >
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform duration-200',
                financialOpen && 'rotate-180',
              )}
            />
          </button>
        </div>
        {financialOpen && (
          <div className="space-y-4 border-t border-border px-5 pb-6 pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Summaries of widgets you pin from Finances. Pin or unpin from any Finances page.
              </p>
              <Button type="button" variant="outline" size="sm" className="shrink-0 bg-card font-semibold" onClick={onReviewGoals}>
                Review Goals
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
            <DashboardFinancialHealthSection
              pins={financialHealthPins}
              reportLibrary={reportLibrary}
              onUnpinPinKey={onUnpinFinancialPinKey}
              onOpenFullFinancialHealth={onOpenFinancialHealthOverview}
              onOpenSourceFinancePage={onOpenSourceFinancePage}
            />
          </div>
        )}
      </section>
    </div>
  );
}
