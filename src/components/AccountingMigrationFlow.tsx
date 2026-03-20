import * as React from "react";
import { ManageDashboard } from "./ManageDashboard";
import { MigrationMappingScreen } from "./MigrationMappingScreen";
import { ManualMappingReview } from "./ManualMappingReview";
import { MigrationSuccessScreen } from "./MigrationSuccessScreen";
import { CloudBackground } from "./CloudBackground";
import { EmptyWorkspace } from "./EmptyWorkspace";

type MigrationScene = "manage" | "mapping" | "manual-review" | "success";

export function AccountingMigrationFlow() {
  const [currentScene, setCurrentScene] = React.useState<MigrationScene>("manage");

  const renderScene = () => {
    switch (currentScene) {
      case "manage":
        return (
          <ManageDashboard 
            onPreviewMigration={() => setCurrentScene("mapping")}
          />
        );
      
      case "mapping":
        return (
          <MigrationMappingScreen
            onApprove={() => setCurrentScene("success")}
            onManualReview={() => setCurrentScene("manual-review")}
          />
        );
      
      case "manual-review":
        return (
          <ManualMappingReview
            onComplete={() => setCurrentScene("success")}
            onBack={() => setCurrentScene("mapping")}
          />
        );
      
      case "success":
        return (
          <MigrationSuccessScreen
            onGoToAccounting={() => {
              // This would navigate to the actual accounting dashboard
              // For now, just show success state
              console.log("Navigate to Accounting Dashboard");
            }}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      {/* Background Content Layer (blurred) */}
      <div className="absolute inset-0">
        <EmptyWorkspace />
      </div>
      
      {/* Cloud Background */}
      <CloudBackground />
      
      {/* Blurred Overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/50" />
      
      {/* Migration Flow Content (on top) */}
      <div className="relative z-20 flex-1">
        {renderScene()}
      </div>
    </div>
  );
}