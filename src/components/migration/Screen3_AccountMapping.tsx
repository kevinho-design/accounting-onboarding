import * as React from "react";
import { CheckCircle, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";

interface Screen3Props {
  onComplete: () => void;
}

export function Screen3_AccountMapping({ onComplete }: Screen3Props) {
  const [expandedAccount, setExpandedAccount] = React.useState<number | null>(null);
  
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

  return (
    <div className="relative flex-1 h-screen overflow-hidden">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />
      
      <div className="relative z-20 flex items-center justify-center h-full p-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-10 my-8">
          
          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Step 3 of 14 • Migration Intelligence
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Mapping Your Chart of Accounts
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              We're intelligently mapping your 52 QuickBooks accounts to Clio's legal-optimized structure. Our AI has already matched 49 accounts automatically.
            </p>
            
            <div className="flex items-center gap-6 p-5 bg-green-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-2xl font-semibold text-gray-900 mb-1">49 of 52 accounts mapped</div>
                <div className="text-gray-700">We have smart suggestions for the remaining 3 accounts. Review them below or let us apply our recommendations.</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {ambiguousAccounts.map((account, index) => (
              <div key={index} className="bg-blue-50 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedAccount(expandedAccount === index ? null : index)}
                  className="w-full p-5 flex items-center justify-between hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <div className="text-left flex-1">
                      <div className="font-semibold text-gray-900">{account.qboName}</div>
                      <div className="text-sm text-gray-600">
                        AI Suggestion: <span className="font-medium text-blue-700">{account.suggestedMapping}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${expandedAccount === index ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedAccount === index && (
                  <div className="px-5 pb-5 bg-white">
                    <div className="pt-4">
                      <div className="p-4 bg-blue-50 rounded-lg mb-4">
                        <div className="text-sm text-gray-700">
                          <span className="font-semibold text-blue-900">Why this mapping?</span> {account.reason}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Choose a different mapping (optional):
                        </label>
                        <select className="w-full p-3 bg-white rounded-lg shadow-sm">
                          <option>{account.suggestedMapping} (AI Recommended)</option>
                          {account.alternates.map((alt, i) => (
                            <option key={i}>{alt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              onClick={onComplete}
              className="flex-1 bg-[#1C60FF] hover:bg-[#1550E0] text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              Apply AI Recommendations
            </Button>
            <Button
              onClick={onComplete}
              variant="outline"
              className="px-8 py-6 rounded-lg font-medium"
            >
              I'll Review Manually
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}