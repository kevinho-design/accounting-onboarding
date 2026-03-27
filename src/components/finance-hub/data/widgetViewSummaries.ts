/**
 * KPI + insight copy for Finances widget "Summary" display mode, and tabular rows for "Full" mode.
 * Values are tied to prototype seeds / live briefing snapshot where possible.
 */

import type { BriefingFinancialSnapshot } from './briefingFinancialImpact';
import type { StrategicMonthRow } from './strategicDashboardSeed';
import { FIRM_GOAL_DEFINITIONS } from './firmGoals';
import {
  practiceAreaRevenueVsGoal,
  billingHealthKpis,
  billingHealthSparkline,
  collectionTrendSeries,
  partnerRealizationRows,
} from './dashboardMetricSeed';

export type CatalogWidgetSuggestion = {
  text: string;
  /** Optional expanded narrative for Clio Teammate Plan when the user taps this suggestion */
  planSummary?: string;
};

export type CatalogWidgetSummary = {
  kpis: { label: string; value: string }[];
  insight: string;
  /** Firm Intelligence — actionable bullets in Summary mode */
  suggestions: CatalogWidgetSuggestion[];
};

export type CatalogWidgetSummaryOptions = {
  strategicPrev?: StrategicMonthRow;
  /** `embedded_report` widget */
  reportName?: string | null;
};

function fmtMoney(n: number): string {
  return `$${n.toLocaleString()}`;
}

function sumAr(briefingSnapshot: BriefingFinancialSnapshot): number {
  return briefingSnapshot.arAging.reduce((s, b) => s + b.value, 0);
}

function effectiveCash(r: StrategicMonthRow | undefined): number | undefined {
  if (!r) return undefined;
  return r.altCash ?? r.cash;
}

function effectiveBurn(r: StrategicMonthRow | undefined): number | undefined {
  if (!r) return undefined;
  return r.altBurn ?? r.burn;
}

function cashDeclined(prev: StrategicMonthRow | undefined, last: StrategicMonthRow | undefined): boolean {
  const a = effectiveCash(prev);
  const b = effectiveCash(last);
  if (a == null || b == null || a <= 0) return false;
  return b < a * 0.985;
}

function runwayDeclined(prev: StrategicMonthRow | undefined, last: StrategicMonthRow | undefined): boolean {
  if (!prev || !last) return false;
  return last.runway < prev.runway - 0.35;
}

function burnIncreased(prev: StrategicMonthRow | undefined, last: StrategicMonthRow | undefined): boolean {
  const pb = effectiveBurn(prev);
  const lb = effectiveBurn(last);
  if (pb == null || lb == null || pb <= 0) return false;
  return lb > pb * 1.025;
}

function arBucket(
  ar: BriefingFinancialSnapshot['arAging'],
  test: (name: string) => boolean,
): number {
  const b = ar.find((x) => test(x.name));
  return b?.value ?? 0;
}

function marginCompressed(briefingSnapshot: BriefingFinancialSnapshot): boolean {
  const pl = briefingSnapshot.profitabilityMarginTrend;
  if (pl.length < 2) return false;
  const a = pl[pl.length - 2]!.operatingMarginPct;
  const b = pl[pl.length - 1]!.operatingMarginPct;
  return b < a - 0.8;
}

function dsoWorsening(): boolean {
  const s = collectionTrendSeries;
  if (s.length < 2) return false;
  return s[s.length - 1]!.dso > s[s.length - 2]!.dso + 1;
}

function collectionsSoftening(): boolean {
  const s = collectionTrendSeries;
  if (s.length < 2) return false;
  return s[s.length - 1]!.collections < s[s.length - 2]!.collections - 2;
}

function cashFlowNetWorsening(briefingSnapshot: BriefingFinancialSnapshot): boolean {
  const bars = briefingSnapshot.cashFlowBars;
  if (bars.length < 2) return false;
  const a = bars[bars.length - 2]!;
  const b = bars[bars.length - 1]!;
  return b.in - b.out < a.in - a.out - 3;
}

