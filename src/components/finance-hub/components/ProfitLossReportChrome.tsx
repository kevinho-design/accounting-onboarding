import React from 'react';
import {
  LEAD_ATTORNEY_OPTIONS,
  MATTER_TYPE_OPTIONS,
  PRACTICE_AREA_OPTIONS,
  type LeadAttorneyId,
  type MatterTypeId,
  type PlBasis,
  type PlComparison,
  type PlPeriodPreset,
  type PracticeAreaId,
  type ProfitLossViewState,
  type RevenueView,
  type PayrollAttributionFilter,
} from '../data/profitLossReportModel';
import { cn } from './ui/utils';
import {
  PolarisFilterField,
  PolarisFiltersGroupDivider,
  PolarisFiltersToggleStrip,
  PolarisFilterSwitch,
  PolarisReportFiltersChromeShell,
} from './reportPolarisFilters';

type ProfitLossReportChromeProps = {
  state: ProfitLossViewState;
  onChange: (patch: Partial<ProfitLossViewState>) => void;
  collectionHint: string | null;
  className?: string;
};

export function ProfitLossReportChrome({ state, onChange, collectionHint, className }: ProfitLossReportChromeProps) {
  return (
    <PolarisReportFiltersChromeShell className={cn(className)}>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-3 items-end">
          <PolarisFilterField
            label="Practice area"
            value={state.practiceArea}
            onValueChange={(v) => onChange({ practiceArea: v as PracticeAreaId })}
            options={PRACTICE_AREA_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
          />
          <PolarisFilterField
            label="Lead / originating"
            value={state.leadAttorney}
            onValueChange={(v) => onChange({ leadAttorney: v as LeadAttorneyId })}
            options={LEAD_ATTORNEY_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
          />
          <PolarisFilterField
            label="Matter type"
            value={state.matterType}
            onValueChange={(v) => onChange({ matterType: v as MatterTypeId })}
            options={MATTER_TYPE_OPTIONS.map((o) => ({ value: o.id, label: o.label }))}
            minWidthClass="min-w-[140px]"
          />
        </div>

        <PolarisFiltersGroupDivider />

        <div className="flex flex-wrap gap-3 items-end pt-1">
          <PolarisFilterField
            label="Basis"
            value={state.basis}
            onValueChange={(v) => onChange({ basis: v as PlBasis })}
            options={[
              { value: 'accrual', label: 'Accrual' },
              { value: 'cash', label: 'Cash' },
            ]}
            minWidthClass="min-w-[120px]"
          />
          <PolarisFilterField
            label="Period"
            value={state.period}
            onValueChange={(v) => onChange({ period: v as PlPeriodPreset })}
            options={[
              { value: 'this_month', label: 'This month' },
              { value: 'last_month', label: 'Last month' },
              { value: 'ytd', label: 'YTD' },
            ]}
            minWidthClass="min-w-[130px]"
          />
          <PolarisFilterField
            label="Compare"
            value={state.comparison}
            onValueChange={(v) => onChange({ comparison: v as PlComparison })}
            options={[
              { value: 'none', label: 'Off' },
              { value: 'mom', label: 'MoM' },
              { value: 'yoy', label: 'YoY' },
            ]}
            minWidthClass="min-w-[120px]"
          />
          <PolarisFilterField
            label="Revenue view"
            value={state.revenueView}
            onValueChange={(v) => onChange({ revenueView: v as RevenueView })}
            options={[
              { value: 'gross', label: 'Gross revenue' },
              { value: 'net', label: 'Net (after write-offs)' },
            ]}
            minWidthClass="min-w-[150px]"
          />
          <PolarisFilterField
            label="Payroll lens"
            value={state.payrollAttribution}
            onValueChange={(v) => onChange({ payrollAttribution: v as PayrollAttributionFilter })}
            options={[
              { value: 'all', label: 'All expenses' },
              { value: 'billable', label: 'Payroll: billable time' },
              { value: 'nonbillable', label: 'Payroll: admin / overhead' },
            ]}
            minWidthClass="min-w-[170px]"
          />
        </div>

        <PolarisFiltersGroupDivider />

        <PolarisFiltersToggleStrip>
          <PolarisFilterSwitch
            id="pl-reimb"
            checked={state.hideReimbursableClientCosts}
            onCheckedChange={(v) => onChange({ hideReimbursableClientCosts: v })}
            label="Hide reimbursable client costs"
          />
          <PolarisFilterSwitch
            id="pl-pct"
            checked={state.showPctOfRevenue}
            onCheckedChange={(v) => onChange({ showPctOfRevenue: v })}
            label="% of revenue"
          />
          <PolarisFilterSwitch
            id="pl-bud"
            checked={state.showBudgetVariance}
            onCheckedChange={(v) => onChange({ showBudgetVariance: v })}
            label="Budget & variance"
          />
          <PolarisFilterSwitch
            id="pl-sortv"
            checked={state.sortByVarianceDesc}
            onCheckedChange={(v) => onChange({ sortByVarianceDesc: v })}
            label="Sort expenses by variance"
            disabled={!state.showBudgetVariance}
          />
          <PolarisFilterSwitch
            id="pl-coll"
            checked={state.collectionOverlay}
            onCheckedChange={(v) => onChange({ collectionOverlay: v })}
            label="Collection overlay"
          />
        </PolarisFiltersToggleStrip>

        {collectionHint ? (
          <p className="text-xs leading-snug text-blue-900 bg-blue-50 border border-blue-200/80 rounded-md px-3 py-2">
            {collectionHint}
          </p>
        ) : null}
      </div>
    </PolarisReportFiltersChromeShell>
  );
}
