import * as React from "react";
import {
  Check,
  CheckCircle2,
  Search,
  ChevronRight,
  DollarSign,
  Wifi,
  RefreshCcw,
  Clock,
  Upload,
  Paperclip,
  X,
  RotateCcw,
  Trash2,
  Send,
  FileText,
  ExternalLink,
  ArrowRightLeft,
  Briefcase,
  Store,
  Bell,
  Ban,
} from "lucide-react";
import { cn } from "../ui/utils";
import { motion, AnimatePresence } from "motion/react";
import type { ActionCardData, CardType } from "./ActionQueueTypes";

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function PrimaryCTA({ onClick, disabled, icon: Icon, children }: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition-all"
      style={{
        backgroundColor: disabled ? "#E2E8F0" : "#0F172A",
        color: disabled ? "#94A3B8" : "#FFFFFF",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <Icon className="w-3.5 h-3.5" />
      {children}
    </button>
  );
}

function SecondaryCTA({ onClick, icon: Icon, children }: {
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition-all hover:bg-gray-50"
      style={{ border: "1px solid #E2E8F0", color: "#475569", fontWeight: 500 }}
    >
      <Icon className="w-3 h-3" />
      {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INDIVIDUAL CARD RENDERERS
   ═══════════════════════════════════════════════════════════════════════════ */

interface CardContentProps {
  card: ActionCardData;
  onResolve: () => void;
}

/* ─── 1. Trust Balance ─── */
function TrustBalanceContent({ onResolve }: CardContentProps) {
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Incoming expense from <b style={{ color: "#0F172A" }}>Superior Court Filings</b> will breach retainer floor for <b style={{ color: "#0F172A" }}>Jane Doe</b>.
        Balance: <span style={{ fontWeight: 600, color: "#0F172A", fontFeatureSettings: "'tnum'" }}>$1,842</span> →{" "}
        <span style={{ fontWeight: 600, color: "#DC2626", fontFeatureSettings: "'tnum'" }}>$592</span>{" "}
        <span style={{ color: "#94A3B8" }}>(floor: $1,000)</span>
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <PrimaryCTA onClick={onResolve} icon={DollarSign}>Allocate Top-Up</PrimaryCTA>
        <SecondaryCTA icon={Send}>Bill Client</SecondaryCTA>
        <button className="text-[12px] hover:text-blue-700 flex items-center gap-1 ml-1" style={{ color: "#3B82F6", fontWeight: 500 }}>
          <ExternalLink className="w-3 h-3" /> Ledger
        </button>
      </div>
    </>
  );
}

/* ─── 2. Bank Disconnect ─── */
function BankDisconnectContent({ onResolve }: CardContentProps) {
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Plaid connection needs re-authentication. <b style={{ color: "#0F172A" }}>12 transactions</b> queued (~$8,420 pending) over last 6 hours.
      </p>
      <div className="flex items-center gap-2">
        <PrimaryCTA onClick={onResolve} icon={Wifi}>Re-authenticate</PrimaryCTA>
        <SecondaryCTA icon={RefreshCcw}>Sync Manually</SecondaryCTA>
      </div>
    </>
  );
}

/* ─── 3. Anomaly Amount ─── */
function AnomalyAmountContent({ onResolve }: CardContentProps) {
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        <b style={{ color: "#0F172A" }}>$9,200</b> to <b style={{ color: "#0F172A" }}>Thomson Legal Services</b> —{" "}
        <span style={{ color: "#D97706", fontWeight: 600 }}>340% above avg</span> ($2,100). No matching invoice found.
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <PrimaryCTA onClick={onResolve} icon={Check}>Confirm & Post</PrimaryCTA>
        <SecondaryCTA icon={ArrowRightLeft}>Recategorize</SecondaryCTA>
        <SecondaryCTA icon={Briefcase}>Split</SecondaryCTA>
      </div>
    </>
  );
}

/* ─── 4. Duplicate ─── */
function DuplicateContent({ onResolve }: CardContentProps) {
  const [choice, setChoice] = React.useState<"dup" | "separate" | null>(null);
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Two identical <b style={{ color: "#0F172A" }}>$4,500</b> deposits from <b style={{ color: "#0F172A" }}>John Smith</b> on Mar 17. Duplicate sync error or separate payments?
      </p>
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setChoice("dup")}
          className="flex-1 py-2 rounded-lg text-[13px] transition-all flex items-center justify-center gap-1.5"
          style={{
            border: choice === "dup" ? "1.5px solid #3B82F6" : "1px solid #E2E8F0",
            backgroundColor: choice === "dup" ? "#EFF6FF" : "#FFFFFF",
            color: choice === "dup" ? "#2563EB" : "#475569",
            fontWeight: choice === "dup" ? 600 : 500,
          }}
        >
          <Trash2 className="w-3.5 h-3.5" /> Flag Duplicate
        </button>
        <button
          onClick={() => setChoice("separate")}
          className="flex-1 py-2 rounded-lg text-[13px] transition-all flex items-center justify-center gap-1.5"
          style={{
            border: choice === "separate" ? "1.5px solid #3B82F6" : "1px solid #E2E8F0",
            backgroundColor: choice === "separate" ? "#EFF6FF" : "#FFFFFF",
            color: choice === "separate" ? "#2563EB" : "#475569",
            fontWeight: choice === "separate" ? 600 : 500,
          }}
        >
          <Check className="w-3.5 h-3.5" /> Confirm Separate
        </button>
      </div>
      <PrimaryCTA onClick={onResolve} disabled={!choice} icon={CheckCircle2}>Resolve & Record</PrimaryCTA>
    </>
  );
}

