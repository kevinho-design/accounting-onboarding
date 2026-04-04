/**
 * Supplemental detail for Financial Health Overview Finances page.
 * Headline KPI numbers and dashboard cards come from `homeDashboardSeed` / `firmGoals` (imported in widgets).
 */

import { FIRM_NAME } from './prototypePersona';

/** Extended runway narrative (dashboard KPI k4 shows “74 Days” and badges). */
export const FHO_RUNWAY_NARRATIVE = {
  body:
    'Trending down from 91 days last month as collections timing stretched on two large matters. Clio Accounting ties this to your minimum 60-day operating reserve goal — closing the AR gap below moves the runway dial fastest.',
  priorMonthDays: 91,
} as const;

/** Prototype series for the Runway detail mini-chart (days of runway). Last point matches KPI k4. */
export const FHO_RUNWAY_TREND: { month: string; days: number }[] = [
  { month: 'Oct', days: 96 },
  { month: 'Nov', days: 93 },
  { month: 'Dec', days: 89 },
  { month: 'Jan', days: 87 },
  { month: 'Feb', days: 91 },
  { month: 'Mar', days: 74 },
];

/** Aligns with k4 “-16 days from goal” when current runway is 74 days. */
export const FHO_RUNWAY_GOAL_DAYS = 90;

export type FhoArInvoiceRow = {
  id: string;
  client: string;
  matterRef: string;
  amount: string;
  daysOverdue: number;
};

/** 60+ overdue; amounts align with dashboard AR at Risk ~$73,700. */
export const FHO_AR_INVOICE_ROWS: FhoArInvoiceRow[] = [
  { id: 'inv1', client: 'Acme Corp', matterRef: 'IP dispute — inv. #4482', amount: '$31,200', daysOverdue: 67 },
  { id: 'inv2', client: 'Harbor LLC', matterRef: 'Contract review — inv. #4411', amount: '$22,600', daysOverdue: 58 },
  { id: 'inv3', client: 'Summit RE Holdings', matterRef: 'Closing — inv. #4398', amount: '$19,900', daysOverdue: 52 },
];

export const FHO_OPERATING_CASH_BRIDGE = [
  { label: 'Primary operating account', amount: '$128,400' },
  { label: 'Secondary operating / payroll float', amount: '$18,200' },
  { label: 'In-transit deposits (next 48h)', amount: '$6,247' },
  { label: 'Less: scheduled outbound (ACH)', amount: '−$10,000' },
] as const;

export const FHO_OPERATING_CASH_NOTE =
  'Operating cash excludes IOLTA client funds (shown under Trust). +8% MoM reflects stronger collections in the first half of the month offset by two deferred retainer transfers.';

export type FhoRevenuePracticeRow = { practice: string; sharePct: number; recognized: string; note: string };

export const FHO_REVENUE_PRACTICE_MIX: FhoRevenuePracticeRow[] = [
  { practice: 'Corporate', sharePct: 38, recognized: '$108,100', note: '+14% vs plan MTD' },
  { practice: 'Litigation', sharePct: 29, recognized: '$82,500', note: 'Flat vs prior month' },
  { practice: 'Real estate', sharePct: 21, recognized: '$59,700', note: '+9% — two closings pulled forward' },
  { practice: 'Other', sharePct: 12, recognized: '$34,200', note: 'Advisory + flat-fee mix' },
];

/** Forward pipeline subsection inside Revenue detail (Clio Grow). */
export const FHO_GROW_PIPELINE = {
  headline: 'Forward pipeline (Clio Grow)',
  days60: { label: 'Next 60 days', amount: '$412,000', note: 'Weighted by stage & historical conversion' },
  days90: { label: 'Next 90 days', amount: '$638,000', note: 'Includes contingent matters at 60% probability' },
  footer: 'Synced from Clio Grow — refreshed when pipeline stages change.',
} as const;

/** Short margin context (replaces standalone profit-margin widget). */
export const FHO_REVENUE_MARGIN_CONTEXT =
  'Trailing operating margin is ~21.5% on recognized revenue after standard matter loads. Margin pressure this quarter is mostly timing (revenue recognition vs. payroll cycle), not structural rate erosion.';

export type FhoCollectionRiskClient = {
  id: string;
  name: string;
  riskLabel: 'High' | 'Elevated' | 'Watch';
  score: number;
  rationale: string;
};

