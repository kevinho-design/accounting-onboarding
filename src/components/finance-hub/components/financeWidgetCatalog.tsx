import React from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart2,
  PieChart,
  FileText,
  Sparkles,
  LayoutDashboard,
  Target,
  TrendingUp,
  Wallet,
  Clock,
  ArrowUpFromLine,
  Activity,
  Briefcase,
  Users,
  LineChart as LucideLineChart,
  Gauge,
  Cpu,
  Percent,
  Layers,
  LayoutGrid,
  AlertTriangle,
  Shield,
  Pin,
  PinOff,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart as RePieChart,
  Pie,
  LineChart,
  Line,
  ComposedChart,
} from 'recharts';
import { ThisWeeksBriefing } from './ThisWeeksBriefing';
import type { BriefingInsightId } from '../data/briefingPanelContent';
import { strategicData, type StrategicMonthRow } from '../data/strategicDashboardSeed';
import { FIRM_GOAL_DEFINITIONS } from '../data/firmGoals';
import { buildBriefingFinancialSnapshot, strategicRowsToCashFlowBars } from '../data/briefingFinancialImpact';
import {
  EXPENSE_STACK_COLORS,
  REVENUE_STREAM_COLORS,
  REVENUE_STREAM_LABELS,
} from '../data/profitabilitySeed';
import { useStrategicDashboardCharts } from '../context/StrategicDashboardChartsContext';
import { ModellingPeerComparisonStrip } from './ModellingPeerComparisonStrip';
import {
  getReportTableRows,
  getReportSummaryContent,
  getReportChartSeries,
} from '../data/reportDocumentSeed';
import { ReportDocumentTable } from './ReportDocumentTable';
import {
  practiceAreaRevenueVsGoal,
  billingHealthKpis,
  billingHealthSparkline,
  collectionTrendSeries,
  partnerRealizationRows,
} from '../data/dashboardMetricSeed';
import {
  getCatalogWidgetFullRows,
  getCatalogWidgetSummary,
  type CatalogWidgetSummary,
} from '../data/widgetViewSummaries';
import { getFinanceWidgetExploreAction } from '../data/financeWidgetDrillDown';
import { DIGITAL_TWIN_CATALOG_DESC } from '../data/prototypePersona';
import { DigitalTwinWidget, type DigitalTwinScenarioId } from './DigitalTwinWidget';
import { SuggestedModellingWidget, type ModellingWidgetUiBridge } from './SuggestedModellingWidget';
import {
  FhoFirmGoalsDetailWidget,
  FhoOperatingCashDetailWidget,
  FhoRevenueDetailWidget,
  FhoArAtRiskDetailWidget,
  FhoRunwayDetailWidget,
  FhoIoltaTrustDetailWidget,
  FhoUnbilledDetailWidget,
} from './FinancialHealthOverviewWidgets';

export type { ModellingWidgetUiBridge } from './SuggestedModellingWidget';

/** Canvas / page width: compact = half row on md+ grid; expanded = full row width */
export type WidgetLayoutSize = 'compact' | 'expanded';

/** Main Finances grid column count on md+ breakpoints */
export type MainGridColumns = 2 | 3;

/** Embedded report widget display mode */
export type ReportWidgetView = 'full' | 'chart_compact' | 'summary';

/** Map legacy or unknown values (e.g. removed `chart_expanded`) to a valid mode */
export function normalizeReportView(raw?: string | null): ReportWidgetView {
  if (raw === 'full' || raw === 'summary' || raw === 'chart_compact') return raw;
  return 'chart_compact';
}

export const EMBEDDED_REPORT_WIDGET_ID = 'embedded_report' as const;

/** Built-in Finances page: Financial Health Overview (default firm finances landing). */
export const FP_FINANCIAL_HEALTH_ID = 'fp_financial_health' as const;

/** Built-in Finances page: scenario Modelling (charts + digital twin + modelling rail). */
export const FP_MODELLING_ID = 'fp_modelling' as const;

export type FinancialHealthViewMode = 'detailed' | 'compact';

export function isFinancialHealthOverviewWidgetId(widgetId: string): boolean {
  return widgetId.startsWith('fho_');
}

/** Min + max height for Financial Health Overview widget cards; body scrolls when content exceeds. */
export const FHO_WIDGET_CARD_MIN_CLASS = 'min-h-[420px] md:min-h-[480px] max-h-[480px]';

/** Scrollable body region inside flex column FHO cards (requires min-h-0 for overflow). */
export const FHO_WIDGET_BODY_SCROLL_CLASS = 'flex-1 min-h-0 overflow-y-auto custom-scrollbar';

/** Widgets that must stay in Finances context (charts / goals bridge); no Dashboard pin. */
export function isWidgetPinDisabled(widgetId: string): boolean {
  return widgetId === 'suggested_modelling';
}

/** Modelling is a single interactive surface; Full / Summary / Chart does not apply. */
export function isWidgetDisplayModeToolbarHidden(widgetId: string): boolean {
  return widgetId === 'suggested_modelling';
}

export type FinancePageWidget = {
  instanceId: string;
  widgetId: string;
  layoutSize?: WidgetLayoutSize;
  /** When widgetId === embedded_report */
  reportName?: string;
  reportView?: ReportWidgetView;
};

/** Stable key for pin state (one pin per catalog widget, or per embedded report name). */
export function getFinanceWidgetPinKey(w: Pick<FinancePageWidget, 'widgetId' | 'reportName'>): string {
  if (w.widgetId === EMBEDDED_REPORT_WIDGET_ID && w.reportName?.trim()) {
    return `${EMBEDDED_REPORT_WIDGET_ID}::${w.reportName.trim()}`;
  }
  return w.widgetId;
}

export type ReportLibraryEntry = {
  name: string;
  desc: string;
  icon: LucideIcon;
};

export type HydratedPlacedWidget = {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  desc: string;
  instanceId: string;
  layoutSize: WidgetLayoutSize;
  reportName?: string;
  reportView?: ReportWidgetView;
};

export const WIDGET_CATALOG = [
  {
    id: 'fho_firm_goals_detail',
    title: 'Firm goals (detail)',
    category: 'Financial Health',
    icon: Target,
    desc: 'Dashboard goals strip expanded — progress and Firm Intelligence narrative',
  },
  {
    id: 'fho_operating_cash_detail',
    title: 'Operating cash (detail)',
    category: 'Financial Health',
    icon: Wallet,
    desc: 'Same headline as Dashboard KPI — bridge table and cash drivers',
  },
  {
    id: 'fho_revenue_detail',
    title: 'Revenue (detail)',
    category: 'Financial Health',
    icon: TrendingUp,
    desc: 'Recognized revenue mix, Grow pipeline, and margin context',
  },
  {
    id: 'fho_ar_at_risk_detail',
    title: 'AR at risk (detail)',
    category: 'Financial Health',
    icon: AlertTriangle,
    desc: '60+ overdue invoices plus per-client collection patterns',
  },
  {
    id: 'fho_runway_detail',
    title: 'Runway (detail)',
    category: 'Financial Health',
    icon: Activity,
    desc: 'Dashboard runway KPI with extended narrative and trend',
  },
  {
    id: 'fho_iolta_trust_detail',
    title: 'IOLTA trust (detail)',
    category: 'Financial Health',
    icon: Shield,
    desc: 'Trust balances, compliance, and checklist rows',
  },
  {
    id: 'fho_unbilled_detail',
    title: 'Unbilled time (detail)',
    category: 'Financial Health',
    icon: FileText,
    desc: 'Aged WIP total and ranked matters aligned with Dashboard',
  },
  { id: 'runway', title: 'Runway Projection', category: 'Charts', icon: BarChart2, desc: '6-month cash runway trend' },
  { id: 'cash_flow', title: 'Cash Flow', category: 'Charts', icon: BarChart2, desc: 'Operating cash flow vs target' },
  { id: 'ar_aging', title: 'A/R Aging', category: 'Graphs', icon: PieChart, desc: 'Accounts receivable aging buckets' },
  { id: 'ambient_cfo', title: "This Week's Briefing", category: 'AI', icon: Sparkles, desc: 'Live automated financial insights' },
  {
    id: 'digital_twin',
    title: 'Digital Twin',
    category: 'AI',
    icon: Cpu,
    desc: DIGITAL_TWIN_CATALOG_DESC,
  },
  {
    id: 'suggested_modelling',
    title: 'Suggested Modelling',
    category: 'Modelling',
    icon: Sparkles,
    desc: 'Scenario models, preview overlay on charts, and Explore to review plans before linking models to firm goals',
  },
  { id: 'expense_rep', title: 'Expense Breakdown', category: 'Reports', icon: FileText, desc: 'Monthly expenses by category' },
  { id: 'rev_target', title: 'Revenue Target', category: 'Reports', icon: FileText, desc: 'Progress towards quarterly goals' },
  {
    id: 'financial_goals',
    title: 'Firm goals',
    category: 'Goals',
    icon: Target,
    desc: 'Net revenue YoY, days-to-collect, and 60-day cash reserve—how Firm Intelligence filters recommendations',
  },
  {
    id: 'strat_cash',
    title: 'Cash',
    category: 'Core metrics',
    icon: Wallet,
    desc: 'Projected operating cash (scenario modelling overlay)',
  },
  {
    id: 'strat_burn',
    title: 'Burn',
    category: 'Core metrics',
    icon: ArrowUpFromLine,
    desc: 'Monthly operating burn (scenario modelling overlay)',
  },
  {
    id: 'strat_runway',
    title: 'Runway',
    category: 'Core metrics',
    icon: Activity,
    desc: 'Months of runway (scenario modelling overlay)',
  },
  {
    id: 'practice_areas',
    title: 'Practice Areas',
    category: 'Practice & collections',
    icon: Briefcase,
    desc: 'Revenue by practice area vs firm goal mix',
  },
  {
    id: 'billing_health',
    title: 'Billing Health',
    category: 'Practice & collections',
    icon: Gauge,
    desc: 'WIP, billed vs goal, and realization signals',
  },
  {
    id: 'collection_trends',
    title: 'Collection Trends',
    category: 'Practice & collections',
    icon: LucideLineChart,
    desc: 'Collections and DSO-style trend over recent months',
  },
  {
    id: 'partner_realization',
    title: 'Partner Realization',
    category: 'Practice & collections',
    icon: Users,
    desc: 'Partner-level realization vs target',
  },
  {
    id: 'revenue_streams_trend',
    title: 'Revenue streams',
    category: 'Profitability',
    icon: Layers,
    desc: 'Monthly gross revenue by stream ($k)—hourly, flat fee, referral, other',
  },
  {
    id: 'expense_stacked_trend',
    title: 'Expenses over time',
    category: 'Profitability',
    icon: BarChart2,
    desc: 'Stacked operating expenses by category ($k) each month',
  },
  {
    id: 'profitability_margin',
    title: 'Operating margin',
    category: 'Profitability',
    icon: Percent,
    desc: 'Revenue vs OpEx ($k) and operating margin % trend',
  },
] as const;

