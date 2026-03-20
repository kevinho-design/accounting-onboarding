import * as React from "react";
import { FileText, Calendar, Mail, Sparkles, CheckCircle, Plus, X, Send, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";
import { ConfigModeToggle } from "./ConfigModeToggle";
import { WizardProgress } from "./WizardProgress";

interface Screen9Props {
  onComplete: () => void;
  onBack?: () => void;
}

interface Rule {
  id: string;
  text: string;
  suggested?: boolean;
}

const SUGGESTED_RULES: Rule[] = [
  { id: "s1", text: "Email the P&L and cash flow report to all partners on the 1st of each month", suggested: true },
  { id: "s2", text: "Send the IOLTA trust ledger to Jennifer every Monday morning", suggested: true },
  { id: "s3", text: "Alert the managing partner if realization rate drops below 85%", suggested: true },
];

const EXAMPLE_PLACEHOLDERS = [
  "Email a weekly AR aging report to the CFO every Friday",
  "Send a quarterly profit summary to all partners before board meetings",
  "Notify me when any report hasn't been reviewed within 7 days",
  "Generate a practice area profitability report at the end of each quarter",
];

export function Screen9_ReportingPreferences({ onComplete, onBack }: Screen9Props) {
  const [mode, setMode] = React.useState<"suggested" | "advanced">("suggested");
  const [frequency, setFrequency] = React.useState("monthly");
  const [reports, setReports] = React.useState(["pl", "cashflow", "trust"]);
  const [delivery, setDelivery] = React.useState("both");
  const [rules, setRules] = React.useState<Rule[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [ruleAdded, setRuleAdded] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleReport = (reportId: string) => {
    if (reports.includes(reportId)) {
      setReports(reports.filter((r) => r !== reportId));
    } else {
      setReports([...reports, reportId]);
    }
  };

  const addRule = () => {
    const text = inputValue.trim();
    if (!text) return;
    setRules((prev) => [...prev, { id: Date.now().toString(), text }]);
    setInputValue("");
    setRuleAdded(true);
    setTimeout(() => setRuleAdded(false), 1500);
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addRule();
  };

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 my-8">
          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Step 3 of 4 · Reporting
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Reporting Preferences
            </h2>
            <p className="text-gray-600 text-lg">
              Configure which reports to generate and how to receive them.
            </p>
          </div>

          <WizardProgress currentStep={3} />

          <ConfigModeToggle mode={mode} onModeChange={setMode} />

          {mode === "suggested" ? (
            <div className="space-y-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Recommended Reporting Package</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Based on typical litigation firm needs and Delaware compliance requirements:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Monthly Reports</div>
                      <div className="text-sm text-gray-600">Generated on the 1st of each month</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Essential Report Suite</div>
                      <div className="text-sm text-gray-600">
                        Profit & Loss • Cash Flow • Trust Account Ledger (IOLTA required)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Email + Dashboard Delivery</div>
                      <div className="text-sm text-gray-600">
                        Partners receive via email and see in dashboard notifications
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 mb-8">

              {/* ── Natural language rules input ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Add a reporting preference in plain language
                </label>

                {/* Input row */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={EXAMPLE_PLACEHOLDERS[placeholderIndex]}
                    className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  <button
                    onClick={addRule}
                    disabled={!inputValue.trim()}
                    className="flex items-center gap-1.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {/* Confirmation */}
                {ruleAdded && (
                  <p className="text-xs text-green-600 font-medium mt-2 transition-opacity">Rule added</p>
                )}

                {/* Rule chips */}
                <div className="flex flex-col gap-2">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg group"
                    >
                      {rule.suggested ? (
                        <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="flex-1 text-sm text-gray-800">{rule.text}</span>
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  You can add, edit, or remove preferences anytime in{" "}
                  <span className="text-blue-500 font-medium">Settings → Reporting</span>
                </p>
              </div>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Or configure individually</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Report Frequency */}
              <div className="p-5 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold text-gray-900 mb-1">
                      How often should reports be generated?
                    </label>
                    <p className="text-sm text-gray-600 mb-3">Choose the frequency that works for your firm</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["weekly", "monthly", "quarterly"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFrequency(f)}
                      className={`p-3 rounded-lg capitalize transition-all ${
                        frequency === f
                          ? "bg-blue-600 text-white font-semibold shadow-sm"
                          : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Report Selection */}
              <div className="p-5 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold text-gray-900 mb-1">
                      Which reports do partners need?
                    </label>
                    <p className="text-sm text-gray-600 mb-3">
                      Select all reports to include in automated distribution
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { id: "pl", label: "Profit & Loss Statement", sub: "Revenue, expenses, and net income" },
                    { id: "cashflow", label: "Cash Flow Statement", sub: "Operating, investing, and financing activities" },
                    { id: "trust", label: "Trust Account Ledger", sub: "IOLTA compliance and client balances" },
                    { id: "balance", label: "Balance Sheet", sub: "Assets, liabilities, and equity" },
                    { id: "ar", label: "Accounts Receivable Aging", sub: "Outstanding invoices by age" },
                  ].map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={reports.includes(r.id)}
                        onChange={() => toggleReport(r.id)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{r.label}</div>
                        <div className="text-xs text-gray-600">{r.sub}</div>
                      </div>
                      {reports.includes(r.id) && <CheckCircle className="w-5 h-5 text-green-600" />}
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Method */}
              <div className="p-5 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold text-gray-900 mb-1">Preferred delivery method</label>
                    <p className="text-sm text-gray-600 mb-3">How should partners receive these reports?</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { value: "email", label: "Email only" },
                    { value: "dashboard", label: "Dashboard notification only" },
                    { value: "both", label: "Both email and dashboard (recommended)" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        checked={delivery === opt.value}
                        onChange={() => setDelivery(opt.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-900">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-700 px-4 py-6 shrink-0">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              Next: Financial Goals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
