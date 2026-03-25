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

export type ModellingExplorePanelViewModel = {
  title: string;
  subtitle: string;
  phases: ModellingExplorePhase[];
  modelHeadline: string;
  confidenceLabel: string;
  modelRows: ModellingExploreResultRow[];
  alternatives: ModellingExploreAlternative[];
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
