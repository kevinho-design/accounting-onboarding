/**
 * Prototype operational tasks for Today's to do (exception-first bookkeeping / agents).
 */

export type TodayOperationalTodo = {
  id: string;
  headline: string;
  sourceLabel: string;
  detail: string;
  /** Sent to Firm Intelligence when user taps Ask */
  askPrompt: string;
};

export const TODAY_OPERATIONAL_TODOS: readonly TodayOperationalTodo[] = [
  {
    id: 'op-dup-vendors',
    headline: '8 possible duplicate vendors to merge',
    sourceLabel: 'Trust Compliance Agent',
    detail:
      'We matched vendor names and tax IDs across operating and trust spend. Review the merge suggestions before next close so 1099s stay clean.',
    askPrompt: 'Show me the 8 possible duplicate vendors to merge and recommended actions.',
  },
  {
    id: 'op-uncat-tx',
    headline: '4 transactions need a category',
    sourceLabel: 'Matching Agent',
    detail:
      'Bank feed items from the last sync are waiting for a category. Most are low-confidence software and travel charges.',
    askPrompt: 'List the 4 uncategorized transactions and suggest categories.',
  },
  {
    id: 'op-iolta',
    headline: '2 IOLTA trust items flagged',
    sourceLabel: 'Trust Compliance Agent',
    detail:
      'One transfer is near the retainer floor; one deposit lacks matter coding. Resolve before trust reconciliation.',
    askPrompt: 'Summarize the 2 flagged IOLTA trust items and next steps.',
  },
  {
    id: 'op-ar-overdue',
    headline: '3 high-risk invoices overdue 12+ days',
    sourceLabel: 'Collections Agent',
    detail:
      'Concentrated in two matters. Draft collection reminders are ready; sending would move days-to-collect toward your goal.',
    askPrompt: 'Which invoices are high-risk and overdue 12+ days, and what should I do?',
  },
  {
    id: 'op-recon',
    headline: 'Bank reconciliation has unmatched transactions',
    sourceLabel: 'Matching Agent',
    detail:
      'Six lines on the operating account did not auto-match. Three look like payroll timing; three need your judgment.',
    askPrompt: 'Walk me through unmatched bank reconciliation transactions and how to clear them.',
  },
  {
    id: 'op-runway',
    headline: 'Cash runway below 90-day target',
    sourceLabel: 'Revenue Forecasting Skill',
    detail:
      'Trailing burn and AR aging imply runway under your firm goal unless collections improve or spend adjusts. Scenario modelling is available in Finances.',
    askPrompt: 'Explain cash runway vs our 90-day target and the top levers to improve it.',
  },
];
