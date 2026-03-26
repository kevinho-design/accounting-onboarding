/**
 * Plan content when the user clicks "Explore actions" on a Financial Health Overview widget.
 * Shown in Clio Teammate → Plan (not chat).
 */

export type FhoWorkflowActionCtaKind = 'toast' | 'none';

/** Shown after the user clicks Execute — what Firm Intelligence did (prototype). */
export type FhoExecuteOutcome = {
  summary: string;
  bullets: string[];
};

export type FhoWorkflowAction = {
  id: string;
  label: string;
  /** Body copy when the user expands or focuses this step */
  detail?: string;
  /** Optional per-action control (prototype: toast) */
  ctaLabel?: string;
  ctaKind?: FhoWorkflowActionCtaKind;
};

export type FhoWorkflowOption = {
  id: string;
  title: string;
  summary?: string;
  /** Ordered steps the user sees when they Explore this option */
  actions: FhoWorkflowAction[];
  /** Optional rich copy after Execute; otherwise `getExecuteOutcomeForOption` synthesizes from actions. */
  executeOutcome?: FhoExecuteOutcome;
};

export type FhoTeammatePlan = {
  title: string;
  /** Optional narrative before the workflow options */
  context?: string;
  options: FhoWorkflowOption[];
};

const PLANS: Record<string, FhoTeammatePlan> = {
  fho_firm_goals_detail: {
    title: 'Firm goals — actions Firm Intelligence can help with',
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
            detail: 'If strategy shifted, update the goal or timeline so Firm Intelligence prioritizes the right work.',
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
            detail: 'Keeps collections and Firm Intelligence aligned on expectations.',
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
          summary: 'Financial Goals were aligned so Firm Intelligence can prioritize collection alerts (prototype).',
          bullets: [
            'Synced days-to-collect intent with alert routing for at-risk AR (prototype).',
            'Drafted a suggested goal note if cash timing no longer matches the target (prototype).',
          ],
        },
        actions: [
          {
            id: 'ar8',
            label: 'Update days-to-collect or AR goal in Financial Goals',
            detail: 'Firm Intelligence will reprioritize alerts toward these accounts.',
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
            detail: 'So collections and Firm Intelligence stay aligned on what to chase first.',
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
};

export function getFhoTeammatePlan(widgetId: string): FhoTeammatePlan | null {
  return PLANS[widgetId] ?? null;
}

function truncateForOutcome(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

/** Resolves Execute result copy: explicit `executeOutcome` or FI-style bullets from `actions`. */
export function getExecuteOutcomeForOption(opt: FhoWorkflowOption): FhoExecuteOutcome {
  if (opt.executeOutcome) return opt.executeOutcome;
  const derived = opt.actions.slice(0, 4).map((a) =>
    a.detail
      ? `${truncateForOutcome(a.label, 56)} — ${truncateForOutcome(a.detail, 72)}`
      : `Completed automated step: ${truncateForOutcome(a.label, 100)}`,
  );
  const bullets =
    derived.length > 0
      ? derived
      : [`Ran the “${opt.title}” workflow against your firm data (prototype).`];
  return {
    summary: `Firm Intelligence finished the “${opt.title}” workflow on your behalf (prototype).`,
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
      parts.push(`• ${a.label}`);
    }
  }
  return parts.join('\n\n');
}