/* ─── 5. Approval Required ─── */
function ApprovalRequiredContent({ onResolve }: CardContentProps) {
  const [approver, setApprover] = React.useState("");
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        <b style={{ color: "#0F172A" }}>$7,500</b> to <b style={{ color: "#0F172A" }}>Morrison Contractors</b> (Office Renovation).
        Capital Expenditures · Threshold: $5,000.
      </p>
      <div className="mb-2">
        <label className="text-[11px] mb-1 block" style={{ color: "#94A3B8", fontWeight: 500 }}>Route to Approver</label>
        <select
          value={approver}
          onChange={(e) => setApprover(e.target.value)}
          className="max-w-xs text-[13px] rounded-lg px-3 py-2 outline-none cursor-pointer"
          style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: approver ? "#0F172A" : "#94A3B8" }}
        >
          <option value="">Select partner…</option>
          <option value="jw">James Westbrook (Managing)</option>
          <option value="sk">Sarah Kim (Senior)</option>
          <option value="rm">Rachel Morrison (Finance)</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <PrimaryCTA onClick={onResolve} disabled={!approver} icon={Send}>Send for Approval</PrimaryCTA>
        <SecondaryCTA icon={Check}>Override</SecondaryCTA>
      </div>
    </>
  );
}

/* ─── 6. Matching Gap ─── */
function MatchingGapContent({ onResolve }: CardContentProps) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [showSearch, setShowSearch] = React.useState(false);
  const candidates = [
    { id: "r108", label: "Retainer Request #108 for Jane Doe", matter: "Doe v. Metroplex LLC", date: "May 14, 2026", amount: "$500.00" },
    { id: "t001", label: "Trust Request #001 for John Doe", matter: "Doe Family Trust", date: "May 14, 2026", amount: "$500.00" },
  ];

  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Two candidate Trust Retainer Requests of <b style={{ color: "#0F172A" }}>$500.00</b>, both dated May 2026, different clients.
      </p>
      <div className="space-y-1.5 mb-2">
        {candidates.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={cn("w-full text-left p-2.5 rounded-lg transition-all", selected === c.id ? "ring-[1.5px] ring-blue-400" : "")}
            style={{
              border: selected === c.id ? "1px solid #93C5FD" : "1px solid #E2E8F0",
              backgroundColor: selected === c.id ? "#F0F7FF" : "#FFFFFF",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  border: selected === c.id ? "none" : "2px solid #CBD5E1",
                  backgroundColor: selected === c.id ? "#3B82F6" : "transparent",
                }}
              >
                {selected === c.id && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>{c.label}</p>
                <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "#94A3B8" }}>
                  <span>{c.matter}</span><span>·</span><span>{c.date}</span><span>·</span>
                  <span style={{ fontWeight: 500, color: "#0F172A" }}>{c.amount}</span>
                </div>
              </div>
              <span className="text-[11px] flex items-center gap-0.5 flex-shrink-0 cursor-pointer hover:underline" style={{ color: "#3B82F6", fontWeight: 500 }} onClick={(e) => e.stopPropagation()}>
                View <ChevronRight className="w-2.5 h-2.5" />
              </span>
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <PrimaryCTA onClick={onResolve} disabled={!selected} icon={Check}>Confirm Match</PrimaryCTA>
      </div>
      <div className="mt-2">
        <button onClick={() => setShowSearch(!showSearch)} className="text-[12px] flex items-center gap-1 hover:text-blue-700" style={{ color: "#3B82F6", fontWeight: 500 }}>
          <Search className="w-3 h-3" /> Not correct? Find Another
        </button>
        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-1.5 overflow-hidden">
              <input type="text" placeholder="Search by client, invoice, or amount…" className="max-w-xs text-[13px] rounded-lg px-3 py-2 outline-none" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ─── 7. Partial Match ─── */
