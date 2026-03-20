import * as React from "react";
import { Screen1_UploadAnalysis } from "./migration/Screen1_UploadAnalysis";
import { Screen2_MigrationIntelligence } from "./migration/Screen2_MigrationIntelligence";
import { Screen3_ConnectedServices } from "./migration/Screen3_ConnectedServices";
import { Screen4_AITraining } from "./migration/Screen4_AITraining";
import { Screen5_DashboardPreview } from "./migration/Screen5_DashboardPreview";
import { Screen6_WizardIntro } from "./migration/Screen6_WizardIntro";
import { Screen7_UserMapping } from "./migration/Screen7_UserMapping";
import { Screen8_WorkflowApprovals } from "./migration/Screen8_WorkflowApprovals";
import { Screen9_ReportingPreferences } from "./migration/Screen9_ReportingPreferences";
import { Screen10_FinancialGoals } from "./migration/Screen10_FinancialGoals";
import { Screen11_ConfiguringSystem } from "./migration/Screen11_ConfiguringSystem";
import { Screen12_Complete } from "./migration/Screen12_Complete";
import { MigrationStepProgress } from "./migration/MigrationStepProgress";

type MigrationStep = 
  | "upload"
  | "intelligence"
  | "services"
  | "training"
  | "preview"
  | "wizard-intro"
  | "users"
  | "workflow"
  | "reporting"
  | "goals"
  | "configuring"
  | "complete";

interface MigrationOnboardingFlowProps {
  onComplete: () => void;
}

export function MigrationOnboardingFlow({ onComplete }: MigrationOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = React.useState<MigrationStep>("upload");

  const steps: MigrationStep[] = [
    "upload",
    "intelligence",
    "services",
    "training",
    "preview",
    "wizard-intro",
    "users",
    "workflow",
    "reporting",
    "goals",
    "configuring",
    "complete"
  ];

  // Map current step to main category (1-4)
  const getMainStepNumber = (step: MigrationStep): number => {
    if (step === "upload" || step === "intelligence") return 1;
    if (step === "services") return 2;
    if (step === "training" || step === "preview") return 3;
    if (step === "wizard-intro" || step === "users" || step === "workflow" || step === "reporting" || step === "goals" || step === "configuring") return 4;
    if (step === "complete") return 5; // All complete
    return 1;
  };

  const handleStepComplete = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      onComplete();
    }
  };

  const handleSkipConfiguration = () => {
    // Skip from wizard-intro to configuring (skips workflow, reporting, goals)
    setCurrentStep("configuring");
  };

  const mainStepNumber = getMainStepNumber(currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case "upload":
        return <Screen1_UploadAnalysis onComplete={handleStepComplete} />;
      case "intelligence":
        return <Screen2_MigrationIntelligence onComplete={handleStepComplete} />;
      case "services":
        return <Screen3_ConnectedServices onComplete={handleStepComplete} />;
      case "training":
        return <Screen4_AITraining onComplete={handleStepComplete} />;
      case "preview":
        return <Screen5_DashboardPreview onComplete={handleStepComplete} />;
      case "wizard-intro":
        return <Screen6_WizardIntro onComplete={handleStepComplete} onSkip={handleSkipConfiguration} />;
      case "users":
        return <Screen7_UserMapping onComplete={handleStepComplete} />;
      case "workflow":
        return <Screen8_WorkflowApprovals onComplete={handleStepComplete} />;
      case "reporting":
        return <Screen9_ReportingPreferences onComplete={handleStepComplete} />;
      case "goals":
        return <Screen10_FinancialGoals onComplete={handleStepComplete} />;
      case "configuring":
        return <Screen11_ConfiguringSystem onComplete={handleStepComplete} />;
      case "complete":
        return <Screen12_Complete onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <MigrationStepProgress currentStep={mainStepNumber} />
      {renderStep()}
    </div>
  );
}