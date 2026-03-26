import * as React from 'react';
import { Sparkles, Trash2, TrendingUp } from 'lucide-react';
import {
  FINANCIAL_GOAL_TEMPLATES,
  getFinancialGoalTemplate,
  type FirmGoalDefinition,
} from '../data/firmGoals';
import type { FinancialGoalTemplateCategory } from '../data/financialGoalTemplates';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const TEMPLATE_CATEGORY_ORDER: readonly FinancialGoalTemplateCategory[] = [
  'Revenue',
  'Profitability',
  'Liquidity',
  'Collections',
  'Efficiency',
];

type GoalOptimizationModalProps = {
  open: boolean;
  goal: FirmGoalDefinition | null;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: {
    title: string;
    goalTemplateId: string;
    targetValue: number;
    targetDeadline: string;
  }) => void;
  onDelete?: () => void;
};

function formatBenchmark(value: number, format: FirmGoalDefinition['valueFormat']): string {
  if (format === 'currency') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  }
  if (format === 'percent') return `${value}%`;
  return `${value} days`;
}

function targetFieldLabel(format: FirmGoalDefinition['valueFormat']): string {
  if (format === 'currency') return 'Target amount';
  if (format === 'percent') return 'Target (%)';
  return 'Target (days)';
}

export function GoalOptimizationModal({
  open,
  goal,
  onOpenChange,
  onSave,
  onDelete,
}: GoalOptimizationModalProps) {
  const [draftTitle, setDraftTitle] = React.useState('');
  const [draftGoalTemplateId, setDraftGoalTemplateId] = React.useState('');
  const [draftTargetValue, setDraftTargetValue] = React.useState<number>(0);
  const [draftDeadline, setDraftDeadline] = React.useState<string>('');

  React.useEffect(() => {
    if (!goal) return;
    setDraftTitle(goal.title);
    setDraftGoalTemplateId(goal.goalTemplateId);
    setDraftTargetValue(goal.targetValue);
    setDraftDeadline(goal.targetDeadline);
  }, [goal]);

  const dialogOpen = Boolean(open && goal);

  const handleDelete = () => {
    if (!onDelete || !goal) return;
    if (!window.confirm('Delete this goal? It will be removed from Financial Health and your Dashboard goal strip.')) {
      return;
    }
    onDelete();
    onOpenChange(false);
  };

  const effectiveTemplate = goal ? getFinancialGoalTemplate(draftGoalTemplateId) : undefined;
  const effectiveFormat = effectiveTemplate?.valueFormat ?? goal?.valueFormat ?? 'currency';

  return (
    <Dialog open={dialogOpen} onOpenChange={onOpenChange}>
      {goal ? (
      <DialogContent className="bg-white border-gray-200 text-gray-900 sm:max-w-[640px] gap-0 p-0 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-6 pb-4 shrink-0 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-900 text-xl">Review & optimize goal</DialogTitle>
            <DialogDescription className="text-gray-600 text-sm">
              Choose what this goal measures, name it for your team, and set targets with benchmark and Ambient CFO
              context.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          <section className="rounded-[8px] border border-gray-200 bg-gray-50/60 p-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Goal definition</h4>
            <div className="mt-3 space-y-3">
              <label className="block text-xs font-semibold text-gray-700">
                Financial goal type
                <select
                  value={draftGoalTemplateId}
                  onChange={(e) => setDraftGoalTemplateId(e.target.value)}
                  className="mt-1 w-full rounded-[8px] border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {TEMPLATE_CATEGORY_ORDER.map((category) => {
                    const inCat = FINANCIAL_GOAL_TEMPLATES.filter((t) => t.category === category);
                    if (inCat.length === 0) return null;
                    return (
                      <optgroup key={category} label={category}>
                        {inCat.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
                {effectiveTemplate ? (
                  <p className="mt-1.5 text-[11px] text-gray-500 leading-snug">{effectiveTemplate.description}</p>
                ) : null}
              </label>
              <label className="block text-xs font-semibold text-gray-700">
                Goal name
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="Name shown on cards and the dashboard"
                  className="mt-1 w-full rounded-[8px] border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[8px] border border-gray-200 bg-gray-50/60 p-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Current goal parameters</h4>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs font-semibold text-gray-700">
                {targetFieldLabel(effectiveFormat)}
                <input
                  type="number"
                  value={draftTargetValue}
                  onChange={(e) => setDraftTargetValue(Number(e.target.value))}
                  className="mt-1 w-full rounded-[8px] border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs font-semibold text-gray-700">
                Target deadline
                <input
                  type="date"
                  value={draftDeadline}
                  onChange={(e) => setDraftDeadline(e.target.value)}
                  className="mt-1 w-full rounded-[8px] border border-gray-300 bg-white px-3 py-2 text-sm"
                />
              </label>
            </div>
          </section>

          <section className="rounded-[8px] border border-gray-200 bg-white p-4">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Peer benchmarking</h4>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-[8px] border border-gray-200 bg-gray-50/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Your trailing average</p>
                <p className="mt-1 font-semibold text-gray-900">
                  {formatBenchmark(goal.benchmark.trailingAverage, effectiveFormat)}
                </p>
              </div>
              <div className="rounded-[8px] border border-blue-200 bg-blue-50/60 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700">
                  Peer average ({goal.benchmark.regionLabel})
                </p>
                <p className="mt-1 font-semibold text-blue-900">
                  {formatBenchmark(goal.benchmark.peerRegionalAverage, effectiveFormat)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[8px] border border-violet-200 bg-violet-50/60 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-700" />
              <h4 className="text-[11px] font-bold text-violet-700 uppercase tracking-widest">Ambient CFO insight</h4>
            </div>
            <p className="mt-3 text-sm text-gray-800 leading-relaxed">{goal.aiOptimization.rationale}</p>
            <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
              <li>Billing velocity: {goal.aiOptimization.billingVelocityNote}</li>
              <li>Operational context: {goal.aiOptimization.operationalChangesNote}</li>
            </ul>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-violet-200 bg-white p-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-violet-700">Recommended target</p>
                <p className="text-base font-bold text-gray-900">
                  {formatBenchmark(goal.aiOptimization.recommendedTargetValue, effectiveFormat)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDraftTargetValue(goal.aiOptimization.recommendedTargetValue)}
                className="inline-flex items-center gap-1 rounded-[8px] border border-violet-200 bg-violet-100 px-3 py-2 text-xs font-semibold text-violet-900 hover:bg-violet-200"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Use AI recommendation
              </button>
            </div>
          </section>
        </div>

        <DialogFooter className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/80 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          {onDelete ? (
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-[8px] border border-red-200 bg-white px-3 text-sm font-medium text-red-700 hover:bg-red-50 order-2 sm:order-1 mr-auto"
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5 shrink-0" />
              Delete goal
            </button>
          ) : (
            <span className="order-2 sm:order-1" />
          )}
          <div className="flex flex-row justify-end gap-2 w-full sm:w-auto order-1 sm:order-2">
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-[8px] border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-[8px] bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              disabled={!draftTitle.trim()}
              onClick={() =>
                onSave({
                  title: draftTitle.trim(),
                  goalTemplateId: draftGoalTemplateId,
                  targetValue: draftTargetValue,
                  targetDeadline: draftDeadline,
                })
              }
            >
              Save goal updates
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
      ) : null}
    </Dialog>
  );
}
