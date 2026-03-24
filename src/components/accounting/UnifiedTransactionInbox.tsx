import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  AlertTriangle,
  CircleAlert,
  HelpCircle,
  Link2Off,
  Shield,
  Check,
  Search,
  Edit3,
  Clock,
  Sparkles,
  ExternalLink,
  Layers,
  Zap,
  CheckCircle2,
  X,
  ChevronDown,
  ArrowUpRight,
  RefreshCcw,
  DollarSign,
  Pencil,
  Lock,
  Link2,
  FileText,
  User,
  Briefcase,
  ArrowRightLeft,
  Building2,
  CheckCheck,
  Flag,
  WifiOff,
  Landmark,
  Mail,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";
import { motion, AnimatePresence } from "motion/react";
import type { ActionCardData } from "./ActionQueueTypes";
import { mockActionCards, priorityConfig, cardTypeConfig } from "./ActionQueueTypes";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type Severity = "critical" | "bulk" | "ambiguity";

interface ActionItem {
  id: string;
  severity: Severity;
  title: string;
  subtitle: string;
  amount?: string;
  matter?: string;
  timestamp: string;
  count?: number;
}

interface ChoiceCard {
  id: string;
  label: string;
  detail: string;
  matter: string;
  date: string;
  amount: string;
  confidence: number;
  bankString: string;
  invoiceRef: string;
}

type TransactionSource = "bank_feed" | "manage" | "adp" | "email";

interface LedgerRow {
  id: string;
  date: string;
  payee: string;
  category: string;
  matter: string;
  client: string;
  amount: number;
  type: "debit" | "credit";
  status: "auto" | "manual" | "pending" | "billed";
  method: string;
  agentRationale: string;
  confidence: number;
  billable?: boolean;
  billedDate?: string;
  billingPaid?: boolean;
  bankAccount?: string;
  source?: TransactionSource;
  flag?: ActionCardData;
}

const SOURCE_CONFIG: Record<TransactionSource, { label: string; Icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  bank_feed: { label: "Bank feed", Icon: Landmark, color: "#1D4ED8", bg: "#EFF6FF" },
  manage:    { label: "Manage",    Icon: Briefcase, color: "#6D28D9", bg: "#F5F3FF" },
  adp:       { label: "ADP",       Icon: Users,     color: "#065F46", bg: "#ECFDF5" },
  email:     { label: "Email",     Icon: Mail,      color: "#9A3412", bg: "#FFF7ED" },
};

