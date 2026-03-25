import React from 'react';
import { useStrategicDashboardCharts } from '../context/StrategicDashboardChartsContext';
import { strategicData } from '../data/strategicDashboardSeed';

export type ModellingPeerComparisonStripProps = {
  widgetId: string;
  /** Used for future surface-specific density; strip is the same for now */
  surface?: 'page' | 'dashboardSummary';
};

const STRIP_EXCLUDED_WIDGET_IDS = new Set([
  'suggested_modelling',
  /** Charts already show full firm / scenario / peer series */
  'strat_cash',
  'strat_burn',
  'strat_runway',
]);

function formatCash(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return '—';
  return `$${n.toLocaleString()}`;
}

function formatBurn(n: number | undefined): string {
  return formatCash(n);
}

function formatRunway(n: number | undefined): string {
  if (n === undefined || Number.isNaN(n)) return '—';
  return `${n} mo`;
}

/**
 * Compact firm vs scenario vs peer snapshot (latest month in strategic series).
 * Shown under every financial widget when modelling preview or peer benchmark is on.
 */
export function ModellingPeerComparisonStrip({ widgetId }: ModellingPeerComparisonStripProps) {
  const chartCtx = useStrategicDashboardCharts();
  const selectedModelId = chartCtx?.selectedModelId ?? null;
  const peerBenchmarkEnabled = chartCtx?.peerBenchmarkEnabled ?? false;

  if (!selectedModelId && !peerBenchmarkEnabled) return null;
  if (STRIP_EXCLUDED_WIDGET_IDS.has(widgetId)) return null;

  const rows = chartCtx?.displayStrategicData ?? strategicData;
  const last = rows[rows.length - 1];
  if (!last) return null;

  const showScenario = Boolean(selectedModelId);
  const showPeer = peerBenchmarkEnabled;

  return (
    <div
      className="mt-3 shrink-0 rounded-md border border-border/80 bg-muted/30 px-2.5 py-2"
      role="region"
      aria-label="Modelling and peer comparison"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
        Latest month — modelling & peers
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-[10px] border-collapse">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-border/60">
              <th className="pb-1 pr-2 font-medium"> </th>
              <th className="pb-1 pr-2 font-medium">Your firm</th>
              {showScenario ? (
                <th className="pb-1 pr-2 font-medium whitespace-nowrap">Scenario (Preview)</th>
              ) : null}
              {showPeer ? <th className="pb-1 font-medium whitespace-nowrap">Peer composite</th> : null}
            </tr>
          </thead>
          <tbody className="text-foreground">
            <tr className="border-b border-border/40">
              <td className="py-1 pr-2 font-medium text-muted-foreground">Cash</td>
              <td className="py-1 pr-2 tabular-nums">{formatCash(last.cash)}</td>
              {showScenario ? (
                <td className="py-1 pr-2 tabular-nums">{formatCash(last.altCash)}</td>
              ) : null}
              {showPeer ? <td className="py-1 tabular-nums">{formatCash(last.peerCash)}</td> : null}
            </tr>
            <tr className="border-b border-border/40">
              <td className="py-1 pr-2 font-medium text-muted-foreground">Burn</td>
              <td className="py-1 pr-2 tabular-nums">{formatBurn(last.burn)}</td>
              {showScenario ? (
                <td className="py-1 pr-2 tabular-nums">{formatBurn(last.altBurn)}</td>
              ) : null}
              {showPeer ? <td className="py-1 tabular-nums">{formatBurn(last.peerBurn)}</td> : null}
            </tr>
            <tr>
              <td className="py-1 pr-2 font-medium text-muted-foreground">Runway</td>
              <td className="py-1 pr-2 tabular-nums">{formatRunway(last.runway)}</td>
              {showScenario ? (
                <td className="py-1 pr-2 tabular-nums">{formatRunway(last.altRunway)}</td>
              ) : null}
              {showPeer ? <td className="py-1 tabular-nums">{formatRunway(last.peerRunway)}</td> : null}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
