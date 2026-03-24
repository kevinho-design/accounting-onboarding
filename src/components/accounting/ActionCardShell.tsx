import * as React from "react";
import { Clock, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  type ActionCardData,
  type CardType,
  priorityConfig,
  cardTypeConfig,
} from "./ActionQueueTypes";

const HIDE_ACCOUNT_LABEL: Set<CardType> = new Set([
  "trust_balance",
  "orphaned_trust",
  "user_config_trigger",
]);

interface ActionCardShellProps {
  card: ActionCardData;
  onClick?: () => void;
  onResolve?: () => void;
  onSnooze?: (duration: string) => void;
  primaryCTA?: { label: string; onClick: () => void };
  secondaryCTA?: { label: string; onClick: () => void };
  showCheckbox?: boolean;
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  isInactive?: boolean;
  inactiveLabel?: string;
  isSelected?: boolean;
  onUndo?: () => void;
}

const snoozeOptions = [
  { label: "1 hour", value: "1h" },
  { label: "24 hours", value: "24h" },
  { label: "1 week", value: "1w" },
];

export function ActionCardShell({
  card,
  onClick,
  onResolve,
  onSnooze,
  primaryCTA,
  secondaryCTA,
  showCheckbox,
  checked,
  onCheck,
  isInactive,
  inactiveLabel,
  isSelected,
  onUndo,
}: ActionCardShellProps) {
  const [snoozeOpen, setSnoozeOpen] = React.useState(false);
  const snoozeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!snoozeOpen) return;
    const handler = (e: MouseEvent) => {
      if (snoozeRef.current && !snoozeRef.current.contains(e.target as Node))
        setSnoozeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [snoozeOpen]);

  const pConfig = priorityConfig[card.priority];
  const tConfig = cardTypeConfig[card.type];
  const TypeIcon = tConfig.icon;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    onClick?.();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 300, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="rounded-lg bg-white relative overflow-hidden flex group cursor-pointer"
      style={{
        border: isSelected ? "1.5px solid #3B82F6" : "1px solid #E2E8F0",
        boxShadow: isSelected
          ? "0 0 0 1px rgba(59,130,246,0.15), 0 2px 8px rgba(59,130,246,0.08)"
          : "0 1px 2px rgba(0,0,0,0.03)",
        opacity: isInactive ? 0.55 : 1,
      }}
      onClick={handleCardClick}
    >
      {/* Left accent bar */}
      <div
        className="w-[4px] flex-shrink-0 self-stretch rounded-l-lg"
        style={{ backgroundColor: pConfig.accentColor }}
      />

      {/* Main content area */}
      <div className="flex-1 px-4 py-4 min-w-0">
        {/* Row 1: Checkbox + Icon + Title + Colored pill */}
        <div className="flex items-center gap-2">
          {showCheckbox && (
            <button
              onClick={() => onCheck?.(!checked)}
              className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                backgroundColor: checked ? "#3B82F6" : "transparent",
                borderColor: checked ? "#3B82F6" : "#CBD5E1",
              }}
            >
              {checked && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          )}

          <TypeIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#64748B" }} />

          <h3
            className="text-[14px] leading-snug truncate min-w-0"
            style={{ fontWeight: 600, color: "#0F172A" }}
          >
            {card.title}
          </h3>

          <span
            className="text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
            style={{
              backgroundColor: "#F1F5F9",
              color: "#64748B",
              fontWeight: 500,
            }}
          >
            {tConfig.label}
          </span>

          {isInactive && inactiveLabel && (
            <span
              className="text-[11px] px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: inactiveLabel === "Resolved" ? "#F0FDF4" : "#FFFBEB",
                color: inactiveLabel === "Resolved" ? "#16A34A" : "#D97706",
                fontWeight: 500,
              }}
            >
              {inactiveLabel}
            </span>
          )}
        </div>

        {/* Row 2: Description */}
        <p
          className="text-[13px] leading-relaxed mt-1.5 ml-6"
          style={{ color: "#64748B" }}
        >
          {card.subtitle}
        </p>

        {/* Row 3: CTA buttons */}
        {!isInactive && (primaryCTA || secondaryCTA) && (
          <div className="flex items-center gap-2 mt-3 ml-6">
            {primaryCTA && (
              <button
                onClick={primaryCTA.onClick}
                className="px-3 py-1.5 rounded-md text-[12px] transition-all hover:opacity-90"
                style={{
                  backgroundColor: "#1D4ED8",
                  color: "#FFFFFF",
                  fontWeight: 500,
                }}
              >
                {primaryCTA.label}
              </button>
            )}
            {secondaryCTA && (
              <button
                onClick={secondaryCTA.onClick}
                className="px-3 py-1.5 rounded-md text-[12px] transition-all hover:bg-gray-50"
                style={{
                  color: "#475569",
                  fontWeight: 500,
                  border: "1px solid #E2E8F0",
                }}
              >
                {secondaryCTA.label}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right column: Resolve/Snooze icons + Timestamp */}
      {!isInactive && (
        <div className="flex flex-col items-center justify-between py-3 pr-3 flex-shrink-0 gap-1">
          <div className="flex items-center gap-1">
            {onResolve && (
              <button
                onClick={onResolve}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-emerald-50"
                style={{ color: "#94A3B8", border: "1px solid #E2E8F0" }}
                title="Resolve"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="relative" ref={snoozeRef}>
              <button
                onClick={() => setSnoozeOpen(!snoozeOpen)}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-gray-50"
                style={{ color: "#94A3B8", border: "1px solid #E2E8F0" }}
                title="Snooze"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>
              <AnimatePresence>
                {snoozeOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-full mt-1 rounded-lg bg-white py-1 z-50"
                    style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 120 }}
                  >
                    {snoozeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { onSnooze?.(opt.value); setSnoozeOpen(false); }}
                        className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors"
                        style={{ color: "#64748B", fontWeight: 500 }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <span className="text-[11px] whitespace-nowrap" style={{ color: "#CBD5E1" }}>
            {card.timestamp}
          </span>
        </div>
      )}

      {/* Inactive right column: timestamp + undo */}
      {isInactive && (
        <div className="flex flex-col items-end justify-center gap-1.5 py-3 pr-4 flex-shrink-0">
          <span className="text-[11px]" style={{ color: "#CBD5E1" }}>
            {card.timestamp}
          </span>
          {onUndo && (
            <button
              onClick={(e) => { e.stopPropagation(); onUndo(); }}
              className="text-[11px] px-2 py-0.5 rounded-md transition-colors hover:bg-gray-100"
              style={{ color: "#3B82F6", fontWeight: 500 }}
            >
              Undo
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function TealPulseConfirmation({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg"
          style={{ backgroundColor: "#CCFBF1", border: "1px solid #99F6E4" }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="text-[13px]"
            style={{ color: "#0F766E", fontWeight: 600 }}
          >
            Added to your books
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
