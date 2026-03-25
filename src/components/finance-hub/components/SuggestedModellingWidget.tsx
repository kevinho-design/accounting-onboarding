import React from 'react';
import { CheckCircle2, Compass, Plus, Info } from 'lucide-react';

/** Minimal model shape for the sidebar / widget (App maps full scenario models). */
export type ModellingWidgetModel = {
  id: string;
  name: string;
  description: string;
  isUserCreated?: boolean;
};

export type ModellingWidgetUiBridge = {
  models: ModellingWidgetModel[];
  selectedModelId: string | null;
  onTogglePreview: (modelId: string) => void;
  financialGoalModelIds: readonly string[];
  onExploreModel: (modelId: string) => void;
  onOpenCreateModel: () => void;
  peerBenchmarkEnabled: boolean;
  onPeerBenchmarkChange: (enabled: boolean) => void;
};

type SuggestedModellingWidgetProps = {
  bridge: ModellingWidgetUiBridge;
};

export function SuggestedModellingWidget({ bridge }: SuggestedModellingWidgetProps) {
  const {
    models,
    selectedModelId,
    onTogglePreview,
    financialGoalModelIds,
    onExploreModel,
    onOpenCreateModel,
    peerBenchmarkEnabled,
    onPeerBenchmarkChange,
  } = bridge;

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      <div className="rounded-lg border border-teal-100 bg-teal-50/40 p-3">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500/30"
            checked={peerBenchmarkEnabled}
            onChange={(e) => onPeerBenchmarkChange(e.target.checked)}
          />
          <span className="min-w-0">
            <span className="text-sm font-semibold text-gray-900">Benchmark against peers</span>
            <span className="block text-[11px] text-gray-600 mt-0.5 leading-snug">
              Overlay a synthetic peer composite shaped by your dashboard metrics and widgets—on Cash, Burn, and Runway,
              including when you Preview a scenario.
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {models.map((model) => (
          <div
            key={model.id}
            className={`text-left p-4 rounded-[8px] border transition-all ${
              selectedModelId === model.id
                ? 'border-[#8b5cf6] bg-[#8b5cf6]/5 ring-1 ring-[#8b5cf6]/20'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className={`font-semibold text-sm min-w-0 ${
                  selectedModelId === model.id ? 'text-[#8b5cf6]' : 'text-gray-900'
                }`}
              >
                {model.name}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {model.isUserCreated && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-violet-700 bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded-[4px]">
                    Yours
                  </span>
                )}
                {financialGoalModelIds.includes(model.id) && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-[4px]">
                    In goals
                  </span>
                )}
                {selectedModelId === model.id && <CheckCircle2 className="w-4 h-4 text-[#8b5cf6]" />}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">{model.description}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onTogglePreview(model.id)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-1.5 rounded-[6px] text-xs font-medium hover:bg-gray-50 transition-colors"
              >
                {selectedModelId === model.id ? 'Hide Preview' : 'Preview'}
              </button>
              <button
                type="button"
                onClick={() => onExploreModel(model.id)}
                className="flex-1 py-1.5 rounded-[6px] text-xs font-medium transition-colors flex items-center justify-center gap-1 border bg-violet-50 text-violet-900 border-violet-100 hover:bg-violet-100"
              >
                <Compass className="w-3.5 h-3.5" />
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onOpenCreateModel}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-[8px] text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" strokeWidth={2} />
        Create model
      </button>
      <div className="bg-blue-50/50 border border-blue-100 rounded-[8px] p-4">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900">How modelling works</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
              Create models or use starters below. Preview overlays scenarios on the charts; peer benchmarking adds a
              comparison band. Explore opens a scenario plan with results and a path to link the model to Financial Goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
