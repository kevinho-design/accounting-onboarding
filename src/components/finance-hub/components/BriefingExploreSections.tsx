import React from 'react';
import { Sparkles, Building2, List } from 'lucide-react';
import type { BriefingExploreContent } from '../data/briefingPanelContent';
import { FirmWideDrillDownLadder } from './FirmWideDrillDownLadder';
import { cn } from './ui/utils';

/** Shared body for Explore data: AI analysis, firm-wide ladder, recommended actions (briefing side panel). */
export function BriefingExploreSections({
  explore,
  className,
}: {
  explore: BriefingExploreContent;
  className?: string;
}) {
  return (
    <div className={cn('space-y-8', className)}>
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="text-[15.75px] font-semibold text-[#101828]">AI Analysis</h3>
        </div>
        <div className="space-y-3 rounded-[8px] border border-blue-100 bg-blue-50/50 p-4">
          <p className="text-[12.25px] leading-relaxed text-[#364153]">{explore.aiAnalysis.summary}</p>
          <div className="mt-2 border-t border-blue-100/50 pt-2">
            <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wide text-blue-800">
              Why we&apos;re surfacing this
            </p>
            <p className="text-[12.25px] leading-relaxed text-[#364153]">{explore.aiAnalysis.whySurfacing}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-gray-200 bg-gray-100">
            <Building2 className="h-3.5 w-3.5 text-gray-600" />
          </div>
          <h3 className="text-[15.75px] font-semibold text-[#101828]">Firm-wide Drilldown</h3>
        </div>
        <div className="rounded-[8px] border border-gray-200 bg-gray-50 p-3">
          <FirmWideDrillDownLadder root={explore.drillDownRoot} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] border border-gray-200 bg-gray-100">
            <List className="h-3.5 w-3.5 text-gray-600" />
          </div>
          <h3 className="text-[15.75px] font-semibold text-[#101828]">Recommended Actions</h3>
        </div>
        <ul className="space-y-2">
          {explore.recommendedActions.map((action, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 rounded-[8px] border border-gray-200 bg-white p-3 text-left"
            >
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] bg-blue-50 text-blue-600">
                <span className="text-[10px] font-bold">{i + 1}</span>
              </div>
              <span className="text-[12.25px] leading-relaxed text-[#364153]">{action}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
