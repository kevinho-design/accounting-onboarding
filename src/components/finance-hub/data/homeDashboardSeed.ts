/** Prototype copy for the home Dashboard (migration hero, attention queue, financial health). */

import { firmGoalsOnTrackCount } from './firmGoals';

export type MigrationAgentStatus = 'active' | 'idle';

export type AgentIconTone = 'emerald' | 'ocean' | 'violet' | 'amber' | 'yellow' | 'pink';

export interface MigrationAgent {
  id: string;
  name: string;
  status: MigrationAgentStatus;
  tone: AgentIconTone;
}

export const migrationAgents: MigrationAgent[] = [
  { id: 'a1', name: 'Trust Compliance Agent', status: 'active', tone: 'emerald' },
  { id: 'a2', name: 'Matching Agent', status: 'active', tone: 'ocean' },
  { id: 'a3', name: 'Revenue Forecasting Skill', status: 'active', tone: 'violet' },
  { id: 'a4', name: 'Matter Profitability Skill', status: 'idle', tone: 'amber' },
  { id: 'a5', name: 'Collections Agent', status: 'active', tone: 'yellow' },
  { id: 'a6', name: 'Cash Flow Agent', status: 'active', tone: 'pink' },
];

export interface MigrationMetric {
  id: string;
  label: string;
  pctLabel?: string;
  /** When no percentage (e.g. "14 Items Requiring Review") */
  highlight?: string;
}

export const migrationMetrics: MigrationMetric[] = [
  { id: 'm1', label: '34,279 of 34,520 Transactions Mapped', pctLabel: '99.3%' },
  { id: 'm2', label: '49 of 52 Accounts Configured', pctLabel: '94.2%' },
  { id: 'm3', label: '127 Vendors Enriched', pctLabel: '100%' },
  { id: 'm4', label: '14 Items Requiring Review', highlight: '14' },
];

export interface AttentionItem {
  id: string;
  title: string;
  subtitle: string;
  callout: string;
  primaryCta: string;
}

export const attentionItems: AttentionItem[] = [
  {
    id: 'att1',
    title: '8 possible duplicate vendors to merge',
    subtitle: 'Trust Compliance Agent • 04:33 PM',
    callout:
      'We detected vendor names that likely refer to the same payee. Merging reduces compliance risk and cleans reporting.',
    primaryCta: 'Review & merge vendors',
  },
  {
    id: 'att2',
    title: '4 transactions need a category',
    subtitle: 'Matching Agent • 04:35 PM',
    callout:
      'These line items imported without a GL category. Assigning categories keeps P&L and matter views accurate.',
    primaryCta: 'Categorize transactions',
  },
  {
    id: 'att3',
    title: '2 IOLTA trust items flagged',
    subtitle: 'Trust Compliance Agent • 04:37 PM',
    callout: 'Ledger movements don’t match the three-way check pattern. Review suggested fixes before your next reconciliation.',
    primaryCta: 'Apply pre-drafted fixes',
  },
  {
    id: 'att4',
    title: '1 bank feed connection needs re-auth',
    subtitle: 'Cash Flow Agent • 04:40 PM',
    callout: 'The operating account feed expired. Reconnect to keep cash and runway projections current.',
    primaryCta: 'Reconnect bank',
  },
  {
    id: 'att5',
    title: '3 invoices over 90 days — payment plan suggested',
    subtitle: 'Collections Agent • 04:42 PM',
    callout: 'High-balance clients show declining payment velocity. A templated plan is ready to send.',
    primaryCta: 'Review collections plan',
  },
  {
    id: 'att6',
    title: 'Matter WIP exceeds policy for 2 files',
    subtitle: 'Matter Profitability Skill • 04:45 PM',
    callout: 'Unbilled time on these matters is above your firm’s aging threshold. Consider billing or write-off.',
    primaryCta: 'Review aged WIP',
  },
];

export const attentionSectionTotal = attentionItems.length;

export type KpiBadgeVariant = 'success' | 'warning' | 'neutral' | 'opportunity';

export interface FinancialKpi {
  id: string;
  title: string;
  value: string;
  sublabel?: string;
  badge: { label: string; variant: KpiBadgeVariant };
  footnote?: string;
  extraBadges?: { label: string; variant: KpiBadgeVariant }[];
  /** 'sparkline' | 'bars' | 'stackedBars' | 'radial' */
  viz: 'sparkline' | 'bars' | 'stackedBars' | 'radial';
  vizMeta?: { radialPct?: number };
}

export const financialKpis: FinancialKpi[] = [
  {
    id: 'k1',
    title: 'Operating Cash',
    value: '$142,847',
    badge: { label: 'HEALTHY', variant: 'success' },
    footnote: '+8% MoM',
    viz: 'sparkline',
  },
  {
    id: 'k2',
    title: 'Revenue',
    value: '$284,500',
    badge: { label: 'ON TRACK', variant: 'success' },
    footnote: '+12% MoM',
    viz: 'bars',
  },
  {
    id: 'k3',
    title: 'AR at Risk',
    sublabel: '60+ Days Overdue',
    value: '$73,700',
    badge: { label: 'BEHIND GOAL', variant: 'warning' },
    extraBadges: [{ label: '3 invoices', variant: 'neutral' }],
    viz: 'stackedBars',
  },
  {
    id: 'k4',
    title: 'Runway',
    value: '74 Days',
    badge: { label: 'BEHIND GOAL', variant: 'warning' },
    extraBadges: [{ label: '-16 days from goal', variant: 'warning' }],
    viz: 'radial',
    vizMeta: { radialPct: 82 },
  },
];

const _goalsCount = firmGoalsOnTrackCount();

export const goalsSummary = {
  label: 'Firm Financial Goals',
  onTrack: _goalsCount.onTrack,
  total: _goalsCount.total,
  /** Shown next to “X of Y on track” on the home dashboard */
  atRiskLine: '1 behind pace (days-to-collect)',
};

export const ioltaTrustCard = {
  bankBalance: '$89,234.67',
  clientLedgers: '$89,234.67',
  complianceBadge: 'MA COMPLIANT',
  footer: 'Three-way reconciled • Last check: 2 min ago',
};

export interface AgedMatterRow {
  name: string;
  amount: string;
}

export const unbilledTimeCard = {
  value: '$52,500',
  sublabel: '90+ Days Aged',
  opportunityBadge: 'OPPORTUNITY',
  topMatters: [
    { name: 'Venture Partners M&A', amount: '$18,200' },
    { name: 'Tech Startup Inc', amount: '$12,400' },
    { name: 'Harbor LLC', amount: '$8,900' },
  ] as AgedMatterRow[],
};

export const migrationHeroCopy = {
  title: 'Migration Complete',
  body:
    'Your financial team started monitoring immediately. During migration, they already found 3 things that need your attention — see below.',
};