export type FinanceCatalogWidgetId = (typeof WIDGET_CATALOG)[number]['id'];

export type FinanceWidgetExplorePayload = {
  widgetId: string;
  reportName?: string;
  fallbackTitle?: string;
  /** Opens Clio Teammate Plan with a suggestion-specific breakdown (Summary mode taps) */
  summarySuggestion?: { headline: string; planSummary?: string };
};

export function defaultLayoutSizeForWidgetId(widgetId: string): WidgetLayoutSize {
  if (
    widgetId === 'ambient_cfo' ||
    widgetId === 'digital_twin' ||
    widgetId === 'financial_goals' ||
    widgetId === EMBEDDED_REPORT_WIDGET_ID ||
    widgetId === 'suggested_modelling' ||
    widgetId === 'revenue_streams_trend' ||
    widgetId === 'expense_stacked_trend' ||
    widgetId === 'profitability_margin'
  ) {
    return 'expanded';
  }
  return 'compact';
}

export function mainGridClass(columns: MainGridColumns = 2): string {
  return columns === 3
    ? 'grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max w-full'
    : 'grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max w-full';
}

/** Span class for expanded widgets so they fill the full main row for 2- or 3-column grids */
export function layoutSizeToGridClass(layoutSize: WidgetLayoutSize, columns: MainGridColumns = 2): string {
  if (layoutSize !== 'expanded') return '';
  return columns === 3 ? 'md:col-span-3' : 'md:col-span-2';
}

