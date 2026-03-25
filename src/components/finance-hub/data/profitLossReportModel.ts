/**
 * Legal Profit & Loss: PDF-aligned chart, view state, synthetic cube, and row derivation.
 */

export type PracticeAreaId = 'all' | 'personal_injury' | 'family_law' | 'estate_planning';
export type LeadAttorneyId = 'all' | 'chen' | 'ortiz' | 'nakamura';
export type MatterTypeId = 'all' | 'contingency' | 'hourly' | 'flat_fee';

export type PlBasis = 'accrual' | 'cash';
export type PlPeriodPreset = 'this_month' | 'last_month' | 'ytd';
export type PlComparison = 'none' | 'mom' | 'yoy';
export type RevenueView = 'gross' | 'net';
export type PayrollAttributionFilter = 'all' | 'billable' | 'nonbillable';

export const PRACTICE_AREA_OPTIONS: { id: PracticeAreaId; label: string }[] = [
  { id: 'all', label: 'All practice areas' },
  { id: 'personal_injury', label: 'Personal Injury' },
  { id: 'family_law', label: 'Family Law' },
  { id: 'estate_planning', label: 'Estate Planning' },
];

export const LEAD_ATTORNEY_OPTIONS: { id: LeadAttorneyId; label: string }[] = [
  { id: 'all', label: 'All partners' },
  { id: 'chen', label: 'Lead: M. Chen' },
  { id: 'ortiz', label: 'Lead: R. Ortiz' },
  { id: 'nakamura', label: 'Lead: J. Nakamura' },
];

export const MATTER_TYPE_OPTIONS: { id: MatterTypeId; label: string }[] = [
  { id: 'all', label: 'All matter types' },
  { id: 'contingency', label: 'Contingency' },
  { id: 'hourly', label: 'Hourly' },
  { id: 'flat_fee', label: 'Flat fee' },
];

export type ProfitLossAccountSection = 'revenue' | 'expense';

export type ClientCostKind = 'hard' | 'soft' | 'na';

export type ProfitLossAccountMeta = {
  id: string;
  label: string;
  section: ProfitLossAccountSection;
  clientCostKind: ClientCostKind;
  payrollAttribution: 'billable' | 'nonbillable' | 'na';
  reimbursable: boolean;
  isPayrollFamily: boolean;
  /** Synthetic monthly accrual base ($) — firm-wide before filters */
  baseAccrual: number;
  /** Cash basis tends to lag accrual for this line (0–1) */
  cashLagFactor: number;
};

function meta(
  m: Omit<ProfitLossAccountMeta, 'clientCostKind' | 'payrollAttribution' | 'reimbursable' | 'isPayrollFamily'> & {
    clientCostKind?: ClientCostKind;
    payrollAttribution?: 'billable' | 'nonbillable' | 'na';
    reimbursable?: boolean;
    isPayrollFamily?: boolean;
  },
): ProfitLossAccountMeta {
  return {
    clientCostKind: m.clientCostKind ?? 'na',
    payrollAttribution: m.payrollAttribution ?? 'na',
    reimbursable: m.reimbursable ?? false,
    isPayrollFamily: m.isPayrollFamily ?? false,
    id: m.id,
    label: m.label,
    section: m.section,
    baseAccrual: m.baseAccrual,
    cashLagFactor: m.cashLagFactor,
  };
}

