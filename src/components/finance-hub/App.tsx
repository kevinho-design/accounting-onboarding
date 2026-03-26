import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  LayoutDashboard, 
  CreditCard, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Users, 
  DollarSign, 
  List, 
  Plug, 
  Settings,
  Sparkles,
  AlertCircle,
  X,
  ChevronDown,
  TrendingUp,
  History,
  Info,
  Edit2,
  Wallet,
  Briefcase,
  Activity,
  BarChart3,
  PieChart,
  Target,
  Plus,
  ChevronRight,
  FileText,
  Search,
  ArrowRightLeft,
  Clock,
  BookOpen,
  Scale,
  Calendar,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  TrendingDown,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Trash2,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { cn } from './components/ui/utils';
import { DashboardCustomizer } from './components/DashboardCustomizer';
import { BriefingSidePanel, type BriefingPanelState } from './components/BriefingSidePanel';
import { FloatingChatBar } from './components/clio-teammate/FloatingChatBar';
import { SpecializedTeammateRail } from './components/clio-teammate/SpecializedTeammateRail';
import { isBriefingInsightId, type BriefingInsightId } from './data/briefingPanelContent';
import { buildModellingExplorePanelContent } from './data/modellingExplorePanel';
import { BRIEFING_DEFAULT_INSIGHT_ID } from './data/briefingInsights';
import { FIRM_GOAL_DEFINITIONS, FIRM_INTELLIGENCE_GOALS_FILTER_NARRATIVE } from './data/firmGoals';
import { ReportDetail } from './components/ReportDetail';
import {
  DEFAULT_PROFIT_LOSS_VIEW_STATE,
  type ProfitLossViewState,
} from './data/profitLossReportModel';
import {
  DEFAULT_STANDARD_REPORT_VIEW_STATE,
  type StandardReportViewState,
} from './data/standardReportModel';
import { interpretProfitLossQuery } from './data/profitLossNlStub';
import { HomeDashboard } from './components/HomeDashboard';
import {
  FinancePageWidgetGrid,
  FinancePageSidebarWidgetStack,
  DEFAULT_FP_DEFAULT_WIDGETS,
  DEFAULT_FP_DEFAULT_SIDEBAR_WIDGETS,
  DEFAULT_FP_FINANCIAL_HEALTH_WIDGETS,
  DEFAULT_FP_FINANCIAL_HEALTH_SIDEBAR_WIDGETS,
  DEFAULT_DASHBOARD_FINANCIAL_PINS,
  FP_FINANCIAL_HEALTH_ID,
  DEFAULT_NEW_PAGE_WIDGETS,
  DEFAULT_NEW_PAGE_SIDEBAR_WIDGETS,
  defaultLayoutSizeForWidgetId,
  getFinanceWidgetPinKey,
  isWidgetPinDisabled,
  type DashboardFinancialPin,
  type FinancePageWidget,
  type MainGridColumns,
  type ModellingWidgetUiBridge,
} from './components/financeWidgetCatalog';
import { strategicData } from './data/strategicDashboardSeed';
import { buildBriefingFinancialSnapshot } from './data/briefingFinancialImpact';
import {
  mergeStrategicRowsWithModelling,
  type PeerBenchmarkPageContext,
} from './data/peerBenchmarkSeries';
import { StrategicDashboardChartsProvider } from './context/StrategicDashboardChartsContext';
import { FhoPersonalizationBanner } from './components/FinancialHealthOverviewWidgets';
import {
  FIRM_NAME,
  FIRM_ATTORNEY_COUNT,
  USER_FULL_NAME,
  USER_INITIALS,
  USER_EMAIL,
  USER_ROLE,
  FIRM_STORY,
  FINANCE_DEFAULT_PAGE_TITLE,
  USER_FIRST_NAME,
} from './data/prototypePersona';
import type { DigitalTwinScenarioId } from './components/DigitalTwinWidget';

/** Custom dashboard pages under Finances (id, title, main + sidebar widget layout). */
const NAV_RAIL_WIDTH_STORAGE_KEY = 'ambient-cfo-nav-rail-width-px';
const NAV_RAIL_WIDTH_MIN = 176;
const NAV_RAIL_WIDTH_MAX = 400;
const NAV_RAIL_WIDTH_DEFAULT = 239;
const NAV_RAIL_COLLAPSED_PX = 72;
/** When dragging narrower while expanded, snap to collapsed below this width (px from left edge). */
const NAV_RAIL_SNAP_COLLAPSE_IF_BELOW = 110;
/** When dragging wider while collapsed, snap to expanded above this (hysteresis vs collapse). */
const NAV_RAIL_SNAP_EXPAND_IF_ABOVE = 132;

function clampNavRailWidth(px: number): number {
  return Math.min(NAV_RAIL_WIDTH_MAX, Math.max(NAV_RAIL_WIDTH_MIN, Math.round(px)));
}

function readStoredNavRailWidth(): number {
  if (typeof window === 'undefined') return NAV_RAIL_WIDTH_DEFAULT;
  try {
    const raw = localStorage.getItem(NAV_RAIL_WIDTH_STORAGE_KEY);
    if (raw == null) return NAV_RAIL_WIDTH_DEFAULT;
    return clampNavRailWidth(parseInt(raw, 10) || NAV_RAIL_WIDTH_DEFAULT);
  } catch {
    return NAV_RAIL_WIDTH_DEFAULT;
  }
}

type FinanceCustomPage = {
  id: string;
  title: string;
  widgets: FinancePageWidget[];
  sidebarWidgets: FinancePageWidget[];
  mainGridColumns: MainGridColumns;
  /** When false, main grid is full width and the right rail is hidden. */
  showSidebar: boolean;
};

type ScenarioModelAction =
  | { text: string; type: 'navigate'; target: string }
  | { text: string; type: 'action'; actionName: string };

type FinancialScenarioModel = {
  id: string;
  name: string;
  description: string;
  impact: { month: string; altCash: number; altBurn: number; altRunway: number }[];
  aiAnalysis: { trend: string; insight: string; confidence: string };
  goalImpactAnalysis: string;
  recommendedActions: ScenarioModelAction[];
  /** User-created via scenario planner */
  isUserCreated?: boolean;
};

/** Build chart overlay series from baseline strategic data + burn % scenario */
function buildScenarioImpactFromBurnDelta(burnDeltaPercent: number): FinancialScenarioModel['impact'] {
  return strategicData.map((row, index) => {
    const altBurn = Math.max(35000, Math.round(row.burn * (1 + burnDeltaPercent / 100)));
    const burnDiff = altBurn - row.burn;
    const altCash = Math.round(row.cash - burnDiff * (index + 1) * 500);
    const rawRunway = altCash / altBurn;
    const altRunway = Number(Math.min(30, Math.max(8, rawRunway)).toFixed(1));
    return {
      month: row.month,
      altCash: Math.max(400000, altCash),
      altBurn: altBurn,
      altRunway,
    };
  });
}

const defaultFinancialModels: FinancialScenarioModel[] = [
  {
    id: 'payroll_shortfall',
    name: 'Payroll Shortfall — Operating Account Gap',
    description: 'Payroll due in 3 days with a $15.7k operating cash gap to resolve',
    impact: [
      { month: "Mar '26", altCash: 1200000, altBurn: 45000, altRunway: 26.6 },
      { month: "Apr '26", altCash: 1155000, altBurn: 48000, altRunway: 24.0 },
      { month: "May '26", altCash: 1092000, altBurn: 57000, altRunway: 19.1 },
      { month: "Jun '26", altCash: 1027000, altBurn: 65000, altRunway: 15.8 },
      { month: "Jul '26", altCash: 957000, altBurn: 70000, altRunway: 13.6 },
      { month: "Aug '26", altCash: 897000, altBurn: 60000, altRunway: 14.9 },
      { month: "Sep '26", altCash: 842000, altBurn: 55000, altRunway: 15.3 },
      { month: "Oct '26", altCash: 782000, altBurn: 60000, altRunway: 13.0 },
      { month: "Nov '26", altCash: 719000, altBurn: 63000, altRunway: 11.4 },
      { month: "Dec '26", altCash: 662000, altBurn: 57000, altRunway: 11.6 }
    ],
    aiAnalysis: {
      trend: '↓ Immediate liquidity risk in Operating Account',
      insight:
        'Ambient CFO detected payroll processing on Friday with a projected operating cash deficit. Prioritized options below are ranked from lowest-friction internal levers to higher-cost financing.',
      confidence: 'High (94%) - Based on live operating balance and payroll schedule',
    },
    goalImpactAnalysis:
      'Closing this shortfall preserves payroll continuity and protects your 60-day operating reserve objective. Favor internal liquidity levers first to stay aligned with days-to-collect and net revenue goals before adding financing cost.',
    recommendedActions: [
      { text: 'Activate Internal Liquidity Levers first: accelerated billing, A/R nudges, and expense deferral.', type: 'navigate', target: 'Funds In' },
      { text: 'If same-day coverage is still needed, draw only the exact gap from Clio Capital LOC.', type: 'action', actionName: 'Draw exact shortfall from LOC' },
    ],
  },
  {
    id: 'reduce_overhead',
    name: 'Reduce overhead by 5%',
    description: 'Decreases burn rate starting April \'26',
    impact: [
      { month: "Mar '26", altCash: 1200000, altBurn: 45000, altRunway: 26.6 },
      { month: "Apr '26", altCash: 1157400, altBurn: 45600, altRunway: 25.3 },
      { month: "May '26", altCash: 1117500, altBurn: 39900, altRunway: 28.0 },
      { month: "Jun '26", altCash: 1070000, altBurn: 47500, altRunway: 22.5 },
      { month: "Jul '26", altCash: 1017750, altBurn: 52250, altRunway: 19.4 },
      { month: "Aug '26", altCash: 975000, altBurn: 42750, altRunway: 22.8 },
      { month: "Sep '26", altCash: 937000, altBurn: 38000, altRunway: 24.6 },
      { month: "Oct '26", altCash: 894250, altBurn: 42750, altRunway: 20.9 },
      { month: "Nov '26", altCash: 848650, altBurn: 45600, altRunway: 18.6 },
      { month: "Dec '26", altCash: 808750, altBurn: 39900, altRunway: 20.2 }
    ],
    aiAnalysis: {
      trend: "↑ Increasing (was 24.0 months last week)",
      insight: "Trimming software subscriptions and discretionary travel by 5% extends your baseline runway by nearly 2 months by year-end, comfortably keeping you above target.",
      confidence: "Medium (75%) - Subject to variable travel costs"
    },
    goalImpactAnalysis:
      'Lowering overhead extends your operating cash runway and supports the 60-day minimum reserve goal, while preserving capacity to invest in revenue growth toward the +15% YoY target.',
    recommendedActions: [
      { text: "Audit current SaaS subscriptions for redundant tools by end of March.", type: 'action', actionName: 'Start SaaS audit' },
      { text: "Implement a revised firm-wide travel policy starting April 1st.", type: 'navigate', target: 'Payroll' }
    ]
  },
  {
    id: 'salary_increase_7pct',
    name: 'Increase employee salary by 7%',
    description: 'Raises payroll-driven burn ~7% across the forecast horizon',
    impact: buildScenarioImpactFromBurnDelta(7),
    aiAnalysis: {
      trend: '↓ Pressure on runway vs baseline',
      insight:
        'A firm-wide 7% salary increase lifts monthly burn in line with payroll share of OpEx. Cash declines faster through year-end unless offset by rate, utilization, or collections.',
      confidence: 'Medium (80%) — assumes proportional payroll load; excludes one-time bonuses',
    },
    goalImpactAnalysis:
      'Higher compensation improves retention but lifts burn—tightening progress toward the 60-day operating reserve unless collections improve toward the 28-day days-to-collect goal. Net revenue growth assumptions should be re-checked.',
    recommendedActions: [
      { text: 'Model phased increases by level or office before committing firm-wide.', type: 'action', actionName: 'Open phased comp planner' },
      { text: 'Review Payroll and benefits load vs billable headcount in Funds Out.', type: 'navigate', target: 'Funds Out' },
    ],
  },
];

