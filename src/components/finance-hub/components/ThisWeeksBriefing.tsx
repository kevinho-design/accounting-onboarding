import React, { useEffect, useMemo, useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import type { BriefingInsightId } from '../data/briefingPanelContent';
import { BRIEFING_INSIGHT_ITEMS } from '../data/briefingInsights';
import { cn } from './ui/utils';

const NO_EXECUTED_INSIGHTS: readonly BriefingInsightId[] = [];

export const ThisWeeksBriefing = ({ 
  onTakeAction, 
  onExploreData,
  isCompact = false,
  executedInsightIds,
  maxVisibleInsights,
}: { 
  onTakeAction?: (insightId: string) => void;
  onExploreData?: (insightId: string) => void;
  isCompact?: boolean;
  /** Insights whose recommended plan was executed — hidden from the list */
  executedInsightIds?: readonly BriefingInsightId[];
  /** When set, only the first N insights are listed (Summary display mode). */
  maxVisibleInsights?: number;
}) => {
  const [expandedId, setExpandedId] = useState<string>(() => BRIEFING_INSIGHT_ITEMS[0]?.id ?? 'insight-4');

  const hiddenIds = executedInsightIds ?? NO_EXECUTED_INSIGHTS;

  const visibleInsights = useMemo(
    () => BRIEFING_INSIGHT_ITEMS.filter((i) => !hiddenIds.includes(i.id)),
    [hiddenIds],
  );

  const displayInsights = useMemo(
    () =>
      maxVisibleInsights != null ? visibleInsights.slice(0, maxVisibleInsights) : visibleInsights,
    [visibleInsights, maxVisibleInsights],
  );

  useEffect(() => {
    if (visibleInsights.length === 0) {
      setExpandedId('');
      return;
    }
    if (!visibleInsights.some((i) => i.id === expandedId)) {
      setExpandedId(visibleInsights[0].id);
    }
  }, [visibleInsights, expandedId]);

  useEffect(() => {
    if (displayInsights.length === 0) return;
    if (!displayInsights.some((i) => i.id === expandedId)) {
      setExpandedId(displayInsights[0].id);
    }
  }, [displayInsights, expandedId]);

  const titleSize = isCompact ? 'text-[14px]' : 'text-base';
  const subtitleSize = isCompact ? 'text-[13px]' : 'text-sm';
  const textSize = isCompact ? 'text-[12px]' : 'text-sm';
  const smallTextSize = isCompact ? 'text-[11px]' : 'text-xs';

  return (
    <div className={`h-full w-full flex flex-col ${isCompact ? 'mt-2' : ''}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-full opacity-50 -z-10 transition-transform group-hover:scale-110 duration-500" />
      
      <div className="flex items-start mb-5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
          <div>
            <h3 className={`${titleSize} font-bold text-gray-900 flex items-center gap-2`}>
              This Week's Briefing
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Live</span>
            </h3>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {displayInsights.length === 0 ? (
          <div className="rounded-[8px] border border-emerald-100 bg-emerald-50/60 px-4 py-5 text-center">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-2">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
            </div>
            <p className={`${subtitleSize} font-semibold text-gray-900`}>You&apos;re caught up</p>
            <p className={`${smallTextSize} text-gray-600 mt-1 leading-relaxed`}>
              Executed plans are reflected in your charts and goals. New insights will appear here when available.
            </p>
          </div>
        ) : (
          displayInsights.map((insight) => {
            const isExpanded = expandedId === insight.id;
            const Icon = insight.icon;
            const isFeatured = displayInsights[0]?.id === insight.id;

            return (
              <div 
                key={insight.id} 
                className={cn(
                  'rounded-[8px] p-4 flex gap-4 items-start transition-all duration-200 bg-gray-50 border',
                  isFeatured && 'ring-2 ring-primary/30 border-primary/40 shadow-md',
                  !isFeatured && (isExpanded ? 'border-blue-200 shadow-sm' : 'border-gray-100'),
                )}
              >
                <div className={`${insight.iconBg} ${insight.iconColor} p-2 rounded-[6px] shrink-0`}>
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div 
                    className="flex items-center justify-between mb-1 cursor-pointer gap-2"
                    onClick={() => setExpandedId(isExpanded ? '' : insight.id)}
                  >
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <h4 className={`${subtitleSize} font-semibold text-gray-900`}>{insight.title}</h4>
                      {isFeatured && (
                        <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                          Priority
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`${smallTextSize} text-gray-500 flex items-center gap-1`}>
                        <Clock className="w-3 h-3" /> {insight.time}
                      </span>
                      <button type="button" className="text-gray-400 hover:text-gray-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                      <p className={`${textSize} text-gray-600 mb-3 mt-2 leading-relaxed`}>
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          type="button"
                          onClick={() => onTakeAction && onTakeAction(insight.id)}
                          className={`${textSize} font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-[6px] transition-colors flex items-center gap-2 shadow-sm`}
                        >
                          <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} /> Take Action
                        </button>
                        <button 
                          type="button"
                          onClick={() => onExploreData && onExploreData(insight.id)}
                          className={`${textSize} font-medium text-gray-600 hover:text-gray-900 transition-colors`}
                        >
                          Explore Data
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
