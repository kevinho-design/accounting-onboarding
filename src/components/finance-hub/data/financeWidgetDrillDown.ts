import type { BriefingInsightId } from './briefingPanelContent';
import type { FhoWorkflowAction } from './fhoTeammateBreakdowns';

/** Result of resolving a footer CTA for a Finances canvas widget */
export type FinanceWidgetExploreAction =
  | { type: 'noop' }
  | { type: 'navigate_report'; reportName: string; label: string }
  | { type: 'navigate_page'; pageId: string; label: string }
  | { type: 'open_dialog'; label: string }
  | { type: 'teammate_prompt'; prompt: string; label: string }
  | { type: 'briefing_explore'; insightId: BriefingInsightId; label: string };

export function isFinanceWidgetExploreNoop(a: FinanceWidgetExploreAction): boolean {
  return a.type === 'noop';
}

function teammateExplore(prompt: string): FinanceWidgetExploreAction {
  return { type: 'teammate_prompt', label: 'View suggestions', prompt };
}

/**
 * Maps each catalog widget to a prototype “explore” destination.
 * `embedded_report` uses `reportName` from the placed widget.
 * Prefer `teammate_prompt` so every in-scope widget uses the same Clio Teammate Plan flow as FHO.
 */
export function getFinanceWidgetExploreAction(
  widgetId: string,
  options?: { reportName?: string | null },
): FinanceWidgetExploreAction {
  if (widgetId === 'embedded_report') {
    const rn = options?.reportName?.trim();
    if (!rn) return { type: 'noop' };
    return teammateExplore(
      `Explore recommended next steps for the "${rn}" report and how Firm Intelligence can help.`,
    );
  }

  switch (widgetId) {
    /** Firm Financial Goals: no footer CTA — goals are managed inline on the widget. */
    case 'fho_firm_goals_detail':
      return { type: 'noop' };

    case 'fho_operating_cash_detail':
      return teammateExplore('Walk through operating cash next steps and the cash bridge.');
    case 'fho_revenue_detail':
      return teammateExplore('Outline revenue and pipeline actions I can take this week.');
    case 'fho_ar_at_risk_detail':
      return teammateExplore('We are behind goal on AR at risk — what are my collections options?');
    case 'fho_runway_detail':
      return teammateExplore('What should I do about runway vs. our firm goal?');
    case 'fho_iolta_trust_detail':
      return teammateExplore('List trust and IOLTA compliance actions before close.');
    case 'fho_unbilled_detail':
      return teammateExplore('How should I prioritize unbilled WIP and invoicing?');

    case 'strat_cash':
      return teammateExplore(
        'What should I do about projected operating cash vs. modelling overlays and firm goals?',
      );
    case 'strat_burn':
      return teammateExplore(
        'Help me interpret monthly burn vs. scenario modelling and what to tighten first.',
      );
    case 'strat_runway':
      return teammateExplore(
        'What are the best next steps to interpret months of runway vs. goals and stress tests?',
      );
    case 'runway':
      return teammateExplore(
        'Walk through the runway trend chart and actions if the trajectory weakens.',
      );
    case 'cash_flow':
      return teammateExplore(
        'Explain operating cash flow vs. target on this chart and suggested follow-ups.',
      );

    case 'ar_aging':
      return teammateExplore('What collections and AR aging actions should I prioritize this week?');

    case 'ambient_cfo':
      return teammateExplore(
        "Dig into this week's briefing insights — what should I explore, execute, or delegate?",
      );

    case 'digital_twin':
      return teammateExplore(
        'Explore Digital Twin scenarios: runway, rates, and staffing — what should I model next?',
      );

    case 'suggested_modelling':
      return teammateExplore(
        'How should I use scenario modelling, previews, and firm goals together on this dashboard?',
      );

    case 'expense_rep':
    case 'expense_stacked_trend':
      return teammateExplore(
        'What expense and category trends matter here, and what should I ask Firm Intelligence to watch?',
      );

    case 'rev_target':
      return teammateExplore(
        'How am I tracking vs. revenue targets and what levers should I pull next?',
      );
    case 'revenue_streams_trend':
      return teammateExplore(
        'Break down revenue streams on this trend — where to focus billing or pipeline effort?',
      );
    case 'profitability_margin':
      return teammateExplore(
        'Interpret operating margin trend vs. revenue and OpEx — what actions improve the story?',
      );
    case 'billing_health':
      return teammateExplore(
        'What do WIP, billed vs. goal, and realization signals imply for next steps?',
      );
    case 'partner_realization':
      return teammateExplore(
        'Which partners are off realization target and what coaching or matter actions help?',
      );

    case 'financial_goals':
      return teammateExplore(
        'Connect firm financial goals on this view to concrete actions across cash, billing, and collections.',
      );

    case 'practice_areas':
      return teammateExplore(
        'How should I act on practice area revenue mix vs. firm goal targets?',
      );

    case 'collection_trends':
      return teammateExplore(
        'What do collection and DSO-style trends imply for cadence and client outreach?',
      );

    default:
      return { type: 'noop' };
  }
}