/** PDF order: Revenues then Expenses (no COGS). */
export const PROFIT_LOSS_ACCOUNTS: ProfitLossAccountMeta[] = [
  meta({
    id: 'referral_fee',
    label: 'Referral Fee Income',
    section: 'revenue',
    baseAccrual: 4200,
    cashLagFactor: 0.92,
  }),
  meta({
    id: 'client_refunds',
    label: 'Client Refunds',
    section: 'revenue',
    baseAccrual: -1800,
    cashLagFactor: 1,
  }),
  meta({
    id: 'fee_income',
    label: 'Fee Income',
    section: 'revenue',
    baseAccrual: 412_000,
    cashLagFactor: 0.88,
  }),
  meta({
    id: 'interest_income',
    label: 'Interest Income',
    section: 'revenue',
    baseAccrual: 190,
    cashLagFactor: 1,
  }),
  meta({
    id: 'service_income',
    label: 'Service Income',
    section: 'revenue',
    baseAccrual: -2100,
    cashLagFactor: 0.9,
  }),
  meta({
    id: 'uncategorized_income',
    label: 'Uncategorized Income',
    section: 'revenue',
    baseAccrual: 0,
    cashLagFactor: 1,
  }),

  meta({
    id: 'payroll',
    label: 'Payroll',
    section: 'expense',
    baseAccrual: 48_000,
    cashLagFactor: 0.95,
    payrollAttribution: 'nonbillable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'sub_payroll',
    label: 'Sub Payroll',
    section: 'expense',
    baseAccrual: 6200,
    cashLagFactor: 0.94,
    payrollAttribution: 'billable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'marketing',
    label: 'Marketing/Advertising',
    section: 'expense',
    baseAccrual: 11_200,
    cashLagFactor: 1,
  }),
  meta({
    id: 'bank_fees',
    label: 'Bank & Credit Card Charges & Fees',
    section: 'expense',
    baseAccrual: 890,
    cashLagFactor: 1,
  }),
  meta({
    id: 'insurance',
    label: 'Insurance',
    section: 'expense',
    baseAccrual: 2400,
    cashLagFactor: 1,
  }),
  meta({
    id: 'outside_prof',
    label: 'Outside Professional Services',
    section: 'expense',
    baseAccrual: 15_400,
    cashLagFactor: 0.9,
  }),
  meta({
    id: 'meals',
    label: 'Meals',
    section: 'expense',
    baseAccrual: 420,
    cashLagFactor: 1,
  }),
  meta({
    id: 'office_meals',
    label: 'Office meals',
    section: 'expense',
    baseAccrual: 380,
    cashLagFactor: 1,
  }),
  meta({
    id: 'office_exp',
    label: 'Office Expenses',
    section: 'expense',
    baseAccrual: 6200,
    cashLagFactor: 1,
  }),
  meta({
    id: 'legal_research',
    label: 'Legal Research',
    section: 'expense',
    baseAccrual: 2800,
    cashLagFactor: 1,
  }),
  meta({
    id: 'membership_dues',
    label: 'Membership/Professional Dues',
    section: 'expense',
    baseAccrual: 4100,
    cashLagFactor: 1,
  }),
  meta({
    id: 'cle',
    label: 'CLE/Education',
    section: 'expense',
    baseAccrual: 3600,
    cashLagFactor: 1,
  }),
  meta({
    id: 'occupancy',
    label: 'Occupancy Expenses',
    section: 'expense',
    baseAccrual: 1200,
    cashLagFactor: 1,
  }),
  meta({
    id: 'taxes_licenses',
    label: 'Taxes & Licenses',
    section: 'expense',
    baseAccrual: 2100,
    cashLagFactor: 1,
  }),
  meta({
    id: 'travel',
    label: 'Travel',
    section: 'expense',
    baseAccrual: 2800,
    cashLagFactor: 0.85,
  }),
  meta({
    id: 'impounded_payroll',
    label: 'Impounded Funds Payroll',
    section: 'expense',
    baseAccrual: 0,
    cashLagFactor: 1,
    isPayrollFamily: true,
  }),
  meta({
    id: 'staff_wages',
    label: 'Staff Wages',
    section: 'expense',
    baseAccrual: 38_500,
    cashLagFactor: 0.96,
    payrollAttribution: 'billable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'sub_staff_wages',
    label: 'Sub staff wages',
    section: 'expense',
    baseAccrual: 8400,
    cashLagFactor: 0.93,
    payrollAttribution: 'billable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'staff_er_taxes',
    label: 'Staff ER Taxes',
    section: 'expense',
    baseAccrual: 9200,
    cashLagFactor: 0.97,
    payrollAttribution: 'nonbillable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'staff_benefits',
    label: 'Staff Benefits',
    section: 'expense',
    baseAccrual: 14_200,
    cashLagFactor: 0.98,
    payrollAttribution: 'nonbillable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'staff_retirement',
    label: 'Staff Retirement Plan',
    section: 'expense',
    baseAccrual: 11_000,
    cashLagFactor: 0.99,
    payrollAttribution: 'nonbillable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'owner_wages',
    label: 'Owner Wages',
    section: 'expense',
    baseAccrual: 52_000,
    cashLagFactor: 0.95,
    payrollAttribution: 'billable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'malpractice',
    label: 'Malpractice Ins.',
    section: 'expense',
    baseAccrual: 18_600,
    cashLagFactor: 1,
  }),
  meta({
    id: 'health_ins',
    label: 'Health Ins.',
    section: 'expense',
    baseAccrual: 24_000,
    cashLagFactor: 1,
    payrollAttribution: 'nonbillable',
    isPayrollFamily: true,
  }),
  meta({
    id: 'business_ins',
    label: 'Business Ins.',
    section: 'expense',
    baseAccrual: 4800,
    cashLagFactor: 1,
  }),
  meta({
    id: 'workers_comp',
    label: 'Workers Comp',
    section: 'expense',
    baseAccrual: 3200,
    cashLagFactor: 1,
  }),
  meta({
    id: 'life_ins',
    label: 'Life Insurance',
    section: 'expense',
    baseAccrual: 1200,
    cashLagFactor: 1,
  }),
  meta({
    id: 'bookkeeping',
    label: 'Bookkeeping',
    section: 'expense',
    baseAccrual: 1400,
    cashLagFactor: 1,
  }),
  meta({
    id: 'it_services',
    label: 'IT Services',
    section: 'expense',
    baseAccrual: 6800,
    cashLagFactor: 1,
  }),
  meta({
    id: 'remote_reception',
    label: 'Remote Receptionist',
    section: 'expense',
    baseAccrual: 2200,
    cashLagFactor: 1,
  }),
  meta({
    id: 'supplies',
    label: 'Supplies',
    section: 'expense',
    baseAccrual: 1900,
    cashLagFactor: 1,
  }),
  meta({
    id: 'repairs_maint',
    label: 'Repairs & Maintenance',
    section: 'expense',
    baseAccrual: 1500,
    cashLagFactor: 1,
  }),
  meta({
    id: 'software',
    label: 'Software',
    section: 'expense',
    baseAccrual: 9200,
    cashLagFactor: 1,
  }),
  meta({
    id: 'copier',
    label: 'Copier Related Fees',
    section: 'expense',
    baseAccrual: 1100,
    cashLagFactor: 1,
  }),
  meta({
    id: 'postage',
    label: 'Postage & Delivery',
    section: 'expense',
    baseAccrual: 650,
    cashLagFactor: 1,
  }),
  meta({
    id: 'utilities',
    label: 'Utilities',
    section: 'expense',
    baseAccrual: 2800,
    cashLagFactor: 1,
  }),
  meta({
    id: 'telephone',
    label: 'Telephone',
    section: 'expense',
    baseAccrual: 480,
    cashLagFactor: 1,
  }),
  meta({
    id: 'cell_phones',
    label: 'Cell Phones',
    section: 'expense',
    baseAccrual: 2100,
    cashLagFactor: 1,
  }),
  meta({
    id: 'repairs',
    label: 'Repairs',
    section: 'expense',
    baseAccrual: 800,
    cashLagFactor: 1,
  }),
  meta({
    id: 'rent',
    label: 'Rent',
    section: 'expense',
    baseAccrual: 28_000,
    cashLagFactor: 1,
  }),
  meta({
    id: 'license_fees',
    label: 'License Fees',
    section: 'expense',
    baseAccrual: 3500,
    cashLagFactor: 1,
  }),
  meta({
    id: 'business_taxes',
    label: 'Business Taxes',
    section: 'expense',
    baseAccrual: 4200,
    cashLagFactor: 1,
  }),
  meta({
    id: 'secondary_business_taxes',
    label: 'Secondary Business Taxes',
    section: 'expense',
    baseAccrual: 1800,
    cashLagFactor: 1,
  }),
  meta({
    id: 'lodging',
    label: 'Lodging',
    section: 'expense',
    baseAccrual: 900,
    cashLagFactor: 0.88,
  }),
  meta({
    id: 'transportation',
    label: 'Transportation',
    section: 'expense',
    baseAccrual: 1400,
    cashLagFactor: 0.9,
  }),
  meta({
    id: 'local_transport',
    label: 'Local – Parking/Taxi/Gas',
    section: 'expense',
    baseAccrual: 720,
    cashLagFactor: 1,
  }),
  meta({
    id: 'processing_fees',
    label: 'Processing Fees',
    section: 'expense',
    baseAccrual: 2400,
    cashLagFactor: 1,
  }),
  meta({
    id: 'processing_fee_sub',
    label: 'Processing Fee Sub',
    section: 'expense',
    baseAccrual: 600,
    cashLagFactor: 1,
  }),
  meta({
    id: 'non_reimb',
    label: 'Non-Reimbursable Expenses',
    section: 'expense',
    baseAccrual: 2400,
    cashLagFactor: 1,
  }),
  meta({
    id: 'filing_fees',
    label: 'Advanced client costs — filing & court',
    section: 'expense',
    baseAccrual: 5600,
    cashLagFactor: 0.82,
    clientCostKind: 'hard',
    reimbursable: true,
  }),
  meta({
    id: 'expert_witness',
    label: 'Advanced client costs — expert witnesses',
    section: 'expense',
    baseAccrual: 12_800,
    cashLagFactor: 0.78,
    clientCostKind: 'soft',
    reimbursable: true,
  }),
];

