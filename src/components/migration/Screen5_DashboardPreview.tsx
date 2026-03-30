import * as React from "react";
import { ArrowRight, Copy, ShieldAlert, Tag, FileCheck, CheckCircle2 as CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { MigrationReportModal } from "../MigrationReportModal";

interface Screen5Props {
  onComplete: () => void;
  onBack?: () => void;
}

const attentionItems = [
  {
    icon: Copy,
    count: 8,
    label: "Possible duplicate vendors",
    description: "We found vendor records that may be the same entity under different names.",
    action: "We'll help you merge them",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    icon: Tag,
    count: 4,
    label: "Transactions needing a category",
    description: "These couldn't be auto-matched with high confidence. One quick confirmation each.",
    action: "Takes about 2 minutes",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    icon: ShieldAlert,
    count: 2,
    label: "Trust items to review",
    description: "Two transactions flagged against Delaware IOLTA rules. Suggested fixes are ready.",
    action: "Fixes are pre-drafted",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    iconBg: "bg-red-100",
  },
];

export function Screen5_DashboardPreview({ onComplete }: Screen5Props) {
  const [showReport, setShowReport] = React.useState(false);

  return (
    <>
    <div className="flex-1 min-h-[calc(100vh-90px)] bg-gray-50">
      <div className="max-w-3xl mx-auto px-8 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-100">
              <FileCheck className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Migration Health Report
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Migration Complete
              </h1>
            </div>
          </div>
          <p className="text-gray-500 text-base leading-relaxed">
            Here's everything we migrated from QuickBooks and what still needs your review. Once you confirm these items, we'll configure your system.
          </p>
        </div>

        {/* Stats card */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-5">
          <p className="text-sm text-blue-100 mb-6">
            12 years of Hartwell & Morris history is intact and immediately queryable. We trained an AI model on your firm's patterns and pre-configured everything for Delaware litigation practice.
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-semibold text-white mb-1">99.3%</div>
              <div className="text-sm text-blue-100">Data auto-imported</div>
            </div>
            <div className="text-center border-x border-white/20">
              <div className="text-4xl font-semibold text-white mb-1">34,520</div>
              <div className="text-sm text-blue-100">Transactions migrated</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-semibold text-white mb-1">127</div>
              <div className="text-sm text-blue-100">Vendors imported</div>
            </div>
          </div>
          <button
            onClick={() => setShowReport(true)}
            className="mt-6 w-full text-center text-sm text-blue-100 hover:text-white underline underline-offset-2 transition-colors"
          >
            View full migration report
          </button>
        </div>

        {/* What was done automatically */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Handled automatically</p>
            <p className="text-xs text-gray-500 mt-0.5">No action needed from you</p>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { label: "Chart of accounts mapped to Clio's legal-optimized structure", detail: "49 of 52 accounts auto-mapped · 3 confirmed via review" },
              { label: "Delaware IOLTA compliance rules configured", detail: "State-specific rules, reporting requirements, and trust monitoring active" },
              { label: "Transaction history imported and categorized", detail: "34,382 transactions matched at 99.6% confidence" },
              { label: "AI model trained on your firm's patterns", detail: "Ready to auto-match future transactions against Hartwell & Morris history" },
              { label: "Vendor profiles enriched", detail: "127 vendors imported · contact data, payment patterns, and categories applied" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 px-6 py-4">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attention items */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">14 items need your input</p>
                <p className="text-xs text-gray-500 mt-0.5">Clio Accounting will walk you through each one when you're ready.</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1">
                <span className="text-xs font-semibold text-amber-700">Queued for review</span>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {attentionItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4 px-6 py-5">
                  <div className={`w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold ${item.color}`}>{item.count}</span>
                      <span className="text-sm font-medium text-gray-900">{item.label}</span>
                    </div>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                  <span className={`text-xs font-medium ${item.color} whitespace-nowrap mt-0.5`}>{item.action}</span>
                </div>
              );
            })}
          </div>
        </div>

        <Button
          onClick={onComplete}
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-semibold text-lg"
        >
          Continue to Configuration
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

      </div>
    </div>

    <MigrationReportModal isOpen={showReport} onClose={() => setShowReport(false)} />
  </>
  );
}
