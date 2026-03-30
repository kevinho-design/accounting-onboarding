import * as React from "react";
import { Sparkles } from "lucide-react";

export function EmptyWorkspace() {
  return (
    <div className="flex-1 bg-white overflow-hidden">
      {/* 12-Column Grid with High White-Space Margins */}
      <div className="h-full px-20 py-16">
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-2xl">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#1C60FF] to-[#3C8AFF] flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            {/* Empty State Message */}
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              Welcome to your workspace
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Your main workspace is ready. Select a feature from the navigation to get started, 
              or let Firm Intelligence guide you to the next best action.
            </p>
            
            {/* 12-Column Grid Visualization (Optional) */}
            <div className="mt-16 opacity-20">
              <div className="grid grid-cols-12 gap-4 max-w-4xl mx-auto">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