export type ProfitLossViewState = {
  practiceArea: PracticeAreaId;
  leadAttorney: LeadAttorneyId;
  matterType: MatterTypeId;
  basis: PlBasis;
  period: PlPeriodPreset;
  comparison: PlComparison;
  revenueView: RevenueView;
  hideReimbursableClientCosts: boolean;
  payrollAttribution: PayrollAttributionFilter;
  showPctOfRevenue: boolean;
  showBudgetVariance: boolean;
  collectionOverlay: boolean;
  sortByVarianceDesc: boolean;
  /** NL / demo: focus payroll-related lines in copy */
  highlightPayrollOnly: boolean;
};

export const DEFAULT_PROFIT_LOSS_VIEW_STATE: ProfitLossViewState = {
  practiceArea: 'all',
  leadAttorney: 'all',
  matterType: 'all',
  basis: 'accrual',
  period: 'this_month',
  comparison: 'none',
  revenueView: 'gross',
  hideReimbursableClientCosts: false,
  payrollAttribution: 'all',
  showPctOfRevenue: false,
  showBudgetVariance: false,
  collectionOverlay: false,
  sortByVarianceDesc: false,
  highlightPayrollOnly: false,
};

const PRACTICE_AREA_WEIGHT: Record<Exclude<PracticeAreaId, 'all'>, number> = {
  personal_injury: 1.12,
  family_law: 0.94,
  estate_planning: 0.88,
};

