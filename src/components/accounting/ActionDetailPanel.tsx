import * as React from "react";
import {
  X,
  Clock,
  Check,
  ChevronDown,
  Sparkles,
  Mail,
  FileText,
  Briefcase,
  DollarSign,
  User,
  AlertTriangle,
  RefreshCcw,
  CheckCircle2,
  Building2,
  Landmark,
  CreditCard,
  ArrowRightLeft,
  Calendar,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  type ActionCardData,
  type CardType,
  type AssignableUser,
  cardTypeConfig,
} from "./ActionQueueTypes";
import { renderCardContent, ConsolidatedContent } from "./ActionCards";

interface ActionDetailPanelProps {
  card: ActionCardData | null;
  onClose: () => void;
  onResolve: (id: string) => void;
  onSnooze: (id: string, duration: string) => void;
  groupedCards?: ActionCardData[];
  groupType?: CardType;
  onResolveMany?: (ids: string[]) => void;
}

const snoozeOptions = [
  { label: "1 hour", value: "1h" },
  { label: "24 hours", value: "24h" },
  { label: "1 week", value: "1w" },
];

export function ActionDetailPanel({
  card,
  onClose,
  onResolve,
  onSnooze,
  groupedCards,
  groupType,
  onResolveMany,
}: ActionDetailPanelProps) {
  const isOpen = card !== null;

  return (
    <AnimatePresence>
      {isOpen && card && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
            style={{ backgroundColor: "rgba(15,23,42,0.08)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 z-40 flex flex-col bg-white"
            style={{
              width: "min(520px, 55%)",
              boxShadow: "-8px 0 32px rgba(15,23,42,0.08), -2px 0 8px rgba(15,23,42,0.04)",
              borderLeft: "1px solid #E2E8F0",
            }}
          >
            <PanelContent
              card={card}
              onClose={onClose}
              onResolve={onResolve}
              onSnooze={onSnooze}
              groupedCards={groupedCards}
              groupType={groupType}
              onResolveMany={onResolveMany}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PANEL CONTENT — routes to card-specific or generic body
   ═══════════════════════════════════════════════════════════════════════════ */

function PanelContent({
  card,
  onClose,
  onResolve,
  onSnooze,
  groupedCards,
  groupType,
  onResolveMany,
}: {
  card: ActionCardData;
  onClose: () => void;
  onResolve: (id: string) => void;
  onSnooze: (id: string, duration: string) => void;
  groupedCards?: ActionCardData[];
  groupType?: CardType;
  onResolveMany?: (ids: string[]) => void;
}) {
  const [snoozeOpen, setSnoozeOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"details" | "audit">("details");
  const [assignee, setAssignee] = React.useState<AssignableUser | null>(null);
  const snoozeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!snoozeOpen) return;
    const handler = (e: MouseEvent) => {
      if (snoozeRef.current && !snoozeRef.current.contains(e.target as Node)) setSnoozeOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [snoozeOpen]);

  const isGroup = groupedCards && groupedCards.length > 0 && groupType;
  const tConfig = cardTypeConfig[card.type];
  const TypeIcon = tConfig.icon;

  const resolveLabel = getResolveLabel(card, isGroup, groupedCards, assignee);

  return (
    <>
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2.5">
              <TypeIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#64748B" }} />
              <span
                className="text-[11px] px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "#F1F5F9", color: "#64748B", fontWeight: 500 }}
              >
                {tConfig.label}
              </span>
              <span className="text-[11px]" style={{ color: "#CBD5E1" }}>·</span>
              <span className="text-[11px]" style={{ color: "#94A3B8" }}>{card.timestamp}</span>
            </div>
            <h2 className="text-[18px] leading-snug" style={{ fontWeight: 600, color: "#0F172A" }}>
              {card.title}
            </h2>
            <span
              className="text-[15px] mt-1 inline-block"
              style={{ fontWeight: 600, color: "#475569", fontFeatureSettings: "'tnum'" }}
            >
              {card.amount}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 flex-shrink-0 ml-4"
          >
            <X className="w-4 h-4" style={{ color: "#94A3B8" }} />
          </button>
        </div>

        {/* Details / Audit tab toggle */}
        <div className="flex mt-4 rounded-lg p-0.5" style={{ backgroundColor: "#F1F5F9" }}>
          {(["details", "audit"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-md text-[13px] transition-all ${activeTab === tab ? "bg-white" : ""}`}
              style={{
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#0F172A" : "#94A3B8",
                ...(activeTab === tab ? { boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } : {}),
              }}
            >
              {tab === "details" ? "Details" : "Activity"}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {activeTab === "details" ? (
          <>
            <p className="text-[14px] leading-relaxed" style={{ color: "#475569" }}>
              {card.subtitle}
            </p>

            {card.txnContext && <TxnContextSection txn={card.txnContext} />}

            {/* Card-specific content */}
            {card.type === "hard_cost" && card.sourceEmail ? (
              <HardCostBody card={card} />
            ) : card.type === "trust_balance" && card.balanceInfo ? (
              <TrustAlertBody card={card} assignee={assignee} onAssign={setAssignee} />
            ) : isGroup && groupType === "anomaly_amount" ? (
              <UnusualAmountGroupBody cards={groupedCards} onResolve={onResolve} onResolveMany={(ids) => { onResolveMany?.(ids); onClose(); }} />
            ) : (
              <GenericBody card={card} isGroup={!!isGroup} groupedCards={groupedCards} groupType={groupType} onResolve={onResolve} onResolveMany={onResolveMany} onClose={onClose} />
            )}

            <AIAnalysisSection rationale={card.evidenceRationale} />
          </>
        ) : (
          <AuditTrailTab card={card} />
        )}
      </div>

      {/* Sticky footer */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", boxShadow: "0 -2px 8px rgba(0,0,0,0.03)" }}
      >
        <span className="text-[11px] font-mono" style={{ color: "#CBD5E1" }}>
          {card.id.toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          <div className="relative" ref={snoozeRef}>
            <button
              onClick={() => setSnoozeOpen(!snoozeOpen)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[13px] transition-all hover:bg-gray-100"
              style={{ color: "#64748B", fontWeight: 500, border: "1px solid #E2E8F0" }}
            >
              <Clock className="w-3.5 h-3.5" />
              Snooze
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {snoozeOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  className="absolute right-0 bottom-full mb-1 rounded-lg bg-white py-1 z-50"
                  style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 140 }}
                >
                  {snoozeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { onSnooze(card.id, opt.value); setSnoozeOpen(false); onClose(); }}
                      className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-gray-50 transition-colors"
                      style={{ color: "#64748B", fontWeight: 500 }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => {
              if (isGroup && onResolveMany) {
                onResolveMany(groupedCards.map((c) => c.id));
              } else {
                onResolve(card.id);
              }
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] transition-all hover:bg-emerald-600"
            style={{ backgroundColor: "#059669", color: "#FFFFFF", fontWeight: 500 }}
          >
            <Check className="w-3.5 h-3.5" />
            {resolveLabel}
          </button>
        </div>
      </div>
    </>
  );
}

function getResolveLabel(
  card: ActionCardData,
  isGroup: boolean | "" | undefined,
  groupedCards?: ActionCardData[],
  assignee?: AssignableUser | null,
): string {
  if (isGroup && groupedCards) return `Resolve all (${groupedCards.length})`;
  if (card.type === "hard_cost") return "Confirm & bill";
  if (card.type === "trust_balance" && assignee) return `Assign to ${assignee.name.split(" ")[0]}`;
  if (card.type === "trust_balance") return "Top up trust";
  return "Resolve";
}

/* ═══════════════════════════════════════════════════════════════════════════
   HARD COST DRAWER BODY
   ═══════════════════════════════════════════════════════════════════════════ */

const SOURCE_ICONS: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; label: string; bg: string; color: string }> = {
  gmail: { icon: Mail, label: "via Gmail", bg: "#FEF2F2", color: "#DC2626" },
  outlook: { icon: Mail, label: "via Outlook", bg: "#EFF6FF", color: "#2563EB" },
  court: { icon: Building2, label: "via Court Portal", bg: "#F0FDF4", color: "#16A34A" },
};

function FakeReceiptPreview() {
  return (
    <div
      className="mx-4 mb-3 rounded-lg overflow-hidden"
      style={{ border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}
    >
      {/* Mock receipt header */}
      <div className="px-4 pt-3 pb-2 text-center" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <p className="text-[11px] uppercase tracking-wider" style={{ color: "#64748B", fontWeight: 700, letterSpacing: "0.12em" }}>King County Superior Court</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>401 4th Ave N, Seattle, WA 98109</p>
      </div>
      {/* Mock receipt body */}
      <div className="px-4 py-2.5 space-y-1.5">
        <div className="flex justify-between text-[10px]" style={{ color: "#475569" }}>
          <span>Receipt #</span>
          <span style={{ fontWeight: 500 }}>2026-CV-04821</span>
        </div>
        <div className="flex justify-between text-[10px]" style={{ color: "#475569" }}>
          <span>Date</span>
          <span style={{ fontWeight: 500 }}>03/18/2026</span>
        </div>
        <div className="flex justify-between text-[10px]" style={{ color: "#475569" }}>
          <span>Description</span>
          <span style={{ fontWeight: 500 }}>Civil Filing Fee</span>
        </div>
        <div className="h-px my-1" style={{ backgroundColor: "#E2E8F0" }} />
        <div className="flex justify-between text-[11px]" style={{ color: "#0F172A", fontWeight: 700 }}>
          <span>Total</span>
          <span>$125.00</span>
        </div>
      </div>
      <div className="px-4 py-1.5 text-center" style={{ backgroundColor: "#F8FAFC" }}>
        <p className="text-[9px]" style={{ color: "#CBD5E1" }}>Payment: Visa ··4892 — Approved</p>
      </div>
    </div>
  );
}

function HardCostBody({ card }: { card: ActionCardData }) {
  const email = card.sourceEmail!;
  const sourceConf = SOURCE_ICONS[email.sourceIcon || "court"] || SOURCE_ICONS.court;
  const SourceIcon = sourceConf.icon;

  const [fields, setFields] = React.useState({
    amount: card.amount,
    payee: "King County Superior Court",
    caseNum: "2026-CV-04821",
    matter: "Doe v. Metroplex LLC",
    category: "Filing Fees",
    client: "Jane Doe",
  });

  const updateField = (key: keyof typeof fields, val: string) => setFields((f) => ({ ...f, [key]: val }));

  return (
    <>
      {/* Source document */}
      <div>
        <SectionLabel>Source document</SectionLabel>
        <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
          {/* Source origin badge */}
          <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: "#FAFBFC", borderBottom: "1px solid #F1F5F9" }}>
            <div
              className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: sourceConf.bg }}
            >
              <SourceIcon className="w-3 h-3" style={{ color: sourceConf.color }} />
            </div>
            <span className="text-[11px]" style={{ color: "#64748B", fontWeight: 500 }}>{sourceConf.label}</span>
            <span className="text-[11px] ml-auto" style={{ color: "#94A3B8" }}>{email.timestamp}</span>
          </div>

          {/* Email header */}
          <div className="px-4 py-3" style={{ backgroundColor: "#FFFFFF" }}>
            <p className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>{email.sender}</p>
            <p className="text-[12px] mt-0.5" style={{ color: "#64748B" }}>{email.subject}</p>
          </div>

          {/* Fake receipt preview */}
          <FakeReceiptPreview />

          {/* PDF link */}
          <div
            className="flex items-center gap-2.5 px-4 py-2.5"
            style={{ backgroundColor: "#FAFBFC", borderTop: "1px solid #F1F5F9" }}
          >
            <FileText className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />
            <span className="text-[12px]" style={{ color: "#475569", fontWeight: 500 }}>{email.attachmentName}</span>
            <span className="text-[11px] ml-auto" style={{ color: "#3B82F6", fontWeight: 500, cursor: "pointer" }}>View full document</span>
          </div>
        </div>
      </div>

      {/* AI extracted + Allocation (merged) */}
      <div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#3B82F6" }} />
          <SectionLabel>AI extracted &amp; allocation</SectionLabel>
        </div>
        <div className="mt-2 rounded-xl p-4 space-y-2.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
          <EditableAllocationRow icon={<DollarSign className="w-3.5 h-3.5" />} label="Amount" value={fields.amount} onChange={(v) => updateField("amount", v)} />
          <EditableAllocationRow icon={<User className="w-3.5 h-3.5" />} label="Payee" value={fields.payee} onChange={(v) => updateField("payee", v)} />
          <EditableAllocationRow icon={<FileText className="w-3.5 h-3.5" />} label="Case #" value={fields.caseNum} onChange={(v) => updateField("caseNum", v)} />
          <div className="h-px" style={{ backgroundColor: "#E2E8F0" }} />
          <EditableAllocationRow icon={<Briefcase className="w-3.5 h-3.5" />} label="Matter" value={fields.matter} onChange={(v) => updateField("matter", v)} />
          <EditableAllocationRow icon={<Tag className="w-3.5 h-3.5" />} label="Category" value={fields.category} onChange={(v) => updateField("category", v)} />
          <EditableAllocationRow icon={<User className="w-3.5 h-3.5" />} label="Client" value={fields.client} onChange={(v) => updateField("client", v)} />
        </div>
      </div>
    </>
  );
}

function EditableAllocationRow({ icon, label, value, onChange }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = React.useState(false);
  const [localVal, setLocalVal] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    if (localVal !== value) onChange(localVal);
  };

  return (
    <div className="flex items-center justify-between group/row">
      <div className="flex items-center gap-2">
        <span style={{ color: "#94A3B8" }}>{icon}</span>
        <span className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 500 }}>{label}</span>
      </div>
      {editing ? (
        <input
          ref={inputRef}
          value={localVal}
          onChange={(e) => setLocalVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setLocalVal(value); setEditing(false); } }}
          className="text-[13px] text-right px-1.5 py-0.5 rounded outline-none max-w-[180px]"
          style={{ fontWeight: 500, color: "#0F172A", backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}
        />
      ) : (
        <span
          onClick={() => { setLocalVal(value); setEditing(true); }}
          className="text-[13px] px-1.5 py-0.5 rounded cursor-pointer transition-colors hover:bg-blue-50"
          style={{ color: "#0F172A", fontWeight: 500 }}
          title="Click to edit"
        >
          {value}
        </span>
      )}
    </div>
  );
}

function AllocationRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span style={{ color: "#94A3B8" }}>{icon}</span>
        <span className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 500 }}>{label}</span>
      </div>
      <span className="text-[13px]" style={{ color: "#0F172A", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRUST ALERT DRAWER BODY
   ═══════════════════════════════════════════════════════════════════════════ */

function TrustAlertBody({ card, assignee, onAssign }: {
  card: ActionCardData;
  assignee: AssignableUser | null;
  onAssign: (u: AssignableUser | null) => void;
}) {
  const balance = card.balanceInfo!;
  const users = card.assignableUsers || [];
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const barWidth = Math.min(100, (balance.current / (balance.threshold * 2)) * 100);
  const thresholdPos = Math.min(100, (balance.threshold / (balance.threshold * 2)) * 100);

  return (
    <>
      {/* Balance overview */}
      <div>
        <SectionLabel>Trust balance</SectionLabel>
        <div className="mt-2 rounded-xl p-4" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 500 }}>Current balance</p>
              <p className="text-[18px]" style={{ fontWeight: 700, color: "#0F172A", fontFeatureSettings: "'tnum'" }}>
                ${balance.current.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 500 }}>After posting</p>
              <p className="text-[18px]" style={{ fontWeight: 700, color: "#DC2626", fontFeatureSettings: "'tnum'" }}>
                ${balance.projected.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Balance bar */}
          <div className="relative h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#FEE2E2" }}>
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${barWidth}%`, backgroundColor: balance.projected < balance.threshold ? "#EF4444" : "#4ADE80" }}
            />
            <div
              className="absolute inset-y-0 w-px"
              style={{ left: `${thresholdPos}%`, backgroundColor: "#0F172A", opacity: 0.3 }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px]" style={{ color: "#94A3B8" }}>$0</span>
            <span className="text-[11px]" style={{ color: "#64748B", fontWeight: 500 }}>
              Floor: ${balance.threshold.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Assignment */}
      <div>
        <SectionLabel>Assign to</SectionLabel>
        <div className="relative mt-2" ref={dropRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all"
            style={{ border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF" }}
          >
            {assignee ? (
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px]"
                  style={{ backgroundColor: "#EFF6FF", color: "#3B82F6", fontWeight: 600 }}
                >
                  {assignee.initials}
                </div>
                <div>
                  <p className="text-[13px]" style={{ fontWeight: 500, color: "#0F172A" }}>{assignee.name}</p>
                  <p className="text-[11px]" style={{ color: "#94A3B8" }}>{assignee.role}</p>
                </div>
              </div>
            ) : (
              <span className="text-[13px]" style={{ color: "#94A3B8" }}>Select team member...</span>
            )}
            <ChevronDown className="w-4 h-4" style={{ color: "#94A3B8" }} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 right-0 top-full mt-1 rounded-xl bg-white py-1 z-50"
                style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
              >
                {users.map((u) => (
                  <button
                    key={u.initials}
                    onClick={() => { onAssign(u); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px]"
                      style={{ backgroundColor: "#EFF6FF", color: "#3B82F6", fontWeight: 600 }}
                    >
                      {u.initials}
                    </div>
                    <div>
                      <p className="text-[13px]" style={{ fontWeight: 500, color: "#0F172A" }}>{u.name}</p>
                      <p className="text-[11px]" style={{ color: "#94A3B8" }}>{u.role}</p>
                    </div>
                    {assignee?.initials === u.initials && (
                      <Check className="w-3.5 h-3.5 ml-auto" style={{ color: "#3B82F6" }} />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   UNUSUAL AMOUNT (GROUPED) DRAWER BODY
   ═══════════════════════════════════════════════════════════════════════════ */

function UnusualAmountGroupBody({ cards, onResolve, onResolveMany }: {
  cards: ActionCardData[];
  onResolve: (id: string) => void;
  onResolveMany: (ids: string[]) => void;
}) {
  const [resolvedIds, setResolvedIds] = React.useState<Set<string>>(new Set());
  const unresolvedCards = cards.filter((c) => !resolvedIds.has(c.id));
  const totalAmount = cards.reduce((sum, c) => sum + parseFloat(c.amount.replace(/[^0-9.]/g, "")), 0);

  return (
    <div>
      <SectionLabel>Review {cards.length} payments · ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</SectionLabel>
      <div className="mt-3 space-y-3">
        {cards.map((c) => {
          const isResolved = resolvedIds.has(c.id);
          const txn = c.txnContext;
          const SourceIcon = txn ? (TXN_SOURCE_ICONS[txn.sourceIcon] || Landmark) : Landmark;
          return (
            <div
              key={c.id}
              className="rounded-xl px-4 py-3.5 transition-all"
              style={{
                backgroundColor: isResolved ? "#F0FDF4" : "#F8FAFC",
                opacity: isResolved ? 0.5 : 1,
              }}
            >
              {/* Header row: amount + resolve */}
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[15px]" style={{ fontWeight: 700, color: "#0F172A", fontFeatureSettings: "'tnum'" }}>
                  {c.amount}
                </span>
                {isResolved ? (
                  <span className="text-[11px] flex items-center gap-1" style={{ color: "#16A34A", fontWeight: 500 }}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setResolvedIds((prev) => new Set(prev).add(c.id));
                      onResolve(c.id);
                    }}
                    className="px-2.5 py-1 rounded-md text-[12px] transition-all hover:bg-emerald-50"
                    style={{ color: "#059669", fontWeight: 500, border: "1px solid #D1FAE5" }}
                  >
                    Resolve
                  </button>
                )}
              </div>
              {/* Who / What / When / Source grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 flex-shrink-0" style={{ color: "#94A3B8" }} />
                  <span className="text-[12px] truncate" style={{ color: "#475569" }}>
                    {txn?.payee || c.title.split("charged")[0]?.trim() || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3 flex-shrink-0" style={{ color: "#94A3B8" }} />
                  <span className="text-[12px] truncate" style={{ color: "#475569" }}>
                    {txn?.category || "—"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 flex-shrink-0" style={{ color: "#94A3B8" }} />
                  <span className="text-[12px]" style={{ color: "#475569" }}>
                    {txn?.date || c.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <SourceIcon className="w-3 h-3 flex-shrink-0" style={{ color: "#94A3B8" }} />
                  <span className="text-[12px] truncate" style={{ color: "#475569" }}>
                    {txn?.source || "—"}
                  </span>
                </div>
              </div>
              {/* Subtitle */}
              <p className="text-[11px] mt-2" style={{ color: "#94A3B8" }}>
                {c.subtitle}
              </p>
            </div>
          );
        })}
      </div>
      {unresolvedCards.length > 1 && (
        <button
          onClick={() => onResolveMany(unresolvedCards.map((c) => c.id))}
          className="mt-3 w-full py-2 rounded-lg text-[13px] transition-all hover:bg-emerald-600"
          style={{ backgroundColor: "#059669", color: "#FFFFFF", fontWeight: 500 }}
        >
          Resolve remaining ({unresolvedCards.length})
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GENERIC BODY — fallback for all other card types
   ═══════════════════════════════════════════════════════════════════════════ */

function GenericBody({ card, isGroup, groupedCards, groupType, onResolve, onResolveMany, onClose }: {
  card: ActionCardData;
  isGroup: boolean;
  groupedCards?: ActionCardData[];
  groupType?: CardType;
  onResolve: (id: string) => void;
  onResolveMany?: (ids: string[]) => void;
  onClose: () => void;
}) {
  return (
    <div>
      <SectionLabel>{isGroup && groupedCards ? `Review ${groupedCards.length} items` : "Take action"}</SectionLabel>
      <div className="mt-2 rounded-xl p-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
        {isGroup && groupedCards && groupType ? (
          <ConsolidatedContent
            type={groupType}
            cards={groupedCards}
            onResolveCards={(ids) => { onResolveMany?.(ids); onClose(); }}
          />
        ) : (
          renderCardContent(card, () => { onResolve(card.id); onClose(); })
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AUDIT TRAIL TAB
   ═══════════════════════════════════════════════════════════════════════════ */

interface AuditEvent {
  time: string;
  event: string;
  agent: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  detail?: string;
}

function AuditTrailTab({ card }: { card: ActionCardData }) {
  const [expandedIdx, setExpandedIdx] = React.useState<number | null>(null);

  const events = React.useMemo(() => {
    const base: AuditEvent[] = [
      { time: "9:02 AM", event: "Transaction synced from bank feed", agent: "Plaid", icon: RefreshCcw, color: "#64748B" },
      { time: "9:03 AM", event: `AI flagged as "${cardTypeConfig[card.type].label}"`, agent: "Teammate", icon: Sparkles, color: "#3B82F6", detail: card.evidenceRationale },
    ];

    if (card.type === "trust_balance") {
      base.push({ time: "9:05 AM", event: "Trust threshold check triggered", agent: "System", icon: AlertTriangle, color: "#EF4444" });
    }
    if (card.type === "hard_cost" && card.sourceEmail) {
      base.push({ time: "9:04 AM", event: `Email receipt parsed from ${card.sourceEmail.sender}`, agent: "Teammate", icon: Sparkles, color: "#3B82F6" });
    }

    base.push({ time: "Now", event: "Awaiting your review", agent: "Queue", icon: Clock, color: "#F59E0B" });
    return base;
  }, [card]);

  return (
    <div>
      <p className="text-[12px] mb-4" style={{ color: "#94A3B8", fontWeight: 600 }}>
        Activity timeline
      </p>
      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px" style={{ backgroundColor: "#E2E8F0" }} />
        <div className="space-y-0">
          {events.map((entry, idx) => {
            const Icon = entry.icon;
            const isExpanded = expandedIdx === idx;
            return (
              <div key={idx} className="flex gap-4 pb-6 last:pb-0 relative">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                  style={{ backgroundColor: "#FFFFFF", border: "2px solid #E2E8F0" }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: entry.color }} />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px]" style={{ color: "#94A3B8", fontWeight: 500, fontFeatureSettings: "'tnum'" }}>
                      {entry.time}
                    </span>
                    <span
                      className="text-[12px] px-2 py-[1px] rounded-md"
                      style={{ backgroundColor: "#F1F5F9", color: "#64748B", fontWeight: 500 }}
                    >
                      {entry.agent}
                    </span>
                  </div>
                  <p className="text-[14px] leading-relaxed" style={{ color: "#0F172A" }}>
                    {entry.event}
                    {entry.detail && (
                      <button
                        onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                        className="ml-2 text-[12px] transition-colors hover:text-blue-700"
                        style={{ color: "#3B82F6", fontWeight: 500 }}
                      >
                        {isExpanded ? "Hide" : "Why?"}
                      </button>
                    )}
                  </p>
                  {entry.detail && isExpanded && (
                    <p className="text-[13px] leading-relaxed mt-1.5" style={{ color: "#64748B" }}>
                      {entry.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

const TXN_SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  bank: Landmark,
  card: CreditCard,
  check: FileText,
  wire: ArrowRightLeft,
  ach: ArrowRightLeft,
};

function TxnContextSection({ txn }: { txn: ActionCardData["txnContext"] }) {
  if (!txn) return null;
  const SourceIcon = TXN_SOURCE_ICONS[txn.sourceIcon] || Landmark;

  const rows = [
    { icon: <User className="w-3.5 h-3.5" />, label: "Who", value: txn.payee },
    { icon: <Tag className="w-3.5 h-3.5" />, label: "What", value: txn.category },
    { icon: <Calendar className="w-3.5 h-3.5" />, label: "When", value: txn.date },
    { icon: <SourceIcon className="w-3.5 h-3.5" />, label: "Source", value: txn.source },
  ];

  return (
    <div>
      <SectionLabel>Transaction</SectionLabel>
      <div className="mt-2 rounded-xl p-4 space-y-2.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
        {rows.map((r) => (
          <AllocationRow key={r.label} icon={r.icon} label={r.label} value={r.value} />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 600 }}>
      {children}
    </h3>
  );
}

function AIAnalysisSection({ rationale }: { rationale: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 transition-colors hover:text-teal-700"
        style={{ color: "#94A3B8" }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="text-[12px]" style={{ fontWeight: 600 }}>
          Why this was flagged
        </span>
        <ChevronDown
          className="w-3 h-3 transition-transform"
          style={{ transform: open ? "rotate(0)" : "rotate(-90deg)" }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-lg p-3.5 mt-2 text-[13px] leading-relaxed"
              style={{ backgroundColor: "#F8FAFC", color: "#64748B", border: "1px solid #F1F5F9" }}
            >
              {rationale}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
