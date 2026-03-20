import * as React from "react";
import { X, CheckCircle, AlertCircle, Sparkles, ChevronDown, ChevronUp, FileText, DollarSign, Calendar, User, Zap } from "lucide-react";
import { Button } from "./ui/button";

interface MigrationReviewDrawerProps {
  isOpen?: boolean;
  stats?: Array<{
    label: string;
    value: string;
    percentage: string;
    status: "success" | "warning";
  }>;
  onClose: () => void;
  onReport?: () => void;
}

const reviewItems = [
  {
    description: "Uncategorized vendor: 'Smith & Associates'",
    impact: "High" as const,
    suggestion: "Based on transaction patterns, this appears to be an expert witness service. Categorize as 'Expert Witness Fees'.",
    autoFixable: true,
    transactionCount: 47,
    totalAmount: "$18,450",
    affectedMatters: ["#2891 Thompson Estate", "#3104 Miller Trust", "#2847 Johnson Litigation"],
    pattern: "This vendor appears in 47 transactions across 8 matters over the past 18 months",
    financialImpact: "Properly categorizing will improve expense reporting accuracy by 12%",
    sampleTransactions: [
      { date: "Mar 12, 2024", amount: "$1,500", description: "Expert testimony - Thompson case", matter: "#2891" },
      { date: "Feb 28, 2024", amount: "$2,250", description: "Document review services", matter: "#3104" },
      { date: "Jan 15, 2024", amount: "$850", description: "Consultation fee", matter: "#2847" }
    ]
  },
  {
    description: "Trust transaction missing client ledger entry",
    impact: "High" as const,
    suggestion: "Link to client trust ledger for Matter #3104 to complete three-way reconciliation.",
    autoFixable: false,
    transactionCount: 1,
    totalAmount: "$5,000",
    affectedMatters: ["#3104 Miller Trust"],
    pattern: "IOLTA deposit without corresponding client ledger assignment",
    financialImpact: "Required for Massachusetts bar compliance - must resolve before month-end",
    sampleTransactions: [
      { date: "Mar 1, 2024", amount: "$5,000", description: "Client retainer deposit", matter: "Unassigned" }
    ]
  },
  {
    description: "Duplicate transaction detected on Feb 14, 2024",
    impact: "Medium" as const,
    suggestion: "Transaction appears twice in bank feed. Mark one as duplicate and exclude from reports.",
    autoFixable: true,
    transactionCount: 2,
    totalAmount: "$3,200 (duplicate)",
    affectedMatters: ["#2901 Estate Planning"],
    pattern: "Same amount, vendor, and date - likely bank feed sync issue",
    financialImpact: "Currently overstating expenses by $3,200 in February reports",
    sampleTransactions: [
      { date: "Feb 14, 2024", amount: "$3,200", description: "Westlaw subscription - quarterly", matter: "Operating" },
      { date: "Feb 14, 2024", amount: "$3,200", description: "Westlaw subscription - quarterly", matter: "Operating" }
    ]
  },
  {
    description: "Missing matter assignment for $1,250 expense",
    impact: "Medium" as const,
    suggestion: "Based on timing and amount, likely related to Matter #2891 (Thompson Estate). Assign for tracking.",
    autoFixable: true,
    transactionCount: 1,
    totalAmount: "$1,250",
    affectedMatters: ["Unassigned → #2891 Thompson Estate (suggested)"],
    pattern: "Expense occurred during active Thompson case work period",
    financialImpact: "Matter profitability reporting incomplete without assignment",
    sampleTransactions: [
      { date: "Mar 5, 2024", amount: "$1,250", description: "Court filing fees", matter: "Unassigned" }
    ]
  },
  {
    description: "Account 'Miscellaneous Income' needs clarification",
    impact: "Low" as const,
    suggestion: "Reclassify to more specific account type for better reporting.",
    autoFixable: false,
    transactionCount: 8,
    totalAmount: "$4,820",
    affectedMatters: ["Multiple"],
    pattern: "Mixed income sources - needs manual categorization",
    financialImpact: "Improves revenue analysis and tax reporting",
    sampleTransactions: [
      { date: "Mar 10, 2024", amount: "$150", description: "Interest earned", matter: "Operating" },
      { date: "Feb 22, 2024", amount: "$2,500", description: "Settlement fee recovery", matter: "#2847" },
      { date: "Jan 18, 2024", amount: "$500", description: "Referral fee", matter: "Operating" }
    ]
  },
  {
    description: "Historical reconciliation: 12 similar categorization items",
    impact: "Low" as const,
    suggestion: "Apply bulk categorization based on ML pattern recognition.",
    autoFixable: true,
    transactionCount: 12,
    totalAmount: "$8,940",
    affectedMatters: ["Various 2023 matters"],
    pattern: "AI identified consistent vendor patterns in historical data",
    financialImpact: "Completes historical data accuracy for trend analysis",
    sampleTransactions: [
      { date: "Dec 15, 2023", amount: "$650", description: "Office supplies - Staples", matter: "Operating" },
      { date: "Nov 8, 2023", amount: "$890", description: "Office supplies - Staples", matter: "Operating" },
      { date: "Oct 3, 2023", amount: "$720", description: "Office supplies - Staples", matter: "Operating" }
    ]
  }
];

