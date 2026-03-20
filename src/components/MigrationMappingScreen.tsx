import * as React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Check, TrendingUp } from "lucide-react";

interface MigrationMappingScreenProps {
  onApprove: () => void;
  onManualReview: () => void;
}

export function MigrationMappingScreen({ onApprove, onManualReview }: MigrationMappingScreenProps) {
  const mappings = [
    { qbo: "Misc Expenses", clio: "Office Supplies", improvement: true },
    { qbo: "General Operating", clio: "Operating Expenses", improvement: true },
    { qbo: "Client Charges", clio: "Client Costs - Recoverable", improvement: true },
    { qbo: "Bank Fees & Charges", clio: "Bank Service Charges", improvement: false },
    { qbo: "Professional Services", clio: "Professional Development", improvement: true },
    { qbo: "Equipment Rental", clio: "Equipment & Technology", improvement: true },
  ];

  return (
    <div className="flex-1 bg-transparent overflow-y-auto">
      <div className="px-20 py-16">
        {/* Ambient Header - High Trust Migration Status */}
        <div className="mb-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
              High Trust Migration
            </div>
          </div>
          <div className="text-lg font-medium text-gray-900">
            Ambient CFO is auto-mapping <span className="text-[#0057FF] font-semibold">124 accounts</span> based on Clio best practices
          </div>
        </div>

        {/* Contextual Float - The "Opinion" Card (CENTER) */}
        <div className="mb-8 flex justify-center">
          <div 
            className="relative bg-white rounded-xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.12)] max-w-4xl w-full border-2 border-[#0057FF]"
            style={{
              boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 0 0 4px rgba(0, 87, 255, 0.2)'
            }}
          >
            {/* Contextual Pip */}
            <div className="absolute top-4 right-4 w-1 h-1 rounded-full bg-[#0057FF]"
              style={{
                boxShadow: '0 0 4px 2px rgba(0, 87, 255, 0.6)'
              }}
            />

            {/* Label */}
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              AI Opinion
            </div>

            {/* Narrative */}
            <div className="text-[15px] font-medium text-gray-900 leading-relaxed mb-6">
              Your QBO Chart of Accounts is fragmented. I've mapped them to our <span className="font-semibold">"High-Performance Law Firm"</span> template. This will improve your realization reporting by <span className="text-green-600 font-semibold">12%</span>.
            </div>

            {/* Two Lists: QBO Original vs Clio Optimized */}
            <div className="grid grid-cols-2 gap-8">
              {/* QBO Original - Left Side */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-sm font-bold uppercase tracking-wide text-gray-500">
                    QBO Original
                  </div>
                </div>
                <div className="space-y-3">
                  {mappings.map((mapping, index) => (
                    <div 
                      key={index}
                      className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700"
                    >
                      {mapping.qbo}
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow Column */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-[#0057FF]" />
              </div>

              {/* Clio Optimized - Right Side WITH AMBIENT GLOW */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-sm font-bold uppercase tracking-wide text-[#0057FF]">
                    Clio Optimized
                  </div>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="space-y-3 ambient-glow rounded-lg p-1">
                  {mappings.map((mapping, index) => (
                    <div 
                      key={index}
                      className="px-4 py-3 rounded-lg bg-blue-50 border-2 border-[#0057FF] text-sm text-gray-900 font-medium flex items-center justify-between"
                    >
                      <span>{mapping.clio}</span>
                      {mapping.improvement && (
                        <Check className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <Button 
                onClick={onApprove}
                className="bg-[#1C60FF] hover:bg-[#1550E0] text-white px-8 py-3 rounded-lg font-medium text-base"
              >
                Approve & Sync
              </Button>
              
              {/* Secondary Link */}
              <button
                onClick={onManualReview}
                className="text-sm text-gray-600 hover:text-[#0057FF] underline underline-offset-2 transition-colors"
              >
                Review or Edit Mapping Manually
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}