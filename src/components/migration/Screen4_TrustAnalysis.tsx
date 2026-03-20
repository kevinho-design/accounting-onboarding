import * as React from "react";
import { Shield, CheckCircle, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";

interface Screen4Props {
  onComplete: () => void;
}

export function Screen4_TrustAnalysis({ onComplete }: Screen4Props) {
  const [expandedTransaction, setExpandedTransaction] = React.useState<number | null>(null);
  
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
    <div className="relative flex-1 min-h-screen">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />
      
      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-10 my-8">
          
          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Step 4 of 14 • Migration Intelligence
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Trust Account Analysis Complete
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              We've analyzed 3 years of trust transactions and ensured IOLTA compliance. Our AI has identified smart fixes for 7 transactions to keep you audit-ready.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-5 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-3xl font-semibold text-gray-900">1,840</span>
                </div>
                <div className="text-sm text-gray-600">Transactions validated & compliant</div>
              </div>
              
              <div className="p-5 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <span className="text-3xl font-semibold text-gray-900">7</span>
                </div>
                <div className="text-sm text-gray-600">AI-powered fixes ready to apply</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Suggestions (Optional to Review)
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {flaggedTransactions.map((transaction, index) => (
                <div key={index} className="bg-blue-50 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedTransaction(expandedTransaction === index ? null : index)}
                    className="w-full p-4 flex items-center justify-between hover:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                      <div className="text-xs text-gray-600">{transaction.date} • {transaction.amount}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${expandedTransaction === index ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedTransaction === index && (
                    <div className="px-4 pb-4 bg-white">
                      <div className="pt-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm font-semibold text-blue-900 mb-1">✨ AI Fix:</div>
                          <div className="text-sm text-gray-700">{transaction.suggestedFix}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={onComplete}
              className="flex-1 bg-[#1C60FF] hover:bg-[#1550E0] text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              Apply All AI Fixes
            </Button>
            <Button
              onClick={onComplete}
              variant="outline"
              className="px-8 py-6 rounded-lg font-medium"
            >
              I'll Review Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}