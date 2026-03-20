import * as React from "react";
import { MapPin, Scale, Building2, Sparkles, CheckCircle, ChevronDown, FileText, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";
import { ConfigModeToggle } from "./ConfigModeToggle";

interface Screen2Props {
  onComplete: () => void;
}

export function Screen2_MigrationIntelligence({ onComplete }: Screen2Props) {
  const [mode, setMode] = React.useState<"suggested" | "advanced">("suggested");
  const [expandedAccount, setExpandedAccount] = React.useState<number | null>(null);
  const [expandedTransaction, setExpandedTransaction] = React.useState<number | null>(null);
  
  const ambiguousAccounts = [
    {
      qboName: "Professional Services Expense",
      suggestedMapping: "Expert Witness Fees",
      alternates: ["Consulting Fees", "Contract Attorney Fees", "General Professional Services"],
      reason: "Based on transaction descriptions, 73% of charges appear to be expert witness related."
    },
    {
      qboName: "Marketing & Advertising",
      suggestedMapping: "Business Development",
      alternates: ["Marketing Expense", "Client Acquisition", "General Advertising"],
      reason: "Your transactions include CLE sponsorships and networking events, which align with business development."
    },
    {
      qboName: "Technology Services",
      suggestedMapping: "Legal Technology & Software",
      alternates: ["IT Services", "Software Subscriptions", "General Technology"],
      reason: "90% of vendors are legal-specific software providers (Westlaw, LexisNexis, etc.)."
    }
  ];

  const flaggedTransactions = [
    {
      date: "Jan 15, 2024",
      amount: "$2,450.00",
      description: "Transfer to Operating Account",
      issue: "Missing client disbursement authorization",
      suggestedFix: "Link to Matter #2847 (Johnson v. Smith) disbursement authorization dated Jan 14, 2024"
    },
    {
      date: "Feb 3, 2024",
      amount: "$850.00",
      description: "Wire Transfer Fee",
      issue: "Fee withdrawn from trust account instead of operating",
      suggestedFix: "Reclassify as operating expense and add corresponding trust-to-operating transfer"
    },
    {
      date: "Mar 8, 2024",
      amount: "$12,000.00",
      description: "Client Deposit - Williams Estate",
      issue: "Exceeds $10,000 CTR threshold without documentation",
      suggestedFix: "Flag for CTR compliance review and attach IRS Form 8300 if not already filed"
    },
    {
      date: "Apr 22, 2024",
      amount: "$3,200.00",
      description: "Refund to Client - Thompson",
      issue: "Trust balance went negative for 2 days following this transaction",
      suggestedFix: "Reorder transactions chronologically or add note explaining temporary overdraft coverage"
    },
    {
      date: "May 14, 2024",
      amount: "$5,100.00",
      description: "Expert Witness Payment",
      issue: "Missing three-way reconciliation documentation",
      suggestedFix: "Link to matter ledger and bank statement to complete reconciliation trail"
    },
    {
      date: "Jun 30, 2024",
      amount: "$175.00",
      description: "Monthly Service Charge",
      issue: "Bank fees should not be deducted from IOLTA account",
      suggestedFix: "Reclassify as operating expense per Delaware IOLTA rules"
    },
    {
      date: "Aug 19, 2024",
      amount: "$8,900.00",
      description: "Settlement Distribution",
      issue: "Incomplete matter closure documentation",
      suggestedFix: "Attach final settlement statement and client authorization"
    }
  ];

  return (
    <div className="relative flex-1 h-[calc(100vh-90px)] overflow-hidden">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />
      
      <div className="relative z-20 flex items-center justify-center h-full p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-10 my-8">
          
          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Import Data • Migration Intelligence
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Your QuickBooks Data is Ready to Migrate
            </h2>
            <p className="text-gray-600 text-lg">
              We've analyzed your data and personalized Clio Accounting for your firm. Review the insights below.
            </p>
          </div>

          <ConfigModeToggle mode={mode} onModeChange={setMode} />

          {mode === "suggested" ? (
            // Suggested Mode - Clean Summary
            <div className="space-y-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Migration Intelligence Complete</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Our AI has analyzed your QuickBooks data and prepared everything for a seamless migration:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Firm Profile Recognized</div>
                      <div className="text-sm text-gray-600">
                        Delaware • Litigation, Real Estate, Family Law • 52 attorneys
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Chart of Accounts Mapped</div>
                      <div className="text-sm text-gray-600">
                        49 of 52 accounts automatically mapped (94%) • 3 accounts need review
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Trust Transactions Validated</div>
                      <div className="text-sm text-gray-600">
                        34,382 of 34,520 transactions compliant (99.6%) • 138 transactions flagged
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Delaware IOLTA Compliance Configured</div>
                      <div className="text-sm text-gray-600">
                        State-specific rules and reporting requirements ready
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-4 bg-blue-100 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <span className="font-semibold">Recommendation:</span> We suggest applying all automated fixes to ensure 100% accuracy and compliance. This will map the 3 ambiguous accounts and correct the 7 trust transactions based on best practices.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Advanced Mode - Detailed View
            <div className="space-y-6 mb-8">
              {/* Firm Profile Card */}
              <div className="p-5 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Firm Profile
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Delaware</div>
                      <div className="text-xs text-gray-600">IOLTA configured</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Scale className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Litigation, Real Estate, Family Law</div>
                      <div className="text-xs text-gray-600">Practice areas</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">52 attorneys</div>
                      <div className="text-xs text-gray-600">Firm size</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Custom ML Model</div>
                      <div className="text-xs text-gray-600">AI personalization</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two Column Layout for Account Mapping and Trust Analysis */}
              <div className="grid grid-cols-2 gap-4">
                {/* Chart of Accounts Card */}
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Chart of Accounts</h3>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-semibold text-gray-900">49 of 52</span>
                    </div>
                    <div className="text-sm text-gray-600">Automatically mapped</div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      3 accounts need suggestions:
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {ambiguousAccounts.map((account, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                          <button
                            onClick={() => setExpandedAccount(expandedAccount === index ? null : index)}
                            className="w-full p-3 flex items-center justify-between hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{account.qboName}</div>
                              <div className="text-xs text-blue-600 truncate">→ {account.suggestedMapping}</div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-600 flex-shrink-0 ml-2 transition-transform ${expandedAccount === index ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {expandedAccount === index && (
                            <div className="px-3 pb-3 bg-blue-50">
                              <div className="p-3 bg-white rounded-lg mb-2">
                                <div className="text-xs font-semibold text-blue-900 mb-1">Why this mapping?</div>
                                <div className="text-xs text-gray-700">{account.reason}</div>
                              </div>
                              <select className="w-full p-2 text-sm bg-white rounded-lg">
                                <option>{account.suggestedMapping} (AI)</option>
                                {account.alternates.map((alt, i) => (
                                  <option key={i}>{alt}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Trust Transactions Card */}
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Trust Transactions</h3>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-semibold text-gray-900">34,382 of 34,520</span>
                    </div>
                    <div className="text-sm text-gray-600">IOLTA compliant</div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      7 transactions need fixes:
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {flaggedTransactions.map((transaction, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                          <button
                            onClick={() => setExpandedTransaction(expandedTransaction === index ? null : index)}
                            className="w-full p-3 flex items-center justify-between hover:bg-blue-50 transition-colors text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">{transaction.description}</div>
                              <div className="text-xs text-gray-600">{transaction.date} • {transaction.amount}</div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-600 flex-shrink-0 ml-2 transition-transform ${expandedTransaction === index ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {expandedTransaction === index && (
                            <div className="px-3 pb-3 bg-blue-50">
                              <div className="p-3 bg-white rounded-lg">
                                <div className="text-xs font-semibold text-blue-900 mb-1">✨ AI Fix:</div>
                                <div className="text-xs text-gray-700">{transaction.suggestedFix}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              {mode === "suggested" ? "Apply All Changes" : "Apply Changes"}
            </Button>
            <Button
              onClick={onComplete}
              variant="outline"
              className="px-8 py-6 rounded-lg font-medium"
            >
              {mode === "suggested" ? "Skip for Now" : "I'll Review Later"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}