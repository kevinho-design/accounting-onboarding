/** Static copy for This Week's Briefing side panels (Explore Data + Take Action context). */

import type { DrillDownNode } from './drillDownLadder';
import { USER_FIRST_NAME } from './prototypePersona';
import {
  drillDownRootInsight1,
  drillDownRootInsight2,
  drillDownRootInsight3,
  drillDownRootInsight4,
} from './drillDownExploreRoots';

export type BriefingInsightId = 'insight-1' | 'insight-2' | 'insight-3' | 'insight-4' | 'insight-5';

export function isBriefingInsightId(id: string): id is BriefingInsightId {
  return id === 'insight-1' || id === 'insight-2' || id === 'insight-3' || id === 'insight-4' || id === 'insight-5';
}

export interface BriefingExploreContent {
  title: string;
  aiAnalysis: { summary: string; whySurfacing: string };
  /** Firm → practice area → matter → person (in-panel drill-down) */
  drillDownRoot: DrillDownNode;
  recommendedActions: string[];
}

export const BRIEFING_EXPLORE_BY_ID: Record<BriefingInsightId, BriefingExploreContent> = {
  'insight-1': {
    title: 'High Collections Risk',
    aiAnalysis: {
      summary:
        'Smith & Associates represents roughly $45k in billed-but-unpaid work across two matters, with the oldest invoice at 47 days. Combined with slower matter close velocity this quarter, that concentration is elevating default risk on your near-term cash forecast.',
      whySurfacing:
        'We surface this because (1) this client is in your top decile by outstanding balance, (2) payment behavior has slipped versus their 24-month baseline, and (3) the amount sits in the window where proactive partner outreach historically recovers 60–80% of dollars within two weeks—before you’d need to adjust accruals or write-down expectations.',
    },
    drillDownRoot: drillDownRootInsight1,
    recommendedActions: [
      'Schedule a partner-to-client call on Smith & Associates within 48 hours; align on payment date and matter scope.',
      'Turn on automated 31–60 day reminders for all invoices in that bucket (excludes clients on payment plans).',
      'Pre-bill or refresh the estate matter estimate so the client sees an updated total and payment path.',
      'If no commitment by day 5, route to collections playbook per firm policy and flag for Q3 cash forecast.',
    ],
  },
  'insight-2': {
    title: 'Q3 Revenue Target Trajectory',
    aiAnalysis: {
      summary:
        'You are tracking about 15% above the Q3 revenue baseline after the $120k Johnson Corp receipt. On a cash basis, that payment improves runway; on an accrual basis, it confirms strong realization on corporate work this month.',
      whySurfacing:
        'We highlight this because the payment moved you inside the “on track to beat plan” band for the quarter. That matters for bonus pools, line-of-credit covenant headroom (where tied to trailing revenue), and whether you can safely fund planned hires without tapping reserves.',
    },
    drillDownRoot: drillDownRootInsight2,
    recommendedActions: [
      'Update the rolling Q3 forecast in finance so leadership sees the beat scenario—not just baseline.',
      'Identify one at-risk matter to protect margin (optional reallocation of junior time) while you’re ahead of plan.',
      'Communicate the trajectory to the comp committee template so expectations stay aligned with actuals.',
    ],
  },
  'insight-3': {
    title: 'Upcoming Software Renewals',
    aiAnalysis: {
      summary:
        'Three annual subscriptions renew next week for a combined $12,500. Utilization data suggests two of the three products have inactive seats, which is inflating OpEx relative to peer firms your size.',
      whySurfacing:
        'We surface renewals this far out because vendor terms rarely improve after auto-renew, and seat true-ups hit the P&L immediately. Catching this before renewal is the easiest lever to protect EBITDA without touching client-facing staffing.',
    },
    drillDownRoot: drillDownRootInsight3,
    recommendedActions: [
      'Run a seat utilization export for each vendor; remove or reassign inactive licenses before renewal.',
      'Ask for multi-year or nonprofit-style pricing if you commit to annual prepay.',
      'Defer non-critical upgrades tied to the same stack until Q4 if you need to smooth OpEx.',
    ],
  },
  'insight-4': {
    title: 'Cash Flow Action Plan',
    aiAnalysis: {
      summary: `Firm Intelligence projects a 47-day operating cash shortfall against your policy reserve. Instead of only flagging a red indicator, ${USER_FIRST_NAME} sees a phased Cash Flow Action Plan: overdue collections, billable WIP ready to invoice, a payroll-week bridge option, and a clear line of sight to restoring the 60-day reserve through Q2.`,
      whySurfacing:
        'We surface this now because (1) the model ties the gap to concrete receivables and WIP you can act on this week, (2) payroll is a fixed date that makes timing risk non-optional, and (3) executing the bundled plan historically closes similar shortfalls without deferring compensation—provided reminders and invoices go out immediately.',
    },
    drillDownRoot: drillDownRootInsight4,
    recommendedActions: [
      `Immediate: Four invoices totaling $47,200 are 30+ days overdue. Send collection reminders now? One click sends personalized, professional follow-up emails to each client.`,
      `This week: $23,800 of unbilled time across 3 matters is ready to invoice. Generate and send invoices? One click drafts invoices for attorney review.`,
      `Mid-month: Payroll runs on Thursday but cash balances are low—get a line of credit with Clio Capital to cover payroll while we work on collections. One click submits the firm’s application.`,
      `Strategic: If these actions are completed, the projected shortfall closes. Firm Intelligence confirms: “With these actions, your 60-day reserve goal is maintained through Q2.”`,
    ],
  },
  'insight-5': {
    title: 'Payroll Shortfall — Operating Account Gap',
    aiAnalysis: {
      summary:
        'Firm Intelligence detected payroll due in three days with a projected operating cash gap of $15,700. The system has ranked resolution paths from lowest-friction internal liquidity actions to higher-cost financing.',
      whySurfacing:
        'We surface this now because payroll is a fixed-date obligation and timing risk compounds quickly. Addressing the gap now gives you enough runway to use lower-cost levers before drawing on external financing.',
    },
    drillDownRoot: drillDownRootInsight4,
    recommendedActions: [
      'Start with Internal Liquidity Levers: send draft invoices for bill-ready WIP, run A/R nudge reminders, and defer non-essential AP by 14 days.',
      'If same-day certainty is still required, draw only the exact shortfall amount from your Clio Capital line of credit.',
      'Where internal funds exist, use an inter-account transfer to Operating and avoid financing cost.',
    ],
  },
};