export const FHO_COLLECTION_RISK = {
  score: 42,
  scoreLabel: 'Moderate collection risk',
  summary:
    'Weighted from payment velocity, DSO trend, and matter-type history. Patterns below explain why 60+ AR is concentrated on a small set of clients.',
  clients: [
    {
      id: 'c1',
      name: 'Acme Corp',
      riskLabel: 'High' as const,
      score: 78,
      rationale: 'Historically pays 18–24 days after terms; two invoices currently 45+.',
    },
    {
      id: 'c2',
      name: 'Harbor LLC',
      riskLabel: 'Elevated' as const,
      score: 61,
      rationale: 'Slowed from net-30 to net-45 equivalent over the last two quarters.',
    },
    {
      id: 'c3',
      name: 'Summit RE Holdings',
      riskLabel: 'Watch' as const,
      score: 44,
      rationale: 'Usually on time; recent partial payments suggest cash timing stress.',
    },
    {
      id: 'c4',
      name: 'Northline Medical Group',
      riskLabel: 'Watch' as const,
      score: 38,
      rationale: 'Stable payer but high concentration — single delay would move firm DSO.',
    },
  ] as FhoCollectionRiskClient[],
};

export const FHO_IOLTA_CHECKLIST = [
  { label: 'Three-way reconciliation (bank / ledger / client)', status: 'Complete' },
  { label: 'Positive pay / exception queue', status: '0 items' },
  { label: 'Interest allocation to IOLTA program', status: 'Current' },
  { label: 'Client ledger sub-accounts in sync', status: '47 active' },
] as const;

export type FhoUnbilledMatterRow = {
  id: string;
  matter: string;
  amount: string;
  ageLabel: string;
  rank: number;
};

/**
 * Top matters match Dashboard `unbilledTimeCard`; additional rows show deeper aging (same as prior billing-gap widget).
 */
export const FHO_UNBILLED_MATTER_ROWS: FhoUnbilledMatterRow[] = [
  { id: 'u1', matter: 'Venture Partners M&A', amount: '$18,200', ageLabel: '120+ days WIP', rank: 1 },
  { id: 'u2', matter: 'Tech Startup Inc', amount: '$12,400', ageLabel: '90+ days WIP', rank: 2 },
  { id: 'u3', matter: 'Harbor LLC', amount: '$8,900', ageLabel: '75 days WIP', rank: 3 },
  { id: 'u4', matter: 'Northline — employment', amount: '$7,200', ageLabel: '45 days WIP', rank: 4 },
  { id: 'u5', matter: 'Metro Transit — discovery', amount: '$5,800', ageLabel: 'Ready to pre-bill', rank: 5 },
];

export type FhoCashFlowMonth = {
  month: string;
  billableHoursValue: number;
  realizedRevenue: number;
  realization: number;
  insight?: string;
  ctaLabel?: string;
  ctaAction?: string;
};

export const FHO_CASH_FLOW_MONTHLY: FhoCashFlowMonth[] = [
  {
    month: 'Oct',
    billableHoursValue: 298_400,
    realizedRevenue: 241_600,
    realization: 0.81,
    insight: 'Strong collections month — litigation settlements drove above-average realization.',
  },
  {
    month: 'Nov',
    billableHoursValue: 276_200,
    realizedRevenue: 214_800,
    realization: 0.78,
    insight: 'Holiday slowdown reduced billable output; collections held steady from October invoices.',
  },
  {
    month: 'Dec',
    billableHoursValue: 254_800,
    realizedRevenue: 198_700,
    realization: 0.78,
    insight: 'Year-end billing push offset by deferred client payments into Q1.',
  },
  {
    month: 'Jan',
    billableHoursValue: 312_600,
    realizedRevenue: 237_400,
    realization: 0.76,
    insight: 'Ramp-up after holidays; two large retainer deposits boosted billable value but collections lagged.',
    ctaLabel: 'Review aging invoices',
    ctaAction: 'navigate_ar',
  },
  {
    month: 'Feb',
    billableHoursValue: 328_100,
    realizedRevenue: 268_200,
    realization: 0.82,
    insight: 'Best realization rate in three months — accelerated collections on corporate matters.',
  },
  {
    month: 'Mar',
    billableHoursValue: 342_500,
    realizedRevenue: 284_500,
    realization: 0.83,
    insight: 'Revenue trending up but two large invoices ($53K combined) remain outstanding past 60 days.',
    ctaLabel: 'Follow up on overdue',
    ctaAction: 'navigate_ar',
  },
];

export function fhoPersonalizationCopy(userFirstName: string): string {
  return `${userFirstName}, this page expands each block from your Dashboard Financial Health section — same headline numbers as the home cards, with deeper Clio Accounting breakdowns for ${FIRM_NAME}. Add or remove widgets anytime from Customize page.`;
}
