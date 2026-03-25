/** Rich copy for `open_dialog` explore actions (Financial Health + a few AI widgets). */

export type FinanceWidgetExploreCopy = {
  title: string;
  subtitle?: string;
  bullets: string[];
  /** Optional second step from the dialog */
  followUp?: {
    label: string;
    reportName?: string;
    pageId?: string;
  };
};

export const FINANCE_WIDGET_EXPLORE_COPY: Record<string, FinanceWidgetExploreCopy> = {
  fho_firm_goals_detail: {
    title: 'Firm goals in context',
    subtitle: 'Progress bars tie to net revenue, collections, and reserve targets.',
    bullets: [
      'Alerts and recommendations elsewhere in the product are filtered through these declared goals.',
      'When a goal slips, Firm Intelligence prioritizes actions that move the metric—not noise.',
      'Adjust goals on the Financial Goals page when strategy shifts.',
    ],
    followUp: { label: 'Go to Financial Goals', pageId: 'Financial Goals' },
  },
  fho_operating_cash_detail: {
    title: 'Operating cash bridge',
    subtitle: 'Understand what moved cash this period vs your policy reserve.',
    bullets: [
      'Bridge tables connect headline cash to billing, payroll, and timing effects.',
      'Pair this view with Cash Flow Statement when you need transaction-level proof.',
      'Scenario modelling on the strategic dashboard shows stress paths against the same baseline.',
    ],
    followUp: { label: 'Open Cash Flow Statement', reportName: 'Cash Flow Statement' },
  },
  fho_revenue_detail: {
    title: 'Revenue and pipeline',
    subtitle: 'Recognized revenue plus Grow pipeline context for forward visibility.',
    bullets: [
      'Compare recognized revenue streams to targets and peer-style benchmarks where enabled.',
      'Use P&L for account-level rollups; this card stays executive-readable.',
    ],
    followUp: { label: 'Open Profit and Loss', reportName: 'Profit and Loss' },
  },
  fho_ar_at_risk_detail: {
    title: 'Collections and AR risk',
    subtitle: 'Overdue concentration and per-matter signals for partner judgment.',
    bullets: [
      '60+ buckets highlight where reminders or fee conversations are due.',
      'Drill to A/R Aging for the full ledger-style breakout when finance needs detail.',
    ],
    followUp: { label: 'Open A/R Aging', reportName: 'A/R Aging' },
  },
  fho_runway_detail: {
    title: 'Runway narrative',
    subtitle: 'Months of coverage against burn—with goal-linked interpretation.',
    bullets: [
      'Trend lines reflect your strategic baseline; modelling overlays show scenario paths.',
      'The 2026 Strategic Roadmap page layers cash, burn, and runway together.',
    ],
    followUp: { label: 'Open strategic dashboard', pageId: 'fp_default' },
  },
  fho_iolta_trust_detail: {
    title: 'IOLTA and trust posture',
    subtitle: 'Compliance-oriented snapshot alongside operating health.',
    bullets: [
      'Trust balances are separated from operating cash in narrative and alerts.',
      'Use this card before closes to confirm checklist items with your bookkeeper.',
    ],
  },
  fho_unbilled_detail: {
    title: 'Unbilled WIP',
    subtitle: 'Aged WIP and matter-level ranking to prioritize invoicing.',
    bullets: [
      'High WIP aging often predicts future cash—pair with collection goals on Financial Goals.',
      'Billing Health on the strategic page complements this operational lens.',
    ],
    followUp: { label: 'Open Profit and Loss', reportName: 'Profit and Loss' },
  },
  digital_twin: {
    title: 'Digital Twin scenarios',
    subtitle: 'Stress-test hiring, rates, and departures against your baseline model.',
    bullets: [
      'Pick a starter scenario to jump to the strategic dashboard with modelling in context.',
      'Firm Intelligence interprets narrative scenarios into burn and runway paths.',
    ],
    followUp: { label: 'Open strategic dashboard', pageId: 'fp_default' },
  },
  suggested_modelling: {
    title: 'Suggested Modelling',
    subtitle: 'Preview scenarios on Cash, Burn, and Runway—then link plans to Financial Goals.',
    bullets: [
      'Preview toggles an overlay on strategic charts; peer benchmark adds a composite band.',
      'Explore opens a scenario plan with modelled outcomes and alternatives before you commit.',
      'Execute recommended plan promotes the model to Financial Goals for ongoing tracking.',
    ],
    followUp: { label: 'View Financial Goals', pageId: 'Financial Goals' },
  },
};

export function getFinanceWidgetExploreCopy(widgetId: string): FinanceWidgetExploreCopy | null {
  return FINANCE_WIDGET_EXPLORE_COPY[widgetId] ?? null;
}
