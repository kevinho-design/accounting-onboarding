import * as React from "react";
import { X, CheckCircle, TrendingUp, ArrowRight, AlertTriangle, FileCheck } from "lucide-react";
import { Button } from "./ui/button";

interface MigrationReportModalProps {
  isOpen?: boolean;
  stats?: Array<{
    label: string;
    value: string;
    percentage: string;
    status: "success" | "warning";
  }>;
  onClose: () => void;
}

const accountMappings = [
  { 
    oldAccount: "Operating Account - Bank of America (...4521)", 
    newAccount: "Operating Account - Bank of America (...4521)",
    oldBalance: "$142,847.32",
    newBalance: "$142,847.32",
    status: "matched" as const,
    transactions: 1247
  },
  { 
    oldAccount: "IOLTA Trust - TD Bank (...8392)", 
    newAccount: "IOLTA Trust - TD Bank (...8392)",
    oldBalance: "$87,450.00",
    newBalance: "$87,450.00",
    status: "matched" as const,
    transactions: 428
  },
  { 
    oldAccount: "Corporate Card - Chase (...9183)", 
    newAccount: "Corporate Card - Chase (...9183)",
    oldBalance: "-$4,238.91",
    newBalance: "-$4,238.91",
    status: "matched" as const,
    transactions: 172
  },
  { 
    oldAccount: "Accounts Receivable", 
    newAccount: "Accounts Receivable",
    oldBalance: "$68,920.00",
    newBalance: "$68,920.00",
    status: "matched" as const,
    transactions: 0
  }
];

const categoryComparison = [
  { category: "Revenue", old: 847, new: 847, variance: 0 },
  { category: "Operating Expenses", old: 543, new: 541, variance: -2 },
  { category: "Trust Transactions", old: 428, new: 428, variance: 0 },
  { category: "Payroll", old: 156, new: 156, variance: 0 },
  { category: "Tax Payments", old: 24, new: 24, variance: 0 },
];

const dataQualityMetrics = [
  { metric: "Account Balance Integrity", status: "passed" as const, detail: "All account balances match to the penny" },
  { metric: "Transaction Count Validation", status: "passed" as const, detail: "34,520 transactions mapped successfully" },
  { metric: "Date Range Completeness", status: "passed" as const, detail: "Jan 2021 - Mar 2024 (3 years, 3 months)" },
  { metric: "Vendor Data Enrichment", status: "passed" as const, detail: "127 vendors matched and enhanced" },
];

const transformationLog = [
  { action: "Merged duplicate vendor records", count: 3, impact: "Cleaner vendor list, improved categorization" },
  { action: "Auto-categorized office supplies", count: 47, impact: "Consistent expense tracking" },
  { action: "Standardized matter references", count: 89, impact: "Uniform matter coding" },
  { action: "Enriched vendor profiles", count: 127, impact: "Added payment terms, contact info, tax IDs" },
  { action: "Applied Delaware compliance rules", count: 428, impact: "Trust transactions flagged for IOLTA reporting" },
];

