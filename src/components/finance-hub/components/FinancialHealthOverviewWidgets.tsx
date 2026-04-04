import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  FileText,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  Plus,
} from 'lucide-react';
import {
  financialKpis,
  goalsSummary,
  ioltaTrustCard,
  unbilledTimeCard,
  type FinancialKpi,
} from '../data/homeDashboardSeed';
import {
  addFirmGoal,
  deleteFirmGoal,
  FIRM_INTELLIGENCE_GOALS_FILTER_NARRATIVE,
  getFirmGoalById,
  getFirmGoalDashboardCards,
  firmGoalsOnTrackCount,
  updateFirmGoal,
  useFirmGoalsState,
} from '../data/firmGoals';
import {
  FHO_AR_INVOICE_ROWS,
  FHO_CASH_FLOW_MONTHLY,
  FHO_GROW_PIPELINE,
  FHO_IOLTA_CHECKLIST,
  FHO_COLLECTION_RISK,
  FHO_OPERATING_CASH_BRIDGE,
  FHO_OPERATING_CASH_NOTE,
  FHO_REVENUE_MARGIN_CONTEXT,
  FHO_REVENUE_PRACTICE_MIX,
  FHO_RUNWAY_GOAL_DAYS,
  FHO_RUNWAY_NARRATIVE,
  FHO_RUNWAY_TREND,
  FHO_UNBILLED_MATTER_ROWS,
  fhoPersonalizationCopy,
  type FhoCashFlowMonth,
} from '../data/financialHealthOverviewSeed';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { USER_FIRST_NAME } from '../data/prototypePersona';
import { cn } from './ui/utils';
import { FirmGoalsCardList } from './FirmGoalsCardList';
import { GoalOptimizationModal } from './GoalOptimizationModal';

export type FhoSurface = 'page' | 'dashboardSummary';

const riskStyles: Record<string, string> = {
  High: 'bg-red-500/15 text-red-800 dark:text-red-200 border-red-500/30',
  Elevated: 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border-amber-500/30',
  Watch: 'bg-sky-500/12 text-sky-900 dark:text-sky-200 border-sky-500/25',
};

function kpiById(id: string): FinancialKpi {
  const k = financialKpis.find((x) => x.id === id);
  if (!k) throw new Error(`Missing financial KPI ${id}`);
  return k;
}

function KpiBadge({
  label,
  variant,
}: {
  label: string;
  variant: FinancialKpi['badge']['variant'];
}) {
  const cls =
    variant === 'success'
      ? 'bg-emerald-500/15 text-[var(--chart-emerald)] border border-emerald-500/25'
      : variant === 'warning'
        ? 'bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30'
        : variant === 'opportunity'
          ? 'bg-violet-500/12 text-violet-800 dark:text-violet-200 border border-violet-500/25'
          : 'bg-muted text-muted-foreground border border-border';
  return (
    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', cls)}>{label}</span>
  );
}

function KpiHeadline({
  kpi,
  icon: Icon,
  iconClass,
  compact,
}: {
  kpi: FinancialKpi;
  icon: React.ElementType;
  iconClass: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-foreground">
          <Icon className={cn('h-3.5 w-3.5 shrink-0', iconClass)} strokeWidth={2} />
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{kpi.title}</p>
        </div>
        {kpi.sublabel ? <p className="text-[10px] text-muted-foreground">{kpi.sublabel}</p> : null}
        <p className="text-lg font-bold tracking-tight text-foreground">{kpi.value}</p>
        <div className="flex flex-wrap items-center gap-1">
          <KpiBadge label={kpi.badge.label} variant={kpi.badge.variant} />
          {kpi.extraBadges?.map((b) => (
            <KpiBadge key={b.label} label={b.label} variant={b.variant} />
          ))}
          {kpi.footnote ? <span className="text-[10px] font-semibold text-muted-foreground">{kpi.footnote}</span> : null}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Icon className={cn('h-5 w-5 shrink-0', iconClass)} strokeWidth={2} />
        <h4 className="text-sm font-bold">{kpi.title}</h4>
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{kpi.value}</span>
        {kpi.sublabel ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{kpi.sublabel}</span>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <KpiBadge label={kpi.badge.label} variant={kpi.badge.variant} />
        {kpi.extraBadges?.map((b) => (
          <KpiBadge key={b.label} label={b.label} variant={b.variant} />
        ))}
        {kpi.footnote ? <span className="text-xs font-semibold text-muted-foreground">{kpi.footnote}</span> : null}
      </div>
    </div>
  );
}

/** Pinned to top of each FHO widget’s internal scroll area (Financial Health page). */
function FhoPageStickyHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'sticky top-0 z-10 -mx-1 mb-3 bg-card px-1 pb-3 pt-0.5 border-b border-border/80',
        className,
      )}
    >
      {children}
    </div>
  );
}

