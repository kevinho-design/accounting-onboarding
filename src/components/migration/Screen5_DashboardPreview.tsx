import * as React from "react";
import { CheckCircle, ArrowRight, Copy, ShieldAlert, Tag, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

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

export function Screen5_DashboardPreview({ onComplete, onBack }: Screen5Props) {
  return (
    <div className="flex-1 h-[calc(100vh-90px)] overflow-hidden bg-gray-50">
      <div className="h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-16">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-3">
              Welcome to Clio Accounting, Jennifer
            </h1>
            <p className="text-lg text-gray-500">
              Your migration is complete. You're starting with a fully configured system—not a blank slate.
            </p>
          </div>

          {/* Stats card */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 mb-6">
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
          </div>

          {/* Attention items */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-gray-900">Just 14 items need a human call</span>
                  <p className="text-xs text-gray-500 mt-0.5">Everything else was handled automatically. We'll guide you through each one.</p>
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

          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-700 px-4 py-6 shrink-0">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              onClick={onComplete}
              size="lg"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-semibold text-lg"
            >
              Continue to Configuration
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}