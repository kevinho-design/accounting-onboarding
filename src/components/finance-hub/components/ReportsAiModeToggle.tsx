import * as React from 'react';
import { MessageSquareText, Users, ScanEye } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { cn } from './ui/utils';

export type ReportAiInteractionMode = 'ask' | 'collaborate' | 'observe';

const MODE_TOOLTIPS: Record<ReportAiInteractionMode, string> = {
  ask: 'AI is available but unobtrusive—human work is center stage.',
  collaborate: 'AI and human share space—build and refine the report side by side.',
  observe: 'AI outputs take center stage—review the overview, then drill in.',
};

export type ReportsAiModeToggleProps = {
  value: ReportAiInteractionMode;
  onChange: (mode: ReportAiInteractionMode) => void;
  className?: string;
  /** Larger touch targets and always show text labels */
  variant?: 'default' | 'prominent';
};

export function ReportsAiModeToggle({
  value,
  onChange,
  className,
  variant = 'default',
}: ReportsAiModeToggleProps) {
  const prominent = variant === 'prominent';

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v === 'ask' || v === 'collaborate' || v === 'observe') onChange(v);
      }}
      variant="outline"
      size="sm"
      className={cn(
        'rounded-[8px] border border-gray-200 bg-white p-0.5 shadow-sm',
        prominent && 'shadow-md',
        className,
      )}
    >
      <ToggleGroupItem
        value="ask"
        aria-label="Ask mode"
        title={MODE_TOOLTIPS.ask}
        className={cn(
          'gap-1.5 px-2.5 text-xs data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900',
          prominent && 'px-3 py-2 text-sm',
        )}
      >
        <MessageSquareText className={cn('shrink-0', prominent ? 'h-4 w-4' : 'h-3.5 w-3.5')} strokeWidth={2} />
        <span className={prominent ? 'inline' : 'hidden sm:inline'}>Ask</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="collaborate"
        aria-label="Collaborate mode"
        title={MODE_TOOLTIPS.collaborate}
        className={cn(
          'gap-1.5 px-2.5 text-xs data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900',
          prominent && 'px-3 py-2 text-sm',
        )}
      >
        <Users className={cn('shrink-0', prominent ? 'h-4 w-4' : 'h-3.5 w-3.5')} strokeWidth={2} />
        <span className={prominent ? 'inline' : 'hidden sm:inline'}>Collaborate</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="observe"
        aria-label="Observe mode"
        title={MODE_TOOLTIPS.observe}
        className={cn(
          'gap-1.5 px-2.5 text-xs data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900',
          prominent && 'px-3 py-2 text-sm',
        )}
      >
        <ScanEye className={cn('shrink-0', prominent ? 'h-4 w-4' : 'h-3.5 w-3.5')} strokeWidth={2} />
        <span className={prominent ? 'inline' : 'hidden sm:inline'}>Observe</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export function reportAiModeDescription(mode: ReportAiInteractionMode): string {
  return MODE_TOOLTIPS[mode];
}
