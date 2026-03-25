import type { BriefingFinancialSnapshot } from './briefingFinancialImpact';
import type { StrategicMonthRow } from './strategicDashboardSeed';

/**
 * Live page / customizer canvas: financial snapshot + which widgets are on the board.
 * Drives deterministic peer-curve shaping (practice-mix proxies + “what you’re watching”).
 */
export type PeerBenchmarkPageContext = {
  snapshot: BriefingFinancialSnapshot;
  mainWidgetIds: readonly string[];
  sidebarWidgetIds: readonly string[];
};

/** Tunable peer curve (synthetic composite). */
export type PeerBenchmarkCurveParams = {
  /** Base multiplier vs firm burn before index wobble. */
  burnFactorBase: number;
  /** Base multiplier vs firm cash before index wobble. */
  cashLiftBase: number;
  /** Amplitude of (index % 4) term on burn. */
  burnIndexAmp: number;
  /** Amplitude of (index % 5) term on cash. */
  cashIndexAmp: number;
  /** Upper clamp for peer runway (months). */
  runwayCap: number;
};

const DEFAULT_CURVE: PeerBenchmarkCurveParams = {
  burnFactorBase: 0.93,
  cashLiftBase: 1.02,
  burnIndexAmp: 0.015,
  cashIndexAmp: 0.004,
  runwayCap: 34,
};

function sumValues(named: readonly { value: number }[]): number {
  return named.reduce((s, x) => s + x.value, 0);
}

/**
 * Derives peer-curve parameters from:
 * - **Practice mix proxies**: revenue goal progress, A/R stress (90+ share), payroll-heavy OpEx.
 * - **Widget set**: practice/collections widgets, core strat trio, modelling, embedded reports.
 *
 * Still fully synthetic / deterministic—not real benchmarking data.
 */
export function derivePeerBenchmarkCurveParams(ctx: PeerBenchmarkPageContext): PeerBenchmarkCurveParams {
  const { snapshot, mainWidgetIds, sidebarWidgetIds } = ctx;
  const allIds = new Set<string>([...mainWidgetIds, ...sidebarWidgetIds]);

  let burnFactorBase = DEFAULT_CURVE.burnFactorBase;
  let cashLiftBase = DEFAULT_CURVE.cashLiftBase;
  let burnIndexAmp = DEFAULT_CURVE.burnIndexAmp;
  let cashIndexAmp = DEFAULT_CURVE.cashIndexAmp;
  let runwayCap = DEFAULT_CURVE.runwayCap;

  // Revenue goal attainment vs default demo baseline (75%): peers track “similar goal pressure”.
  const goalDelta = (snapshot.revenue.centerPct - 75) / 100;
  cashLiftBase += goalDelta * 0.08;
  burnFactorBase -= goalDelta * 0.03;

  // A/R stress: more 90+ → composite peers look slightly healthier on cash / leaner on burn (collections narrative).
  const arTotal = sumValues(snapshot.arAging);
  const ar90 =
    snapshot.arAging.find((b) => b.name.includes('90'))?.value ??
    snapshot.arAging.find((b) => /^\s*90/.test(b.name))?.value ??
    0;
  const arStress = arTotal > 0 ? ar90 / arTotal : 0;
  cashLiftBase += arStress * 0.12;
  burnFactorBase -= arStress * 0.04;

  // Payroll share → people-heavy practice proxy (slightly different peer burn band).
  const exp = snapshot.expenseRep;
  const expTotal = sumValues(exp);
  const payrollShare = expTotal > 0 ? (exp.find((b) => b.name === 'Payroll')?.value ?? 0) / expTotal : 0.55;
  burnFactorBase += (payrollShare - 0.55) * 0.12;
  burnIndexAmp += Math.abs(payrollShare - 0.55) * 0.018;

  // Practice & collections widgets → user cares about mix / billing; peer band reflects that lens.
  const practiceSignalIds = [
    'practice_areas',
    'billing_health',
    'collection_trends',
    'partner_realization',
  ] as const;
  const nPracticeSignals = practiceSignalIds.filter((id) => allIds.has(id)).length;
  cashLiftBase += nPracticeSignals * 0.006;
  burnFactorBase -= nPracticeSignals * 0.007;
  runwayCap = Math.min(36, runwayCap + Math.floor(nPracticeSignals / 2));

  if (allIds.has('ar_aging')) {
    cashLiftBase += 0.01;
    burnIndexAmp += 0.003;
  }
  if (allIds.has('collection_trends')) {
    cashLiftBase += 0.008;
  }

  // Full liquidity stack on the page → smoother “reporting standard” peer path.
  const stratCore = ['strat_cash', 'strat_burn', 'strat_runway'].filter((id) => allIds.has(id)).length;
  if (stratCore >= 3) {
    burnIndexAmp *= 0.88;
    cashIndexAmp *= 0.88;
  }

  // Modelling on canvas → slightly wider month-to-month peer wobble (planning-heavy boards).
  if (allIds.has('suggested_modelling')) {
    burnIndexAmp *= 1.06;
    cashIndexAmp *= 1.05;
  }

  const embeddedCount = [...mainWidgetIds, ...sidebarWidgetIds].filter((id) => id === 'embedded_report').length;
  cashLiftBase += embeddedCount * 0.004;

  burnFactorBase = Math.min(0.99, Math.max(0.84, burnFactorBase));
  cashLiftBase = Math.min(1.12, Math.max(0.96, cashLiftBase));
  burnIndexAmp = Math.min(0.038, Math.max(0.008, burnIndexAmp));
  cashIndexAmp = Math.min(0.014, Math.max(0.002, cashIndexAmp));

  return { burnFactorBase, cashLiftBase, burnIndexAmp, cashIndexAmp, runwayCap };
}