/** Always 2–3 actionable lines */
function sg(...lines: [string, string, string?]): CatalogWidgetSuggestion[] {
  const out: CatalogWidgetSuggestion[] = [{ text: lines[0] }, { text: lines[1] }];
  if (lines[2]) out.push({ text: lines[2] });
  return out;
}

export function getCatalogWidgetSummary(
  widgetId: string,
  briefingSnapshot: BriefingFinancialSnapshot,
  last: StrategicMonthRow | undefined,
  options?: CatalogWidgetSummaryOptions,
): CatalogWidgetSummary | null {
  const prev = options?.strategicPrev;
  const month = last?.month ?? '—';
  const cashDown = cashDeclined(prev, last);
  const runwayDown = runwayDeclined(prev, last);
  const burnUp = burnIncreased(prev, last);

  switch (widgetId) {
    case 'embedded_report': {
      const rn = options?.reportName?.trim() || 'Report';
      return {
        kpis: [
          { label: 'Report', value: rn },
          { label: 'View', value: 'Snapshot on page' },
          { label: 'Next step', value: 'Full report' },
        ],
        insight:
          'This tile surfaces a report snapshot; filters and drill-downs live on the full report view.',
        suggestions: sg(
          `Open the full "${rn}" report to confirm period, basis, and any excluded entities before acting.`,
          'Reconcile notable movements to billing and cash entries this week so leadership sees a defensible story.',
          'Ask Firm Intelligence in Chat to tie this report to your firm goals and suggest one priority action.',
        ),
      };
    }
    case 'runway':
    case 'strat_runway': {
      const r = last?.runway ?? 0;
      const s1 =
        cashDown || runwayDown
          ? 'Cash and runway are tightening versus the prior month — prioritize collections on 61–90 and 90+ day invoices this week.'
          : 'Stress-test runway with a Digital Twin or modelling preview before the next leadership meeting.';
      const s2 = burnUp
        ? 'Burn ticked up — review discretionary spend and vendor renewals that can move without harming client delivery.'
        : 'Keep billing and time-entry cadence steady so recognized revenue supports the runway trajectory.';
      const s3 = 'Pair this chart with Operating cash and A/R aging to ensure one narrative across widgets.';
      return {
        kpis: [
          { label: 'Latest month', value: month },
          { label: 'Runway (months)', value: `${r}` },
          { label: 'Cash (model)', value: last != null ? fmtMoney(last.cash) : '—' },
        ],
        insight:
          'Runway blends operating cash and burn. Toggle peer benchmark or a modelling preview on the live page to compare trajectories.',
        suggestions: sg(s1, s2, s3),
      };
    }
    case 'cash_flow': {
      const bars = briefingSnapshot.cashFlowBars;
      const b = bars[bars.length - 1];
      const netBad = cashFlowNetWorsening(briefingSnapshot);
      const s1 = netBad
        ? 'Net operating flow weakened — send payment reminders on aging receivables and confirm large payables dates with AP.'
        : 'Maintain collections cadence on accounts past 30 days so inflows stay aligned with the cash-in index.';
      return {
        kpis: [
          { label: 'Latest month', value: b?.month ?? month },
          { label: 'Cash in (index)', value: b != null ? String(b.in) : '—' },
          { label: 'Cash out (index)', value: b != null ? String(b.out) : '—' },
        ],
        insight:
          'Bars are prototype indices derived from strategic cash and burn. Scenario and peer lines appear when modelling or benchmarks are on.',
        suggestions: sg(
          s1,
          'Defer non-critical vendor spend until collections catch up if cash-out is elevated vs. prior months.',
          'Open the Cash Flow Statement when you need transaction-level proof for committee or lender questions.',
        ),
      };
    }
    case 'ar_aging': {
      const total = sumAr(briefingSnapshot);
      const top = [...briefingSnapshot.arAging].sort((a, b) => b.value - a.value)[0];
      const late = arBucket(briefingSnapshot.arAging, (n) => n.includes('61') || n.includes('90'));
      const s1 =
        late > 12000
          ? 'High balance in 61–90 / 90+ — run a partner-approved reminder wave and flag matters needing payment plans.'
          : 'Review largest buckets weekly; tie outreach to firm days-to-collect goals.';
      return {
        kpis: [
          { label: 'Total A/R', value: fmtMoney(total) },
          { label: 'Largest bucket', value: top?.name ?? '—' },
          { label: 'That bucket', value: top != null ? fmtMoney(top.value) : '—' },
        ],
        insight:
          'Aging mix updates when collection-related briefing plans are executed—watch 61–90 and 90+ for goal risk.',
        suggestions: sg(
          s1,
          'Match tone to client history: automated nudges for reliable payers, partner calls for chronic late payers.',
          'After reminders, update expected payment dates in Clio so cash forecasts stay trustworthy.',
        ),
      };
    }
    case 'expense_rep': {
      const top = [...briefingSnapshot.expenseRep].sort((a, b) => b.value - a.value)[0];
      const total = briefingSnapshot.expenseRep.reduce((s, e) => s + e.value, 0);
      const s1 =
        top?.name === 'Payroll' && burnUp
          ? 'Payroll leads the mix and burn is up — validate headcount vs. matter load before adding fixed cost.'
          : `Scrutinize "${top?.name ?? 'top'}" spend: cancel or renegotiate low-ROI subscriptions and marketing tests.`;
      return {
        kpis: [
          { label: 'Expense mix total', value: fmtMoney(total) },
          { label: 'Top category', value: top?.name ?? '—' },
          { label: 'Top amount', value: top != null ? fmtMoney(top.value) : '—' },
        ],
        insight: 'Slice reflects the same prototype buckets as your embedded expense reports and profitability stacks.',
        suggestions: sg(
          s1,
          'Open Expense by Category for line detail, then assign one owner per category over budget.',
          'If cash is tight, time discretionary expenses after expected collections land.',
        ),
      };
    }
    case 'rev_target': {
      const { centerPct, footerAmount, subtitle } = briefingSnapshot.revenue;
      const behind = centerPct < 72;
      const s1 = behind
        ? 'Behind revenue pace — accelerate billing for completed work and confirm pipeline coverage for the remainder of the quarter.'
        : 'Hold a short billing stand-up: unblock prebills and reduce aged WIP that is not yet invoiced.';
      return {
        kpis: [
          { label: 'Progress', value: `${centerPct}%` },
          { label: 'Current Q3 rev', value: fmtMoney(footerAmount) },
          { label: 'Lens', value: subtitle || 'Quarter plan' },
        ],
        insight: 'Gauge ties to firm revenue goals—pair with firm goals and collections widgets for context.',
        suggestions: sg(
          s1,
          'Align rate and realization conversations with practice leads where progress lags the goal mix.',
          'Use revenue streams and practice area widgets to see whether mix, not just volume, is the issue.',
        ),
      };
    }
    case 'strat_cash': {
      const s1 = cashDown
        ? 'Operating cash is trending down vs. last month — prioritize collections and confirm large outflows (payroll, distributions) are expected.'
        : 'Lock the cash bridge narrative with your bookkeeper: inflows vs. billing timing, outflows vs. payroll and rent.';
      return {
        kpis: [
          { label: 'Latest month', value: month },
          { label: 'Operating cash', value: last != null ? fmtMoney(last.cash) : '—' },
          { label: 'Burn (month)', value: last != null ? fmtMoney(last.burn) : '—' },
        ],
        insight: 'Area chart tracks operating cash with optional scenario preview and peer composite overlays.',
        suggestions: sg(
          s1,
          burnUp
            ? 'Burn increased — pause non-essential hiring and vendor adds until cash stabilizes.'
            : 'Turn on a modelling preview to show leadership best / base / stress cash paths in one view.',
          'Cross-check with the Runway widget so cash and months-of-runway tell the same story.',
        ),
      };
    }
    case 'strat_burn': {
      const s1 = burnUp
        ? 'Monthly burn rose — challenge recurring subscriptions and discretionary programs this week.'
        : 'Burn is stable — preserve capacity for strategic hires or tech that improves realization.';
      return {
        kpis: [
          { label: 'Latest month', value: month },
          { label: 'Monthly burn', value: last != null ? fmtMoney(last.burn) : '—' },
          { label: 'Runway (mo)', value: last != null ? String(last.runway) : '—' },
        ],
        insight: 'Burn bars align to strategic dashboard months; overlays show peer and scenario stress paths.',
        suggestions: sg(
          s1,
          runwayDown
            ? 'Runway shortened with burn — pair expense review with AR outreach so you attack both levers.'
            : 'Compare to peer overlay when enabled to sanity-check spend vs. similar firms.',
          'Document one “keep vs. cut” decision for the next management meeting.',
        ),
      };
    }
    case 'practice_areas': {
      const top = [...practiceAreaRevenueVsGoal].sort((a, b) => b.revenue - a.revenue)[0];
      const total = practiceAreaRevenueVsGoal.reduce((s, p) => s + p.revenue, 0);
      const smallest = [...practiceAreaRevenueVsGoal].sort((a, b) => a.revenue - b.revenue)[0];
      const s1 =
        smallest && smallest.revenue < 120
          ? `Practice area "${smallest.area}" is lightest on revenue — assign a lead partner to review pipeline, rates, and matter mix there.`
          : 'Rebalance marketing and BD spend toward areas underrepresented vs. strategic goal mix.';
      return {
        kpis: [
          { label: 'Practice areas', value: String(practiceAreaRevenueVsGoal.length) },
          { label: 'Total revenue ($k)', value: String(total) },
          { label: 'Largest', value: top ? `${top.area} ($${top.revenue}k)` : '—' },
        ],
        insight: 'Bars compare recognized revenue ($k) to a goal-mix index derived from firm plan weights.',
        suggestions: sg(
          s1,
          'Open Revenue by Practice Area when you need matter-level backup for leadership.',
          'Tie underperforming groups to firm revenue and days-to-collect goals in the next partner update.',
        ),
      };
    }
    case 'billing_health':
      return {
        kpis: [
          { label: 'Draft WIP', value: billingHealthKpis.draftWip },
          { label: 'Billed / goal', value: billingHealthKpis.billedVsGoal },
          { label: 'Realization', value: billingHealthKpis.realizationProxy },
        ],
        insight: 'Sparkline is a prototype health index; pair with Partner realization for leakage signals.',
        suggestions: sg(
          'Clear stale prebills and approve invoices for matters with large aged WIP — near-term cash impact.',
          'If billed vs. goal lags, set weekly billing targets per practice lead tied to firm revenue goals.',
          'Pair with Partner realization to coach on scope control before rates change.',
        ),
      };
    case 'collection_trends': {
      const lastCt = collectionTrendSeries[collectionTrendSeries.length - 1];
      const s1 = dsoWorsening()
        ? 'DSO is rising — tighten reminder cadence and escalate chronic accounts before quarter-end.'
        : collectionsSoftening()
          ? 'Collections dipped vs. prior month — confirm no large invoices slipped to next period.'
          : 'Keep weekly collections huddles focused on top 10 overdue accounts by amount.';
      return {
        kpis: [
          { label: 'Latest month', value: lastCt?.month ?? '—' },
          { label: 'Collections ($k)', value: lastCt != null ? String(lastCt.collections) : '—' },
          { label: 'DSO (days)', value: lastCt != null ? String(lastCt.dso) : '—' },
        ],
        insight: 'Collections and DSO move together in this prototype—execute briefing plans to shift the baseline.',
        suggestions: sg(
          s1,
          'Execute a collections playbook insight from This Week’s Briefing when it aligns with this trend.',
          'Cross-check A/R aging to ensure outreach matches the riskiest buckets first.',
        ),
      };
    }
    case 'partner_realization': {
      const avg =
        partnerRealizationRows.length > 0
          ? Math.round(
              partnerRealizationRows.reduce((s, r) => s + r.realization, 0) / partnerRealizationRows.length,
            )
          : 0;
      const best = [...partnerRealizationRows].sort((a, b) => b.realization - a.realization)[0];
      const worst = [...partnerRealizationRows].sort((a, b) => a.realization - b.realization)[0];
      const s1 =
        worst && worst.realization < worst.target - 5
          ? `Partner "${worst.partner}" is well below target — schedule a short scope and write-down review.`
          : 'Share aggregate realization vs. target in practice group meetings with one concrete coaching ask.';
      return {
        kpis: [
          { label: 'Partners', value: String(partnerRealizationRows.length) },
          { label: 'Avg realization', value: `${avg}%` },
          { label: 'Top partner', value: best ? `${best.partner} (${best.realization}%)` : '—' },
        ],
        insight: 'Bars compare realization to internal targets—useful before rate and staffing conversations.',
        suggestions: sg(
          s1,
          best
            ? `Study "${best.partner}" habits on scoping and billing — replicate where ethical and practical.`
            : 'Before rate increases, fix leakage; otherwise new rates won’t stick in the P&L.',
          'Use billing health and unbilled WIP widgets to find matters dragging realization.',
        ),
      };
    }
    case 'revenue_streams_trend': {
      const rows = briefingSnapshot.revenueStreamsTrend;
      const r = rows[rows.length - 1];
      const total =
        r != null ? r.hourly + r.flatFee + r.referral + r.other : 0;
      return {
        kpis: [
          { label: 'Latest month', value: r?.month ?? '—' },
          { label: 'Total gross ($k)', value: total > 0 ? String(round1(total)) : '—' },
          { label: 'Largest stream', value: r != null ? largestStreamKey(r) : '—' },
        ],
        insight: 'Stacked areas mirror executed briefing adjustments to the revenue baseline where applicable.',
        suggestions: sg(
          'If hourly dominates growth, watch utilization; if flat fee rises, validate scope buffers on new matters.',
          'Align stream mix shifts with firm strategy — redirect BD if one stream crowds out higher-margin work.',
          'Open P&L for recognized revenue detail when this chart raises questions.',
        ),
      };
    }
    case 'expense_stacked_trend': {
      const rows = briefingSnapshot.expenseStackedTrend;
      const r = rows[rows.length - 1];
      const total =
        r != null ? r.Payroll + r.Marketing + r.Software + r.Office : 0;
      return {
        kpis: [
          { label: 'Latest month', value: r?.month ?? '—' },
          { label: 'Total OpEx ($k)', value: total > 0 ? String(round1(total)) : '—' },
          { label: 'Payroll ($k)', value: r != null ? String(r.Payroll) : '—' },
        ],
        insight: 'Category stacks align to expense mix used elsewhere in Finances profitability views.',
        suggestions: sg(
          'If payroll layer grows faster than revenue, freeze net-new hires until billing cadence recovers.',
          'Challenge marketing and software line items quarterly — cancel unused seats and campaigns.',
          'Compare to operating margin widget so OpEx story matches headline profitability.',
        ),
      };
    }
    case 'profitability_margin': {
      const pl = briefingSnapshot.profitabilityMarginTrend;
      const lastPl = pl[pl.length - 1];
      const avgMargin =
        pl.length > 0 ? Math.round((pl.reduce((s, x) => s + x.operatingMarginPct, 0) / pl.length) * 10) / 10 : 0;
      const s1 = marginCompressed(briefingSnapshot)
        ? 'Operating margin compressed vs. prior month — prioritize revenue pull-forwards and pause discretionary spend.'
        : 'Margin healthy — reinvest selectively in BD or tools that improve realization.';
      return {
        kpis: [
          { label: 'Latest month', value: lastPl?.month ?? '—' },
          { label: 'Operating margin', value: lastPl != null ? `${lastPl.operatingMarginPct}%` : '—' },
          { label: 'Avg margin (window)', value: `${avgMargin}%` },
        ],
        insight: 'Composed chart pairs revenue and OpEx bars with margin %—full mode shows month-by-month detail.',
        suggestions: sg(
          s1,
          'Split the last move: revenue dip vs. expense creep — partners hear one causal story, not two.',
          'Use billing health and expense widgets to assign owners before the next close.',
        ),
      };
    }
    case 'fho_firm_goals_detail':
      return {
        kpis: [
          { label: 'Goals tracked', value: '3' },
          { label: 'Lens', value: 'Net revenue · DTC · Reserve' },
          { label: 'Status', value: 'Live vs plan' },
        ],
        insight: 'Goal strip ties recommendations to declared firm targets—expand for progress and narratives.',
        suggestions: sg(
          'For any goal behind pace, confirm whether the target or timeline still matches firm strategy — update so Firm Intelligence prioritizes the right work.',
          'Filter alerts and teammate recommendations through these goals so fixes move the metrics leadership cares about.',
          'Draft a short partner note: status, one risk, one decision per at-risk goal.',
        ),
      };
    case 'fho_operating_cash_detail':
      return {
        kpis: [
          { label: 'Focus', value: 'Operating cash' },
          { label: 'Latest cash', value: last != null ? fmtMoney(last.cash) : '—' },
          { label: 'Burn', value: last != null ? fmtMoney(last.burn) : '—' },
        ],
        insight: 'Bridge table explains cash movement vs Dashboard KPI—full mode includes driver rows.',
        suggestions: sg(
          cashDown
            ? 'Cash slipped — run the bridge with your bookkeeper and prioritize collections on the largest overdue invoices.'
            : 'Validate the bridge: large inflows tied to billing, outflows tied to payroll and scheduled payables.',
          'If trust activity is heavy this week, confirm operating vs. IOLTA separation before sign-off.',
          'Use Explore actions on this widget for a structured cash next-steps plan in Clio Teammate.',
        ),
      };
    case 'fho_revenue_detail':
      return {
        kpis: [
          { label: 'Revenue lens', value: 'Recognized + pipeline' },
          { label: 'Progress', value: `${briefingSnapshot.revenue.centerPct}%` },
          { label: 'Mix', value: 'Practice + stream' },
        ],
        insight: 'Combines recognized revenue with Grow-style pipeline context in the detailed layout.',
        suggestions: sg(
          briefingSnapshot.revenue.centerPct < 75
            ? 'Revenue vs. goal is soft — push prebills through and validate pipeline coverage for the quarter.'
            : 'Protect the pace — keep weekly billing targets visible to practice leads.',
          'Compare practice and stream mix; shift BD effort if one area over-concentrates risk.',
          'Use Explore actions to outline pipeline and billing actions for this week.',
        ),
      };
    case 'fho_ar_at_risk_detail':
      return {
        kpis: [
          { label: 'A/R at risk', value: fmtMoney(sumAr(briefingSnapshot)) },
          { label: '60+ watch', value: 'Per bucket' },
          { label: 'Actions', value: 'Collections' },
        ],
        insight: 'Surfaces overdue concentration—full view lists client patterns aligned with briefing insights.',
        suggestions: sg(
          arBucket(briefingSnapshot.arAging, (n) => n.includes('90')) > 4000
            ? '90+ balance is material — escalate to responsible partners with a payment plan or litigation triage.'
            : 'Run a prioritized reminder list for 61–90 day accounts before month-end.',
          'Tie outreach to days-to-collect goals; update expected pay dates after each client touch.',
          'Open Explore actions for collections options Firm Intelligence recommends.',
        ),
      };
    case 'fho_runway_detail':
      return {
        kpis: [
          { label: 'Runway', value: last != null ? `${last.runway} mo` : '—' },
          { label: 'Cash', value: last != null ? fmtMoney(last.cash) : '—' },
          { label: 'Trend', value: '6-mo path' },
        ],
        insight: 'Extended runway narrative matches the Dashboard card with more months of context.',
        suggestions: sg(
          runwayDown || cashDown
            ? 'Runway and cash are under pressure — combine AR acceleration with a short expense review.'
            : 'Hold runway steady — avoid large discretionary draws until collections land.',
          'Model a downside case (delayed collections) in Digital Twin or modelling and share with finance lead.',
          'Use Explore actions for runway-specific workflow options in Clio Teammate.',
        ),
      };
    case 'fho_iolta_trust_detail':
      return {
        kpis: [
          { label: 'Trust focus', value: 'IOLTA' },
          { label: 'Compliance', value: 'Checklist' },
          { label: 'Balances', value: 'Prototype' },
        ],
        insight: 'Trust balances and compliance rows are prototype—full mode shows checklist-style detail.',
        suggestions: sg(
          'Before period close, run three-way match on trust accounts and attach supporting transfers for any variance.',
          'Confirm client-matter assignment on retainer deposits flagged in compliance narratives.',
          'If operating cash is tight, do not borrow from trust — document and resolve separation issues first.',
        ),
      };
    case 'fho_unbilled_detail':
      return {
        kpis: [
          { label: 'WIP lens', value: 'Unbilled time' },
          { label: 'Aging', value: 'Ranked matters' },
          { label: 'Goal tie-in', value: 'Realization' },
        ],
        insight: 'Ranks matters by aged WIP—open full for the complete table aligned with billing health.',
        suggestions: sg(
          'Invoice matters with the oldest WIP first — improves near-term cash and cuts write-off risk.',
          'Pair high WIP matters to collection goals so reminders stay goal-aligned.',
          'Ask responsible partners to approve or write down stale time before quarter-end.',
        ),
      };
    case 'ambient_cfo':
      return {
        kpis: [
          { label: 'Insights', value: 'This week' },
          { label: 'Mode', value: 'Live briefing' },
          { label: 'Actions', value: 'Take action / Explore' },
        ],
        insight: 'Summary shows the briefing strip condensed; Chart uses compact layout; Full shows every insight.',
        suggestions: sg(
          'Pick one briefing insight, assign an owner and due date — don’t let the list become background noise.',
          'Use Take action when Firm Intelligence recommends a plan that moves a firm goal.',
          'Use Explore data when you need chart backup before deciding — then log the decision for your team.',
        ),
      };
    case 'digital_twin':
      return {
        kpis: [
          { label: 'Scenarios', value: 'What-if' },
          { label: 'Data', value: 'Strategic series' },
          { label: 'Goal', value: 'Stress paths' },
        ],
        insight: 'Digital Twin overlays scenario curves on your runway and cash context—explore from full mode.',
        suggestions: sg(
          'Run staffing and rate scenarios leadership actually debates — export the narrative, not just the chart.',
          'Compare twin outputs to live strategic cash and runway so stress cases feel grounded.',
          'After a scenario wins consensus, capture assumptions in modelling and link to firm goals when ready.',
        ),
      };
    case 'financial_goals':
      return {
        kpis: [
          { label: 'Goals', value: '3 firm targets' },
          { label: 'Q3 revenue', value: fmtMoney(briefingSnapshot.financialGoals.q3Current) },
          { label: 'Reserve', value: fmtMoney(briefingSnapshot.financialGoals.reserveCurrent) },
        ],
        insight: 'Same definitions as your firm goals strip—Firm Intelligence filters insights through these bars.',
        suggestions: sg(
          briefingSnapshot.financialGoals.q3ProgressPct < 70
            ? 'Q3 revenue goal is behind — accelerate billing and validate pipeline for the remainder of the period.'
            : 'Revenue goal on track — protect billing cadence and watch mix.',
          briefingSnapshot.financialGoals.reserveProgressPct < 75
            ? 'Cash reserve goal is short — tighten collections and defer non-critical spend until cushion recovers.'
            : 'Reserve healthy — maintain policy buffer before approving large distributions.',
          'Open Financial Health Overview when you need full goal narratives and linked widgets.',
        ),
      };
    case 'suggested_modelling':
      return {
        kpis: [
          { label: 'Modelling', value: 'Scenarios' },
          { label: 'Preview', value: 'Chart overlay' },
          { label: 'Goals', value: 'Link models' },
        ],
        insight: 'Preview toggles apply scenario curves to strategic charts; Explore opens the modelling review panel.',
        suggestions: sg(
          'Create a named model from one concrete question (e.g. payroll shortfall, rate increase) and preview on strategic charts.',
          'When leadership agrees on a scenario, add the model to Financial Goals so recommendations stay goal-aware.',
          'Use Explore actions on widgets to open structured plans alongside your custom models.',
        ),
      };
    default:
      return null;
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function largestStreamKey(r: {
  hourly: number;
  flatFee: number;
  referral: number;
  other: number;
}): string {
  const entries: [string, number][] = [
    ['Hourly', r.hourly],
    ['Flat fee', r.flatFee],
    ['Referral', r.referral],
    ['Other', r.other],
  ];
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0] ? `${entries[0][0]} ($${entries[0][1]}k)` : '—';
}

export function getCatalogWidgetFullRows(
  widgetId: string,
  briefingSnapshot: BriefingFinancialSnapshot,
  last: StrategicMonthRow | undefined,
): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const month = last?.month;

  switch (widgetId) {
    case 'runway':
    case 'strat_runway':
      briefingSnapshot.runwayTrend.slice(-6).forEach((t) => {
        rows.push({ label: t.month, value: `${t.runway} mo` });
      });
      break;
    case 'cash_flow':
      briefingSnapshot.cashFlowBars.slice(-6).forEach((b) => {
        rows.push({ label: b.month, value: `In ${b.in} · Out ${b.out}` });
      });
      break;
    case 'ar_aging':
      briefingSnapshot.arAging.forEach((b) => {
        rows.push({ label: b.name, value: fmtMoney(b.value) });
      });
      break;
    case 'expense_rep':
      briefingSnapshot.expenseRep.forEach((b) => {
        rows.push({ label: b.name, value: fmtMoney(b.value) });
      });
      break;
    case 'rev_target':
      rows.push(
        { label: 'Progress', value: `${briefingSnapshot.revenue.centerPct}%` },
        { label: 'Current Q3', value: fmtMoney(briefingSnapshot.revenue.footerAmount) },
        { label: 'Remaining (plan)', value: fmtMoney(briefingSnapshot.revenue.pieRemaining) },
      );
      break;
    case 'strat_cash':
    case 'strat_burn':
      if (last) {
        rows.push(
          { label: `${month ?? 'Latest'} · Cash`, value: fmtMoney(last.cash) },
          { label: 'Burn', value: fmtMoney(last.burn) },
          { label: 'Runway', value: `${last.runway} mo` },
        );
      }
      break;
    case 'practice_areas':
      practiceAreaRevenueVsGoal.forEach((p) => {
        rows.push({ label: p.area, value: `$${p.revenue}k · goal ${p.goalPct}%` });
      });
      break;
    case 'billing_health':
      rows.push(
        { label: 'Draft WIP', value: billingHealthKpis.draftWip },
        { label: 'Billed / goal', value: billingHealthKpis.billedVsGoal },
        { label: 'Realization', value: billingHealthKpis.realizationProxy },
      );
      billingHealthSparkline.forEach((x) => rows.push({ label: `Health ${x.m}`, value: String(x.v) }));
      break;
    case 'collection_trends':
      collectionTrendSeries.forEach((c) => {
        rows.push({ label: c.month, value: `$${c.collections}k · DSO ${c.dso}d` });
      });
      break;
    case 'partner_realization':
      partnerRealizationRows.forEach((p) => {
        rows.push({ label: p.partner, value: `${p.realization}% (tgt ${p.target}%)` });
      });
      break;
    case 'revenue_streams_trend':
      briefingSnapshot.revenueStreamsTrend.forEach((r) => {
        const t = r.hourly + r.flatFee + r.referral + r.other;
        rows.push({
          label: r.month,
          value: `Total ${round1(t)}k · H ${r.hourly} F ${r.flatFee}`,
        });
      });
      break;
    case 'expense_stacked_trend':
      briefingSnapshot.expenseStackedTrend.forEach((r) => {
        const t = r.Payroll + r.Marketing + r.Software + r.Office;
        rows.push({
          label: r.month,
          value: `Total ${round1(t)}k · Payroll ${r.Payroll}`,
        });
      });
      break;
    case 'profitability_margin':
      briefingSnapshot.profitabilityMarginTrend.forEach((r) => {
        rows.push({
          label: r.month,
          value: `Rev ${r.revenue}k · OpEx ${r.expenses}k · ${r.operatingMarginPct}%`,
        });
      });
      break;
    case 'financial_goals':
      FIRM_GOAL_DEFINITIONS.forEach((g) => {
        rows.push({
          label: g.title,
          value: `${g.progressCurrentLabel} → ${g.progressTargetLabel} · ${g.status === 'on_track' ? 'On track' : 'Behind'}`,
        });
      });
      break;
    default:
      rows.push({
        label: 'Detail',
        value: 'See chart above and widget description for full prototype context.',
      });
  }
  return rows;
}