function PartialMatchContent({ onResolve }: CardContentProps) {
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Inv <b style={{ color: "#0F172A" }}>#401</b> ($2,300) + <b style={{ color: "#0F172A" }}>#402</b> ($1,200) = $3,500 vs. bank <b style={{ color: "#0F172A" }}>$3,485</b>.
        Diff: <span style={{ color: "#D97706", fontWeight: 600 }}>$15</span> (possible bank fee).
      </p>
      <div className="flex items-center gap-2">
        <PrimaryCTA onClick={onResolve} icon={Check}>Accept Split Match</PrimaryCTA>
        <SecondaryCTA icon={ArrowRightLeft}>Match to Single Invoice</SecondaryCTA>
      </div>
    </>
  );
}

/* ─── 8. Blind Check ─── */
function BlindCheckContent({ onResolve }: CardContentProps) {
  const [payee, setPayee] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [matter, setMatter] = React.useState("");
  const filled = payee && category && matter;

  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Bank description <span className="font-mono text-[12px]" style={{ fontWeight: 600, color: "#0F172A" }}>'CHECK DEP #402'</span> — no payee or matter info. Needs categorization.
      </p>
      <div className="space-y-2 mb-2">
        <div>
          <label className="text-[11px] mb-1 block" style={{ color: "#94A3B8", fontWeight: 500 }}>From / To</label>
          <input value={payee} onChange={(e) => setPayee(e.target.value)} placeholder="e.g., Robert Chen" className="max-w-[220px] text-[13px] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }} />
        </div>
        <div>
          <label className="text-[11px] mb-1 block" style={{ color: "#94A3B8", fontWeight: 500 }}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-[200px] text-[13px] rounded-lg px-3 py-2 outline-none cursor-pointer" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: category ? "#0F172A" : "#94A3B8" }}>
            <option value="">Select category…</option>
            <option value="trust">Trust Deposit</option>
            <option value="payment">Client Payment</option>
            <option value="retainer">Retainer Deposit</option>
            <option value="other">Other Income</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] mb-1 block" style={{ color: "#94A3B8", fontWeight: 500 }}>Client / Matter</label>
          <select value={matter} onChange={(e) => setMatter(e.target.value)} className="max-w-xs text-[13px] rounded-lg px-3 py-2 outline-none cursor-pointer" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: matter ? "#0F172A" : "#94A3B8" }}>
            <option value="">Select client/matter…</option>
            <option value="chen">Robert Chen — Chen v. StateFarm</option>
            <option value="doe">Jane Doe — Doe v. Metroplex</option>
            <option value="mitchell">Sarah Mitchell — Mitchell Divorce</option>
            <option value="torres">Michael Torres — Torres Custody</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <PrimaryCTA onClick={onResolve} disabled={!filled} icon={CheckCircle2}>Add to Books</PrimaryCTA>
        <SecondaryCTA icon={Paperclip}>Attach Memo</SecondaryCTA>
      </div>
    </>
  );
}

