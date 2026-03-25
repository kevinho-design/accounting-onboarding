import type { DrillDownNode } from './drillDownLadder';

/** High collections risk — firm A/R → litigation → Smith Estate → partner billing */
export const drillDownRootInsight1: DrillDownNode = {
  level: 'firm',
  id: 'insight-1-firm',
  title: 'Firm-wide books',
  subtitle: 'All practice areas · accrual basis',
  metrics: [
    { label: '31–60 day A/R', value: '$312k', tone: 'negative' },
    { label: 'QoQ change', value: '+11%', tone: 'negative' },
    { label: 'Smith & Assoc. share of bucket', value: '14%', tone: 'neutral' },
  ],
  narrative:
    'Firm-wide, aging in the 31–60 day bucket is up quarter over quarter. If the Smith balance slips past 60 days, modeled Q3 operating cash dips by ~$38k under your standard collection probability curve—this is the P&L variance signal at the top of the house.',
  children: [
    {
      level: 'practice_area',
      id: 'insight-1-pa-lit',
      title: 'Litigation',
      subtitle: 'Largest concentration in this aging bucket',
      metrics: [
        { label: 'Practice A/R 31–60', value: '$128k', tone: 'negative' },
        { label: 'vs plan', value: '+9%', tone: 'negative' },
      ],
      narrative:
        'Litigation carries the majority of the elevated 31–60 balance. Mix and matter velocity here explain most of the firm-wide uptick; corporate is comparatively current.',
      children: [
        {
          level: 'matter',
          id: 'insight-1-matter-estate',
          title: 'Estate of R. Smith — Administration',
          subtitle: 'Client: Smith & Associates',
          metrics: [
            { label: 'Open invoices (billed)', value: '$45k', tone: 'negative' },
            { label: 'Oldest invoice age', value: '47 days', tone: 'negative' },
            { label: 'Related WIP', value: '$18k', tone: 'neutral' },
          ],
          narrative:
            'Two matters for this client hold the exposure: the estate file drives most of the balance. WIP still open suppresses effective realization in management reports until cash is collected.',
          children: [
            {
              level: 'person',
              id: 'insight-1-person-morgan',
              title: 'Alex Morgan',
              subtitle: 'Partner · originating & billing attorney',
              metrics: [
                { label: 'Time on matter (30d)', value: '62.4 h', tone: 'neutral' },
                { label: 'Pre-bills last 14d', value: '2 drafts', tone: 'neutral' },
                { label: 'Client touchpoints', value: '1 logged', tone: 'negative' },
              ],
              narrative:
                'Billing behaviour shows production without a matching payment cadence: invoices went out on schedule, but follow-up and partner-to-client alignment on payment date lag peers. This is the attributable attorney-level lever before collections escalates.',
            },
          ],
        },
      ],
    },
  ],
};

/** Q3 revenue trajectory — firm revenue → corporate → Johnson matter → relationship partner */
export const drillDownRootInsight2: DrillDownNode = {
  level: 'firm',
  id: 'insight-2-firm',
  title: 'Firm-wide revenue',
  subtitle: 'Q3 accrual + cash',
  metrics: [
    { label: 'vs Q3 baseline', value: '+15%', tone: 'positive' },
    { label: 'Blended effective rate', value: '+1.2%', tone: 'positive' },
  ],
  narrative:
    'Firm-wide you are inside the “beat plan” band after the Johnson Corp receipt. Practice mix (corporate up, litigation flat) explains the trajectory without a firm-wide rate increase.',
  children: [
    {
      level: 'practice_area',
      id: 'insight-2-pa-corp',
      title: 'Corporate',
      subtitle: 'Primary driver this quarter',
      metrics: [
        { label: 'YTD vs plan', value: '+8%', tone: 'positive' },
        { label: 'Realization (cash)', value: 'Strong', tone: 'positive' },
      ],
      narrative:
        'Corporate is carrying performance versus plan; the Johnson payment landed against open invoices in-period, so revenue recognition and cash align.',
      children: [
        {
          level: 'matter',
          id: 'insight-2-matter-johnson',
          title: 'Johnson Corp — Outside counsel panel',
          subtitle: 'Matter #2024-0891',
          metrics: [
            { label: 'Receipt applied', value: '$120k', tone: 'positive' },
            { label: 'Open WIP after apply', value: '$12k', tone: 'neutral' },
          ],
          narrative:
            'The receipt cleared the bulk of aged invoices; remaining WIP is scheduled for September billing. No deferred-revenue hangover on this cash event.',
          children: [
            {
              level: 'person',
              id: 'insight-2-person-cho',
              title: 'Samira Cho',
              subtitle: 'Partner · matter lead',
              metrics: [
                { label: 'Originated revenue (Q3)', value: '$186k', tone: 'positive' },
                { label: 'Collection days (avg)', value: '34', tone: 'positive' },
              ],
              narrative:
                'At the individual level, Cho’s matters show faster invoice-to-cash than firm average for corporate—this payment reinforces healthy billing hygiene on the relationship that moved the firm-wide number.',
            },
          ],
        },
      ],
    },
  ],
};

