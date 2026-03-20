import * as React from "react";
import { Button } from "./ui/button";
import { ArrowRight, Info } from "lucide-react";

interface ManualMappingReviewProps {
  onComplete: () => void;
  onBack: () => void;
}

interface MappingRow {
  qboAccount: string;
  clioAccount: string;
  reasoning: string;
  category: string;
}

export function ManualMappingReview({ onComplete, onBack }: ManualMappingReviewProps) {
  const [hoveredRow, setHoveredRow] = React.useState<number | null>(null);
  
  const mappingData: MappingRow[] = [
    {
      qboAccount: "Misc Expenses",
      clioAccount: "Office Supplies",
      reasoning: "Mapped 'Misc Expenses' to 'Office Supplies' based on payee history and transaction patterns",
      category: "Operating"
    },
    {
      qboAccount: "General Operating",
      clioAccount: "Operating Expenses",
      reasoning: "Standardized general category to match GAAP compliance and law firm best practices",
      category: "Operating"
    },
    {
      qboAccount: "Client Charges",
      clioAccount: "Client Costs - Recoverable",
      reasoning: "Separated recoverable costs for accurate client billing and realization tracking",
      category: "Client Costs"
    },
    {
      qboAccount: "Bank Fees & Charges",
      clioAccount: "Bank Service Charges",
      reasoning: "Direct mapping - no changes needed, already follows standard nomenclature",
      category: "Operating"
    },
    {
      qboAccount: "Professional Services",
      clioAccount: "Professional Development",
      reasoning: "Reclassified based on historical usage showing CLE and training expenses",
      category: "Operating"
    },
    {
      qboAccount: "Equipment Rental",
      clioAccount: "Equipment & Technology",
      reasoning: "Consolidated technology-related expenses for better reporting granularity",
      category: "Technology"
    },
    {
      qboAccount: "Marketing & Advertising",
      clioAccount: "Business Development",
      reasoning: "Aligned with legal industry terminology for client acquisition costs",
      category: "Marketing"
    },
    {
      qboAccount: "Office Rent",
      clioAccount: "Rent - Office Space",
      reasoning: "Direct mapping with clarified subcategory for facilities management",
      category: "Facilities"
    },
  ];

  return (
    <div className="flex-1 bg-transparent overflow-y-auto">
      <div className="px-20 py-16">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-[#0057FF] mb-4 flex items-center gap-2"
          >
            ← Back to Summary
          </button>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Manual Mapping Review</h1>
          <p className="text-gray-600">Review and edit account mappings. Each row shows AI reasoning.</p>
        </div>

        {/* Split-View Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
            <div className="col-span-4">QBO Account</div>
            <div className="col-span-1 flex justify-center">
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </div>
            <div className="col-span-4">Clio Optimized Account</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {mappingData.map((row, index) => (
              <div 
                key={index}
                className="relative grid grid-cols-12 gap-4 px-6 py-4 hover:bg-blue-50 transition-colors group"
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {/* QBO Account */}
                <div className="col-span-4 text-sm text-gray-700 flex items-center">
                  {row.qboAccount}
                </div>

                {/* Arrow */}
                <div className="col-span-1 flex justify-center items-center">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>

                {/* Clio Account */}
                <div className="col-span-4 text-sm text-gray-900 font-medium flex items-center">
                  {row.clioAccount}
                </div>

                {/* Category */}
                <div className="col-span-2 flex items-center">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                    {row.category}
                  </span>
                </div>

                {/* Contextual Pip with Tooltip */}
                <div className="col-span-1 flex items-center justify-center relative">
                  <div 
                    className="w-1 h-1 rounded-full bg-[#0057FF] cursor-pointer"
                    style={{
                      boxShadow: '0 0 4px 2px rgba(0, 87, 255, 0.6)'
                    }}
                  />
                  
                  {/* Reasoning Tooltip */}
                  {hoveredRow === index && (
                    <div 
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[calc(100%+12px)] z-10 w-80 bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl"
                      style={{
                        animation: 'fadeIn 0.2s ease-in-out'
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                        <div>
                          <div className="font-bold mb-1 text-blue-400">AI Reasoning</div>
                          <div className="leading-relaxed">{row.reasoning}</div>
                        </div>
                      </div>
                      {/* Tooltip Arrow */}
                      <div 
                        className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0"
                        style={{
                          borderTop: '6px solid transparent',
                          borderBottom: '6px solid transparent',
                          borderRight: '8px solid rgb(17, 24, 39)',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-4">
          <Button 
            onClick={onBack}
            variant="outline"
            className="px-6 py-2.5"
          >
            Cancel
          </Button>
          <Button 
            onClick={onComplete}
            className="bg-[#1C60FF] hover:bg-[#1550E0] text-white px-6 py-2.5"
          >
            Confirm Mappings & Continue
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(calc(100% + 8px));
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(calc(100% + 12px));
          }
        }
      `}</style>
    </div>
  );
}