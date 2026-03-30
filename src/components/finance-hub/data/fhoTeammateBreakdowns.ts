/**
 * Plan content when the user clicks "View suggestions" on a Financial Health Overview widget.
 * Shown in Clio Teammate → Plan (not chat).
 */

import {
  PAYROLL_SHORTFALL_EXCEPTION_DESCRIPTION,
  PAYROLL_SHORTFALL_EXCEPTION_TITLE,
} from './payrollShortfallExceptionCopy';

export type FhoWorkflowActionCtaKind = 'toast' | 'none';

/** Shown after the user clicks Execute — what Clio Accounting did (prototype). */
export type FhoExecuteOutcome = {
  summary: string;
  bullets: string[];
};

/** Simple numbered step (label + detail) in Plan → Workflows. */
export type FhoWorkflowNarrativeAction = {
  variant?: 'narrative';
  id: string;
  label: string;
  detail?: string;
  ctaLabel?: string;
  ctaKind?: FhoWorkflowActionCtaKind;
};

/** Interactive step: AI vs manual CTAs (e.g. Collection opportunities payroll plan). */
export type FhoWorkflowDualActionStep = {
  variant: 'dual_action';
  id: string;
  title: string;
  description: string;
  aiCta: string;
  manualCta: string;
  /** When set, secondary CTA opens this URL in a new tab (no prototype toast). */
  manualHref?: string;
};

export type FhoWorkflowOperatingTransferSourceAccount = {
  id: string;
  label: string;
  balanceDisplay: string;
};

/** Bank-style transfer: shortfall + source account + amount + single primary CTA (Capital Management payroll plan). */
export type FhoWorkflowOperatingTransferStep = {
  variant: 'operating_transfer';
  id: string;
  title: string;
  description: string;
  primaryCta: string;
  shortfallDisplay: string;
  /** Default amount in the amount field (dollars), e.g. 15700 for $15.7k gap */
  defaultTransferAmount: number;
  sourceAccounts: FhoWorkflowOperatingTransferSourceAccount[];
};

export type FhoWorkflowAction =
  | FhoWorkflowNarrativeAction
  | FhoWorkflowDualActionStep
  | FhoWorkflowOperatingTransferStep;

export function isFhoWorkflowDualAction(a: FhoWorkflowAction): a is FhoWorkflowDualActionStep {
  return a.variant === 'dual_action';
}

export function isFhoWorkflowOperatingTransfer(
  a: FhoWorkflowAction,
): a is FhoWorkflowOperatingTransferStep {
  return a.variant === 'operating_transfer';
}

export function isPlanWorkflowCardAction(a: FhoWorkflowAction): boolean {
  return isFhoWorkflowDualAction(a) || isFhoWorkflowOperatingTransfer(a);
}

export type FhoWorkflowOption = {
  id: string;
  title: string;
  summary?: string;
  /** Ordered steps the user sees when they Explore this option */
  actions: FhoWorkflowAction[];
  /** Optional rich copy after Execute; otherwise `getExecuteOutcomeForOption` synthesizes from actions. */
  executeOutcome?: FhoExecuteOutcome;
};

export type FhoTeammatePlanSummaryVariant = 'payroll_shortfall';

export type FhoTeammatePlan = {
  title: string;
  /** Optional narrative before the workflow options */
  context?: string;
  options: FhoWorkflowOption[];
  /** Plan tab summary chrome (e.g. match Today payroll exception). */
  planSummaryVariant?: FhoTeammatePlanSummaryVariant;
  /** Emphasized gap amount when `planSummaryVariant` is payroll_shortfall */
  shortfallAmountDisplay?: string;
};

