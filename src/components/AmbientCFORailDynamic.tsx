import * as React from "react";
import { AmbientInsightCard } from "./AmbientInsightCard";

interface AmbientCFORailDynamicProps {
  scene: "manage" | "mapping" | "manual-review" | "success";
}

export function AmbientCFORailDynamic({ scene }: AmbientCFORailDynamicProps) {
  const getInsightsForScene = () => {
    switch (scene) {
      case "manage":
        return {
          title: "Clio Accounting",
          subtitle: "Analyzing your practice data",
          insights: [
            {
              label: "Data Quality",
              narrative: "Found 14 unreconciled trust transactions from QuickBooks requiring attention",
              showPip: true
            },
            {
              label: "Migration Ready",
              narrative: "Your Manage data is clean and ready for automated accounting migration",
              showPip: true
            },
            {
              label: "Time Saved",
              narrative: "Automated migration will save ~4.5 hours of manual reconciliation work",
              showPip: false
            }
          ]
        };

      case "mapping":
        return {
          title: "Migration in Progress",
          subtitle: "AI-powered account mapping",
          insights: [
            {
              label: "Confidence Score",
              narrative: "124 accounts mapped with 98% confidence based on industry best practices",
              showPip: true
            },
            {
              label: "Chart Optimization",
              narrative: "Consolidated 47 fragmented categories into 28 high-performance accounts",
              showPip: true
            },
            {
              label: "Compliance Check",
              narrative: "All mappings validated against Massachusetts IOLTA requirements",
              showPip: false
            }
          ]
        };

      case "manual-review":
        return {
          title: "Manual Review Mode",
          subtitle: "Verify AI decisions",
          insights: [
            {
              label: "Reasoning Available",
              narrative: "Hover over any blue pip to see why that account was mapped",
              showPip: true
            },
            {
              label: "Edit Anytime",
              narrative: "You can modify any mapping before finalizing the migration",
              showPip: false
            },
            {
              label: "Safe to Proceed",
              narrative: "All mappings follow legal accounting standards and can be adjusted later",
              showPip: false
            }
          ]
        };

      case "success":
        return {
          title: "Migration Complete",
          subtitle: "Your accounting is ready",
          insights: [
            {
              label: "Next Monday",
              narrative: "Your first weekly financial briefing will be ready at 8:00 AM",
              showPip: true
            },
            {
              label: "Compliance Active",
              narrative: "Massachusetts trust accounting rules are now automatically enforced",
              showPip: true
            },
            {
              label: "Performance Boost",
              narrative: "Realization reporting accuracy improved by 12% with optimized chart",
              showPip: false
            }
          ]
        };

      default:
        return {
          title: "Clio Accounting",
          subtitle: "AI-powered insights",
          insights: []
        };
    }
  };

  const { title, subtitle, insights } = getInsightsForScene();

  return (
    <div 
      className="w-[400px] h-full flex-shrink-0 border-l border-[#1C60FF] overflow-y-auto"
      style={{ backgroundColor: '#F8FAFF' }}
    >
      <div className="p-6 space-y-6">
        {/* Rail Header */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Dynamic Insight Cards */}
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <AmbientInsightCard
              key={index}
              label={insight.label}
              narrative={insight.narrative}
              showPip={insight.showPip}
            />
          ))}
        </div>

        {/* Scene-specific footer content */}
        {scene === "success" && (
          <div className="pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 leading-relaxed">
              <p className="font-semibold mb-2">You're all set!</p>
              <p>Clio Accounting will continue to monitor your practice and surface insights proactively.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}