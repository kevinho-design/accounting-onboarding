import React from 'react';
import { Building2, Briefcase, FileText, User, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { DrillDownMetric, DrillDownNode } from '../data/drillDownLadder';
import { DRILL_LEVEL_LABEL } from '../data/drillDownLadder';

const LEVEL_ICONS: Record<DrillDownNode['level'], LucideIcon> = {
  firm: Building2,
  practice_area: Briefcase,
  matter: FileText,
  person: User,
};

function metricChipClass(tone: DrillDownMetric['tone']): string {
  const base =
    'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold tabular-nums';
  if (tone === 'positive') return `${base} border-emerald-200 bg-emerald-50 text-emerald-800`;
  if (tone === 'negative') return `${base} border-amber-200 bg-amber-50 text-amber-900`;
  return `${base} border-gray-200 bg-white text-gray-700`;
}

function NodeHeader({ node }: { node: DrillDownNode }) {
  const Icon = LEVEL_ICONS[node.level];
  return (
    <div className="flex items-start gap-2 min-w-0">
      <Icon className="w-4 h-4 shrink-0 text-gray-500 mt-0.5" strokeWidth={1.75} aria-hidden />
      <div className="min-w-0">
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
          {DRILL_LEVEL_LABEL[node.level]}
        </span>
        <h4 className="text-[13px] font-bold text-gray-900 leading-tight">{node.title}</h4>
        {node.subtitle ? <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{node.subtitle}</p> : null}
      </div>
    </div>
  );
}

function MetricsAndNarrative({ node }: { node: DrillDownNode }) {
  return (
    <>
      <div className="flex flex-wrap gap-1.5 mt-3" role="list" aria-label="Key metrics at this level">
        {node.metrics.map((m) => (
          <span key={m.label} className={metricChipClass(m.tone)} role="listitem">
            <span className="font-medium text-gray-500">{m.label}</span> {m.value}
          </span>
        ))}
      </div>
      <p className="text-[12.25px] text-[#364153] leading-relaxed mt-2">{node.narrative}</p>
    </>
  );
}

type DrillDownTreeNodeProps = {
  node: DrillDownNode;
};

function DrillDownTreeNode({ node }: DrillDownTreeNodeProps) {
  const hasKids = Boolean(node.children?.length);

  if (!hasKids) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
        <NodeHeader node={node} />
        <MetricsAndNarrative node={node} />
      </div>
    );
  }

  return (
    <details
      open
      className="rounded-lg border border-gray-200 bg-gray-50/60 p-3 group shadow-sm"
      role="group"
    >
      <summary className="flex cursor-pointer list-none items-start gap-2 select-none [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md">
        <ChevronRight
          className="h-4 w-4 shrink-0 text-gray-400 mt-1 transition-transform duration-200 group-open:rotate-90"
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <NodeHeader node={node} />
        </div>
      </summary>
      <div
        className="mt-3 pl-2 ml-1 border-l-2 border-blue-100 space-y-3"
        role="group"
        aria-label={`Breakdown for ${node.title}`}
      >
        <MetricsAndNarrative node={node} />
        <div className="space-y-2 pt-1" role="list">
          {node.children!.map((child) => (
            <DrillDownTreeNode key={child.id} node={child} />
          ))}
        </div>
      </div>
    </details>
  );
}

export type FirmWideDrillDownLadderProps = {
  root: DrillDownNode;
};

/**
 * In-panel ladder: firm → practice area → matter → person without route changes.
 * Nested native <details> for keyboard-accessible expand/collapse per branch.
 */
export function FirmWideDrillDownLadder({ root }: FirmWideDrillDownLadderProps) {
  return (
    <div className="space-y-2" role="region" aria-label="Firm-wide drill-down from signal to matter and individual">
      <DrillDownTreeNode node={root} />
    </div>
  );
}

/** One-line trail for collapsed summaries (e.g. Take action panel). */
export function formatDrillDownBreadcrumb(root: DrillDownNode, maxDepth = 4): string {
  const parts: string[] = [];
  let n: DrillDownNode | undefined = root;
  let d = 0;
  while (n && d < maxDepth) {
    parts.push(n.title);
    n = n.children?.[0];
    d += 1;
  }
  return parts.join(' → ');
}
