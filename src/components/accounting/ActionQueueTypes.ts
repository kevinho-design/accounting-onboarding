import {
  AlertTriangle,
  TrendingUp,
  Copy,
  ShieldCheck,
  HelpCircle,
  GitBranch,
  FileQuestion,
  Paperclip,
  FileText,
  Layers,
  Store,
  Bell,
  Clock,
  User,
  Ban,
} from "lucide-react";

export type Priority = "critical" | "high" | "medium" | "low";
export type AccountType = "operating" | "trust";
export type CardStatus = "new" | "waiting" | "snoozed";

export type CardType =
  | "trust_balance"
  | "bank_disconnect"
  | "anomaly_amount"
  | "duplicate"
  | "approval_required"
  | "matching_gap"
  | "partial_match"
  | "blind_check"
  | "receipt_required"
  | "hard_cost"
  | "hard_cost_multiline"
  | "first_time_vendor"
  | "user_config_trigger"
  | "stale_check"
  | "orphaned_trust"
  | "reconciliation_block"
  | "recon_imbalance";

export interface SourceEmail {
  sender: string;
  subject: string;
  timestamp: string;
  attachmentName: string;
  sourceIcon?: "gmail" | "outlook" | "court";
}

export interface BalanceInfo {
  current: number;
  threshold: number;
  projected: number;
}

export interface AssignableUser {
  name: string;
  role: string;
  initials: string;
}

export interface TxnContext {
  payee: string;
  category: string;
  date: string;
  source: string;
  sourceIcon: "bank" | "card" | "check" | "wire" | "ach";
}

export interface ActionCardData {
  id: string;
  type: CardType;
  priority: Priority;
  timestamp: string;
  account: AccountType;
  amount: string;
  status: CardStatus;
  title: string;
  subtitle: string;
  evidenceRationale: string;
  sourceEmail?: SourceEmail;
  balanceInfo?: BalanceInfo;
  assignableUsers?: AssignableUser[];
  txnContext?: TxnContext;
  reconMonth?: string;
  hidden?: boolean;
}

export interface PriorityConfig {
  label: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
}

export interface CardTypeConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  priority: Priority;
  inlineCTA?: string;
  viewCTA?: string;
  secondaryCTA?: string;
}

export const priorityConfig: Record<Priority, PriorityConfig> = {
  critical: { label: "Critical", color: "#EF4444", badgeBg: "#FEF2F2", badgeText: "#DC2626", accentColor: "#EF4444" },
  high:     { label: "High",     color: "#F59E0B", badgeBg: "#FFFBEB", badgeText: "#D97706", accentColor: "#F59E0B" },
  medium:   { label: "Medium",   color: "#3B82F6", badgeBg: "#EFF6FF", badgeText: "#2563EB", accentColor: "#3B82F6" },
  low:      { label: "Low",      color: "#6B7280", badgeBg: "#F3F4F6", badgeText: "#4B5563", accentColor: "#6B7280" },
};

export const cardTypeConfig: Record<CardType, CardTypeConfig> = {
  trust_balance:       { label: "Trust Alert",         icon: AlertTriangle, priority: "critical", viewCTA: "Assign request", secondaryCTA: "View trust ledger" },
  bank_disconnect:     { label: "Bank Issue",          icon: AlertTriangle, priority: "high",     inlineCTA: "Re-authenticate" },
  anomaly_amount:      { label: "Unusual Amount",      icon: TrendingUp,    priority: "high",     viewCTA: "Review payment" },
  duplicate:           { label: "Possible Duplicate",  icon: Copy,          priority: "high",     viewCTA: "Compare" },
  approval_required:   { label: "Approval Required",   icon: ShieldCheck,   priority: "high",     viewCTA: "Approval", secondaryCTA: "View details" },
  matching_gap:        { label: "Needs Match",         icon: HelpCircle,    priority: "medium",   viewCTA: "Match transaction" },
  partial_match:       { label: "Partial Match",       icon: GitBranch,     priority: "medium",   viewCTA: "Review match" },
  blind_check:         { label: "Unknown Payment",     icon: FileQuestion,  priority: "medium",   viewCTA: "Identify payee" },
  receipt_required:    { label: "Missing Receipt",     icon: Paperclip,     priority: "medium",   inlineCTA: "Request receipt" },
  hard_cost:           { label: "Hard Cost",           icon: FileText,      priority: "critical", inlineCTA: "Confirm hard cost" },
  hard_cost_multiline: { label: "Multi-Line Bill",     icon: Layers,        priority: "medium",   viewCTA: "Review line items", secondaryCTA: "View line items" },
  first_time_vendor:   { label: "New Vendor",          icon: Store,         priority: "medium",   viewCTA: "Assign category" },
  user_config_trigger: { label: "Custom Rule",         icon: Bell,          priority: "medium",   inlineCTA: "Acknowledge" },
  stale_check:         { label: "Old Check",           icon: Clock,         priority: "low",      inlineCTA: "Void check" },
  orphaned_trust:      { label: "Unlinked Deposit",    icon: User,          priority: "low",      viewCTA: "Link client" },
  reconciliation_block:{ label: "Recon Blocker",        icon: Ban,           priority: "high",     inlineCTA: "Resolve & reconcile" },
  recon_imbalance:     { label: "Statement Imbalance",  icon: AlertTriangle, priority: "high",     inlineCTA: "Add expense", secondaryCTA: "Notify team to claim" },
};