function MiniSparkline() {
  return (
    <svg className="h-10 w-full text-[var(--chart-emerald)]" viewBox="0 0 80 24" preserveAspectRatio="none" aria-hidden>
      <path
        d="M0 18 L12 14 L24 16 L36 8 L48 10 L60 4 L72 6 L80 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 18 L12 14 L24 16 L36 8 L48 10 L60 4 L72 6 L80 2 L80 24 L0 24 Z"
        fill="currentColor"
        fillOpacity={0.12}
      />
    </svg>
  );
}

export function FhoPersonalizationBanner(props?: {
  surface?: FhoSurface;
  onOpenFullFinancialHealth?: () => void;
}) {
  const { surface = 'page', onOpenFullFinancialHealth } = props ?? {};
  if (surface === 'dashboardSummary') {
    return (
      <div className="flex items-start gap-2">
        <Sparkles className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" strokeWidth={2} aria-hidden />
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wide text-blue-800 dark:text-blue-200">Clio Accounting</p>
          <p className="mt-0.5 text-xs font-semibold text-foreground">
            {USER_FIRST_NAME}, this Financial Health strip is personalized for you—open Finances for full breakdowns.
          </p>
          {onOpenFullFinancialHealth ? (
            <button
              type="button"
              onClick={onOpenFullFinancialHealth}
              className="mt-1.5 text-[11px] font-semibold text-primary hover:underline"
            >
              View full overview
            </button>
          ) : null}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-blue-200/80 bg-gradient-to-br from-blue-50/90 to-indigo-50/50 p-5 dark:from-blue-950/40 dark:to-indigo-950/30 dark:border-blue-800/50">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
          <Sparkles className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-800 dark:text-blue-200">Clio Accounting</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100">
            Your personalized Financial Health Overview
          </p>
          <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {fhoPersonalizationCopy(USER_FIRST_NAME)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FhoFirmGoalsDetailWidget({ surface = 'page' }: { surface?: FhoSurface } = {}) {
  useFirmGoalsState();
  const { onTrack, total } = firmGoalsOnTrackCount();
  const [detailsOpen, setDetailsOpen] = React.useState(true);
  const goals = getFirmGoalDashboardCards();
  const [reviewGoalId, setReviewGoalId] = React.useState<string | null>(null);
  const atRiskCount = goals.filter((g) => g.status === 'at-risk').length;
  const selectedGoal = reviewGoalId ? getFirmGoalById(reviewGoalId) : null;
  if (surface === 'dashboardSummary') {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Target className="h-3.5 w-3.5 text-violet-600 shrink-0" strokeWidth={2} />
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{goalsSummary.label}</p>
        </div>
        <p className="text-sm font-semibold text-foreground">
          {onTrack} of {total} on track
          {goalsSummary.atRiskLine ? (
            <span className="ml-1 font-normal text-muted-foreground">• {goalsSummary.atRiskLine}</span>
          ) : null}
        </p>
        <p className="text-[11px] text-muted-foreground line-clamp-2">{FIRM_INTELLIGENCE_GOALS_FILTER_NARRATIVE}</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <FhoPageStickyHeader className="space-y-3">
        <div className="flex items-center justify-between gap-3 text-gray-900 dark:text-gray-100">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-violet-600 shrink-0" strokeWidth={2} />
            <h4 className="text-sm font-bold">{goalsSummary.label}</h4>
          </div>
          <button
            type="button"
            onClick={() => {
              const newGoal = addFirmGoal();
              setReviewGoalId(newGoal.id);
              setDetailsOpen(true);
            }}
            className="inline-flex items-center gap-1 rounded-[8px] border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add new goal
          </button>
        </div>
        <button
          type="button"
          onClick={() => setDetailsOpen((prev) => !prev)}
          className="w-full rounded-lg border border-border bg-muted/10 px-3 py-2 text-left hover:bg-muted/20 transition-colors"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {onTrack} of {total} on track
            <span className="ml-2 font-normal text-muted-foreground">• {atRiskCount} at risk</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Dashboard-style goal cards {detailsOpen ? 'shown' : 'hidden'} — click to {detailsOpen ? 'collapse' : 'expand'}
          </p>
        </button>
      </FhoPageStickyHeader>
      <p className="text-sm leading-relaxed text-muted-foreground">{FIRM_INTELLIGENCE_GOALS_FILTER_NARRATIVE}</p>
      {detailsOpen ? (
        <FirmGoalsCardList
          goals={goals}
          gridClassName="grid grid-cols-1 lg:grid-cols-2 gap-3"
          cardClassName="p-4 bg-background rounded-xl border border-border/70"
          onReviewGoal={(goalId) => setReviewGoalId(goalId)}
        />
      ) : null}
      <p className="text-xs text-muted-foreground">
        Review and adjust goals here (same targets as your Dashboard strip).
      </p>
      <GoalOptimizationModal
        open={Boolean(reviewGoalId && selectedGoal)}
        goal={selectedGoal}
        onOpenChange={(open) => {
          if (!open) setReviewGoalId(null);
        }}
        onSave={({ title, goalTemplateId, targetValue, targetDeadline }) => {
          if (!selectedGoal) return;
          updateFirmGoal(selectedGoal.id, { title, goalTemplateId, targetValue, targetDeadline });
          setReviewGoalId(null);
        }}
        onDelete={() => {
          if (!selectedGoal) return;
          deleteFirmGoal(selectedGoal.id);
          setReviewGoalId(null);
        }}
      />
    </div>
  );
}

export function FhoOperatingCashDetailWidget({ surface = 'page' }: { surface?: FhoSurface } = {}) {
  const k1 = kpiById('k1');
  if (surface === 'dashboardSummary') {
    return (
      <div className="space-y-2">
        <KpiHeadline kpi={k1} icon={Wallet} iconClass="text-emerald-600" compact />
        <p className="text-[11px] text-muted-foreground line-clamp-2">{FHO_OPERATING_CASH_NOTE}</p>
        <div className="h-6 w-full text-[var(--chart-emerald)] opacity-90" aria-hidden>
          <MiniSparkline />
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <FhoPageStickyHeader>
        <KpiHeadline kpi={k1} icon={Wallet} iconClass="text-emerald-600" />
      </FhoPageStickyHeader>
      <p className="text-sm leading-relaxed text-muted-foreground">{FHO_OPERATING_CASH_NOTE}</p>
      <div className="rounded-lg border border-border bg-muted/10 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">MoM trend</p>
        <MiniSparkline />
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {FHO_OPERATING_CASH_BRIDGE.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="px-3 py-2.5 text-gray-700 dark:text-gray-300">{row.label}</td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums text-gray-900 dark:text-gray-100">
                  {row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FhoRevenueDetailWidget({ surface = 'page' }: { surface?: FhoSurface } = {}) {
  const k2 = kpiById('k2');
  if (surface === 'dashboardSummary') {
    return (
      <div className="space-y-2">
        <KpiHeadline kpi={k2} icon={TrendingUp} iconClass="text-violet-600" compact />
        <p className="text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Grow pipeline:</span> {FHO_GROW_PIPELINE.days60.label}{' '}
          {FHO_GROW_PIPELINE.days60.amount} · {FHO_GROW_PIPELINE.days90.label} {FHO_GROW_PIPELINE.days90.amount}
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <FhoPageStickyHeader>
        <KpiHeadline kpi={k2} icon={TrendingUp} iconClass="text-violet-600" />
      </FhoPageStickyHeader>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Practice</th>
              <th className="px-3 py-2 text-right">Share</th>
              <th className="px-3 py-2 text-right">Recognized</th>
              <th className="px-3 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {FHO_REVENUE_PRACTICE_MIX.map((row) => (
              <tr key={row.practice} className="border-b border-border last:border-0">
                <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-gray-100">{row.practice}</td>
                <td className="px-3 py-2.5 text-right tabular-nums">{row.sharePct}%</td>
                <td className="px-3 py-2.5 text-right font-semibold tabular-nums">{row.recognized}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 dark:bg-violet-950/20">
        <p className="text-xs font-bold uppercase tracking-wide text-violet-800 dark:text-violet-200">
          {FHO_GROW_PIPELINE.headline}
        </p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {FHO_GROW_PIPELINE.days60.label}
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{FHO_GROW_PIPELINE.days60.amount}</p>
            <p className="mt-1 text-xs text-muted-foreground">{FHO_GROW_PIPELINE.days60.note}</p>
          </div>
          <div className="rounded-lg border border-border bg-background/60 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              {FHO_GROW_PIPELINE.days90.label}
            </p>
            <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{FHO_GROW_PIPELINE.days90.amount}</p>
            <p className="mt-1 text-xs text-muted-foreground">{FHO_GROW_PIPELINE.days90.note}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{FHO_GROW_PIPELINE.footer}</p>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{FHO_REVENUE_MARGIN_CONTEXT}</p>
    </div>
  );
}

export function FhoArAtRiskDetailWidget({ surface = 'page' }: { surface?: FhoSurface } = {}) {
  const k3 = kpiById('k3');
  if (surface === 'dashboardSummary') {
    const top = FHO_COLLECTION_RISK.clients[0];
    return (
      <div className="space-y-2">
        <KpiHeadline kpi={k3} icon={AlertTriangle} iconClass="text-amber-600" compact />
        <p className="text-[11px] text-muted-foreground">
          Collection risk <span className="font-bold text-foreground">{FHO_COLLECTION_RISK.score}</span> —{' '}
          {FHO_COLLECTION_RISK.scoreLabel.toLowerCase()}
          {top ? (
            <>
              . Highest watch: <span className="font-medium text-foreground">{top.name}</span>.
            </>
          ) : null}
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <FhoPageStickyHeader>
        <KpiHeadline kpi={k3} icon={AlertTriangle} iconClass="text-amber-600" />
      </FhoPageStickyHeader>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Client / matter</th>
              <th className="px-3 py-2 text-right">Days</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {FHO_AR_INVOICE_ROWS.map((inv) => (
              <tr key={inv.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2.5">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{inv.client}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{inv.matterRef}</span>
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums font-semibold">{inv.daysOverdue}+</td>
                <td className="px-3 py-2.5 text-right font-bold tabular-nums">{inv.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Per-client late-pay patterns</p>
        <div className="mt-2 flex flex-wrap items-end gap-3">
          <span className="text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
            {FHO_COLLECTION_RISK.score}
          </span>
          <span className="pb-1 text-sm font-semibold text-muted-foreground">{FHO_COLLECTION_RISK.scoreLabel}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{FHO_COLLECTION_RISK.summary}</p>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2">Client</th>
                <th className="px-3 py-2">Risk</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Pattern</th>
              </tr>
            </thead>
            <tbody>
              {FHO_COLLECTION_RISK.clients.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-gray-100">{c.name}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase',
                        riskStyles[c.riskLabel] ?? 'bg-muted text-muted-foreground',
                      )}
                    >
                      {c.riskLabel}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 tabular-nums font-semibold">{c.score}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{c.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FhoRunwayTrendMiniChart() {
  return (
    <div className="mt-3 rounded-lg border border-border bg-muted/15">
      <p className="border-b border-border/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Runway trend (days)
      </p>
      <div className="h-[112px] w-full px-1 pb-1 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={[...FHO_RUNWAY_TREND]}
            margin={{ top: 8, right: 6, left: 0, bottom: 4 }}
            accessibilityLayer={false}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--chart-tick)' }}
              dy={6}
            />
            <YAxis
              domain={['dataMin - 6', 'dataMax + 8']}
              axisLine={false}
              tickLine={false}
              width={32}
              tick={{ fontSize: 10, fill: 'var(--chart-tick)' }}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                fontSize: 12,
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={(value: number) => [`${value} days`, 'Runway']}
              labelFormatter={(label) => `${label}`}
            />
            <ReferenceLine
              y={FHO_RUNWAY_GOAL_DAYS}
              stroke="var(--chart-tick)"
              strokeDasharray="4 4"
              strokeOpacity={0.6}
              label={{
                value: 'Goal',
                position: 'insideTopRight',
                fill: 'var(--muted-foreground)',
                fontSize: 10,
              }}
            />
            <Line
              type="monotone"
              dataKey="days"
              name="Runway"
              stroke="rgb(219 39 119)"
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function FhoRunwayDetailWidget({ surface = 'page' }: { surface?: FhoSurface } = {}) {
  const k4 = kpiById('k4');
  if (surface === 'dashboardSummary') {
    return (
      <div className="min-w-0 space-y-2">
        <KpiHeadline kpi={k4} icon={Activity} iconClass="text-pink-600" compact />
        <p className="text-[11px] text-muted-foreground line-clamp-3">{FHO_RUNWAY_NARRATIVE.body}</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <FhoPageStickyHeader>
        <KpiHeadline kpi={k4} icon={Activity} iconClass="text-pink-600" />
      </FhoPageStickyHeader>
      <p className="text-sm leading-relaxed text-muted-foreground">{FHO_RUNWAY_NARRATIVE.body}</p>
      <div className="flex flex-wrap gap-3 text-xs font-semibold">
        <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-1 text-pink-900 dark:text-pink-200">
          Now: {k4.value}
        </span>
        <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-muted-foreground">
          Prior month: ~{FHO_RUNWAY_NARRATIVE.priorMonthDays} days
        </span>
      </div>
      <FhoRunwayTrendMiniChart />
    </div>
  );
}

export function FhoIoltaTrustDetailWidget({ surface = 'page' }: { surface?: FhoSurface } = {}) {
  if (surface === 'dashboardSummary') {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-emerald-600 shrink-0" strokeWidth={2} />
            <h3 className="text-xs font-bold text-foreground">IOLTA Trust</h3>
          </div>
          <KpiBadge label={ioltaTrustCard.complianceBadge} variant="success" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <p className="font-semibold uppercase tracking-wide text-muted-foreground">Bank</p>
            <p className="font-bold text-foreground">{ioltaTrustCard.bankBalance}</p>
          </div>
          <div>
            <p className="font-semibold uppercase tracking-wide text-muted-foreground">Ledgers</p>
            <p className="font-bold text-foreground">{ioltaTrustCard.clientLedgers}</p>
          </div>
        </div>
        <p className="text-[10px] font-medium text-[var(--chart-emerald)]">{ioltaTrustCard.footer}</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <FhoPageStickyHeader className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Shield className="h-5 w-5 text-emerald-600 shrink-0" strokeWidth={2} />
          <h4 className="text-sm font-bold">IOLTA trust</h4>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-sm font-bold text-emerald-800 dark:text-emerald-200">
            {ioltaTrustCard.complianceBadge}
          </span>
          <span className="text-sm text-muted-foreground">{ioltaTrustCard.footer}</span>
        </div>
      </FhoPageStickyHeader>
      <ul className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
        <li className="flex justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Bank balance</span>
          <span className="font-semibold text-right text-gray-900 dark:text-gray-100">{ioltaTrustCard.bankBalance}</span>
        </li>
        <li className="flex justify-between gap-4 text-sm">
          <span className="text-muted-foreground">Client ledgers</span>
          <span className="font-semibold text-right text-gray-900 dark:text-gray-100">{ioltaTrustCard.clientLedgers}</span>
        </li>
      </ul>
      <ul className="space-y-2">
        {FHO_IOLTA_CHECKLIST.map((row) => (
          <li
            key={row.label}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm"
          >
            <span className="text-gray-700 dark:text-gray-300">{row.label}</span>
            <span className="shrink-0 font-semibold text-emerald-700 dark:text-emerald-300">{row.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FhoUnbilledDetailWidget({ surface = 'page' }: { surface?: FhoSurface } = {}) {
  if (surface === 'dashboardSummary') {
    const topThree = FHO_UNBILLED_MATTER_ROWS.filter((r) => r.rank <= 3);
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-orange-600 shrink-0" strokeWidth={2} />
              <h3 className="text-xs font-bold text-foreground">Unbilled time</h3>
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">{unbilledTimeCard.sublabel}</p>
          </div>
          <KpiBadge label={unbilledTimeCard.opportunityBadge} variant="opportunity" />
        </div>
        <p className="text-lg font-bold text-foreground">{unbilledTimeCard.value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Top aged matters</p>
        <ul className="space-y-1">
          {topThree.map((row) => (
            <li key={row.id} className="flex justify-between gap-2 text-[11px]">
              <span className="min-w-0 truncate text-foreground">{row.matter}</span>
              <span className="shrink-0 font-semibold tabular-nums">{row.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <FhoPageStickyHeader className="space-y-3">
        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <FileText className="h-5 w-5 text-orange-600 shrink-0" strokeWidth={2} />
          <h4 className="text-sm font-bold">Unbilled time</h4>
        </div>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{unbilledTimeCard.value}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{unbilledTimeCard.sublabel}</span>
          <KpiBadge label={unbilledTimeCard.opportunityBadge} variant="opportunity" />
        </div>
      </FhoPageStickyHeader>
      <p className="text-sm text-muted-foreground">
        Ranked matters — top three match your Dashboard card; extended list shows the next aging buckets.
      </p>
      <ol className="space-y-2">
        {FHO_UNBILLED_MATTER_ROWS.map((row) => (
          <li
            key={row.id}
            className="flex flex-col gap-1 rounded-lg border border-border bg-background/60 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold text-muted-foreground">
                {row.rank}
              </span>
              <span className="min-w-0 truncate font-medium text-gray-900 dark:text-gray-100">{row.matter}</span>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 pl-8 sm:pl-0">
              <span className="text-xs font-semibold text-muted-foreground">{row.ageLabel}</span>
              <span className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">{row.amount}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CASH FLOW CHART WIDGET
   ═══════════════════════════════════════════════════════════════════════════ */

const fmtK = (v: number) => `$${Math.round(v / 1000)}K`;
const fmtFull = (v: number) => `$${v.toLocaleString('en-US')}`;

function CashFlowInsightTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const row: FhoCashFlowMonth | undefined = payload[0]?.payload;
  if (!row) return null;

  const idx = FHO_CASH_FLOW_MONTHLY.findIndex((m) => m.month === row.month);
  const prev = idx > 0 ? FHO_CASH_FLOW_MONTHLY[idx - 1] : null;
  const revDelta = prev ? row.realizedRevenue - prev.realizedRevenue : null;

  return (
    <div
      className="rounded-xl border border-border bg-card shadow-lg"
      style={{ minWidth: 260, maxWidth: 320, pointerEvents: 'auto' }}
    >
      <div className="border-b border-border/80 px-4 py-2.5">
        <p className="text-[13px] font-semibold text-foreground">{label} 2026</p>
      </div>
      <div className="space-y-3 px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Billable hours</p>
            <p className="text-base font-bold tabular-nums text-foreground">{fmtFull(row.billableHoursValue)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Realized revenue</p>
            <p className="text-base font-bold tabular-nums text-foreground">{fmtFull(row.realizedRevenue)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-violet-50 px-2 py-0.5 dark:bg-violet-950/40">
            <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300">
              {Math.round(row.realization * 100)}% realization
            </span>
          </div>
          {revDelta !== null && (
            <span className={cn('text-[11px] font-semibold', revDelta >= 0 ? 'text-emerald-600' : 'text-rose-600')}>
              {revDelta >= 0 ? '+' : ''}{fmtK(revDelta)} vs prior
            </span>
          )}
        </div>

        {row.insight && (
          <div className="rounded-lg bg-muted/40 px-3 py-2">
            <div className="mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-violet-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">Insight</span>
            </div>
            <p className="text-[12px] leading-[1.5] text-muted-foreground">{row.insight}</p>
          </div>
        )}

        {row.ctaLabel && (
          <button
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-violet-700 active:scale-[0.98]"
            onClick={(e) => e.stopPropagation()}
          >
            {row.ctaLabel}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function FhoCashFlowChartWidget() {
  return (
    <div>
      {/* Header + legend */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Cash Flow</h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Billable hours value vs realized revenue by month</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: 'linear-gradient(to top, #7C3AED, #A78BFA)' }} />
            <span className="text-[11px] font-medium text-muted-foreground">Billable hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: 'linear-gradient(to top, #DB2777, #F472B6)' }} />
            <span className="text-[11px] font-medium text-muted-foreground">Realized revenue</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={FHO_CASH_FLOW_MONTHLY}
            margin={{ top: 8, right: 4, left: 0, bottom: 4 }}
            barGap={2}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="gradBillable" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
              <linearGradient id="gradRevenue" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#DB2777" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid, #e2e8f0)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--chart-tick, #94a3b8)', fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={52}
              tick={{ fontSize: 10, fill: 'var(--chart-tick, #94a3b8)' }}
              tickFormatter={fmtK}
              domain={[0, 'auto']}
            />
            <Tooltip
              content={<CashFlowInsightTooltip />}
              cursor={{ fill: 'var(--chart-grid, #e2e8f0)', fillOpacity: 0.4, radius: 4 }}
              wrapperStyle={{ zIndex: 50, outline: 'none' }}
              allowEscapeViewBox={{ x: false, y: true }}
            />
            <Bar
              dataKey="billableHoursValue"
              name="Billable hours"
              fill="url(#gradBillable)"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Bar
              dataKey="realizedRevenue"
              name="Realized revenue"
              fill="url(#gradRevenue)"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