/**
 * Prototype: synthetic "anonymized peer composite" from firm baseline only.
 * Not real market data—deterministic offsets so charts show a plausible comparison band.
 */
export function buildPeerBenchmarkOverlay(
  rows: readonly Pick<StrategicMonthRow, 'cash' | 'burn' | 'runway'>[],
  curve: PeerBenchmarkCurveParams = DEFAULT_CURVE,
): { peerCash: number; peerBurn: number; peerRunway: number }[] {
  return rows.map((r, index) => {
    const burnFactor = curve.burnFactorBase + (index % 4) * curve.burnIndexAmp;
    const peerBurn = Math.max(35000, Math.round(r.burn * burnFactor));
    const cashLift = curve.cashLiftBase + (index % 5) * curve.cashIndexAmp;
    const peerCash = Math.max(400000, Math.round(r.cash * cashLift));
    const rawRunway = peerBurn > 0 ? peerCash / peerBurn : r.runway;
    const peerRunway = Number(Math.min(curve.runwayCap, Math.max(8, rawRunway)).toFixed(1));
    return { peerCash, peerBurn, peerRunway };
  });
}

/** Attach peer* fields for chart overlays (does not mutate input objects). */
export function attachPeerBenchmarkToRows<T extends StrategicMonthRow>(
  rows: readonly T[],
  pageContext?: PeerBenchmarkPageContext | null,
): T[] {
  const curve =
    pageContext != null ? derivePeerBenchmarkCurveParams(pageContext) : DEFAULT_CURVE;
  const peer = buildPeerBenchmarkOverlay(rows, curve);
  return rows.map((r, i) => ({
    ...r,
    peerCash: peer[i]!.peerCash,
    peerBurn: peer[i]!.peerBurn,
    peerRunway: peer[i]!.peerRunway,
  }));
}

type ScenarioImpactSlice = Pick<StrategicMonthRow, 'altCash' | 'altBurn' | 'altRunway'>;

/**
 * Baseline → optional peer overlay (from firm baseline only) → optional scenario alt* merge.
 */
export function mergeStrategicRowsWithModelling(
  baselineRows: StrategicMonthRow[],
  options: {
    peerBenchmarkEnabled: boolean;
    selectedModelId: string | null;
    getScenarioImpact: (modelId: string, index: number) => ScenarioImpactSlice | undefined;
    /** When set, peer composite reflects practice-mix + widget-set signals from this page. */
    peerPageContext?: PeerBenchmarkPageContext | null;
  },
): StrategicMonthRow[] {
  let rows: StrategicMonthRow[] = baselineRows.map((r) => ({ ...r }));
  if (options.peerBenchmarkEnabled) {
    rows = attachPeerBenchmarkToRows(rows, options.peerPageContext ?? null);
  }
  if (options.selectedModelId) {
    const mid = options.selectedModelId;
    rows = rows.map((data, index) => {
      const modelData = options.getScenarioImpact(mid, index);
      return modelData ? { ...data, ...modelData } : data;
    });
  }
  return rows;
}