/* ═══════════════════════════════════════════════════════════════════════════
   CONSOLIDATION CONFIG
   ═══════════════════════════════════════════════════════════════════════════ */

export const CONSOLIDATION_ELIGIBLE: Set<CardType> = new Set([
  "anomaly_amount",
  "receipt_required",
  "first_time_vendor",
  "user_config_trigger",
  "stale_check",
  "approval_required",
]);

export const consolidatedTitles: Partial<Record<CardType, (n: number) => string>> = {
  anomaly_amount: (n) => `${n} Unusual Payments`,
  receipt_required: (n) => `${n} Receipts Needed`,
  stale_check: (n) => `${n} Stale Outstanding Checks`,
  first_time_vendor: (n) => `${n} New Vendors`,
  user_config_trigger: (n) => `${n} Custom Rule Alerts`,
  approval_required: (n) => `${n} Pending Approvals`,
};

export const consolidatedSubtitles: Partial<Record<CardType, string>> = {
  anomaly_amount: "Flagged because they're higher than usual for these vendors",
  receipt_required: "These need documentation — request or attach receipts",
  stale_check: "These checks haven't been cashed — void, reissue, or keep?",
  first_time_vendor: "New vendors that need a category before posting",
  user_config_trigger: "Alerts from your custom rules",
};

export const consolidatedCTAs: Partial<Record<CardType, string>> = {
  anomaly_amount: "View payments",
  receipt_required: "View receipts",
  stale_check: "View checks",
  first_time_vendor: "View vendors",
  user_config_trigger: "View alerts",
};

/* ═══════════════════════════════════════════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */

export const mockActionCards: ActionCardData[] = [
  // CRITICAL
  {
    id: "c1",
    type: "trust_balance",
    priority: "critical",
    timestamp: "2 min ago",
    account: "trust",
    amount: "$1,250.00",
    status: "new",
    title: "Jane Doe's trust will drop below the $1,000 floor",
    subtitle: "Assign to an associate to request a $408 replenishment from the client in Manage",
    evidenceRationale: "Incoming billable expense of $1,250 from Superior Court Filings. Current trust balance: $1,842. After posting, balance falls to $592 — below the $1,000 retainer floor set for this client.",
    txnContext: { payee: "Superior Court Filings", category: "Filing Fees", date: "Mar 18, 2026", source: "IOLTA Trust ··7721", sourceIcon: "bank" },
    balanceInfo: { current: 1842, threshold: 1000, projected: 592 },
    assignableUsers: [
      { name: "Ryan Chen", role: "Managing Partner", initials: "RC" },
      { name: "Sarah Kim", role: "AP Manager", initials: "SK" },
      { name: "David Thompson", role: "Senior Bookkeeper", initials: "DT" },
    ],
  },
  {
    id: "c2",
    type: "bank_disconnect",
    priority: "high",
    timestamp: "just now",
    account: "operating",
    amount: "$8,420.00",
    status: "new",
    title: "Chase ··4892 connection expires in 5 days",
    subtitle: "Re-authenticate now to avoid interruption to your bank feed",
    evidenceRationale: "Plaid token for Chase ··4892 expires on Mar 23. Re-authenticate now to maintain uninterrupted syncing. If the connection lapses, queued transactions will stop importing.",
  },

  // HIGH
  {
    id: "h1",
    type: "anomaly_amount",
    priority: "high",
    timestamp: "25 min ago",
    account: "operating",
    amount: "$9,200.00",
    status: "new",
    title: "Thomson Legal Services charged $9,200 — usually ~$2,100",
    subtitle: "4x higher than usual, no matching invoice found",
    evidenceRationale: "Average payment to Thomson Legal Services over 14 prior transactions is $2,100. This $9,200 payment is 4.4x the historical mean. Category: Legal Consulting.",
    txnContext: { payee: "Thomson Legal Services", category: "Legal Consulting", date: "Mar 17, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "h2",
    type: "duplicate",
    priority: "high",
    timestamp: "5 hrs ago",
    account: "operating",
    amount: "$4,500.00",
    status: "new",
    title: "Two $4,500 deposits from John Smith on the same day",
    subtitle: "Could be a bank sync error or two separate payments",
    evidenceRationale: "Two deposits of $4,500 from John Smith posted on Mar 17, both via ACH. 78% confidence this is a duplicate. Could also be two legitimate separate payments.",
    txnContext: { payee: "John Smith", category: "Client Payment", date: "Mar 17, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "h3",
    type: "approval_required",
    priority: "high",
    timestamp: "1 hr ago",
    account: "operating",
    amount: "$7,500.00",
    status: "new",
    title: "$7,500 to Morrison Contractors",
    subtitle: "Over your $5,000 approval threshold — route to a partner",
    evidenceRationale: "Firm rule: Expenses over $5,000 require partner approval before posting. This $7,500 payment for Office Renovation triggered the rule. Category: Capital Expenditures.",
    txnContext: { payee: "Morrison Contractors", category: "Capital Expenditures", date: "Mar 17, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "h3b",
    type: "approval_required",
    priority: "high",
    timestamp: "2 hrs ago",
    account: "operating",
    amount: "$8,200.00",
    status: "new",
    title: "$8,200 to Thomson Legal Services",
    subtitle: "Over your $5,000 approval threshold — route to a partner",
    evidenceRationale: "Firm rule: Expenses over $5,000 require partner approval before posting. This $8,200 payment for Legal Consulting triggered the rule. Category: Legal Consulting.",
    txnContext: { payee: "Thomson Legal Services", category: "Legal Consulting", date: "Mar 16, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "h3c",
    type: "approval_required",
    priority: "high",
    timestamp: "3 hrs ago",
    account: "operating",
    amount: "$6,100.00",
    status: "new",
    title: "$6,100 to Pacific Legal Consulting",
    subtitle: "Over your $5,000 approval threshold — route to a partner",
    evidenceRationale: "Firm rule: Expenses over $5,000 require partner approval before posting. This $6,100 payment for Expert Witnesses triggered the rule. Category: Expert Witnesses.",
    txnContext: { payee: "Pacific Legal Consulting", category: "Expert Witnesses", date: "Mar 15, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "h4",
    type: "anomaly_amount",
    priority: "high",
    timestamp: "40 min ago",
    account: "operating",
    amount: "$4,800.00",
    status: "new",
    title: "Pacific Legal Consulting charged $4,800 — usually ~$1,500",
    subtitle: "3x higher than usual, no purchase order on file",
    evidenceRationale: "Average payment to Pacific Legal Consulting over 8 prior transactions is $1,500. This $4,800 payment is 3.2x the historical mean. Category: Expert Witnesses.",
    txnContext: { payee: "Pacific Legal Consulting", category: "Expert Witnesses", date: "Mar 17, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "h5",
    type: "anomaly_amount",
    priority: "high",
    timestamp: "1 hr ago",
    account: "operating",
    amount: "$7,200.00",
    status: "new",
    title: "Henderson & Associates charged $7,200 — usually ~$2,560",
    subtitle: "2.8x higher than usual, last payment was $2,400",
    evidenceRationale: "Average payment over 11 prior transactions is $2,560. This $7,200 is 2.8x the historical mean. Category: Consulting Fees. Last payment 45 days ago was $2,400.",
    txnContext: { payee: "Henderson & Associates", category: "Consulting Fees", date: "Mar 16, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },

  // MEDIUM
  {
    id: "m5",
    type: "hard_cost",
    priority: "critical",
    timestamp: "12 min ago",
    account: "operating",
    amount: "$125.00",
    status: "new",
    title: "$125 filing fee for Jane Doe — confirm and bill",
    subtitle: "King County Superior Court, parsed from email receipt",
    evidenceRationale: "Email receipt scanned from firm inbox. Parsed as Filing Fee. Matched to client Jane Doe based on matter activity this week (Doe v. Metroplex LLC). Receipt PDF attached.",
    sourceEmail: {
      sender: "King County Superior Court",
      subject: "Filing Fee Receipt — Case #2026-CV-04821",
      timestamp: "Mar 18, 2026 · 9:14 AM",
      attachmentName: "Filing_Receipt_04821.pdf",
      sourceIcon: "court",
    },
    txnContext: { payee: "King County Superior Court", category: "Filing Fees", date: "Mar 18, 2026", source: "Chase ··4892", sourceIcon: "bank" },
  },
  {
    id: "m1",
    type: "matching_gap",
    priority: "medium",
    timestamp: "18 min ago",
    account: "trust",
    amount: "$500.00",
    status: "new",
    title: "$500 deposit from 'Doe'",
    subtitle: "Could be Jane Doe or John Doe — both have $500 retainers due",
    evidenceRationale: "Bank description: 'DEPOSIT DOE 050126 RETAINER'. Two candidate Trust Retainer Requests of $500 dated within May 2026, belonging to different clients (Jane Doe, John Doe).",
    txnContext: { payee: "Doe (unknown)", category: "Trust Deposit", date: "Mar 17, 2026", source: "BOA ··7721", sourceIcon: "wire" },
  },
  {
    id: "m2",
    type: "partial_match",
    priority: "medium",
    timestamp: "32 min ago",
    account: "operating",
    amount: "$3,485.00",
    status: "new",
    title: "$3,485 from Robert Chen — close to two invoices totaling $3,500",
    subtitle: "$15 short, could be a bank processing fee",
    evidenceRationale: "Closest match: Invoice #401 ($2,300) + Invoice #402 ($1,200) = $3,500. Difference of $15 may be a processing fee. No single invoice matches this amount.",
    txnContext: { payee: "Robert Chen", category: "Client Payment", date: "Mar 16, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "m3",
    type: "blind_check",
    priority: "medium",
    timestamp: "1 hr ago",
    account: "operating",
    amount: "$1,500.00",
    status: "new",
    title: "$1,500 check deposit #402",
    subtitle: "No payee on record, doesn't match any open invoices",
    evidenceRationale: "No payee, vendor, or client information available. Amount does not match any outstanding invoices or expected payments within a 10% tolerance.",
    txnContext: { payee: "Unknown", category: "Unclassified", date: "Mar 16, 2026", source: "BOA ··7721", sourceIcon: "check" },
  },
  {
    id: "m4",
    type: "receipt_required",
    priority: "medium",
    timestamp: "45 min ago",
    account: "operating",
    amount: "$145.20",
    status: "new",
    title: "$145.20 United Airlines",
    subtitle: "Sarah Kim's Amex ··3847, over $100 receipt threshold",
    evidenceRationale: "Firm's $100 Receipt Rule triggered. Cardholder: Sarah Kim (Corporate Amex ··3847). Category auto-assigned: Travel & Transport. Matter: Williams IP Filing.",
    txnContext: { payee: "United Airlines", category: "Travel & Transport", date: "Mar 17, 2026", source: "Amex ··3847", sourceIcon: "card" },
  },
  {
    id: "m6",
    type: "hard_cost_multiline",
    priority: "medium",
    timestamp: "28 min ago",
    account: "operating",
    amount: "$1,250.00",
    status: "new",
    title: "ABC Depositions invoice — 12 items across 3 matters",
    subtitle: "Review how $1,250 splits between Chen, Doe, and Santos",
    evidenceRationale: "Vendor invoice PDF parsed via email ingestion. 12 line items: Chen v. StateFarm (6 items, $680), Doe v. Metroplex (4 items, $420), Santos Immigration (2 items, $150).",
    txnContext: { payee: "ABC Depositions Inc.", category: "Hard Cost", date: "Mar 16, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "m7",
    type: "first_time_vendor",
    priority: "medium",
    timestamp: "2 hrs ago",
    account: "operating",
    amount: "$350.00",
    status: "new",
    title: "First payment to Pacific Court Reporters — assign a category",
    subtitle: "Looks like court reporting, similar to ABC Depositions",
    evidenceRationale: "Vendor not found in vendor list. AI suggests category: Court Reporting / Deposition Services based on vendor name and merchant data. Similar existing vendor: ABC Depositions Inc. (different entity confirmed).",
    txnContext: { payee: "Pacific Court Reporters", category: "Uncategorized", date: "Mar 16, 2026", source: "Chase ··4892", sourceIcon: "ach" },
  },
  {
    id: "m8",
    type: "user_config_trigger",
    priority: "medium",
    timestamp: "3 hrs ago",
    account: "operating",
    amount: "$5,420.00",
    status: "new",
    title: "Software spend hit $5,420 this month — over your $5K limit",
    subtitle: "Latest: $320 to Clio Manage pushed it over",
    evidenceRationale: "March software subscription total: $5,420 (threshold: $5,000). Latest charge: $320 to Clio Manage pushed total over threshold. Prior month: $4,890.",
    txnContext: { payee: "Clio Manage", category: "Software & Subscriptions", date: "Mar 15, 2026", source: "Chase ··4892", sourceIcon: "card" },
  },
  {
    id: "m9",
    type: "receipt_required",
    priority: "medium",
    timestamp: "1 hr ago",
    account: "operating",
    amount: "$89.00",
    status: "new",
    title: "$89 Uber ride",
    subtitle: "James Westbrook's Visa ··7291, over $75 transport threshold",
    evidenceRationale: "Firm's receipt rule triggered (threshold lowered to $75 for Transport category). Cardholder: James Westbrook (Corporate Visa ··7291). Category auto-assigned: Transport.",
    txnContext: { payee: "Uber", category: "Transport", date: "Mar 17, 2026", source: "Visa ··7291", sourceIcon: "card" },
  },
  {
    id: "m10",
    type: "receipt_required",
    priority: "medium",
    timestamp: "2 hrs ago",
    account: "operating",
    amount: "$211.00",
    status: "new",
    title: "$211 Office Depot",
    subtitle: "Sarah Kim's Amex ··3847, no receipt after 48 hours",
    evidenceRationale: "Firm's $100 Receipt Rule triggered. Cardholder: Sarah Kim (Corporate Amex ··3847). Category auto-assigned: Office Supplies. No receipt attached after 48 hours.",
    txnContext: { payee: "Office Depot", category: "Office Supplies", date: "Mar 16, 2026", source: "Amex ··3847", sourceIcon: "card" },
  },

  // LOW
  {
    id: "l1",
    type: "stale_check",
    priority: "low",
    timestamp: "7 months old",
    account: "operating",
    amount: "$1,200.00",
    status: "new",
    title: "Henderson & Associates hasn't cashed check #902 in 7 months",
    subtitle: "Issued Aug 2025 — void, reissue, or keep waiting?",
    evidenceRationale: "Check #902 payable to Henderson & Associates was issued Aug 12, 2025. Not cleared after 210 days. State escheatment deadline: 365 days from issuance.",
    txnContext: { payee: "Henderson & Associates", category: "Outstanding Check", date: "Aug 12, 2025", source: "Chase ··4892", sourceIcon: "check" },
  },
  {
    id: "l2",
    type: "orphaned_trust",
    priority: "low",
    timestamp: "3 hrs ago",
    account: "trust",
    amount: "$2,500.00",
    status: "new",
    title: "$2,500 sitting in trust with no client linked",
    subtitle: "Assign a client so trust can reconcile",
    evidenceRationale: "This trust deposit has no client or matter assigned. The trust account can't fully reconcile until this entry is linked to a specific client sub-ledger.",
    txnContext: { payee: "Unknown client", category: "Trust Deposit", date: "Mar 15, 2026", source: "BOA ··7721", sourceIcon: "wire" },
  },
  {
    id: "recon-mar-1",
    type: "reconciliation_block",
    priority: "high",
    timestamp: "2 hrs ago",
    account: "operating",
    amount: "$195.00",
    status: "new",
    title: "Court Clerk — Circuit — Matter unassigned",
    subtitle: "Blocking March reconciliation (78%) · $195.00 filing fee needs a matter assigned",
    evidenceRationale: "This $195 filing fee from Court Clerk — Circuit has no matter assigned. March reconciliation is at 78% — this is 1 of 3 items blocking completion.",
    txnContext: { payee: "Court Clerk — Circuit", category: "Filing Fees", date: "Mar 12, 2026", source: "Chase ··4892", sourceIcon: "bank" },
    reconMonth: "mar",
  },
  {
    id: "recon-mar-2",
    type: "reconciliation_block",
    priority: "high",
    timestamp: "2 hrs ago",
    account: "operating",
    amount: "$87.43",
    status: "new",
    title: "Office Depot — Uncategorized",
    subtitle: "Blocking March reconciliation (78%) · $87.43 expense needs a category",
    evidenceRationale: "This $87.43 charge from Office Depot has no category. March reconciliation is at 78% — this is 1 of 3 items blocking completion.",
    txnContext: { payee: "Office Depot", category: "Uncategorized", date: "Mar 16, 2026", source: "Chase ··4892", sourceIcon: "bank" },
    reconMonth: "mar",
  },
  {
    id: "recon-mar-3",
    type: "reconciliation_block",
    priority: "high",
    timestamp: "2 hrs ago",
    account: "operating",
    amount: "$1,250.00",
    status: "new",
    title: "ABC Depositions Inc. — Multi-line review pending",
    subtitle: "Blocking March reconciliation (78%) · $1,250.00 charge needs line item review",
    evidenceRationale: "This $1,250 charge from ABC Depositions Inc. has multiple line items that need review. March reconciliation is at 78% — this is 1 of 3 items blocking completion.",
    txnContext: { payee: "ABC Depositions Inc.", category: "Depositions", date: "Mar 16, 2026", source: "Chase ··4892", sourceIcon: "bank" },
    reconMonth: "mar",
  },
  // ADDITIONAL CRITICAL
  {
    id: "trust-green",
    type: "trust_balance",
    priority: "critical",
    timestamp: "8 min ago",
    account: "trust",
    amount: "$2,800.00",
    status: "new",
    title: "Green Estate trust will fall to $340 — $660 below required floor",
    subtitle: "Assign to an associate to request a $660 replenishment from Green Family in Manage",
    evidenceRationale: "Pending disbursement of $2,800 to Green Estate heirs. Current trust balance: $3,140. After posting, balance falls to $340 — $660 below the firm's $1,000 minimum floor. Requires top-up or disbursement hold.",
    txnContext: { payee: "Green Estate Heirs", category: "Trust Disbursement", date: "Mar 18, 2026", source: "BOA ··7721", sourceIcon: "wire" },
    balanceInfo: { current: 3140, threshold: 1000, projected: 340 },
    assignableUsers: [
      { name: "Ryan Chen", role: "Managing Partner", initials: "RC" },
      { name: "Sarah Kim", role: "AP Manager", initials: "SK" },
    ],
  },
  {
    id: "trust-martinez",
    type: "trust_balance",
    priority: "critical",
    timestamp: "14 min ago",
    account: "trust",
    amount: "$5,500.00",
    status: "new",
    title: "Martinez Estate trust would go negative — disbursement exceeds balance",
    subtitle: "Assign to an associate to request a $1,250 replenishment from Martinez Family in Manage",
    evidenceRationale: "Scheduled $5,500 distribution to Martinez Estate beneficiaries. Current trust balance: $4,250. Posting this disbursement would leave a -$1,250 deficit — a direct trust accounting violation. Disbursement must be held pending additional funding.",
    txnContext: { payee: "Martinez Estate", category: "Trust Disbursement", date: "Mar 18, 2026", source: "BOA ··7721", sourceIcon: "wire" },
    balanceInfo: { current: 4250, threshold: 1000, projected: -1250 },
    assignableUsers: [
      { name: "Ryan Chen", role: "Managing Partner", initials: "RC" },
      { name: "Sarah Kim", role: "AP Manager", initials: "SK" },
      { name: "David Thompson", role: "Senior Bookkeeper", initials: "DT" },
    ],
  },
  {
    id: "anomaly-42k",
    type: "anomaly_amount",
    priority: "critical",
    timestamp: "3 hrs ago",
    account: "operating",
    amount: "$42,000.00",
    status: "new",
    title: "$42,000 wire to Meridian Consulting — no prior history",
    subtitle: "First-ever payment to this vendor, no invoice or contract on file",
    evidenceRationale: "Wire transfer of $42,000 to Meridian Consulting LLC. This vendor has never been paid before, no vendor record exists, and no invoice or contract is on file. Amount is 5× your average operating wire. Flagged for partner sign-off.",
    txnContext: { payee: "Meridian Consulting LLC", category: "Legal Consulting", date: "Mar 17, 2026", source: "Chase ··4892", sourceIcon: "wire" },
  },
  {
    id: "bulk-court",
    type: "reconciliation_block",
    priority: "high",
    timestamp: "1 hr ago",
    account: "operating",
    amount: "$4,280.00",
    status: "new",
    title: "14 filing fees have no matter assigned",
    subtitle: "Blocking March reconciliation — bulk assign to close",
    evidenceRationale: "14 filing fees totalling $4,280 were auto-categorized but no matter could be determined for any of them. March reconciliation cannot close until these are assigned. Use bulk assignment to resolve in one pass.",
    txnContext: { payee: "Multiple Courts", category: "Filing Fees", date: "Mar 1–17, 2026", source: "Amex ··1247", sourceIcon: "card" },
    reconMonth: "mar",
  },

  {
    id: "recon-imbalance-1",
    type: "recon_imbalance",
    priority: "high",
    timestamp: "just now",
    account: "operating",
    amount: "$2,858.19",
    status: "new",
    title: "Feb operating recon blocked — Check #847 cleared but not recorded",
    subtitle: "Check #847 to Henderson & Associates ($2,858.19) cleared Feb 14 but was never recorded as an expense",
    evidenceRationale: "We automatically downloaded your Chase ··4892 February statement and cross-referenced all 312 transactions. 311 matched perfectly. Check #847, issued Jan 28 to Henderson & Associates for $2,858.19, cleared on Feb 14 but has no corresponding expense entry in your books. We recommend recording it as a Consulting Fees expense to complete reconciliation.",
    txnContext: { payee: "Henderson & Associates", category: "Consulting Fees", date: "Feb 14, 2026", source: "Chase ··4892", sourceIcon: "check" },
    reconMonth: "feb",
  },
  {
    id: "l4",
    type: "stale_check",
    priority: "low",
    timestamp: "6 months old",
    account: "operating",
    amount: "$1,450.00",
    status: "new",
    title: "Smith & Partners hasn't cashed check #887 in 6 months",
    subtitle: "Issued Sep 2025 — void, reissue, or keep waiting?",
    evidenceRationale: "Check #887 payable to Smith & Partners was issued Sep 3, 2025. Not cleared after 195 days. State escheatment deadline: 365 days from issuance.",
    txnContext: { payee: "Smith & Partners", category: "Outstanding Check", date: "Sep 3, 2025", source: "Chase ··4892", sourceIcon: "check" },
  },
  {
    id: "l5",
    type: "stale_check",
    priority: "low",
    timestamp: "6 months old",
    account: "operating",
    amount: "$1,000.00",
    status: "new",
    title: "Metro Court Reporters hasn't cashed check #901 in 6 months",
    subtitle: "Issued Sep 2025 — void, reissue, or keep waiting?",
    evidenceRationale: "Check #901 payable to Metro Court Reporters was issued Sep 15, 2025. Not cleared after 185 days. State escheatment deadline: 365 days from issuance.",
    txnContext: { payee: "Metro Court Reporters", category: "Outstanding Check", date: "Sep 15, 2025", source: "Chase ··4892", sourceIcon: "check" },
  },
];