export function getBriefingExploreContent(id: string): BriefingExploreContent | null {
  if (!isBriefingInsightId(id)) return null;
  return BRIEFING_EXPLORE_BY_ID[id];
}

/** Short labels for Take Action panel header by insight */
export const BRIEFING_ACTION_HEADLINE: Record<BriefingInsightId, string> = {
  'insight-1': 'Collections recovery plan',
  'insight-2': 'Revenue & forecast actions',
  'insight-3': 'Renewal & cost optimization',
  'insight-4': 'Cash Flow Action Plan',
  'insight-5': 'Payroll shortfall resolution',
};

/** Progress row in the Take Action “model results” block */
export type BriefingTakeActionModelRow = { label: string; pct: number; amt: string };

export type BriefingTakeActionPhase = {
  title: string;
  body: string;
  ctaHint?: string;
};

export type BriefingTakeActionContent = {
  modelHeadline: string;
  confidenceLabel: string;
  modelRows: BriefingTakeActionModelRow[];
  phases?: BriefingTakeActionPhase[];
  /** Optional closing line under phased plan */
  strategicClosing?: string;
};

/**
 * Per-insight Take Action body. Insights without an entry use the legacy generic block in BriefingSidePanel.
 */
export const BRIEFING_TAKE_ACTION_BY_ID: Partial<Record<BriefingInsightId, BriefingTakeActionContent>> = {
  'insight-4': {
    modelHeadline: 'Model Results: Shortfall closed if plan executes',
    confidenceLabel: '88% Confidence',
    modelRows: [
      { label: '1. Collection reminders (4 invoices, 30+ days)', pct: 38, amt: '+$28,400' },
      { label: '2. Draft invoices (3 matters, bill-ready WIP)', pct: 35, amt: '+$23,800' },
      { label: '3. Clio Capital bridge (payroll week)', pct: 27, amt: 'Coverage' },
    ],
    phases: [
      {
        title: 'Immediate',
        body: 'Four invoices totaling $47,200 are 30+ days overdue.',
        ctaHint: 'Send collection reminders now? One click sends personalized, professional follow-up emails to each client.',
      },
      {
        title: 'This week',
        body: '$23,800 of unbilled time across 3 matters is ready to invoice.',
        ctaHint: 'Generate and send invoices? One click drafts invoices for attorney review.',
      },
      {
        title: 'Mid-month',
        body: 'Payroll runs on Thursday but cash balances are low.',
        ctaHint: 'Get a line of credit with Clio Capital to cover payroll while we work on collections. One click submits the firm’s application.',
      },
      {
        title: 'Strategic',
        body: 'If these actions are completed, the projected shortfall closes.',
        ctaHint: undefined,
      },
    ],
    strategicClosing:
      'Firm Intelligence: “With these actions, your 60-day reserve goal is maintained through Q2.”',
  },
};

export function getBriefingTakeActionContent(id: BriefingInsightId): BriefingTakeActionContent | null {
  return BRIEFING_TAKE_ACTION_BY_ID[id] ?? null;
}