const PLANS: Record<string, FhoTeammatePlan> = {
  fho_firm_goals_detail: {
    title: 'Firm goals — actions Clio Accounting can help with',
    options: [
      {
        id: 'review-strategy',
        title: 'Review at-risk goals vs. strategy',
        summary: 'Decide whether targets or timelines should move.',
        actions: [
          {
            id: 'a1',
            label: 'List goals marked at risk or behind pace',
            detail: 'Compare current trajectory to the declared target window.',
            ctaLabel: 'View goal strip',
            ctaKind: 'toast',
          },
          {
            id: 'a2',
            label: 'Confirm with leadership whether the goal still matches firm strategy',
            detail: 'If strategy shifted, update the goal or timeline so Clio Accounting prioritizes the right work.',
          },
        ],
      },
      {
        id: 'alerts-through-goals',
        title: 'See alerts through your goals lens',
        summary: 'Fix what moves the metric, not random noise.',
        actions: [
          {
            id: 'b1',
            label: 'Open alerts filtered by firm goals',
            detail: 'Surface collections, billing, and cash items tied to declared targets.',
            ctaLabel: 'Show goal-linked alerts',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'partner-note',
        title: 'Partner-ready summary',
        summary: 'A short narrative for your next leadership touchpoint.',
        actions: [
          {
            id: 'c1',
            label: 'Draft a partner note on goal status',
            detail: 'Plain-language status, risks, and one recommended decision per at-risk goal.',
            ctaLabel: 'Generate draft',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  fho_operating_cash_detail: {
    title: 'Operating cash — next steps',
    options: [
      {
        id: 'cash-bridge',
        title: 'Walk the cash bridge with your bookkeeper',
        summary: 'Billing vs. payroll timing vs. one-off items.',
        actions: [
          {
            id: 'o1',
            label: 'Reconcile inflows to billing and collections cadence',
            detail: 'Flag any large receipts or timing shifts vs. expectations.',
          },
          {
            id: 'o2',
            label: 'Map outflows to payroll, rent, and scheduled distributions',
            detail: 'Isolate one-off vs. recurring so the bridge tells a clear story.',
          },
        ],
      },
      {
        id: 'cash-flow-report',
        title: 'Transaction-level proof',
        summary: 'For management committee or audit questions.',
        actions: [
          {
            id: 'o3',
            label: 'Open the Cash Flow Statement',
            detail: 'Use line-level detail when stakeholders need evidence behind the headline.',
            ctaLabel: 'Open Cash Flow Statement',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'stress',
        title: 'Stress vs. policy reserve',
        summary: 'If you use scenario modelling.',
        actions: [
          {
            id: 'o4',
            label: 'Model a stress case for collections or billing slip',
            detail: 'Compare resulting cash to your policy reserve and discuss mitigations.',
            ctaLabel: 'Open scenario tools',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  fho_revenue_detail: {
    title: 'Revenue & pipeline — options',
    options: [
      {
        id: 'recognized-vs-target',
        title: 'Recognized revenue vs. target',
        summary: 'Practice mix and streams off trend.',
        actions: [
          {
            id: 'r1',
            label: 'Compare recognized revenue to goal and prior period',
            detail: 'Flag practice areas or matter types that diverge from plan.',
          },
          {
            id: 'r2',
            label: 'Note seasonality or one-off matters distorting the picture',
            detail: 'Adjust interpretation before changing strategy.',
          },
        ],
      },
      {
        id: 'grow-pipeline',
        title: 'Grow pipeline context',
        summary: 'Stages and next 60–90 days.',
        actions: [
          {
            id: 'r3',
            label: 'Review which pipeline stages moved',
            detail: 'Infer velocity and risk for revenue in the next two quarters.',
            ctaLabel: 'Open pipeline view',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'pnl',
        title: 'Account-level detail',
        summary: 'Behind the headline numbers.',
        actions: [
          {
            id: 'r4',
            label: 'Jump to Profit and Loss',
            detail: 'Drill to accounts when you need fee or expense detail.',
            ctaLabel: 'Open P&L',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  fho_ar_at_risk_detail: {
    title: 'AR at risk — you’re behind goal on collections',
    context:
      'Your AR at Risk KPI shows BEHIND GOAL with 60+ days overdue concentration (prototype: $73,700 in the aging table). Pick a workflow:',
    options: [
      {
        id: 'reminders-cadence',
        title: 'Reminders & cadence',
        summary: 'Aged buckets and partner escalation.',
        executeOutcome: {
          summary:
            'Reminders and escalation paths were queued for 60+ day balances using your firm rules (prototype).',
          bullets: [
            'Queued invoice reminders for matters in 60+ aging buckets with your default templates.',
            'Flagged repeat late payers for responsible-partner follow-up with matter-level context.',
            'Logged outreach timestamps on each matter for continuity (prototype).',
          ],
        },
        actions: [
          {
            id: 'ar1',
            label: 'Send aged-invoice reminders for matters in 60+ buckets',
            detail: 'Use firm templates; log outreach in the matter for continuity.',
            ctaLabel: 'Queue reminders',
            ctaKind: 'toast',
          },
          {
            id: 'ar2',
            label: 'Escalate repeat late payers to the responsible partner',
            detail: 'Fee conversations and relationship risk live with matter ownership.',
          },
        ],
      },
      {
        id: 'top-concentration',
        title: 'Top concentration',
        summary: 'Highest balance / highest days first.',
        executeOutcome: {
          summary: 'Collections focus was ranked by balance and days past due for targeted outreach (prototype).',
          bullets: [
            'Sorted open matters by balance and aging to build this week’s priority list.',
            'Prepared payment-plan placeholders where prior agreements existed (prototype).',
            'Attached one-line context per client for fee conversations (prototype).',
          ],
        },
        actions: [
          {
            id: 'ar3',
            label: 'Sort clients by balance and days past due',
            detail: 'One fee conversation or payment plan often unlocks follow-on collections.',
          },
          {
            id: 'ar4',
            label: 'Document agreed payment plans in billing settings',
            detail: 'Keeps collections and Clio Accounting aligned on expectations.',
            ctaLabel: 'Record payment plan',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'ar-aging-report',
        title: 'A/R Aging report',
        summary: 'Ledger-style breakout for finance.',
        executeOutcome: {
          summary: 'A/R Aging was refreshed so finance has current ledger-style detail (prototype).',
          bullets: [
            'Refreshed A/R Aging including 60+ concentration ($73,700 in prototype data).',
            'Generated a finance packet stub for posting or adjustments (prototype).',
            'Pinned the run to today’s close date for audit trail (prototype).',
          ],
        },
        actions: [
          {
            id: 'ar5',
            label: 'Open A/R Aging for full detail',
            detail: 'Use when finance needs to post, adjust, or reconcile.',
            ctaLabel: 'Open A/R Aging',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'policy-capital',
        title: 'Policy & collections path',
        summary: 'Write-offs, Clio Capital, external collections.',
        executeOutcome: {
          summary:
            'Write-off thresholds and recovery paths were evaluated against your policy and aged balances (prototype).',
          bullets: [
            'Cross-checked chronic balances against firm write-off thresholds.',
            'Surfaced Clio Capital vs. external collections fit by amount and history (prototype).',
            'Left a short recommendation list for partner sign-off (prototype).',
          ],
        },
        actions: [
          {
            id: 'ar6',
            label: 'Confirm write-off thresholds with policy',
            detail: 'Align with firm policy before clearing chronic small balances.',
          },
          {
            id: 'ar7',
            label: 'Decide Clio Capital vs. external collections for chronic balances',
            detail: 'Based on amount, client history, and recovery likelihood.',
            ctaLabel: 'Compare options',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'goal-link',
        title: 'Goal link',
        summary: 'Tighten days-to-collect in firm goals.',
        executeOutcome: {
          summary: 'Financial Goals were aligned so Clio Accounting can prioritize collection alerts (prototype).',
          bullets: [
            'Synced days-to-collect intent with alert routing for at-risk AR (prototype).',
            'Drafted a suggested goal note if cash timing no longer matches the target (prototype).',
          ],
        },
        actions: [
          {
            id: 'ar8',
            label: 'Update days-to-collect or AR goal in Financial Goals',
            detail: 'Clio Accounting will reprioritize alerts toward these accounts.',
            ctaLabel: 'Open Financial Goals',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  fho_runway_detail: {
    title: 'Runway — actions',
    options: [
      {
        id: 'compare-goal',
        title: 'Compare coverage to firm goal',
        summary: 'Hiring freeze vs. burn cuts.',
        actions: [
          {
            id: 'rw1',
            label: 'Read months of runway vs. stated target',
            detail: 'If behind, open strategic modelling to compare hiring freeze vs. burn reductions.',
            ctaLabel: 'Open modelling',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'strategic-dash',
        title: 'Strategic dashboard',
        summary: 'Cash, burn, and runway on one timeline.',
        actions: [
          {
            id: 'rw2',
            label: 'Review cash, burn, and runway together',
            detail: 'Single timeline reduces conflicting narratives in committee prep.',
            ctaLabel: 'Open strategic dashboard',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'narrative',
        title: 'Management committee narrative',
        summary: 'Runway vs. peers when enabled.',
        actions: [
          {
            id: 'rw3',
            label: 'Ask for a committee-ready narrative',
            detail: 'Runway vs. policy, key risks, and one recommended decision.',
            ctaLabel: 'Draft narrative',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  fho_iolta_trust_detail: {
    title: 'IOLTA & trust — actions',
    options: [
      {
        id: 'three-way',
        title: 'Three-way match before close',
        summary: 'Bank, ledger, and client ledgers.',
        actions: [
          {
            id: 't1',
            label: 'Run three-way match for trust accounts',
            detail: 'Attach supporting transfers if any variance appears.',
            ctaLabel: 'Start three-way match',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'separation',
        title: 'Trust vs. operating separation',
        summary: 'Before compliance sign-off.',
        actions: [
          {
            id: 't2',
            label: 'Confirm narrative alerts show clean separation',
            detail: 'Resolve any mis-posted operating vs. trust items.',
          },
        ],
      },
      {
        id: 'bookkeeper',
        title: 'Bookkeeper checklist',
        summary: 'Cadence and client ledgers.',
        actions: [
          {
            id: 't3',
            label: 'Pair on reconciliation cadence and client ledger review',
            detail: 'Close checklist: unmatched items, stale balances, and documentation.',
          },
        ],
      },
    ],
  },
  fho_unbilled_detail: {
    title: 'Unbilled WIP — actions',
    options: [
      {
        id: 'rank-wip',
        title: 'Rank by aging WIP',
        summary: 'Near-term cash and write-off risk.',
        actions: [
          {
            id: 'u1',
            label: 'Sort matters by aging unbilled WIP',
            detail: 'Prioritize invoices that improve near-term cash and reduce write-off risk.',
            ctaLabel: 'View WIP ranking',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'goals-align',
        title: 'Align with collection goals',
        summary: 'Keep reminders goal-linked.',
        actions: [
          {
            id: 'u2',
            label: 'Tie high WIP matters to collection goals on the firm goals strip',
            detail: 'So collections and Clio Accounting stay aligned on what to chase first.',
            ctaLabel: 'Open firm goals',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'billing-health',
        title: 'Billing health & P&L',
        summary: 'Fee and realization detail.',
        actions: [
          {
            id: 'u3',
            label: 'Use billing health or P&L for realization detail',
            detail: 'When the WIP story needs fee-level backup.',
            ctaLabel: 'Open P&L',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },

  strat_cash: {
    title: 'Operating cash — strategic view',
    context: 'Scenario modelling overlays and goal context on the Strategic Dashboard.',
    options: [
      {
        id: 'sc-1',
        title: 'Reconcile cash vs. billing cadence',
        summary: 'Projected cash should tie to collections and known outflows.',
        actions: [
          {
            id: 'sc-1a',
            label: 'Compare projected cash to last-month actuals',
            detail: 'Flag timing shifts (payroll, rent, distributions) that explain variance.',
            ctaLabel: 'View variance note',
            ctaKind: 'toast',
          },
          {
            id: 'sc-1b',
            label: 'Overlay active scenario model if preview is on',
            detail: 'Confirm which stress case leadership is looking at.',
          },
        ],
      },
      {
        id: 'sc-2',
        title: 'Committee-ready takeaway',
        summary: 'One sentence on cushion vs. goal.',
        actions: [
          {
            id: 'sc-2a',
            label: 'Draft a one-line cash posture for leadership',
            detail: 'Cushion vs. policy, one risk, one decision.',
            ctaLabel: 'Draft takeaway',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  strat_burn: {
    title: 'Operating burn — strategic view',
    context: 'Monthly burn with modelling overlay when a scenario is selected.',
    options: [
      {
        id: 'sb-1',
        title: 'Tighten or explain burn spikes',
        summary: 'Separate recurring vs. one-off drivers.',
        actions: [
          {
            id: 'sb-1a',
            label: 'List top three expense drivers vs. prior month',
            detail: 'So the burn story is defensible in partner conversation.',
          },
          {
            id: 'sb-1b',
            label: 'Pair burn trend with runway widget',
            detail: 'Burn + runway together avoids conflicting narratives.',
            ctaLabel: 'Open runway context',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'sb-2',
        title: 'Scenario check',
        summary: 'If modelling preview is active.',
        actions: [
          {
            id: 'sb-2a',
            label: 'Confirm which scenario assumptions moved burn',
            detail: 'Headcount, rates, or OpEx — single owner per assumption.',
          },
        ],
      },
    ],
  },
  strat_runway: {
    title: 'Runway — strategic view',
    context: 'Months of runway with optional digital-twin / modelling context.',
    options: [
      {
        id: 'sr-1',
        title: 'Runway vs. firm policy',
        summary: 'Policy buffer and triggers.',
        actions: [
          {
            id: 'sr-1a',
            label: 'Compare runway months to declared cash-reserve goal',
            detail: 'If below policy, list top three cash levers (collect, defer, reduce).',
          },
        ],
      },
      {
        id: 'sr-2',
        title: 'Stress path',
        summary: 'Before leadership asks “what if.”',
        actions: [
          {
            id: 'sr-2a',
            label: 'Outline a lightweight stress (e.g. delayed collections)',
            detail: 'Use Digital Twin or modelling when you need numeric proof.',
            ctaLabel: 'Open scenario ideas',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  runway: {
    title: 'Runway trend — chart',
    context: 'Six-month (or similar) runway trajectory on a custom or default page.',
    options: [
      {
        id: 'rw-ch-1',
        title: 'Explain the slope',
        summary: 'Improvement vs. deterioration.',
        actions: [
          {
            id: 'rw-ch-1a',
            label: 'Narrate what changed month over month',
            detail: 'Tie to billing, collections, or expense events you already see elsewhere.',
          },
        ],
      },
      {
        id: 'rw-ch-2',
        title: 'Next step',
        summary: 'If the trend turns down.',
        actions: [
          {
            id: 'rw-ch-2a',
            label: 'Recommend one cash or collection action for this week',
            detail: 'Goal-linked where possible.',
            ctaLabel: 'Suggest action',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  cash_flow: {
    title: 'Cash flow chart — actions',
    context: 'Operating cash flow vs. target.',
    options: [
      {
        id: 'cf-1',
        title: 'Close the gap to target',
        summary: 'When actuals trail the line.',
        actions: [
          {
            id: 'cf-1a',
            label: 'Identify whether gap is timing vs. structural',
            detail: 'Timing: payroll or client payment dates. Structural: run rate.',
          },
        ],
      },
      {
        id: 'cf-2',
        title: 'Report drill-down',
        summary: 'When you need proof.',
        actions: [
          {
            id: 'cf-2a',
            label: 'Use Cash Flow Statement for transaction-level backup',
            detail: 'For committee or lender questions.',
            ctaLabel: 'Open cash flow report',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  profitability_margin: {
    title: 'Operating margin — actions',
    context: 'Revenue vs. OpEx and margin % trend.',
    options: [
      {
        id: 'pm-1',
        title: 'Margin movers',
        summary: 'Revenue dip vs. expense creep.',
        actions: [
          {
            id: 'pm-1a',
            label: 'Split the last move in margin between revenue and OpEx',
            detail: 'So partners hear a single causal story.',
          },
        ],
      },
      {
        id: 'pm-2',
        title: 'P&L backup',
        summary: 'Fee and category detail.',
        actions: [
          {
            id: 'pm-2a',
            label: 'Open Profit and Loss for category-level follow-up',
            detail: 'Align with billing health and expense widgets when needed.',
            ctaLabel: 'Open P&L',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  ar_aging: {
    title: 'A/R aging — collections actions',
    options: [
      {
        id: 'ar-1',
        title: 'Prioritize buckets',
        summary: '60+ and 90+ first.',
        actions: [
          {
            id: 'ar-1a',
            label: 'List top clients by overdue balance',
            detail: 'Match tone and cadence to historical payment behavior.',
          },
        ],
      },
      {
        id: 'ar-2',
        title: 'Playbook',
        summary: 'Reminders, plans, escalation.',
        actions: [
          {
            id: 'ar-2a',
            label: 'Draft a collections cadence for the worst bucket',
            detail: 'Include partner touchpoints for sensitive matters.',
            ctaLabel: 'Draft cadence',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  ambient_cfo: {
    title: "This Week's Briefing — explore",
    context: 'Automated insights surfaced on the dashboard.',
    options: [
      {
        id: 'acf-1',
        title: 'Take action on a highlighted insight',
        summary: 'Execute or delegate from the briefing card.',
        actions: [
          {
            id: 'acf-1a',
            label: 'Pick one insight and confirm owner + due date',
            detail: 'Keeps the briefing from becoming background noise.',
            ctaLabel: 'Mark in briefing',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'acf-2',
        title: 'Explore data behind an insight',
        summary: 'Deeper context before deciding.',
        actions: [
          {
            id: 'acf-2a',
            label: 'Open the related chart or report from the insight',
            detail: 'Use Explore on the briefing row where available.',
          },
        ],
      },
    ],
  },
  digital_twin: {
    title: 'Digital Twin — scenarios',
    options: [
      {
        id: 'dt-1',
        title: 'Run a leadership scenario',
        summary: 'Staffing, rates, or runway.',
        actions: [
          {
            id: 'dt-1a',
            label: 'Pick one scenario preset and read the runway impact',
            detail: 'Use as input to partner discussion, not as final policy.',
          },
        ],
      },
      {
        id: 'dt-2',
        title: 'Compare to live strategic charts',
        summary: 'Twin vs. actuals.',
        actions: [
          {
            id: 'dt-2a',
            label: 'Note deltas between twin output and strat_cash / strat_runway',
            detail: 'Resolve conflicts before presenting upward.',
            ctaLabel: 'Compare summary',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  suggested_modelling: {
    title: 'Suggested modelling — next steps',
    context: 'Scenario models, previews on charts, and linking to firm goals.',
    options: [
      {
        id: 'sm-1',
        title: 'Build or refine a model',
        summary: 'From a stated stress or opportunity.',
        actions: [
          {
            id: 'sm-1a',
            label: 'Create a named model from a concrete question',
            detail: 'Example: payroll shortfall, rate increase, two seniors leave.',
            ctaLabel: 'Open create flow',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'sm-2',
        title: 'Link to goals',
        summary: 'After the model looks right.',
        actions: [
          {
            id: 'sm-2a',
            label: 'Add the model to Financial Goals when leadership agrees',
            detail: 'So Clio Accounting prioritizes recommendations through that lens.',
          },
        ],
      },
    ],
  },
  expense_rep: {
    title: 'Expense breakdown — actions',
    options: [
      {
        id: 'er-1',
        title: 'Category focus',
        summary: 'Largest movers.',
        actions: [
          {
            id: 'er-1a',
            label: 'Name the top two categories vs. budget or prior period',
            detail: 'Decide investigate vs. accept.',
          },
        ],
      },
      {
        id: 'er-2',
        title: 'Report depth',
        actions: [
          {
            id: 'er-2a',
            label: 'Open Expense by Category for line detail',
            detail: 'When the chart raises questions.',
            ctaLabel: 'Open expense report',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  expense_stacked_trend: {
    title: 'Expenses over time — actions',
    options: [
      {
        id: 'est-1',
        title: 'Trend narrative',
        summary: 'Stacked months.',
        actions: [
          {
            id: 'est-1a',
            label: 'Describe which layers grew or shrank last month',
            detail: 'Tie to hiring, vendors, or one-offs.',
          },
        ],
      },
      {
        id: 'est-2',
        title: 'Follow-up',
        actions: [
          {
            id: 'est-2a',
            label: 'Set a watch on a category if it crossed a threshold',
            detail: 'Optional alert for next close.',
            ctaLabel: 'Set watch',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  rev_target: {
    title: 'Revenue target — actions',
    options: [
      {
        id: 'rt-1',
        title: 'Gap to goal',
        summary: 'Quarter or period.',
        actions: [
          {
            id: 'rt-1a',
            label: 'Quantify remaining gap and weeks left in period',
            detail: 'Convert to needed run rate or pipeline.',
          },
        ],
      },
      {
        id: 'rt-2',
        title: 'Levers',
        actions: [
          {
            id: 'rt-2a',
            label: 'List billing, rates, and matter mix levers',
            detail: 'One recommended focus for partners this week.',
            ctaLabel: 'Summarize levers',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  revenue_streams_trend: {
    title: 'Revenue streams — actions',
    options: [
      {
        id: 'rst-1',
        title: 'Stream balance',
        summary: 'Hourly vs. flat vs. other.',
        actions: [
          {
            id: 'rst-1a',
            label: 'Call out which stream diverged from firm strategy mix',
            detail: 'Align with practice area and goals widgets.',
          },
        ],
      },
      {
        id: 'rst-2',
        title: 'P&L tie-out',
        actions: [
          {
            id: 'rst-2a',
            label: 'Use P&L for recognized revenue detail',
            detail: 'When the stream chart needs backup.',
            ctaLabel: 'Open P&L',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  billing_health: {
    title: 'Billing health — actions',
    options: [
      {
        id: 'bh-1',
        title: 'WIP and realization',
        summary: 'Signals in one place.',
        actions: [
          {
            id: 'bh-1a',
            label: 'Identify matters with high WIP and stale billing',
            detail: 'Prioritize invoices that improve cash and reduce write-off risk.',
          },
        ],
      },
      {
        id: 'bh-2',
        title: 'Partner loop',
        actions: [
          {
            id: 'bh-2a',
            label: 'Share one billing-health takeaway with responsible partners',
            detail: 'Keep it to one metric and one ask.',
            ctaLabel: 'Draft note',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  partner_realization: {
    title: 'Partner realization — actions',
    options: [
      {
        id: 'pr-1',
        title: 'Below-target partners',
        summary: 'Coaching before write-downs stack.',
        actions: [
          {
            id: 'pr-1a',
            label: 'List partners under realization target with matter examples',
            detail: 'Focus on fixable patterns (scope, rates, write-offs).',
          },
        ],
      },
      {
        id: 'pr-2',
        title: 'Positive reinforcement',
        actions: [
          {
            id: 'pr-2a',
            label: 'Highlight partners at or above target',
            detail: 'Use in practice group or comp conversations.',
            ctaLabel: 'Summarize leaders',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  financial_goals: {
    title: 'Firm goals — dashboard strip',
    context: 'Net revenue, days to collect, cash reserve — how Clio Accounting filters work.',
    options: [
      {
        id: 'fg-1',
        title: 'Refresh goal relevance',
        summary: 'Strategy vs. targets.',
        actions: [
          {
            id: 'fg-1a',
            label: 'Confirm each goal still matches leadership priorities',
            detail: 'Update timelines or targets if the firm’s strategy moved.',
          },
        ],
      },
      {
        id: 'fg-2',
        title: 'Deep dive',
        actions: [
          {
            id: 'fg-2a',
            label: 'Open Financial Health Overview for goal detail widgets',
            detail: 'Same goals, richer narratives and drill-downs.',
            ctaLabel: 'Go to FHO',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  practice_areas: {
    title: 'Practice areas — actions',
    options: [
      {
        id: 'pa-1',
        title: 'Mix vs. goal',
        summary: 'Revenue concentration.',
        actions: [
          {
            id: 'pa-1a',
            label: 'Flag practice areas over or under firm target mix',
            detail: 'Decide growth vs. capacity vs. pricing.',
          },
        ],
      },
      {
        id: 'pa-2',
        title: 'Report backup',
        actions: [
          {
            id: 'pa-2a',
            label: 'Open Revenue by Practice Area report',
            detail: 'Matter- or timekeeper-level when needed.',
            ctaLabel: 'Open report',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  collection_trends: {
    title: 'Collection trends — actions',
    options: [
      {
        id: 'ct-1',
        title: 'DSO-style trend',
        summary: 'Improving or slipping.',
        actions: [
          {
            id: 'ct-1a',
            label: 'Narrate the last three months in one sentence',
            detail: 'Connect to AR aging and goals.',
          },
        ],
      },
      {
        id: 'ct-2',
        title: 'Cash flow link',
        actions: [
          {
            id: 'ct-2a',
            label: 'Tie collection trend to operating cash outlook',
            detail: 'Use Cash Flow Statement if leadership wants proof.',
            ctaLabel: 'Open cash flow report',
            ctaKind: 'toast',
          },
        ],
      },
    ],
  },
  embedded_report: {
    title: 'Embedded report — next steps',
    context: 'Full report lives in Reports; this tile is a snapshot.',
    options: [
      {
        id: 'emb-1',
        title: 'Validate the snapshot',
        summary: 'Before acting on numbers.',
        actions: [
          {
            id: 'emb-1a',
            label: 'Open the full report for filters and drill-down',
            detail: 'Confirm period, basis, and any excluded entities.',
            ctaLabel: 'Open full report',
            ctaKind: 'toast',
          },
        ],
      },
      {
        id: 'emb-2',
        title: 'Turn insight into action',
        actions: [
          {
            id: 'emb-2a',
            label: 'Ask Clio Accounting for recommended follow-ups',
            detail: 'Use Chat on the same topic after you have the full picture.',
          },
        ],
      },
    ],
  },
  payroll_shortfall_gap_plan: {
    title: PAYROLL_SHORTFALL_EXCEPTION_TITLE,
    context: PAYROLL_SHORTFALL_EXCEPTION_DESCRIPTION,
    planSummaryVariant: 'payroll_shortfall',
    shortfallAmountDisplay: '$15,700',
    options: [
      {
        id: 'payroll-collection-opportunities',
        title: 'Collection Opportunities',
        summary: 'Pull forward cash through accelerated billing and collections before adding financing cost.',
        actions: [
          {
            variant: 'dual_action',
            id: 'payroll-col-ai-triage',
            title: 'Bill Reminders',
            description:
              'Isolate and contact past-due clients who have stored payment methods and no active dispute flags.',
            aiCta: 'Triage and Send',
            manualCta: 'Review Eligible Accounts',
          },
          {
            variant: 'dual_action',
            id: 'payroll-col-trust-sweep',
            title: 'Trust Account Sweep',
            description:
              'Reconcile ledgers and instantly transfer all legally earned fees from client Trust accounts to the Operating account.',
            aiCta: 'Sweep',
            manualCta: 'Go to Trust Ledger',
          },
          {
            variant: 'dual_action',
            id: 'payroll-col-wip-liquidation',
            title: 'WIP Liquidation',
            description:
              'Generate and issue interim invoices for matters with high unbilled Work-In-Progress and strong payment histories.',
            aiCta: 'Draft and Issue Invoices',
            manualCta: 'View Unbilled WIP',
          },
          {
            variant: 'dual_action',
            id: 'payroll-col-partial-pay',
            title: 'Offer Payment Plans',
            description:
              'Offer structured payment plans to delinquent accounts that require an immediate, same-day down payment to activate.',
            aiCta: 'Send Plan Offers',
            manualCta: 'Configure Payment Plans',
          },
        ],
      },
      {
        id: 'payroll-external-financing',
        title: 'External Financing',
        summary:
          'Clio Capital offers fast, flexible financing for eligible firms on Clio Payments—check the Capital page in Manage when you need cash for payroll.',
        actions: [
          {
            variant: 'dual_action',
            id: 'payroll-ex-clio-capital',
            title: 'Clio Capital financing',
            description:
              'Pre-qualification is based on your Clio Payments volume and history. On the Capital page in Clio Manage (administrators), review any offer, choose an amount sized to your payroll shortfall with terms and flat fee shown upfront, and—if approved—receive funds into your operating account in as little as two business days. Repayment is a fixed weekly debit from operating; Clio Accounting can surface eligibility signals and a recommended amount for this gap (prototype).',
            aiCta: 'Pre-check eligibility & amount',
            manualCta: 'Read more about Clio Capital',
            manualHref: 'https://www.clio.com/features/payments/law-firm-financing/',
          },
        ],
      },
      {
        id: 'payroll-capital-mgmt',
        title: 'Capital Management',
        summary:
          'Move cash from another firm account into Operating so payroll can clear—pick the source account and amount like a bank transfer (prototype).',
        actions: [
          {
            variant: 'operating_transfer',
            id: 'payroll-cm-operating-transfer',
            title: 'Transfer funds to Operating',
            description:
              'Payroll draws from your Operating account. Transfer from any other linked firm account into Operating to cover the projected shortfall. Adjust the amount if you only need part of the gap covered.',
            primaryCta: 'Transfer to cover shortfall',
            shortfallDisplay: '$15,700',
            defaultTransferAmount: 15700,
            sourceAccounts: [
              { id: 'iolta-reserve', label: 'IOLTA — fee reserve', balanceDisplay: '$42,180.00' },
              { id: 'tax-reserve', label: 'Tax withholding reserve', balanceDisplay: '$28,400.00' },
              { id: 'secondary-ops', label: 'Secondary operating (sweep)', balanceDisplay: '$19,250.00' },
              { id: 'rainy-day', label: 'Rainy-day money market', balanceDisplay: '$65,000.00' },
            ],
          },
        ],
      },
    ],
  },
};

/** Clio Teammate → Plan when user chooses View suggestions / Take action on payroll shortfall (any entry point). */
export function getPayrollShortfallTeammatePlan(): FhoTeammatePlan {
  return PLANS.payroll_shortfall_gap_plan;
}

export function getFhoTeammatePlan(widgetId: string): FhoTeammatePlan | null {
  return PLANS[widgetId] ?? null;
}

function truncateForOutcome(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

/** Resolves Execute result copy: explicit `executeOutcome` or FI-style bullets from `actions`. */
function actionLineForOutcome(a: FhoWorkflowAction): string {
  if (isFhoWorkflowDualAction(a)) {
    return a.description
      ? `${truncateForOutcome(a.title, 56)} — ${truncateForOutcome(a.description, 72)}`
      : `Completed automated step: ${truncateForOutcome(a.title, 100)}`;
  }
  if (isFhoWorkflowOperatingTransfer(a)) {
    return a.description
      ? `${truncateForOutcome(a.title, 56)} — ${truncateForOutcome(a.description, 72)}`
      : `Transfer toward shortfall ${a.shortfallDisplay}`;
  }
  return a.detail
    ? `${truncateForOutcome(a.label, 56)} — ${truncateForOutcome(a.detail, 72)}`
    : `Completed automated step: ${truncateForOutcome(a.label, 100)}`;
}

export function getExecuteOutcomeForOption(opt: FhoWorkflowOption): FhoExecuteOutcome {
  if (opt.executeOutcome) return opt.executeOutcome;
  const derived = opt.actions.slice(0, 4).map(actionLineForOutcome);
  const bullets =
    derived.length > 0
      ? derived
      : [`Ran the “${opt.title}” workflow against your firm data (prototype).`];
  return {
    summary: `Clio Accounting finished the “${opt.title}” workflow on your behalf (prototype).`,
    bullets,
  };
}

/** Legacy single-string form (e.g. if needed elsewhere). */
export function getFhoTeammateBreakdown(widgetId: string): string | null {
  const p = getFhoTeammatePlan(widgetId);
  if (!p) return null;
  const parts: string[] = [p.title, ...(p.context ? [p.context] : [])];
  for (const opt of p.options) {
    parts.push(opt.title);
    for (const a of opt.actions) {
      parts.push(
        `• ${isFhoWorkflowDualAction(a) || isFhoWorkflowOperatingTransfer(a) ? a.title : a.label}`,
      );
    }
  }
  return parts.join('\n\n');
}
