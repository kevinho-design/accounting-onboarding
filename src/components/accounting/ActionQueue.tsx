import * as React from "react";
import {
  CheckCircle2,
  TrendingDown,
  Sparkles,
  Zap,
  ChevronDown,
  CheckSquare,
  Clock,
  Check,
  Loader2,
} from "lucide-react";
import { cn } from "../ui/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  type ActionCardData,
  type Priority,
  type AccountType,
  type CardType,
  mockActionCards,
  CONSOLIDATION_ELIGIBLE,
  consolidatedTitles,
  consolidatedSubtitles,
  consolidatedCTAs,
  cardTypeConfig,
} from "./ActionQueueTypes";
import { ActionCardShell, TealPulseConfirmation } from "./ActionCardShell";
import { ActionDetailPanel } from "./ActionDetailPanel";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type ViewMode = "active" | "resolved" | "snoozed";
type AccountFilter = "all" | AccountType;
type TimeFilter = "all" | "24h" | "7d" | "30d";

interface FilterState {
  priority: Priority;
  account: AccountFilter;
  time: TimeFilter;
}

type FeedItem =
  | { kind: "single"; card: ActionCardData }
  | { kind: "group"; type: CardType; cards: ActionCardData[] };

/* ═══════════════════════════════════════════════════════════════════════════
   GROUPING LOGIC
   ═══════════════════════════════════════════════════════════════════════════ */