/* ─── 9. Receipt Required ─── */
function ReceiptRequiredContent({ onResolve }: CardContentProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploaded, setUploaded] = React.useState(false);

  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Transaction hit <b style={{ color: "#0F172A" }}>'$100 Receipt Rule'</b>. Attach documentation for audit compliance.
      </p>
      <div
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); setUploaded(true); }}
        className="rounded-lg p-3 mb-2 text-center transition-all cursor-pointer"
        style={{
          border: `2px dashed ${isDragging ? "#3B82F6" : uploaded ? "#4ADE80" : "#CBD5E1"}`,
          backgroundColor: isDragging ? "#EFF6FF" : uploaded ? "#F0FDF4" : "#F8FAFC",
        }}
        onClick={() => setUploaded(true)}
      >
        {uploaded ? (
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" style={{ color: "#16A34A" }} />
            <span className="text-[13px]" style={{ color: "#16A34A", fontWeight: 500 }}>receipt attached</span>
          </div>
        ) : (
          <>
            <Upload className="w-4 h-4 mx-auto mb-1" style={{ color: "#94A3B8" }} />
            <p className="text-[13px]" style={{ color: "#64748B", fontWeight: 500 }}>Drag & drop receipt here</p>
            <p className="text-[11px]" style={{ color: "#94A3B8" }}>or click to browse</p>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        <PrimaryCTA onClick={onResolve} disabled={!uploaded} icon={CheckCircle2}>Attach & Post</PrimaryCTA>
        <SecondaryCTA icon={Send}>Request from Cardholder</SecondaryCTA>
      </div>
    </>
  );
}

/* ─── 10. Hard Cost ─── */
function HardCostContent({ onResolve }: CardContentProps) {
  const [waitingForReview, setWaitingForReview] = React.useState(false);

  if (waitingForReview) {
    return (
      <div className="rounded-lg p-3 text-center" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
        <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: "#D97706" }} />
        <p className="text-[13px]" style={{ fontWeight: 600, color: "#92400E" }}>Sent to Sarah Kim for review</p>
        <p className="text-[11px] mt-0.5" style={{ color: "#B45309" }}>Waiting for response · Just now</p>
        <button onClick={() => setWaitingForReview(false)} className="mt-2 text-[11px] hover:underline" style={{ color: "#3B82F6", fontWeight: 500 }}>Cancel</button>
      </div>
    );
  }

  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        <b style={{ color: "#0F172A" }}>King County Superior Court</b> — $125.00 filing fee.
        Matched to <b style={{ color: "#0F172A" }}>Jane Doe</b> (Doe v. Metroplex LLC).
        <span className="inline-flex items-center gap-1 ml-1.5 text-[12px]" style={{ color: "#3B82F6", fontWeight: 500, cursor: "pointer" }}>
          <FileText className="w-3 h-3" /> court_filing_receipt.pdf
        </span>
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        <PrimaryCTA onClick={onResolve} icon={DollarSign}>Add to Invoice</PrimaryCTA>
        <SecondaryCTA icon={FileText}>Link to Bill #217</SecondaryCTA>
        <button onClick={() => onResolve()} className="text-[12px] hover:underline" style={{ color: "#64748B", fontWeight: 500 }}>Non-Billable</button>
        <span style={{ color: "#E2E8F0" }}>·</span>
        <button onClick={() => setWaitingForReview(true)} className="text-[12px] flex items-center gap-1 hover:underline" style={{ color: "#3B82F6", fontWeight: 500 }}>
          <Send className="w-3 h-3" /> Send for Review
        </button>
      </div>
    </>
  );
}