const MATTER_TYPE_WEIGHT: Record<Exclude<MatterTypeId, 'all'>, number> = {
  contingency: 1.08,
  hourly: 1,
  flat_fee: 0.93,
};

const ATTORNEY_WEIGHT: Record<Exclude<LeadAttorneyId, 'all'>, number> = {
  chen: 1.05,
  ortiz: 0.98,
  nakamura: 1.02,
};

/** Shared matter / partner / matter-type slice (other reports reuse this cube). */
export type MatterFilterSlice = Pick<ProfitLossViewState, 'practiceArea' | 'leadAttorney' | 'matterType'>;

export function matterFilterScale(d: MatterFilterSlice): number {
  let m = 1;
  if (d.practiceArea !== 'all') m *= PRACTICE_AREA_WEIGHT[d.practiceArea];
  if (d.matterType !== 'all') m *= MATTER_TYPE_WEIGHT[d.matterType];
  if (d.leadAttorney !== 'all') m *= ATTORNEY_WEIGHT[d.leadAttorney];
  return m;
}

function dimensionScale(state: ProfitLossViewState): number {
  return matterFilterScale(state);
}

export function reportPeriodScale(preset: PlPeriodPreset): number {
  switch (preset) {
    case 'this_month':
      return 1;
    case 'last_month':
      return 0.96;
    case 'ytd':
      return 3.15;
    default:
      return 1;
  }
}

/** Prior period multiplier vs "current" for comparison column */
export function reportPriorPeriodFactor(comparison: PlComparison, period: PlPeriodPreset): number {
  if (comparison === 'none') return 1;
  if (comparison === 'mom') {
    return period === 'last_month' ? 0.94 : 0.97;
  }
  // yoy — same month last year ~ firm growth story
  return 0.88;
}

function toCurrency(n: number): string {
  const abs = Math.abs(n);
  const fmt = abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n < 0) return `($${fmt})`;
  if (n === 0) return '—';
  return `$${fmt}`;
}

function pctOfRev(amount: number, totalRevenue: number): string {
  if (totalRevenue <= 0) return '—';
  const p = (amount / totalRevenue) * 100;
  return `${p.toFixed(1)}%`;
}