/** Same 4-column spans as Dashboard Financial Health pins (compact FHO layout). */
export function dashboardPinGridClass(widgetId: string): string {
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

export function financialHealthCompactMainGridClass(): string {
  return 'grid grid-cols-1 gap-4 lg:grid-cols-4 auto-rows-max w-full';
}

export function hydratePlacedWidgets(
  placed: FinancePageWidget[],
  reportLibrary?: readonly ReportLibraryEntry[],
): HydratedPlacedWidget[] {
  const out: HydratedPlacedWidget[] = [];
  for (const p of placed) {
    /** Page chrome on Financial Health — not a canvas widget (legacy rows are dropped). */
    if (p.widgetId === 'fho_personalization_banner') continue;
    if (p.widgetId === EMBEDDED_REPORT_WIDGET_ID) {
      const rn = p.reportName?.trim();
      if (!rn) continue;
      const meta = reportLibrary?.find((r) => r.name === rn);
      const layoutSize: WidgetLayoutSize = p.layoutSize ?? defaultLayoutSizeForWidgetId(p.widgetId);
      const reportView = normalizeReportView(p.reportView);
      out.push({
        id: EMBEDDED_REPORT_WIDGET_ID,
        title: rn,
        desc: meta?.desc ?? 'Financial report',
        icon: meta?.icon ?? FileText,
        category: 'Reports',
        instanceId: p.instanceId,
        layoutSize,
        reportName: rn,
        reportView,
      });
      continue;
    }
    const c = WIDGET_CATALOG.find((w) => w.id === p.widgetId);
    if (c) {
      const layoutSize: WidgetLayoutSize = p.layoutSize ?? defaultLayoutSizeForWidgetId(p.widgetId);
      const reportView = normalizeReportView(p.reportView);
      out.push({ ...c, instanceId: p.instanceId, layoutSize, reportView });
    }
  }
  return out;
}

/** Persist hydrated canvas rows back to `FinancePageWidget[]` (e.g. customizer save). */
export function financePageWidgetsFromHydrated(hydrated: HydratedPlacedWidget[]): FinancePageWidget[] {
  return hydrated.map((w) => ({
    instanceId: w.instanceId,
    widgetId: w.id,
    layoutSize: w.layoutSize,
    reportView: normalizeReportView(w.reportView),
    ...(w.id === EMBEDDED_REPORT_WIDGET_ID && w.reportName ? { reportName: w.reportName } : {}),
  }));
}

/** Sidebar rail widgets are always compact width (no full-row span). */
export function financeSidebarWidgetsForPersist(widgets: FinancePageWidget[]): FinancePageWidget[] {
  return widgets.map((w) => ({ ...w, layoutSize: 'compact' as const }));
}

/** Hydrated sidebar list for canvas preview — force compact display. */
export function hydrateSidebarPlacedWidgets(
  placed: FinancePageWidget[],
  reportLibrary?: readonly ReportLibraryEntry[],
): HydratedPlacedWidget[] {
  return hydratePlacedWidgets(placed, reportLibrary).map((w) => ({ ...w, layoutSize: 'compact' as const }));
}

const REPORT_VIEW_OPTIONS: { id: ReportWidgetView; label: string }[] = [
  { id: 'full', label: 'Full' },
  { id: 'summary', label: 'Summary' },
  { id: 'chart_compact', label: 'Chart' },
];

export function ReportViewToolbar({
  value,
  onChange,
  className = '',
}: {
  value: ReportWidgetView;
  onChange: (v: ReportWidgetView) => void;
  className?: string;
}) {
  const active = normalizeReportView(value);
  return (
    <div className={`flex flex-wrap gap-1 ${className}`} role="group" aria-label="Widget display mode">
      {REPORT_VIEW_OPTIONS.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          className={`text-[10px] font-semibold px-2 py-1 rounded-md border transition-colors ${
            active === m.id
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export type FinanceWidgetSurface = 'page' | 'dashboardSummary';

export type FinancePagePinUi = {
  activePageId: string;
  /** From `getFinanceWidgetPinKey` for each dashboard pin */
  pinnedPinKeys: ReadonlySet<string>;
  onPin: (row: FinancePageWidget) => void;
  onUnpinPinKey: (pinKey: string) => void;
};

function DashboardPinGenericCatalogSummary({
  id,
  sourcePageId,
  onOpenSourceFinancePage,
}: {
  id: string;
  sourcePageId?: string;
  onOpenSourceFinancePage?: (pageId: string) => void;
}) {
  const cat = WIDGET_CATALOG.find((w) => w.id === id);
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-foreground">{cat?.title ?? id}</p>
      <p className="text-[11px] text-muted-foreground line-clamp-4">
        {cat?.desc ?? 'Pinned widget—open Finances for the full view.'}
      </p>
      {sourcePageId && onOpenSourceFinancePage ? (
        <button
          type="button"
          onClick={() => onOpenSourceFinancePage(sourcePageId)}
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          Open in Finances
        </button>
      ) : null}
    </div>
  );
}

function DashboardPinEmbeddedReportSummary({
  reportName,
  sourcePageId,
  onOpenSourceFinancePage,
  reportLibrary,
}: {
  reportName?: string;
  sourcePageId?: string;
  onOpenSourceFinancePage?: (pageId: string) => void;
  reportLibrary?: readonly ReportLibraryEntry[];
}) {
  const meta = reportName ? reportLibrary?.find((r) => r.name === reportName) : undefined;
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-foreground">{reportName ?? 'Report'}</p>
      <p className="text-[11px] text-muted-foreground line-clamp-3">{meta?.desc ?? 'Embedded financial report'}</p>
      {sourcePageId && onOpenSourceFinancePage ? (
        <button
          type="button"
          onClick={() => onOpenSourceFinancePage(sourcePageId)}
          className="text-[11px] font-semibold text-primary hover:underline"
        >
          Open in Finances
        </button>
      ) : null}
    </div>
  );
}

function CatalogTriSummaryPanel({
  kpis,
  insight,
  suggestions,
  widgetId,
  reportName,
  exploreFallbackTitle,
  onFinanceWidgetExplore,
}: {
  kpis: CatalogWidgetSummary['kpis'];
  insight: string;
  suggestions?: CatalogWidgetSummary['suggestions'];
  widgetId?: string;
  reportName?: string;
  exploreFallbackTitle?: string;
  onFinanceWidgetExplore?: (payload: FinanceWidgetExplorePayload) => void;
}) {
  const canOpenPlan = Boolean(onFinanceWidgetExplore && widgetId);
  return (
    <div className="mt-2 space-y-3">
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {kpis.map((k) => (
          <li
            key={k.label}
            className="flex justify-between gap-2 text-[11px] rounded-md border border-gray-100 bg-gray-50/80 px-2.5 py-1.5"
          >
            <span className="text-gray-500">{k.label}</span>
            <span className="font-semibold text-gray-900">{k.value}</span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-gray-600 leading-snug border-t border-gray-100 pt-2">{insight}</p>
      {suggestions && suggestions.length > 0 ? (
        <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-blue-900/90">Firm Intelligence suggests</p>
          {canOpenPlan ? (
            <p className="mt-1 text-[10px] text-blue-900/70">
              Tap an action to open Clio Teammate with a step-by-step plan.
            </p>
          ) : null}
          <ul className="mt-2 space-y-1.5 pl-0 list-none text-[11px] leading-snug text-gray-800">
            {suggestions.map((s, i) => (
              <li key={i} className="pl-0">
                {canOpenPlan ? (
                  <button
                    type="button"
                    onClick={() =>
                      onFinanceWidgetExplore!({
                        widgetId: widgetId!,
                        reportName,
                        fallbackTitle: exploreFallbackTitle,
                        summarySuggestion: { headline: s.text, planSummary: s.planSummary },
                      })
                    }
                    className="group flex w-full items-start gap-2 rounded-md border border-transparent px-2 py-1.5 text-left transition-colors hover:border-blue-200/80 hover:bg-blue-100/40"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600/80" aria-hidden />
                    <span className="min-w-0 flex-1 font-medium text-gray-900">{s.text}</span>
                    <ChevronRight
                      className="mt-1 size-4 shrink-0 text-primary opacity-70 group-hover:opacity-100"
                      aria-hidden
                    />
                  </button>
                ) : (
                  <div className="flex items-start gap-2 px-2 py-1.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600/50" aria-hidden />
                    <span>{s.text}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function CatalogFullDetailTable({ rows }: { rows: { label: string; value: string }[] }) {
  if (rows.length === 0) return null;
  return (
    <div className="mt-2 rounded-md border border-gray-100 overflow-hidden">
      <table className="w-full text-[11px]">
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.label}-${i}`} className="border-b border-gray-100 last:border-0">
              <td className="px-2.5 py-1.5 text-gray-500 align-top w-[40%]">{r.label}</td>
              <td className="px-2.5 py-1.5 font-medium text-gray-900">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function catalogTriMode(
  rv: ReportWidgetView,
  chart: React.ReactNode,
  summary: CatalogWidgetSummary,
  full: React.ReactNode,
  summaryExplore?: {
    widgetId: string;
    reportName?: string;
    exploreFallbackTitle?: string;
    onFinanceWidgetExplore?: (payload: FinanceWidgetExplorePayload) => void;
  } | null,
): React.ReactNode {
  if (rv === 'summary')
    return (
      <CatalogTriSummaryPanel
        kpis={summary.kpis}
        insight={summary.insight}
        suggestions={summary.suggestions}
        widgetId={summaryExplore?.widgetId}
        reportName={summaryExplore?.reportName}
        exploreFallbackTitle={summaryExplore?.exploreFallbackTitle}
        onFinanceWidgetExplore={summaryExplore?.onFinanceWidgetExplore}
      />
    );
  if (rv === 'full') {
    return (
      <div className="w-full min-h-[200px] max-h-[min(70vh,520px)] overflow-y-auto rounded-lg border border-gray-100 bg-white -mx-1 p-2 space-y-4">
        {full}
      </div>
    );
  }
  return chart;
}

type FinanceWidgetContentProps = {
  id: string;
  instanceId?: string;
  onTakeAction?: (insightId: string) => void;
  onExploreData?: (insightId: string) => void;
  /** Customizer uses compact; saved dashboard pages use full briefing */
  thisWeeksBriefingCompact?: boolean;
  /** Hide briefing rows after Execute Recommended Plan */
  executedBriefingInsightIds?: readonly BriefingInsightId[];
  /** Embedded report widget only */
  reportName?: string;
  reportView?: ReportWidgetView;
  onDigitalTwinScenario?: (id: DigitalTwinScenarioId) => void;
  /** suggested_modelling — preview/goals/create; omit to show placeholder */
  modellingUi?: ModellingWidgetUiBridge | null;
  /** Dashboard Financial Health pin strip */
  surface?: FinanceWidgetSurface;
  onOpenFullFinancialHealth?: () => void;
  onOpenSourceFinancePage?: (pageId: string) => void;
  /** Pinned-from page (generic + embedded summaries) */
  sourcePageId?: string;
  reportLibrary?: readonly ReportLibraryEntry[];
  /** Summary suggestions + footer Explore actions → Clio Teammate Plan */
  onFinanceWidgetExplore?: (payload: FinanceWidgetExplorePayload) => void;
  exploreFallbackTitle?: string;
};

function FinanceWidgetBody({
  id,
  instanceId,
  onTakeAction,
  onExploreData,
  thisWeeksBriefingCompact = true,
  executedBriefingInsightIds,
  reportName,
  reportView: reportViewProp = 'chart_compact',
  onDigitalTwinScenario,
  modellingUi,
  surface = 'page',
  onOpenFullFinancialHealth,
  onOpenSourceFinancePage,
  sourcePageId,
  reportLibrary,
  onFinanceWidgetExplore,
  exploreFallbackTitle,
}: FinanceWidgetContentProps) {
  const reportView = normalizeReportView(reportViewProp);
  const chartCtx = useStrategicDashboardCharts();
  const chartData: StrategicMonthRow[] = chartCtx?.displayStrategicData ?? (strategicData as StrategicMonthRow[]);
  const selectedModelId = chartCtx?.selectedModelId ?? null;
  const peerBenchmarkEnabled = chartCtx?.peerBenchmarkEnabled ?? false;
  const briefingSnapshot = chartCtx?.briefingSnapshot ?? buildBriefingFinancialSnapshot([]);

  const cashFlowSeries = strategicRowsToCashFlowBars(
    chartData.map((r) => ({
      month: r.month,
      cash: r.altCash ?? r.cash,
      burn: r.altBurn ?? r.burn,
    })),
  );
  const cashFlowComposedData = cashFlowSeries.map((bar, i) => {
    const r = chartData[i];
    return {
      ...bar,
      firmCash: r?.cash,
      altCashLine: r?.altCash,
      peerCashLine: r?.peerCash,
    };
  });
  const revPie = [
    { name: 'Current', value: briefingSnapshot.revenue.pieCurrent },
    { name: 'Target', value: briefingSnapshot.revenue.pieRemaining },
  ];
  const chartId = instanceId || Math.random().toString(36).substr(2, 9);
  const gradientId = `color-${id}-${chartId}`;
  const lastStrategicRow = chartData[chartData.length - 1];
  const strategicPrev = chartData.length >= 2 ? chartData[chartData.length - 2] : undefined;

  const tri = (widgetKey: string, chartEl: React.ReactNode) => {
    const s = getCatalogWidgetSummary(widgetKey, briefingSnapshot, lastStrategicRow, {
      strategicPrev,
      reportName,
    });
    if (!s) return chartEl;
    const fullRows = getCatalogWidgetFullRows(widgetKey, briefingSnapshot, lastStrategicRow);
    const summaryExplore =
      onFinanceWidgetExplore != null
        ? {
            widgetId: widgetKey,
            reportName,
            exploreFallbackTitle,
            onFinanceWidgetExplore,
          }
        : null;
    return catalogTriMode(
      reportView,
      chartEl,
      s,
      <>
        <div className="min-h-[140px]">{chartEl}</div>
        <CatalogFullDetailTable rows={fullRows} />
      </>,
      summaryExplore,
    );
  };

  if (surface === 'dashboardSummary') {
    switch (id) {
      case 'fho_firm_goals_detail':
        return <FhoFirmGoalsDetailWidget surface="dashboardSummary" />;
      case 'fho_operating_cash_detail':
        return <FhoOperatingCashDetailWidget surface="dashboardSummary" />;
      case 'fho_revenue_detail':
        return <FhoRevenueDetailWidget surface="dashboardSummary" />;
      case 'fho_ar_at_risk_detail':
        return <FhoArAtRiskDetailWidget surface="dashboardSummary" />;
      case 'fho_runway_detail':
        return <FhoRunwayDetailWidget surface="dashboardSummary" />;
      case 'fho_iolta_trust_detail':
        return <FhoIoltaTrustDetailWidget surface="dashboardSummary" />;
      case 'fho_unbilled_detail':
        return <FhoUnbilledDetailWidget surface="dashboardSummary" />;
      case EMBEDDED_REPORT_WIDGET_ID:
        return (
          <DashboardPinEmbeddedReportSummary
            reportName={reportName}
            sourcePageId={sourcePageId}
            onOpenSourceFinancePage={onOpenSourceFinancePage}
            reportLibrary={reportLibrary}
          />
        );
      default:
        return (
          <DashboardPinGenericCatalogSummary
            id={id}
            sourcePageId={sourcePageId}
            onOpenSourceFinancePage={onOpenSourceFinancePage}
          />
        );
    }
  }

  switch (id) {
    case 'fho_firm_goals_detail':
      return tri('fho_firm_goals_detail', <FhoFirmGoalsDetailWidget />);
    case 'fho_operating_cash_detail':
      return tri('fho_operating_cash_detail', <FhoOperatingCashDetailWidget />);
    case 'fho_revenue_detail':
      return tri('fho_revenue_detail', <FhoRevenueDetailWidget />);
    case 'fho_ar_at_risk_detail':
      return tri('fho_ar_at_risk_detail', <FhoArAtRiskDetailWidget />);
    case 'fho_runway_detail':
      return tri('fho_runway_detail', <FhoRunwayDetailWidget />);
    case 'fho_iolta_trust_detail':
      return tri('fho_iolta_trust_detail', <FhoIoltaTrustDetailWidget />);
    case 'fho_unbilled_detail':
      return tri('fho_unbilled_detail', <FhoUnbilledDetailWidget />);
    case 'runway': {
      const showRwOverlay = peerBenchmarkEnabled || Boolean(selectedModelId);
      const rwTooltipLabel = (name: string) => {
        if (name === 'runway') return 'Your firm';
        if (name === 'altRunway') return 'Scenario (Preview)';
        if (name === 'peerRunway') return 'Peer composite';
        return name;
      };
      return tri(
        'runway',
        (
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 min-h-[150px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  id={`chart-${chartId}`}
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: showRwOverlay ? 4 : 0 }}
                  accessibilityLayer={false}
                >
                  <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                  <XAxis key="xaxis" dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} dy={10} />
                  <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} />
                  <Tooltip
                    key="tooltip"
                    contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number, name: string) => [`${value} months`, rwTooltipLabel(name)]}
                  />
                  {showRwOverlay ? <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} /> : null}
                  <Line
                    key="line-firm"
                    name="Your firm"
                    type="monotone"
                    dataKey="runway"
                    stroke="var(--chart-emerald)"
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                  />
                  {selectedModelId ? (
                    <Line
                      key="line-alt"
                      name="Scenario (Preview)"
                      type="monotone"
                      dataKey="altRunway"
                      stroke="var(--chart-scenario)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3, strokeWidth: 1.5, fill: '#fff' }}
                    />
                  ) : null}
                  {peerBenchmarkEnabled ? (
                    <Line
                      key="line-peer"
                      name="Peer composite"
                      type="monotone"
                      dataKey="peerRunway"
                      stroke="var(--chart-peer)"
                      strokeWidth={1.75}
                      strokeDasharray="2 4"
                      dot={{ r: 2.5, strokeWidth: 1.5, fill: '#fff' }}
                    />
                  ) : null}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ),
      );
    }
    case 'cash_flow': {
      const showCashOverlay = peerBenchmarkEnabled || Boolean(selectedModelId);
      const cashLineTooltip = (name: string) => {
        if (name === 'firmCash') return 'Your firm (cash $)';
        if (name === 'altCashLine') return 'Scenario cash ($)';
        if (name === 'peerCashLine') return 'Peer cash ($)';
        return name;
      };
      return tri(
        'cash_flow',
        (
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 min-h-[150px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  id={`chart-${chartId}`}
                  data={cashFlowComposedData}
                  margin={{ top: 4, right: showCashOverlay ? 8 : 0, left: -20, bottom: showCashOverlay ? 4 : 0 }}
                  accessibilityLayer={false}
                >
                <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis key="xaxis" dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} dy={10} />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'var(--chart-tick)' }}
                />
                {showCashOverlay ? (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: 'var(--chart-tick)' }}
                    width={44}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                ) : null}
                <Tooltip
                  key="tooltip"
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => {
                    if (name === 'firmCash' || name === 'altCashLine' || name === 'peerCashLine') {
                      return [`$${value.toLocaleString()}`, cashLineTooltip(name)];
                    }
                    return [value, name];
                  }}
                />
                <Legend key="legend" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconType="circle" iconSize={6} />
                <Bar yAxisId="left" key="bar-in" dataKey="in" name="Cash In" fill="var(--chart-ocean)" radius={[4, 4, 0, 0]} barSize={8} />
                <Bar yAxisId="left" key="bar-out" dataKey="out" name="Cash Out" fill="var(--chart-coral)" radius={[4, 4, 0, 0]} barSize={8} />
                {selectedModelId ? (
                  <Line
                    yAxisId="right"
                    key="line-alt-cash"
                    type="monotone"
                    dataKey="altCashLine"
                    name="Scenario cash ($)"
                    stroke="var(--chart-scenario)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                ) : null}
                {peerBenchmarkEnabled ? (
                  <Line
                    yAxisId="right"
                    key="line-peer-cash"
                    type="monotone"
                    dataKey="peerCashLine"
                    name="Peer cash ($)"
                    stroke="var(--chart-peer)"
                    strokeWidth={2}
                    strokeDasharray="2 4"
                    dot={false}
                  />
                ) : null}
                {selectedModelId || peerBenchmarkEnabled ? (
                  <Line
                    yAxisId="right"
                    key="line-firm-cash"
                    type="monotone"
                    dataKey="firmCash"
                    name="Your firm (cash $)"
                    stroke="var(--chart-ocean)"
                    strokeWidth={1.75}
                    dot={false}
                  />
                ) : null}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        ),
      );
    }
    case 'ar_aging':
      return tri(
        'ar_aging',
        (
        <div className="h-full w-full flex flex-col items-center justify-center mt-2">
          <div className="w-full h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart id={`chart-${chartId}`}>
                <Pie key="pie" data={briefingSnapshot.arAging} innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                  {briefingSnapshot.arAging.map((entry) => (
                    <Cell key={`cell-${entry.name.replace(/\s+/g, '-')}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip" formatter={(value: number) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {briefingSnapshot.arAging.map((entry) => (
              <div key={`legend-${entry.name.replace(/\s+/g, '-')}`} className="flex items-center gap-1 text-[10px] text-gray-600">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
        ),
      );
    case 'expense_rep':
      return tri(
        'expense_rep',
        (
        <div className="h-full w-full flex flex-col mt-2">
          <div className="w-full h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart id={`chart-${chartId}`}>
                <Pie key="pie" data={briefingSnapshot.expenseRep} innerRadius={0} outerRadius={60} paddingAngle={0} dataKey="value">
                  {briefingSnapshot.expenseRep.map((entry) => (
                    <Cell key={`exp-cell-${entry.name.replace(/\s+/g, '-')}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip key="tooltip" formatter={(value: number) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {briefingSnapshot.expenseRep.map((entry) => (
              <div key={`exp-legend-${entry.name.replace(/\s+/g, '-')}`} className="flex items-center gap-1 text-[10px] text-gray-600">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
        ),
      );
    case 'rev_target':
      return tri(
        'rev_target',
        (
        <div className="h-full w-full flex flex-col justify-center items-center mt-2">
          <div className="relative w-full h-[140px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart id={`chart-${chartId}`}>
                <Pie key="pie" data={revPie} startAngle={180} endAngle={0} innerRadius={50} outerRadius={70} paddingAngle={0} dataKey="value">
                  <Cell key="rev-curr" fill="var(--chart-emerald)" />
                  <Cell key="rev-targ" fill="var(--chart-grid)" />
                </Pie>
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center" style={{ top: '55%' }}>
              <span className="text-[20px] font-bold text-gray-900 leading-none">{briefingSnapshot.revenue.centerPct}%</span>
              <span className="text-[10px] text-gray-500">{briefingSnapshot.revenue.subtitle}</span>
            </div>
          </div>
          <div className="w-full bg-gray-50 rounded-[6px] p-2 mt-2 border border-gray-100">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-gray-500">Current Q3 Revenue</span>
              <span className="font-semibold text-gray-900">${briefingSnapshot.revenue.footerAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        ),
      );
    case 'ambient_cfo': {
      const ac = getCatalogWidgetSummary('ambient_cfo', briefingSnapshot, lastStrategicRow, { strategicPrev });
      if (reportView === 'summary' && ac) {
        return (
          <CatalogTriSummaryPanel
            kpis={ac.kpis}
            insight={ac.insight}
            suggestions={ac.suggestions}
            widgetId="ambient_cfo"
            exploreFallbackTitle={"This week's briefing"}
            onFinanceWidgetExplore={onFinanceWidgetExplore}
          />
        );
      }
      if (reportView === 'full') {
        return (
          <div className="w-full min-h-[200px] max-h-[min(70vh,520px)] overflow-y-auto rounded-lg border border-gray-100 bg-white -mx-1 p-2">
            <ThisWeeksBriefing
              onTakeAction={onTakeAction}
              onExploreData={onExploreData}
              isCompact={false}
              executedInsightIds={executedBriefingInsightIds}
            />
          </div>
        );
      }
      return (
        <ThisWeeksBriefing
          onTakeAction={onTakeAction}
          onExploreData={onExploreData}
          isCompact={thisWeeksBriefingCompact}
          executedInsightIds={executedBriefingInsightIds}
        />
      );
    }
    case 'digital_twin':
      return tri(
        'digital_twin',
        <DigitalTwinWidget displayStrategicData={chartData} onExploreScenario={onDigitalTwinScenario} />,
      );
    case 'suggested_modelling':
      if (!modellingUi) {
        return (
          <div className="text-xs text-gray-500 py-4 text-center border border-dashed border-gray-200 rounded-[8px]">
            Modelling controls load on the live Finances page.
          </div>
        );
      }
      return tri('suggested_modelling', <SuggestedModellingWidget bridge={modellingUi} />);
    case 'financial_goals':
      return tri(
        'financial_goals',
        (
        <div className="h-full w-full flex flex-col mt-1">
          <p className="text-[11px] text-gray-500 mb-3">
            Firm Intelligence filters insights through these firm goals (aligned with your Dashboard strip).
          </p>
          <div className="grid grid-cols-1 gap-2.5">
            {FIRM_GOAL_DEFINITIONS.map((goal) => {
              const Icon =
                goal.id === 'net_revenue_yoy'
                  ? TrendingUp
                  : goal.id === 'days_to_collect'
                    ? Clock
                    : Wallet;
              const iconClass =
                goal.id === 'net_revenue_yoy'
                  ? 'text-emerald-600'
                  : goal.id === 'days_to_collect'
                    ? 'text-amber-600'
                    : 'text-blue-600';
              return (
                <div
                  key={goal.id}
                  className="rounded-[8px] border border-gray-100 bg-gray-50/80 p-2.5 flex flex-col gap-1.5"
                >
                  <div className="flex items-start gap-1.5 min-w-0">
                    <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${iconClass}`} strokeWidth={2} />
                    <span className="text-[11px] font-bold text-gray-900 leading-snug">{goal.title}</span>
                  </div>
                  <div className="flex justify-between text-[9px] gap-2 pl-5">
                    <span
                      className={
                        goal.status === 'on_track' ? 'text-emerald-700 font-semibold' : 'text-amber-800 font-semibold'
                      }
                    >
                      {goal.status === 'on_track' ? 'On track' : 'Behind'}
                    </span>
                    <span className="text-gray-600 text-right">
                      {goal.progressCurrentLabel} → {goal.progressTargetLabel}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden pl-5">
                    <div
                      className={`h-1 rounded-full ${goal.status === 'on_track' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${Math.min(100, goal.progressPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        ),
      );
    case 'strat_cash': {
      const showStratLegend = peerBenchmarkEnabled || Boolean(selectedModelId);
      const cashTooltipLabel = (name: string) => {
        if (name === 'cash') return 'Your firm';
        if (name === 'altCash') return 'Scenario (Preview)';
        if (name === 'peerCash') return 'Peer composite';
        return name;
      };
      return tri(
        'strat_cash',
        (
        <div className="w-full mt-2 h-[300px] min-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: showStratLegend ? 8 : 0 }} accessibilityLayer={false}>
              <defs key="defs">
                <linearGradient id={`${gradientId}-cash`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-ocean)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--chart-ocean)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis key="xaxis" dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} dy={10} />
              <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} dx={-10} width={50} />
              <Tooltip
                key="tooltip"
                contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, cashTooltipLabel(name)]}
              />
              {showStratLegend && (
                <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} formatter={(value) => value} />
              )}
              <Area
                key="area"
                name="Your firm"
                type="monotone"
                dataKey="cash"
                stroke="var(--chart-ocean)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradientId}-cash)`}
              />
              {selectedModelId && (
                <Area
                  key="areaAlt"
                  name="Scenario (Preview)"
                  type="monotone"
                  dataKey="altCash"
                  stroke="var(--chart-scenario)"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  fillOpacity={0}
                />
              )}
              {peerBenchmarkEnabled && (
                <Area
                  key="areaPeer"
                  name="Peer composite"
                  type="monotone"
                  dataKey="peerCash"
                  stroke="var(--chart-peer)"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  fillOpacity={0}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        ),
      );
    }
    case 'strat_burn': {
      const nBars = 1 + (selectedModelId ? 1 : 0) + (peerBenchmarkEnabled ? 1 : 0);
      const barW = nBars >= 3 ? 10 : nBars === 2 ? 14 : 28;
      const showBurnLegend = peerBenchmarkEnabled || Boolean(selectedModelId);
      const burnTooltipLabel = (name: string) => {
        if (name === 'burn') return 'Your firm';
        if (name === 'altBurn') return 'Scenario (Preview)';
        if (name === 'peerBurn') return 'Peer composite';
        return name;
      };
      return tri(
        'strat_burn',
        (
        <div className="w-full mt-2 h-[300px] min-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: showBurnLegend ? 8 : 0 }} accessibilityLayer={false}>
              <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis key="xaxis" dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} dy={10} />
              <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} dx={-10} width={50} />
              <Tooltip
                key="tooltip"
                cursor={{ fill: 'var(--surface-page)' }}
                contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, burnTooltipLabel(name)]}
              />
              {showBurnLegend && <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />}
              <Bar name="Your firm" dataKey="burn" fill="var(--chart-coral)" radius={[4, 4, 0, 0]} barSize={barW} />
              {selectedModelId && (
                <Bar name="Scenario (Preview)" dataKey="altBurn" fill="var(--chart-scenario)" radius={[4, 4, 0, 0]} barSize={barW} />
              )}
              {peerBenchmarkEnabled && (
                <Bar name="Peer composite" dataKey="peerBurn" fill="var(--chart-peer)" radius={[4, 4, 0, 0]} barSize={barW} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
        ),
      );
    }
    case 'strat_runway': {
      const showRwLegend = peerBenchmarkEnabled || Boolean(selectedModelId);
      const rwTooltipLabel = (name: string) => {
        if (name === 'runway') return 'Your firm';
        if (name === 'altRunway') return 'Scenario (Preview)';
        if (name === 'peerRunway') return 'Peer composite';
        return name;
      };
      return tri(
        'strat_runway',
        (
        <div className="w-full mt-2 h-[300px] min-h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: showRwLegend ? 8 : 0 }} accessibilityLayer={false}>
              <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis key="xaxis" dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} dy={10} />
              <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} dx={-10} width={40} />
              <Tooltip
                key="tooltip"
                contentStyle={{ borderRadius: '8px', fontSize: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number, name: string) => [`${value} months`, rwTooltipLabel(name)]}
              />
              {showRwLegend && <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />}
              <Line
                name="Your firm"
                type="monotone"
                dataKey="runway"
                stroke="var(--chart-emerald)"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, fill: 'var(--chart-emerald)' }}
              />
              {selectedModelId && (
                <Line
                  name="Scenario (Preview)"
                  type="monotone"
                  dataKey="altRunway"
                  stroke="var(--chart-scenario)"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, fill: 'var(--chart-scenario)' }}
                />
              )}
              {peerBenchmarkEnabled && (
                <Line
                  name="Peer composite"
                  type="monotone"
                  dataKey="peerRunway"
                  stroke="var(--chart-peer)"
                  strokeWidth={2}
                  strokeDasharray="2 4"
                  dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 5, fill: 'var(--chart-peer)' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        ),
      );
    }
    case EMBEDDED_REPORT_WIDGET_ID: {
      const rn = reportName?.trim() || 'Report';
      const rows = getReportTableRows(rn);
      const summary = getReportSummaryContent(rn);
      const series = getReportChartSeries(rn);
      const chartH = 160;

      if (reportView === 'full') {
        return (
          <div className="w-full min-h-[200px] max-h-[min(70vh,520px)] overflow-y-auto rounded-lg border border-gray-100 bg-white -mx-1">
            <ReportDocumentTable rows={rows} compact />
          </div>
        );
      }
      if (reportView === 'summary') {
        const fiEmbedded = getCatalogWidgetSummary(EMBEDDED_REPORT_WIDGET_ID, briefingSnapshot, lastStrategicRow, {
          strategicPrev,
          reportName,
        });
        return (
          <CatalogTriSummaryPanel
            kpis={summary.kpis}
            insight={summary.insight}
            suggestions={fiEmbedded?.suggestions}
            widgetId={EMBEDDED_REPORT_WIDGET_ID}
            reportName={reportName}
            exploreFallbackTitle={rn}
            onFinanceWidgetExplore={onFinanceWidgetExplore}
          />
        );
      }
      return (
        <div className="w-full mt-2" style={{ height: chartH, minHeight: chartH }}>
          <ResponsiveContainer width="100%" height={chartH}>
            <AreaChart data={series} margin={{ top: 6, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id={`${gradientId}-rep`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-ocean)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--chart-ocean)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} width={36} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid var(--border)' }}
                formatter={(v: number) => [v, rn]}
              />
              <Area type="monotone" dataKey="value" stroke="var(--chart-ocean)" strokeWidth={2} fillOpacity={1} fill={`url(#${gradientId}-rep)`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );
    }
    case 'practice_areas': {
      const paData = practiceAreaRevenueVsGoal.map((p) => ({
        area: p.area.length > 10 ? `${p.area.slice(0, 9)}…` : p.area,
        revenue: p.revenue,
        goalIdx: Math.round(p.goalPct * 4),
      }));
      const practiceAreasChartH = 200;
      return tri(
        'practice_areas',
        (
        <div className="w-full flex flex-col mt-1 shrink-0">
          <p className="text-[10px] text-gray-500 mb-2 shrink-0">
            Revenue ($k) by practice vs firm goal mix (% of revenue plan).
          </p>
          <div className="w-full shrink-0" style={{ height: practiceAreasChartH }}>
            <ResponsiveContainer width="100%" height={practiceAreasChartH}>
              <BarChart data={paData} margin={{ top: 4, right: 8, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} interval={0} angle={-12} textAnchor="end" height={48} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  formatter={(v: number, name: string) =>
                    name === 'revenue' ? [`$${v}k`, 'Revenue'] : [v, 'Goal index']
                  }
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="revenue" name="Revenue ($k)" fill="var(--chart-ocean)" radius={[3, 3, 0, 0]} maxBarSize={28} />
                <Bar dataKey="goalIdx" name="Goal mix (×4%)" fill="var(--chart-sky)" radius={[3, 3, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        ),
      );
    }
    case 'billing_health':
      return tri(
        'billing_health',
        (
        <div className="h-full w-full flex flex-col gap-3 mt-1">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 p-2 text-center">
              <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">Draft WIP</p>
              <p className="text-sm font-bold text-gray-900">{billingHealthKpis.draftWip}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 p-2 text-center">
              <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">Billed / goal</p>
              <p className="text-sm font-bold text-emerald-700">{billingHealthKpis.billedVsGoal}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 p-2 text-center">
              <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">Realization</p>
              <p className="text-sm font-bold text-gray-900">{billingHealthKpis.realizationProxy}</p>
            </div>
          </div>
          <div className="h-[100px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={billingHealthSparkline} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id={`${gradientId}-bh`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-emerald)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--chart-emerald)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} />
                <YAxis domain={[80, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} width={32} />
                <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="v" stroke="var(--chart-emerald)" strokeWidth={2} fill={`url(#${gradientId}-bh)`} name="Health index" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        ),
      );
    case 'collection_trends': {
      const collectionChartH = 232;
      return tri(
        'collection_trends',
        (
        <div className="w-full flex flex-col mt-1 shrink-0">
          <p className="text-[10px] text-gray-500 mb-1 shrink-0">
            Collections ($k) and DSO (days, right axis).
          </p>
          <div className="w-full shrink-0" style={{ height: collectionChartH }}>
            <ResponsiveContainer width="100%" height={collectionChartH}>
              <LineChart data={collectionTrendSeries} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} width={36} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: 2 }} layout="horizontal" verticalAlign="bottom" />
                <Line yAxisId="left" type="monotone" dataKey="collections" name="Collections ($k)" stroke="var(--chart-ocean)" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="dso" name="DSO (days)" stroke="var(--brand-amber)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        ),
      );
    }
    case 'partner_realization': {
      const partnerChartH = 240;
      return tri(
        'partner_realization',
        (
        <div className="w-full flex flex-col mt-1 shrink-0">
          <p className="text-[10px] text-gray-500 mb-2 shrink-0">Realization % vs internal target by partner.</p>
          <div className="w-full shrink-0" style={{ height: partnerChartH }}>
            <ResponsiveContainer width="100%" height={partnerChartH}>
              <BarChart
                layout="vertical"
                data={partnerRealizationRows}
                margin={{ top: 4, right: 16, left: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--chart-grid)" />
                <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} unit="%" />
                <YAxis type="category" dataKey="partner" width={72} axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-primary)' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                  formatter={(v: number, name: string) => [`${v}%`, name === 'realization' ? 'Realization' : 'Target']}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="target" name="Target" fill="var(--muted)" radius={[0, 4, 4, 0]} barSize={10} />
                <Bar dataKey="realization" name="Realization" fill="var(--chart-ocean)" radius={[0, 4, 4, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        ),
      );
    }
    case 'revenue_streams_trend': {
      const rsData = briefingSnapshot.revenueStreamsTrend;
      const rsH = 228;
      return tri(
        'revenue_streams_trend',
        (
        <div className="w-full flex flex-col mt-1 shrink-0">
          <p className="text-[10px] text-gray-500 mb-2 shrink-0">
            Gross revenue by stream ($k). Reflects executed briefing plans where applicable.
          </p>
          <div className="w-full shrink-0" style={{ height: rsH }}>
            <ResponsiveContainer width="100%" height={rsH}>
              <AreaChart data={rsData} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} width={36} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="hourly"
                  name={REVENUE_STREAM_LABELS.hourly}
                  stackId="rev"
                  stroke={REVENUE_STREAM_COLORS.hourly}
                  fill={REVENUE_STREAM_COLORS.hourly}
                  fillOpacity={0.9}
                />
                <Area
                  type="monotone"
                  dataKey="flatFee"
                  name={REVENUE_STREAM_LABELS.flatFee}
                  stackId="rev"
                  stroke={REVENUE_STREAM_COLORS.flatFee}
                  fill={REVENUE_STREAM_COLORS.flatFee}
                  fillOpacity={0.9}
                />
                <Area
                  type="monotone"
                  dataKey="referral"
                  name={REVENUE_STREAM_LABELS.referral}
                  stackId="rev"
                  stroke={REVENUE_STREAM_COLORS.referral}
                  fill={REVENUE_STREAM_COLORS.referral}
                  fillOpacity={0.9}
                />
                <Area
                  type="monotone"
                  dataKey="other"
                  name={REVENUE_STREAM_LABELS.other}
                  stackId="rev"
                  stroke={REVENUE_STREAM_COLORS.other}
                  fill={REVENUE_STREAM_COLORS.other}
                  fillOpacity={0.9}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        ),
      );
    }
    case 'expense_stacked_trend': {
      const exData = briefingSnapshot.expenseStackedTrend;
      const exH = 228;
      return tri(
        'expense_stacked_trend',
        (
        <div className="w-full flex flex-col mt-1 shrink-0">
          <p className="text-[10px] text-gray-500 mb-2 shrink-0">
            Operating expense categories ($k) stacked by month—mirrors expense mix on your dashboard.
          </p>
          <div className="w-full shrink-0" style={{ height: exH }}>
            <ResponsiveContainer width="100%" height={exH}>
              <BarChart data={exData} margin={{ top: 8, right: 8, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} width={36} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Payroll" stackId="ex" fill={EXPENSE_STACK_COLORS.Payroll} name="Payroll" maxBarSize={36} />
                <Bar dataKey="Marketing" stackId="ex" fill={EXPENSE_STACK_COLORS.Marketing} name="Marketing" maxBarSize={36} />
                <Bar dataKey="Software" stackId="ex" fill={EXPENSE_STACK_COLORS.Software} name="Software" maxBarSize={36} />
                <Bar dataKey="Office" stackId="ex" fill={EXPENSE_STACK_COLORS.Office} name="Office" maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        ),
      );
    }
    case 'profitability_margin': {
      const plData = briefingSnapshot.profitabilityMarginTrend;
      const last = plData[plData.length - 1];
      const avgMargin =
        plData.length > 0
          ? Math.round((plData.reduce((s, r) => s + r.operatingMarginPct, 0) / plData.length) * 10) / 10
          : 0;
      const plH = 200;
      return tri(
        'profitability_margin',
        (
        <div className="w-full flex flex-col mt-1 gap-3 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 px-2.5 py-2">
              <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">Latest rev ($k)</p>
              <p className="text-sm font-bold text-gray-900">{last != null ? last.revenue : '—'}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 px-2.5 py-2">
              <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">Latest OpEx ($k)</p>
              <p className="text-sm font-bold text-gray-900">{last != null ? last.expenses : '—'}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 px-2.5 py-2">
              <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">Latest margin</p>
              <p className="text-sm font-bold text-emerald-700">
                {last != null ? `${last.operatingMarginPct}%` : '—'}
              </p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50/90 px-2.5 py-2">
              <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wide">Avg margin (window)</p>
              <p className="text-sm font-bold text-gray-900">{avgMargin}%</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-500 shrink-0">
            Revenue vs operating expenses ($k, left) and operating margin % (right).
          </p>
          <div className="w-full shrink-0" style={{ height: plH }}>
            <ResponsiveContainer width="100%" height={plH}>
              <ComposedChart data={plData} margin={{ top: 8, right: 12, left: -12, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'var(--chart-tick)' }} />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: 'var(--chart-tick)' }}
                  width={36}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: 'var(--chart-tick)' }}
                  width={32}
                  unit="%"
                />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($k)" fill="var(--chart-ocean)" radius={[2, 2, 0, 0]} maxBarSize={14} />
                <Bar yAxisId="left" dataKey="expenses" name="OpEx ($k)" fill="color-mix(in srgb, var(--chart-coral) 42%, #ffffff)" radius={[2, 2, 0, 0]} maxBarSize={14} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="operatingMarginPct"
                  name="Operating margin %"
                  stroke="var(--chart-emerald)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: 'var(--chart-emerald)' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        ),
      );
    }
    default:
      return (
        <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 mt-4 bg-gray-50/50 rounded-[8px] border border-gray-100 border-dashed min-h-[120px]">
          <LayoutDashboard className="w-[17.5px] h-[17.5px] mb-2 opacity-50" strokeWidth={1.5} />
          <span className="text-[11px]">Widget visualization placeholder</span>
        </div>
      );
  }
}

export function FinanceWidgetContent(props: FinanceWidgetContentProps) {
  return (
    <>
      <FinanceWidgetBody {...props} />
      <ModellingPeerComparisonStrip widgetId={props.id} surface={props.surface} />
    </>
  );
}

/** Default canvas when creating a new Finances page */
export const DEFAULT_NEW_PAGE_WIDGETS: FinancePageWidget[] = [
  { instanceId: 'w_runway', widgetId: 'runway', layoutSize: 'compact' },
  { instanceId: 'w_ar', widgetId: 'ar_aging', layoutSize: 'compact' },
];

/** Default layout for the built-in 2026 Strategic Roadmap Finances page */
export const DEFAULT_FP_DEFAULT_WIDGETS: FinancePageWidget[] = [
  { instanceId: 'w_cash', widgetId: 'strat_cash', layoutSize: 'expanded' },
  { instanceId: 'w_burn', widgetId: 'strat_burn', layoutSize: 'expanded' },
  { instanceId: 'w_runway_s', widgetId: 'strat_runway', layoutSize: 'expanded' },
  { instanceId: 'w_pl_margin', widgetId: 'profitability_margin', layoutSize: 'expanded' },
];

/** Default right-rail widgets for the built-in strategic roadmap page */
export const DEFAULT_FP_DEFAULT_SIDEBAR_WIDGETS: FinancePageWidget[] = [
  { instanceId: 'sb_modelling', widgetId: 'suggested_modelling', layoutSize: 'compact' },
];

/** Default Financial Health Overview page (first under Finances). */
export const DEFAULT_FP_FINANCIAL_HEALTH_WIDGETS: FinancePageWidget[] = [
  { instanceId: 'fho_w_goals', widgetId: 'fho_firm_goals_detail', layoutSize: 'expanded' },
  { instanceId: 'fho_w_k1', widgetId: 'fho_operating_cash_detail', layoutSize: 'compact' },
  { instanceId: 'fho_w_k2', widgetId: 'fho_revenue_detail', layoutSize: 'compact' },
  { instanceId: 'fho_w_k3', widgetId: 'fho_ar_at_risk_detail', layoutSize: 'compact' },
  { instanceId: 'fho_w_k4', widgetId: 'fho_runway_detail', layoutSize: 'compact' },
  { instanceId: 'fho_w_trust', widgetId: 'fho_iolta_trust_detail', layoutSize: 'compact' },
  { instanceId: 'fho_w_unbilled', widgetId: 'fho_unbilled_detail', layoutSize: 'compact' },
];

/** Pinned widgets for Dashboard Financial Health section (summary surface). */
export type DashboardFinancialPin = FinancePageWidget & {
  sourcePageId: string;
};

export const DEFAULT_DASHBOARD_FINANCIAL_PINS: DashboardFinancialPin[] = [
  { instanceId: 'dash_fho_firm_goals_detail', widgetId: 'fho_firm_goals_detail', layoutSize: 'compact', sourcePageId: FP_FINANCIAL_HEALTH_ID },
  { instanceId: 'dash_fho_operating_cash_detail', widgetId: 'fho_operating_cash_detail', layoutSize: 'compact', sourcePageId: FP_FINANCIAL_HEALTH_ID },
  { instanceId: 'dash_fho_revenue_detail', widgetId: 'fho_revenue_detail', layoutSize: 'compact', sourcePageId: FP_FINANCIAL_HEALTH_ID },
  { instanceId: 'dash_fho_ar_at_risk_detail', widgetId: 'fho_ar_at_risk_detail', layoutSize: 'compact', sourcePageId: FP_FINANCIAL_HEALTH_ID },
  { instanceId: 'dash_fho_runway_detail', widgetId: 'fho_runway_detail', layoutSize: 'compact', sourcePageId: FP_FINANCIAL_HEALTH_ID },
  { instanceId: 'dash_fho_iolta_trust_detail', widgetId: 'fho_iolta_trust_detail', layoutSize: 'compact', sourcePageId: FP_FINANCIAL_HEALTH_ID },
  { instanceId: 'dash_fho_unbilled_detail', widgetId: 'fho_unbilled_detail', layoutSize: 'compact', sourcePageId: FP_FINANCIAL_HEALTH_ID },
];

/** Financial Health Overview ships without a right rail (no Modelling widget by default). */
export const DEFAULT_FP_FINANCIAL_HEALTH_SIDEBAR_WIDGETS: FinancePageWidget[] = [];

/** Default sidebar when creating a new Finances page */
export const DEFAULT_NEW_PAGE_SIDEBAR_WIDGETS: FinancePageWidget[] = [
  { instanceId: 'sb_modelling', widgetId: 'suggested_modelling', layoutSize: 'compact' },
];

type FinancePageWidgetGridProps = {
  widgets: FinancePageWidget[];
  onTakeAction?: (insightId: string) => void;
  onExploreData?: (insightId: string) => void;
  emptyHint?: React.ReactNode;
  thisWeeksBriefingCompact?: boolean;
  executedBriefingInsightIds?: readonly BriefingInsightId[];
  /** Resolve report titles/icons for embedded_report widgets (e.g. from App `availableReports`) */
  reportLibrary?: readonly ReportLibraryEntry[];
  /** Persist inline edits (e.g. report view mode) into saved page widgets */
  onUpdateWidget?: (instanceId: string, patch: Partial<FinancePageWidget>) => void;
  onDigitalTwinScenario?: (id: DigitalTwinScenarioId) => void;
  mainGridColumns?: MainGridColumns;
  modellingUi?: ModellingWidgetUiBridge | null;
  /** Pin / unpin widgets to Dashboard Financial Health (live Finances pages only) */
  pinUi?: FinancePagePinUi | null;
  /** Footer CTA: navigate / dialog / teammate / briefing (prototype drill-down) */
  onFinanceWidgetExplore?: (payload: FinanceWidgetExplorePayload) => void;
  /** Financial Health Overview page: compact matches Dashboard Financial Health strip */
  financialHealthViewMode?: FinancialHealthViewMode;
  /** Passed as `sourcePageId` for compact FHO widgets (e.g. embedded_report parity with pins) */
  financialHealthSourcePageId?: string;
};

export function FinancePageWidgetGrid({
  widgets,
  onTakeAction,
  onExploreData,
  emptyHint,
  thisWeeksBriefingCompact = false,
  executedBriefingInsightIds,
  reportLibrary,
  onUpdateWidget,
  onDigitalTwinScenario,
  mainGridColumns = 2,
  modellingUi,
  pinUi,
  onFinanceWidgetExplore,
  financialHealthViewMode,
  financialHealthSourcePageId,
}: FinancePageWidgetGridProps) {
  const hydrated = hydratePlacedWidgets(widgets, reportLibrary);
  const gridCols = mainGridColumns;
  const isCompactFho = financialHealthViewMode === 'compact';

  if (hydrated.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-gray-200 bg-gray-50/50 p-10 text-center text-sm text-gray-500">
        {emptyHint ?? 'No widgets on this page yet. Use Customize page to add widgets from the library.'}
      </div>
    );
  }

  const outerGridClass = isCompactFho ? financialHealthCompactMainGridClass() : mainGridClass(gridCols);

  return (
    <div className={outerGridClass}>
      {hydrated.map((widget) => {
        const pinKey = getFinanceWidgetPinKey({ widgetId: widget.id, reportName: widget.reportName });
        const showPinChrome = Boolean(pinUi && !isWidgetPinDisabled(widget.id));
        const isPinned = pinUi ? pinUi.pinnedPinKeys.has(pinKey) : false;
        const layoutClass = isCompactFho
          ? isFinancialHealthOverviewWidgetId(widget.id)
            ? dashboardPinGridClass(widget.id)
            : 'lg:col-span-4'
          : layoutSizeToGridClass(widget.layoutSize, gridCols);
        const fhoSurface: FinanceWidgetSurface | undefined =
          isCompactFho && isFinancialHealthOverviewWidgetId(widget.id) ? 'dashboardSummary' : undefined;
        const isFho = isFinancialHealthOverviewWidgetId(widget.id);
        return (
        <div
          key={widget.instanceId}
          id={widget.instanceId}
          className={`bg-card rounded-[8px] shadow-sm border border-border flex flex-col hover:border-primary/25 transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] motion-reduce:transition-none relative overflow-hidden ${
            isFho ? 'p-4' : 'p-6'
          } ${isFho ? FHO_WIDGET_CARD_MIN_CLASS : ''} ${layoutClass}`}
        >
          {showPinChrome ? (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5">
              <button
                type="button"
                title={isPinned ? 'Unpin from Dashboard' : 'Pin to Dashboard'}
                aria-label={isPinned ? 'Unpin from Dashboard' : 'Pin to Dashboard'}
                onClick={() => {
                  if (isPinned) {
                    pinUi.onUnpinPinKey(pinKey);
                  } else {
                    pinUi.onPin({
                      instanceId: widget.instanceId,
                      widgetId: widget.id,
                      layoutSize: widget.layoutSize,
                      reportView: normalizeReportView(widget.reportView),
                      ...(widget.id === EMBEDDED_REPORT_WIDGET_ID && widget.reportName
                        ? { reportName: widget.reportName }
                        : {}),
                    });
                  }
                }}
                className={`rounded-md p-1.5 border border-transparent transition-colors ${
                  isPinned
                    ? 'text-primary bg-primary/10 border-primary/20 hover:bg-primary/15'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {isPinned ? (
                  <PinOff className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <Pin className="h-3.5 w-3.5" strokeWidth={2} />
                )}
              </button>
            </div>
          ) : null}
          {widget.id !== 'ambient_cfo' &&
            !isFho &&
            widget.id !== 'suggested_modelling' &&
            widget.id !== 'digital_twin' && (
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900">{widget.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{widget.desc}</p>
            </div>
          )}
          {widget.id === 'suggested_modelling' && (
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                Modelling
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{widget.desc}</p>
            </div>
          )}
          {onUpdateWidget &&
          !isFho &&
          !isWidgetDisplayModeToolbarHidden(widget.id) ? (
            <ReportViewToolbar
              className="mb-3"
              value={widget.reportView ?? 'chart_compact'}
              onChange={(v) => onUpdateWidget(widget.instanceId, { reportView: v })}
            />
          ) : null}
          <div
            className={`${isFho ? FHO_WIDGET_BODY_SCROLL_CLASS : 'flex-1'} text-gray-600 text-sm min-w-0 ${showPinChrome ? 'pr-7' : ''}`}
          >
            <FinanceWidgetContent
              id={widget.id}
              instanceId={widget.instanceId}
              onTakeAction={onTakeAction}
              onExploreData={onExploreData}
              thisWeeksBriefingCompact={thisWeeksBriefingCompact}
              executedBriefingInsightIds={executedBriefingInsightIds}
              reportName={widget.reportName}
              reportView={widget.reportView}
              onDigitalTwinScenario={onDigitalTwinScenario}
              modellingUi={widget.id === 'suggested_modelling' ? modellingUi : undefined}
              surface={fhoSurface}
              sourcePageId={isCompactFho && fhoSurface ? financialHealthSourcePageId : undefined}
              reportLibrary={reportLibrary}
              onFinanceWidgetExplore={onFinanceWidgetExplore}
              exploreFallbackTitle={widget.title}
            />
          </div>
          {onFinanceWidgetExplore ? (() => {
            const exploreAction = getFinanceWidgetExploreAction(widget.id, {
              reportName: widget.reportName,
            });
            if (exploreAction.type === 'noop') return null;
            return (
              <div className="mt-4 border-t border-border pt-3 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onFinanceWidgetExplore({
                      widgetId: widget.id,
                      reportName: widget.reportName,
                      fallbackTitle: widget.title,
                    })
                  }
                  className="flex w-full min-h-11 items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-primary/5 transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] motion-reduce:transition-none"
                >
                  <span>{exploreAction.label}</span>
                  <ChevronRight className="size-4 shrink-0 opacity-70" aria-hidden />
                </button>
              </div>
            );
          })() : null}
        </div>
        );
      })}
    </div>
  );
}

type FinancePageSidebarWidgetStackProps = {
  widgets: FinancePageWidget[];
  onTakeAction?: (insightId: string) => void;
  onExploreData?: (insightId: string) => void;
  emptyHint?: React.ReactNode;
  thisWeeksBriefingCompact?: boolean;
  executedBriefingInsightIds?: readonly BriefingInsightId[];
  reportLibrary?: readonly ReportLibraryEntry[];
  onUpdateWidget?: (instanceId: string, patch: Partial<FinancePageWidget>) => void;
  onDigitalTwinScenario?: (id: DigitalTwinScenarioId) => void;
  modellingUi?: ModellingWidgetUiBridge | null;
  pinUi?: FinancePagePinUi | null;
  onFinanceWidgetExplore?: (payload: FinanceWidgetExplorePayload) => void;
  financialHealthViewMode?: FinancialHealthViewMode;
  financialHealthSourcePageId?: string;
};

/** Single-column stack for Finances page right rail */
export function FinancePageSidebarWidgetStack({
  widgets,
  onTakeAction,
  onExploreData,
  emptyHint,
  thisWeeksBriefingCompact = false,
  executedBriefingInsightIds,
  reportLibrary,
  onUpdateWidget,
  onDigitalTwinScenario,
  modellingUi,
  pinUi,
  onFinanceWidgetExplore,
  financialHealthViewMode,
  financialHealthSourcePageId,
}: FinancePageSidebarWidgetStackProps) {
  const hydrated = hydratePlacedWidgets(widgets, reportLibrary).map((w) => ({
    ...w,
    layoutSize: 'compact' as const,
  }));
  const isCompactFho = financialHealthViewMode === 'compact';

  if (hydrated.length === 0) {
    return (
      <div className="rounded-[8px] border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center text-sm text-gray-500">
        {emptyHint ?? 'No sidebar widgets. Use Customize page to add widgets to this column.'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      {hydrated.map((widget) => {
        const pinKey = getFinanceWidgetPinKey({ widgetId: widget.id, reportName: widget.reportName });
        const showPinChrome = Boolean(pinUi && !isWidgetPinDisabled(widget.id));
        const isPinned = pinUi ? pinUi.pinnedPinKeys.has(pinKey) : false;
        const fhoSurface: FinanceWidgetSurface | undefined =
          isCompactFho && isFinancialHealthOverviewWidgetId(widget.id) ? 'dashboardSummary' : undefined;
        const isFho = isFinancialHealthOverviewWidgetId(widget.id);
        return (
        <div
          key={widget.instanceId}
          className={`bg-card rounded-[8px] shadow-sm border border-border p-5 flex flex-col hover:border-primary/25 transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] motion-reduce:transition-none relative overflow-hidden ${isFho ? FHO_WIDGET_CARD_MIN_CLASS : ''}`}
        >
          {showPinChrome ? (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5">
              <button
                type="button"
                title={isPinned ? 'Unpin from Dashboard' : 'Pin to Dashboard'}
                aria-label={isPinned ? 'Unpin from Dashboard' : 'Pin to Dashboard'}
                onClick={() => {
                  if (isPinned) {
                    pinUi.onUnpinPinKey(pinKey);
                  } else {
                    pinUi.onPin({
                      instanceId: widget.instanceId,
                      widgetId: widget.id,
                      layoutSize: widget.layoutSize,
                      reportView: normalizeReportView(widget.reportView),
                      ...(widget.id === EMBEDDED_REPORT_WIDGET_ID && widget.reportName
                        ? { reportName: widget.reportName }
                        : {}),
                    });
                  }
                }}
                className={`rounded-md p-1.5 border border-transparent transition-colors ${
                  isPinned
                    ? 'text-primary bg-primary/10 border-primary/20 hover:bg-primary/15'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {isPinned ? (
                  <PinOff className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <Pin className="h-3.5 w-3.5" strokeWidth={2} />
                )}
              </button>
            </div>
          ) : null}
          {widget.id !== 'ambient_cfo' &&
            !isFho &&
            widget.id !== 'suggested_modelling' &&
            widget.id !== 'digital_twin' && (
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900">{widget.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{widget.desc}</p>
            </div>
          )}
          {widget.id === 'suggested_modelling' && (
            <div className="mb-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                Modelling
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{widget.desc}</p>
            </div>
          )}
          {onUpdateWidget &&
          !isFho &&
          !isWidgetDisplayModeToolbarHidden(widget.id) ? (
            <ReportViewToolbar
              className="mb-3"
              value={widget.reportView ?? 'chart_compact'}
              onChange={(v) => onUpdateWidget(widget.instanceId, { reportView: v })}
            />
          ) : null}
          <div
            className={`${isFho ? FHO_WIDGET_BODY_SCROLL_CLASS : 'flex-1'} text-gray-600 text-sm min-w-0 ${showPinChrome ? 'pr-7' : ''}`}
          >
            <FinanceWidgetContent
              id={widget.id}
              instanceId={widget.instanceId}
              onTakeAction={onTakeAction}
              onExploreData={onExploreData}
              thisWeeksBriefingCompact={thisWeeksBriefingCompact}
              executedBriefingInsightIds={executedBriefingInsightIds}
              reportName={widget.reportName}
              reportView={widget.reportView}
              onDigitalTwinScenario={onDigitalTwinScenario}
              modellingUi={widget.id === 'suggested_modelling' ? modellingUi : undefined}
              surface={fhoSurface}
              sourcePageId={isCompactFho && fhoSurface ? financialHealthSourcePageId : undefined}
              reportLibrary={reportLibrary}
              onFinanceWidgetExplore={onFinanceWidgetExplore}
              exploreFallbackTitle={widget.title}
            />
          </div>
          {onFinanceWidgetExplore ? (() => {
            const exploreAction = getFinanceWidgetExploreAction(widget.id, {
              reportName: widget.reportName,
            });
            if (exploreAction.type === 'noop') return null;
            return (
              <div className="mt-4 border-t border-border pt-3 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onFinanceWidgetExplore({
                      widgetId: widget.id,
                      reportName: widget.reportName,
                      fallbackTitle: widget.title,
                    })
                  }
                  className="flex w-full min-h-11 items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-primary/5 transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] motion-reduce:transition-none"
                >
                  <span>{exploreAction.label}</span>
                  <ChevronRight className="size-4 shrink-0 opacity-70" aria-hidden />
                </button>
              </div>
            );
          })() : null}
        </div>
        );
      })}
    </div>
  );
}