/* ─── 11. Hard Cost Multi-Line ─── */
function HardCostMultiLineContent({ onResolve }: CardContentProps) {
  const [lineItems, setLineItems] = React.useState([
    { id: "li1", desc: "Deposition — Chen hearing (3hrs)", matter: "Chen v. StateFarm", amount: "$420.00", billable: true },
    { id: "li2", desc: "Deposition — Chen expert witness", matter: "Chen v. StateFarm", amount: "$260.00", billable: true },
    { id: "li3", desc: "Court reporter — Doe prelim", matter: "Doe v. Metroplex", amount: "$280.00", billable: true },
    { id: "li4", desc: "Rush transcript — Doe", matter: "Doe v. Metroplex", amount: "$140.00", billable: true },
    { id: "li5", desc: "Filing support — Santos", matter: "Santos Immigration", amount: "$150.00", billable: false },
  ]);

  const toggleBillable = (id: string) => {
    setLineItems((prev) => prev.map((li) => li.id === id ? { ...li, billable: !li.billable } : li));
  };

  const billableCount = lineItems.filter((li) => li.billable).length;

  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Vendor invoice from <b style={{ color: "#0F172A" }}>ABC Depositions Inc.</b> — {lineItems.length} line items across 3 matters.
      </p>
      <div className="rounded-lg overflow-hidden mb-2" style={{ border: "1px solid #E2E8F0" }}>
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-0 text-[10px] uppercase px-2.5 py-1.5" style={{ backgroundColor: "#F8FAFC", color: "#94A3B8", fontWeight: 600, letterSpacing: "0.05em" }}>
          <span>Description</span>
          <span className="text-right px-2">Matter</span>
          <span className="text-right px-2">Amount</span>
          <span className="text-center px-1.5">Bill</span>
        </div>
        {lineItems.map((li) => (
          <div key={li.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-0 items-center px-2.5 py-1.5" style={{ borderTop: "1px solid #F1F5F9" }}>
            <span className="text-[12px] truncate pr-2" style={{ color: "#0F172A" }}>{li.desc}</span>
            <span className="text-[11px] text-right px-2 truncate" style={{ color: "#64748B", maxWidth: 120 }}>{li.matter}</span>
            <span className="text-[12px] text-right px-2" style={{ fontWeight: 600, color: "#0F172A", fontFeatureSettings: "'tnum'" }}>{li.amount}</span>
            <div className="flex justify-center px-1.5">
              <button
                onClick={() => toggleBillable(li.id)}
                className="w-4 h-4 rounded flex items-center justify-center transition-all"
                style={{
                  backgroundColor: li.billable ? "#3B82F6" : "#F1F5F9",
                  border: li.billable ? "none" : "1px solid #CBD5E1",
                }}
              >
                {li.billable && <Check className="w-2.5 h-2.5 text-white" />}
              </button>
            </div>
          </div>
        ))}
      </div>
      <PrimaryCTA onClick={onResolve} icon={CheckCircle2}>
        Confirm {billableCount} Hard Cost{billableCount !== 1 ? "s" : ""}
      </PrimaryCTA>
    </>
  );
}

/* ─── 12. First-Time Vendor ─── */
function FirstTimeVendorContent({ onResolve }: CardContentProps) {
  const [category, setCategory] = React.useState("deposition");
  const [merging, setMerging] = React.useState(false);

  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        <b style={{ color: "#0F172A" }}>'Pacific Court Reporters'</b> — not in vendor list. Suggested: Court Reporting / Deposition Services.
        <span className="text-[12px] ml-1" style={{ color: "#D97706" }}>Similar: ABC Depositions Inc. (different entity)</span>
      </p>
      <div className="mb-2">
        <label className="text-[11px] mb-1 block" style={{ color: "#94A3B8", fontWeight: 500 }}>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-xs text-[13px] rounded-lg px-3 py-2 outline-none cursor-pointer" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}>
          <option value="deposition">Court Reporting / Deposition</option>
          <option value="legal_services">Legal Services</option>
          <option value="professional">Professional Fees</option>
          <option value="other">Other Expense</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        {!merging ? (
          <>
            <PrimaryCTA onClick={onResolve} icon={Store}>Create Vendor & Assign</PrimaryCTA>
            <button onClick={() => setMerging(true)} className="text-[12px] hover:underline" style={{ color: "#3B82F6", fontWeight: 500 }}>Merge with Existing</button>
          </>
        ) : (
          <>
            <select className="max-w-[200px] text-[13px] rounded-lg px-3 py-2 outline-none cursor-pointer" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}>
              <option>ABC Depositions Inc.</option>
              <option>Henderson & Associates</option>
              <option>Thomson Legal Services</option>
            </select>
            <PrimaryCTA onClick={onResolve} icon={Check}>Merge</PrimaryCTA>
            <button onClick={() => setMerging(false)} className="text-[12px] hover:underline" style={{ color: "#94A3B8", fontWeight: 500 }}>Cancel</button>
          </>
        )}
      </div>
    </>
  );
}

/* ─── 13. User Config Trigger ─── */
function UserConfigTriggerContent({ onResolve }: CardContentProps) {
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        March total: <b style={{ color: "#D97706" }}>$5,420</b> / $5,000 threshold{" "}
        <span style={{ color: "#D97706", fontWeight: 600 }}>(+$420 over)</span>.
        Latest: $320.00 to 'Clio Manage' pushed total past limit. Prior month: $4,890.
      </p>
      <div className="flex items-center gap-2">
        <PrimaryCTA onClick={onResolve} icon={Check}>Acknowledge</PrimaryCTA>
        <SecondaryCTA icon={Bell}>Adjust Threshold</SecondaryCTA>
      </div>
    </>
  );
}

