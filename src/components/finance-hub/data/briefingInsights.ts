import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import type { BriefingInsightId } from './briefingPanelContent';

export type BriefingInsightListItem = {
  id: BriefingInsightId;
  title: string;
  time: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  /** Shown as subline on Today's to do rows */
  todaySourceLabel: string;
};

/** Single source for This Week's Briefing + Notifications (first item = default expanded + priority chrome) */
export const BRIEFING_INSIGHT_ITEMS: BriefingInsightListItem[] = [
  {
    id: 'insight-5',
    title: 'Payroll Shortfall — Operating Account Gap',
    todaySourceLabel: 'Clio Accounting',
    time: 'Just now',
    description:
      'Payroll is due in 3 days and your Operating Account is projected to be short by $15,700. Review ranked resolution options now: internal liquidity levers first, then exact-gap financing only if needed.',
    icon: Wallet,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
  },
  {
    id: 'insight-4',
    title: 'From Alert to Action: The Cash Flow Scenario',
    todaySourceLabel: 'Revenue Forecasting Skill',
    time: 'Just now',
    description:
      'Clio Accounting detected a projected 47-day operating cash shortfall—not just a red indicator. You get a Cash Flow Action Plan: collection reminders on overdue invoices, one-click drafts for bill-ready WIP, an optional Clio Capital bridge before payroll, and confirmation that your 60-day reserve goal can hold through Q2 if you execute.',
    icon: Wallet,
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-800',
  },
  {
    id: 'insight-1',
    title: 'High Collections Risk Detected',
    todaySourceLabel: 'Collections Agent',
    time: '8 min ago',
    description:
      'Based on current matter activity and historical billing patterns, there is a $45k exposure risk for the pending invoices with Smith & Associates. Resolving this within 5 days is required to maintain your Q3 cash flow targets.',
    icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
  },
  {
    id: 'insight-2',
    title: 'Q3 Revenue Target Trajectory',
    todaySourceLabel: 'Revenue Forecasting Skill',
    time: '2 hours ago',
    description:
      'You are currently trending 15% above the projected baseline. The recent payment of $120k from Johnson Corp has pushed you closer to your Q3 revenue target.',
    icon: TrendingUp,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
  },
  {
    id: 'insight-3',
    title: 'Upcoming Software Renewals',
    todaySourceLabel: 'Matching Agent',
    time: 'Yesterday',
    description:
      'You have 3 annual software subscriptions renewing next week totaling $12,500. Consider reviewing seat utilization to optimize these upcoming expenses.',
    icon: CreditCard,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
  },
];

/** Fallback when resolving an unknown insight id (matches first briefing in the list). */
export const BRIEFING_DEFAULT_INSIGHT_ID: BriefingInsightId = BRIEFING_INSIGHT_ITEMS[0]!.id;
