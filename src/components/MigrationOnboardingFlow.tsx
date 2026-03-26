import * as React from "react";
import { UploadFileFlow, type UploadStep } from "./UploadFileFlow";
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
import { type AssignedTask } from "./migration/AssignTaskModal";

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
  const [uploadMode, setUploadMode] = React.useState(false);
  const [uploadStep, setUploadStep] = React.useState<UploadStep>("processing");
  const [assignedTasks, setAssignedTasks] = React.useState<AssignedTask[]>([]);

  const handleAssign = (task: AssignedTask) => {
    setAssignedTasks((prev) => [...prev, task]);
    handleStepComplete();
  };

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

  const handleStepBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
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
        return <Screen1_UploadAnalysis onComplete={handleStepComplete} onUploadFile={() => setUploadMode(true)} />;
      case "intelligence":
        return <Screen2_MigrationIntelligence onComplete={handleStepComplete} onBack={() => setCurrentStep("upload")} />;
      case "services":
        return <Screen3_ConnectedServices onComplete={handleStepComplete} onAssign={handleAssign} />;
      case "training":
        return <Screen4_AITraining onComplete={handleStepComplete} />;
      case "preview":
        return <Screen5_DashboardPreview onComplete={handleStepComplete} />;
      case "wizard-intro":
        return <Screen6_WizardIntro onComplete={handleStepComplete} onSkip={handleSkipConfiguration} onBack={handleStepBack} />;
      case "users":
        return <Screen7_UserMapping onComplete={handleStepComplete} onBack={handleStepBack} onAssign={handleAssign} />;
      case "workflow":
        return <Screen8_WorkflowApprovals onComplete={handleStepComplete} onBack={handleStepBack} onAssign={handleAssign} />;
      case "reporting":
        return <Screen9_ReportingPreferences onComplete={handleStepComplete} onBack={handleStepBack} onAssign={handleAssign} />;
      case "goals":
        return <Screen10_FinancialGoals onComplete={handleStepComplete} onBack={handleStepBack} onAssign={handleAssign} />;
      case "configuring":
        return <Screen11_ConfiguringSystem onComplete={handleStepComplete} />;
      case "complete":
        return <Screen12_Complete onComplete={onComplete} assignedTasks={assignedTasks} />;
      default:
        return null;
    }
  };

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0 });
  }, [currentStep]);

  const uploadMainStep = 1;

  if (uploadMode) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0 sticky top-0 z-10">
          <MigrationStepProgress currentStep={uploadMainStep} />
        </div>
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto flex flex-col">
          <UploadFileFlow
            onComplete={() => { setUploadMode(false); setCurrentStep("services"); }}
            onStepChange={setUploadStep}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 sticky top-0 z-10">
        <MigrationStepProgress currentStep={mainStepNumber} />
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {renderStep()}
      </div>
    </div>
  );
}