import * as React from 'react';
import type { FirmGoalDashboardCard } from '../data/firmGoals';

type FirmGoalsCardListProps = {
  goals: readonly FirmGoalDashboardCard[];
  gridClassName?: string;
  cardClassName?: string;
  onReviewGoal?: (goalId: string) => void;
};

export function FirmGoalsCardList({
  goals,
  gridClassName = 'grid grid-cols-4 gap-3',
  cardClassName = 'p-4 bg-background rounded-xl',
  onReviewGoal,
}: FirmGoalsCardListProps) {
  return (
    <div className={gridClassName}>
      {goals.map((goal) => (
        <div key={goal.id} className={cardClassName}>
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground/80">{goal.goal}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{goal.templateLabel}</p>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                goal.status === 'on-track' ? 'bg-green-500' : goal.status === 'behind' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-xl font-bold text-foreground">{goal.current}</span>
            <span className="text-xs text-muted-foreground">of {goal.target}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1 mb-2">
            <div
              className={`h-1 rounded-full ${
                goal.status === 'on-track' ? 'bg-green-500' : goal.status === 'behind' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${goal.progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">{goal.insight}</p>
          {onReviewGoal ? (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => onReviewGoal(goal.id)}
                className="rounded-[6px] border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
              >
                Review
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