export type ProfitLossDisplayRow = {
  account: string;
  amount: string;
  current?: number;
  prior?: string;
  budget?: string;
  variance?: string;
  pctOfRev?: string;
  isHeader?: boolean;
  isTotal?: boolean;
  isGrandTotal?: boolean;
  payroll?: boolean;
  accountId?: string;
  /** Soft highlight for payroll narrative */
  dimmed?: boolean;
};

function applyBasis(accrualVal: number, meta: ProfitLossAccountMeta, basis: PlBasis): number {
  if (basis === 'accrual') return accrualVal;
  return accrualVal * meta.cashLagFactor;
}

export function deriveProfitLossTotals(state: ProfitLossViewState): {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  totalRevenuePrior: number;
  totalExpensesPrior: number;
  netIncomePrior: number;
} {
  const rows = deriveProfitLossRows(state);
  let tr = 0;
  let te = 0;
  let trP = 0;
  let teP = 0;
  for (const r of rows) {
    if (r.account === 'Total Revenues' && r.current != null) {
      tr = r.current;
      if (r.prior) trP = parsePriorNumber(r.prior);
    }
    if (r.account === 'Total Expenses' && r.current != null) {
      te = r.current;
      if (r.prior) teP = parsePriorNumber(r.prior);
    }
  }
  return {
    totalRevenue: tr,
    totalExpenses: te,
    netIncome: tr - te,
    totalRevenuePrior: trP,
    totalExpensesPrior: teP,
    netIncomePrior: trP - teP,
  };
}

function parsePriorNumber(s: string): number {
  const clean = s.replace(/[$,]/g, '').replace(/[()]/g, '');
  const n = parseFloat(clean);
  if (s.includes('(')) return -Math.abs(n);
  return n;
}

export function deriveProfitLossRows(state: ProfitLossViewState): ProfitLossDisplayRow[] {
  const dim = dimensionScale(state);
  const pScale = reportPeriodScale(state.period);
  const priorFactor = reportPriorPeriodFactor(state.comparison, state.period);
  const netRevFactor = state.revenueView === 'net' ? 0.94 : 1;

  const lineAmounts: {
    meta: ProfitLossAccountMeta;
    current: number;
    prior: number;
    budget: number;
  }[] = [];

  for (const a of PROFIT_LOSS_ACCOUNTS) {
    if (state.hideReimbursableClientCosts && a.reimbursable) continue;
    if (state.payrollAttribution !== 'all' && a.section === 'expense' && a.isPayrollFamily) {
      if (a.payrollAttribution !== 'na' && a.payrollAttribution !== state.payrollAttribution) continue;
    }

    let accrual = a.baseAccrual * dim * pScale;
    if (a.section === 'revenue') accrual *= netRevFactor;

    const current = applyBasis(accrual, a, state.basis);
    const priorAccrual = accrual * priorFactor;
    const prior = applyBasis(priorAccrual, a, state.basis);
    const budgetNoise = 0.92 + (a.id.length % 7) * 0.02;
    const budget = current * budgetNoise;

    lineAmounts.push({ meta: a, current, prior, budget });
  }

  let revenueLines = lineAmounts.filter((x) => x.meta.section === 'revenue');
  let expenseLines = lineAmounts.filter((x) => x.meta.section === 'expense');
  if (state.sortByVarianceDesc && state.showBudgetVariance) {
    expenseLines = [...expenseLines].sort(
      (x, y) =>
        Math.abs(y.current - y.budget) / (Math.abs(y.budget) + 1) -
        Math.abs(x.current - x.budget) / (Math.abs(x.budget) + 1),
    );
  }

  const totalRev = revenueLines.reduce((s, x) => s + x.current, 0);
  const totalRevPrior = revenueLines.reduce((s, x) => s + x.prior, 0);

  const mkLine = (x: (typeof lineAmounts)[0]): ProfitLossDisplayRow => {
    const v = x.current - x.budget;
    const varStr =
      x.budget === 0
        ? '—'
        : `${v >= 0 ? '' : '('}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${v < 0 ? ')' : ''}`;
    const dimmed = state.highlightPayrollOnly && !x.meta.isPayrollFamily;
    const row: ProfitLossDisplayRow = {
      account: x.meta.label,
      amount: toCurrency(x.current),
      current: x.current,
      prior: state.comparison !== 'none' ? toCurrency(x.prior) : undefined,
      budget: state.showBudgetVariance ? toCurrency(x.budget) : undefined,
      variance: state.showBudgetVariance ? varStr : undefined,
      pctOfRev:
        state.showPctOfRevenue && x.meta.section === 'expense' && totalRev > 0
          ? pctOfRev(x.current, totalRev)
          : state.showPctOfRevenue && x.meta.section === 'revenue' && totalRev > 0
            ? pctOfRev(x.current, totalRev)
            : undefined,
      payroll: x.meta.isPayrollFamily,
      accountId: x.meta.id,
      dimmed,
    };
    return row;
  };

  const out: ProfitLossDisplayRow[] = [];

  out.push({ account: 'Revenues', amount: '', isHeader: true });
  for (const x of revenueLines) out.push(mkLine(x));
  out.push({
    account: 'Total Revenues',
    amount: toCurrency(totalRev),
    current: totalRev,
    prior: state.comparison !== 'none' ? toCurrency(totalRevPrior) : undefined,
    isHeader: true,
    isTotal: true,
  });

  out.push({ account: 'Expenses', amount: '', isHeader: true });
  for (const x of expenseLines) out.push(mkLine(x));

  const totalExp = expenseLines.reduce((s, x) => s + x.current, 0);
  const totalExpPrior = expenseLines.reduce((s, x) => s + x.prior, 0);
  const totalBudget = expenseLines.reduce((s, x) => s + x.budget, 0);
  const varTotal = totalExp - totalBudget;

  out.push({
    account: 'Total Expenses',
    amount: toCurrency(totalExp),
    current: totalExp,
    prior: state.comparison !== 'none' ? toCurrency(totalExpPrior) : undefined,
    budget: state.showBudgetVariance ? toCurrency(totalBudget) : undefined,
    variance: state.showBudgetVariance
      ? `${varTotal >= 0 ? '' : '('}$${Math.abs(varTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${varTotal < 0 ? ')' : ''}`
      : undefined,
    isHeader: true,
    isTotal: true,
  });

  const net = totalRev - totalExp;
  const netPrior = totalRevPrior - totalExpPrior;
  out.push({
    account: 'Net Income',
    amount: toCurrency(net),
    current: net,
    prior: state.comparison !== 'none' ? toCurrency(netPrior) : undefined,
    isHeader: true,
    isTotal: true,
    isGrandTotal: true,
  });

  return out;
}

