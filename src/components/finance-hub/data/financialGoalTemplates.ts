export type FirmGoalValueFormat = 'currency' | 'percent' | 'days';

export type FinancialGoalTemplateCategory =
  | 'Revenue'
  | 'Profitability'
  | 'Liquidity'
  | 'Collections'
  | 'Efficiency';

export type FinancialGoalTemplate = {
  id: string;
  category: FinancialGoalTemplateCategory;
  label: string;
  description: string;
  valueFormat: FirmGoalValueFormat;
  /** Default metric line shown under the goal name */
  metricHintSeed: string;
};

/**
 * Canonical list of financial goal types users can select when defining a firm goal.
 */
export const FINANCIAL_GOAL_TEMPLATES: readonly FinancialGoalTemplate[] = [
  {
    id: 'revenue_quarterly',
    category: 'Revenue',
    label: 'Quarterly revenue target',
    description: 'Billed revenue for a fiscal quarter vs a dollar target.',
    valueFormat: 'currency',
    metricHintSeed: 'Quarter billed revenue vs target',
  },
  {
    id: 'revenue_annual',
    category: 'Revenue',
    label: 'Annual revenue target',
    description: 'Full-year recognized revenue vs a dollar target.',
    valueFormat: 'currency',
    metricHintSeed: 'Annual recognized revenue vs target',
  },
  {
    id: 'revenue_yoy_growth',
    category: 'Revenue',
    label: 'Year-over-year revenue growth',
    description: 'Percentage growth in revenue vs prior year.',
    valueFormat: 'percent',
    metricHintSeed: 'YoY revenue growth % vs target',
  },
  {
    id: 'gross_margin',
    category: 'Profitability',
    label: 'Gross margin',
    description: 'Gross profit as a percentage of revenue.',
    valueFormat: 'percent',
    metricHintSeed: 'Gross margin % (revenue − COGS)',
  },
  {
    id: 'operating_margin',
    category: 'Profitability',
    label: 'Operating margin',
    description: 'Operating income as a percentage of revenue.',
    valueFormat: 'percent',
    metricHintSeed: 'Operating income ÷ gross revenue',
  },
  {
    id: 'net_income',
    category: 'Profitability',
    label: 'Net income target',
    description: 'Firm net income vs a dollar target.',
    valueFormat: 'currency',
    metricHintSeed: 'Net income vs target (after tax)',
  },
  {
    id: 'cash_runway_days',
    category: 'Liquidity',
    label: 'Cash runway (days)',
    description: 'Operating cash divided by average daily burn.',
    valueFormat: 'days',
    metricHintSeed: 'Operating cash ÷ average daily burn',
  },
  {
    id: 'operating_cash_reserve',
    category: 'Liquidity',
    label: 'Operating cash reserve',
    description: 'Minimum operating account balance vs a dollar target.',
    valueFormat: 'currency',
    metricHintSeed: 'Operating account balance vs reserve target',
  },
  {
    id: 'collection_rate',
    category: 'Collections',
    label: 'Collection rate',
    description: 'Share of invoiced amounts collected within a policy window.',
    valueFormat: 'percent',
    metricHintSeed: '% of invoices collected within policy days',
  },
  {
    id: 'dso_days',
    category: 'Collections',
    label: 'Days sales outstanding (DSO)',
    description: 'Average days from invoice to cash.',
    valueFormat: 'days',
    metricHintSeed: 'Firmwide invoice-to-cash (rolling 90 days)',
  },
  {
    id: 'ar_reduction',
    category: 'Collections',
    label: 'Reduce outstanding A/R',
    description: 'Dollar reduction in aged receivables vs baseline.',
    valueFormat: 'currency',
    metricHintSeed: 'A/R balance vs reduction target',
  },
  {
    id: 'expense_ratio',
    category: 'Efficiency',
    label: 'Expense ratio',
    description: 'Operating expenses as a percentage of revenue.',
    valueFormat: 'percent',
    metricHintSeed: 'OpEx ÷ revenue',
  },
  {
    id: 'realization_rate',
    category: 'Efficiency',
    label: 'Realization rate',
    description: 'Collected fees as a percentage of standard rates.',
    valueFormat: 'percent',
    metricHintSeed: 'Collected ÷ standard value of time',
  },
] as const;

export function getFinancialGoalTemplate(templateId: string): FinancialGoalTemplate | undefined {
  return FINANCIAL_GOAL_TEMPLATES.find((t) => t.id === templateId);
}