export function MigrationReportModal({ isOpen, stats, onClose }: MigrationReportModalProps) {
  const [activeTab, setActiveTab] = React.useState<"balance" | "transactions" | "quality" | "transformations">("balance");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Full Migration Report</h2>
              <p className="text-gray-600 mt-1">Before/After comparison and data validation proof</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Success Banner */}
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-green-900 mb-1">Migration Integrity Verified</div>
                <div className="text-sm text-green-800">
                  All account balances reconciled to the penny. 34,520 transactions successfully mapped from QuickBooks to Clio Accounting.
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">99.3%</div>
                <div className="text-xs text-green-700">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-4 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("balance")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "balance"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Balance Reconciliation
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "transactions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Transaction Breakdown
            </button>
            <button
              onClick={() => setActiveTab("quality")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "quality"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Data Quality
            </button>
            <button
              onClick={() => setActiveTab("transformations")}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "transformations"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Transformations
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Balance Reconciliation Tab */}
          {activeTab === "balance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Balance Validation</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Side-by-side comparison proving data integrity. All balances match exactly.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-700">
                  <div className="col-span-4">Account</div>
                  <div className="col-span-2 text-right">Old Balance</div>
                  <div className="col-span-1 text-center"></div>
                  <div className="col-span-2 text-right">New Balance</div>
                  <div className="col-span-2 text-center">Status</div>
                  <div className="col-span-1 text-right">Txns</div>
                </div>

                {/* Table Rows */}
                {accountMappings.map((mapping, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 last:border-0 hover:bg-white transition-colors">
                    <div className="col-span-4">
                      <div className="text-sm font-medium text-gray-900">{mapping.newAccount.split(' - ')[0]}</div>
                      <div className="text-xs text-gray-600">{mapping.newAccount.split(' - ')[1]}</div>
                    </div>
                    <div className="col-span-2 text-right text-sm text-gray-700">
                      {mapping.oldBalance}
                    </div>
                    <div className="col-span-1 text-center">
                      <ArrowRight className="w-4 h-4 text-gray-400 mx-auto" />
                    </div>
                    <div className="col-span-2 text-right text-sm font-semibold text-gray-900">
                      {mapping.newBalance}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Matched
                      </span>
                    </div>
                    <div className="col-span-1 text-right text-sm text-gray-600">
                      {mapping.transactions}
                    </div>
                  </div>
                ))}

                {/* Total Row */}
                <div className="grid grid-cols-12 gap-4 px-4 py-4 bg-blue-50 border-t-2 border-blue-200">
                  <div className="col-span-4 text-sm font-bold text-gray-900">Total Net Balance</div>
                  <div className="col-span-2 text-right text-sm font-bold text-gray-900">$294,978.41</div>
                  <div className="col-span-1"></div>
                  <div className="col-span-2 text-right text-sm font-bold text-green-600">$294,978.41</div>
                  <div className="col-span-2 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      <CheckCircle className="w-3 h-3" />
                      Perfect Match
                    </span>
                  </div>
                  <div className="col-span-1 text-right text-sm font-bold text-gray-900">1,847</div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <span className="font-semibold">Audit Trail Available:</span> Complete ledger export showing every transaction mapped from QuickBooks with before/after values. Available for download in the Reports section.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Breakdown Tab */}
          {activeTab === "transactions" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Transaction Category Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Compare transaction counts by category between old and new systems.
                </p>
              </div>

              <div className="space-y-3">
                {categoryComparison.map((cat, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900">{cat.category}</div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          Old: <span className="font-semibold">{cat.old}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-900">
                          New: <span className="font-semibold">{cat.new}</span>
                        </div>
                        {cat.variance === 0 ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Perfect
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-600 text-sm font-medium">
                            <AlertTriangle className="w-4 h-4" />
                            {cat.variance > 0 ? '+' : ''}{cat.variance}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${cat.variance === 0 ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${(cat.new / cat.old) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-900 mb-2">Variance Explanation:</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>• Operating Expenses: -2 transactions identified as duplicates (see Action Items)</div>
                  <div>• All other categories: 100% match with zero data loss</div>
                </div>
              </div>
            </div>
          )}

          {/* Data Quality Tab */}
          {activeTab === "quality" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Quality Validation Checks</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Automated validation tests performed during migration.
                </p>
              </div>

              <div className="space-y-3">
                {dataQualityMetrics.map((metric, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-4 border-l-4 border-l-green-500">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {metric.status === "passed" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          )}
                          <div className="font-semibold text-gray-900">{metric.metric}</div>
                        </div>
                        <div className="text-sm text-gray-700 ml-7">{metric.detail}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        metric.status === "passed" 
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {metric.status === "passed" ? "PASSED" : "NEEDS REVIEW"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-1">4/6</div>
                  <div className="text-sm text-green-800">Checks Passed</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">2/6</div>
                  <div className="text-sm text-yellow-800">Minor Warnings</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-3xl font-bold text-blue-600 mb-1">0</div>
                  <div className="text-sm text-blue-800">Critical Failures</div>
                </div>
              </div>
            </div>
          )}

          {/* Transformations Tab */}
          {activeTab === "transformations" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Transformations Applied</h3>
                <p className="text-sm text-gray-600 mb-4">
                  AI-powered enhancements and cleanup actions performed during migration.
                </p>
              </div>

              <div className="space-y-3">
                {transformationLog.map((trans, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {trans.count}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{trans.action}</div>
                        <div className="text-sm text-gray-700">{trans.impact}</div>
                      </div>
                      <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-purple-900">
                    <span className="font-semibold">Delaware Bar Compliance:</span> All trust transactions tagged with IOLTA reporting flags. Client ledger structure validated against state requirements. Ready for quarterly compliance reporting.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Migration completed on March 17, 2024 at 2:34 PM EST
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-lg font-medium"
            >
              Download Full Report (PDF)
            </Button>
            <Button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}