/** Compact 2-col rows for embedded widgets (matches ReportTableRow). */
export function profitLossRowsToLegacyTable(state: ProfitLossViewState): {
  account: string;
  amount: string;
  isHeader?: boolean;
  isTotal?: boolean;
  isGrandTotal?: boolean;
  payroll?: boolean;
}[] {
  const rich = deriveProfitLossRows(state);
  return rich.map((r) => ({
    account: r.account,
    amount: r.amount,
    isHeader: r.isHeader,
    isTotal: r.isTotal,
    isGrandTotal: r.isGrandTotal,
    payroll: r.payroll,
  }));
}

/** Short preset label for table chrome (pairs with `profitLossPeriodLabel` range text). */
export function periodPresetLabel(period: PlPeriodPreset): string {
  switch (period) {
    case 'this_month':
      return 'This month';
    case 'last_month':
      return 'Last month';
    case 'ytd':
      return 'Year to date';
    default:
      return period;
  }
}

export function profitLossPeriodLabel(state: ProfitLossViewState): string {
  switch (state.period) {
    case 'this_month':
      return 'Jan 1 – Jan 31, 2026';
    case 'last_month':
      return 'Dec 1 – Dec 31, 2025';
    case 'ytd':
      return 'Jan 1 – Jan 31, 2026 (YTD slice)';
    default:
      return '';
  }
}

export function profitLossBasisLabel(state: ProfitLossViewState): string {
  return state.basis === 'accrual' ? 'Accrual' : 'Cash';
}

/** Seeded collection index (0–100) when overlay on */
export function profitLossCollectionIndex(state: ProfitLossViewState): { dso: number; label: string } | null {
  if (!state.collectionOverlay || state.practiceArea === 'all') return null;
  const base = state.practiceArea === 'personal_injury' ? 52 : state.practiceArea === 'family_law' ? 38 : 44;
  const matterAdj = state.matterType === 'contingency' ? 8 : state.matterType === 'hourly' ? -4 : 2;
  const dso = Math.round(base + matterAdj);
  return {
    dso,
    label: `Collection signal: ~${dso} days to cash (prototype index) for ${PRACTICE_AREA_OPTIONS.find((o) => o.id === state.practiceArea)?.label ?? ''}`,
  };
}
