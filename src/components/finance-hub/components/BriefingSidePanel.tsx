import React from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building2,
} from 'lucide-react';
import {
  type BriefingInsightId,
  getBriefingExploreContent,
  getBriefingTakeActionContent,
  BRIEFING_ACTION_HEADLINE,
  isBriefingInsightId,
} from '../data/briefingPanelContent';
import type { ModellingExplorePanelViewModel } from '../data/modellingExplorePanel';
import { formatDrillDownBreadcrumb } from './FirmWideDrillDownLadder';
import { BriefingExploreSections } from './BriefingExploreSections';

const DEFAULT_TAKE_ACTION_ROWS = [
  { label: '1. Automate 31-60 day A/R Reminders', pct: 45, amt: '+$6,800' },
  { label: "2. Pre-bill Retainer for 'Smith Estate'", pct: 33, amt: '+$5,000' },
  { label: '3. Defer Q3 Software Upgrades', pct: 22, amt: '+$3,500' },
] as const;

export type BriefingPanelState =
  | null
  | { mode: 'takeAction'; insightId: BriefingInsightId }
  | { mode: 'explore'; insightId: BriefingInsightId }
  | { mode: 'modellingExplore'; modelId: string };

type BriefingSidePanelProps = {
  panel: BriefingPanelState;
  onClose: () => void;
  brandColor: string;
  isExecuting: boolean;
  hasExecuted: boolean;
  showMorePlans: boolean;
  setShowMorePlans: (v: boolean) => void;
  onExecutePlan: () => void;
  modellingExploreContent: ModellingExplorePanelViewModel | null;
  modelAlreadyInGoals: boolean;
  onModellingExecute: () => void;
  onModellingSelectAlternative: (modelId: string) => void;
};

