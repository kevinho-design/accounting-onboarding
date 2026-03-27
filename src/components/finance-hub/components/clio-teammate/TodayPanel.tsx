import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import type { BriefingInsightId } from '../../data/briefingPanelContent';
import { buildMergedTodayTodos, type MergedTodayTodo } from '../../data/todayTodoMerge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { cn } from '../ui/utils';

export type TodayPanelProps = {
  executedBriefingInsightIds: readonly BriefingInsightId[];
  suggestedQueries: string[];
  onBriefingTakeAction: (insightId: string) => void;
  onBriefingExplore: (insightId: string) => void;
  onSuggestedQueryPick: (query: string) => void;
  brandColor?: string;
  /** For aria-labelledby */
  titleId: string;
};

const NO_EXECUTED: readonly BriefingInsightId[] = [];

function TodoRow({
  index,
  task,
  brandColor,
  onBriefingTakeAction,
  onBriefingExplore,
  onSuggestedQueryPick,
}: {
  index: number;
  task: MergedTodayTodo;
  brandColor: string;
  onBriefingTakeAction: (id: string) => void;
  onBriefingExplore: (id: string) => void;
  onSuggestedQueryPick: (q: string) => void;
}) {
  const n = index + 1;
  const circleClass =
    index % 2 === 0
      ? 'bg-orange-500 text-white'
      : 'bg-amber-500 text-white';

  const isCritical = task.kind === 'briefing' && task.insightId === 'insight-5';

  return (
    <Collapsible
      className={
        isCritical
          ? 'rounded-[8px] border border-rose-200 bg-rose-50/40 shadow-sm ring-1 ring-rose-200/80'
          : 'rounded-[8px] border border-gray-200 bg-white shadow-sm'
      }
    >
      <CollapsibleTrigger className="flex w-full items-center gap-3 px-3 py-2.5 text-left outline-none transition-colors hover:bg-gray-50/80 data-[state=open]:border-b data-[state=open]:border-gray-100 [&[data-state=open]_svg]:rotate-180">
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold leading-none',
            isCritical ? 'bg-rose-600 text-white' : circleClass,
          )}
          aria-hidden
        >
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="text-xs font-semibold leading-snug text-gray-900 line-clamp-2">{task.headline}</p>
            {isCritical ? (
              <span className="shrink-0 rounded bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                High priority
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[11px] text-gray-500">{task.sourceLabel}</p>
        </div>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200"
          strokeWidth={2}
          aria-hidden
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-gray-100 bg-gray-50/50 px-3 py-3">
        <p className="text-[11px] leading-relaxed text-gray-700">{task.detail}</p>
        {task.kind === 'briefing' ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-gray-400">{task.timeLabel}</span>
            <div className="ml-auto flex flex-wrap gap-1.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onBriefingTakeAction(task.insightId)}
                className="rounded-md px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: brandColor }}
              >
                Take action
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onBriefingExplore(task.insightId)}
                className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                Explore
              </button>
            </div>
          </div>
        ) : null}
        {task.kind === 'suggested' ? (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSuggestedQueryPick(task.query)}
              className="rounded-md px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: brandColor }}
            >
              Ask
            </button>
          </div>
        ) : null}
        {task.kind === 'operational' ? (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSuggestedQueryPick(task.askPrompt)}
              className="rounded-md px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: brandColor }}
            >
              Ask
            </button>
          </div>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function TodayPanel({
  executedBriefingInsightIds,
  suggestedQueries,
  onBriefingTakeAction,
  onBriefingExplore,
  onSuggestedQueryPick,
  brandColor = '#0069D1',
  titleId,
}: TodayPanelProps) {
  const hidden = executedBriefingInsightIds ?? NO_EXECUTED;
  const tasks = React.useMemo(
    () => buildMergedTodayTodos(hidden, suggestedQueries),
    [hidden, suggestedQueries],
  );
  const taskCount = tasks.length;

  return (
    <div
      id="ambient-cfo-today-panel"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="pointer-events-auto flex max-h-[min(420px,55vh)] w-full flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl"
    >
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-gray-100 pb-2">
        <h2 id={titleId} className="text-sm font-bold text-gray-900">
          Today&apos;s to do
        </h2>
        {taskCount > 0 ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            {taskCount} task{taskCount === 1 ? '' : 's'}
          </span>
        ) : null}
      </div>

      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pr-0.5">
        <section aria-label="Today's to do">
          {taskCount === 0 ? (
            <div className="rounded-[8px] border border-emerald-100 bg-emerald-50/50 px-3 py-4 text-center">
              <p className="text-xs font-semibold text-gray-900">You&apos;re caught up</p>
              <p className="mt-1 text-[11px] leading-snug text-gray-600">
                Nothing needs your attention right now. New tasks will show up here when Firm Intelligence or your agents find
                something to review.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {tasks.map((task, index) => (
                <li key={task.key}>
                  <TodoRow
                    index={index}
                    task={task}
                    brandColor={brandColor}
                    onBriefingTakeAction={onBriefingTakeAction}
                    onBriefingExplore={onBriefingExplore}
                    onSuggestedQueryPick={onSuggestedQueryPick}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
