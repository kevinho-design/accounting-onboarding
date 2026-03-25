import * as React from 'react';

export type DigitalTwinScenarioId = 'senior_exit' | 're_rate_increase';

export interface DigitalTwinWidgetProps {
  /** Kept for layout hydration; peer benchmarking no longer reads this widget. */
  displayStrategicData?: unknown;
  onExploreScenario?: (id: DigitalTwinScenarioId) => void;
}

/**
 * Legacy widget id: peer composite + scenario stress tests moved into Modelling
 * (“Benchmark against peers” + Preview). Kept so saved layouts still render.
 */
export function DigitalTwinWidget({ onExploreScenario }: DigitalTwinWidgetProps) {
  return (
    <div className="flex h-full w-full flex-col gap-3">
      <h3 className="text-base font-bold text-gray-900">Digital Twin</h3>
      <p className="text-xs text-gray-600 leading-relaxed">
        Peer benchmarking and scenario overlays now live in{' '}
        <strong className="font-medium text-gray-800">Modelling</strong>. Add or open the{' '}
        <strong className="font-medium text-gray-800">Modelling</strong> widget and turn on{' '}
        <strong className="font-medium text-gray-800">Benchmark against peers</strong> to overlay an anonymized peer
        composite on your Cash, Burn, and Runway charts—alongside Preview when you stress-test a model.
      </p>
      {onExploreScenario ? (
        <button
          type="button"
          onClick={() => onExploreScenario('senior_exit')}
          className="text-left text-xs font-semibold text-teal-700 hover:text-teal-800 underline-offset-2 hover:underline mt-1"
        >
          Go to Finances to use Modelling →
        </button>
      ) : null}
    </div>
  );
}
