/**
 * View-model for the Modelling "Explore" side panel (scenario plan + results + alternatives).
 */

export type ModellingExplorePhase = {
  title: string;
  body: string;
  ctaHint?: string;
};

export type ModellingExploreResultRow = {
  label: string;
  pct: number;
  amt: string;
};

export type ModellingExploreAlternative = {
  id: string;
  name: string;
  blurb: string;
  riskTag: string;
};

export type PayrollProblemSurface = {
  daysUntilPayroll: number;
  payrollAmount: number;
  operatingBalance: number;
  shortfall: number;
  payrollDueLabel: string;
  narrative: string;
};

export type PayrollResolutionOption = {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  impactTag: string;
  meta?: string;
};

export type PayrollResolutionGroup = {
  id: string;
  title: string;
  subtitle: string;
  options: PayrollResolutionOption[];
};

export type PayrollTransferAccount = {
  id: string;
  name: string;
  balance: number;
};

export type ModellingExplorePanelViewModel = {
  title: string;
  subtitle: string;
  phases: ModellingExplorePhase[];
  modelHeadline: string;
  confidenceLabel: string;
  modelRows: ModellingExploreResultRow[];
  alternatives: ModellingExploreAlternative[];
  problemSurface?: PayrollProblemSurface;
  resolutionGroups?: PayrollResolutionGroup[];
  transferAccounts?: PayrollTransferAccount[];
  transferDefaultAmount?: number;
};

/** Minimal model shape for building panel content (matches FinancialScenarioModel in App). */
export type ModellingExploreModelInput = {
  id: string;
  name: string;
  description: string;
  impact: { month: string; altCash: number; altBurn: number; altRunway: number }[];
  aiAnalysis: { trend: string; insight: string; confidence: string };
  goalImpactAnalysis: string;
  recommendedActions: { text: string; type: string; target?: string; actionName?: string }[];
};

function fmtCash(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}

function runwayRiskTag(lastRunway: number, refRunway: number): string {
  if (lastRunway >= refRunway + 2) return 'Lower risk';
  if (lastRunway <= refRunway - 3) return 'Higher risk';
  return 'Comparable risk';
}

/**
 * Build panel content for the active scenario plus sibling models as alternatives.
 */