/* ─── 14. Stale Check ─── */
function StaleCheckContent({ onResolve }: CardContentProps) {
  const [action, setAction] = React.useState<"void" | "reissue" | "keep" | null>(null);
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Check <b style={{ color: "#0F172A" }}>#902</b> issued <b style={{ color: "#0F172A" }}>7 months ago</b> (Aug 2025), uncashed. Stale-dated item — void or reissue.
      </p>
      <div className="flex gap-1.5 mb-2">
        {([
          { key: "void" as const, label: "Void", icon: X },
          { key: "reissue" as const, label: "Reissue", icon: RotateCcw },
          { key: "keep" as const, label: "Keep", icon: Clock },
        ]).map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.key}
              onClick={() => setAction(opt.key)}
              className="flex-1 py-2 rounded-lg text-[13px] transition-all flex items-center justify-center gap-1"
              style={{
                border: action === opt.key ? "1.5px solid #3B82F6" : "1px solid #E2E8F0",
                backgroundColor: action === opt.key ? "#EFF6FF" : "#FFFFFF",
                color: action === opt.key ? "#2563EB" : "#475569",
                fontWeight: action === opt.key ? 600 : 500,
              }}
            >
              <Icon className="w-3 h-3" /> {opt.label}
            </button>
          );
        })}
      </div>
      <PrimaryCTA onClick={onResolve} disabled={!action} icon={CheckCircle2}>Perform Cleanup</PrimaryCTA>
    </>
  );
}

/* ─── 15. Orphaned Trust ─── */
function OrphanedTrustContent({ onResolve }: CardContentProps) {
  const [client, setClient] = React.useState("");
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Trust Deposit with no client assigned. Cannot reconcile until linked to a client/matter ledger.
      </p>
      <div className="mb-2">
        <label className="text-[11px] mb-1 block" style={{ color: "#94A3B8", fontWeight: 500 }}>Assign Client / Matter</label>
        <select value={client} onChange={(e) => setClient(e.target.value)} className="max-w-xs text-[13px] rounded-lg px-3 py-2 outline-none cursor-pointer" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: client ? "#0F172A" : "#94A3B8" }}>
          <option value="">Search client/matter…</option>
          <option value="chen">Robert Chen — Chen v. StateFarm</option>
          <option value="doe">Jane Doe — Doe v. Metroplex</option>
          <option value="mitchell">Sarah Mitchell — Mitchell Divorce</option>
          <option value="santos">Maria Santos — Santos Immigration</option>
        </select>
      </div>
      <PrimaryCTA onClick={onResolve} disabled={!client} icon={CheckCircle2}>Update & Add to Books</PrimaryCTA>
    </>
  );
}

/* ─── 16. Reconciliation Block ─── */
function ReconciliationBlockContent({ onResolve }: CardContentProps) {
  return (
    <>
      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "#64748B" }}>
        Chase ··4892 · Feb 2026 · <b style={{ color: "#DC2626" }}>$342.17</b> Office Depot — in GL, not in bank statement. Blocking month-end close.
      </p>
      <div className="flex items-center gap-2">
        <PrimaryCTA onClick={onResolve} icon={Search}>Investigate & Resolve</PrimaryCTA>
        <SecondaryCTA icon={ArrowRightLeft}>Post Adjusting Entry</SecondaryCTA>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INDIVIDUAL CARD RENDERER MAP
   ═══════════════════════════════════════════════════════════════════════════ */

const contentRenderers: Record<string, React.ComponentType<CardContentProps>> = {
  trust_balance: TrustBalanceContent,
  bank_disconnect: BankDisconnectContent,
  anomaly_amount: AnomalyAmountContent,
  duplicate: DuplicateContent,
  approval_required: ApprovalRequiredContent,
  matching_gap: MatchingGapContent,
  partial_match: PartialMatchContent,
  blind_check: BlindCheckContent,
  receipt_required: ReceiptRequiredContent,
  hard_cost: HardCostContent,
  hard_cost_multiline: HardCostMultiLineContent,
  first_time_vendor: FirstTimeVendorContent,
  user_config_trigger: UserConfigTriggerContent,
  stale_check: StaleCheckContent,
  orphaned_trust: OrphanedTrustContent,
  reconciliation_block: ReconciliationBlockContent,
};