export function BriefingSidePanel({
  panel,
  onClose,
  brandColor,
  isExecuting,
  hasExecuted,
  showMorePlans,
  setShowMorePlans,
  onExecutePlan,
  modellingExploreContent,
  modelAlreadyInGoals,
  onModellingExecute,
  onModellingSelectAlternative,
}: BriefingSidePanelProps) {
  if (!panel) return null;

  if (panel.mode === 'explore') {
    const explore = getBriefingExploreContent(panel.insightId);
    if (!explore) return null;
    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden
        />
        <div className="relative w-full max-w-[440px] sm:w-[440px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Explore data
              </p>
              <h2 className="text-[19px] font-semibold text-[#101828] tracking-tight pr-2">{explore.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-[8px] transition-colors shrink-0"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <BriefingExploreSections explore={explore} />
          </div>
        </div>
      </div>
    );
  }

  if (panel.mode === 'modellingExplore') {
    if (!modellingExploreContent) return null;
    const mc = modellingExploreContent;
    const riskClass = (tag: string) => {
      const t = tag.toLowerCase();
      if (t.includes('higher')) return 'text-orange-600 bg-orange-50 border-orange-100';
      if (t.includes('lower')) return 'text-blue-600 bg-blue-50 border-blue-100';
      return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => !isExecuting && onClose()}
          aria-hidden
        />
        <div className="relative w-full max-w-[440px] sm:w-[440px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-[8px] bg-violet-50 flex items-center justify-center border border-violet-100 shrink-0">
                <Sparkles className="h-5 w-5 text-violet-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Modelling</p>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight truncate">{mc.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{mc.subtitle}</p>
              </div>
            </div>
            <button
              type="button"
              disabled={isExecuting}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-[8px] hover:bg-gray-100 shrink-0 disabled:opacity-50"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Scenario plan</h4>
              {mc.phases.map((phase) => (
                <div key={phase.title} className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{phase.title}</p>
                  <p className="text-[13px] text-gray-800 mt-2 leading-relaxed">{phase.body}</p>
                  {phase.ctaHint ? (
                    <p className="text-[12px] font-medium text-blue-600 mt-2 leading-snug">{phase.ctaHint}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="bg-gray-50/80 rounded-[8px] p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{mc.modelHeadline}</h4>
                <div className="bg-violet-100 text-violet-800 text-[10px] font-bold px-2.5 py-1 rounded-[8px] border border-violet-200 uppercase max-w-[min(100%,14rem)] text-right leading-tight">
                  {mc.confidenceLabel}
                </div>
              </div>
              <div className="space-y-6">
                {mc.modelRows.map((row) => (
                  <div key={row.label} className="group">
                    <div className="flex justify-between items-center mb-2 gap-2">
                      <span className="text-[13px] font-semibold text-gray-800">{row.label}</span>
                      <span className="text-[13px] font-bold text-violet-600 shrink-0">{row.amt}</span>
                    </div>
                    <div className="w-full bg-white rounded-[8px] h-2 shadow-inner">
                      <div
                        className="bg-violet-500 h-2 rounded-[8px] shadow-sm"
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                disabled={isExecuting || hasExecuted || modelAlreadyInGoals}
                onClick={onModellingExecute}
                className={`w-full py-4 px-6 text-white text-base font-bold rounded-[8px] shadow-xl transition-all flex justify-center items-center relative overflow-hidden ${
                  hasExecuted ? 'bg-green-600' : modelAlreadyInGoals ? 'bg-gray-400 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: !hasExecuted && !modelAlreadyInGoals ? brandColor : undefined }}
              >
                {isExecuting ? (
                  <div className="flex items-center space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                    <span className="ml-2 uppercase text-xs tracking-widest font-bold">Linking to goals…</span>
                  </div>
                ) : hasExecuted ? (
                  <div className="flex items-center animate-in zoom-in duration-300">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Linked to Financial Goals
                  </div>
                ) : modelAlreadyInGoals ? (
                  <span>Already in Financial Goals</span>
                ) : (
                  <span className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Execute recommended plan
                  </span>
                )}
              </button>

              <button
                type="button"
                disabled={isExecuting}
                onClick={() => setShowMorePlans(!showMorePlans)}
                className="w-full py-4 px-6 text-gray-600 text-sm font-bold bg-gray-50 border border-gray-200 rounded-[8px] hover:bg-white hover:border-gray-300 transition-all flex justify-center items-center"
              >
                Explore alternative models
                {showMorePlans ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </button>
            </div>

            {showMorePlans && mc.alternatives.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 pb-4 animate-in slide-in-from-top-4 duration-300">
                {mc.alternatives.map((alt) => (
                  <button
                    key={alt.id}
                    type="button"
                    disabled={isExecuting}
                    onClick={() => onModellingSelectAlternative(alt.id)}
                    className="text-left p-5 rounded-[8px] border border-gray-200 bg-white hover:shadow-md transition-all cursor-pointer group disabled:opacity-50"
                  >
                    <div className="flex justify-between items-center mb-2 gap-2">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-violet-600 min-w-0">{alt.name}</h4>
                      <div
                        className={`text-[10px] font-bold px-2 py-1 rounded-[8px] border uppercase shrink-0 ${riskClass(alt.riskTag)}`}
                      >
                        {alt.riskTag}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{alt.blurb}</p>
                  </button>
                ))}
              </div>
            ) : null}
            {showMorePlans && mc.alternatives.length === 0 ? (
              <p className="text-xs text-gray-500 pb-4">No other scenario models to compare yet.</p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const insightId = panel.insightId;
  const traceExplore = isBriefingInsightId(insightId) ? getBriefingExploreContent(insightId) : null;
  const takeCustom = isBriefingInsightId(insightId) ? getBriefingTakeActionContent(insightId) : null;
  const modelHeadline = takeCustom?.modelHeadline ?? 'Model Results: +$15,300 Impact';
  const confidenceLabel = takeCustom?.confidenceLabel ?? '92% Confidence';
  const modelRows = takeCustom?.modelRows ?? [...DEFAULT_TAKE_ACTION_ROWS];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => !isExecuting && onClose()}
        aria-hidden
      />
      <div className="relative w-full max-w-[440px] sm:w-[440px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-[8px] bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight truncate">Financial Recovery Plan</h2>
              {isBriefingInsightId(insightId) ? (
                <p className="text-xs text-gray-500 mt-0.5 truncate">{BRIEFING_ACTION_HEADLINE[insightId]}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            disabled={isExecuting}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-[8px] hover:bg-gray-100 shrink-0 disabled:opacity-50"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {traceExplore ? (
            <details className="group rounded-[8px] border border-gray-200 bg-white overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[13px] font-semibold text-gray-800 hover:bg-gray-50 [&::-webkit-details-marker]:hidden">
                <Building2 className="h-4 w-4 shrink-0 text-gray-500" strokeWidth={1.75} aria-hidden />
                <span>Firm-wide signal trace</span>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
                <p className="text-[11px] text-gray-700 leading-relaxed">
                  {formatDrillDownBreadcrumb(traceExplore.drillDownRoot)}
                </p>
                <p className="text-[10px] text-gray-500 mt-2 leading-snug">
                  Use <span className="font-medium text-gray-600">Explore data</span> on this suggested action for the
                  full ladder—firm → practice → matter → individual—with metrics at each step.
                </p>
              </div>
            </details>
          ) : null}

          {takeCustom?.phases && takeCustom.phases.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Cash Flow Action Plan</h4>
              {takeCustom.phases.map((phase) => (
                <div key={phase.title} className="rounded-[8px] border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{phase.title}</p>
                  <p className="text-[13px] text-gray-800 mt-2 leading-relaxed">{phase.body}</p>
                  {phase.ctaHint ? (
                    <p className="text-[12px] font-medium text-blue-600 mt-2 leading-snug">{phase.ctaHint}</p>
                  ) : null}
                </div>
              ))}
              {takeCustom.strategicClosing ? (
                <p className="text-[13px] font-medium text-gray-800 leading-relaxed border-l-4 border-green-500 pl-3 py-1 bg-green-50/50 rounded-r-[8px]">
                  {takeCustom.strategicClosing}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="bg-gray-50/80 rounded-[8px] p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{modelHeadline}</h4>
              <div className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-[8px] border border-green-200 uppercase">
                {confidenceLabel}
              </div>
            </div>

            <div className="space-y-6">
              {modelRows.map((row) => (
                <div key={row.label} className="group">
                  <div className="flex justify-between items-center mb-2 gap-2">
                    <span className="text-[13px] font-semibold text-gray-800">{row.label}</span>
                    <span className="text-[13px] font-bold text-green-600 shrink-0">{row.amt}</span>
                  </div>
                  <div className="w-full bg-white rounded-[8px] h-2 shadow-inner">
                    <div className="bg-green-500 h-2 rounded-[8px] shadow-sm" style={{ width: `${row.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              disabled={isExecuting || hasExecuted}
              onClick={onExecutePlan}
              className={`w-full py-4 px-6 text-white text-base font-bold rounded-[8px] shadow-xl transition-all flex justify-center items-center relative overflow-hidden ${
                hasExecuted ? 'bg-green-600' : 'hover:opacity-90'
              }`}
              style={{ backgroundColor: !hasExecuted ? brandColor : undefined }}
            >
              {isExecuting ? (
                <div className="flex items-center space-x-2 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                  <span className="ml-2 uppercase text-xs tracking-widest font-bold">Executing Model...</span>
                </div>
              ) : hasExecuted ? (
                <div className="flex items-center animate-in zoom-in duration-300">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Actions Executed Successfully
                </div>
              ) : (
                <span className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Execute Recommended Plan
                </span>
              )}
            </button>

            <button
              type="button"
              disabled={isExecuting}
              onClick={() => setShowMorePlans(!showMorePlans)}
              className="w-full py-4 px-6 text-gray-600 text-sm font-bold bg-gray-50 border border-gray-200 rounded-[8px] hover:bg-white hover:border-gray-300 transition-all flex justify-center items-center"
            >
              Explore Alternative Models
              {showMorePlans ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </button>
          </div>

          {showMorePlans ? (
            <div className="grid grid-cols-1 gap-3 pb-4 animate-in slide-in-from-top-4 duration-300">
              <div className="p-5 rounded-[8px] border border-gray-200 bg-white hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Model A: Aggressive Collection</h4>
                  <div className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-[8px] border border-orange-100 uppercase">
                    Medium Risk
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Focuses on liquidating all 60+ day receivables immediately through third-party partners. +$12,000
                  projected.
                </p>
              </div>

              <div className="p-5 rounded-[8px] border border-gray-200 bg-white hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600">Model B: Expense Optimization</h4>
                  <div className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-[8px] border border-blue-100 uppercase">
                    Low Risk
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Adjusts operating marketing budget for next 30 days to rebalance reserves. +$14,500 projected.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
