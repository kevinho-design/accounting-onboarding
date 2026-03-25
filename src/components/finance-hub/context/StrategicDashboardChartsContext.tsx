import React, { createContext, useContext } from 'react';
import type { StrategicMonthRow } from '../data/strategicDashboardSeed';
import type { BriefingFinancialSnapshot } from '../data/briefingFinancialImpact';

export type StrategicDashboardChartsContextValue = {
  displayStrategicData: StrategicMonthRow[];
  selectedModelId: string | null;
  peerBenchmarkEnabled: boolean;
  briefingSnapshot: BriefingFinancialSnapshot;
};

const StrategicDashboardChartsContext = createContext<StrategicDashboardChartsContextValue | null>(null);

export function StrategicDashboardChartsProvider({
  value,
  children,
}: {
  value: StrategicDashboardChartsContextValue;
  children: React.ReactNode;
}) {
  return (
    <StrategicDashboardChartsContext.Provider value={value}>
      {children}
    </StrategicDashboardChartsContext.Provider>
  );
}

export function useStrategicDashboardCharts() {
  return useContext(StrategicDashboardChartsContext);
}
