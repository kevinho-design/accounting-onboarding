import type { ProfitLossViewState } from './profitLossReportModel';

export type ProfitLossNlResult =
  | { matched: true; nextState: ProfitLossViewState; assistantMessage: string }
  | { matched: false };

/**
 * Rule-based NL → P&L view state (prototype). No LLM.
 */
export function interpretProfitLossQuery(
  query: string,
  current: ProfitLossViewState,
): ProfitLossNlResult {
  const q = query.toLowerCase().trim();
  if (!q) return { matched: false };

  const payrollWords =
    /\b(payroll|wages|salary|salaries|staff wages|owner wages|benefits|er taxes|staff benefits|retirement|health ins)\b/.test(
      q,
    );
  const lastMonth = /\b(last month|previous month|prior month)\b/.test(q);
  const thisMonth = /\b(this month|current month)\b/.test(q);
  const yoy =
    /\b(year over year|yoy|same (month|period) last year|prior year|last year|year before|compared to last year|comparison to last year|vs\.? last year)\b/.test(
      q,
    );
  const mom = /\b(month over month|mom|vs\.? last month|from last month)\b/.test(q);
  const ytdAsk = /\b(ytd|year to date)\b/.test(q);
  const varianceAsk = /\b(variance|budget|over budget|under budget)\b/.test(q);
  const pctRev = /\b(% of revenue|percent of revenue|vertical analysis|margin on)\b/.test(q);
  const accrual = /\baccrual\b/.test(q);
  const cash =
    /\bcash basis\b|\bcash accounting\b|\bon cash\b/.test(q) && !/\baccrual\b/.test(q);

  if (payrollWords && (lastMonth || yoy || mom || q.includes('comparison') || q.includes('compare'))) {
    const period = lastMonth
      ? 'last_month'
      : thisMonth
        ? 'this_month'
        : ytdAsk
          ? 'ytd'
          : yoy
            ? 'ytd'
            : mom
              ? 'this_month'
              : payrollWords
                ? 'last_month'
                : current.period;
    const comparison = yoy ? 'yoy' : mom ? 'mom' : payrollWords ? 'yoy' : current.comparison;
    const nextState: ProfitLossViewState = {
      ...current,
      period,
      comparison,
      payrollAttribution: 'all',
      highlightPayrollOnly: true,
      showBudgetVariance: varianceAsk ? true : current.showBudgetVariance,
      showPctOfRevenue: pctRev ? true : current.showPctOfRevenue,
      basis: accrual ? 'accrual' : cash ? 'cash' : current.basis,
    };
    const periodLabel =
      nextState.period === 'last_month'
        ? 'Last month'
        : nextState.period === 'this_month'
          ? 'This month'
          : 'Year to date (YTD)';
    const parts = [
      'Applied Profit and Loss filters for your question:',
      `- Period: ${periodLabel}`,
      `- Comparison: ${nextState.comparison === 'yoy' ? 'Year over year' : nextState.comparison === 'mom' ? 'Month over month' : 'Off'}`,
      '- Highlighting payroll-related lines (other rows shown dimmed).',
      nextState.showBudgetVariance ? '- Budget and variance columns are on.' : '',
      nextState.showPctOfRevenue ? '- % of revenue column is on.' : '',
      `- Basis: ${nextState.basis === 'accrual' ? 'Accrual' : 'Cash'}.`,
    ].filter(Boolean);
    return {
      matched: true,
      nextState,
      assistantMessage: parts.join('\n'),
    };
  }

  if (varianceAsk && !payrollWords) {
    return {
      matched: true,
      nextState: {
        ...current,
        showBudgetVariance: true,
        sortByVarianceDesc: true,
        highlightPayrollOnly: false,
      },
      assistantMessage:
        'Turned on budget and variance and sorted expenses by variance so overspend categories float to the top.',
    };
  }

  if (pctRev && !payrollWords) {
    return {
      matched: true,
      nextState: { ...current, showPctOfRevenue: true, highlightPayrollOnly: false },
      assistantMessage: 'Enabled % of revenue (vertical analysis) for each line item.',
    };
  }

  if (accrual || cash) {
    return {
      matched: true,
      nextState: {
        ...current,
        basis: accrual ? 'accrual' : 'cash',
        highlightPayrollOnly: false,
      },
      assistantMessage: `Switched basis to ${accrual ? 'Accrual' : 'Cash'} so the statement matches how you're asking to read performance.`,
    };
  }

  return { matched: false };
}