export function MigrationReviewDrawer({ isOpen, stats, onClose, onReport }: MigrationReviewDrawerProps) {
  const [completedItems, setCompletedItems] = React.useState<number[]>([]);
  const [expandedItem, setExpandedItem] = React.useState<number | null>(null);

  const autoFixableCount = reviewItems.filter(item => item.autoFixable).length;
  const highPriorityCount = reviewItems.filter(item => item.impact === "High").length;

  const handleAutoFix = (index: number) => {
    setCompletedItems([...completedItems, index]);
    setExpandedItem(null);
  };

  const handleAutoFixAll = () => {
    const autoFixableIndices = reviewItems
      .map((item, index) => item.autoFixable ? index : -1)
      .filter(index => index !== -1);
    setCompletedItems(autoFixableIndices);
  };

  if (!isOpen) return null;

  const remainingItems = reviewItems.length - completedItems.length;
  const criticalItems = reviewItems.filter((item, idx) => item.impact === "High" && !completedItems.includes(idx)).length;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[600px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Migration Action Items</h2>
              <p className="text-sm text-gray-600 mt-1">
                Deep dive into data issues with transaction-level detail
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{remainingItems}</div>
              <div className="text-xs text-gray-600">Items Remaining</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <div className="text-2xl font-bold text-red-600">{criticalItems}</div>
              <div className="text-xs text-gray-600">Critical Priority</div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="text-2xl font-bold text-green-600">{autoFixableCount - completedItems.filter(i => reviewItems[i].autoFixable).length}</div>
              <div className="text-xs text-gray-600">Auto-Fixable</div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {reviewItems.map((item, index) => {
              const isCompleted = completedItems.includes(index);
              const isExpanded = expandedItem === index;
              
              return (
                <div
                  key={index}
                  className={`rounded-lg border-2 transition-all ${
                    isCompleted
                      ? 'border-green-200 bg-green-50 opacity-60'
                      : item.impact === 'High'
                      ? 'border-red-200 bg-red-50'
                      : item.impact === 'Medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  {/* Item Header - Always Visible */}
                  <button
                    onClick={() => !isCompleted && setExpandedItem(isExpanded ? null : index)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-start gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            item.impact === 'High'
                              ? 'text-red-600'
                              : item.impact === 'Medium'
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                          }`}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className={`font-semibold text-sm ${
                            isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {item.description}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!isCompleted && (
                              <div
                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  item.impact === 'High'
                                    ? 'bg-red-100 text-red-700'
                                    : item.impact === 'Medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {item.impact}
                              </div>
                            )}
                            {!isCompleted && (isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                          </div>
                        </div>

                        {/* Quick Summary Line */}
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {item.transactionCount} transaction{item.transactionCount > 1 ? 's' : ''}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {item.totalAmount}
                          </span>
                          {item.autoFixable && !isCompleted && (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                              <Zap className="w-3 h-3" />
                              Auto-fix ready
                            </span>
                          )}
                        </div>

                        {isCompleted && (
                          <div className="text-xs text-green-700 font-medium mt-2">
                            ✓ Resolved
                          </div>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && !isCompleted && (
                    <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
                      {/* AI Suggestion */}
                      <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-start gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-gray-900 mb-1">AI Recommendation:</div>
                            <div className="text-xs text-gray-700">{item.suggestion}</div>
                          </div>
                        </div>
                      </div>

                      {/* Pattern Analysis */}
                      <div className="bg-white/80 rounded-lg p-3">
                        <div className="text-xs font-semibold text-gray-900 mb-1">Pattern Detected:</div>
                        <div className="text-xs text-gray-700 mb-2">{item.pattern}</div>
                        {item.affectedMatters.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.affectedMatters.map((matter, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                {matter}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Financial Impact */}
                      <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                        <div className="text-xs font-semibold text-orange-900 mb-1">Financial Impact:</div>
                        <div className="text-xs text-orange-800">{item.financialImpact}</div>
                      </div>

                      {/* Sample Transactions */}
                      <div className="bg-white/80 rounded-lg p-3">
                        <div className="text-xs font-semibold text-gray-900 mb-2">
                          Sample Transactions ({item.sampleTransactions.length} of {item.transactionCount}):
                        </div>
                        <div className="space-y-2">
                          {item.sampleTransactions.map((txn, idx) => (
                            <div key={idx} className="flex items-start justify-between gap-2 pb-2 border-b border-gray-200 last:border-0">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium text-gray-900">{txn.description}</div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {txn.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {txn.matter}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs font-semibold text-gray-900 flex-shrink-0">
                                {txn.amount}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {item.autoFixable ? (
                          <>
                            <Button
                              onClick={() => handleAutoFix(index)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              Apply Auto-Fix
                            </Button>
                            {item.transactionCount > 1 && (
                              <Button
                                onClick={() => handleAutoFix(index)}
                                variant="outline"
                                className="text-sm"
                              >
                                Fix All {item.transactionCount}
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            onClick={() => handleAutoFix(index)}
                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                          >
                            Mark as Reviewed
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 space-y-2">
          <Button
            onClick={handleAutoFixAll}
            disabled={completedItems.length === autoFixableCount}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Auto-Fix All Eligible Items ({autoFixableCount - completedItems.filter(i => reviewItems[i].autoFixable).length} remaining)
          </Button>
          <div className="text-center text-xs text-gray-600">
            Estimated time to resolve all items: ~15 minutes
          </div>
        </div>
      </div>
    </>
  );
}