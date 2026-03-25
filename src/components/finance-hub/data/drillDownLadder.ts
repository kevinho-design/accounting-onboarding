/**
 * Structured firm → practice area → matter → person ladder for AI-suggested signals.
 * Prototype seed data; production would hydrate from Clio APIs.
 */

export type DrillDownLevel = 'firm' | 'practice_area' | 'matter' | 'person';

export type DrillDownMetricTone = 'positive' | 'negative' | 'neutral';

export type DrillDownMetric = {
  label: string;
  value: string;
  tone?: DrillDownMetricTone;
};

export type DrillDownNode = {
  level: DrillDownLevel;
  id: string;
  title: string;
  subtitle?: string;
  metrics: DrillDownMetric[];
  narrative: string;
  children?: DrillDownNode[];
};

export const DRILL_LEVEL_LABEL: Record<DrillDownLevel, string> = {
  firm: 'Firm',
  practice_area: 'Practice area',
  matter: 'Matter',
  person: 'Individual',
};
