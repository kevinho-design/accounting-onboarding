import * as React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Download, FileText, Landmark } from "lucide-react";

interface ReconciliationReviewModalProps {
  open: boolean;
  onClose: () => void;
  month: string;
  monthLabel: string;
  isReconciled: boolean;
  isFebPartial?: boolean;
  onConfirmClose?: () => void;
  onResolveBlocker?: () => void;
}

interface AccountRow {
  name: string;
  icon: string;
  statementBalance: number;
  bookBalance: number;
  status: "reconciled" | "blocker";
  blockerCount?: number;
  blockerAmount?: string;
}

interface MatchedTxn {
  date: string;
  payee: string;
  amount: number;
  type: "credit" | "debit";
}

const MONTH_DATA: Record<string, {
  statementBalance: number;
  bookBalance: number;
  totalMatched: number;
  totalUnmatched: number;
  accounts: AccountRow[];
  reconDate?: string;
  matched: MatchedTxn[];
  unmatched: { date: string; payee: string; amount: number; recommendation: string }[];
}> = {
  oct: {
    statementBalance: 128_493.21, bookBalance: 128_493.21, totalMatched: 287, totalUnmatched: 0, reconDate: "Nov 3, 2025",
    accounts: [
      { name: "Chase ··4892 (Operating)", icon: "chase", statementBalance: 98_241.55, bookBalance: 98_241.55, status: "reconciled" },
      { name: "Amex ··1247 (Card)",       icon: "amex",  statementBalance: 12_483.30, bookBalance: 12_483.30, status: "reconciled" },
      { name: "BOA ··7721 (IOLTA)",       icon: "boa",   statementBalance: 17_768.36, bookBalance: 17_768.36, status: "reconciled" },
    ],
    matched: [], unmatched: [],
  },
  nov: {
    statementBalance: 134_217.88, bookBalance: 134_217.88, totalMatched: 301, totalUnmatched: 0, reconDate: "Dec 2, 2025",
    accounts: [
      { name: "Chase ··4892 (Operating)", icon: "chase", statementBalance: 102_890.44, bookBalance: 102_890.44, status: "reconciled" },
      { name: "Amex ··1247 (Card)",       icon: "amex",  statementBalance: 11_295.10, bookBalance: 11_295.10, status: "reconciled" },
      { name: "BOA ··7721 (IOLTA)",       icon: "boa",   statementBalance: 20_032.34, bookBalance: 20_032.34, status: "reconciled" },
    ],
    matched: [], unmatched: [],
  },
  dec: {
    statementBalance: 141_502.67, bookBalance: 141_502.67, totalMatched: 318, totalUnmatched: 0, reconDate: "Jan 4, 2026",
    accounts: [
      { name: "Chase ··4892 (Operating)", icon: "chase", statementBalance: 108_770.20, bookBalance: 108_770.20, status: "reconciled" },
      { name: "Amex ··1247 (Card)",       icon: "amex",  statementBalance: 13_102.47, bookBalance: 13_102.47, status: "reconciled" },
      { name: "BOA ··7721 (IOLTA)",       icon: "boa",   statementBalance: 19_630.00, bookBalance: 19_630.00, status: "reconciled" },
    ],
    matched: [], unmatched: [],
  },
  jan: {
    statementBalance: 139_884.50, bookBalance: 139_884.50, totalMatched: 295, totalUnmatched: 0, reconDate: "Feb 3, 2026",
    accounts: [
      { name: "Chase ··4892 (Operating)", icon: "chase", statementBalance: 106_342.18, bookBalance: 106_342.18, status: "reconciled" },
      { name: "Amex ··1247 (Card)",       icon: "amex",  statementBalance: 14_210.32, bookBalance: 14_210.32, status: "reconciled" },
      { name: "BOA ··7721 (IOLTA)",       icon: "boa",   statementBalance: 19_332.00, bookBalance: 19_332.00, status: "reconciled" },
    ],
    matched: [], unmatched: [],
  },
  feb: {
    statementBalance: 142_847.31, bookBalance: 139_989.12, totalMatched: 311, totalUnmatched: 1,
    accounts: [
      { name: "Chase ··4892 (Operating)", icon: "chase", statementBalance: 109_415.69, bookBalance: 106_557.50, status: "blocker", blockerCount: 1, blockerAmount: "$2,858.19" },
      { name: "Amex ··1247 (Card)",       icon: "amex",  statementBalance: 13_890.42, bookBalance: 13_890.42, status: "reconciled" },
      { name: "BOA ··7721 (IOLTA)",       icon: "boa",   statementBalance: 19_541.20, bookBalance: 19_541.20, status: "reconciled" },
    ],
    matched: [
      { date: "Feb 1",  payee: "Wilson & Associates",     amount:  4200.00, type: "credit" },
      { date: "Feb 1",  payee: "Westlaw",                 amount:  -389.00, type: "debit"  },
      { date: "Feb 2",  payee: "Robert Chen",             amount:  3500.00, type: "credit" },
      { date: "Feb 3",  payee: "ADP Payroll",             amount: -12450.00, type: "debit" },
      { date: "Feb 3",  payee: "Office Depot",            amount:   -87.43, type: "debit"  },
      { date: "Feb 4",  payee: "Jane Doe",                amount:  5000.00, type: "credit" },
      { date: "Feb 5",  payee: "Pacific Legal Consulting", amount: -1500.00, type: "debit" },
      { date: "Feb 6",  payee: "Clio Manage",             amount:  -320.00, type: "debit"  },
      { date: "Feb 7",  payee: "Santos Immigration",      amount:  2800.00, type: "credit" },
      { date: "Feb 8",  payee: "Court Clerk — Circuit",   amount:  -195.00, type: "debit"  },
      { date: "Feb 9",  payee: "Green Family",            amount:  3000.00, type: "credit" },
      { date: "Feb 10", payee: "Staples",                 amount:  -124.50, type: "debit"  },
      { date: "Feb 11", payee: "Martinez Family",         amount:  6200.00, type: "credit" },
      { date: "Feb 12", payee: "ABC Depositions Inc.",    amount: -1250.00, type: "debit"  },
      { date: "Feb 13", payee: "United Airlines",         amount:  -278.90, type: "debit"  },
      { date: "Feb 15", payee: "AT&T",                    amount:  -189.99, type: "debit"  },
      { date: "Feb 16", payee: "D. Williams",             amount:  1800.00, type: "credit" },
      { date: "Feb 17", payee: "Morrison Contractors",    amount: -2400.00, type: "debit"  },
      { date: "Feb 18", payee: "FedEx",                   amount:   -42.15, type: "debit"  },
      { date: "Feb 19", payee: "Thomson Legal Services",  amount: -2100.00, type: "debit"  },
    ],
    unmatched: [
      { date: "Feb 14", payee: "Unknown vendor", amount: -2858.19, recommendation: "Add as miscellaneous expense" },
    ],
  },
  mar: {
    statementBalance: 148_210.44, bookBalance: 148_210.44, totalMatched: 133, totalUnmatched: 14,
    accounts: [
      { name: "Chase ··4892 (Operating)", icon: "chase", statementBalance: 112_480.22, bookBalance: 112_480.22, status: "reconciled" },
      { name: "Amex ··1247 (Card)",       icon: "amex",  statementBalance: 15_320.10, bookBalance: 15_320.10, status: "reconciled" },
      { name: "BOA ··7721 (IOLTA)",       icon: "boa",   statementBalance: 20_410.12, bookBalance: 20_410.12, status: "reconciled" },
    ],
    matched: [], unmatched: [],
  },
};

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function ReconciliationReviewModal({ open, onClose, month, monthLabel, isReconciled, isFebPartial, onConfirmClose, onResolveBlocker }: ReconciliationReviewModalProps) {
  const [matchedExpanded, setMatchedExpanded] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);

  const rawData = MONTH_DATA[month] ?? MONTH_DATA.mar;
  const febBlocked = isFebPartial && month === "feb";

  const data = (month === "feb" && !febBlocked) ? {
    ...rawData,
    statementBalance: rawData.statementBalance,
    bookBalance: rawData.statementBalance,
    totalMatched: 312,
    totalUnmatched: 0,
    reconDate: "Mar 18, 2026",
    accounts: rawData.accounts.map(a => ({
      ...a,
      bookBalance: a.statementBalance,
      status: "reconciled" as const,
      blockerCount: undefined,
      blockerAmount: undefined,
    })),
    unmatched: [],
  } : rawData;

  const diff = data.statementBalance - data.bookBalance;
  const hasDiff = Math.abs(diff) > 0.005;

  const visibleMatched = showAll ? data.matched : data.matched.slice(0, 20);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto p-0 gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <div>
            <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: "#94A3B8", fontWeight: 600 }}>{monthLabel}</p>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" style={{ color: "#64748B" }} />
              Reconciliation Report
            </h2>
          </div>

          {/* Auto-download note */}
          <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg" style={{ backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD" }}>
            <Landmark className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#0284C7" }} />
            <span className="text-[11px]" style={{ color: "#0369A1", fontWeight: 500 }}>
              Bank statements downloaded automatically and cross-referenced with your books
            </span>
          </div>
        </div>

        {/* Summary cards */}
        <div className="px-6 py-4 grid grid-cols-3 gap-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <div className="rounded-xl p-3.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "#94A3B8", fontWeight: 600 }}>Bank Statement</p>
            <p className="text-lg font-bold text-gray-900">{fmt(data.statementBalance)}</p>
          </div>
          <div className="rounded-xl p-3.5" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "#94A3B8", fontWeight: 600 }}>Book Balance</p>
            <p className="text-lg font-bold" style={{ color: hasDiff ? "#D97706" : "#0F172A" }}>{fmt(data.bookBalance)}</p>
          </div>
          <div className="rounded-xl p-3.5" style={{ backgroundColor: hasDiff ? "#FFFBEB" : "#F0FDF4", border: `1px solid ${hasDiff ? "#FDE68A" : "#BBF7D0"}` }}>
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: hasDiff ? "#D97706" : "#16A34A", fontWeight: 600 }}>Difference</p>
            <div className="flex items-center gap-1.5">
              {hasDiff
                ? <AlertTriangle className="w-4 h-4" style={{ color: "#D97706" }} />
                : <CheckCircle2 className="w-4 h-4" style={{ color: "#16A34A" }} />
              }
              <p className="text-lg font-bold" style={{ color: hasDiff ? "#D97706" : "#16A34A" }}>
                {hasDiff ? fmt(Math.abs(diff)) : "$0.00"}
              </p>
            </div>
          </div>
        </div>

        {/* Account breakdown */}
        <div className="px-6 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <h3 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide mb-3">Account Breakdown</h3>
          <div className="space-y-2">
            {data.accounts.map((acct) => (
              <div key={acct.name} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: acct.status === "reconciled" ? "#F0FDF4" : "#FFFBEB" }}>
                    <Landmark className="w-4 h-4" style={{ color: acct.status === "reconciled" ? "#16A34A" : "#D97706" }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{acct.name}</p>
                    <p className="text-[11px] text-gray-500">
                      Statement: {fmt(acct.statementBalance)} · Books: {fmt(acct.bookBalance)}
                    </p>
                  </div>
                </div>
                {acct.status === "reconciled" ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#16A34A" }} />
                    <span className="text-[11px] font-semibold" style={{ color: "#15803D" }}>Reconciled</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#D97706" }} />
                    <span className="text-[11px] font-semibold" style={{ color: "#B45309" }}>
                      {acct.blockerCount} unmatched — {acct.blockerAmount}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Matched transactions */}
        {data.totalMatched > 0 && (
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <button
              onClick={() => setMatchedExpanded(e => !e)}
              className="w-full flex items-center justify-between py-1"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" style={{ color: "#16A34A" }} />
                <span className="text-[13px] font-semibold text-gray-900">{data.totalMatched} matched transactions</span>
              </div>
              {matchedExpanded
                ? <ChevronUp className="w-4 h-4 text-gray-400" />
                : <ChevronDown className="w-4 h-4 text-gray-400" />
              }
            </button>
            {matchedExpanded && (
              <div className="mt-3">
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0" }}>
                  <div className="grid grid-cols-12 px-4 py-2 text-[10px] uppercase tracking-wide font-semibold" style={{ backgroundColor: "#F8FAFC", color: "#94A3B8" }}>
                    <span className="col-span-2">Date</span>
                    <span className="col-span-6">Payee</span>
                    <span className="col-span-3 text-right">Amount</span>
                    <span className="col-span-1 text-center">Status</span>
                  </div>
                  {visibleMatched.map((tx, i) => (
                    <div key={i} className="grid grid-cols-12 px-4 py-2 items-center" style={{ borderTop: "1px solid #F1F5F9" }}>
                      <span className="col-span-2 text-[12px] text-gray-500">{tx.date}</span>
                      <span className="col-span-6 text-[12px] text-gray-800 font-medium truncate">{tx.payee}</span>
                      <span className={`col-span-3 text-[12px] font-medium text-right tabular-nums ${tx.amount >= 0 ? "text-emerald-700" : "text-gray-800"}`}>
                        {tx.amount >= 0 ? "+" : ""}{fmt(Math.abs(tx.amount))}
                      </span>
                      <div className="col-span-1 flex justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#16A34A" }} />
                      </div>
                    </div>
                  ))}
                </div>
                {data.matched.length > 20 && !showAll && (
                  <button
                    onClick={() => setShowAll(true)}
                    className="mt-2 text-[12px] font-medium text-blue-600 hover:text-blue-700"
                  >
                    Show all {data.matched.length} transactions
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Unmatched transactions */}
        {data.unmatched.length > 0 && febBlocked && (
          <div className="px-6 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4" style={{ color: "#D97706" }} />
              <span className="text-[13px] font-semibold" style={{ color: "#B45309" }}>
                {data.unmatched.length} unmatched transaction{data.unmatched.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-2">
              {data.unmatched.map((tx, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}>
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">{tx.payee} · {tx.date}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#B45309" }}>
                      {fmt(Math.abs(tx.amount))} · Recommended: {tx.recommendation}
                    </p>
                  </div>
                  <button
                    onClick={onResolveBlocker}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: "#D97706", color: "#FFFFFF" }}
                  >
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            {isReconciled && data.reconDate && (
              <p className="text-[12px] text-gray-500">
                Reconciled on {data.reconDate}
              </p>
            )}
            {febBlocked && (
              <p className="text-[12px]" style={{ color: "#D97706", fontWeight: 500 }}>
                Resolve {data.totalUnmatched} blocker{data.totalUnmatched > 1 ? "s" : ""} to close this month
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isReconciled && (
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-all hover:opacity-90" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#475569", fontWeight: 500 }}>
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>
            )}
            {!isReconciled && !febBlocked && (
              <button
                onClick={onConfirmClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-all hover:opacity-90 shadow-sm"
                style={{ background: "linear-gradient(135deg, #16A34A, #15803D)", color: "#FFFFFF", fontWeight: 600 }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Close {monthLabel.split(" ")[0]}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
