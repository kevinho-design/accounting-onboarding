import * as React from "react";
import { AmbientInsightCard } from "./AmbientInsightCard";
import { ChevronLeft, ChevronRight, Sparkles, X } from "lucide-react";

interface AmbientCFORailProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function AmbientCFORail({ isOpen = false, onToggle }: AmbientCFORailProps) {
  return (
    <div 
      className={`h-full flex-shrink-0 border-l border-[#1C60FF] overflow-y-auto transition-all duration-300 ${
        isOpen ? 'w-[400px]' : 'w-0 border-l-0'
      }`}
      style={{ backgroundColor: '#F8FAFF' }}
    >
      {/* Content - Only show when expanded */}
      {isOpen && (
        <>
          {/* Header with Close Button */}
          <div className="border-b border-blue-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">Teammate</span>
            </div>
            {onToggle && (
              <button
                onClick={onToggle}
                className="p-1 hover:bg-blue-50 rounded transition-colors"
                title="Close Teammate"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Rail Header */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">
                AI-Powered Insights
              </h3>
              <p className="text-sm text-gray-600">
                Your financial teammate is monitoring your practice
              </p>
            </div>

            {/* Example Insight Cards - These will be populated dynamically */}
            <div className="space-y-4">
              <AmbientInsightCard
                label="Cash Flow"
                narrative="Your operating account will reach optimal balance in 3 days"
                showPip={true}
              />
              
              <AmbientInsightCard
                label="Compliance"
                narrative="Massachusetts IOLTA reporting due in 14 days"
                showPip={true}
              />
              
              <AmbientInsightCard
                label="Opportunity"
                narrative="Consider moving $12,500 to high-yield account"
                showPip={false}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}