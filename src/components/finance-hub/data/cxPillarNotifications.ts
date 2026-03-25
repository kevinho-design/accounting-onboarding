/**
 * CX-pillar narrative notifications (prototype seed), aligned with Firm Intelligence vision pillars.
 * @see .cursor/rules/cx-prototyping-spec.mdc
 */

export type CxPillarId = 'onboarding' | 'recording' | 'reporting' | 'actioning';

export type CxPillarNotification = {
  id: string;
  pillar: CxPillarId;
  /** UI label e.g. "CX Pillar 2 · Recording" */
  pillarLabel: string;
  title: string;
  body: string;
  timeLabel: string;
  /** Navigate via setActivePage when user taps */
  navigateTo?: string;
};

export const CX_PILLAR_LABEL: Record<CxPillarId, string> = {
  onboarding: 'CX Pillar 1 · Onboarding',
  recording: 'CX Pillar 2 · Recording',
  reporting: 'CX Pillar 3 · Reporting',
  actioning: 'CX Pillar 4 · Actioning',
};

export const CX_PILLAR_NOTIFICATIONS: CxPillarNotification[] = [
  {
    id: 'cx-onb-1',
    pillar: 'onboarding',
    pillarLabel: CX_PILLAR_LABEL.onboarding,
    title: 'Firm chart of accounts scaffold ready',
    body: 'Firm Intelligence mapped your practice structure to a starter CoA and default dimensions. Review exceptions before first close.',
    timeLabel: 'Today',
    navigateTo: 'Chart of Accounts',
  },
  {
    id: 'cx-onb-2',
    pillar: 'onboarding',
    pillarLabel: CX_PILLAR_LABEL.onboarding,
    title: 'Bank feeds linked — reconciliation preview',
    body: 'Two operating accounts are syncing. We pre-matched 94% of last month’s transactions; 6 items need your judgment.',
    timeLabel: 'Yesterday',
    navigateTo: 'Transactions',
  },
  {
    id: 'cx-rec-1',
    pillar: 'recording',
    pillarLabel: CX_PILLAR_LABEL.recording,
    title: 'Trust alert: retainer approaching floor',
    body: 'Trust balance for client Chen, M. is approaching the retainer floor. Request funds transfer to client with approval from the responsible attorney, Michael Torres?',
    timeLabel: '12 min ago',
    navigateTo: 'Funds In',
  },
  {
    id: 'cx-rec-2',
    pillar: 'recording',
    pillarLabel: CX_PILLAR_LABEL.recording,
    title: 'Exception: uncategorized trust transfer',
    body: 'A $4,200 transfer from trust to operating is awaiting a matter code. Suggested: Estate — Chen (confidence 88%).',
    timeLabel: '1 hr ago',
    navigateTo: 'Transactions',
  },
  {
    id: 'cx-rep-1',
    pillar: 'reporting',
    pillarLabel: CX_PILLAR_LABEL.reporting,
    title: 'Guided read: collections vs Q3 goal',
    body: '31–60 day A/R is up 11% QoQ. Here’s the narrative tie to your Q3 cash target — no spreadsheet required.',
    timeLabel: '3 hr ago',
    navigateTo: 'fp_default',
  },
  {
    id: 'cx-rep-2',
    pillar: 'reporting',
    pillarLabel: CX_PILLAR_LABEL.reporting,
    title: 'Practice mix shift detected',
    body: 'Corporate is +8% vs plan YTD; litigation flat. Blended rate is up slightly from matter mix — worth a partner huddle this week.',
    timeLabel: 'This week',
    navigateTo: 'fp_financial_health',
  },
  {
    id: 'cx-act-1',
    pillar: 'actioning',
    pillarLabel: CX_PILLAR_LABEL.actioning,
    title: 'One-click: collection reminder cadence',
    body: 'Goal-aware suggestion: turn on 31–60 day reminders for all non–payment-plan clients to protect your days-to-collect target.',
    timeLabel: 'Just now',
    navigateTo: 'Financial Goals',
  },
  {
    id: 'cx-act-2',
    pillar: 'actioning',
    pillarLabel: CX_PILLAR_LABEL.actioning,
    title: 'Vendor renewal cluster in Q3',
    body: 'Three G&A renewals hit next month (~0.4% of monthly OpEx). Seat review now avoids EBITDA surprise — optional deferral paths listed.',
    timeLabel: 'Yesterday',
    navigateTo: 'Funds Out',
  },
];
