import * as React from "react";
import { CheckCircle } from "lucide-react";
import { InviteScreen1_Welcome } from "./bookkeeper/InviteScreen1_Welcome";
import { InviteScreen2_RoleFocus } from "./bookkeeper/InviteScreen2_RoleFocus";
import { InviteScreen3_Notifications } from "./bookkeeper/InviteScreen3_Notifications";
import { InviteScreen4_Setup } from "./bookkeeper/InviteScreen4_Setup";

type BookkeeperStep = "welcome" | "role" | "notifications" | "setup";

interface BookkeeperOnboardingFlowProps {
  onComplete: () => void;
}

const PROGRESS_STEPS = [
  { key: "welcome", label: "Accept invite" },
  { key: "role", label: "Your role" },
  { key: "notifications", label: "Preferences" },
];

function BookkeeperStepProgress({ currentStep }: { currentStep: BookkeeperStep }) {
  const stepIndex = ["welcome", "role", "notifications", "setup"].indexOf(currentStep);

  if (currentStep === "setup") return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 py-6 px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center">
          {PROGRESS_STEPS.map((step, index) => {
            const isComplete = stepIndex > index;
            const isCurrent = stepIndex === index;

            return (
              <div key={step.key} className="flex items-center flex-1 last:flex-initial">
                <div className="flex items-center gap-3">
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    isComplete
                      ? "bg-green-600 text-white"
                      : isCurrent
                        ? "bg-[#1C60FF] text-white ring-4 ring-blue-100"
                        : "bg-gray-200 text-gray-500"
                  }`}>
                    {isComplete ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className={`font-medium transition-all whitespace-nowrap ${
                    isComplete || isCurrent ? "text-gray-900" : "text-gray-500"
                  }`}>
                    {step.label}
                  </div>
                </div>

                {index < PROGRESS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-all ${
                    stepIndex > index ? "bg-green-600" : "bg-gray-200"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BookkeeperOnboardingFlow({ onComplete }: BookkeeperOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = React.useState<BookkeeperStep>("welcome");

  const order: BookkeeperStep[] = ["welcome", "role", "notifications", "setup"];

  const advance = () => {
    const idx = order.indexOf(currentStep);
    if (idx < order.length - 1) {
      setCurrentStep(order[idx + 1]);
    } else {
      onComplete();
    }
  };

  const goBack = () => {
    const idx = order.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(order[idx - 1]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <BookkeeperStepProgress currentStep={currentStep} />
      {currentStep === "welcome" && <InviteScreen1_Welcome onComplete={advance} />}
      {currentStep === "role" && <InviteScreen2_RoleFocus onComplete={advance} onBack={goBack} />}
      {currentStep === "notifications" && <InviteScreen3_Notifications onComplete={advance} onBack={goBack} />}
      {currentStep === "setup" && <InviteScreen4_Setup onComplete={onComplete} onBack={goBack} />}
    </div>
  );
}
