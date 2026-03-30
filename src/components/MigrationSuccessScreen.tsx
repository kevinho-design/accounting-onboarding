import * as React from "react";
import { Button } from "./ui/button";
import { Check, Sparkles, Calendar, TrendingUp, Shield, CheckCircle } from "lucide-react";

interface MigrationSuccessScreenProps {
  onGoToAccounting: () => void;
}

export function MigrationSuccessScreen({ onGoToAccounting }: MigrationSuccessScreenProps) {
  const completionStats = [
    { label: "Accounts Mapped", value: "124", icon: CheckCircle },
    { label: "Transactions Reconciled", value: "14", icon: Check },
    { label: "Compliance Status", value: "100%", icon: Shield },
    { label: "Data Quality", value: "High", icon: TrendingUp },
  ];

  return (
    <div className="flex-1 bg-transparent overflow-y-auto">
      <div className="px-20 py-16">
        {/* Ambient Header - Transformed into Monday Morning Briefing */}
        <div className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wide text-green-700 mb-2">
                Monday Morning Briefing
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                Migration Complete
              </h1>
              <p className="text-[15px] font-medium text-gray-700 leading-relaxed">
                Opening balances reconciled. You are now <span className="text-green-700 font-semibold">100% compliant</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Success Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {completionStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* What's Next Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">What's Next</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">Weekly Financial Review</div>
                <div className="text-sm text-gray-600">
                  Firm Intelligence will prepare your weekly financial briefing every Monday at 8:00 AM
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">Realization Tracking Active</div>
                <div className="text-sm text-gray-600">
                  Your optimized chart of accounts enables 12% better realization reporting
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">Massachusetts Compliance</div>
                <div className="text-sm text-gray-600">
                  IOLTA and trust accounting rules automatically enforced
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean State Confirmation */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1C60FF] to-[#3C8AFF] flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Your Accounting is Now Production-Ready
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            All accounts are mapped, balances are reconciled, and your practice is compliant. 
            You can start managing your finances with confidence.
          </p>

          <Button 
            onClick={onGoToAccounting}
            className="bg-[#1C60FF] hover:bg-[#1550E0] text-white px-8 py-3 rounded-lg font-medium text-base"
          >
            Go to Accounting Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}