const BANK_ACCOUNTS = [
  { key: "all", label: "All accounts" },
  { key: "chase-4892", label: "Chase ··4892 (Operating)" },
  { key: "amex-1247", label: "Amex ··1247 (Card)" },
  { key: "boa-7721", label: "BOA ··7721 (IOLTA)" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

const actionQueue: ActionItem[] = [
  {
    id: "a1",
    severity: "critical",
    title: "Negative Trust Risk — Matter #2024-0123",
    subtitle: "Unbilled billable cost will breach retainer floor",
    amount: "$3,400.00",
    matter: "Greenfield v. Apex Corp",
    timestamp: "2 min ago",
  },
  {
    id: "a5",
    severity: "bulk",
    title: "12 Court Fees need Matter assignment",
    subtitle: "Filing fees auto-categorized but unassigned to matters",
    amount: "$2,340.00",
    timestamp: "34 min ago",
    count: 12,
  },
  {
    id: "a2",
    severity: "ambiguity",
    title: "$500 Deposit — Doe",
    subtitle: "2 potential matches found",
    amount: "$500.00",
    matter: "Pending Match",
    timestamp: "18 min ago",
  },
];

const choiceCards: ChoiceCard[] = [
  {
    id: "c1",
    label: "Jane Doe",
    detail: "Retainer Request #108",
    matter: "Doe v. Metroplex LLC",
    date: "May 14, 2026",
    amount: "$500.00",
    confidence: 87,
    bankString: "DEPOSIT DOE 050126 RETAINER",
    invoiceRef: "INV-2026-0108",
  },
  {
    id: "c2",
    label: "John Doe",
    detail: "Unbilled Hard Cost #001",
    matter: "Doe Family Trust",
    date: "Jun 2, 2026",
    amount: "$500.00",
    confidence: 72,
    bankString: "DEPOSIT DOE 060226 TRUST",
    invoiceRef: "HC-2026-0001",
  },
];

const METHOD_TO_BANK: Record<string, string> = { Wire: "chase-4892", ACH: "chase-4892", Card: "amex-1247", Check: "boa-7721" };
const BANK_LABELS: Record<string, string> = { "chase-4892": "Chase ··4892", "amex-1247": "Amex ··1247", "boa-7721": "BOA ··7721" };

const ledgerData: LedgerRow[] = [
  { id: "l1",  date: "Mar 17", payee: "LexisNexis",             category: "Research Subscriptions", matter: "Overhead",             client: "—",              amount: -349.00,  type: "debit",  status: "auto",   method: "ACH",   agentRationale: "Recurring vendor pattern matched from 14 prior transactions. Category assigned with 99.2% confidence.", confidence: 99,  bankAccount: "chase-4892", source: "bank_feed" },
  { id: "l2",  date: "Mar 17", payee: "Jane Doe",               category: "Trust Deposit",           matter: "Doe v. Metroplex",     client: "Jane Doe",       amount:  500.00,  type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Retainer Request #108. Deposited to IOLTA trust sub-ledger.", confidence: 100, bankAccount: "boa-7721",   source: "manage" },
  { id: "l3",  date: "Mar 16", payee: "Westlaw",                category: "Research Subscriptions", matter: "Overhead",             client: "—",              amount: -215.00,  type: "debit",  status: "auto",   method: "ACH",   agentRationale: "Matched via vendor name + recurring amount pattern. Confirmed by 11 historical matches.", confidence: 98,  bankAccount: "chase-4892", source: "bank_feed" },
  { id: "l16", date: "Mar 16", payee: "Court Clerk — District", category: "Filing Fees",             matter: "Williams IP Filing",   client: "D. Williams",    amount: -350.00,  type: "debit",  status: "manual", method: "Card",  agentRationale: "Applied Firm Rule: Court Fees → Filing Fees. Matter assigned from calendar event.", confidence: 82,  bankAccount: "amex-1247",  source: "manage" },
  { id: "l4",  date: "Mar 16", payee: "Office Depot",           category: "Office Supplies",         matter: "Overhead",             client: "—",              amount:  -87.43,  type: "debit",  status: "auto",   method: "Card",  agentRationale: "Vendor identified via merchant category code (MCC 5943). Amount within normal range.", confidence: 96,  bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "l17", date: "Mar 16", payee: "ABC Depositions Inc.",   category: "Hard Cost",               matter: "Chen v. StateFarm",    client: "Robert Chen",    amount: -1250.00, type: "debit",  status: "auto",   method: "ACH",   agentRationale: "Matched via vendor category. Billable hard cost — deposition services for active litigation.", confidence: 95,  bankAccount: "chase-4892", source: "email",     billable: true, flag: { id: "hc-l17", type: "hard_cost", priority: "critical", timestamp: "2 hrs ago", account: "operating", amount: "$1,250.00", status: "new", title: "ABC Depositions Inc. — confirm hard cost", subtitle: "Deposition services for Chen v. StateFarm. Billable to Robert Chen.", evidenceRationale: "Email invoice parsed: ABC Depositions Inc., INV-2026-0341, $1,250.00. Matched to Chen v. StateFarm via matter activity. Confirm this hard cost before the billing agent can add it to the client invoice." } },
  { id: "l5",  date: "Mar 16", payee: "Panda Express",          category: "Meals & Entertainment",   matter: "Johnson Estate #445",  client: "T. Johnson",     amount: -120.00,  type: "debit",  status: "manual", method: "Card",  agentRationale: "Flagged: Missing receipt. Firm policy requires documentation for expenses > $100.", confidence: 91,  bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "l6",  date: "Mar 15", payee: "Robert Chen",            category: "Client Payment",           matter: "Chen v. StateFarm",    client: "Robert Chen",    amount:  7500.00, type: "credit", status: "auto",   method: "Check", agentRationale: "Matched to Invoice #2024-0892. Payment amount exactly matches outstanding balance.", confidence: 100, bankAccount: "boa-7721",   source: "manage" },
  { id: "l18", date: "Mar 15", payee: "Court Clerk — Federal",  category: "Filing Fees",             matter: "Greenfield v. Apex",   client: "Greenfield LLC", amount: -455.00,  type: "debit",  status: "manual", method: "Card",  agentRationale: "Applied Firm Rule: Court Fees → Filing Fees. Federal filing fee schedule matched.", confidence: 78,  bankAccount: "amex-1247",  source: "manage" },
  { id: "l7",  date: "Mar 15", payee: "FedEx",                  category: "Postage & Delivery",      matter: "Greenfield v. Apex",   client: "Greenfield LLC", amount:  -42.17,  type: "debit",  status: "auto",   method: "Card",  agentRationale: "Vendor matched. Matter assigned via tracking number cross-reference with case filing.", confidence: 94,  bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "l8",  date: "Mar 15", payee: "Sarah Mitchell",         category: "Retainer Deposit",        matter: "Mitchell Divorce",     client: "Sarah Mitchell", amount:  3000.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Retainer Request #112. Deposited to IOLTA trust sub-ledger.", confidence: 100, bankAccount: "boa-7721",   source: "manage" },
  { id: "l19", date: "Mar 14", payee: "Expert Witness Group",   category: "Hard Cost",               matter: "Doe v. Metroplex",     client: "Jane Doe",       amount: -2800.00, type: "debit",  status: "billed",  method: "Check", agentRationale: "Vendor matched. Billable expert witness fee for active matter. Invoice #EWG-4421.", confidence: 97,  bankAccount: "boa-7721",   source: "email",     billable: true, billedDate: "Mar 15", billingPaid: false },
  { id: "l9",  date: "Mar 14", payee: "Amazon Web Services",    category: "Technology",               matter: "Overhead",             client: "—",              amount: -156.80,  type: "debit",  status: "auto",   method: "ACH",   agentRationale: "Recurring charge matched. Variance of +$3.20 from last month flagged but within 5% tolerance.", confidence: 95,  bankAccount: "chase-4892", source: "bank_feed" },
  { id: "l10", date: "Mar 14", payee: "Uber",                   category: "Travel & Transport",      matter: "Williams IP Filing",   client: "D. Williams",    amount:  -34.50,  type: "debit",  status: "auto",   method: "Card",  agentRationale: "Merchant matched. Matter assigned from calendar event: 'Williams courthouse filing 3/14'.", confidence: 88,  bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "l20", date: "Mar 14", payee: "Process Server LLC",     category: "Hard Cost",               matter: "Santos Immigration",   client: "Maria Santos",   amount: -175.00,  type: "debit",  status: "billed",  method: "Card",  agentRationale: "Applied Firm Rule: Process serving fees → Hard Cost. Billable to client.", confidence: 85,  bankAccount: "amex-1247",  source: "email",     billable: true, billedDate: "Mar 15", billingPaid: true },
  { id: "l11", date: "Mar 14", payee: "Maria Santos",           category: "Client Payment",           matter: "Santos Immigration",   client: "Maria Santos",   amount:  2250.00, type: "credit", status: "manual", method: "Check", agentRationale: "Partial payment matched to Invoice #2024-0901. Remaining balance: $750.00.", confidence: 97,  bankAccount: "boa-7721",   source: "manage" },
  { id: "l12", date: "Mar 13", payee: "Staples",                category: "Office Supplies",         matter: "Overhead",             client: "—",              amount:  -63.28,  type: "debit",  status: "auto",   method: "Card",  agentRationale: "Vendor matched via MCC. Below $100 threshold — no receipt required.", confidence: 97,  bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "l21", date: "Mar 13", payee: "Court Clerk — County",   category: "Filing Fees",             matter: "Torres Custody",       client: "Michael Torres", amount: -125.00,  type: "debit",  status: "manual", method: "Card",  agentRationale: "Applied Firm Rule: Court Fees → Filing Fees. County family court fee schedule.", confidence: 80,  bankAccount: "amex-1247",  source: "manage" },
  { id: "l13", date: "Mar 13", payee: "Delta Airlines",         category: "Travel & Transport",      matter: "Williams IP Filing",   client: "D. Williams",    amount: -487.00,  type: "debit",  status: "auto",   method: "Card",  agentRationale: "Merchant matched. Matter inferred from travel policy pre-approval #TP-2026-034.", confidence: 93,  bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "l14", date: "Mar 12", payee: "Court Clerk — Circuit",  category: "Filing Fees",             matter: "Unassigned",           client: "—",              amount: -195.00,  type: "debit",  status: "pending", method: "Card", agentRationale: "Category matched. Matter could not be determined — added to Bulk Assignment queue.", confidence: 60,  bankAccount: "amex-1247",  source: "manage" },
  { id: "l15", date: "Mar 12", payee: "Michael Torres",         category: "Client Payment",           matter: "Torres Custody",       client: "Michael Torres", amount:  1800.00, type: "credit", status: "auto",   method: "ACH",   agentRationale: "Matched to Invoice #2024-0915. Full payment received.", confidence: 100, bankAccount: "chase-4892", source: "manage" },

  // === PAYROLL (ADP) — 2 bi-weekly runs ===
  { id: "adp1a", date: "Mar 3",  payee: "ADP Payroll — Partners",    category: "Payroll",                 matter: "Overhead", client: "—", amount: -95000.00, type: "debit", status: "auto", method: "ACH", agentRationale: "Bi-weekly payroll batch — 15 equity partners. ADP direct deposit run #1.",            confidence: 100, bankAccount: "chase-4892", source: "adp" },
  { id: "adp1b", date: "Mar 3",  payee: "ADP Payroll — Associates",  category: "Payroll",                 matter: "Overhead", client: "—", amount: -148500.00, type: "debit", status: "auto", method: "ACH", agentRationale: "Bi-weekly payroll batch — 25 associates. ADP direct deposit run #1.",           confidence: 100, bankAccount: "chase-4892", source: "adp" },
  { id: "adp1c", date: "Mar 3",  payee: "ADP Payroll — Admin Staff", category: "Payroll",                 matter: "Overhead", client: "—", amount: -42000.00,  type: "debit", status: "auto", method: "ACH", agentRationale: "Bi-weekly payroll batch — 10 admin & support staff. ADP direct deposit run #1.", confidence: 100, bankAccount: "chase-4892", source: "adp" },
  { id: "adp2a", date: "Mar 17", payee: "ADP Payroll — Partners",    category: "Payroll",                 matter: "Overhead", client: "—", amount: -95000.00, type: "debit", status: "auto", method: "ACH", agentRationale: "Bi-weekly payroll batch — 15 equity partners. ADP direct deposit run #2.",            confidence: 100, bankAccount: "chase-4892", source: "adp" },
  { id: "adp2b", date: "Mar 17", payee: "ADP Payroll — Associates",  category: "Payroll",                 matter: "Overhead", client: "—", amount: -148500.00, type: "debit", status: "auto", method: "ACH", agentRationale: "Bi-weekly payroll batch — 25 associates. ADP direct deposit run #2.",           confidence: 100, bankAccount: "chase-4892", source: "adp" },
  { id: "adp2c", date: "Mar 17", payee: "ADP Payroll — Admin Staff", category: "Payroll",                 matter: "Overhead", client: "—", amount: -42000.00,  type: "debit", status: "auto", method: "ACH", agentRationale: "Bi-weekly payroll batch — 10 admin & support staff. ADP direct deposit run #2.", confidence: 100, bankAccount: "chase-4892", source: "adp" },

  // === RENT & OVERHEAD ===
  { id: "oh1", date: "Mar 1",  payee: "1200 Broadway Partners LLC", category: "Rent",                     matter: "Overhead", client: "—", amount: -18750.00, type: "debit", status: "auto", method: "ACH",  agentRationale: "Recurring monthly rent. Amount matches lease agreement on file.",                           confidence: 100, bankAccount: "chase-4892", source: "bank_feed" },
  { id: "oh2", date: "Mar 1",  payee: "Clio Manage",                category: "Software & Subscriptions", matter: "Overhead", client: "—", amount: -320.00,   type: "debit", status: "auto", method: "Card", agentRationale: "Monthly Clio platform fee. Recurring vendor — auto-matched from prior invoices.",          confidence: 100, bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "oh3", date: "Mar 2",  payee: "Zoom Communications",        category: "Software & Subscriptions", matter: "Overhead", client: "—", amount:  -45.00,   type: "debit", status: "auto", method: "Card", agentRationale: "Monthly Zoom Pro subscription. Recurring charge matched.",                              confidence: 100, bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "oh4", date: "Mar 2",  payee: "Microsoft 365",              category: "Software & Subscriptions", matter: "Overhead", client: "—", amount: -189.00,   type: "debit", status: "auto", method: "Card", agentRationale: "Monthly Microsoft 365 Business Premium — 12-seat plan. Recurring charge matched.",      confidence: 100, bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "oh5", date: "Mar 3",  payee: "Comcast Business",           category: "Utilities",                matter: "Overhead", client: "—", amount: -214.00,   type: "debit", status: "auto", method: "ACH",  agentRationale: "Monthly internet & phone bill. Recurring ACH matched by vendor + amount tolerance.",      confidence: 98,  bankAccount: "chase-4892", source: "bank_feed" },
  { id: "oh6", date: "Mar 3",  payee: "State Farm Insurance",       category: "Insurance",                matter: "Overhead", client: "—", amount: -1250.00,  type: "debit", status: "auto", method: "ACH",  agentRationale: "Monthly professional liability insurance premium. Recurring vendor match.",                confidence: 100, bankAccount: "chase-4892", source: "bank_feed" },
  { id: "oh7", date: "Mar 4",  payee: "Iron Mountain",              category: "Records Management",       matter: "Overhead", client: "—", amount: -340.00,   type: "debit", status: "auto", method: "ACH",  agentRationale: "Monthly records storage & shredding fee. Recurring ACH matched.",                         confidence: 99,  bankAccount: "chase-4892", source: "bank_feed" },
  { id: "oh8", date: "Mar 5",  payee: "Pitney Bowes",               category: "Postage & Delivery",       matter: "Overhead", client: "—", amount:  -78.50,   type: "debit", status: "auto", method: "Card", agentRationale: "Postage meter lease & supplies. Recurring charge matched.",                             confidence: 100, bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "oh9", date: "Mar 7",  payee: "Paychex — Processing Fee",   category: "Payroll Fees",             matter: "Overhead", client: "—", amount: -125.00,   type: "debit", status: "auto", method: "ACH",  agentRationale: "ADP/Paychex monthly service fee. Payroll processor administrative charge.",               confidence: 100, bankAccount: "chase-4892", source: "adp" },
  { id: "oh10", date: "Mar 8", payee: "Westlaw — Additional Seats", category: "Research Subscriptions",   matter: "Overhead", client: "—", amount: -450.00,   type: "debit", status: "auto", method: "ACH",  agentRationale: "3 additional Westlaw research seats added in March. Prorated charge matched to invoice.",  confidence: 97,  bankAccount: "chase-4892", source: "bank_feed" },
  { id: "oh11", date: "Mar 10", payee: "DocuSign",                  category: "Software & Subscriptions", matter: "Overhead", client: "—", amount:  -89.00,   type: "debit", status: "auto", method: "Card", agentRationale: "Monthly DocuSign Business Pro plan. Recurring charge matched.",                        confidence: 100, bankAccount: "amex-1247",  source: "bank_feed" },
  { id: "oh12", date: "Mar 12", payee: "Konica Minolta — Copier",   category: "Equipment Lease",          matter: "Overhead", client: "—", amount: -425.00,   type: "debit", status: "auto", method: "ACH",  agentRationale: "Monthly copier lease payment. Recurring ACH matched.",                                   confidence: 100, bankAccount: "chase-4892", source: "bank_feed" },

  // === CLIENT PAYMENTS ===
  { id: "cp1",  date: "Mar 2",  payee: "Greenfield LLC",        category: "Client Payment", matter: "Greenfield v. Apex",      client: "Greenfield LLC",    amount:  18500.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Invoice #2026-0041. Full settlement payment for Greenfield v. Apex.",              confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp2",  date: "Mar 3",  payee: "Thompson Corp",         category: "Client Payment", matter: "Thompson M&A Advisory",  client: "Thompson Corp",     amount:   3200.00, type: "credit", status: "auto",   method: "ACH",   agentRationale: "Matched to Invoice #2026-0043. Partial payment, $800 balance outstanding.",                  confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp3",  date: "Mar 4",  payee: "Williams Enterprises",  category: "Client Payment", matter: "Williams IP Filing",     client: "D. Williams",       amount:   8750.00, type: "credit", status: "auto",   method: "Check", agentRationale: "Matched to Invoice #2026-0038. Full payment received.",                                     confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp4",  date: "Mar 5",  payee: "Patel Family Trust",    category: "Client Payment", matter: "Patel Estate Planning",  client: "Patel Family",      amount:  12000.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Invoice #2026-0036. Estate planning retainer drawdown.",                         confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp5",  date: "Mar 6",  payee: "Kim Industries",        category: "Client Payment", matter: "Kim v. Pacific Rim",     client: "Kim Industries",    amount:   6800.00, type: "credit", status: "auto",   method: "ACH",   agentRationale: "Matched to Invoice #2026-0044. Monthly billing cycle payment.",                             confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp6",  date: "Mar 7",  payee: "Anderson LLC",          category: "Client Payment", matter: "Anderson Contract Rev.",  client: "Anderson LLC",      amount:   4250.00, type: "credit", status: "auto",   method: "Check", agentRationale: "Matched to Invoice #2026-0040. Contract review flat fee.",                                  confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp7",  date: "Mar 8",  payee: "Nelson & Sons",         category: "Client Payment", matter: "Nelson Litigation",      client: "Nelson & Sons",     amount:  22500.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Invoice #2026-0029. Litigation services — partial billing.",                     confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp8",  date: "Mar 9",  payee: "Clark Partners",        category: "Client Payment", matter: "Clark Merger Due Dil.",   client: "Clark Partners",    amount:   3750.00, type: "credit", status: "auto",   method: "ACH",   agentRationale: "Matched to Invoice #2026-0047. Due diligence engagement.",                                  confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp9",  date: "Mar 10", payee: "Baker Trust Co",        category: "Client Payment", matter: "Baker Estate Admin.",     client: "Baker Trust Co",    amount:  15000.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Invoice #2026-0031. Estate administration services.",                            confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp10", date: "Mar 11", payee: "Rivera Holdings",       category: "Client Payment", matter: "Rivera Employment Law",   client: "Rivera Holdings",   amount:   2100.00, type: "credit", status: "auto",   method: "Check", agentRationale: "Matched to Invoice #2026-0050. Employment consultation.",                                  confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp11", date: "Mar 12", payee: "Cooper Family",         category: "Client Payment", matter: "Cooper Divorce Proc.",    client: "Cooper Family",     amount:   9200.00, type: "credit", status: "auto",   method: "ACH",   agentRationale: "Matched to Invoice #2026-0033. Divorce proceedings monthly billing.",                       confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp12", date: "Mar 13", payee: "Hayes Group",           category: "Client Payment", matter: "Hayes IP Licensing",     client: "Hayes Group",       amount:   4800.00, type: "credit", status: "auto",   method: "Check", agentRationale: "Matched to Invoice #2026-0051. IP licensing negotiation.",                                  confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp13", date: "Mar 14", payee: "Chen Holdings",         category: "Client Payment", matter: "Chen v. StateFarm",      client: "Robert Chen",       amount:  11200.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Invoice #2026-0028. Insurance litigation services.",                             confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp14", date: "Mar 15", payee: "Martinez Holdings",     category: "Client Payment", matter: "Martinez Estate Admin.", client: "Martinez Family",   amount:   7500.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Invoice #2026-0034. Estate administration monthly billing.",                     confidence: 100, bankAccount: "chase-4892", source: "manage" },
  { id: "cp15", date: "Mar 17", payee: "Whitfield & Co",        category: "Client Payment", matter: "Whitfield Corporate",    client: "Whitfield & Co",    amount:   5500.00, type: "credit", status: "auto",   method: "ACH",   agentRationale: "Matched to Invoice #2026-0053. Corporate governance services.",                             confidence: 100, bankAccount: "chase-4892", source: "manage" },

  // === TRUST / RETAINER DEPOSITS (IOLTA) ===
  { id: "tr1", date: "Mar 2",  payee: "Whitfield & Co",         category: "Retainer Deposit", matter: "Whitfield Corporate",    client: "Whitfield & Co",  amount:  7500.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Retainer Request #201. Deposited to IOLTA trust sub-ledger.",   confidence: 100, bankAccount: "boa-7721", source: "manage" },
  { id: "tr2", date: "Mar 3",  payee: "Patel Family Trust",     category: "Retainer Deposit", matter: "Patel Estate Planning",  client: "Patel Family",    amount:  5000.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Retainer Request #202. Deposited to IOLTA trust sub-ledger.",   confidence: 100, bankAccount: "boa-7721", source: "manage" },
  { id: "tr3", date: "Mar 5",  payee: "Kim Industries",         category: "Retainer Deposit", matter: "Kim v. Pacific Rim",     client: "Kim Industries",  amount:  4000.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Retainer Request #203. Deposited to IOLTA trust sub-ledger.",   confidence: 100, bankAccount: "boa-7721", source: "manage" },
  { id: "tr4", date: "Mar 7",  payee: "Green Estate",           category: "Trust Deposit",    matter: "Green Estate Admin.",    client: "Green Family",    amount:  3140.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Trust Deposit #T-2026-041. IOLTA trust sub-ledger for Green Estate administration.", confidence: 100, bankAccount: "boa-7721", source: "manage" },
  { id: "tr5", date: "Mar 8",  payee: "Anderson LLC",           category: "Retainer Deposit", matter: "Anderson Contract Rev.", client: "Anderson LLC",    amount:  2500.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Retainer Request #204. Deposited to IOLTA trust sub-ledger.",   confidence: 100, bankAccount: "boa-7721", source: "manage" },
  { id: "tr6", date: "Mar 9",  payee: "Nelson J.",              category: "Retainer Deposit", matter: "Nelson Litigation",      client: "Nelson & Sons",   amount:  8000.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Retainer Request #205. Deposited to IOLTA trust sub-ledger.",   confidence: 100, bankAccount: "boa-7721", source: "manage" },
  { id: "tr7", date: "Mar 11", payee: "Clark Partners",         category: "Retainer Deposit", matter: "Clark Merger Due Dil.",  client: "Clark Partners",  amount:  3500.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Retainer Request #206. Deposited to IOLTA trust sub-ledger.",   confidence: 100, bankAccount: "boa-7721", source: "manage" },
  { id: "tr8", date: "Mar 12", payee: "Rivera Holdings",        category: "Trust Deposit",    matter: "Rivera Employment Law",  client: "Rivera Holdings", amount:  2000.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Trust Deposit #T-2026-044. IOLTA trust sub-ledger.",            confidence: 100, bankAccount: "boa-7721", source: "manage" },
  { id: "tr9", date: "Mar 14", payee: "Martinez Estate",        category: "Trust Deposit",    matter: "Martinez Estate Admin.", client: "Martinez Family", amount:  4250.00, type: "credit", status: "auto",   method: "Wire",  agentRationale: "Matched to Trust Deposit #T-2026-046. IOLTA trust sub-ledger for Martinez Estate administration.", confidence: 100, bankAccount: "boa-7721", source: "manage" },

  // === ADDITIONAL FILING FEES ===
  { id: "ff1", date: "Mar 2",  payee: "Court Clerk — Probate",    category: "Filing Fees", matter: "Green Estate Admin.",    client: "Green Family",       amount: -275.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Applied Firm Rule: Probate filing → Filing Fees. Probate court fee schedule.", confidence: 94, bankAccount: "amex-1247", source: "manage" },
  { id: "ff2", date: "Mar 4",  payee: "USPTO",                     category: "Filing Fees", matter: "Williams IP Filing",     client: "D. Williams",        amount: -520.00, type: "debit", status: "auto",   method: "Card", agentRationale: "USPTO patent application fee. Matched to Williams IP Filing matter.",         confidence: 97, bankAccount: "amex-1247", source: "manage", billable: true },
  { id: "ff3", date: "Mar 5",  payee: "Court Clerk — Bankruptcy",  category: "Filing Fees", matter: "Patel Estate Planning",  client: "Patel Family",       amount: -335.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Applied Firm Rule: Bankruptcy filing → Filing Fees. Court fee schedule.",     confidence: 91, bankAccount: "amex-1247", source: "manage" },
  { id: "ff4", date: "Mar 7",  payee: "Court Clerk — Immigration", category: "Filing Fees", matter: "Santos Immigration",     client: "Maria Santos",       amount: -480.00, type: "debit", status: "auto",   method: "Card", agentRationale: "USCIS filing fee. Matched to Santos Immigration matter.",                     confidence: 95, bankAccount: "amex-1247", source: "manage", billable: true },
  { id: "ff5", date: "Mar 10", payee: "Court Clerk — Appellate",   category: "Filing Fees", matter: "Greenfield v. Apex",     client: "Greenfield LLC",     amount: -310.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Applied Firm Rule: Appellate filing → Filing Fees. Appellate fee schedule.", confidence: 93, bankAccount: "amex-1247", source: "manage", billable: true },
  { id: "ff6", date: "Mar 11", payee: "IRS — Filing Fee",          category: "Filing Fees", matter: "Baker Estate Admin.",    client: "Baker Trust Co",     amount: -215.00, type: "debit", status: "auto",   method: "Check", agentRationale: "IRS estate tax filing fee. Matched to Baker Estate administration matter.", confidence: 96, bankAccount: "boa-7721",  source: "manage", billable: true },

  // === HARD COSTS / EXPERT WITNESSES ===
  { id: "hc1", date: "Mar 2",  payee: "Rosen Medical Experts",     category: "Hard Cost", matter: "Chen v. StateFarm",  client: "Robert Chen",    amount: -3500.00,  type: "debit", status: "billed",  method: "Check", agentRationale: "Expert witness retainer. Matched to email invoice from Rosen Medical. Billable to client.",   confidence: 97, bankAccount: "boa-7721",   source: "email", billable: true, billedDate: "Mar 4",  billingPaid: true },
  { id: "hc2", date: "Mar 5",  payee: "Pacific Transcription Svcs",category: "Hard Cost", matter: "Greenfield v. Apex", client: "Greenfield LLC", amount: -485.00,   type: "debit", status: "billed",  method: "ACH",   agentRationale: "Deposition transcript services. Matched to invoice #PCT-2026-089. Billable to client.",        confidence: 95, bankAccount: "chase-4892", source: "email", billable: true, billedDate: "Mar 7",  billingPaid: true },
  { id: "hc3", date: "Mar 8",  payee: "Global Investigations LLC", category: "Hard Cost", matter: "Nelson Litigation",  client: "Nelson & Sons",  amount: -1800.00,  type: "debit", status: "billed",  method: "Check", agentRationale: "Investigation services invoice. Matched to email from Global Investigations. Billable.",    confidence: 93, bankAccount: "chase-4892", source: "email", billable: true, billedDate: "Mar 10", billingPaid: true },
  { id: "hc4", date: "Mar 11", payee: "Digital Forensics Inc",     category: "Hard Cost", matter: "Cooper Divorce Proc.",client: "Cooper Family",  amount: -2250.00,  type: "debit", status: "billed",  method: "ACH",   agentRationale: "Digital forensics services invoice. Matched to email #DFI-4892. Billable to client.",        confidence: 96, bankAccount: "chase-4892", source: "email", billable: true, billedDate: "Mar 13", billingPaid: false },

  // === TRAVEL & TRANSPORT ===
  { id: "tv1", date: "Mar 4",  payee: "Southwest Airlines", category: "Travel & Transport", matter: "Nelson Litigation",   client: "Nelson & Sons",  amount: -248.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Flight matched. Travel to Chicago for deposition. Pre-approved travel #TP-2026-041.", confidence: 93, bankAccount: "amex-1247", source: "bank_feed", billable: true },
  { id: "tv2", date: "Mar 6",  payee: "Marriott Hotels",    category: "Travel & Transport", matter: "Nelson Litigation",   client: "Nelson & Sons",  amount: -312.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Hotel stay matched to Chicago deposition trip. 2 nights. Pre-approved.",        confidence: 91, bankAccount: "amex-1247", source: "bank_feed", billable: true },
  { id: "tv3", date: "Mar 9",  payee: "Uber",               category: "Travel & Transport", matter: "Greenfield v. Apex",  client: "Greenfield LLC", amount:  -42.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Courthouse ride matched. Calendar event: 'Greenfield hearing 3/9'.",            confidence: 90, bankAccount: "amex-1247", source: "bank_feed", billable: true },
  { id: "tv4", date: "Mar 11", payee: "Enterprise Rent-A-Car",category: "Travel & Transport", matter: "Baker Estate Admin.", client: "Baker Trust Co", amount: -185.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Car rental matched. Estate site visit in Palm Springs. Pre-approved.",          confidence: 88, bankAccount: "amex-1247", source: "bank_feed", billable: true },

  // === MEALS & ENTERTAINMENT ===
  { id: "ml1", date: "Mar 5",  payee: "Capital Grille",    category: "Meals & Entertainment", matter: "Greenfield v. Apex",  client: "Greenfield LLC", amount: -340.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Client dinner — Greenfield LLC. 4 attendees. Matter inferred from calendar.", confidence: 87, bankAccount: "amex-1247", source: "bank_feed", billable: true },
  { id: "ml2", date: "Mar 10", payee: "Morton's Steakhouse",category: "Meals & Entertainment", matter: "Nelson Litigation",   client: "Nelson & Sons",  amount: -185.00, type: "debit", status: "auto",   method: "Card", agentRationale: "Client lunch — Nelson & Sons. 3 attendees. Matter inferred from calendar.", confidence: 85, bankAccount: "amex-1247", source: "bank_feed", billable: true },
  { id: "ml3", date: "Mar 14", payee: "Nobu Restaurant",   category: "Meals & Entertainment", matter: "Kim v. Pacific Rim",  client: "Kim Industries", amount: -420.00, type: "debit", status: "manual", method: "Card", agentRationale: "Flagged: $420 exceeds $300 per-meal policy limit. Receipt required.", confidence: 82, bankAccount: "amex-1247", source: "bank_feed" },

  // === TRUST DISBURSEMENTS (handled via flagged pending rows below) ===
];

// Seed action card flags onto matching ledger rows + append new pending rows
const _actionCardById = Object.fromEntries(mockActionCards.map(c => [c.id, c]));
([ ["l14", "recon-mar-1"], ["l4", "recon-mar-2"], ["l10", "m9"], ["l5", "m4"] ] as [string, string][]).forEach(
  ([rowId, cardId]) => { const row = ledgerData.find(r => r.id === rowId); if (row) row.flag = _actionCardById[cardId]; }
);
ledgerData.push(
  // Critical — trust floor breaches
  { id: "pf-trust-green",   date: "Mar 17", payee: "Green Estate Heirs",       category: "Trust Disbursement", matter: "Green Estate Admin.",    client: "Green Family",    amount: -2800.00, type: "debit",  status: "pending", method: "Wire", agentRationale: "Pending disbursement will drop IOLTA balance to $340 — $660 below the $1,000 floor.", confidence: 0, bankAccount: "boa-7721",   source: "manage",    flag: _actionCardById["trust-green"] },
  { id: "pf-trust-martinez",date: "Mar 18", payee: "Martinez Estate",          category: "Trust Disbursement", matter: "Martinez Estate Admin.", client: "Martinez Family", amount: -5500.00, type: "debit",  status: "pending", method: "Wire", agentRationale: "Scheduled disbursement exceeds current trust balance of $4,250 — would create a $1,250 deficit.", confidence: 0, bankAccount: "boa-7721",   source: "manage",    flag: _actionCardById["trust-martinez"] },
  // Critical — anomaly
  { id: "pf-meridian",      date: "Mar 17", payee: "Meridian Consulting LLC",  category: "Legal Consulting",   matter: "Overhead",              client: "—",               amount: -42000.00, type: "debit", status: "pending", method: "Wire", agentRationale: "First-ever wire to this vendor. No invoice, contract, or vendor record on file. 5× typical operating wire.", confidence: 15, bankAccount: "chase-4892", source: "bank_feed", flag: _actionCardById["anomaly-42k"] },
  // High — bulk court fees
  { id: "pf-bulk-court",    date: "Mar 16", payee: "Multiple Courts (14)",     category: "Filing Fees",        matter: "Unassigned",            client: "—",               amount: -4280.00,  type: "debit", status: "pending", method: "Card", agentRationale: "14 filing fees auto-categorized but matter could not be determined for any. Bulk assignment required before March can close.", confidence: 45, bankAccount: "amex-1247",  source: "manage",    flag: _actionCardById["bulk-court"] },
  // High — additional anomalies
  { id: "pf-morrison",      date: "Mar 17", payee: "Morrison Contractors",     category: "Capital Expenditures",matter: "Overhead",             client: "—",               amount: -7500.00,  type: "debit", status: "pending", method: "ACH",  agentRationale: "Exceeds $5,000 partner approval threshold. No approval on file yet.", confidence: 50, bankAccount: "chase-4892", source: "bank_feed", flag: _actionCardById["h3"] },
  { id: "pf-pacific-legal", date: "Mar 17", payee: "Pacific Legal Consulting", category: "Expert Witnesses",   matter: "Doe v. Metroplex",      client: "Jane Doe",        amount:  -4800.00, type: "debit", status: "pending", method: "ACH",  agentRationale: "3.2× historical average. No purchase order on file.", confidence: 42, bankAccount: "chase-4892",  source: "bank_feed", flag: _actionCardById["h4"] },
  { id: "pf-henderson",     date: "Mar 16", payee: "Henderson & Associates",   category: "Consulting Fees",    matter: "Overhead",              client: "—",               amount:  -7200.00, type: "debit", status: "pending", method: "ACH",  agentRationale: "2.8× historical average of $2,560. Last payment was $2,400.", confidence: 38, bankAccount: "chase-4892",  source: "bank_feed", flag: _actionCardById["h5"] },
  // Existing pending rows
  { id: "p-h1",  date: "Mar 17", payee: "Thomson Legal Services", category: "Legal Consulting", matter: "Overhead",   client: "—",         amount:  -9200.00, type: "debit",  status: "pending", method: "ACH",   agentRationale: "4.4x historical average. No matching invoice on file.", confidence: 35, bankAccount: "chase-4892", source: "bank_feed", flag: _actionCardById["h1"] },
  { id: "p-h2",  date: "Mar 17", payee: "John Smith",             category: "Client Payment",   matter: "Unknown",    client: "John Smith", amount:   4500.00, type: "credit", status: "pending", method: "ACH",   agentRationale: "Possible duplicate of same-day $4,500 deposit. 78% confidence.", confidence: 40, bankAccount: "chase-4892", source: "bank_feed", flag: _actionCardById["h2"] },
  { id: "p-m1",  date: "Mar 17", payee: "Doe (unknown)",          category: "Trust Deposit",    matter: "Unassigned", client: "—",          amount:    500.00, type: "credit", status: "pending", method: "Wire",  agentRationale: "Ambiguous: matches both Jane Doe and John Doe retainer requests.", confidence: 50, bankAccount: "boa-7721",   source: "manage",    flag: _actionCardById["m1"] },
  { id: "p-m3",  date: "Mar 16", payee: "Unknown",                category: "Unclassified",     matter: "Unassigned", client: "—",          amount:   1500.00, type: "credit", status: "pending", method: "Check", agentRationale: "Check #402 — no payee or invoice match found.", confidence: 0, bankAccount: "boa-7721",   source: "bank_feed", flag: _actionCardById["m3"] },
  // Medium — receipt & first-time vendor
  { id: "pf-united",        date: "Mar 17", payee: "United Airlines",          category: "Travel & Transport", matter: "Williams IP Filing",    client: "D. Williams",     amount:   -145.20, type: "debit",  status: "pending", method: "Card",  agentRationale: "Sarah Kim Amex ··3847, over $100 receipt threshold. Receipt not yet attached.", confidence: 78, bankAccount: "amex-1247",  source: "bank_feed", flag: _actionCardById["m4"] },
  { id: "pf-pacific-court", date: "Mar 16", payee: "Pacific Court Reporters",  category: "Uncategorized",      matter: "Overhead",              client: "—",               amount:   -350.00, type: "debit",  status: "pending", method: "ACH",   agentRationale: "First-ever payment to this vendor. No category assigned. Looks like court reporting.", confidence: 55, bankAccount: "chase-4892", source: "bank_feed", flag: _actionCardById["m7"] },
);

const INITIAL_FLAGGED_COUNT = ledgerData.filter(r => r.flag).length;

const severityConfig: Record<Severity, { bg: string; text: string; icon: React.ComponentType<{ className?: string }>; label: string; dot: string }> = {
  critical: { bg: "bg-red-50", text: "text-red-600", icon: AlertTriangle, label: "Critical", dot: "#EF4444" },
  bulk: { bg: "bg-gray-100", text: "text-gray-600", icon: Layers, label: "Bulk Admin", dot: "#9CA3AF" },
  ambiguity: { bg: "bg-amber-50", text: "text-amber-600", icon: HelpCircle, label: "Ambiguity", dot: "#F59E0B" },
};

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER BAR — Narrative Tab Navigation + Live Sync
   ═══════════════════════════════════════════════════════════════════════════ */

const AI_PROCESSED = 1847;

function MiniDonut({ pct, color, size = 24, strokeWidth = 3 }: { pct: number; color: string; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (Math.min(100, Math.max(0, pct)) / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-500"
      />
    </svg>
  );
}

const ROLES = [
  { name: "Ryan Chen", role: "Managing Partner", initials: "RC" },
  { name: "Lisa Park", role: "CFO", initials: "LP" },
  { name: "Sarah Kim", role: "AP Manager", initials: "SK" },
  { name: "David Thompson", role: "Bookkeeper", initials: "DT" },
];

function HeaderBar({ flaggedCount = 0, onOpenTeammate }: {
  flaggedCount?: number;
  onOpenTeammate?: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-8 pt-8 pb-6 flex-shrink-0"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-1">Track, review, and reconcile your firm's financial activity</p>
      </div>
    </div>
  );
}

function MetricPill({ icon, label, value, accent, warn }: {
  icon: React.ReactNode; label: string; value: string; accent?: boolean; warn?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "w-6 h-6 rounded-md flex items-center justify-center",
        accent ? "text-blue-600" : warn ? "text-amber-500" : "text-gray-400"
      )} style={{ backgroundColor: accent ? "#EFF6FF" : warn ? "#FFFBEB" : "#F8FAFC" }}>
        {icon}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A", fontFeatureSettings: "'tnum'" }}>{value}</span>
        <span className="text-[10px]" style={{ color: "#94A3B8", fontWeight: 500 }}>{label}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COLUMN 2 — ACTION QUEUE
   ═══════════════════════════════════════════════════════════════════════════ */

function ActionQueue({ items, selectedId, onSelect }: {
  items: ActionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div
      className="flex flex-col h-full flex-shrink-0"
      style={{ width: "30%", minWidth: 280, maxWidth: 360, borderRight: "1px solid #F1F5F9", borderColor: "#F1F5F9", backgroundColor: "#FAFBFC" }}
    >
      {/* Queue Header */}
      <div className="px-5 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>Action Queue</h2>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#F1F5F9", color: "#64748B", fontWeight: 500, fontFeatureSettings: "'tnum'" }}
          >
            {items.reduce((sum, i) => sum + (i.count || 1), 0)} items
          </span>
        </div>
        <p className="text-[11px]" style={{ color: "#94A3B8" }}>Items requiring your judgment</p>
      </div>

      {/* Queue Items */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
        {items.map((item) => {
          const config = severityConfig[item.severity];
          const Icon = config.icon;
          const isActive = selectedId === item.id;

          return (
            <motion.div
              key={item.id}
              layout
              onClick={() => onSelect(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelect(item.id); }}
              className={cn(
                "w-full text-left p-3.5 rounded-xl transition-all relative cursor-pointer",
                isActive ? "bg-white" : "bg-white/60 hover:bg-white"
              )}
              style={{
                border: isActive ? "1.5px solid #BFDBFE" : "1px solid transparent",
                boxShadow: isActive
                  ? "0 2px 8px rgba(28,96,255,0.08), 0 0 0 1px rgba(28,96,255,0.04)"
                  : "0 1px 2px rgba(0,0,0,0.02)",
              }}
            >
              {/* Severity dot */}
              <div className="absolute top-4 left-0 w-[3px] h-5 rounded-r-full" style={{ backgroundColor: config.dot }} />

              <div className="flex items-start gap-2.5 pl-1.5">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", config.bg)}>
                  <Icon className={cn("w-3.5 h-3.5", config.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={cn("text-[9px] uppercase tracking-wider", config.text)} style={{ fontWeight: 600, letterSpacing: "0.08em" }}>
                      {config.label}
                    </span>
                    <span className="text-[9px]" style={{ color: "#CBD5E1" }}>·</span>
                    <span className="text-[9px]" style={{ color: "#CBD5E1" }}>{item.timestamp}</span>
                  </div>
                  <p className="text-[12px] truncate" style={{ fontWeight: 500, color: "#0F172A" }}>{item.title}</p>
                  <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: "#94A3B8" }}>{item.subtitle}</p>

                  {/* Amount + Bulk CTA */}
                  <div className="flex items-center gap-2 mt-2">
                    {item.amount && (
                      <span className="text-[12px]" style={{ fontWeight: 600, color: "#0F172A", fontFeatureSettings: "'tnum'" }}>{item.amount}</span>
                    )}
                    {item.severity === "bulk" && (
                      <button
                        className="text-[10px] px-2.5 py-0.5 rounded-md transition-colors"
                        style={{ backgroundColor: "#F1F5F9", color: "#475569", fontWeight: 500 }}
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        Assign All
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   COLUMN 3 — UNIFIED LEDGER
   ═══════════════════════════════════════════════════════════════════════════ */

function EditableCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = React.useState(false);
  const [localVal, setLocalVal] = React.useState(value);
  const [pulsing, setPulsing] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    if (localVal !== value) {
      onChange(localVal);
      setPulsing(true);
      setTimeout(() => setPulsing(false), 1100);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setLocalVal(value); setEditing(false); } }}
        className="w-full rounded px-1.5 py-0.5 text-[14px] outline-none transition-all"
        style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", color: "#0F172A" }}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer px-1.5 py-0.5 rounded transition-all inline-block hover:bg-gray-50 truncate max-w-full"
      style={pulsing ? { animation: "tealPulse 1.1s ease-out forwards" } : undefined}
      title={value}
    >
      {value}
    </span>
  );
}

const CATEGORY_OPTIONS = [
  "Research Subscriptions", "Trust Deposit", "Filing Fees", "Office Supplies",
  "Hard Cost", "Meals & Entertainment", "Client Payment", "Postage & Delivery",
  "Retainer Deposit", "Technology", "Travel & Transport",
];

function CategoryDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false);
  const [pulsing, setPulsing] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: r.bottom + 4, left: r.left, width: Math.max(r.width, 180) });
    }
    setOpen(o => !o);
  };

  React.useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current && !triggerRef.current.contains(target) &&
        menuRef.current && !menuRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const menu = open && menuPos ? ReactDOM.createPortal(
    <div
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        top: menuPos.top,
        left: menuPos.left,
        minWidth: menuPos.width,
        maxHeight: 240,
        overflowY: "auto",
        zIndex: 9999,
        border: "1px solid #E2E8F0",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      {CATEGORY_OPTIONS.map((cat) => {
        const isSelected = cat === value;
        return (
          <button
            key={cat}
            onClick={(e) => {
              e.stopPropagation();
              if (cat !== value) {
                onChange(cat);
                setPulsing(true);
                setTimeout(() => setPulsing(false), 1100);
              }
              setOpen(false);
            }}
            className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors flex items-center gap-2"
            style={{ color: isSelected ? "#0F172A" : "#64748B", fontWeight: isSelected ? 600 : 500 }}
          >
            {cat}
            {isSelected && <CheckCircle2 className="w-3 h-3 ml-auto" style={{ color: "#3B82F6" }} />}
          </button>
        );
      })}
    </div>,
    document.body
  ) : null;

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        onClick={openMenu}
        className="cursor-pointer px-1.5 py-0.5 rounded transition-all inline-flex items-center whitespace-nowrap hover:bg-gray-50"
        style={pulsing ? { animation: "tealPulse 1.1s ease-out forwards" } : undefined}
      >
        <span className="text-[14px]" style={{ color: "#0F172A" }}>{value}</span>
        <ChevronDown className="w-3 h-3 ml-0.5 flex-shrink-0" style={{ color: "#94A3B8" }} />
      </span>
      {menu}
    </span>
  );
}

function EvidenceTooltip({ rationale, confidence }: { rationale: string; confidence: number }) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="transition-colors hover:text-blue-500"
        style={{ color: "#CBD5E1" }}
      >
        <Shield className="w-3.5 h-3.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-2 w-[280px] p-3 rounded-xl z-50"
            style={{ backgroundColor: "#0F172A", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)" }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span className="text-[9px] text-blue-400" style={{ fontWeight: 600 }}>Why this was matched</span>
              {confidence > 0 && (
                <span className="ml-auto text-[10px] text-gray-500" style={{ fontFeatureSettings: "'tnum'" }}>{confidence}%</span>
              )}
            </div>
            <p className="text-[11px] text-gray-300 leading-relaxed">{rationale}</p>
            <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2" style={{ backgroundColor: "#0F172A" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RECONCILIATION READINESS BAR
   ═══════════════════════════════════════════════════════════════════════════ */

const RECON_MONTH_DATA = [
  { key: "oct", label: "October 2025",   reconciled: true  },
  { key: "nov", label: "November 2025",  reconciled: true  },
  { key: "dec", label: "December 2025",  reconciled: true  },
  { key: "jan", label: "January 2026",   reconciled: true  },
  { key: "feb", label: "February 2026",  reconciled: true  },
  { key: "mar", label: "March 2026",     reconciled: false },
];

function ReconciliationReadinessBar({
  autoProcessed,
  currentFlaggedCount,
  trustAtRisk,
  ioltaMatters,
  onCloseMonth,
  selectedMonth,
  onScrollToFlagged,
}: {
  autoProcessed: number;
  initialFlaggedCount: number;
  currentFlaggedCount: number;
  trustAtRisk: number;
  ioltaMatters: number;
  onCloseMonth: () => void;
  selectedMonth: string;
  onScrollToFlagged?: () => void;
}) {
  const monthMeta = RECON_MONTH_DATA.find(m => m.key === selectedMonth) ?? RECON_MONTH_DATA[RECON_MONTH_DATA.length - 1];
  const isPastReconciled = monthMeta.reconciled;

  const readyCount = isPastReconciled ? autoProcessed : autoProcessed - currentFlaggedCount;
  const pct = isPastReconciled ? 100 : Math.round((readyCount / autoProcessed) * 100);
  const displayFlagged = isPastReconciled ? 0 : currentFlaggedCount;
  const displayTrustAtRisk = isPastReconciled ? 0 : trustAtRisk;
  const isReady = displayFlagged === 0;

  return (
    <div className="px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#F9FAFB" }}>
      <div
        className="rounded-xl"
        style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", backgroundColor: "#FFFFFF", overflow: "hidden" }}
      >
        <div className="px-5 py-3 flex items-center justify-between gap-6">
          {/* Left: heading + stat pills */}
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-shrink-0">
              <p className="text-[11px] uppercase tracking-widest" style={{ color: "#94A3B8", fontWeight: 600 }}>{monthMeta.label}</p>
              <p className="text-[12px] mt-0.5" style={{ color: "#64748B" }}>Reconciliation Status</p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#16A34A" }} />
                <div>
                  <p className="text-[12px]" style={{ fontWeight: 600, color: "#15803D" }}>{autoProcessed.toLocaleString()}</p>
                  <p className="text-[10px]" style={{ color: "#4ADE80" }}>Auto-processed</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{
                backgroundColor: displayFlagged > 0 ? "#FFFBEB" : "#F0FDF4",
                border: `1px solid ${displayFlagged > 0 ? "#FDE68A" : "#BBF7D0"}`,
              }}>
                {displayFlagged > 0
                  ? <Flag className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#D97706" }} />
                  : <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#16A34A" }} />}
                <div>
                  <p className="text-[12px]" style={{ fontWeight: 600, color: displayFlagged > 0 ? "#B45309" : "#15803D" }}>
                    {displayFlagged > 0 ? displayFlagged : "All clear"}
                  </p>
                  <p className="text-[10px]" style={{ color: displayFlagged > 0 ? "#F59E0B" : "#4ADE80" }}>
                    {displayFlagged > 0 ? "Need attention" : "Items resolved"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{
                backgroundColor: displayTrustAtRisk > 0 ? "#FEF2F2" : "#F0FDFA",
                border: `1px solid ${displayTrustAtRisk > 0 ? "#FECACA" : "#99F6E4"}`,
              }}>
                <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: displayTrustAtRisk > 0 ? "#DC2626" : "#0D9488" }} />
                <div>
                  <p className="text-[12px]" style={{ fontWeight: 600, color: displayTrustAtRisk > 0 ? "#B91C1C" : "#0F766E" }}>
                    {displayTrustAtRisk > 0 ? `${displayTrustAtRisk} at risk` : `${ioltaMatters} compliant`}
                  </p>
                  <p className="text-[10px]" style={{ color: displayTrustAtRisk > 0 ? "#EF4444" : "#14B8A6" }}>IOLTA matters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: percentage + CTA */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <span className="text-[28px] leading-none tabular-nums" style={{ fontWeight: 700, color: isReady ? "#16A34A" : "#0F172A" }}>
              {pct}%
            </span>
            {isPastReconciled ? (
              <button
                onClick={onCloseMonth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-all hover:opacity-90 shadow-sm"
                style={{ background: "linear-gradient(135deg, #16A34A, #15803D)", color: "#FFFFFF", fontWeight: 600 }}
              >
                <FileText className="w-3.5 h-3.5" />
                View Report
              </button>
            ) : isReady ? (
              <button
                onClick={onCloseMonth}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] transition-all hover:opacity-90 shadow-sm"
                style={{ background: "linear-gradient(135deg, #16A34A, #15803D)", color: "#FFFFFF", fontWeight: 600 }}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Close {monthMeta.label.split(" ")[0]}
              </button>
            ) : (
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <CircleAlert className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#D97706" }} />
                  <span className="text-[12px]" style={{ fontWeight: 600, color: "#D97706" }}>Not close-ready</span>
                </div>
                <button
                  onClick={onScrollToFlagged}
                  className="text-[11px] mt-0.5 hover:underline"
                  style={{ color: "#94A3B8", background: "none", border: "none", padding: 0, cursor: onScrollToFlagged ? "pointer" : "default" }}
                >
                  {displayFlagged} items need attention
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Full-width progress bar pinned to card bottom */}
        <div className="h-1.5 w-full" style={{ backgroundColor: "#F1F5F9" }}>
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: "#16A34A" }}
          />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SYSTEM ALERT BANNER
   ═══════════════════════════════════════════════════════════════════════════ */

function SystemAlertBanner({
  type,
  title,
  subtitle,
  cta,
  onAction,
  onDismiss,
}: {
  type: "bank_disconnect" | "trust_balance";
  title: string;
  subtitle: string;
  cta: string;
  onAction: () => void;
  onDismiss: () => void;
}) {
  const isBank = type === "bank_disconnect";
  const accent  = isBank ? "#DC2626" : "#D97706";
  const iconBg  = isBank ? "#FEE2E2" : "#FEF3C7";
  const textPrimary   = isBank ? "#991B1B" : "#92400E";
  const textSecondary = isBank ? "#B91C1C" : "#B45309";
  const ctaBg   = isBank ? "#FEF2F2" : "#FFFBEB";
  const ctaBorder = isBank ? "#FECACA" : "#FDE68A";

  return (
    <div
      className="flex items-start gap-4 p-4 rounded-xl"
      style={{
        backgroundColor: "#FFFFFF",
        border: `1px solid ${isBank ? "#FECACA" : "#FDE68A"}`,
        borderLeft: `4px solid ${accent}`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
      }}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {isBank
          ? <WifiOff className="w-4 h-4" style={{ color: accent }} />
          : <AlertTriangle className="w-4 h-4" style={{ color: accent }} />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px]" style={{ fontWeight: 700, color: textPrimary }}>{title}</p>
        <p className="text-[12px] mt-0.5" style={{ color: textSecondary }}>{subtitle}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onAction}
          className="px-3.5 py-1.5 rounded-lg text-[12px] transition-all hover:opacity-90"
          style={{
            fontWeight: 600,
            backgroundColor: accent,
            color: "#FFFFFF",
          }}
        >
          {cta}
        </button>
        <button
          onClick={onDismiss}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: ctaBg, border: `1px solid ${ctaBorder}` }}
        >
          <X className="w-3.5 h-3.5" style={{ color: accent }} />
        </button>
      </div>
    </div>
  );
}

function UnifiedLedger({ ledger, updateField, showReconcile, editedCategories, onCategoryEdit, highlightRowId, initialFlaggedCount, onFlagResolved, flaggedCount = 0, onBannerAction, onCloseMonth, initialFilter = "all" }: {
  ledger: LedgerRow[];
  updateField: (id: string, field: "payee" | "category" | "matter", value: string) => void;
  showReconcile?: boolean;
  editedCategories: Set<string>;
  onCategoryEdit: (id: string) => void;
  highlightRowId?: string | null;
  initialFlaggedCount: number;
  onFlagResolved?: (rowId: string) => void;
  flaggedCount?: number;
  onBannerAction?: (type: "bank_disconnect" | "trust_balance") => void;
  onCloseMonth?: () => void;
  initialFilter?: "all" | "critical" | "high" | "medium" | "low";
}) {
  const [visibleCount, setVisibleCount] = React.useState(20);
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const LOAD_BATCH = 15;
  const [viewingRowId, setViewingRowId] = React.useState<string | null>(null);
  const [pulsingRowId, setPulsingRowId] = React.useState<string | null>(null);
  const [accountFilter, setAccountFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState<"all" | "critical" | "high" | "medium" | "low">(initialFilter);
  const [showBankAlert, setShowBankAlert] = React.useState(true);
  const [showTrustAlert, setShowTrustAlert] = React.useState(true);
  const [selectedMonth, setSelectedMonth] = React.useState("mar");
  const [confirmedBillable, setConfirmedBillable] = React.useState<Set<string>>(new Set());
  const viewingRow = viewingRowId ? ledger.find((r) => r.id === viewingRowId) || null : null;
  const handleDrawerClose = () => {
    if (viewingRowId) { setPulsingRowId(viewingRowId); setTimeout(() => setPulsingRowId(null), 1200); }
    setViewingRowId(null);
  };

  const handleFlagResolved = (rowId: string) => {
    onFlagResolved?.(rowId);
  };

  const accountFiltered = accountFilter === "all" ? ledger : ledger.filter((r) => r.bankAccount === accountFilter);
  const filteredLedger = React.useMemo(() => {
    const base = priorityFilter === "all"
      ? accountFiltered
      : accountFiltered.filter((r) => r.flag?.priority === priorityFilter);
    // Parse "Mar 17" → sortable number (month * 100 + day), newest first
    const MONTHS: Record<string, number> = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
    return [...base].sort((a, b) => {
      const [aM, aD] = a.date.split(" ");
      const [bM, bD] = b.date.split(" ");
      const aVal = (MONTHS[aM] ?? 0) * 100 + parseInt(aD ?? "0", 10);
      const bVal = (MONTHS[bM] ?? 0) * 100 + parseInt(bD ?? "0", 10);
      return bVal - aVal; // newest first
    });
  }, [accountFiltered, priorityFilter]);
  const visibleLedger = filteredLedger.slice(0, visibleCount);
  const hasMore = visibleCount < filteredLedger.length;

  const priorityCounts = React.useMemo(() => {
    const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    accountFiltered.forEach((r) => { if (r.flag) counts[r.flag.priority] = (counts[r.flag.priority] || 0) + 1; });
    return counts;
  }, [accountFiltered]);

  React.useEffect(() => { setVisibleCount(20); }, [accountFilter, priorityFilter]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + LOAD_BATCH, filteredLedger.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredLedger.length]);

  return (
    <div className="flex flex-col h-full overflow-hidden relative" style={{ backgroundColor: "#F9FAFB" }}>

      {/* System Alert Banners */}
      {(showBankAlert || showTrustAlert) && (
        <div className="px-6 pt-4 pb-2 flex flex-col gap-3 flex-shrink-0">
          {showBankAlert && (
            <SystemAlertBanner
              type="bank_disconnect"
              title={mockActionCards.find(c => c.id === "c2")?.title ?? "Chase ··4892 lost connection — 12 transactions waiting"}
              subtitle={mockActionCards.find(c => c.id === "c2")?.subtitle ?? "Re-authenticate to resume syncing"}
              cta="Reconnect"
              onAction={() => { onBannerAction?.("bank_disconnect"); setShowBankAlert(false); }}
              onDismiss={() => setShowBankAlert(false)}
            />
          )}
          {showTrustAlert && (
            <SystemAlertBanner
              type="trust_balance"
              title={mockActionCards.find(c => c.id === "c1")?.title ?? "Jane Doe's trust will drop below the $1,000 floor"}
              subtitle={mockActionCards.find(c => c.id === "c1")?.subtitle ?? "A $1,250 filing fee will leave only $592 in the account"}
              cta="Allocate top-up"
              onAction={() => { onBannerAction?.("trust_balance"); setShowTrustAlert(false); }}
              onDismiss={() => setShowTrustAlert(false)}
            />
          )}
        </div>
      )}

      {/* Reconciliation Readiness Bar */}
      {(() => {
        const trustAtRisk = ledger.filter(r => r.flag?.type === "trust_balance").length;
        return (
          <ReconciliationReadinessBar
            autoProcessed={AI_PROCESSED}
            initialFlaggedCount={initialFlaggedCount}
            currentFlaggedCount={flaggedCount}
            trustAtRisk={trustAtRisk}
            ioltaMatters={12}
            onCloseMonth={onCloseMonth ?? (() => {})}
            selectedMonth={selectedMonth}
            onScrollToFlagged={() => setPriorityFilter("critical")}
          />
        );
      })()}

      {/* Priority Filter Bar */}
      <div className="flex items-center justify-between px-6 py-2 flex-shrink-0" style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center gap-2">
        {(["all", "critical", "high", "medium", "low"] as const).map((p) => {
          const isActive = priorityFilter === p;
          const count = p === "all" ? Object.values(priorityCounts).reduce((a, b) => a + b, 0) : priorityCounts[p] || 0;
          const cfg = p !== "all" ? priorityConfig[p] : null;
          return (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] transition-all"
              style={{
                fontWeight: isActive ? 600 : 400,
                color: isActive ? (cfg ? cfg.badgeText : "#0F172A") : "#64748B",
                backgroundColor: isActive ? (cfg ? cfg.badgeBg : "#F1F5F9") : "transparent",
                border: isActive ? `1px solid ${cfg ? cfg.accentColor + "40" : "#CBD5E1"}` : "1px solid transparent",
              }}
            >
              {cfg && (
                <span
                  className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: cfg.accentColor }}
                />
              )}
              {p === "all" ? "All" : cfg!.label}
              {count > 0 && (
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded-full ml-0.5"
                  style={{
                    backgroundColor: isActive ? (cfg ? cfg.accentColor + "20" : "#E2E8F0") : "#F1F5F9",
                    color: isActive ? (cfg ? cfg.badgeText : "#475569") : "#94A3B8",
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="text-[13px] rounded-lg px-2.5 py-1.5 outline-none cursor-pointer appearance-none pr-7"
            style={{ border: "1px solid #E2E8F0", color: accountFilter === "all" ? "#64748B" : "#0F172A", fontWeight: 500, backgroundColor: "#FFFFFF", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
          >
            {BANK_ACCOUNTS.map((ba) => (
              <option key={ba.key} value={ba.key}>{ba.label}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-[13px] rounded-lg px-2.5 py-1.5 outline-none cursor-pointer appearance-none pr-7"
            style={{ border: "1px solid #E2E8F0", color: "#0F172A", fontWeight: 500, backgroundColor: "#FFFFFF", backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%2394A3B8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}
          >
            {RECON_MONTH_DATA.map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-6 pb-2">
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <table className="w-full table-fixed min-w-[1000px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9", borderColor: "#F1F5F9" }}>
                {[
                  { label: "Date",              align: "left",   width: "64px"  },
                  { label: "Source",            align: "left",   width: "80px"  },
                  { label: "Account",           align: "left",   width: "96px"  },
                  { label: "From / To",         align: "left",   width: "140px" },
                  { label: "Client",            align: "left",   width: "110px" },
                  { label: "Matter",            align: "left",   width: "120px" },
                  { label: "Amount",            align: "right",  width: "84px"  },
                  { label: "Category",          align: "left",   width: "120px" },
                  { label: "Status",            align: "left",   width: "180px" },
                ].map((col) => (
                  <th
                    key={col.label}
                    className={cn("px-3 py-2.5", col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left")}
                    style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase", width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleLedger.map((row) => {
                const isMatched = row.status === "auto" && row.confidence >= 90;
                const isHumanEdited = editedCategories.has(row.id);
                const isPulsing = pulsingRowId === row.id || highlightRowId === row.id;

                let intelligenceLabel: string;
                let badgeColor: string;
                let badgeBg: string;
                let BadgeIcon: React.ComponentType<{ className?: string }>;

                if (isHumanEdited) {
                  intelligenceLabel = "Corrected";
                  badgeColor = "#7C3AED";
                  badgeBg = "#F5F3FF";
                  BadgeIcon = Pencil;
                } else if (row.status === "billed") {
                  intelligenceLabel = "Billed";
                  badgeColor = "#166534";
                  badgeBg = "#DCFCE7";
                  BadgeIcon = CheckCircle2;
                } else if (isMatched) {
                  intelligenceLabel = "Matched";
                  badgeColor = "#166534";
                  badgeBg = "#F0FDF4";
                  BadgeIcon = CheckCircle2;
                } else {
                  intelligenceLabel = "Categorized";
                  badgeColor = "#1D4ED8";
                  badgeBg = "#EFF6FF";
                  BadgeIcon = Sparkles;
                }

                const evidenceText = isHumanEdited
                  ? "Category manually corrected by bookkeeper."
                  : isMatched
                    ? row.confidence === 100
                      ? "Matched via exact invoice reference"
                      : "Matched via recurring pattern"
                    : "Applied Firm Rule: " + row.category;

                const flagBg: Record<string, string> = {
                  critical: "rgba(254,226,226,0.45)", // red-100/45
                  high:     "rgba(254,243,199,0.45)", // amber-100/45
                  medium:   "rgba(219,234,254,0.35)", // blue-100/35
                  low:      "rgba(243,244,246,0.5)",  // gray-100/50
                };
                const flagHoverBg: Record<string, string> = {
                  critical: "rgba(254,226,226,0.7)",
                  high:     "rgba(254,243,199,0.7)",
                  medium:   "rgba(219,234,254,0.6)",
                  low:      "rgba(243,244,246,0.8)",
                };

                return (
                  <React.Fragment key={row.id}>
                  <tr
                    onClick={() => setViewingRowId(row.id)}
                    className="transition-colors group cursor-pointer"
                    style={{
                      borderBottom: "1px solid #F8FAFC",
                      ...(row.flag ? {
                        borderLeft: `3px solid ${priorityConfig[row.flag.priority].accentColor}`,
                        backgroundColor: flagBg[row.flag.priority],
                      } : {}),
                      ...(isPulsing ? { animation: "tealPulse 1.2s ease-out forwards" } : {}),
                    }}
                    onMouseEnter={row.flag ? (e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = flagHoverBg[row.flag!.priority]; } : undefined}
                    onMouseLeave={row.flag ? (e) => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = flagBg[row.flag!.priority]; } : undefined}
                  >
                    <td className="px-3 py-2.5 text-[14px]" style={{ color: "#64748B", fontFeatureSettings: "'tnum'" }}>{row.date}</td>

                    {/* Source */}
                    <td className="px-3 py-2.5">
                      {row.source ? (() => {
                        const src = SOURCE_CONFIG[row.source];
                        return (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded whitespace-nowrap"
                            style={{ color: src.color, backgroundColor: src.bg, fontWeight: 500 }}
                          >
                            <src.Icon className="w-[11px] h-[11px] flex-shrink-0" />
                            {src.label}
                          </span>
                        );
                      })() : <span className="text-[12px]" style={{ color: "#CBD5E1" }}>—</span>}
                    </td>

                    <td className="px-3 py-2.5">
                      {row.bankAccount === "boa-7721" ? (
                        <span className="inline-flex items-center gap-1 text-[12px] px-1.5 py-0.5 rounded" style={{ color: "#0D9488", backgroundColor: "#F0FDFA", fontWeight: 600, fontFeatureSettings: "'tnum'" }}>
                          <Shield className="w-[10px] h-[10px] flex-shrink-0" />
                          {BANK_LABELS["boa-7721"]}
                        </span>
                      ) : (
                        <span className="text-[12px] px-1.5 py-0.5 rounded" style={{ color: "#64748B", backgroundColor: "#F1F5F9", fontWeight: 500, fontFeatureSettings: "'tnum'" }}>
                          {row.bankAccount ? BANK_LABELS[row.bankAccount] || row.bankAccount : "—"}
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2.5 text-[14px]" style={{ color: "#0F172A", fontWeight: 500 }}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className="w-[4px] h-[4px] rounded-full flex-shrink-0"
                          style={{ backgroundColor: row.amount >= 0 ? "#4ADE80" : "#94A3B8" }}
                        />
                        <span className="truncate">{row.payee}</span>
                      </div>
                    </td>

                    <td className="px-3 py-2.5 text-[14px] overflow-hidden" style={{ color: "#475569" }}>
                      <EditableCell value={row.client} onChange={(v) => updateField(row.id, "payee", v)} />
                    </td>

                    <td className="px-3 py-2.5 text-[14px] overflow-hidden" style={{ color: "#475569" }}>
                      <EditableCell value={row.matter} onChange={(v) => updateField(row.id, "matter", v)} />
                    </td>

                    <td className="px-3 py-2.5 text-[14px] text-right" style={{ fontWeight: 600, fontFeatureSettings: "'tnum'", color: row.amount >= 0 ? "#16A34A" : "#0F172A" }}>
                      {row.amount >= 0 ? "+" : ""}${Math.abs(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Category */}
                    <td className="px-3 py-2.5 overflow-hidden">
                      <CategoryDropdown
                        value={row.category}
                        onChange={(v) => {
                          updateField(row.id, "category", v);
                          onCategoryEdit(row.id);
                        }}
                      />
                    </td>

                    {/* Status — badges/chips */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Status badge */}
                        <span
                          className="inline-flex items-center gap-1 text-[12px] px-2 py-[2px] rounded-full whitespace-nowrap flex-shrink-0"
                          style={{ color: badgeColor, backgroundColor: badgeBg, fontWeight: 500 }}
                        >
                          <BadgeIcon className="w-[12px] h-[12px]" />
                          {intelligenceLabel}
                        </span>

                        {/* IOLTA chip for trust categories */}
                        {(row.category === "Trust Deposit" || row.category === "Retainer Deposit" || row.category === "Trust Disbursement") && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-1.5 py-[2px] rounded whitespace-nowrap flex-shrink-0"
                            style={{ color: "#0D9488", backgroundColor: "#F0FDFA", fontWeight: 600 }}
                            title="IOLTA trust transaction"
                          >
                            <Shield className="w-[10px] h-[10px]" />
                            IOLTA
                          </span>
                        )}

                        {/* Flag type pill */}
                        {row.flag && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-2 py-[2px] rounded-full whitespace-nowrap flex-shrink-0"
                            style={{
                              color: priorityConfig[row.flag.priority].badgeText,
                              backgroundColor: priorityConfig[row.flag.priority].badgeBg,
                              fontWeight: 500,
                            }}
                          >
                            <Flag className="w-[11px] h-[11px]" />
                            {cardTypeConfig[row.flag.type].label}
                          </span>
                        )}

                        {/* Billable chip */}
                        {row.billable && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[12px] px-1.5 py-[1px] rounded-md whitespace-nowrap flex-shrink-0"
                            style={{ color: "#B45309", backgroundColor: "#FFFBEB", fontWeight: 600 }}
                            title="Billable expense"
                          >
                            <DollarSign className="w-[12px] h-[12px]" />
                            Billable
                          </span>
                        )}

                        {/* Evidence shield */}
                        <EvidenceTooltip rationale={evidenceText} confidence={row.confidence} />
                      </div>
                    </td>
                  </tr>

                  </React.Fragment>
              );
              })}
            </tbody>
          </table>

          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="h-1" />
          {hasMore && (
            <div className="flex items-center justify-center py-4 gap-2" style={{ color: "#94A3B8" }}>
              <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-slate-400 animate-spin" />
              <span className="text-[12px]">Loading more…</span>
            </div>
          )}
          {!hasMore && filteredLedger.length > 0 && (
            <div className="flex items-center justify-center py-3">
              <span className="text-[12px]" style={{ color: "#CBD5E1" }}>All {filteredLedger.length} transactions loaded</span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Detail Drawer */}
      <TransactionDetailDrawer row={viewingRow} onClose={handleDrawerClose} onFlagResolved={onFlagResolved} confirmedBillable={confirmedBillable} onConfirmBillable={(id) => setConfirmedBillable(prev => new Set(prev).add(id))} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TRANSACTION DETAIL DRAWER — Matched State
   ═══════════════════════════════════════════════════════════════════════════ */

function AiFieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <Sparkles className="w-3 h-3" style={{ color: "#2DD4BF" }} />
      <span className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 600 }}>{children}</span>
    </div>
  );
}

function TransactionDetailDrawer({ row, onClose, onFlagResolved, confirmedBillable = new Set(), onConfirmBillable }: { row: LedgerRow | null; onClose: () => void; onFlagResolved?: (id: string) => void; confirmedBillable?: Set<string>; onConfirmBillable?: (id: string) => void }) {
  const [activeTab, setActiveTab] = React.useState<"details" | "audit">("details");
  const [chatInput, setChatInput] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [assignee, setAssignee] = React.useState<string | null>(null);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const assignRef = React.useRef<HTMLDivElement>(null);
  const isOpen = row !== null;

  const TEAM_MEMBERS = [
    { id: "sarah", name: "Sarah Martinez", role: "Bookkeeper", initials: "SM" },
    { id: "david", name: "David Thompson", role: "Senior Accountant", initials: "DT" },
    { id: "jennifer", name: "Jennifer Hart", role: "CFO", initials: "JH" },
  ];

  React.useEffect(() => {
    if (!assignOpen) return;
    const handler = (e: MouseEvent) => {
      if (assignRef.current && !assignRef.current.contains(e.target as Node)) setAssignOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [assignOpen]);

  // Reset per-row state when row changes
  React.useEffect(() => {
    setChatMessages([]);
    setChatInput("");
    setAssignee(null);
  }, [row?.id]);

  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages(prev => [
      ...prev,
      { role: "user", text },
      { role: "ai", text: `I've reviewed this transaction. ${text.toLowerCase().includes("why") ? `The reason is: ${row?.agentRationale ?? "the transaction matched an existing rule."}` : "I'll look into that and update you shortly."}` },
    ]);
    setChatInput("");
  };

  const auditLog = React.useMemo(() => {
    if (!row) return [];
    return [
      { time: "10:00 AM", event: `Transaction synced from Bank Feed (${row.method})`, agent: "Plaid", icon: RefreshCcw, color: "#64748B" },
      { time: "10:01 AM", event: `Auto-matched to ${row.category === "Trust Deposit" ? "Trust Request #108" : row.category === "Client Payment" ? "Invoice #2024-0892" : "vendor pattern"} by Agent v3.1`, agent: "Teammate", icon: Sparkles, color: "#3B82F6" },
      { time: "10:05 AM", event: "Verified by David Thompson (Human)", agent: "Human", icon: CheckCheck, color: "#16A34A" },
    ];
  }, [row]);

  const linkedRecord = React.useMemo(() => {
    if (!row) return null;
    if (row.category === "Trust Deposit") return { type: "Retainer request", ref: "#108", label: `${row.client} — ${row.matter}` };
    if (row.category === "Client Payment") return { type: "Invoice", ref: "#2024-0892", label: `${row.client} — ${row.matter}` };
    if (row.category === "Retainer Deposit") return { type: "Retainer request", ref: "#112", label: `${row.client} — ${row.matter}` };
    if (row.client && row.client !== "—") return { type: "Expense record", ref: row.payee, label: `${row.client} — ${row.matter}` };
    return null;
  }, [row]);

  const bankAccounts: Record<string, string> = { Wire: "Chase ··4892", ACH: "Chase ··4892", Card: "Amex ··1247", Check: "BOA ··7721" };

  return (
    <AnimatePresence>
      {isOpen && row && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30" style={{ backgroundColor: "rgba(15,23,42,0.12)" }} onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 z-40 flex flex-col bg-white"
            style={{ width: "min(520px, 65%)", boxShadow: "-8px 0 32px rgba(15,23,42,0.10), -2px 0 8px rgba(15,23,42,0.05)", borderLeft: "1px solid #E2E8F0" }}
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: "1px solid #F1F5F9" }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[24px]" style={{ fontWeight: 700, color: "#0F172A", fontFeatureSettings: "'tnum'", lineHeight: 1.2 }}>
                    {row.amount >= 0 ? "+" : ""}${Math.abs(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[14px]" style={{ color: "#64748B" }}>{row.date}, 2026</span>
                    <span style={{ color: "#E2E8F0" }}>|</span>
                    <span className="text-[14px]" style={{ color: "#64748B" }}>{row.amount >= 0 ? "From" : "To"}: <span style={{ color: "#0F172A", fontWeight: 500 }}>{row.payee}</span></span>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100 flex-shrink-0">
                  <X className="w-4 h-4" style={{ color: "#94A3B8" }} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                {row.flag ? (
                  <span
                    className="inline-flex items-center gap-1.5 text-[13px] px-3 py-1 rounded-full"
                    style={{ color: priorityConfig[row.flag.priority].badgeText, backgroundColor: priorityConfig[row.flag.priority].badgeBg, fontWeight: 600 }}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {priorityConfig[row.flag.priority].label} · Needs your input
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[13px] px-3 py-1 rounded-full" style={{ color: "#166534", backgroundColor: "#F0FDF4", fontWeight: 600 }}>
                    <Shield className="w-3.5 h-3.5" /> Matched
                  </span>
                )}
              </div>
              <div className="flex mt-4 rounded-lg p-0.5" style={{ backgroundColor: "#F1F5F9" }}>
                {(["details", "audit"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={cn("flex-1 py-2 rounded-md text-[14px] transition-all", activeTab === tab ? "bg-white" : "")}
                    style={{ fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? "#0F172A" : "#94A3B8", ...(activeTab === tab ? { boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } : {}) }}
                  >{tab === "details" ? "Details" : "Audit Log"}</button>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {activeTab === "details" ? (
                <>
                  {/* Flag guidance — shown for rows that need attention */}
                  {row.flag && (
                    <div
                      className="rounded-xl p-4 space-y-3"
                      style={{
                        backgroundColor: priorityConfig[row.flag.priority].badgeBg,
                        border: `1px solid ${priorityConfig[row.flag.priority].accentColor}40`,
                        borderLeft: `4px solid ${priorityConfig[row.flag.priority].accentColor}`,
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <CircleAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: priorityConfig[row.flag.priority].accentColor }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold" style={{ color: "#0F172A" }}>{row.flag.title}</p>
                          <p className="text-[13px] mt-1 leading-relaxed" style={{ color: "#475569" }}>{row.flag.evidenceRationale}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        {cardTypeConfig[row.flag.type].viewCTA && (
                          <button
                            onClick={() => { onFlagResolved?.(row.id); onClose(); }}
                            className="px-3 py-1.5 rounded-lg text-[13px] text-white transition hover:opacity-90"
                            style={{ backgroundColor: "#0F172A" }}
                          >
                            {cardTypeConfig[row.flag.type].viewCTA}
                          </button>
                        )}
                        {cardTypeConfig[row.flag.type].inlineCTA && (
                          <button
                            onClick={() => {
                              if (row.flag?.type === "hard_cost") onConfirmBillable?.(row.id);
                              onFlagResolved?.(row.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded-lg text-[13px] transition"
                            style={{ border: "1px solid #E2E8F0", color: "#475569", backgroundColor: "#FFFFFF" }}
                          >
                            {cardTypeConfig[row.flag.type].inlineCTA}
                          </button>
                        )}
                        {/* Assign dropdown */}
                        <div className="relative ml-auto" ref={assignRef}>
                          <button
                            onClick={() => setAssignOpen(o => !o)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition hover:bg-white"
                            style={{ border: "1px solid #E2E8F0", color: assignee ? "#0F172A" : "#64748B", backgroundColor: "#FFFFFF" }}
                          >
                            <Users className="w-3.5 h-3.5" />
                            {assignee ? TEAM_MEMBERS.find(m => m.id === assignee)?.name.split(" ")[0] : "Assign"}
                            <ChevronDown className="w-3 h-3" style={{ color: "#94A3B8" }} />
                          </button>
                          <AnimatePresence>
                            {assignOpen && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                className="absolute right-0 top-full mt-1 rounded-xl bg-white py-1 z-50"
                                style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", minWidth: 200 }}
                              >
                                <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider" style={{ color: "#94A3B8", fontWeight: 600 }}>Assign to</p>
                                {TEAM_MEMBERS.map(m => (
                                  <button
                                    key={m.id}
                                    onClick={() => { setAssignee(m.id); setAssignOpen(false); }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                                  >
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0" style={{ backgroundColor: assignee === m.id ? "#DBEAFE" : "#F1F5F9", color: assignee === m.id ? "#2563EB" : "#64748B", fontWeight: 600 }}>
                                      {m.initials}
                                    </div>
                                    <div>
                                      <p className="text-[12px]" style={{ fontWeight: assignee === m.id ? 600 : 500, color: "#0F172A" }}>{m.name}</p>
                                      <p className="text-[10px]" style={{ color: "#94A3B8" }}>{m.role}</p>
                                    </div>
                                    {assignee === m.id && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" style={{ color: "#3B82F6" }} />}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button
                          onClick={() => { onFlagResolved?.(row.id); onClose(); }}
                          className="px-3 py-1.5 rounded-lg text-[13px] transition"
                          style={{ border: "1px solid #E2E8F0", color: "#94A3B8", backgroundColor: "#FFFFFF" }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <AiFieldLabel>Bank Metadata</AiFieldLabel>
                    <div className="mt-2 rounded-xl p-4 space-y-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                      {[
                        { label: "Bank Account", value: bankAccounts[row.method] || "Chase ··4892" },
                        { label: "Bank Description", value: `DEPOSIT ${row.payee.split(" ").pop()?.toUpperCase()} ${row.date.replace("Mar ", "03")}26`, mono: true },
                        { label: "Sync Status", value: "Plaid Verified", accent: true },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className="text-[13px]" style={{ color: "#94A3B8", fontWeight: 500 }}>{item.label}</span>
                          <span className={cn("text-[14px]", item.mono && "font-mono")} style={{ color: item.accent ? "#16A34A" : "#0F172A", fontWeight: 500 }}>
                            {item.accent && <span className="inline-block w-[6px] h-[6px] rounded-full mr-1.5" style={{ backgroundColor: "#4ADE80", verticalAlign: "middle" }} />}
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <AiFieldLabel>Why this was matched</AiFieldLabel>
                    <div className="mt-2 rounded-xl p-4" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                      <p className="text-[13px] leading-relaxed" style={{ color: "#475569" }}>{row.agentRationale}</p>
                    </div>
                  </div>

                  {linkedRecord && (
                    <div>
                      <AiFieldLabel>Linked Clio Record</AiFieldLabel>
                      <div className="mt-2 rounded-xl p-4" style={{ border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(145deg, #EFF6FF, #DBEAFE)" }}>
                            <Link2 className="w-4 h-4" style={{ color: "#3B82F6" }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 500 }}>{linkedRecord.type}</p>
                            <p className="text-[15px] mt-0.5" style={{ color: "#0F172A", fontWeight: 600 }}>{linkedRecord.label}</p>
                            <p className="text-[14px] mt-0.5" style={{ color: "#64748B", fontFeatureSettings: "'tnum'" }}>{linkedRecord.ref} · ${Math.abs(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "#CBD5E1" }} />
                        </div>
                        <button className="mt-3 text-[13px] flex items-center gap-1.5 transition-colors hover:text-blue-700" style={{ color: "#3B82F6", fontWeight: 500 }}>
                          <ArrowRightLeft className="w-3.5 h-3.5" /> Change Match
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <AiFieldLabel>Legal Attribution</AiFieldLabel>
                    <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid #F1F5F9" }}>
                      <div className="flex">
                        <div className="flex-1 p-4" style={{ borderRight: "1px solid #F1F5F9" }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <User className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                            <span className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 500 }}>Client</span>
                          </div>
                          <p className="text-[14px]" style={{ color: "#0F172A", fontWeight: 500 }}>{row.client}</p>
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Briefcase className="w-3.5 h-3.5" style={{ color: "#94A3B8" }} />
                            <span className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 500 }}>Matter</span>
                          </div>
                          <p className="text-[14px]" style={{ color: "#0F172A", fontWeight: 500 }}>{row.matter}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PDF Receipt + Billing Approval — shown for billable hard costs */}
                  {row.billable && (
                    <>
                      <div>
                        <AiFieldLabel>Attached Receipt</AiFieldLabel>
                        <div
                          className="mt-2 rounded-xl overflow-hidden"
                          style={{ border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
                        >
                          {/* PDF toolbar mock */}
                          <div className="flex items-center gap-2 px-3 py-2" style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                            <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#DC2626" }} />
                            <span className="text-[12px] flex-1 truncate" style={{ color: "#64748B", fontWeight: 500 }}>
                              ABC_Depositions_Invoice_{row.date.replace(" ", "_")}_2026.pdf
                            </span>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" style={{ color: "#94A3B8" }} />
                          </div>

                          {/* Mock PDF page */}
                          <div className="bg-white px-5 py-4 space-y-3" style={{ fontFamily: "serif" }}>
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-[15px]" style={{ fontWeight: 700, color: "#0F172A" }}>ABC Depositions Inc.</p>
                                <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>1420 Harbor Blvd, Suite 300 · San Francisco, CA 94107</p>
                                <p className="text-[11px]" style={{ color: "#64748B" }}>Tel: (415) 555-0182 · tax@abcdepositions.com</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[18px] uppercase tracking-widest" style={{ color: "#E2E8F0", fontWeight: 800, letterSpacing: "0.25em" }}>INVOICE</p>
                                <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>INV-2026-0341</p>
                                <p className="text-[11px]" style={{ color: "#94A3B8" }}>Mar 16, 2026</p>
                              </div>
                            </div>

                            <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                              <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: "#94A3B8", fontWeight: 600 }}>Bill To</p>
                              <p className="text-[12px]" style={{ color: "#0F172A", fontWeight: 600 }}>Morrison & Hart LLP</p>
                              <p className="text-[11px]" style={{ color: "#64748B" }}>Re: {row.matter} — {row.client}</p>
                            </div>

                            <table className="w-full text-[11px]" style={{ borderCollapse: "collapse" }}>
                              <thead>
                                <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                                  {["Description", "Hrs / Qty", "Unit Price", "Total"].map(h => (
                                    <th key={h} className="py-1.5 text-left last:text-right" style={{ color: "#94A3B8", fontWeight: 600, fontFamily: "sans-serif" }}>{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  { desc: "Video Deposition — Expert Witness (Dr. J. Park)", qty: "4.5 hrs", unit: "$200.00", total: "$900.00" },
                                  { desc: "Transcript & Certified Copy", qty: "1",      unit: "$250.00", total: "$250.00" },
                                  { desc: "Exhibit Handling & Binding",  qty: "1",      unit: "$100.00", total: "$100.00" },
                                ].map((item, i) => (
                                  <tr key={i} style={{ borderBottom: "1px solid #F8FAFC" }}>
                                    <td className="py-1.5 pr-2" style={{ color: "#475569" }}>{item.desc}</td>
                                    <td className="py-1.5 pr-2" style={{ color: "#64748B" }}>{item.qty}</td>
                                    <td className="py-1.5 pr-2" style={{ color: "#64748B" }}>{item.unit}</td>
                                    <td className="py-1.5 text-right" style={{ color: "#0F172A", fontWeight: 600 }}>{item.total}</td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot>
                                <tr style={{ borderTop: "1px solid #E2E8F0" }}>
                                  <td colSpan={3} className="pt-2 text-right pr-2" style={{ color: "#64748B", fontFamily: "sans-serif" }}>Total Due</td>
                                  <td className="pt-2 text-right" style={{ color: "#0F172A", fontWeight: 700, fontSize: 13 }}>$1,250.00</td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div>
                        <AiFieldLabel>Billing Approval</AiFieldLabel>
                        {row.status === "billed" ? (
                          /* ── APPROVED STATE (billed rows: hc1–hc4, l19, l20) ── */
                          <div
                            className="mt-2 rounded-xl p-4 space-y-3"
                            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#16A34A" }} />
                              <p className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>Approved by billing manager</p>
                            </div>

                            <div
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
                              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
                            >
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#FFFFFF", fontWeight: 700 }}
                              >
                                SM
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>Sarah Martinez</p>
                                <p className="text-[11px]" style={{ color: "#94A3B8" }}>
                                  Billing Manager · Approved {row.billedDate ?? "Mar 2026"}
                                </p>
                              </div>
                              {row.billingPaid ? (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] px-2 py-[3px] rounded-full flex-shrink-0"
                                  style={{ color: "#166534", backgroundColor: "#DCFCE7", fontWeight: 600 }}
                                >
                                  <DollarSign className="w-3 h-3" />
                                  Paid
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] px-2 py-[3px] rounded-full flex-shrink-0"
                                  style={{ color: "#92400E", backgroundColor: "#FEF3C7", fontWeight: 600 }}
                                >
                                  <Clock className="w-3 h-3" />
                                  Awaiting payment
                                </span>
                              )}
                            </div>

                            <p className="text-[12px] leading-relaxed" style={{ color: "#64748B" }}>
                              ${Math.abs(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} has been added to{" "}
                              <span style={{ fontWeight: 600, color: "#0F172A" }}>{row.client} — {row.matter}</span>{" "}
                              as a hard cost line item.
                            </p>
                          </div>
                        ) : confirmedBillable.has(row.id) ? (
                          /* ── NOTIFIED STATE (l17 after user confirms) ── */
                          <div
                            className="mt-2 rounded-xl p-4 space-y-3"
                            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
                          >
                            <div className="flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#0D9488" }} />
                              <p className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>Billing manager notified</p>
                            </div>

                            <div
                              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
                              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0" }}
                            >
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#FFFFFF", fontWeight: 700 }}
                              >
                                SM
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>Sarah Martinez</p>
                                <p className="text-[11px]" style={{ color: "#94A3B8" }}>Billing Manager · Notified today · Awaiting approval</p>
                              </div>
                              <span
                                className="inline-flex items-center gap-1 text-[11px] px-2 py-[3px] rounded-full flex-shrink-0"
                                style={{ color: "#0D9488", backgroundColor: "#F0FDFA", fontWeight: 600 }}
                              >
                                <Zap className="w-3 h-3" />
                                Auto-sent
                              </span>
                            </div>

                            <p className="text-[12px] leading-relaxed" style={{ color: "#64748B" }}>
                              ${Math.abs(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} will be added to{" "}
                              <span style={{ fontWeight: 600, color: "#0F172A" }}>{row.client} — {row.matter}</span>{" "}
                              as a hard cost line item once Sarah approves.
                            </p>
                          </div>
                        ) : (
                          /* ── PENDING STATE (l17 — flagged, awaiting confirmation) ── */
                          <div
                            className="mt-2 rounded-xl p-4 space-y-2.5"
                            style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
                          >
                            <div className="flex items-center gap-2">
                              <Zap className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#0D9488" }} />
                              <p className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>Auto-forwarded on confirmation</p>
                            </div>
                            <p className="text-[12px] leading-relaxed" style={{ color: "#64748B" }}>
                              Once you confirm this hard cost above, it will be automatically forwarded to{" "}
                              <span style={{ fontWeight: 600, color: "#0F172A" }}>Sarah Martinez</span> (Billing Manager) for approval.
                              The{" "}
                              <span style={{ fontWeight: 600, color: "#0F172A" }}>${Math.abs(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>{" "}
                              charge will then be added to{" "}
                              <span style={{ fontWeight: 600, color: "#0F172A" }}>{row.client} — {row.matter}</span>{" "}
                              as a billable line item. No further action is required from you.
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <AiFieldLabel>Accounting Category</AiFieldLabel>
                    <div className="mt-2 rounded-xl p-4 flex items-center justify-between" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px]" style={{ color: "#0F172A", fontWeight: 500 }}>{row.category}</span>
                        <Sparkles className="w-3 h-3" style={{ color: "#2DD4BF" }} />
                      </div>
                      <div className="relative group">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ backgroundColor: "#F1F5F9" }}>
                          <Lock className="w-3 h-3" style={{ color: "#94A3B8" }} />
                          <span className="text-[12px]" style={{ color: "#94A3B8", fontWeight: 500 }}>Locked</span>
                        </div>
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap" style={{ backgroundColor: "#0F172A", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                          <span className="text-[12px] text-gray-300">Locked to source record</span>
                          <div className="absolute bottom-0 right-4 translate-y-1/2 rotate-45 w-2 h-2" style={{ backgroundColor: "#0F172A" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-0">
                  <p className="text-[12px] mb-4" style={{ color: "#94A3B8", fontWeight: 600 }}>Transaction history</p>
                  <div className="relative">
                    <div className="absolute left-[15px] top-2 bottom-2 w-px" style={{ backgroundColor: "#E2E8F0" }} />
                    <div className="space-y-0">
                      {auditLog.map((entry, idx) => {
                        const Icon = entry.icon;
                        return (
                          <div key={idx} className="flex gap-4 pb-6 last:pb-0 relative">
                            <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10" style={{ backgroundColor: "#FFFFFF", border: "2px solid #E2E8F0" }}>
                              <Icon className="w-3.5 h-3.5" style={{ color: entry.color }} />
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[13px]" style={{ color: "#94A3B8", fontWeight: 500, fontFeatureSettings: "'tnum'" }}>{entry.time}</span>
                                <span className="text-[12px] px-2 py-[1px] rounded-md" style={{ backgroundColor: "#F1F5F9", color: "#64748B", fontWeight: 500 }}>{entry.agent}</span>
                              </div>
                              <p className="text-[14px] leading-relaxed" style={{ color: "#0F172A" }}>{entry.event}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat */}
            <div className="flex-shrink-0" style={{ borderTop: "1px solid #F1F5F9" }}>
              {/* Chat thread */}
              {chatMessages.length > 0 && (
                <div className="px-5 pt-4 pb-2 space-y-3 max-h-48 overflow-y-auto">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
                        style={msg.role === "ai"
                          ? { background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#FFFFFF" }
                          : { backgroundColor: "#EFF6FF", color: "#2563EB", fontWeight: 700 }}
                      >
                        {msg.role === "ai" ? <Sparkles className="w-3 h-3" /> : "JH"}
                      </div>
                      <div
                        className="rounded-xl px-3 py-2 text-[13px] leading-relaxed max-w-[80%]"
                        style={msg.role === "ai"
                          ? { backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9", color: "#475569" }
                          : { background: "linear-gradient(135deg, #3B82F6, #6366F1)", color: "#FFFFFF" }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested prompts when no messages yet */}
              {chatMessages.length === 0 && (
                <div className="px-5 pt-3 pb-1 flex flex-wrap gap-1.5">
                  {["Why was this flagged?", "Who handles trust issues?", "Show similar transactions"].map(q => (
                    <button
                      key={q}
                      onClick={() => { setChatInput(q); }}
                      className="text-[12px] px-2.5 py-1 rounded-full transition-colors hover:bg-blue-50"
                      style={{ border: "1px solid #E2E8F0", color: "#64748B" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="px-5 py-3 flex items-center gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") sendChat(); }}
                  placeholder="Ask about this transaction…"
                  className="flex-1 text-[13px] px-3 py-2 rounded-xl outline-none transition-all"
                  style={{ border: "1px solid #E2E8F0", backgroundColor: "#F8FAFC", color: "#0F172A" }}
                />
                <button
                  onClick={sendChat}
                  disabled={!chatInput.trim()}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                  style={{
                    background: chatInput.trim() ? "linear-gradient(135deg, #3B82F6, #6366F1)" : "#F1F5F9",
                    color: chatInput.trim() ? "#FFFFFF" : "#94A3B8",
                  }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* TXN id footer */}
              <div className="px-5 pb-3 flex items-center justify-between">
                <span className="text-[11px] font-mono" style={{ color: "#CBD5E1" }}>TXN-{row.id.toUpperCase()} · {row.method}</span>
                <span className="text-[11px]" style={{ color: "#CBD5E1" }}>Plaid Sync: 10:02 AM</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTELLIGENCE DRAWER — slides over ledger from right
   ════════════���══════════════════════════════════════════════════════════════ */

function IntelligenceDrawer({ isOpen, onClose, item }: {
  isOpen: boolean;
  onClose: () => void;
  item: ActionItem | null;
}) {
  const [selectedChoice, setSelectedChoice] = React.useState<string | null>(null);
  const [expandedCard, setExpandedCard] = React.useState<string | null>(null);
  const [showSearch, setShowSearch] = React.useState(false);

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
            style={{ backgroundColor: "rgba(15,23,42,0.08)" }}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 z-40 flex flex-col bg-white"
            style={{
              width: "min(480px, 60%)",
              boxShadow: "-8px 0 32px rgba(15,23,42,0.08), -2px 0 8px rgba(15,23,42,0.04)",
              borderLeft: "1px solid #E2E8F0",
              borderColor: "#E2E8F0",
            }}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: "1px solid #F1F5F9", borderColor: "#F1F5F9" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(145deg, #0F172A, #334155)" }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>Transaction Intelligence</p>
                  <p className="text-[10px]" style={{ color: "#94A3B8" }}>Narrative Matching Engine</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
              >
                <X className="w-4 h-4" style={{ color: "#94A3B8" }} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Narrative */}
              <div className="mb-6">
                <p className="text-[13px] leading-relaxed" style={{ color: "#475569" }}>
                  I found <span style={{ fontWeight: 600, color: "#0F172A" }}>two matching $500 records</span> between May 1 – June 6. Which one is the correct match for this deposit?
                </p>
              </div>

              {/* Reference Item */}
              <div
                className="p-3 rounded-lg mb-5 flex items-center justify-between"
                style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}
              >
                <div>
                  <p className="text-[10px]" style={{ color: "#94A3B8", fontWeight: 600 }}>Source transaction</p>
                  <p className="text-[12px] mt-0.5" style={{ color: "#0F172A", fontWeight: 500 }}>$500.00 Deposit — "Doe"</p>
                  <p className="text-[10px] mt-0.5 font-mono" style={{ color: "#94A3B8" }}>DEPOSIT DOE 050126</p>
                </div>
                <span className="text-[10px]" style={{ color: "#CBD5E1" }}>BOA ••7721</span>
              </div>

              {/* Choice Cards */}
              <div className="space-y-3">
                <p className="text-[10px] mb-2" style={{ color: "#94A3B8", fontWeight: 600 }}>
                  Candidate matches
                </p>
                {choiceCards.map((card) => {
                  const isChosen = selectedChoice === card.id;
                  const isExpanded = expandedCard === card.id;

                  return (
                    <div key={card.id}>
                      <div
                        onClick={() => setSelectedChoice(card.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedChoice(card.id); }}
                        className={cn(
                          "w-full text-left rounded-xl transition-all cursor-pointer",
                          isChosen ? "ring-[1.5px] ring-blue-400" : ""
                        )}
                        style={{
                          padding: "14px 16px",
                          border: isChosen ? "1px solid #93C5FD" : "1px solid #E2E8F0",
                          backgroundColor: isChosen ? "#F0F7FF" : "#FFFFFF",
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {isChosen && (
                              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}
                            <span className="text-[13px]" style={{ fontWeight: 600, color: "#0F172A" }}>{card.label}</span>
                          </div>
                          {/* Confidence */}
                          <div className="flex items-center gap-1.5">
                            <div className="h-[5px] w-14 rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${card.confidence}%`,
                                  backgroundColor: card.confidence > 80 ? "#4ADE80" : "#FBBF24",
                                }}
                              />
                            </div>
                            <span className="text-[10px]" style={{ color: "#94A3B8", fontFeatureSettings: "'tnum'" }}>{card.confidence}%</span>
                          </div>
                        </div>
                        <p className="text-[11px]" style={{ color: "#64748B" }}>{card.detail}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px]" style={{ color: "#94A3B8" }}>
                          <span>{card.matter}</span>
                          <span>·</span>
                          <span>{card.date}</span>
                          <span>·</span>
                          <span style={{ fontWeight: 500, color: "#0F172A" }}>{card.amount}</span>
                        </div>

                        {/* View Detail Link */}
                        <span
                          className="mt-2 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          style={{ color: "#3B82F6", fontWeight: 500 }}
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCard(isExpanded ? null : card.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              setExpandedCard(isExpanded ? null : card.id);
                            }
                          }}
                        >
                          <ChevronDown className={cn("w-3 h-3 transition-transform", isExpanded && "rotate-180")} />
                          {isExpanded ? "Hide Detail" : "View Detail"}
                        </span>
                      </div>

                      {/* Detail Expansion */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div
                              className="mx-1 mt-1 p-3 rounded-lg space-y-2"
                              style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}
                            >
                              {[
                                { label: "Bank String", value: card.bankString, mono: true },
                                { label: "Invoice / Ref", value: card.invoiceRef },
                                { label: "Matter", value: card.matter },
                                { label: "Date", value: card.date },
                              ].map((row) => (
                                <div key={row.label} className="flex items-center gap-3">
                                  <span className="text-[10px] w-20 flex-shrink-0" style={{ color: "#94A3B8", fontWeight: 500 }}>{row.label}</span>
                                  <span className={cn("text-[11px]", row.mono && "font-mono text-[10px]")} style={{ color: "#0F172A" }}>{row.value}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Confirm action */}
                      <AnimatePresence>
                        {isChosen && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="mt-2 ml-1"
                          >
                            <Button size="sm" className="text-[11px] px-4 h-8" style={{ backgroundColor: "#0F172A", color: "white" }}>
                              <Check className="w-3 h-3 mr-1.5" />
                              Confirm Match
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Escape Hatch */}
              <div className="mt-6 pt-4" style={{ borderTop: "1px solid #F1F5F9", borderColor: "#F1F5F9" }}>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-[11px] flex items-center gap-1.5 transition-colors"
                  style={{ color: "#3B82F6", fontWeight: 500 }}
                >
                  <Search className="w-3 h-3" />
                  Not the correct record? Find Another Match
                </button>
                <AnimatePresence>
                  {showSearch && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="Search by client, invoice, or amount…"
                        className="w-full text-[12px] rounded-lg px-3 py-2.5 outline-none transition-all"
                        style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#0F172A" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Drawer Footer */}
            <div
              className="flex items-center justify-between px-6 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid #F1F5F9", borderColor: "#F1F5F9", backgroundColor: "#FAFBFC" }}
            >
              <span className="text-[10px] font-mono" style={{ color: "#CBD5E1" }}>Bank: "DEPOSIT DOE 050126"</span>
              <span className="text-[10px]" style={{ color: "#CBD5E1" }}>Plaid Sync: 10:02 AM</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   TEAMMATE MOCK DATA
   ═══════════════════════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT — Three-Column Horizontal Layout
   ═══════════════════════════════════════════════════════════════════════════ */

interface Toast {
  id: string;
  message: string;
  payee: string;
  amount: string;
  variant?: "default" | "reconciled";
  subtext?: string;
  duration?: number;
}

export function UnifiedTransactionInbox({ onOpenRail, initialFilter = "all", onNavigateToConnections }: { onOpenRail?: () => void; initialFilter?: "all" | "critical" | "high" | "medium" | "low"; onNavigateToConnections?: () => void }) {
  const [ledger, setLedger] = React.useState(ledgerData);
  const [editedCategories, setEditedCategories] = React.useState<Set<string>>(new Set());
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [newRowId, setNewRowId] = React.useState<string | null>(null);

  const flaggedCount = React.useMemo(() => ledger.filter(r => r.flag).length, [ledger]);

  const addToast = (toast: Toast) => {
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, toast.duration || 5000);
  };

  const handleFlagResolved = (rowId: string) => {
    const row = ledger.find(r => r.id === rowId);
    setLedger((prev) => prev.map((r) => r.id === rowId ? { ...r, flag: undefined } : r));
    addToast({
      id: `toast-${Date.now()}`,
      message: "Flag resolved",
      payee: row?.payee || "Transaction",
      amount: row ? `$${Math.abs(row.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "",
    });
  };

  const updateLedgerField = (id: string, field: "payee" | "category" | "matter", value: string) => {
    setLedger((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleCategoryEdit = (id: string) => {
    setEditedCategories((prev) => new Set(prev).add(id));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden" style={{ backgroundColor: "#F9FAFB" }}>
      <HeaderBar flaggedCount={flaggedCount} onOpenTeammate={onOpenRail} />
      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 overflow-hidden relative">
          <UnifiedLedger
            ledger={ledger}
            updateField={updateLedgerField}
            showReconcile
            editedCategories={editedCategories}
            onCategoryEdit={handleCategoryEdit}
            highlightRowId={newRowId}
            initialFlaggedCount={INITIAL_FLAGGED_COUNT}
            onFlagResolved={handleFlagResolved}
            flaggedCount={flaggedCount}
            initialFilter={initialFilter}
            onBannerAction={(type) => {
              if (type === "bank_disconnect" && onNavigateToConnections) {
                onNavigateToConnections();
              } else {
                addToast({
                  id: `toast-${Date.now()}`,
                  message: "Opening trust allocation…",
                  payee: "IOLTA Trust ··7721",
                  amount: "$1,250.00",
                });
              }
            }}
            onCloseMonth={() => {
              addToast({
                id: `toast-${Date.now()}`,
                message: "March 2026 closed",
                payee: "All 1,847 transactions reconciled",
                amount: "",
                variant: "reconciled",
                subtext: "Zero-day reconciliation achieved · Books are closed",
                duration: 6000,
              });
            }}
          />
        </div>
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                border: toast.variant === "reconciled" ? "1px solid #BBF7D0" : "1px solid #E2E8F0",
                backgroundColor: toast.variant === "reconciled" ? "#F0FDF4" : "#FFFFFF",
                minWidth: toast.variant === "reconciled" ? 380 : 320,
              }}
            >
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  width: toast.variant === "reconciled" ? 40 : 32,
                  height: toast.variant === "reconciled" ? 40 : 32,
                  background: toast.variant === "reconciled"
                    ? "linear-gradient(145deg, #4ADE80, #22C55E)"
                    : "linear-gradient(145deg, #D1FAE5, #A7F3D0)",
                }}
              >
                {toast.variant === "reconciled" ? (
                  <CheckCheck className="w-5 h-5" style={{ color: "#FFFFFF" }} />
                ) : (
                  <Check className="w-4 h-4" style={{ color: "#059669" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px]" style={{ fontWeight: 600, color: toast.variant === "reconciled" ? "#166534" : "#0F172A" }}>{toast.message}</p>
                <p className="text-[12px]" style={{ color: toast.variant === "reconciled" ? "#15803D" : "#64748B" }}>
                  {toast.variant === "reconciled" ? toast.payee : `${toast.payee} · ${toast.amount}`}
                </p>
                {toast.subtext && (
                  <p className="text-[11px] mt-1" style={{ color: "#16A34A", lineHeight: 1.4 }}>{toast.subtext}</p>
                )}
              </div>
              <button
                onClick={() => { setToasts((prev) => prev.filter((t) => t.id !== toast.id)); }}
                className="text-[12px] px-2.5 py-1 rounded-md transition-colors flex-shrink-0 whitespace-nowrap"
                style={{
                  color: toast.variant === "reconciled" ? "#16A34A" : "#3B82F6",
                  fontWeight: 600,
                }}
              >
                {toast.variant === "reconciled" ? "View reconciliation →" : "View in books →"}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Teal Pulse Keyframes */}
      <style>{`
        @keyframes tealPulse {
          0% { background-color: #CCFBF1; color: #0F766E; }
          40% { background-color: #99F6E4; color: #0D9488; }
          100% { background-color: transparent; color: inherit; }
        }
      `}</style>
    </div>
  );
}