/** Prototype: projected horizon runway vs firm runway target (matches default model copy). */
const LINKED_MODEL_RUNWAY_TARGET_MONTHS = 18;

function linkedModelGoalProgress(m: FinancialScenarioModel): {
  percent: number;
  currentText: string;
  targetText: string;
} {
  const rows = m.impact;
  const last = rows[rows.length - 1];
  const target = LINKED_MODEL_RUNWAY_TARGET_MONTHS;
  if (!last) {
    return { percent: 0, currentText: '—', targetText: `${target} mo` };
  }
  const current = last.altRunway;
  const pct = Math.min(100, Math.max(0, Math.round((current / target) * 100)));
  return {
    percent: pct,
    currentText: `${current} mo`,
    targetText: `${target} mo`,
  };
}

type ModelFramework = 'Default' | 'Aggressive' | 'Conservative';

/** Prototype: interpret free-text scenario + framework into burn path and CFO-facing copy */
function ambientCfoInterpretScenario(scenarioSummary: string, framework: ModelFramework) {
  const frameworkBase: Record<ModelFramework, number> = {
    Default: -3,
    Aggressive: 10,
    Conservative: -8,
  };
  const t = scenarioSummary.toLowerCase();
  let adjustment = 0;
  const themes: string[] = [];

  const cues: { re: RegExp; delta: number; label: string }[] = [
    {
      re: /\b(hire|hiring|hires|add associate|add staff|headcount|new payroll|salary increase|onboard)\b/,
      delta: 5,
      label: 'workforce expansion',
    },
    {
      re: /\b(freeze hiring|pause hire|delay hire|defer hire|push hire|postpone start)\b|\b(delay|defer|postpone)\b.{0,40}\b(hire|start|onboard)\b/,
      delta: -4,
      label: 'delayed or frozen hiring',
    },
    {
      re: /\b(cut|reduce|trim|lower|decrease|save|efficien|overhead|discretionary|opex|op ex)\b/,
      delta: -4,
      label: 'cost reduction',
    },
    {
      re: /\b(marketing|growth invest|expansion|new office|lateral hire)\b/,
      delta: 3,
      label: 'growth spend',
    },
    {
      re: /\b(collection|a\/?r|receivable|billing|invoice|cash in|payment|matter)\b/,
      delta: -2,
      label: 'collections / revenue timing',
    },
    {
      re: /\b(partner|merger|acquisition|m&a)\b/,
      delta: 4,
      label: 'structural / senior growth',
    },
  ];

  for (const { re, delta, label } of cues) {
    if (re.test(t)) {
      adjustment += delta;
      if (!themes.includes(label)) themes.push(label);
    }
  }

  let burnDeltaPercent = frameworkBase[framework] + adjustment;
  burnDeltaPercent = Math.round(Math.min(25, Math.max(-25, burnDeltaPercent)));

  const themePhrase =
    themes.length > 0
      ? themes.slice(0, 3).join(', ')
      : 'general narrative (framework-led)';

  const shortScenario =
    scenarioSummary.length > 140 ? `${scenarioSummary.slice(0, 140)}…` : scenarioSummary;

  const cardDescription = `Firm Intelligence · ${themePhrase}`;

  const insight = `Firm Intelligence read your scenario and combined it with the ${framework} framework. Detected themes: ${themePhrase}. That maps to a modeled burn path of ${burnDeltaPercent > 0 ? '+' : ''}${burnDeltaPercent}% vs baseline on the strategic charts. Your description: "${shortScenario}"`;

  const goalImpact = `This model translates your wording into cash, burn, and runway stress. ${burnDeltaPercent > 0 ? 'Net spend pressure tightens runway—pair hiring or growth moves with collections and timing.' : 'Net spend relief extends runway—sanity-check which cost levers in your text are committed vs aspirational.'}`;

  const extraAction = themes[0]
    ? `Double-check assumptions around "${themes[0]}" with finance before you rely on this overlay.`
    : 'Add more specifics (hiring, cuts, timing) so Firm Intelligence can tighten the scenario next time.';

  return {
    burnDeltaPercent,
    cardDescription,
    insight,
    goalImpact,
    extraAction,
  };
}

function createUserFinancialModel(input: {
  name: string;
  scenarioSummary: string;
  burnDeltaPercent: number;
  ambient?: {
    cardDescription: string;
    insight: string;
    goalImpact: string;
    extraAction: string;
  };
}): FinancialScenarioModel {
  const { name, scenarioSummary, burnDeltaPercent, ambient } = input;
  const id = `scenario_${crypto.randomUUID()}`;
  const impact = buildScenarioImpactFromBurnDelta(burnDeltaPercent);
  const worsening = burnDeltaPercent > 0;
  const desc =
    ambient?.cardDescription ?? (scenarioSummary.trim() || 'Custom scenario model');
  const insightBody =
    ambient?.insight ??
    `Your scenario: ${scenarioSummary.trim() || 'Custom assumptions'}. Modelling applies ${burnDeltaPercent > 0 ? '+' : ''}${burnDeltaPercent}% burn vs baseline across the forecast horizon, updating projected cash and runway each month.`;
  const goalBody =
    ambient?.goalImpact ??
    `This custom model stress-tests "${name.trim() || 'your scenario'}" against your current strategic baseline. ${worsening ? 'Higher burn pulls forward cash needs and compresses runway; align hiring and collections timing if you pursue this path.' : 'Lower burn extends runway and can accelerate reserve or growth goals—confirm which levers (headcount, discretionary spend, billing) actually move.'}`;

  const recommendedActions: FinancialScenarioModel['recommendedActions'] = [
    ...(ambient
      ? [
          {
            text: ambient.extraAction,
            type: 'action' as const,
            actionName: 'Follow-up noted',
          },
        ]
      : []),
    {
      text: 'Save written assumptions and share with leadership for sign-off.',
      type: 'action',
      actionName: 'Scenario notes saved',
    },
    {
      text: 'Compare cash timing against live transactions for the next close.',
      type: 'navigate',
      target: 'Transactions',
    },
  ];

  return {
    id,
    name: name.trim() || 'Untitled scenario',
    description: desc,
    impact,
    isUserCreated: true,
    aiAnalysis: {
      trend: worsening
        ? '↓ Runway pressure vs baseline'
        : '↑ Runway cushion vs baseline',
      insight: insightBody,
      confidence: 'Interpreted from your scenario — validate with finance before decisions',
    },
    goalImpactAnalysis: goalBody,
    recommendedActions,
  };
}

type DashboardPresence = 'collaborating' | 'viewing' | 'idle';

type FinancePageAvatarPerson = {
  id: string;
  name: string;
  initials: string;
  avatarClass: string;
  presence: DashboardPresence;
};

/** Known firm members for Finances header avatars (key = lowercase email) */
const FIRM_DISPLAY_BY_EMAIL: Record<string, { name: string; initials: string; avatarClass: string }> = {
  [USER_EMAIL.toLowerCase()]: {
    name: USER_FULL_NAME,
    initials: USER_INITIALS,
    avatarClass: 'bg-emerald-600 text-white',
  },
  'm.torres@summitlegal.com': {
    name: 'Michael Torres',
    initials: 'MT',
    avatarClass: 'bg-sky-600 text-white',
  },
  'finance@summitlegal.com': {
    name: 'Finance Team',
    initials: 'FT',
    avatarClass: 'bg-amber-600 text-white',
  },
  'controller@summitlegal.com': {
    name: 'Alex Chen',
    initials: 'AC',
    avatarClass: 'bg-violet-600 text-white',
  },
};

/**
 * Prototype “who is on this page now” — only collaborating/viewing appear in the header.
 * Keys are lowercase email. Omitted / unknown invitees default to viewing so new shares show up.
 */
const MOCK_PRESENCE_BY_EMAIL: Record<string, DashboardPresence> = {
  [USER_EMAIL.toLowerCase()]: 'collaborating',
  'm.torres@summitlegal.com': 'viewing',
  'finance@summitlegal.com': 'idle',
  'controller@summitlegal.com': 'viewing',
};

function initialsFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '?';
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase() || '??';
  return local.slice(0, 2).toUpperCase() || '??';
}

function strategicDashboardPresenceLabel(p: DashboardPresence) {
  if (p === 'collaborating') return 'Collaborating on this dashboard';
  if (p === 'viewing') return 'Viewing this dashboard now';
  return 'Has access · not on this page now';
}

type NavSubItem = {
  name: string;
  label?: string;
  icon: LucideIcon;
  isAction?: boolean;
};

type NavItem = {
  name: string;
  icon: LucideIcon;
  subItems?: NavSubItem[];
};

