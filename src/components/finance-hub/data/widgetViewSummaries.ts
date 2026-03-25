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

export type CatalogWidgetSummary = {
  kpis: { label: string; value: string }[];
  insight: string;
};

function fmtMoney(n: number): string {
  return `$${n.toLocaleString()}`;
}

function sumAr(briefingSnapshot: BriefingFinancialSnapshot): number {
  return briefingSnapshot.arAging.reduce((s, b) => s + b.value, 0);
}

export function getCatalogWidgetSummary(
  widgetId: string,
  briefingSnapshot: BriefingFinancialSnapshot,
  last: StrategicMonthRow | undefined,
): CatalogWidgetSummary | null {
  const month = last?.month ?? '—';

  switch (widgetId) {
    case 'runway':
    case 'strat_runway': {
      const r = last?.runway ?? 0;
      return {
        kpis: [
          { label: 'Latest month', value: month },
          { label: 'Runway (months)', value: `${r}` },
          { label: 'Cash (model)', value: last != null ? fmtMoney(last.cash) : '—' },
        ],
        insight:
          'Runway blends operating cash and burn. Toggle peer benchmark or a modelling preview on the live page to compare trajectories.',
      };
    }
    case 'cash_flow': {
      const bars = briefingSnapshot.cashFlowBars;
      const b = bars[bars.length - 1];
      return {
        kpis: [
          { label: 'Latest month', value: b?.month ?? month },
          { label: 'Cash in (index)', value: b != null ? String(b.in) : '—' },
          { label: 'Cash out (index)', value: b != null ? String(b.out) : '—' },
        ],
        insight:
          'Bars are prototype indices derived from strategic cash and burn. Scenario and peer lines appear when modelling or benchmarks are on.',
      };
    }
    case 'ar_aging': {
      const total = sumAr(briefingSnapshot);
      const top = [...briefingSnapshot.arAging].sort((a, b) => b.value - a.value)[0];
      return {
        kpis: [
          { label: 'Total A/R', value: fmtMoney(total) },
          { label: 'Largest bucket', value: top?.name ?? '—' },
          { label: 'That bucket', value: top != null ? fmtMoney(top.value) : '—' },
        ],
        insight:
          'Aging mix updates when collection-related briefing plans are executed—watch 61–90 and 90+ for goal risk.',
      };
    }
    case 'expense_rep': {
      const top = [...briefingSnapshot.expenseRep].sort((a, b) => b.value - a.value)[0];
      const total = briefingSnapshot.expenseRep.reduce((s, e) => s + e.value, 0);
      return {
        kpis: [
          { label: 'Expense mix total', value: fmtMoney(total) },
          { label: 'Top category', value: top?.name ?? '—' },
          { label: 'Top amount', value: top != null ? fmtMoney(top.value) : '—' },
        ],
        insight: 'Slice reflects the same prototype buckets as your embedded expense reports and profitability stacks.',
      };
    }
    case 'rev_target': {
      const { centerPct, footerAmount, subtitle } = briefingSnapshot.revenue;
      return {
        kpis: [
          { label: 'Progress', value: `${centerPct}%` },
          { label: 'Current Q3 rev', value: fmtMoney(footerAmount) },
          { label: 'Lens', value: subtitle || 'Quarter plan' },
        ],
        insight: 'Gauge ties to firm revenue goals—pair with Financial Goals and collections widgets for context.',
      };
    }
    case 'strat_cash': {
      return {
        kpis: [
          { label: 'Latest month', value: month },
          { label: 'Operating cash', value: last != null ? fmtMoney(last.cash) : '—' },
          { label: 'Burn (month)', value: last != null ? fmtMoney(last.burn) : '—' },
        ],
        insight: 'Area chart tracks operating cash with optional scenario preview and peer composite overlays.',
      };
    }
    case 'strat_burn': {
      return {
        kpis: [
          { label: 'Latest month', value: month },
          { label: 'Monthly burn', value: last != null ? fmtMoney(last.burn) : '—' },
          { label: 'Runway (mo)', value: last != null ? String(last.runway) : '—' },
        ],
        insight: 'Burn bars align to strategic dashboard months; overlays show peer and scenario stress paths.',
      };
    }
    case 'practice_areas': {
      const top = [...practiceAreaRevenueVsGoal].sort((a, b) => b.revenue - a.revenue)[0];
      const total = practiceAreaRevenueVsGoal.reduce((s, p) => s + p.revenue, 0);
      return {
        kpis: [
          { label: 'Practice areas', value: String(practiceAreaRevenueVsGoal.length) },
          { label: 'Total revenue ($k)', value: String(total) },
          { label: 'Largest', value: top ? `${top.area} ($${top.revenue}k)` : '—' },
        ],
        insight: 'Bars compare recognized revenue ($k) to a goal-mix index derived from firm plan weights.',
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
      };
    case 'collection_trends': {
      const lastCt = collectionTrendSeries[collectionTrendSeries.length - 1];
      return {
        kpis: [
          { label: 'Latest month', value: lastCt?.month ?? '—' },
          { label: 'Collections ($k)', value: lastCt != null ? String(lastCt.collections) : '—' },
          { label: 'DSO (days)', value: lastCt != null ? String(lastCt.dso) : '—' },
        ],
        insight: 'Collections and DSO move together in this prototype—execute briefing plans to shift the baseline.',
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
      return {
        kpis: [
          { label: 'Partners', value: String(partnerRealizationRows.length) },
          { label: 'Avg realization', value: `${avg}%` },
          { label: 'Top partner', value: best ? `${best.partner} (${best.realization}%)` : '—' },
        ],
        insight: 'Bars compare realization to internal targets—useful before rate and staffing conversations.',
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
      };
    }
    case 'profitability_margin': {
      const pl = briefingSnapshot.profitabilityMarginTrend;
      const lastPl = pl[pl.length - 1];
      const avgMargin =
        pl.length > 0 ? Math.round((pl.reduce((s, x) => s + x.operatingMarginPct, 0) / pl.length) * 10) / 10 : 0;
      return {
        kpis: [
          { label: 'Latest month', value: lastPl?.month ?? '—' },
          { label: 'Operating margin', value: lastPl != null ? `${lastPl.operatingMarginPct}%` : '—' },
          { label: 'Avg margin (window)', value: `${avgMargin}%` },
        ],
        insight: 'Composed chart pairs revenue and OpEx bars with margin %—full mode shows month-by-month detail.',
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
      };
    case 'fho_operating_cash_detail':
      return {
        kpis: [
          { label: 'Focus', value: 'Operating cash' },
          { label: 'Latest cash', value: last != null ? fmtMoney(last.cash) : '—' },
          { label: 'Burn', value: last != null ? fmtMoney(last.burn) : '—' },
        ],
        insight: 'Bridge table explains cash movement vs Dashboard KPI—full mode includes driver rows.',
      };
    case 'fho_revenue_detail':
      return {
        kpis: [
          { label: 'Revenue lens', value: 'Recognized + pipeline' },
          { label: 'Progress', value: `${briefingSnapshot.revenue.centerPct}%` },
          { label: 'Mix', value: 'Practice + stream' },
        ],
        insight: 'Combines recognized revenue with Grow-style pipeline context in the detailed layout.',
      };
    case 'fho_ar_at_risk_detail':
      return {
        kpis: [
          { label: 'A/R at risk', value: fmtMoney(sumAr(briefingSnapshot)) },
          { label: '60+ watch', value: 'Per bucket' },
          { label: 'Actions', value: 'Collections' },
        ],
        insight: 'Surfaces overdue concentration—full view lists client patterns aligned with briefing insights.',
      };
    case 'fho_runway_detail':
      return {
        kpis: [
          { label: 'Runway', value: last != null ? `${last.runway} mo` : '—' },
          { label: 'Cash', value: last != null ? fmtMoney(last.cash) : '—' },
          { label: 'Trend', value: '6-mo path' },
        ],
        insight: 'Extended runway narrative matches the Dashboard card with more months of context.',
      };
    case 'fho_iolta_trust_detail':
      return {
        kpis: [
          { label: 'Trust focus', value: 'IOLTA' },
          { label: 'Compliance', value: 'Checklist' },
          { label: 'Balances', value: 'Prototype' },
        ],
        insight: 'Trust balances and compliance rows are prototype—full mode shows checklist-style detail.',
      };
    case 'fho_unbilled_detail':
      return {
        kpis: [
          { label: 'WIP lens', value: 'Unbilled time' },
          { label: 'Aging', value: 'Ranked matters' },
          { label: 'Goal tie-in', value: 'Realization' },
        ],
        insight: 'Ranks matters by aged WIP—open full for the complete table aligned with billing health.',
      };
    case 'ambient_cfo':
      return {
        kpis: [
          { label: 'Insights', value: 'This week' },
          { label: 'Mode', value: 'Live briefing' },
          { label: 'Actions', value: 'Take action / Explore' },
        ],
        insight: 'Summary shows the briefing strip condensed; Chart uses compact layout; Full shows every insight.',
      };
    case 'digital_twin':
      return {
        kpis: [
          { label: 'Scenarios', value: 'What-if' },
          { label: 'Data', value: 'Strategic series' },
          { label: 'Goal', value: 'Stress paths' },
        ],
        insight: 'Digital Twin overlays scenario curves on your runway and cash context—explore from full mode.',
      };
    case 'financial_goals':
      return {
        kpis: [
          { label: 'Goals', value: '3 firm targets' },
          { label: 'Q3 revenue', value: fmtMoney(briefingSnapshot.financialGoals.q3Current) },
          { label: 'Reserve', value: fmtMoney(briefingSnapshot.financialGoals.reserveCurrent) },
        ],
        insight: 'Same definitions as the Financial Goals page—Firm Intelligence filters insights through these bars.',
      };
    case 'suggested_modelling':
      return {
        kpis: [
          { label: 'Modelling', value: 'Scenarios' },
          { label: 'Preview', value: 'Chart overlay' },
          { label: 'Goals', value: 'Link models' },
        ],
        insight: 'Preview toggles apply scenario curves to strategic charts; Explore opens the modelling review panel.',
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