/** Software renewals — firm OpEx → operations → vendor bundle → owner */
export const drillDownRootInsight3: DrillDownNode = {
  level: 'firm',
  id: 'insight-3-firm',
  title: 'Firm-wide OpEx',
  subtitle: 'G&A · software & subscriptions',
  metrics: [
    { label: 'Renewals (next 7d)', value: '$12.5k', tone: 'neutral' },
    { label: 'Software line YTD vs budget', value: '+6%', tone: 'negative' },
  ],
  narrative:
    'Three subscriptions renew next week; renewing at full seat count flows straight to September G&A—about 0.4% of monthly firm OpEx in your model. Clustered Q3 renewals explain part of “software creep” versus budget.',
  children: [
    {
      level: 'practice_area',
      id: 'insight-3-pa-ops',
      title: 'Operations & firm services',
      subtitle: 'Non-billable / overhead allocation',
      metrics: [
        { label: 'Allocated software cost', value: '$4.1k / mo', tone: 'neutral' },
        { label: 'Inactive seats (2 of 3 tools)', value: '14 seats', tone: 'negative' },
      ],
      narrative:
        'These tools are booked to operations overhead rather than a client matter. Utilization exports show inactive seats inflating cost versus peer firms at your headcount.',
      children: [
        {
          level: 'matter',
          id: 'insight-3-matter-vendors',
          title: 'Renewal bundle — DocuSign, West KM, HRIS',
          subtitle: 'Vendor contracts · auto-renew window',
          metrics: [
            { label: 'Combined renewal', value: '$12,500', tone: 'neutral' },
            { label: 'Prepay on books', value: 'None', tone: 'neutral' },
          ],
          narrative:
            'Treated like a “matter” for traceability: each contract is a discrete economic commitment. No prepaid asset—cash hits on renewal unless you renegotiate or downgrade before the date.',
          children: [
            {
              level: 'person',
              id: 'insight-3-person-lee',
              title: 'Jordan Lee',
              subtitle: 'Office Manager · license owner',
              metrics: [
                { label: 'Last seat audit', value: 'Apr', tone: 'neutral' },
                { label: 'Open vendor tickets', value: '1', tone: 'neutral' },
              ],
              narrative:
                'Individual accountability for seat requests and renewals sits with Jordan; proactive true-up before auto-renew is the fastest path to protect EBITDA without changing client-facing staffing.',
            },
          ],
        },
      ],
    },
  ],
};

/** Cash flow action plan — firm operating cash → finance/ops → payroll window → Clio Capital bridge */
export const drillDownRootInsight4: DrillDownNode = {
  level: 'firm',
  id: 'insight-4-firm',
  title: 'Firm operating cash',
  subtitle: '60-day forward view · operating accounts',
  metrics: [
    { label: 'Projected shortfall (modeled)', value: '47 days', tone: 'negative' },
    { label: '30+ day overdue (4 inv.)', value: '$47.2k', tone: 'negative' },
    { label: 'Unbilled ready-to-bill', value: '$23.8k', tone: 'neutral' },
  ],
  narrative:
    'Firm-wide, collections velocity and delayed billing are compressing the path to your 60-day cash reserve. The model ties the 47-day gap to overdue receivables plus uninvoiced WIP before the next payroll cycle—not a single client concentration.',
  children: [
    {
      level: 'practice_area',
      id: 'insight-4-pa-finance',
      title: 'Finance & operations',
      subtitle: 'Cash positioning · billing ops',
      metrics: [
        { label: 'Days cash on hand (post-payroll)', value: 'Below policy', tone: 'negative' },
        { label: 'Matters with bill-ready WIP', value: '3', tone: 'neutral' },
      ],
      narrative:
        'Finance sees the same signal as the briefing: four invoices over 30 days total $47.2k, and $23.8k of time is coded and ready to invoice across three matters. Pulling both levers is what closes the modeled shortfall without deferring payroll.',
      children: [
        {
          level: 'matter',
          id: 'insight-4-matter-payroll',
          title: 'Payroll run · Thursday',
          subtitle: 'Next fixed cash outflow vs operating balance',
          metrics: [
            { label: 'Estimated net payroll', value: '$186k', tone: 'neutral' },
            { label: 'Modeled cash before payroll', value: 'Tight', tone: 'negative' },
          ],
          narrative:
            'The mid-month risk is timing: payroll is a hard date while collections and invoicing are in flight. A working-capital bridge (e.g. Clio Capital) is modeled as coverage only until reminders and invoices convert—not a substitute for those actions.',
          children: [
            {
              level: 'person',
              id: 'insight-4-person-clio-capital',
              title: 'Clio Capital · line of credit',
              subtitle: 'Working capital · firm application',
              metrics: [
                { label: 'Suggested facility (prototype)', value: 'Payroll cover', tone: 'neutral' },
                { label: 'Application status', value: 'Not submitted', tone: 'neutral' },
              ],
              narrative:
                'One-click submission stages the firm’s application for review. Firm Intelligence ties the amount to the payroll window while collections and invoicing execute—keeping the 60-day reserve goal intact through Q2 once the plan runs.',
            },
          ],
        },
      ],
    },
  ],
};