export default function App({ initialPage, scrollToWidget, onAddPageRef }: { initialPage?: string; scrollToWidget?: string; onAddPageRef?: React.MutableRefObject<(() => void) | null> } = {}) {
  const [activePage, setActivePage] = useState(initialPage ?? FP_FINANCIAL_HEALTH_ID);
  useEffect(() => {
    if (initialPage) setActivePage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    if (!scrollToWidget) return;
    const id = setTimeout(() => {
      document.getElementById(scrollToWidget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(id);
  }, [scrollToWidget]);
  const [reportsViewMode, setReportsViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [profitLossViewState, setProfitLossViewState] = useState<ProfitLossViewState>(
    DEFAULT_PROFIT_LOSS_VIEW_STATE,
  );
  const [standardReportViewState, setStandardReportViewState] = useState<StandardReportViewState>(
    DEFAULT_STANDARD_REPORT_VIEW_STATE,
  );
  const [briefingPanel, setBriefingPanel] = useState<BriefingPanelState>(null);
  /** Cumulative briefing plans executed via Take Action → updates charts + widget data */
  const [executedBriefingPlans, setExecutedBriefingPlans] = useState<BriefingInsightId[]>([]);
  const [showMorePlans, setShowMorePlans] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [teammateRailOpen, setTeammateRailOpen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(false);
  const [isFinancesOpen, setIsFinancesOpen] = useState(true);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [peerBenchmarkEnabled, setPeerBenchmarkEnabled] = useState(false);
  /** Model ids promoted from Modelling → Financial Goals (order preserved) */
  const [financialGoalModelIds, setFinancialGoalModelIds] = useState<string[]>([]);
  const [userFinancialModels, setUserFinancialModels] = useState<FinancialScenarioModel[]>([]);
  const [createModelDialogOpen, setCreateModelDialogOpen] = useState(false);
  const [newModelName, setNewModelName] = useState('');
  const [newModelScenario, setNewModelScenario] = useState('');
  const [newModelFramework, setNewModelFramework] = useState<ModelFramework>('Default');
  const [isCreateModelProcessing, setIsCreateModelProcessing] = useState(false);
  const createModelAbortRef = React.useRef(false);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [financeCustomPages, setFinanceCustomPages] = useState<FinanceCustomPage[]>([
    {
      id: FP_FINANCIAL_HEALTH_ID,
      title: 'Financial Health Overview',
      widgets: DEFAULT_FP_FINANCIAL_HEALTH_WIDGETS,
      sidebarWidgets: DEFAULT_FP_FINANCIAL_HEALTH_SIDEBAR_WIDGETS,
      mainGridColumns: 2,
      showSidebar: false,
    },
    {
      id: 'fp_default',
      title: FINANCE_DEFAULT_PAGE_TITLE,
      widgets: DEFAULT_FP_DEFAULT_WIDGETS,
      sidebarWidgets: DEFAULT_FP_DEFAULT_SIDEBAR_WIDGETS,
      mainGridColumns: 2,
      showSidebar: true,
    },
  ]);
  const [dashboardFinancialPins, setDashboardFinancialPins] = useState<DashboardFinancialPin[]>(
    DEFAULT_DASHBOARD_FINANCIAL_PINS,
  );
  type CustomizerContext = { mode: 'create' } | { mode: 'edit'; pageId: string };
  const [customizerContext, setCustomizerContext] = useState<CustomizerContext | null>(null);
  const [customizerMountId, setCustomizerMountId] = useState(0);

  const beginCustomize = (ctx: CustomizerContext) => {
    setCustomizerMountId((n) => n + 1);
    setCustomizerContext(ctx);
  };
  const isCustomizing = customizerContext !== null;

  useEffect(() => {
    if (onAddPageRef) onAddPageRef.current = () => beginCustomize({ mode: 'create' });
    return () => { if (onAddPageRef) onAddPageRef.current = null; };
  }, [onAddPageRef]);

  const activeFinancePage = financeCustomPages.find((p) => p.id === activePage);
  const isFinanceCustomPageView = Boolean(activeFinancePage);

  const financePagePinnedKeys = React.useMemo(
    () => new Set(dashboardFinancialPins.map((p) => getFinanceWidgetPinKey(p))),
    [dashboardFinancialPins],
  );

  const handlePinToDashboardFinancial = React.useCallback(
    (row: FinancePageWidget) => {
      if (isWidgetPinDisabled(row.widgetId)) return;
      setDashboardFinancialPins((prev) => {
        const pk = getFinanceWidgetPinKey(row);
        const idx = prev.findIndex((p) => getFinanceWidgetPinKey(p) === pk);
        if (idx >= 0) {
          return prev.map((p, i) =>
            i === idx
              ? {
                  ...p,
                  sourcePageId: activePage,
                  layoutSize:
                    row.layoutSize ?? p.layoutSize ?? defaultLayoutSizeForWidgetId(row.widgetId),
                  reportName: row.reportName ?? p.reportName,
                  reportView: row.reportView ?? p.reportView,
                }
              : p,
          );
        }
        const instanceId = `dash_${pk.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
        const pin: DashboardFinancialPin = {
          instanceId,
          widgetId: row.widgetId,
          layoutSize: row.layoutSize ?? defaultLayoutSizeForWidgetId(row.widgetId),
          reportName: row.reportName,
          reportView: row.reportView,
          sourcePageId: activePage,
        };
        return [...prev, pin];
      });
    },
    [activePage],
  );

  const handleUnpinDashboardFinancial = React.useCallback((pinKey: string) => {
    setDashboardFinancialPins((prev) => prev.filter((p) => getFinanceWidgetPinKey(p) !== pinKey));
  }, []);

  const allFinancialModels = React.useMemo(
    () => [...defaultFinancialModels, ...userFinancialModels],
    [userFinancialModels],
  );

  const briefingFinancialSnapshot = React.useMemo(
    () => buildBriefingFinancialSnapshot(executedBriefingPlans),
    [executedBriefingPlans],
  );

  const peerBenchmarkPageContext = React.useMemo((): PeerBenchmarkPageContext | null => {
    if (!activeFinancePage) return null;
    return {
      snapshot: briefingFinancialSnapshot,
      mainWidgetIds: activeFinancePage.widgets.map((w) => w.widgetId),
      sidebarWidgetIds: activeFinancePage.showSidebar
        ? activeFinancePage.sidebarWidgets.map((w) => w.widgetId)
        : [],
    };
  }, [activeFinancePage, briefingFinancialSnapshot]);

  const displayStrategicData = React.useMemo(
    () =>
      mergeStrategicRowsWithModelling(briefingFinancialSnapshot.strategicRows, {
        peerBenchmarkEnabled,
        selectedModelId,
        getScenarioImpact: (id, index) => allFinancialModels.find((m) => m.id === id)?.impact[index],
        peerPageContext: peerBenchmarkPageContext,
      }),
    [
      briefingFinancialSnapshot.strategicRows,
      peerBenchmarkEnabled,
      selectedModelId,
      allFinancialModels,
      peerBenchmarkPageContext,
    ],
  );

  const financialGoalsLinkedModels = React.useMemo(
    () =>
      financialGoalModelIds
        .map((id) => allFinancialModels.find((m) => m.id === id))
        .filter((m): m is FinancialScenarioModel => Boolean(m)),
    [financialGoalModelIds, allFinancialModels],
  );

  const getCustomizerStrategicRows = React.useCallback(
    (
      previewModelId: string | null,
      customizerPeerEnabled: boolean,
      customizerPeerPageContext: PeerBenchmarkPageContext | null,
    ) =>
      mergeStrategicRowsWithModelling(briefingFinancialSnapshot.strategicRows, {
        peerBenchmarkEnabled: customizerPeerEnabled,
        selectedModelId: previewModelId,
        getScenarioImpact: (id, index) => allFinancialModels.find((m) => m.id === id)?.impact[index],
        peerPageContext: customizerPeerPageContext,
      }),
    [briefingFinancialSnapshot.strategicRows, allFinancialModels],
  );

  const addModelToFinancialGoals = React.useCallback(
    (modelId: string) => {
      if (financialGoalModelIds.includes(modelId)) {
        toast.message('This model is already in Financial Goals');
        return;
      }
      setFinancialGoalModelIds((prev) => [...prev, modelId]);
      toast.success('Model added to Financial Goals');
      setActivePage('Financial Goals');
    },
    [financialGoalModelIds, allFinancialModels],
  );

  const openModellingExplorePanel = React.useCallback((modelId: string) => {
    setShowMorePlans(false);
    setHasExecuted(false);
    setIsExecuting(false);
    setBriefingPanel({ mode: 'modellingExplore', modelId });
  }, []);

  const modellingExploreContent = React.useMemo(() => {
    if (briefingPanel?.mode !== 'modellingExplore') return null;
    const m = allFinancialModels.find((x) => x.id === briefingPanel.modelId);
    if (!m) return null;
    return buildModellingExplorePanelContent(m, allFinancialModels);
  }, [briefingPanel, allFinancialModels]);

  React.useEffect(() => {
    if (briefingPanel?.mode === 'modellingExplore' && !modellingExploreContent) {
      setBriefingPanel(null);
    }
  }, [briefingPanel, modellingExploreContent]);

  const modellingExploreModelAlreadyInGoals = Boolean(
    briefingPanel?.mode === 'modellingExplore' &&
      financialGoalModelIds.includes(briefingPanel.modelId),
  );

  const modellingUiBridge = React.useMemo(
    (): ModellingWidgetUiBridge => ({
      models: allFinancialModels.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        isUserCreated: m.isUserCreated,
      })),
      selectedModelId,
      onTogglePreview: (id) => setSelectedModelId((p) => (p === id ? null : id)),
      financialGoalModelIds,
      onExploreModel: openModellingExplorePanel,
      onOpenCreateModel: () => setCreateModelDialogOpen(true),
      peerBenchmarkEnabled,
      onPeerBenchmarkChange: setPeerBenchmarkEnabled,
    }),
    [allFinancialModels, selectedModelId, financialGoalModelIds, openModellingExplorePanel, peerBenchmarkEnabled],
  );

  const removeModelFromFinancialGoals = (modelId: string) => {
    setFinancialGoalModelIds((prev) => prev.filter((id) => id !== modelId));
    toast.success('Removed from Financial Goals');
  };

  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [navRailWidthPx, setNavRailWidthPx] = useState(readStoredNavRailWidth);
  const [isResizingNavRail, setIsResizingNavRail] = useState(false);
  const isNavCollapsedRef = useRef(false);
  isNavCollapsedRef.current = isNavCollapsed;
  const teammateRailWasOpenRef = useRef(false);
  const navCollapsedBeforeTeammateRailRef = useRef(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareEmailInput, setShareEmailInput] = useState('');
  const [newInvitePermission, setNewInvitePermission] = useState<'collaborator' | 'viewer'>('viewer');
  const [shareInvitees, setShareInvitees] = useState<{ id: string; email: string; permission: 'collaborator' | 'viewer' }[]>([]);
  const [sharedDashboardUsers, setSharedDashboardUsers] = useState<
    { id: string; email: string; permission: 'collaborator' | 'viewer' }[]
  >([
    { id: 'shared-1', email: 'm.torres@summitlegal.com', permission: 'collaborator' },
    { id: 'shared-2', email: 'finance@summitlegal.com', permission: 'viewer' },
    { id: 'shared-3', email: 'controller@summitlegal.com', permission: 'viewer' },
  ]);

  /** Finances page header: you + people shared on this dashboard, only if “active” (not idle). */
  const financePageHeaderAvatars = React.useMemo((): FinancePageAvatarPerson[] => {
    const ownerEmail = USER_EMAIL.toLowerCase();
    const candidateEmails: string[] = [ownerEmail];
    for (const u of sharedDashboardUsers) {
      candidateEmails.push(u.email.trim().toLowerCase());
    }
    const seen = new Set<string>();
    const rows: FinancePageAvatarPerson[] = [];
    for (const email of candidateEmails) {
      if (!email || seen.has(email)) continue;
      seen.add(email);
      const presence =
        MOCK_PRESENCE_BY_EMAIL[email] ?? (email === ownerEmail ? 'collaborating' : 'viewing');
      if (presence === 'idle') continue;
      const meta = FIRM_DISPLAY_BY_EMAIL[email] ?? {
        name: email,
        initials: initialsFromEmail(email),
        avatarClass: 'bg-slate-500 text-white',
      };
      rows.push({
        id: email,
        name: meta.name,
        initials: meta.initials,
        avatarClass: meta.avatarClass,
        presence,
      });
    }
    const orderPresence = (p: DashboardPresence) => (p === 'collaborating' ? 0 : 1);
    rows.sort((a, b) => {
      if (a.id === ownerEmail && b.id !== ownerEmail) return -1;
      if (b.id === ownerEmail && a.id !== ownerEmail) return 1;
      const d = orderPresence(a.presence) - orderPresence(b.presence);
      if (d !== 0) return d;
      return a.name.localeCompare(b.name);
    });
    return rows;
  }, [sharedDashboardUsers]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => {
      if (mq.matches) setMobileNavOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /** Docked teammate rail: collapse left nav for space; restore prior collapse state when closed. */
  useEffect(() => {
    if (teammateRailOpen) {
      if (!teammateRailWasOpenRef.current) {
        navCollapsedBeforeTeammateRailRef.current = isNavCollapsedRef.current;
        setIsNavCollapsed(true);
      }
      teammateRailWasOpenRef.current = true;
    } else {
      if (teammateRailWasOpenRef.current) {
        setIsNavCollapsed(navCollapsedBeforeTeammateRailRef.current);
      }
      teammateRailWasOpenRef.current = false;
    }
  }, [teammateRailOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(NAV_RAIL_WIDTH_STORAGE_KEY, String(navRailWidthPx));
    } catch {
      /* ignore quota */
    }
  }, [navRailWidthPx]);

  useEffect(() => {
    if (!isResizingNavRail) return;
    const onMove = (e: MouseEvent) => {
      const raw = e.clientX;
      if (isNavCollapsedRef.current) {
        if (raw > NAV_RAIL_SNAP_EXPAND_IF_ABOVE) {
          isNavCollapsedRef.current = false;
          setIsNavCollapsed(false);
          setNavRailWidthPx(clampNavRailWidth(raw));
        }
      } else if (raw < NAV_RAIL_SNAP_COLLAPSE_IF_BELOW) {
        isNavCollapsedRef.current = true;
        setIsNavCollapsed(true);
      } else {
        setNavRailWidthPx(clampNavRailWidth(raw));
      }
    };
    const onUp = () => {
      setIsResizingNavRail(false);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingNavRail]);

  const startNavRailResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingNavRail(true);
  }, []);

  const closeMobileNav = () => {
    if (window.innerWidth < 768) setMobileNavOpen(false);
  };

  const addShareInvitee = () => {
    const email = shareEmailInput.trim();
    if (!email) {
      toast.error('Enter an email address');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Enter a valid email address');
      return;
    }
    if (shareInvitees.some((i) => i.email.toLowerCase() === email.toLowerCase())) {
      toast.error('That email is already on the invite list');
      return;
    }
    if (sharedDashboardUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error('That person already has access — edit their permission below');
      return;
    }
    setShareInvitees((prev) => [
      ...prev,
      { id: crypto.randomUUID(), email, permission: newInvitePermission },
    ]);
    setShareEmailInput('');
  };

  const updateInviteePermission = (id: string, permission: 'collaborator' | 'viewer') => {
    setShareInvitees((prev) => prev.map((i) => (i.id === id ? { ...i, permission } : i)));
  };

  const removeShareInvitee = (id: string) => {
    setShareInvitees((prev) => prev.filter((i) => i.id !== id));
  };

  const updateSharedUserPermission = (id: string, permission: 'collaborator' | 'viewer') => {
    setSharedDashboardUsers((prev) => prev.map((u) => (u.id === id ? { ...u, permission } : u)));
  };

  const removeSharedUser = (id: string) => {
    setSharedDashboardUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const handleShareDashboardSubmit = () => {
    if (shareInvitees.length > 0) {
      setSharedDashboardUsers((prev) => [
        ...prev,
        ...shareInvitees.map((inv) => ({
          id: crypto.randomUUID(),
          email: inv.email,
          permission: inv.permission,
        })),
      ]);
      toast.success(
        `Added ${shareInvitees.length} ${shareInvitees.length === 1 ? 'person' : 'people'}. They’ll receive an invite.`,
      );
      setShareInvitees([]);
      setShareEmailInput('');
    } else {
      toast.success('Sharing settings saved');
    }
    setShareDialogOpen(false);
  };

  const permissionToggleClass = (active: boolean) =>
    `flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
      active ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900'
    }`;

  const [availableReports, setAvailableReports] = useState([
    { name: 'Profit and Loss', desc: 'Income, expenses, and net profit over a specific time period.', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Balance Sheet', desc: 'A snapshot of your firm\'s assets, liabilities, and equity.', icon: LayoutDashboard, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'Cash Flow Statement', desc: 'Cash entering and leaving your business over time.', icon: ArrowRightLeft, color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'A/R Aging', desc: 'Unpaid client invoices grouped by how long they\'ve been open.', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'A/P Aging', desc: 'Outstanding bills your firm owes to vendors and suppliers.', icon: CreditCard, color: 'text-red-600', bg: 'bg-red-50' },
    { name: 'General Ledger', desc: 'A complete record of all financial transactions.', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Trial Balance', desc: 'Closing balances of all ledger accounts at a point in time.', icon: Scale, color: 'text-teal-600', bg: 'bg-teal-50' },
    { name: 'Expense by Category', desc: 'Detailed breakdown of where your money is being spent.', icon: PieChart, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { name: 'Revenue by Practice Area', desc: 'Income grouped by legal service type or department.', icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]);

  const reportLibraryForFinance = React.useMemo(
    () => availableReports.map((r) => ({ name: r.name, desc: r.desc, icon: r.icon })),
    [availableReports],
  );

  const brandColor = 'var(--primary)';

  React.useEffect(() => {
    if (selectedReport !== 'Profit and Loss') {
      setProfitLossViewState(DEFAULT_PROFIT_LOSS_VIEW_STATE);
    }
  }, [selectedReport]);

  React.useEffect(() => {
    if (!selectedReport) {
      setStandardReportViewState(DEFAULT_STANDARD_REPORT_VIEW_STATE);
    }
  }, [selectedReport]);

  const handleChatSubmit = (query?: string) => {
    const textToSubmit = query || chatInput;
    if (!textToSubmit.trim()) return;

    setTeammateRailOpen(true);

    const newUserMsg = { role: 'user' as const, content: textToSubmit };
    setChatHistory(prev => [...prev, newUserMsg]);
    setChatInput("");

    // Initial loading indicator message
    const loadingMsgId = Date.now().toString();
    setChatHistory(prev => [...prev, { role: 'ai', content: '...', id: loadingMsgId } as any]);

    // P&L natural-language → filters + navigate (any page / Reports grid; was gated on already-open P&L only)
    const nl = interpretProfitLossQuery(textToSubmit, profitLossViewState);
    if (nl.matched) {
      setActivePage('Reports');
      setSelectedReport('Profit and Loss');
      setProfitLossViewState(nl.nextState);
      window.setTimeout(() => {
        setChatHistory((prev) =>
          prev.map((msg) =>
            (msg as { id?: string }).id === loadingMsgId
              ? { role: 'ai' as const, content: nl.assistantMessage }
              : msg,
          ),
        );
      }, 450);
      return;
    }

    // Mock AI response delay
    setTimeout(() => {
      const lowerQuery = textToSubmit.toLowerCase();

      // Heuristic to detect if user is asking for a new report
      if (lowerQuery.includes('report') && (lowerQuery.includes('create') || lowerQuery.includes('generate') || lowerQuery.includes('build'))) {
        // Extract a sensible name or fallback to "Runway Analysis" for the prompt's example
        let reportName = "Custom Analysis Report";
        let reportDesc = "A custom report generated based on your request.";
        let reportIcon = FileText;
        
        if (lowerQuery.includes('runway')) {
          reportName = "Runway Analysis";
          reportDesc = "Detailed forecast of cash runway and burn rate projections.";
          reportIcon = TrendingDown;
        } else if (lowerQuery.includes('expense') || lowerQuery.includes('spend')) {
          reportName = "Expense Deep Dive";
          reportDesc = "Granular view of categorized expenses over time.";
          reportIcon = PieChart;
        }

        const newReport = {
          name: reportName,
          desc: reportDesc,
          icon: reportIcon,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50'
        };

        setAvailableReports(prev => [newReport, ...prev]);

        setChatHistory(prev => prev.map(msg => 
          (msg as any).id === loadingMsgId 
            ? { role: 'ai' as const, content: `I've generated a new "${reportName}" for you. You can find it in the Reports tab.` } 
            : msg
        ));
      } else {
        setChatHistory(prev => prev.map(msg => 
          (msg as any).id === loadingMsgId 
            ? { role: 'ai' as const, content: `I've analyzed your request regarding "${textToSubmit}". Based on our current financial models, making this adjustment would initially increase operating expenses, but is projected to yield a positive ROI within 4-6 months. Would you like me to create a detailed projection model for this scenario?` } 
            : msg
        ));
      }
    }, 1500);
  };

  const submitCreateFinancialModel = () => {
    const name = newModelName.trim();
    const scenario = newModelScenario.trim();
    if (!name) {
      toast.error('Enter a model name');
      return;
    }
    if (!scenario) {
      toast.error('Describe your scenario');
      return;
    }
    if (isCreateModelProcessing) return;

    createModelAbortRef.current = false;
    setIsCreateModelProcessing(true);

    const delayMs = 1400 + Math.floor(Math.random() * 500);
    window.setTimeout(() => {
      if (createModelAbortRef.current) {
        setIsCreateModelProcessing(false);
        return;
      }

      const interpreted = ambientCfoInterpretScenario(scenario, newModelFramework);
      const model = createUserFinancialModel({
        name,
        scenarioSummary: scenario,
        burnDeltaPercent: interpreted.burnDeltaPercent,
        ambient: {
          cardDescription: interpreted.cardDescription,
          insight: interpreted.insight,
          goalImpact: interpreted.goalImpact,
          extraAction: interpreted.extraAction,
        },
      });
      setUserFinancialModels((prev) => [...prev, model]);
      setCreateModelDialogOpen(false);
      setNewModelName('');
      setNewModelScenario('');
      setNewModelFramework('Default');
      setIsCreateModelProcessing(false);
      toast.success('Firm Intelligence built your scenario model — Preview or Explore to review the plan');
    }, delayMs);
  };

  const suggestedQuestions = [
    "What's our projected runway?",
    "How can we reduce overhead by 5%?",
    "Which clients have the oldest A/R?",
    'Model a payroll shortfall resolution plan',
    "What was last month's profit margin?",
    "What does my payroll look like in comparison to last year?",
    "Digital Twin: what if two senior associates leave—how does runway change?",
    "Digital Twin: model a 10% billing rate increase in Real Estate",
  ];

  const handleDigitalTwinScenario = React.useCallback((_id: DigitalTwinScenarioId) => {
    setActivePage('fp_default');
  }, []);

  // Sidebar Navigation Items matching the provided reference image
  const navItems = React.useMemo((): NavItem[] => [
      { name: 'Dashboard', icon: LayoutDashboard },
      { name: 'Transactions', icon: CreditCard },
      { name: 'Funds In', icon: ArrowDownToLine },
      { name: 'Funds Out', icon: ArrowUpFromLine },
      { name: 'Payroll', icon: Users },
      {
        name: 'Finances',
        icon: DollarSign,
        subItems: [
          ...financeCustomPages.map((p) => ({
            name: p.id,
            label: p.title,
            icon: LayoutDashboard,
          })),
          { name: 'Reports', icon: FileText },
          { name: 'Financial Goals', icon: Target },
          { name: 'Add a custom view', icon: Plus, isAction: true },
        ],
      },
      { name: 'Chart of Accounts', icon: List },
      { name: 'Connections', icon: Plug },
    ],
    [financeCustomPages],
  );

  const handleModellingSelectAlternative = React.useCallback((modelId: string) => {
    setShowMorePlans(false);
    setSelectedModelId(modelId);
    setBriefingPanel({ mode: 'modellingExplore', modelId });
  }, []);

  const handleModellingExecute = React.useCallback(() => {
    const panel = briefingPanel;
    if (panel?.mode !== 'modellingExplore') return;
    const modelId = panel.modelId;
    if (financialGoalModelIds.includes(modelId)) return;
    setIsExecuting(true);
    window.setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
      addModelToFinancialGoals(modelId);
      window.setTimeout(() => {
        setBriefingPanel(null);
        setHasExecuted(false);
      }, 1500);
    }, 2000);
  }, [briefingPanel, financialGoalModelIds, addModelToFinancialGoals]);

  const handleExecute = React.useCallback(() => {
    const panel = briefingPanel;
    if (panel?.mode === 'modellingExplore') return;
    const insightToApply =
      panel?.mode === 'takeAction' && isBriefingInsightId(panel.insightId) ? panel.insightId : null;
    setIsExecuting(true);
    window.setTimeout(() => {
      setIsExecuting(false);
      setHasExecuted(true);
      if (insightToApply) {
        setExecutedBriefingPlans((prev) =>
          prev.includes(insightToApply) ? prev : [...prev, insightToApply],
        );
        toast.success('Plan applied — your dashboards now reflect this change.');
      }
      window.setTimeout(() => {
        setBriefingPanel(null);
        setHasExecuted(false);
      }, 1500);
    }, 2000);
  }, [briefingPanel]);

  const resolveBriefingInsightId = (id: string): BriefingInsightId =>
    isBriefingInsightId(id) ? id : BRIEFING_DEFAULT_INSIGHT_ID;
  const isPayrollShortfallInsight = (id: string) => resolveBriefingInsightId(id) === 'insight-5';

  const openPayrollShortfallModelling = () => {
    const payrollModelId = 'payroll_shortfall';
    setSelectedModelId(payrollModelId);
    setBriefingPanel({ mode: 'modellingExplore', modelId: payrollModelId });
  };

  const handleBriefingTakeAction = (insightId: string) => {
    setShowMorePlans(false);
    setHasExecuted(false);
    if (isPayrollShortfallInsight(insightId)) {
      openPayrollShortfallModelling();
      return;
    }
    setBriefingPanel({ mode: 'takeAction', insightId: resolveBriefingInsightId(insightId) });
  };

  const handleBriefingExplore = (insightId: string) => {
    if (isPayrollShortfallInsight(insightId)) {
      openPayrollShortfallModelling();
      return;
    }
    setBriefingPanel({ mode: 'explore', insightId: resolveBriefingInsightId(insightId) });
  };

  const globalSearchResults = React.useMemo(() => {
    if (!chatInput.trim()) return [];
    
    const query = chatInput.toLowerCase();
    const results: { title: string; subtitle: string; type: 'page' | 'report'; icon: any; action: () => void }[] = [];
    
    // Search pages
    const extractPages = (items: any[]) => {
      items.forEach((item) => {
        if (item.subItems) {
          if (item.name.toLowerCase().includes(query)) {
            results.push({
              title: item.name,
              subtitle: 'Page',
              type: 'page',
              icon: item.icon,
              action: () => {
                setActivePage(item.name);
                setSelectedReport(null);
              },
            });
          }
          extractPages(item.subItems);
        } else {
          if (item.isAction) return;
          const display = item.label ?? item.name;
          if (display.toLowerCase().includes(query) || item.name.toLowerCase().includes(query)) {
            results.push({
              title: display,
              subtitle: 'Page',
              type: 'page',
              icon: item.icon,
              action: () => {
                setActivePage(item.name);
                setSelectedReport(null);
              },
            });
          }
        }
      });
    };
    extractPages(navItems);
    
    // Search reports
    availableReports.forEach(report => {
      if (report.name.toLowerCase().includes(query) || report.desc.toLowerCase().includes(query)) {
        results.push({
          title: report.name,
          subtitle: 'Report',
          type: 'report',
          icon: report.icon,
          action: () => {
            setActivePage('Reports');
            setSelectedReport(report.name);
          }
        });
      }
    });
    
    return results;
  }, [chatInput, availableReports, navItems]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Toaster position="bottom-right" richColors />

      {/* Mobile: open nav from menu; desktop: sidebar always visible */}
      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <button
        type="button"
        className="md:hidden fixed top-3 left-3 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm hover:bg-muted transition-colors duration-[var(--motion-duration-sm)]"
        aria-label="Open menu"
        onClick={() => {
          setIsNavCollapsed(false);
          setMobileNavOpen(true);
        }}
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>
      
      {/* LEFT NAVIGATION SIDEBAR — was hidden below md; now drawer on mobile */}
      <aside
        className={`bg-[var(--surface-nav)] border-r border-[var(--nav-border)] flex-col shrink-0 relative max-md:max-w-[calc(100vw-2rem)]
          fixed inset-y-0 left-0 z-40 md:relative md:z-10 md:translate-x-0
          ${mobileNavOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
          md:flex md:shadow-none md:max-w-none`}
        style={{
          width: isNavCollapsed ? NAV_RAIL_COLLAPSED_PX : navRailWidthPx,
          transition: isResizingNavRail
            ? undefined
            : `width var(--motion-duration-md) var(--motion-ease-standard)`,
        }}
      >
        {/* Drag to resize; drag past threshold collapses / expands (desktop) */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label={isNavCollapsed ? 'Drag right to expand navigation' : 'Drag to resize navigation'}
          title={isNavCollapsed ? 'Drag right to expand' : 'Drag to resize; drag left to collapse'}
            className="hidden md:block absolute top-0 right-0 z-[60] w-2 -mr-1 h-full cursor-col-resize touch-none hover:bg-primary/10 active:bg-primary/15 motion-reduce:transition-none"
          onMouseDown={startNavRailResize}
        />

        {/* Collapse Toggle (desktop only — mobile uses full labels) */}
        <button 
          type="button"
          onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          className="hidden md:flex absolute -right-3.5 top-[35px] bg-card border border-border rounded-full p-1.5 shadow-sm hover:bg-muted text-muted-foreground z-50 transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)]"
          title={isNavCollapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {isNavCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
        </button>

        <div className="border-b border-[var(--nav-border)] pt-[21px] pb-[21px] flex flex-col justify-center min-h-[88.5px] shrink-0 transition-all duration-[var(--motion-duration-md)] ease-[var(--motion-ease-standard)] motion-reduce:duration-0">
          <div className="flex md:hidden items-center justify-between px-[21px] gap-3">
            <div className="min-w-0">
              <h1 className="font-semibold text-[var(--text-primary)] text-[21px] leading-[31.5px] tracking-[-0.3589px]">Clio Accounting</h1>
              <p className="truncate text-[11px] font-medium text-[var(--text-secondary)]">{FIRM_NAME}</p>
              <p className="truncate text-[10px] text-muted-foreground">{FIRM_ATTORNEY_COUNT} attorneys</p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              aria-label="Close menu"
              onClick={() => setMobileNavOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className={`hidden md:flex flex-col justify-center h-full ${isNavCollapsed ? 'px-0 items-center' : 'px-[21px]'}`}>
            {isNavCollapsed ? (
              <div className="w-8 h-8 bg-primary rounded-[8px] flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">C</div>
            ) : (
              <div className="animate-in fade-in duration-300 min-w-0">
                <h1 className="font-semibold text-[var(--text-primary)] text-[21px] leading-[31.5px] tracking-[-0.3589px] whitespace-nowrap">Clio Accounting</h1>
                <p className="truncate text-[11px] font-medium text-[var(--text-secondary)] mt-0.5">{FIRM_NAME}</p>
                <p className="truncate text-[10px] text-muted-foreground">{FIRM_ATTORNEY_COUNT} attorneys</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className={`flex-1 pt-[14px] space-y-[3.5px] overflow-y-auto custom-scrollbar overflow-x-hidden ${isNavCollapsed ? 'px-[12px]' : 'px-[10.5px]'}`}>
          {navItems.map((item) => (
            <div key={item.name} className="flex flex-col">
              <a
                href="#"
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (item.subItems && !isNavCollapsed) {
                    setIsFinancesOpen(!isFinancesOpen); 
                  } else if (item.subItems && isNavCollapsed) {
                    setIsNavCollapsed(false);
                    setIsFinancesOpen(true);
                  } else {
                    setActivePage(item.name);
                    closeMobileNav();
                  }
                }}
                className={`flex items-center rounded-[8px] transition-all group ${
                  isNavCollapsed ? 'justify-center h-[40px] w-[48px]' : 'justify-between h-[31.5px] px-[10.5px]'
                } ${
                  activePage === item.name || (isNavCollapsed && item.subItems?.some(s => s.name === activePage))
                    ? 'bg-[var(--nav-item-active-bg)] text-[var(--text-primary)]' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--nav-item-hover-bg)]'
                }`}
                title={isNavCollapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-[10.5px] justify-center min-w-0">
                  <item.icon
                    className={`w-[17.5px] h-[17.5px] shrink-0 ${
                      activePage === item.name || (isNavCollapsed && item.subItems?.some((s) => s.name === activePage))
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                    }`}
                    strokeWidth={1.5}
                  />
                  {!isNavCollapsed && (
                    <span className="font-medium text-[12.25px] leading-[17.5px] whitespace-nowrap animate-in fade-in duration-300">
                      {item.name}
                    </span>
                  )}
                </div>
                {!isNavCollapsed && item.subItems && (
                  <ChevronDown className={`w-[14px] h-[14px] shrink-0 text-[var(--text-secondary)] transition-transform duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] ${!isFinancesOpen ? '-rotate-90' : ''}`} strokeWidth={1.5} />
                )}
              </a>
              
              {!isNavCollapsed && item.subItems && isFinancesOpen && (
                <div className="flex flex-col mt-[3.5px] space-y-[3.5px] animate-in slide-in-from-top-1 fade-in duration-200">
                  {item.subItems.map((subItem) => (
                    <a
                      key={subItem.name}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!subItem.isAction) {
                          setActivePage(subItem.name);
                          if (subItem.name === 'Reports') {
                            setSelectedReport(null);
                          }
                          closeMobileNav();
                        } else if (subItem.name === 'Add a custom view') {
                          beginCustomize({ mode: 'create' });
                          closeMobileNav();
                        }
                      }}
                      className={`flex items-center h-[31.5px] rounded-[8px] pl-[38.5px] pr-[10.5px] gap-[10.5px] transition-all duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] motion-reduce:transition-none group ${
                        activePage === subItem.name 
                          ? 'bg-[var(--nav-item-active-bg)] text-[var(--text-primary)]' 
                          : 'text-[var(--text-secondary)] hover:bg-[var(--nav-item-hover-bg)]'
                      }`}
                    >
                      <subItem.icon 
                        className={`w-[17.5px] h-[17.5px] shrink-0 ${activePage === subItem.name ? 'text-[var(--text-primary)]' : subItem.isAction ? 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`} 
                        strokeWidth={1.5} 
                      />
                      <span className={`font-medium text-[12.25px] leading-[17.5px] whitespace-nowrap ${subItem.isAction ? 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]' : ''}`}>
                        {(subItem as { label?: string }).label ?? subItem.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={`shrink-0 border-t border-[var(--nav-border)] pt-[15px] ${isNavCollapsed ? 'px-[12px] pb-[15px]' : 'px-[14px] pb-[12px]'}`}>
          <div className={`flex flex-col ${isNavCollapsed ? 'items-center gap-[6px]' : 'gap-[6px]'}`}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage('User Profile');
                closeMobileNav();
              }}
              className={`flex items-center rounded-[8px] gap-[10.5px] hover:bg-[var(--nav-item-hover-bg)] transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] motion-reduce:transition-none group ${
                isNavCollapsed ? 'justify-center h-[40px] w-[48px]' : 'h-[40px] px-[10.5px]'
              }`}
              title={isNavCollapsed ? 'User Profile' : undefined}
            >
              <div className="w-[21px] h-[21px] rounded-full bg-[color-mix(in_srgb,var(--chart-sky)_35%,#fff)] border border-[var(--nav-border)] text-[var(--brand-cobalt)] flex items-center justify-center text-[10px] font-bold shrink-0">
                {USER_INITIALS}
              </div>
              {!isNavCollapsed && (
                <div className="min-w-0 animate-in fade-in duration-300">
                  <p className="text-[12.25px] leading-[15px] font-semibold text-[var(--text-primary)] truncate">{USER_FULL_NAME}</p>
                </div>
              )}
            </a>

            <a 
              href="#"
              className={`flex items-center rounded-[8px] gap-[10.5px] hover:bg-[var(--nav-item-hover-bg)] transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] motion-reduce:transition-none group ${
                isNavCollapsed ? 'justify-center h-[40px] w-[48px]' : 'h-[31.5px] px-[10.5px]'
              }`}
              title={isNavCollapsed ? "Settings" : undefined}
            >
              <Settings className="w-[17.5px] h-[17.5px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] shrink-0" strokeWidth={1.5} />
              {!isNavCollapsed && (
                <span className="font-medium text-[var(--text-secondary)] text-[12.25px] leading-[17.5px] group-hover:text-[var(--text-primary)] whitespace-nowrap animate-in fade-in duration-300">Settings</span>
              )}
            </a>
          </div>
        </div>
      </aside>

      {/* Main + docked Clio Teammate: flex row so the rail pushes content instead of covering it */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-row">
      {/* MAIN CONTENT AREA — top padding on small screens for menu button */}
      <main
        className={cn(
          'relative min-h-0 min-w-0 flex-1 custom-scrollbar overflow-y-auto bg-background pt-14 md:pt-0 transition-[padding] duration-300 ease-out motion-reduce:transition-none',
          /* Only reserve space when the column can fit rail + content (28rem pad on narrow md would clip the report) */
          teammateRailOpen && 'lg:pr-[28rem]',
        )}
      >
        {isCustomizing && customizerContext ? (
          <DashboardCustomizer
            key={`dashboard-customizer-${customizerMountId}`}
            reportLibrary={reportLibraryForFinance}
            executedBriefingInsightIds={executedBriefingPlans}
            mode={customizerContext.mode}
            onClose={() => setCustomizerContext(null)}
            dashboardTitle={
              customizerContext.mode === 'edit'
                ? financeCustomPages.find((p) => p.id === customizerContext.pageId)?.title ?? ''
                : ''
            }
            initialWidgets={
              customizerContext.mode === 'create'
                ? DEFAULT_NEW_PAGE_WIDGETS
                : financeCustomPages.find((p) => p.id === customizerContext.pageId)?.widgets ?? []
            }
            initialSidebarWidgets={
              customizerContext.mode === 'create'
                ? DEFAULT_NEW_PAGE_SIDEBAR_WIDGETS
                : financeCustomPages.find((p) => p.id === customizerContext.pageId)?.sidebarWidgets ??
                  DEFAULT_NEW_PAGE_SIDEBAR_WIDGETS
            }
            initialShowSidebar={
              customizerContext.mode === 'create'
                ? true
                : financeCustomPages.find((p) => p.id === customizerContext.pageId)?.showSidebar ?? true
            }
            getCustomizerStrategicRows={getCustomizerStrategicRows}
            modellingWidgetModels={modellingUiBridge.models}
            financialGoalModelIds={financialGoalModelIds}
            onModellingExplore={openModellingExplorePanel}
            onModellingOpenCreateModel={() => setCreateModelDialogOpen(true)}
            initialPeerBenchmarkEnabled={peerBenchmarkEnabled}
            onSaveDashboard={({ title, widgets, sidebarWidgets, mainGridColumns, showSidebar }) => {
              const t = title.trim() || 'Untitled dashboard';
              if (customizerContext.mode === 'create') {
                const id = `fp_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
                setFinanceCustomPages((prev) => [
                  ...prev,
                  {
                    id,
                    title: t,
                    widgets,
                    sidebarWidgets,
                    mainGridColumns,
                    showSidebar,
                  },
                ]);
                setActivePage(id);
                toast.success('New page added under Finances');
              } else {
                const pid = customizerContext.pageId;
                setFinanceCustomPages((prev) =>
                  prev.map((p) =>
                    p.id === pid ? { ...p, title: t, widgets, sidebarWidgets, mainGridColumns, showSidebar } : p,
                  ),
                );
                toast.success('Dashboard updated');
              }
              setCustomizerContext(null);
            }}
            onDeleteDashboard={() => {
              if (customizerContext.mode !== 'edit') return;
              const pid = customizerContext.pageId;
              const remaining = financeCustomPages.filter((p) => p.id !== pid);
              setFinanceCustomPages(remaining);
              setSharedDashboardUsers([]);
              setCustomizerContext(null);
              setActivePage(remaining[0]?.id ?? FP_FINANCIAL_HEALTH_ID);
              toast.success('Dashboard permanently deleted');
            }}
            onTakeAction={(insightId) => {
              handleBriefingTakeAction(insightId);
              setCustomizerContext(null);
            }}
            onExploreData={(insightId) => {
              handleBriefingExplore(insightId);
              setCustomizerContext(null);
            }}
            onDigitalTwinScenario={(id) => {
              handleDigitalTwinScenario(id);
              setCustomizerContext(null);
            }}
          />
        ) : activePage === 'Dashboard' ? (
          <HomeDashboard
            userFirstName={USER_FIRST_NAME}
            onOpenTeammate={() => setTeammateRailOpen(true)}
            onReviewGoals={() => setActivePage('Financial Goals')}
            onOpenFinancialHealthOverview={() => setActivePage(FP_FINANCIAL_HEALTH_ID)}
            financialHealthPins={dashboardFinancialPins}
            reportLibrary={reportLibraryForFinance}
            onUnpinFinancialPinKey={handleUnpinDashboardFinancial}
            onOpenSourceFinancePage={(pageId) => setActivePage(pageId)}
          />
        ) : activePage === 'Financial Goals' ? (
          <div className="max-w-6xl mx-auto p-8 pb-32 space-y-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Goals</h1>
              </div>
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-[8px] text-sm font-medium hover:bg-primary/90 transition-colors duration-[var(--motion-duration-sm)] ease-[var(--motion-ease-standard)] flex items-center gap-2"
                onClick={() => {}}
              >
                <Plus className="w-4 h-4" />
                New Goal
              </button>
            </div>

            {financialGoalsLinkedModels.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  From Modelling
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {financialGoalsLinkedModels.map((m) => {
                    const prog = linkedModelGoalProgress(m);
                    return (
                    <div
                      key={m.id}
                      className="bg-white rounded-[8px] shadow-sm border border-emerald-100 p-6 flex flex-col hover:border-emerald-200 transition-colors ring-1 ring-emerald-50"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-2 min-w-0">
                          <div className="h-9 w-9 rounded-[8px] bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            <Sparkles className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-900 leading-tight">{m.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{m.description}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeModelFromFinancialGoals(m.id)}
                          className="text-xs font-medium text-gray-400 hover:text-red-600 shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-6 flex-1 mt-2">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-[13px]">
                            <span className="font-semibold text-gray-700">Progress</span>
                            <span className="font-bold text-gray-900">
                              {prog.currentText}{' '}
                              <span className="text-gray-400 font-normal">/ {prog.targetText}</span>
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-[8px] h-2 relative overflow-hidden">
                            <div
                              className="bg-emerald-500 h-2 rounded-[8px] transition-all duration-1000"
                              style={{ width: `${prog.percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-[13px] text-gray-600 leading-relaxed flex-1 line-clamp-4 mt-4">
                        {m.goalImpactAnalysis}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const pid =
                            financeCustomPages.find((p) => p.id === 'fp_default')?.id ??
                            financeCustomPages[0]?.id;
                          if (pid) {
                            setSelectedModelId(m.id);
                            setActivePage(pid);
                          }
                        }}
                        className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        Open strategic dashboard to preview this model →
                      </button>
                    </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                Firm goals
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed border-l-4 border-primary/40 pl-4 py-1 bg-primary/5 rounded-r-[8px]">
                {FIRM_INTELLIGENCE_GOALS_FILTER_NARRATIVE}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FIRM_GOAL_DEFINITIONS.map((goal) => {
                  const Icon =
                    goal.id === 'net_revenue_yoy'
                      ? TrendingUp
                      : goal.id === 'days_to_collect'
                        ? Clock
                        : Wallet;
                  const iconColor =
                    goal.id === 'net_revenue_yoy'
                      ? 'text-emerald-600'
                      : goal.id === 'days_to_collect'
                        ? 'text-amber-600'
                        : 'text-blue-600';
                  return (
                    <div
                      key={goal.id}
                      className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6 flex flex-col hover:border-gray-300 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-2 min-w-0">
                          <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} strokeWidth={2} />
                          <div className="min-w-0">
                            <h3 className="text-base font-bold text-gray-900 leading-snug">{goal.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{goal.metricHint}</p>
                          </div>
                        </div>
                        <button type="button" className="text-gray-400 hover:text-gray-600 shrink-0" aria-label="Edit goal">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div
                        className={`mb-3 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          goal.status === 'on_track'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {goal.status === 'on_track' ? 'On track' : 'Behind pace'}
                      </div>
                      <div className="space-y-2 flex-1 mt-auto">
                        <div className="flex justify-between items-center text-[13px] gap-2">
                          <span className="font-semibold text-gray-700">Progress</span>
                          <span className="font-bold text-gray-900 text-right">
                            {goal.progressCurrentLabel}
                            <span className="text-gray-400 font-normal block sm:inline sm:ml-1 text-[12px]">
                              → {goal.progressTargetLabel}
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-[8px] h-2 relative overflow-hidden">
                          <div
                            className={`h-2 rounded-[8px] transition-all duration-1000 ${
                              goal.status === 'on_track' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, goal.progressPct)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : isFinanceCustomPageView && activeFinancePage ? (
          <div className="max-w-7xl mx-auto w-full p-8 pb-32 flex flex-col gap-8 animate-in fade-in duration-300">
            {/* Header — full page width */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">{activeFinancePage.title}</h1>
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {financePageHeaderAvatars.length > 0 ? (
                  <div className="flex items-center shrink-0">
                    <div className="flex items-center -space-x-2">
                      {financePageHeaderAvatars.map((person, i) => (
                        <div
                          key={person.id}
                          className="relative"
                          style={{ zIndex: financePageHeaderAvatars.length - i }}
                          title={`${person.name} — ${strategicDashboardPresenceLabel(person.presence)}`}
                        >
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold border-2 border-[#F9FAFB] shadow-sm ring-2 ring-offset-0 ${
                              person.avatarClass
                            } ${
                              person.presence === 'collaborating'
                                ? 'ring-violet-500'
                                : person.presence === 'viewing'
                                  ? 'ring-emerald-500'
                                  : 'ring-gray-300 opacity-80'
                            }`}
                          >
                            {person.initials}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white ${
                              person.presence === 'collaborating'
                                ? 'bg-violet-500'
                                : person.presence === 'viewing'
                                  ? 'bg-emerald-500 animate-pulse'
                                  : 'bg-gray-300'
                            }`}
                            aria-hidden
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => setShareDialogOpen(true)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-[8px] text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm shrink-0"
                >
                  <Share2 className="w-4 h-4" strokeWidth={1.5} />
                  Share
                </button>
                <button 
                  type="button"
                  onClick={() => beginCustomize({ mode: 'edit', pageId: activePage })}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-[8px] text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm shrink-0"
                >
                  <Settings className="w-4 h-4" />
                  Customize page
                </button>
              </div>
            </div>

            <Dialog
              open={shareDialogOpen}
              onOpenChange={(open) => {
                setShareDialogOpen(open);
                if (!open) {
                  setShareEmailInput('');
                  setShareInvitees([]);
                  setNewInvitePermission('viewer');
                }
              }}
            >
              <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-[480px] gap-0 p-0 overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 pb-4 shrink-0">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900 text-xl">Share dashboard</DialogTitle>
                    <DialogDescription className="text-gray-600 text-sm">
                      Manage who has access, change permissions, or invite new people.
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="px-6 pb-6 space-y-5 border-t border-gray-100 pt-5 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      People with access ({sharedDashboardUsers.length})
                    </span>
                    {sharedDashboardUsers.length === 0 ? (
                      <p className="text-sm text-gray-500 py-3 px-1">No one has access yet. Invite people below.</p>
                    ) : (
                      <ul className="rounded-[8px] border border-gray-200 divide-y divide-gray-100 max-h-[min(200px,28vh)] overflow-y-auto custom-scrollbar">
                        {sharedDashboardUsers.map((u) => (
                          <li
                            key={u.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white hover:bg-gray-50/80"
                          >
                            <span className="text-sm font-medium text-gray-900 truncate flex-1 min-w-0">
                              {u.email}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                                <button
                                  type="button"
                                  className={permissionToggleClass(u.permission === 'viewer')}
                                  onClick={() => updateSharedUserPermission(u.id, 'viewer')}
                                >
                                  Viewer
                                </button>
                                <button
                                  type="button"
                                  className={permissionToggleClass(u.permission === 'collaborator')}
                                  onClick={() => updateSharedUserPermission(u.id, 'collaborator')}
                                >
                                  Collaborator
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeSharedUser(u.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors"
                                aria-label="Remove access"
                              >
                                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="h-px bg-gray-100" />

                  <div className="space-y-2">
                    <Label htmlFor="share-email" className="text-gray-700">
                      Invite someone new
                    </Label>
                    <div className="flex flex-col gap-3">
                      <Input
                        id="share-email"
                        type="email"
                        placeholder="name@summitlegal.com"
                        value={shareEmailInput}
                        onChange={(e) => setShareEmailInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addShareInvitee();
                          }
                        }}
                        className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-2">Permission for new invite</span>
                        <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 w-full max-w-[280px]">
                          <button
                            type="button"
                            className={permissionToggleClass(newInvitePermission === 'viewer')}
                            onClick={() => setNewInvitePermission('viewer')}
                          >
                            Viewer
                          </button>
                          <button
                            type="button"
                            className={permissionToggleClass(newInvitePermission === 'collaborator')}
                            onClick={() => setNewInvitePermission('collaborator')}
                          >
                            Collaborator
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {shareInvitees.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Ready to invite ({shareInvitees.length})
                      </span>
                      <ul className="rounded-[8px] border border-gray-200 divide-y divide-gray-100 max-h-[200px] overflow-y-auto custom-scrollbar">
                        {shareInvitees.map((inv) => (
                          <li
                            key={inv.id}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50/50 hover:bg-gray-50"
                          >
                            <span className="text-sm font-medium text-gray-900 truncate flex-1 min-w-0">
                              {inv.email}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex rounded-lg border border-gray-200 p-0.5 bg-white">
                                <button
                                  type="button"
                                  className={permissionToggleClass(inv.permission === 'viewer')}
                                  onClick={() => updateInviteePermission(inv.id, 'viewer')}
                                >
                                  Viewer
                                </button>
                                <button
                                  type="button"
                                  className={permissionToggleClass(inv.permission === 'collaborator')}
                                  onClick={() => updateInviteePermission(inv.id, 'collaborator')}
                                >
                                  Collaborator
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeShareInvitee(inv.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors"
                                aria-label="Remove"
                              >
                                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <DialogFooter className="flex-row justify-end gap-2 border-t border-gray-100 bg-gray-50/80 px-6 py-4 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShareDialogOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-[8px] hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleShareDashboardSubmit}
                    className="px-4 py-2 text-sm font-medium text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm"
                    style={{ backgroundColor: brandColor }}
                  >
                    {shareInvitees.length > 0 ? 'Send invites' : 'Done'}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Persisted widget layout + Modelling (charts read scenario overlay via context) */}
            <StrategicDashboardChartsProvider
              value={{
                displayStrategicData,
                selectedModelId,
                peerBenchmarkEnabled,
                briefingSnapshot: briefingFinancialSnapshot,
              }}
            >
            <div
              className={`flex w-full items-start gap-8 ${
                activeFinancePage.showSidebar ? 'flex-col lg:flex-row' : 'flex-col'
              }`}
            >
              <div
                className={`min-w-0 flex flex-col gap-6 w-full ${
                  activeFinancePage.showSidebar ? 'flex-1 order-2 lg:order-1' : 'flex-1'
                }`}
              >
                {activePage === FP_FINANCIAL_HEALTH_ID && !isCustomizing ? (
                  <div className="w-full shrink-0">
                    <FhoPersonalizationBanner />
                  </div>
                ) : null}
                <FinancePageWidgetGrid
                  widgets={activeFinancePage.widgets}
                  mainGridColumns={activeFinancePage.mainGridColumns}
                  modellingUi={modellingUiBridge}
                  reportLibrary={reportLibraryForFinance}
                  pinUi={
                    isFinanceCustomPageView && !isCustomizing
                      ? {
                          activePageId: activePage,
                          pinnedPinKeys: financePagePinnedKeys,
                          onPin: handlePinToDashboardFinancial,
                          onUnpinPinKey: handleUnpinDashboardFinancial,
                        }
                      : null
                  }
                  onUpdateWidget={(instanceId, patch) => {
                    const pid = activePage;
                    setFinanceCustomPages((prev) =>
                      prev.map((p) =>
                        p.id === pid
                          ? {
                              ...p,
                              widgets: p.widgets.map((w) =>
                                w.instanceId === instanceId ? { ...w, ...patch } : w,
                              ),
                            }
                          : p,
                      ),
                    );
                  }}
                  executedBriefingInsightIds={executedBriefingPlans}
                  onTakeAction={(insightId) => {
                    handleBriefingTakeAction(insightId);
                  }}
                  onExploreData={(insightId) => {
                    handleBriefingExplore(insightId);
                  }}
                  onDigitalTwinScenario={handleDigitalTwinScenario}
                />
              </div>

              {activeFinancePage.showSidebar && (
                <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4 order-1 lg:order-2 lg:sticky lg:top-6 lg:self-start">
                  <FinancePageSidebarWidgetStack
                    widgets={activeFinancePage.sidebarWidgets}
                    modellingUi={modellingUiBridge}
                    reportLibrary={reportLibraryForFinance}
                    pinUi={
                      isFinanceCustomPageView && !isCustomizing
                        ? {
                            activePageId: activePage,
                            pinnedPinKeys: financePagePinnedKeys,
                            onPin: handlePinToDashboardFinancial,
                            onUnpinPinKey: handleUnpinDashboardFinancial,
                          }
                        : null
                    }
                    onUpdateWidget={(instanceId, patch) => {
                      const pid = activePage;
                      setFinanceCustomPages((prev) =>
                        prev.map((p) =>
                          p.id === pid
                            ? {
                                ...p,
                                sidebarWidgets: p.sidebarWidgets.map((w) =>
                                  w.instanceId === instanceId
                                    ? { ...w, ...patch, layoutSize: 'compact' as const }
                                    : w,
                                ),
                              }
                            : p,
                        ),
                      );
                    }}
                    executedBriefingInsightIds={executedBriefingPlans}
                    onTakeAction={(insightId) => {
                      handleBriefingTakeAction(insightId);
                    }}
                    onExploreData={(insightId) => {
                      handleBriefingExplore(insightId);
                    }}
                    onDigitalTwinScenario={handleDigitalTwinScenario}
                  />
                </aside>
              )}

              <Dialog
                open={createModelDialogOpen}
                onOpenChange={(open) => {
                  setCreateModelDialogOpen(open);
                  if (!open) {
                    createModelAbortRef.current = true;
                    setIsCreateModelProcessing(false);
                    setNewModelName('');
                    setNewModelScenario('');
                    setNewModelFramework('Default');
                  } else {
                    createModelAbortRef.current = false;
                  }
                }}
              >
                <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-[440px] gap-0 p-0 overflow-hidden max-h-[90vh] flex flex-col">
                  <div className="p-6 pb-4 shrink-0 border-b border-gray-100">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 text-xl">Create scenario model</DialogTitle>
                      <DialogDescription className="text-gray-600 text-sm">
                        Name your model and describe what you want to stress-test. Firm Intelligence reads your scenario, applies your framework, and builds the chart overlay.
                      </DialogDescription>
                    </DialogHeader>
                  </div>
                  <div className="px-6 py-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <div className="space-y-2">
                      <Label htmlFor="model-name" className="text-gray-700">
                        Model name
                      </Label>
                      <Input
                        id="model-name"
                        value={newModelName}
                        onChange={(e) => setNewModelName(e.target.value)}
                        disabled={isCreateModelProcessing}
                        placeholder="e.g. Delay partner hire to Q4"
                        className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model-scenario" className="text-gray-700">
                        Scenario details
                      </Label>
                      <textarea
                        id="model-scenario"
                        value={newModelScenario}
                        onChange={(e) => setNewModelScenario(e.target.value)}
                        disabled={isCreateModelProcessing}
                        placeholder="What are you testing? e.g. Push two associate starts from May to September and freeze non-billable hiring."
                        rows={4}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 resize-y min-h-[100px]"
                      />
                      <p className="text-[11px] text-gray-500 leading-relaxed flex items-start gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        When you create the model, Firm Intelligence interprets this text (hiring, cuts, timing, collections, etc.) and maps it to cash, burn, and runway.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model-framework" className="text-gray-700">
                        Model framework
                      </Label>
                      <select
                        id="model-framework"
                        value={newModelFramework}
                        disabled={isCreateModelProcessing}
                        onChange={(e) => setNewModelFramework(e.target.value as ModelFramework)}
                        className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                      >
                        <option value="Default">Default</option>
                        <option value="Aggressive">Aggressive</option>
                        <option value="Conservative">Conservative</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter className="flex-row flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/80 px-6 py-4 sm:justify-between">
                    {isCreateModelProcessing ? (
                      <span className="text-xs text-gray-600 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                        Firm Intelligence is reading your scenario and building the model…
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400 hidden sm:inline" />
                    )}
                    <div className="flex gap-2 ml-auto">
                      <button
                        type="button"
                        disabled={isCreateModelProcessing}
                        onClick={() => setCreateModelDialogOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-[8px] hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isCreateModelProcessing}
                        onClick={submitCreateFinancialModel}
                        className="px-4 py-2 text-sm font-medium text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm disabled:opacity-60 inline-flex items-center gap-2"
                        style={{ backgroundColor: brandColor }}
                      >
                        {isCreateModelProcessing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing…
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Create model
                          </>
                        )}
                      </button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            </StrategicDashboardChartsProvider>
          </div>
        ) : activePage === 'User Profile' ? (
          <div className="max-w-4xl mx-auto p-8 pb-32 space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your personal details and user-specific preferences.</p>
              </div>
              <button
                type="button"
                onClick={() => toast.success('User profile settings updated')}
                className="px-4 py-2 text-sm font-medium text-white rounded-[8px] hover:opacity-90 transition-opacity shadow-sm"
                style={{ backgroundColor: brandColor }}
              >
                Save changes
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4">Profile Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full name</label>
                      <input
                        defaultValue={USER_FULL_NAME}
                        className="mt-1 w-full rounded-[8px] border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Work email</label>
                      <input
                        defaultValue={USER_EMAIL}
                        className="mt-1 w-full rounded-[8px] border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Role</label>
                      <input
                        defaultValue={USER_ROLE}
                        className="mt-1 w-full rounded-[8px] border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Timezone</label>
                      <input
                        defaultValue="America/Los_Angeles"
                        className="mt-1 w-full rounded-[8px] border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-3">Firm context</h2>
                  <p className="text-sm leading-relaxed text-gray-600">{FIRM_STORY}</p>
                </div>

                <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4">Firm Intelligence Preferences</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between rounded-[8px] border border-gray-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Daily Briefing Digest</p>
                        <p className="text-xs text-gray-500">Receive a concise summary of this week’s high-priority actions.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                    </label>
                    <label className="flex items-center justify-between rounded-[8px] border border-gray-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Proactive Alerts</p>
                        <p className="text-xs text-gray-500">Notify me when cash, runway, or collections shift materially.</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                    </label>
                    <label className="flex items-center justify-between rounded-[8px] border border-gray-200 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Auto-open Financial Goals</p>
                        <p className="text-xs text-gray-500">
                          Jump to Financial Goals after you execute the recommended plan from Modelling Explore.
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Profile</p>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                      {USER_INITIALS}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{USER_FULL_NAME}</p>
                      <p className="text-xs text-gray-500">{USER_ROLE}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[8px] shadow-sm border border-gray-200 p-6">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Security</p>
                  <button className="w-full text-sm font-medium text-gray-700 border border-gray-200 rounded-[8px] py-2.5 hover:bg-gray-50 transition-colors">
                    Change password
                  </button>
                  <button className="w-full text-sm font-medium text-gray-700 border border-gray-200 rounded-[8px] py-2.5 hover:bg-gray-50 transition-colors mt-2">
                    Manage MFA
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activePage === 'Reports' ? (
          selectedReport ? (
            <ReportDetail
              reportName={selectedReport}
              onBack={() => {
                setSelectedReport(null);
                setProfitLossViewState(DEFAULT_PROFIT_LOSS_VIEW_STATE);
                setStandardReportViewState(DEFAULT_STANDARD_REPORT_VIEW_STATE);
              }}
              brandColor={brandColor}
              profitLossViewState={
                selectedReport === 'Profit and Loss' ? profitLossViewState : undefined
              }
              onProfitLossChange={
                selectedReport === 'Profit and Loss'
                  ? (patch) =>
                      setProfitLossViewState((s) => ({
                        ...s,
                        ...patch,
                        ...(Object.keys(patch).some((k) => k !== 'highlightPayrollOnly')
                          ? { highlightPayrollOnly: false }
                          : {}),
                      }))
                  : undefined
              }
              standardReportViewState={
                selectedReport && selectedReport !== 'Profit and Loss'
                  ? standardReportViewState
                  : undefined
              }
              onStandardReportChange={
                selectedReport && selectedReport !== 'Profit and Loss'
                  ? (patch) => setStandardReportViewState((s) => ({ ...s, ...patch }))
                  : undefined
              }
            />
          ) : (
            <div className="max-w-6xl mx-auto p-8 pb-32 animate-in fade-in duration-300">
              <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                  <p className="mt-2 max-w-xl text-xs leading-relaxed text-gray-600">
                    Open a report for firm-wide and matter-scoped views. Use the floating search bar or Clio Teammate to
                    ask Firm Intelligence about your numbers.
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <div className="flex bg-white border border-gray-200 rounded-[8px] p-0.5 shadow-sm">
                    <button 
                      onClick={() => setReportsViewMode('grid')}
                      className={`p-1.5 rounded-[6px] transition-colors ${reportsViewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setReportsViewMode('list')}
                      className={`p-1.5 rounded-[6px] transition-colors ${reportsViewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                      title="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-[8px] text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-600/20">
                    <Plus className="w-4 h-4" />
                    New Custom Report
                  </button>
                </div>
              </div>

              {reportsViewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableReports.map((report) => (
                    <a 
                      key={report.name} 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setSelectedReport(report.name); }} 
                      className="bg-white rounded-[8px] border border-gray-200 p-5 flex flex-col hover:border-blue-400 hover:shadow-sm transition-all group cursor-pointer"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${report.bg}`}>
                          <report.icon className={`w-5 h-5 ${report.color}`} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h3 className="font-bold text-[14px] text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{report.name}</h3>
                          <p className="text-[12px] text-gray-500 leading-relaxed">{report.desc}</p>
                        </div>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-medium text-gray-400">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Updated today</span>
                        <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">View report <ChevronRight className="w-3 h-3" /></span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {availableReports.map((report) => (
                    <a 
                      key={report.name} 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setSelectedReport(report.name); }} 
                      className="bg-white rounded-[8px] border border-gray-200 p-4 flex items-center gap-6 hover:border-blue-400 hover:shadow-sm transition-all group cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${report.bg}`}>
                        <report.icon className={`w-5 h-5 ${report.color}`} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[14px] text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{report.name}</h3>
                        <p className="text-[12px] text-gray-500 truncate">{report.desc}</p>
                      </div>
                      <div className="flex items-center gap-6 text-[12px] font-medium text-gray-400 shrink-0">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Updated today</span>
                        <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 w-[100px] justify-end">View <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activePage}</h2>
          </div>
        )}
      </main>

      <SpecializedTeammateRail
        dock
        open={teammateRailOpen}
        onOpenChange={setTeammateRailOpen}
        chatHistory={chatHistory}
        onUserSend={(text) => handleChatSubmit(text)}
        onClearChat={() => setChatHistory([])}
        brandColor={brandColor}
      />
      </div>

      <BriefingSidePanel
        panel={briefingPanel}
        onClose={() => {
          if (!isExecuting) setBriefingPanel(null);
        }}
        brandColor={brandColor}
        isExecuting={isExecuting}
        hasExecuted={hasExecuted}
        showMorePlans={showMorePlans}
        setShowMorePlans={setShowMorePlans}
        onExecutePlan={handleExecute}
        modellingExploreContent={modellingExploreContent}
        modelAlreadyInGoals={modellingExploreModelAlreadyInGoals}
        onModellingExecute={handleModellingExecute}
        onModellingSelectAlternative={handleModellingSelectAlternative}
      />


      {/* Embedded CSS for custom styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}} />

    </div>
  );
}