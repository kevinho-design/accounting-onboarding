import * as React from "react";
import {
  CheckCircle,
  Loader2,
  MessageSquare,
  AlertCircle,
  BarChart3,
  Users,
  ShieldCheck,
  Receipt,
  FileText,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { CloudBackground } from "./CloudBackground";
import { GalaxyNebula } from "./migration/animations/GalaxyNebula";
import { ConfigModeToggle } from "./migration/ConfigModeToggle";
import { motion, AnimatePresence } from "motion/react";

export type UploadStep = "processing" | "ai-questions" | "summary";

interface UploadFileFlowProps {
  onComplete: () => void;
  onStepChange?: (step: UploadStep) => void;
}


const AI_QUESTIONS = [
  {
    id: "trust",
    file: "trust_accounts.csv",
    question:
      "We found 47 retainer deposits that don't have a client matter code in column D. How should these be mapped?",
    type: "radio" as const,
    options: [
      "Use the matter name in column C (client name)",
      "Leave unmapped for manual review",
      "Create new matters using client name + 'Retainer'",
    ],
    defaultAnswer: 0,
  },
  {
    id: "vendor",
    file: "transactions_2025.csv",
    question:
      "We found 12 transactions from vendor 'LGL SVC' with no category. Is this your court filing service or a different vendor?",
    type: "radio" as const,
    options: [
      "Court filing / government fees — map to 'Court Costs'",
      "Legal research service — map to 'Research Expenses'",
      "Other — I'll categorize manually",
    ],
    defaultAnswer: 0,
  },
  {
    id: "currency",
    file: "chart_of_accounts.csv",
    question:
      "Your chart of accounts includes entries in both USD and CAD. Which should be your primary reporting currency?",
    type: "radio" as const,
    options: ["USD (US Dollars)", "CAD (Canadian Dollars)"],
    defaultAnswer: 0,
  },
];

const PROCESSING_STEPS = [
  { label: "Reading chart_of_accounts.csv", result: "Parsed 312 accounts" },
  { label: "Parsing 34,279 transactions", result: "Mapped 99.3% automatically" },
  { label: "Importing client & vendor records", result: "974 records enriched" },
  { label: "Scanning trust account entries", result: "2,341 entries detected" },
  { label: "Cross-referencing client ledgers", result: "47 items need clarification" },
];

const SUMMARY_CARDS = [
  { icon: BarChart3, label: "Accounts", value: "312", sub: "chart of accounts", color: "text-blue-600 bg-blue-50" },
  { icon: Receipt, label: "Transactions", value: "34,279", sub: "99.3% auto-mapped", color: "text-emerald-600 bg-emerald-50" },
  { icon: Users, label: "Clients", value: "847", sub: "client records", color: "text-purple-600 bg-purple-50" },
  { icon: FileText, label: "Vendors", value: "127", sub: "vendors enriched", color: "text-orange-600 bg-orange-50" },
  { icon: ShieldCheck, label: "Trust Entries", value: "2,341", sub: "IOLTA transactions", color: "text-teal-600 bg-teal-50" },
  { icon: Receipt, label: "Invoices", value: "1,893", sub: "billing records", color: "text-pink-600 bg-pink-50" },
];


// ─── Step 1: Processing Animation ───────────────────────────────────────────

function ProcessingAnimation({ onComplete }: { onComplete: () => void }) {
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    PROCESSING_STEPS.forEach((_, i) => {
      setTimeout(() => setCompletedSteps((prev) => [...prev, i]), (i + 1) * 700);
    });

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 1.5;
      });
    }, 50);

    const finalTimer = setTimeout(onComplete, PROCESSING_STEPS.length * 700 + 800);
    return () => { clearInterval(interval); clearTimeout(finalTimer); };
  }, [onComplete]);

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 scale-[3] pointer-events-none">
            <GalaxyNebula />
          </div>

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full p-10">
            <div className="text-center mb-8">
              <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
                Import Data • Processing
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Reading Your Files
              </h2>
              <p className="text-gray-500">
                Parsing and analyzing your exported data…
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Processing</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step checklist */}
            <div className="space-y-3">
              {PROCESSING_STEPS.map((step, i) => {
                const done = completedSteps.includes(i);
                const active = !done && completedSteps.length === i;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {done ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : active ? (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${done || active ? "text-gray-900" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                      {done && (
                        <p className="text-xs text-emerald-600 font-medium mt-0.5">{step.result}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: AI Questions ────────────────────────────────────────────────────

function AIQuestions({ onComplete }: { onComplete: () => void }) {
  const [answers, setAnswers] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(AI_QUESTIONS.map((q) => [q.id, q.defaultAnswer]))
  );
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(onComplete, 1400);
  };

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Import Data • Clarification
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                A few quick questions before we finish
              </h2>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-8 ml-12">
            Initial scan complete. We found a few things in your files that need clarification so we can process them correctly.
          </p>

          {/* Question cards */}
          <div className="space-y-5 mb-8">
            {AI_QUESTIONS.map((q) => (
              <div key={q.id} className="border border-gray-200 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <span className="mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide flex-shrink-0">
                    {q.file}
                  </span>
                  <p className="text-sm font-medium text-gray-800">{q.question}</p>
                </div>
                <div className="space-y-2 ml-1">
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-all ${
                        answers[q.id] === oi
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === oi}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: oi }))}
                        className="accent-blue-600 flex-shrink-0"
                      />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-sm font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Applying your answers…
              </>
            ) : (
              <>
                Continue Processing
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Summary ─────────────────────────────────────────────────────────

const AMBIGUOUS_ACCOUNTS = [
  {
    csvName: "Professional Svcs Expense",
    suggestedMapping: "Expert Witness Fees",
    alternates: ["Consulting Fees", "Contract Attorney Fees", "General Professional Services"],
    reason: "Based on vendor names in column B, 71% of charges are from known expert witness providers.",
  },
  {
    csvName: "Misc Operating Costs",
    suggestedMapping: "Court Filing Fees",
    alternates: ["Office Expense", "Administrative Costs", "General Operating"],
    reason: "Transaction descriptions contain 'filing', 'clerk', and 'docket' in 68% of rows.",
  },
  {
    csvName: "Technology & Software",
    suggestedMapping: "Legal Technology & Software",
    alternates: ["IT Services", "Software Subscriptions", "General Technology"],
    reason: "90% of vendors are legal-specific providers (Westlaw, Clio, LexisNexis, etc.).",
  },
];

const FLAGGED_TRANSACTIONS = [
  {
    date: "Jan 15, 2025",
    amount: "$2,450.00",
    description: "Transfer to Operating Account",
    file: "trust_accounts.csv",
    issue: "Missing client disbursement authorization",
    fix: "Link to Matter #2847 disbursement authorization dated Jan 14, 2025",
  },
  {
    date: "Feb 3, 2025",
    amount: "$850.00",
    description: "Wire Transfer Fee",
    file: "transactions_2025.csv",
    issue: "Fee withdrawn from trust instead of operating",
    fix: "Reclassify as operating expense and add corresponding trust-to-operating transfer",
  },
  {
    date: "Mar 8, 2025",
    amount: "$12,000.00",
    description: "Client Deposit – Williams Estate",
    file: "trust_accounts.csv",
    issue: "Exceeds $10,000 CTR threshold without documentation",
    fix: "Flag for CTR compliance review and attach IRS Form 8300 if not already filed",
  },
  {
    date: "Apr 22, 2025",
    amount: "$3,200.00",
    description: "Refund to Client – Thompson",
    file: "trust_accounts.csv",
    issue: "Trust balance went negative for 2 days after this transaction",
    fix: "Reorder transactions chronologically or add a note explaining coverage",
  },
  {
    date: "Jun 30, 2025",
    amount: "$175.00",
    description: "Monthly Service Charge",
    file: "trust_accounts.csv",
    issue: "Bank fees should not be deducted from IOLTA account",
    fix: "Reclassify as operating expense per IOLTA rules",
  },
];

function ImportSummary({ onReview, onBack }: { onReview: () => void; onBack: () => void }) {
  const [mode, setMode] = React.useState<"suggested" | "advanced">("suggested");
  const [expandedAccount, setExpandedAccount] = React.useState<number | null>(null);
  const [expandedTxn, setExpandedTxn] = React.useState<number | null>(null);

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-10 my-8">

          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Import Data • Migration Intelligence
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Your CSV Data is Ready to Import
            </h2>
            <p className="text-gray-600 text-lg">
              We've parsed all 6 files and applied your answers. Review the results before finalizing.
            </p>
          </div>

          <ConfigModeToggle mode={mode} onModeChange={setMode} />

          {mode === "suggested" ? (
            <div className="space-y-6 mb-8">
              {/* KPI row */}
              <div className="grid grid-cols-6 gap-3">
                {SUMMARY_CARDS.map((card) => (
                  <div key={card.label} className="rounded-xl border border-gray-100 p-4">
                    <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                      <card.icon className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">{card.label}</p>
                    <p className="text-xs text-gray-400">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* Summary card */}
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Migration Intelligence Complete</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Our AI has processed your uploaded files and enriched them with your Clio Manage profile:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Firm Profile Recognised</p>
                      <p className="text-sm text-gray-600">Delaware • Litigation, Real Estate, Family Law • 52 attorneys — imported from Clio Manage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Delaware IOLTA Compliance Configured</p>
                      <p className="text-sm text-gray-600">State-specific rules applied • 2,341 trust entries validated against client ledgers from Clio Manage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Chart of Accounts Mapped</p>
                      <p className="text-sm text-gray-600">309 of 312 accounts automatically mapped (99%) • 3 need review</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Transactions Imported</p>
                      <p className="text-sm text-gray-600">34,279 of 34,520 transactions processed (99.3%) • 241 flagged</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Client & Vendor Records Enriched</p>
                      <p className="text-sm text-gray-600">974 records matched and merged with matters and contacts from Clio Manage</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-blue-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Recommendation:</span> We suggest applying all automated fixes to ensure 100% accuracy. This will resolve the 3 unmapped accounts and correct 5 flagged trust transactions based on your IOLTA rules and Clio Manage matter data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {/* KPI row */}
              <div className="grid grid-cols-6 gap-3">
                {SUMMARY_CARDS.map((card) => (
                  <div key={card.label} className="rounded-xl border border-gray-100 p-4">
                    <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                      <card.icon className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs font-semibold text-gray-700 mb-0.5">{card.label}</p>
                    <p className="text-xs text-gray-400">{card.sub}</p>
                  </div>
                ))}
              </div>

              {/* Firm profile + IOLTA row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Firm Profile</h3>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">From Clio Manage</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Jurisdiction", value: "Delaware" },
                      { label: "Practice areas", value: "Litigation, Real Estate, Family Law" },
                      { label: "Firm size", value: "52 attorneys" },
                      { label: "AI personalisation", value: "Custom ML model built" },
                    ].map((item) => (
                      <div key={item.label} className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-5 h-5 text-teal-600" />
                    <h3 className="font-semibold text-gray-900">IOLTA Configuration</h3>
                    <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-700">Auto-configured</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "State rules applied", value: "Delaware IOLTA Program" },
                      { label: "Reporting requirements", value: "Annual reconciliation enabled" },
                      { label: "Client ledgers matched", value: "847 clients from Clio Manage" },
                      { label: "Compliance status", value: "2,336 of 2,341 entries valid" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">{item.label}</p>
                        <p className="text-xs font-semibold text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Two-column detail */}
              <div className="grid grid-cols-2 gap-4">
                {/* Unmapped accounts */}
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Chart of Accounts</h3>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-semibold text-gray-900">309 of 312</span>
                    </div>
                    <p className="text-sm text-gray-600">Automatically mapped</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2">3 accounts need review:</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {AMBIGUOUS_ACCOUNTS.map((acct, i) => (
                      <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                        <button
                          onClick={() => setExpandedAccount(expandedAccount === i ? null : i)}
                          className="w-full p-3 flex items-center justify-between hover:bg-blue-50 transition-colors text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{acct.csvName}</p>
                            <p className="text-xs text-blue-600 truncate">→ {acct.suggestedMapping}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-2 transition-transform ${expandedAccount === i ? "rotate-180" : ""}`} />
                        </button>
                        {expandedAccount === i && (
                          <div className="px-3 pb-3 bg-blue-50">
                            <div className="p-3 bg-white rounded-lg mb-2">
                              <p className="text-xs font-semibold text-blue-900 mb-1">Why this mapping?</p>
                              <p className="text-xs text-gray-700">{acct.reason}</p>
                            </div>
                            <select className="w-full p-2 text-sm bg-white rounded-lg border border-gray-200">
                              <option>{acct.suggestedMapping} (AI suggested)</option>
                              {acct.alternates.map((alt, j) => <option key={j}>{alt}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flagged transactions */}
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Trust Transactions</h3>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-semibold text-gray-900">2,336 of 2,341</span>
                    </div>
                    <p className="text-sm text-gray-600">IOLTA compliant</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2">5 transactions need fixes:</p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {FLAGGED_TRANSACTIONS.map((txn, i) => (
                      <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
                        <button
                          onClick={() => setExpandedTxn(expandedTxn === i ? null : i)}
                          className="w-full p-3 flex items-center justify-between hover:bg-blue-50 transition-colors text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{txn.description}</p>
                            <p className="text-xs text-gray-500">{txn.date} • {txn.amount}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-2 transition-transform ${expandedTxn === i ? "rotate-180" : ""}`} />
                        </button>
                        {expandedTxn === i && (
                          <div className="px-3 pb-3 bg-blue-50">
                            <div className="p-3 bg-white rounded-lg">
                              <p className="text-xs font-semibold text-blue-900 mb-1">✨ AI Fix:</p>
                              <p className="text-xs text-gray-700">{txn.fix}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-700 px-4 py-6 shrink-0">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={onReview}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              {mode === "suggested" ? "Apply All Changes" : "Apply Changes"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={onReview}
              variant="outline"
              className="px-8 py-6 rounded-lg font-medium"
            >
              Skip for Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Orchestrator ─────────────────────────────────────────────────────────────

export function UploadFileFlow({ onComplete, onStepChange }: UploadFileFlowProps) {
  const [step, setStep] = React.useState<UploadStep>("processing");

  const goTo = (next: UploadStep) => {
    setStep(next);
    onStepChange?.(next);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="flex-1 flex flex-col"
      >
        {step === "processing" && (
          <ProcessingAnimation onComplete={() => goTo("ai-questions")} />
        )}
        {step === "ai-questions" && (
          <AIQuestions onComplete={() => goTo("summary")} />
        )}
        {step === "summary" && (
          <ImportSummary onReview={onComplete} onBack={() => goTo("ai-questions")} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