export function renderCardContent(card: ActionCardData, onResolve: () => void): React.ReactNode {
  const Renderer = contentRenderers[card.type];
  if (!Renderer) return null;
  return <Renderer card={card} onResolve={onResolve} />;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONSOLIDATED CARD CONTENT
   ═══════════════════════════════════════════════════════════════════════════ */

interface ConsolidatedContentProps {
  type: CardType;
  cards: ActionCardData[];
  onResolveCards: (ids: string[]) => void;
}

function extractLabel(card: ActionCardData): string {
  const parts = card.title.split(" — ");
  return parts.length > 1 ? parts[parts.length - 1] : card.title;
}

const consolidatedCTALabels: Partial<Record<CardType, { primary: string; secondary?: string }>> = {
  anomaly_amount: { primary: "Confirm & Post", secondary: "Recategorize Selected" },
  receipt_required: { primary: "Request All Receipts", secondary: "Mark Compliant" },
  stale_check: { primary: "Void Selected", secondary: "Reissue Selected" },
  first_time_vendor: { primary: "Create All Vendors" },
  user_config_trigger: { primary: "Acknowledge All" },
};

export function ConsolidatedContent({ type, cards, onResolveCards }: ConsolidatedContentProps) {
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set(cards.map((c) => c.id)));

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === cards.length) setSelected(new Set());
    else setSelected(new Set(cards.map((c) => c.id)));
  };

  const allSelected = selected.size === cards.length;
  const ctaLabels = consolidatedCTALabels[type] || { primary: "Resolve Selected" };

  return (
    <>
      {/* Table */}
      <div className="rounded-lg overflow-hidden mb-2" style={{ border: "1px solid #E2E8F0" }}>
        {/* Header */}
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 text-[11px]"
          style={{ backgroundColor: "#F8FAFC", color: "#94A3B8", fontWeight: 500 }}
        >
          <button
            onClick={toggleAll}
            className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              backgroundColor: allSelected ? "#3B82F6" : "#F1F5F9",
              border: allSelected ? "none" : "1px solid #CBD5E1",
            }}
          >
            {allSelected && <Check className="w-2 h-2 text-white" />}
          </button>
          <span className="flex-1">Description</span>
          <span className="w-16 text-right">Date</span>
          <span className="w-20 text-right">Amount</span>
          <span className="w-[70px]" />
        </div>

        {/* Rows */}
        {cards.map((card) => {
          const isChecked = selected.has(card.id);
          return (
            <div
              key={card.id}
              className="flex items-center gap-2 px-2.5 py-2 transition-colors hover:bg-gray-50/50"
              style={{ borderTop: "1px solid #F1F5F9" }}
            >
              <button
                onClick={() => toggle(card.id)}
                className="w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  backgroundColor: isChecked ? "#3B82F6" : "#F1F5F9",
                  border: isChecked ? "none" : "1px solid #CBD5E1",
                }}
              >
                {isChecked && <Check className="w-2 h-2 text-white" />}
              </button>
              <div className="flex-1 min-w-0">
                <span className="text-[12px] block truncate" style={{ color: "#0F172A", fontWeight: 500 }}>
                  {extractLabel(card)}
                </span>
                <span className="text-[11px] block truncate" style={{ color: "#94A3B8" }}>
                  {card.subtitle}
                </span>
              </div>
              <span
                className="w-16 text-right text-[12px] flex-shrink-0"
                style={{ color: "#94A3B8" }}
              >
                {card.timestamp}
              </span>
              <span
                className="w-20 text-right text-[13px] flex-shrink-0"
                style={{ fontWeight: 500, color: "#0F172A", fontFeatureSettings: "'tnum'" }}
              >
                {card.amount}
              </span>
              <button
                className="w-[70px] text-right text-[12px] flex-shrink-0 whitespace-nowrap hover:underline"
                style={{ color: "#3B82F6", fontWeight: 500, background: "none", border: "none", cursor: "pointer" }}
              >
                View detail
              </button>
            </div>
          );
        })}
      </div>

      {/* Batch CTAs */}
      <div className="flex items-center gap-2 flex-wrap">
        <PrimaryCTA
          onClick={() => onResolveCards(Array.from(selected))}
          disabled={selected.size === 0}
          icon={CheckCircle2}
        >
          {ctaLabels.primary} ({selected.size})
        </PrimaryCTA>
        {ctaLabels.secondary && (
          <SecondaryCTA icon={ArrowRightLeft}>{ctaLabels.secondary}</SecondaryCTA>
        )}
      </div>
    </>
  );
}