function sumAmounts(cards: ActionCardData[]): string {
  const total = cards.reduce((sum, c) => {
    return sum + parseFloat(c.amount.replace(/[$,]/g, ""));
  }, 0);
  return "$" + total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function createGroupCard(type: CardType, cards: ActionCardData[]): ActionCardData {
  const titleFn = consolidatedTitles[type];
  const subtitle = consolidatedSubtitles[type] || `${cards.length} items grouped`;

  return {
    id: `group-${type}`,
    type,
    priority: cards[0].priority,
    timestamp: cards[0].timestamp,
    account: cards[0].account,
    amount: sumAmounts(cards),
    status: "new",
    title: titleFn ? titleFn(cards.length) : `${cards.length} ${cardTypeConfig[type].label} Items`,
    subtitle,
    evidenceRationale: `${cards.length} similar items detected and grouped for efficient batch review.`,
  };
}

function buildFeed(cards: ActionCardData[]): FeedItem[] {
  const typeGroups = new Map<CardType, ActionCardData[]>();
  const seen = new Set<CardType>();

  for (const card of cards) {
    if (CONSOLIDATION_ELIGIBLE.has(card.type)) {
      const existing = typeGroups.get(card.type) || [];
      existing.push(card);
      typeGroups.set(card.type, existing);
    }
  }

  const result: FeedItem[] = [];

  for (const card of cards) {
    if (CONSOLIDATION_ELIGIBLE.has(card.type)) {
      const group = typeGroups.get(card.type)!;
      if (group.length >= 3 && !seen.has(card.type)) {
        result.push({ kind: "group", type: card.type, cards: group });
        seen.add(card.type);
      } else if (group.length < 3) {
        result.push({ kind: "single", card });
      }
    } else {
      result.push({ kind: "single", card });
    }
  }

  return result;
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUEUE HEADER + VIEW MODE TABS
   ═══════════════════════════════════════════════════════════════════════════ */

function QueueHeader({
  activeCount,
  resolvedCount,
  snoozedCount,
  viewMode,
  onViewChange,
}: {
  activeCount: number;
  resolvedCount: number;
  snoozedCount: number;
  viewMode: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  const tabs: { key: ViewMode; label: string; count: number }[] = [
    { key: "active", label: "Active", count: activeCount },
    { key: "resolved", label: "Resolved", count: resolvedCount },
    { key: "snoozed", label: "Snoozed", count: snoozedCount },
  ];

  return (
    <div className="px-5 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid #F1F5F9" }}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[16px] mb-0.5" style={{ fontWeight: 600, color: "#0F172A" }}>
            Action Queue
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[13px]" style={{ color: "#64748B", fontFeatureSettings: "'tnum'" }}>
              {activeCount} items need your attention
            </span>
            <span className="flex items-center gap-1 text-[12px]" style={{ color: "#16A34A" }}>
              <TrendingDown className="w-3 h-3" />
              <span style={{ fontWeight: 500, fontFeatureSettings: "'tnum'" }}>down from 41 last week</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
            <Sparkles className="w-3 h-3" style={{ color: "#16A34A" }} />
            <span className="text-[11px]" style={{ color: "#15803D", fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
              1,247 of 1,312 auto-processed
            </span>
          </div>
          {resolvedCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#F0FDFA", border: "1px solid #CCFBF1" }}>
              <Zap className="w-3 h-3" style={{ color: "#0D9488" }} />
              <span className="text-[11px]" style={{ color: "#0F766E", fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
                {resolvedCount} resolved this session
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3">
        {tabs.map((tab) => {
          const isActive = viewMode === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onViewChange(tab.key)}
              className={cn(
                "px-3 py-1.5 rounded-md text-[12px] transition-all",
                isActive ? "" : "hover:bg-gray-100"
              )}
              style={{
                backgroundColor: isActive ? "#0F172A" : "transparent",
                color: isActive ? "#FFFFFF" : "#64748B",
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "#F1F5F9",
                    fontWeight: 700,
                    fontFeatureSettings: "'tnum'",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIORITY TABS + FILTER DROPDOWNS
   ═══════════════════════════════════════════════════════════════════════════ */

const PRIORITY_TABS: { key: Priority; label: string }[] = [
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

function PriorityTabs({
  value,
  onChange,
  counts,
}: {
  value: Priority;
  onChange: (p: Priority) => void;
  counts: Record<Priority, number>;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {PRIORITY_TABS.map((tab) => {
        const isActive = value === tab.key;
        const count = counts[tab.key];
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "px-2.5 py-1.5 rounded-md text-[12px] transition-all",
              isActive ? "" : "hover:bg-gray-50"
            )}
            style={{
              backgroundColor: isActive ? "#F1F5F9" : "transparent",
              color: isActive ? "#0F172A" : "#94A3B8",
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {tab.label}
            {count > 0 && (
              <span
                className="ml-1 text-[10px] px-1 py-0 rounded-full"
                style={{
                  backgroundColor: isActive ? "#E2E8F0" : "#F1F5F9",
                  color: isActive ? "#475569" : "#94A3B8",
                  fontWeight: 700,
                  fontFeatureSettings: "'tnum'",
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { key: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectedLabel = options.find((o) => o.key === value)?.label || "All";
  const isFiltered = value !== "all";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] transition-all hover:bg-gray-50"
        style={{
          border: isFiltered ? "1px solid #BFDBFE" : "1px solid #E2E8F0",
          backgroundColor: isFiltered ? "#EFF6FF" : "#FFFFFF",
          color: isFiltered ? "#2563EB" : "#64748B",
          fontWeight: isFiltered ? 600 : 500,
        }}
      >
        <span className="text-[10px] uppercase" style={{ color: "#94A3B8", fontWeight: 600, letterSpacing: "0.05em" }}>
          {label}
        </span>
        <span>{selectedLabel}</span>
        <ChevronDown className="w-3 h-3" style={{ color: "#94A3B8" }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            className="absolute right-0 top-full mt-1 rounded-lg bg-white py-1 z-50"
            style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 140 }}
          >
            {options.map((opt) => {
              const isSelected = value === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => { onChange(opt.key); setOpen(false); }}
                  className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors flex items-center gap-2"
                  style={{ color: isSelected ? "#0F172A" : "#64748B", fontWeight: isSelected ? 600 : 500 }}
                >
                  {opt.label}
                  {isSelected && <CheckCircle2 className="w-3 h-3 ml-auto" style={{ color: "#3B82F6" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const accountOptions = [
  { key: "all", label: "All" },
  { key: "trust", label: "Trust" },
  { key: "operating", label: "Operating" },
];

const timeOptions = [
  { key: "all", label: "All time" },
  { key: "24h", label: "Last 24 hours" },
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CARD FEED
   ═══════════════════════════════════════════════════════════════════════════ */

type PanelTarget =
  | { kind: "single"; card: ActionCardData }
  | { kind: "group"; type: CardType; cards: ActionCardData[] };

function CardFeed({
  feedItems,
  onResolve,
  onResolveMany,
  onSnooze,
  onCardClick,
  pulseId,
  selectedPanelCard,
  isInactive,
  inactiveLabel,
  selectMode,
  selectedIds,
  onToggleSelect,
  onUndo,
  totalResolved,
}: {
  feedItems: FeedItem[];
  onResolve: (id: string) => void;
  onResolveMany: (ids: string[]) => void;
  onSnooze: (id: string, duration: string) => void;
  onCardClick: (target: PanelTarget) => void;
  pulseId: string | null;
  selectedPanelCard: string | null;
  isInactive?: boolean;
  inactiveLabel?: string;
  selectMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onUndo?: (id: string) => void;
  totalResolved?: number;
}) {
  if (feedItems.length === 0) {
    if (!isInactive && (totalResolved ?? 0) > 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="relative mb-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(145deg, #D1FAE5, #A7F3D0)" }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.5 }}
              >
                <Check className="w-10 h-10" style={{ color: "#059669", strokeWidth: 2.5 }} />
              </motion.div>
            </motion.div>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0, 1.2, 1, 0.5],
                  x: Math.cos((i * Math.PI * 2) / 8) * 52,
                  y: Math.sin((i * Math.PI * 2) / 8) * 52,
                }}
                transition={{ duration: 1.2, delay: 0.6 + i * 0.06, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{ backgroundColor: ["#4ADE80", "#2DD4BF", "#60A5FA", "#F59E0B", "#A78BFA", "#FB923C", "#34D399", "#818CF8"][i] }}
              />
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-[20px] mb-2"
            style={{ fontWeight: 700, color: "#0F172A" }}
          >
            You're all caught up!
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="text-[14px] mb-1"
            style={{ color: "#64748B" }}
          >
            {totalResolved} item{(totalResolved ?? 0) > 1 ? "s" : ""} resolved this session — all added to your books.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-4 flex items-center gap-3"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px]" style={{ backgroundColor: "#F0FDF4", color: "#16A34A", fontWeight: 600 }}>
              <Sparkles className="w-3 h-3" />
              Zero-day reconciliation: on track
            </div>
          </motion.div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: "#F0FDF4" }}>
          <CheckCircle2 className="w-6 h-6" style={{ color: "#16A34A" }} />
        </div>
        <p className="text-[15px] mb-1" style={{ fontWeight: 600, color: "#0F172A" }}>
          {isInactive ? `No ${inactiveLabel?.toLowerCase()} items` : "All clear!"}
        </p>
        <p className="text-[13px]" style={{ color: "#94A3B8" }}>
          {isInactive
            ? `Items you ${inactiveLabel === "Resolved" ? "resolve" : "snooze"} will appear here.`
            : "All items have been resolved. Your books are up to date."}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {feedItems.map((item) => {
          if (item.kind === "group") {
            const syntheticCard = createGroupCard(item.type, item.cards);
            const groupIds = item.cards.map((c) => c.id);
            const isPulsing = groupIds.some((id) => id === pulseId);

            if (isPulsing) return <TealPulseConfirmation key={syntheticCard.id} show />;

            const allGroupSelected = selectMode && groupIds.every((id) => selectedIds?.has(id));
            const groupCTA = consolidatedCTAs[item.type] || "View details";
            return (
              <ActionCardShell
                key={syntheticCard.id}
                card={syntheticCard}
                onClick={() => onCardClick({ kind: "group", type: item.type, cards: item.cards })}
                onResolve={isInactive ? undefined : () => onResolveMany(groupIds)}
                onSnooze={isInactive ? undefined : (dur) => groupIds.forEach((id) => onSnooze(id, dur))}
                primaryCTA={{ label: groupCTA, onClick: () => onCardClick({ kind: "group", type: item.type, cards: item.cards }) }}
                isInactive={isInactive}
                inactiveLabel={inactiveLabel}
                isSelected={selectedPanelCard === syntheticCard.id}
                showCheckbox={selectMode}
                checked={allGroupSelected}
                onCheck={() => groupIds.forEach((id) => onToggleSelect?.(id))}
                onUndo={isInactive && onUndo ? () => groupIds.forEach((id) => onUndo(id)) : undefined}
              />
            );
          }

          const { card } = item;

          if (pulseId === card.id) return <TealPulseConfirmation key={card.id} show />;

          const typeConf = cardTypeConfig[card.type];
          const isDirectAction = !!typeConf.inlineCTA;

          return (
            <ActionCardShell
              key={card.id}
              card={card}
              onClick={() => onCardClick({ kind: "single", card })}
              onResolve={isInactive ? undefined : () => onResolve(card.id)}
              onSnooze={isInactive ? undefined : (dur) => onSnooze(card.id, dur)}
              primaryCTA={isDirectAction
                ? { label: typeConf.inlineCTA!, onClick: () => onResolve(card.id) }
                : { label: typeConf.viewCTA || "View details", onClick: () => onCardClick({ kind: "single", card }) }
              }
              secondaryCTA={!isInactive && typeConf.secondaryCTA
                ? { label: typeConf.secondaryCTA, onClick: () => onCardClick({ kind: "single", card }) }
                : undefined
              }
              isInactive={isInactive}
              inactiveLabel={inactiveLabel}
              isSelected={selectedPanelCard === card.id}
              showCheckbox={selectMode}
              checked={selectedIds?.has(card.id)}
              onCheck={() => onToggleSelect?.(card.id)}
              onUndo={isInactive && onUndo ? () => onUndo(card.id) : undefined}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */

function applyFilters(cards: ActionCardData[], filters: FilterState): ActionCardData[] {
  let result = cards.filter((c) => c.priority === filters.priority);
  if (filters.account !== "all") {
    result = result.filter((c) => c.account === filters.account);
  }
  return result;
}

function countByPriority(cards: ActionCardData[]): Record<Priority, number> {
  const counts: Record<Priority, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const c of cards) counts[c.priority]++;
  return counts;
}

export function ActionQueueView({ onResolvedCountChange, onOpenTeammate, onCardResolved, revealHiddenCards }: {
  onResolvedCountChange?: (count: number) => void;
  onOpenTeammate?: () => void;
  onCardResolved?: (card: ActionCardData) => void;
  revealHiddenCards?: boolean;
} = {}) {
  const [resolved, setResolved] = React.useState<Set<string>>(new Set());
  const [snoozed, setSnoozed] = React.useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set());
  const [pulseId, setPulseId] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>("active");
  const [filters, setFilters] = React.useState<FilterState>({
    priority: "critical",
    account: "all",
    time: "all",
  });
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [panelTarget, setPanelTarget] = React.useState<PanelTarget | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  React.useEffect(() => {
    onResolvedCountChange?.(resolved.size);
  }, [resolved.size, onResolvedCountChange]);

  const resolve = (id: string) => {
    setPanelTarget(null);
    setPulseId(id);
    const card = mockActionCards.find((c) => c.id === id);
    setTimeout(() => {
      setResolved((prev) => new Set(prev).add(id));
      setPulseId(null);
      if (card) onCardResolved?.(card);
    }, 800);
  };

  const resolveMany = (ids: string[]) => {
    if (ids.length === 0) return;
    setPanelTarget(null);
    setPulseId(ids[0]);
    setTimeout(() => {
      setResolved((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.add(id));
        return next;
      });
      setPulseId(null);
      ids.forEach((id) => {
        const card = mockActionCards.find((c) => c.id === id);
        if (card) onCardResolved?.(card);
      });
    }, 800);
  };

  const snooze = (id: string, _duration: string) => {
    setPanelTarget(null);
    setSnoozed((prev) => new Set(prev).add(id));
  };

  const unresolve = (id: string) => {
    setResolved((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const unsnooze = (id: string) => {
    setSnoozed((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const gone = new Set([...resolved, ...snoozed, ...dismissed]);
  const activeCards = mockActionCards.filter((c) => !gone.has(c.id) && (!c.hidden || revealHiddenCards));
  const resolvedCards = mockActionCards.filter((c) => resolved.has(c.id));
  const snoozedCards = mockActionCards.filter((c) => snoozed.has(c.id));

  const viewCards = viewMode === "active" ? activeCards
    : viewMode === "resolved" ? resolvedCards
    : snoozedCards;

  const priorityCounts = countByPriority(viewCards);

  const filteredCards = applyFilters(viewCards, filters);
  const feedItems = viewMode === "active" ? buildFeed(filteredCards) : filteredCards.map((c) => ({ kind: "single" as const, card: c }));

  const panelCard = panelTarget?.kind === "single" ? panelTarget.card
    : panelTarget?.kind === "group" ? createGroupCard(panelTarget.type, panelTarget.cards)
    : null;

  const selectedPanelCardId = panelCard?.id ?? null;

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden relative" style={{ backgroundColor: "#F9FAFB" }}>
      <QueueHeader
        activeCount={activeCards.length}
        resolvedCount={resolvedCards.length}
        snoozedCount={snoozedCards.length}
        viewMode={viewMode}
        onViewChange={setViewMode}
      />

      {/* Priority tabs (left) + Account/Time/Select (right) */}
      <div className="flex items-center px-5 py-2 flex-shrink-0" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <PriorityTabs
          value={filters.priority}
          onChange={(p) => setFilters((f) => ({ ...f, priority: p }))}
          counts={priorityCounts}
        />
        <div className="flex items-center gap-2 ml-auto">
          <FilterDropdown
            label="Account"
            value={filters.account}
            options={accountOptions}
            onChange={(v) => setFilters((f) => ({ ...f, account: v as AccountFilter }))}
          />
          <FilterDropdown
            label="Time"
            value={filters.time}
            options={timeOptions}
            onChange={(v) => setFilters((f) => ({ ...f, time: v as TimeFilter }))}
          />
          {viewMode === "active" && (
            <button
              onClick={() => selectMode ? exitSelectMode() : setSelectMode(true)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[12px] transition-all",
                selectMode ? "bg-blue-50" : "hover:bg-gray-50"
              )}
              style={{
                color: selectMode ? "#2563EB" : "#64748B",
                fontWeight: 500,
                border: selectMode ? "1px solid #BFDBFE" : "1px solid #E2E8F0",
              }}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              {selectMode ? "Cancel" : "Select"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3">
        <CardFeed
          feedItems={feedItems}
          onResolve={resolve}
          onResolveMany={resolveMany}
          onSnooze={snooze}
          onCardClick={setPanelTarget}
          pulseId={pulseId}
          selectedPanelCard={selectedPanelCardId}
          isInactive={viewMode !== "active"}
          inactiveLabel={viewMode === "resolved" ? "Resolved" : viewMode === "snoozed" ? "Snoozed" : undefined}
          selectMode={selectMode && viewMode === "active"}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onUndo={viewMode === "resolved" ? unresolve : viewMode === "snoozed" ? unsnooze : undefined}
          totalResolved={resolvedCards.length}
        />
      </div>

      {/* Batch action bar */}
      <AnimatePresence>
        {selectMode && selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="flex items-center justify-between px-5 py-3 flex-shrink-0"
            style={{ borderTop: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", boxShadow: "0 -2px 8px rgba(0,0,0,0.04)" }}
          >
            <span className="text-[13px]" style={{ color: "#0F172A", fontWeight: 500 }}>
              {selectedIds.size} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { resolveMany(Array.from(selectedIds)); exitSelectMode(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] transition-all hover:bg-emerald-600"
                style={{ backgroundColor: "#059669", color: "#FFFFFF", fontWeight: 500 }}
              >
                <Check className="w-3.5 h-3.5" />
                Resolve all
              </button>
              <button
                onClick={() => { Array.from(selectedIds).forEach((id) => snooze(id, "24h")); exitSelectMode(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] transition-all hover:bg-gray-100"
                style={{ color: "#64748B", fontWeight: 500, border: "1px solid #E2E8F0" }}
              >
                <Clock className="w-3.5 h-3.5" />
                Snooze all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail panel */}
      <ActionDetailPanel
        card={panelCard}
        onClose={() => setPanelTarget(null)}
        onResolve={resolve}
        onSnooze={snooze}
        groupedCards={panelTarget?.kind === "group" ? panelTarget.cards : undefined}
        groupType={panelTarget?.kind === "group" ? panelTarget.type : undefined}
        onResolveMany={resolveMany}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLOATING AI BAR
   ═══════════════════════════════════════════════════════════════════════════ */

export function FloatingAIBar({ contextCard, onOpenTeammate, placeholder, onAddTransaction }: {
  contextCard: ActionCardData | null;
  onOpenTeammate?: () => void;
  placeholder?: string;
  onAddTransaction?: (txn: { payee: string; amount: number; category: string }) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [newPayee, setNewPayee] = React.useState("");
  const [newAmount, setNewAmount] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Office Supplies");
  const [createPulsing, setCreatePulsing] = React.useState(false);
  const hasContext = contextCard !== null;

  const ADD_CATEGORIES = [
    "Research Subscriptions", "Trust Deposit", "Filing Fees", "Office Supplies",
    "Hard Cost", "Meals & Entertainment", "Client Payment", "Postage & Delivery",
    "Retainer Deposit", "Technology", "Travel & Transport",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setThinking(true);
    setTimeout(() => { setThinking(false); setQuery(""); }, 2000);
  };

  const handleCreate = () => {
    if (!newPayee.trim() || !newAmount.trim()) return;
    const amt = parseFloat(newAmount.replace(/[^0-9.-]/g, ""));
    if (isNaN(amt)) return;
    onAddTransaction?.({ payee: newPayee, amount: -Math.abs(amt), category: newCategory });
    setCreatePulsing(true);
    setTimeout(() => {
      setCreatePulsing(false);
      setShowCreate(false);
      setNewPayee("");
      setNewAmount("");
      setNewCategory("Office Supplies");
    }, 800);
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-5">
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-2 rounded-2xl bg-white p-4 space-y-3"
            style={{
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              ...(createPulsing ? { animation: "tealPulse 0.8s ease-out forwards" } : {}),
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>Add Transaction</span>
              <button onClick={() => setShowCreate(false)} className="text-[12px]" style={{ color: "#94A3B8" }}>Cancel</button>
            </div>
            <div className="flex gap-2">
              <input
                value={newPayee}
                onChange={(e) => setNewPayee(e.target.value)}
                placeholder="Payee / description"
                className="flex-1 text-[13px] rounded-lg px-3 py-2 outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#0F172A" }}
              />
              <input
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="$0.00"
                className="w-24 text-[13px] rounded-lg px-3 py-2 outline-none"
                style={{ border: "1px solid #E2E8F0", color: "#0F172A", fontFeatureSettings: "'tnum'" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 text-[13px] rounded-lg px-3 py-2 outline-none cursor-pointer"
                style={{ border: "1px solid #E2E8F0", color: "#0F172A", backgroundColor: "#FFFFFF" }}
              >
                {ADD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg text-[13px] transition-all hover:bg-slate-800"
                style={{ backgroundColor: "#0F172A", color: "#FFFFFF", fontWeight: 500 }}
              >
                Create
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white transition-all"
        style={{
          border: hasContext ? "1.5px solid #BFDBFE" : "1px solid #E2E8F0",
          boxShadow: hasContext
            ? "0 4px 24px rgba(59,130,246,0.12), 0 2px 8px rgba(0,0,0,0.04)"
            : "0 4px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)",
        }}
      >
        <button type="button" onClick={onOpenTeammate} className="flex-shrink-0 transition-colors hover:text-blue-500" style={{ color: hasContext ? "#3B82F6" : "#94A3B8" }}>
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all hover:bg-blue-50"
          style={{ color: showCreate ? "#2563EB" : "#94A3B8", border: "1px solid", borderColor: showCreate ? "#BFDBFE" : "#E2E8F0" }}
        >
          <span className="text-[14px] leading-none" style={{ fontWeight: 500 }}>+</span>
        </button>

        {hasContext && (
          <span
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] flex-shrink-0 max-w-[160px] truncate"
            style={{ backgroundColor: "#EFF6FF", color: "#2563EB", fontWeight: 500 }}
          >
            {contextCard.title.length > 25 ? contextCard.title.slice(0, 25) + "…" : contextCard.title}
          </span>
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={hasContext ? "Ask about this transaction..." : (placeholder || "Ask about your books...")}
          className="flex-1 text-[13px] outline-none bg-transparent min-w-0"
          style={{ color: "#0F172A" }}
          disabled={thinking}
        />

        {thinking ? (
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: "#3B82F6" }} />
        ) : query.trim() ? (
          <button type="submit" className="text-[12px] px-2.5 py-1 rounded-md flex-shrink-0 transition-all hover:bg-blue-600" style={{ backgroundColor: "#3B82F6", color: "#FFFFFF", fontWeight: 500 }}>
            Ask
          </button>
        ) : null}
      </form>
    </div>
  );
}
