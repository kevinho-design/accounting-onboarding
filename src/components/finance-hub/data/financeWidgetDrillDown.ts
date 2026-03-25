import type { BriefingInsightId } from './briefingPanelContent';

/** Result of resolving a footer CTA for a Finances canvas widget */
export type FinanceWidgetExploreAction =
  | { type: 'noop' }
  | { type: 'navigate_report'; reportName: string; label: string }
  | { type: 'navigate_page'; pageId: string; label: string }
  | { type: 'open_dialog'; label: string }
  | { type: 'teammate_prompt'; prompt: string; label: string }
  | { type: 'briefing_explore'; insightId: BriefingInsightId; label: string };

export function isFinanceWidgetExploreNoop(a: FinanceWidgetExploreAction): boolean {
  return a.type === 'noop';
}

/**
 * Maps each catalog widget to a prototype “explore” destination.
 * `embedded_report` uses `reportName` from the placed widget.
 */
export function getFinanceWidgetExploreAction(
  widgetId: string,
  options?: { reportName?: string | null },
): FinanceWidgetExploreAction {
  if (widgetId === 'embedded_report') {
    const rn = options?.reportName?.trim();
    if (!rn) return { type: 'noop' };
    return { type: 'navigate_report', reportName: rn, label: 'Open full report' };
  }

  switch (widgetId) {
    case 'fho_firm_goals_detail':
    case 'fho_operating_cash_detail':
    case 'fho_revenue_detail':
    case 'fho_ar_at_risk_detail':
    case 'fho_runway_detail':
    case 'fho_iolta_trust_detail':
    case 'fho_unbilled_detail':
      return { type: 'open_dialog', label: 'Explore details' };

    case 'runway':
    case 'cash_flow':
    case 'strat_cash':
    case 'strat_burn':
    case 'strat_runway':
      return { type: 'navigate_page', pageId: 'fp_default', label: 'Open strategic dashboard' };

    case 'ar_aging':
      return { type: 'navigate_report', reportName: 'A/R Aging', label: 'Open A/R Aging report' };

    case 'ambient_cfo':
      return { type: 'briefing_explore', insightId: 'insight-1', label: 'Explore insights' };

    case 'digital_twin':
      return { type: 'open_dialog', label: 'Explore scenarios' };

    case 'suggested_modelling':
      return { type: 'open_dialog', label: 'How modelling works' };

    case 'expense_rep':
    case 'expense_stacked_trend':
      return { type: 'navigate_report', reportName: 'Expense by Category', label: 'Open expense report' };

    case 'rev_target':
    case 'revenue_streams_trend':
    case 'profitability_margin':
    case 'billing_health':
    case 'partner_realization':
      return { type: 'navigate_report', reportName: 'Profit and Loss', label: 'Open P&L report' };

    case 'financial_goals':
      return { type: 'navigate_page', pageId: 'Financial Goals', label: 'View Financial Goals' };

    case 'practice_areas':
      return {
        type: 'navigate_report',
        reportName: 'Revenue by Practice Area',
        label: 'Open practice area revenue',
      };

    case 'collection_trends':
      return { type: 'navigate_report', reportName: 'Cash Flow Statement', label: 'Open cash flow report' };

    default:
      return { type: 'noop' };
  }
}
