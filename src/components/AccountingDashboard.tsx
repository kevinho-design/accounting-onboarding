import * as React from "react";
import {
  DollarSign,
  TrendingUp,
  Shield,
  FileText,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { CloudBackground } from "./CloudBackground";

interface AccountingDashboardProps {
  showValueProp: boolean;
  onStartMigration: () => void;
  onDismiss: () => void;
}

export function AccountingDashboard({ showValueProp, onStartMigration, onDismiss }: AccountingDashboardProps) {
  const accountBalances = [
    { label: "Operating Account", value: "$124,580.32", change: "+12.5%", icon: DollarSign, color: "from-blue-500 to-blue-600" },
    { label: "Trust Account", value: "$89,234.67", change: "+8.2%", icon: Shield, color: "from-green-500 to-green-600" },
    { label: "Monthly Revenue", value: "$45,820.00", change: "+18.3%", icon: TrendingUp, color: "from-purple-500 to-purple-600" },
    { label: "Pending Reconciliations", value: "3", change: "", icon: AlertCircle, color: "from-orange-500 to-orange-600" },
  ];

  const quickActions = [
    { label: "Transactions", description: "View and manage all transactions", icon: FileText },
    { label: "Trust Accounting", description: "Manage trust account entries", icon: Shield },
    { label: "Reconciliation", description: "Reconcile your accounts", icon: CheckCircle },
    { label: "Reports", description: "Generate financial reports", icon: TrendingUp },
  ];

  const recentTransactions = [
    { date: "Mar 14, 2026", description: "Client Payment - Smith v. Johnson", amount: "+$5,200.00", type: "Operating" },
    { date: "Mar 13, 2026", description: "Trust Deposit - Williams Estate", amount: "+$12,000.00", type: "Trust" },
    { date: "Mar 12, 2026", description: "Office Rent Payment", amount: "-$3,500.00", type: "Operating" },
    { date: "Mar 11, 2026", description: "Trust Disbursement - Johnson Matter", amount: "-$2,450.00", type: "Trust" },
  ];

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Main Dashboard Content (blurred when modal is showing) */}
      <div className={cn(
        "flex-1 bg-gray-50 overflow-y-auto transition-all duration-300",
        showValueProp && "blur-sm"
      )}>
        <div className="px-20 py-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Accounting Dashboard</h1>
            <p className="text-gray-600">Financial overview and quick actions</p>
          </div>

          {/* Account Balances Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {accountBalances.map((account) => {
              const Icon = account.icon;
              return (
                <div key={account.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center", account.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-semibold text-gray-900 mb-1">{account.value}</div>
                  <div className="text-sm text-gray-600 mb-1">{account.label}</div>
                  {account.change && (
                    <div className="text-sm text-green-600 font-medium">{account.change}</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
                  >
                    <Icon className="w-8 h-8 text-blue-600 mb-3" />
                    <div className="font-semibold text-gray-900 mb-1">{action.label}</div>
                    <div className="text-sm text-gray-600">{action.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
              <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="divide-y divide-gray-200">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-600">{transaction.date} • {transaction.type}</div>
                      </div>
                    </div>
                    <div className={cn(
                      "font-semibold text-lg",
                      transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                    )}>
                      {transaction.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Value Prop Modal Overlay */}
      {showValueProp && (
        <>
          {/* Cloud Background with Transparency */}
          <CloudBackground />
          
          {/* Backdrop Blur */}
          <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-30" onClick={onDismiss} />
          
          {/* Modal */}
          <div className="absolute inset-0 z-40 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 relative">
              {/* Close Button */}
              <button
                onClick={onDismiss}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Contextual Pip */}
              <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-[#0057FF]"
                style={{
                  boxShadow: '0 0 6px 3px rgba(0, 87, 255, 0.6)'
                }}
              />

              {/* Header */}
              <div className="mb-6 mt-4">
                <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
                  We've already looked at your data
                </div>
                <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                  We found 14 issues in your QuickBooks data. We can fix them.
                </h2>
                <p className="text-gray-600 text-lg">
                  Before you migrate a single record, we've already analyzed 3 years of Hartwell & Morris history — and mapped a path to bring it over clean.
                </p>
              </div>

              {/* Value Props */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">14 unreconciled trust entries — already fixed</div>
                    <div className="text-gray-600">We've analyzed your QBO trust history and drafted corrections for every flagged transaction. Review and apply in one click.</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Delaware IOLTA compliance, built in</div>
                    <div className="text-gray-600">Your jurisdiction is detected. Trust accounts will be monitored continuously against state bar rules from day one.</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">Your history stays queryable</div>
                    <div className="text-gray-600">Every transaction, vendor, and account maps across. Nothing is left behind or locked in a spreadsheet.</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={onStartMigration}
                  className="flex-1 bg-[#1C60FF] hover:bg-[#1550E0] text-white px-8 py-6 rounded-lg font-semibold text-lg"
                >
                  Review What We Found
                </Button>
                <Button
                  onClick={onDismiss}
                  variant="outline"
                  className="px-8 py-6 rounded-lg font-medium border-gray-300"
                >
                  Maybe Later
                </Button>
              </div>

              {/* Small Print */}
              <p className="text-xs text-gray-500 mt-6 text-center">
                Migration typically takes 2-3 minutes. Your practice management data remains unchanged.
              </p>

            </div>
          </div>
        </>
      )}
    </div>
  );
}