export function buildModellingExplorePanelContent(
  active: ModellingExploreModelInput,
  allModels: ModellingExploreModelInput[],
): ModellingExplorePanelViewModel {
  const rows = active.impact;
  const first = rows[0];
  const last = rows[rows.length - 1];
  const peakBurn = rows.reduce((m, r) => Math.max(m, r.altBurn), 0);
  const runwayDelta =
    first && last ? Number((last.altRunway - first.altRunway).toFixed(1)) : 0;

  const runwayPct = last ? Math.min(100, Math.max(8, Math.round((last.altRunway / 28) * 100))) : 50;
  const cashPct = last
    ? Math.min(100, Math.max(10, Math.round((last.altCash / 1_400_000) * 100)))
    : 50;
  const burnPct = peakBurn ? Math.min(100, Math.max(15, Math.round((peakBurn / 75_000) * 100))) : 50;

  const modelRows: ModellingExploreResultRow[] = [];
  if (last) {
    modelRows.push({
      label: `Runway (${last.month})`,
      pct: runwayPct,
      amt: `${last.altRunway} mo${runwayDelta !== 0 ? ` (${runwayDelta > 0 ? '+' : ''}${runwayDelta} vs start)` : ''}`,
    });
    modelRows.push({
      label: `Cash (${last.month})`,
      pct: cashPct,
      amt: fmtCash(last.altCash),
    });
  }
  modelRows.push({
    label: 'Peak monthly burn (horizon)',
    pct: burnPct,
    amt: `${fmtCash(peakBurn)}/mo`,
  });

  const actionPhases: ModellingExplorePhase[] = active.recommendedActions.map((a, i) => ({
    title: `Step ${i + 1}`,
    body: a.text,
    ctaHint:
      a.type === 'navigate' && a.target
        ? `Prototype: go to ${a.target}`
        : a.type === 'action' && a.actionName
          ? a.actionName
          : undefined,
  }));

  const phases: ModellingExplorePhase[] = [
    {
      title: 'How we read this scenario',
      body: active.aiAnalysis.insight,
      ctaHint: active.description,
    },
    {
      title: 'Trend signal',
      body: active.aiAnalysis.trend,
    },
    {
      title: 'Firm goals lens',
      body: active.goalImpactAnalysis,
    },
    ...actionPhases,
  ];

  const refRunway = last?.altRunway ?? 18;
  const alternatives: ModellingExploreAlternative[] = allModels
    .filter((m) => m.id !== active.id)
    .map((m) => {
      const mLast = m.impact[m.impact.length - 1];
      const rw = mLast?.altRunway ?? refRunway;
      return {
        id: m.id,
        name: m.name,
        blurb: m.description,
        riskTag: runwayRiskTag(rw, refRunway),
      };
    });

  if (active.id === 'payroll_shortfall') {
    const payrollAmount = 47_200;
    const operatingBalance = 31_500;
    const shortfall = payrollAmount - operatingBalance;
    const transferDefaultAmount = shortfall;
    const transferAccounts: PayrollTransferAccount[] = [
      { id: 'reserve', name: 'Reserve Account', balance: 28_600 },
      { id: 'savings', name: 'Business Savings', balance: 19_800 },
      { id: 'trust_operating_cleared', name: 'Trust (cleared transfer)', balance: 17_400 },
    ];
    const resolutionGroups: PayrollResolutionGroup[] = [
      {
        id: 'internal_liquidity',
        title: 'Internal Liquidity Levers',
        subtitle: 'Lowest cost, highest effort. Recommended first.',
        options: [
          {
            id: 'accelerated_billing',
            title: 'Accelerated Billing (WIP Liquidation)',
            description:
              'Generate and send draft invoices for all unbilled Work-in-Progress (WIP) that has crossed a billing threshold.',
            ctaLabel: 'Generate Draft Invoices',
            impactTag: '+$22,000 potential | 5-10 day collection window',
            meta: '~$22,000 in billable WIP ready to invoice',
          },
          {
            id: 'ar_nudge',
            title: 'A/R Nudge Campaign',
            description:
              'Send automated email/SMS reminders to clients with invoices 15+ days past due with a temporary 2% early-payment discount.',
            ctaLabel: 'Send Nudge Campaign',
            impactTag: '+$18,000 potential | 2-5 day collection window',
            meta: '6 invoices | $18,400 overdue',
          },
          {
            id: 'expense_deferral',
            title: 'Expense Deferral',
            description:
              'Identify non-essential Accounts Payable and push those payments back 14 days to preserve immediate cash.',
            ctaLabel: 'Defer Selected Expenses',
            impactTag: '+$4,200 cash preserved | 0 days',
            meta: '$4,200 in deferrable expenses',
          },
        ],
      },
      {
        id: 'external_financing',
        title: 'External Financing',
        subtitle: 'Immediate resolution. Interest cost applies.',
        options: [
          {
            id: 'loc_draw',
            title: 'Draw on Line of Credit (Clio Capital)',
            description:
              'Initiate a one-click transfer of the exact shortfall amount from your firm Line of Credit via Clio Capital.',
            ctaLabel: 'Draw $15,700 from LOC',
            impactTag: '+$15,700 | Same-day | Est. interest: ~$78',
            meta: 'LOC available: $82,000',
          },
        ],
      },
      {
        id: 'capital_management',
        title: 'Capital Management',
        subtitle: 'Zero cost if internal funds are available.',
        options: [
          {
            id: 'inter_account_transfer',
            title: 'Inter-Account Transfer',
            description:
              'Transfer funds from another firm account (Trust, Savings, or Reserve) with sufficient balance into Operating.',
            ctaLabel: 'Transfer to Operating Account',
            impactTag: '+$15,700 | Instant',
            meta: 'Select source account and confirm transfer amount',
          },
        ],
      },
    ];

    return {
      title: active.name,
      subtitle: 'Scenario plan · payroll shortfall resolution',
      phases,
      modelHeadline: 'Modelled results (horizon)',
      confidenceLabel: active.aiAnalysis.confidence,
      modelRows,
      alternatives,
      problemSurface: {
        daysUntilPayroll: 3,
        payrollAmount,
        operatingBalance,
        shortfall,
        payrollDueLabel: 'Payroll due in 3 days',
        narrative:
          'Your Operating Account will be short by $15,700 when payroll processes on Friday. Here are your options to close the gap.',
      },
      resolutionGroups,
      transferAccounts,
      transferDefaultAmount,
    };
  }

  return {
    title: active.name,
    subtitle: 'Scenario plan · modelled outcomes',
    phases,
    modelHeadline: 'Modelled results (horizon)',
    confidenceLabel: active.aiAnalysis.confidence,
    modelRows,
    alternatives,
  };
}