/**
 * Where-to-go steps for Clio Teammate Plan when the user taps a Firm Intelligence summary suggestion.
 */
export function getFinanceWidgetSummaryNavigateActions(
  widgetId: string,
  options?: { reportName?: string | null },
): FhoWorkflowAction[] {
  const rn = options?.reportName?.trim();

  const strategicTriplet: FhoWorkflowAction[] = [
    {
      id: 'fi-strat-1',
      label: 'Review this widget in Chart and Full modes',
      detail:
        'Confirm the latest month, overlays (scenario / peer), and narrative before you message partners or clients.',
    },
    {
      id: 'fi-strat-2',
      label: 'Open Financial Health Overview',
      detail:
        'Under Finances in the left nav, open Financial Health Overview to align cash, runway, and firm goals with what you see here.',
    },
    {
      id: 'fi-strat-3',
      label: 'Open Reports → Cash Flow Statement',
      detail:
        'Use Reports when you need transaction-level backup for leadership, lenders, or audit questions.',
    },
  ];

  switch (widgetId) {
    case 'embedded_report':
      return [
        {
          id: 'fi-er-1',
          label: rn ? `Open Reports and load “${rn}”` : 'Open Reports for this embedded report',
          detail:
            'From the left nav, go to Reports. Select the report, confirm period, basis, and entities, then reconcile large movements to billing and bank.',
        },
        {
          id: 'fi-er-2',
          label: 'Return to this Finances page',
          detail:
            'Compare the full report to the widgets on your page (cash, A/R, margin) so everyone hears one consistent story.',
        },
        {
          id: 'fi-er-3',
          label: 'Assign follow-ups in Clio Manage',
          detail:
            'Log owners and due dates for collections, reclasses, or write-offs so month-end stays exception-driven.',
        },
      ];

    case 'strat_cash':
    case 'strat_burn':
    case 'strat_runway':
    case 'runway':
      return strategicTriplet;

    case 'cash_flow':
      return [
        {
          id: 'fi-cf-1',
          label: 'Open Reports → Cash Flow Statement',
          detail: 'Validate the in/out story with line-level detail and period locks.',
        },
        {
          id: 'fi-cf-2',
          label: 'Open A/R aging and collection trends on Finances',
          detail: 'If outflows are winning, prioritize reminders and partner escalations on the riskiest buckets.',
        },
        {
          id: 'fi-cf-3',
          label: 'Use This Week’s Briefing',
          detail: 'When a briefing insight matches this trend, Take action or Explore data from the briefing strip.',
        },
      ];

    case 'ar_aging':
    case 'fho_ar_at_risk_detail':
      return [
        {
          id: 'fi-ar-1',
          label: 'Open Clio Manage → Billing',
          detail: 'Filter overdue invoices, send reminders, and note expected pay dates after each client touch.',
        },
        {
          id: 'fi-ar-2',
          label: 'Stay on Finances → Full view on this widget',
          detail: 'Use Full mode for bucket-level backup before partner outreach on large balances.',
        },
        {
          id: 'fi-ar-3',
          label: 'Check Financial Health → days-to-collect goal',
          detail: 'Confirm outreach cadence still matches the firm goal your leadership set.',
        },
      ];

    case 'collection_trends':
      return [
        {
          id: 'fi-ct-1',
          label: 'Pair with A/R aging on the same Finances page',
          detail: 'DSO and collections move together — confirm the same accounts drive both signals.',
        },
        {
          id: 'fi-ct-2',
          label: 'Open This Week’s Briefing',
          detail: 'Execute or explore a collections playbook insight when it aligns with this trend.',
        },
        {
          id: 'fi-ct-3',
          label: 'Open Reports → A/R or Aging as needed',
          detail: 'Drop to report detail when partners ask for defensible lists and amounts.',
        },
      ];

    case 'billing_health':
    case 'fho_unbilled_detail':
      return [
        {
          id: 'fi-bh-1',
          label: 'Open Clio Manage → Billing / Prebills',
          detail: 'Clear stale prebills and push invoices for matters with large aged WIP.',
        },
        {
          id: 'fi-bh-2',
          label: 'Open Partner realization widget on Finances',
          detail: 'Coaching on scope and write-downs often moves billed vs. goal faster than rate changes alone.',
        },
        {
          id: 'fi-bh-3',
          label: 'Reconcile to firm revenue goal',
          detail: 'Financial Health Overview shows goal context — tie weekly billing targets to that bar.',
        },
      ];

    case 'partner_realization':
      return [
        {
          id: 'fi-pr-1',
          label: 'Open matter lists for outlier partners',
          detail: 'In Manage, filter by responsible attorney and sort by write-downs or WIP age.',
        },
        {
          id: 'fi-pr-2',
          label: 'Use Billing health and unbilled WIP widgets',
          detail: 'Find matters leaking realization before you change rates or staffing.',
        },
        {
          id: 'fi-pr-3',
          label: 'Discuss in practice group meeting',
          detail: 'Share one aggregate chart and one concrete coaching ask per partner.',
        },
      ];

    case 'practice_areas':
      return [
        {
          id: 'fi-pa-1',
          label: 'Open Reports → Revenue by Practice Area',
          detail: 'Validate mix and totals against matter-level detail when leadership pushes back.',
        },
        {
          id: 'fi-pa-2',
          label: 'Open Revenue streams and Rev vs target widgets',
          detail: 'See whether mix, not just volume, explains the gap to plan.',
        },
        {
          id: 'fi-pa-3',
          label: 'Align BD spend to underweight areas',
          detail: 'Redirect pipeline effort where strategic goal mix is lightest.',
        },
      ];

    case 'expense_rep':
    case 'expense_stacked_trend':
      return [
        {
          id: 'fi-ex-1',
          label: 'Open Reports → Expense by Category',
          detail: 'Line-item review beats headline cuts — assign one owner per category over budget.',
        },
        {
          id: 'fi-ex-2',
          label: 'Open Operating margin widget',
          detail: 'Ensure expense narrative matches headline profitability before you message the partnership.',
        },
        {
          id: 'fi-ex-3',
          label: 'Defer discretionary spend if cash is tight',
          detail: 'Cross-check Operating cash and Runway widgets before approving new subscriptions or programs.',
        },
      ];

    case 'rev_target':
    case 'revenue_streams_trend':
      return [
        {
          id: 'fi-rev-1',
          label: 'Open Clio Manage → Billing pipeline',
          detail: 'Accelerate prebills and invoices for completed work; confirm coverage for the rest of the period.',
        },
        {
          id: 'fi-rev-2',
          label: 'Open P&L or Revenue reports',
          detail: 'Tie recognized revenue to billing timing when finance questions the gauge.',
        },
        {
          id: 'fi-rev-3',
          label: 'Review firm revenue goal on Financial Health',
          detail: 'Keep partner messaging aligned to the declared target window.',
        },
      ];

    case 'profitability_margin':
      return [
        {
          id: 'fi-pl-1',
          label: 'Split revenue vs. OpEx moves',
          detail: 'Use Revenue streams and Expense widgets to show partners one causal story.',
        },
        {
          id: 'fi-pl-2',
          label: 'Open Reports → Profit & Loss',
          detail: 'Month and category detail for committee packs and lender updates.',
        },
        {
          id: 'fi-pl-3',
          label: 'Assign owners before close',
          detail: 'Pair billing health and expense owners so margin fixes survive past this week.',
        },
      ];

    case 'fho_operating_cash_detail':
    case 'fho_runway_detail':
      return [
        {
          id: 'fi-fho-c-1',
          label: 'Walk the cash bridge in Full mode on this widget',
          detail: 'Line up inflows to billing and outflows to payroll, rent, and distributions.',
        },
        strategicTriplet[1]!,
        strategicTriplet[2]!,
      ];

    case 'fho_revenue_detail':
      return [
        {
          id: 'fi-fho-rv-1',
          label: 'Open Grow / pipeline views in Clio',
          detail: 'Confirm coverage for the quarter when recognized revenue is soft.',
        },
        {
          id: 'fi-fho-rv-2',
          label: 'Open Rev vs target and Practice areas widgets',
          detail: 'See whether mix explains the gap before you change rates.',
        },
        {
          id: 'fi-fho-rv-3',
          label: 'Use widget View suggestions for a full teammate workflow',
          detail: 'Footer View suggestions still open a broader plan alongside this suggestion.',
        },
      ];

    case 'fho_iolta_trust_detail':
      return [
        {
          id: 'fi-tr-1',
          label: 'Open trust reconciliation workspace',
          detail: 'Three-way match and attach supporting transfers for any variance before sign-off.',
        },
        {
          id: 'fi-tr-2',
          label: 'Review client-matter assignment on retainers',
          detail: 'Resolve compliance flags in Manage before moving cash narratives.',
        },
        {
          id: 'fi-tr-3',
          label: 'Never borrow from trust for operating shortfalls',
          detail: 'If operating cash is tight, fix separation and document — do not net across ledgers.',
        },
      ];

    case 'fho_firm_goals_detail':
      return [
        {
          id: 'fi-fg-1',
          label: 'Edit goals inline on this widget',
          detail: 'When strategy shifts, update targets so Firm Intelligence prioritizes the right alerts.',
        },
        {
          id: 'fi-fg-2',
          label: 'Open Financial Health Overview',
          detail: 'See linked widgets (cash, AR, runway) against the same goal strip.',
        },
        {
          id: 'fi-fg-3',
          label: 'Draft a partner update',
          detail: 'One paragraph per goal: status, risk, and the single decision you need.',
        },
      ];

    case 'ambient_cfo':
      return [
        {
          id: 'fi-am-1',
          label: 'Switch this widget to Full mode',
          detail: 'Read each insight with charts; assign an owner and due date on the one that moves a firm goal.',
        },
        {
          id: 'fi-am-2',
          label: 'Use Take action vs Explore data',
          detail: 'Take action opens execution paths; Explore opens backup charts before you decide.',
        },
        {
          id: 'fi-am-3',
          label: 'Cross-check Strategic Dashboard widgets',
          detail: 'Validate briefing claims against cash, runway, and margin on your Finances pages.',
        },
      ];

    case 'digital_twin':
    case 'suggested_modelling':
      return [
        {
          id: 'fi-mod-1',
          label: 'Use Modelling preview on this page',
          detail: 'Apply a scenario to strategic charts so leadership sees curves, not just tables.',
        },
        {
          id: 'fi-mod-2',
          label: 'Open Financial Goals to link a model',
          detail: 'When a scenario is approved, attach it so recommendations stay goal-aware.',
        },
        {
          id: 'fi-mod-3',
          label: 'Export narrative for the management meeting',
          detail: 'Pair twin output with Runway and Cash widgets so stress cases feel grounded.',
        },
      ];

    case 'financial_goals':
      return [
        {
          id: 'fi-fing-1',
          label: 'Open Financial Health Overview',
          detail: 'Same goal definitions as this widget — drill into linked KPIs and narratives.',
        },
        {
          id: 'fi-fing-2',
          label: 'Open Strategic Dashboard or custom Finances page',
          detail: 'See revenue, reserve, and collections context next to the goal bars.',
        },
        {
          id: 'fi-fing-3',
          label: 'Filter teammate and alerts through goals',
          detail: 'Declutter by fixing what moves these three bars, not random metrics.',
        },
      ];

    default:
      return [
        {
          id: 'fi-def-1',
          label: 'Use Chart and Full modes on this widget',
          detail: 'Confirm values and period before you take client or partner actions.',
        },
        strategicTriplet[1]!,
        {
          id: 'fi-def-3',
          label: 'Use View suggestions in the widget footer',
          detail: 'For a broader workflow, open the full Clio Teammate plan from View suggestions below.',
        },
      ];
  }
}

