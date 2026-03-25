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
} from '../data/profitLossReportModel';
import type { StandardReportViewState } from '../data/standardReportModel';
import { cn } from './ui/utils';
import {
  PolarisFilterField,
  PolarisFiltersGroupDivider,
  PolarisFiltersToggleStrip,
  PolarisFilterSwitch,
  PolarisReportFiltersChromeShell,
} from './reportPolarisFilters';

type StandardReportFiltersChromeProps = {
  state: StandardReportViewState;
  onChange: (patch: Partial<StandardReportViewState>) => void;
  className?: string;
};

/** Matter, period, and analysis controls in Polaris Filters bar style (aligned with P&amp;L). */
export function StandardReportFiltersChrome({ state, onChange, className }: StandardReportFiltersChromeProps) {
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
        </div>

        <PolarisFiltersGroupDivider />

        <PolarisFiltersToggleStrip>
          <PolarisFilterSwitch
            id="sr-pct"
            checked={state.showPctOfTotal}
            onCheckedChange={(v) => onChange({ showPctOfTotal: v })}
            label="% of report total"
          />
          <PolarisFilterSwitch
            id="sr-bud"
            checked={state.showBudgetVariance}
            onCheckedChange={(v) => onChange({ showBudgetVariance: v })}
            label="Budget & variance"
          />
        </PolarisFiltersToggleStrip>
      </div>
    </PolarisReportFiltersChromeShell>
  );
}
