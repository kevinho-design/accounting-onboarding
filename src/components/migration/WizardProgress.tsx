import * as React from "react";
import { CheckCircle } from "lucide-react";

interface WizardProgressProps {
  currentStep: 1 | 2 | 3 | 4;
}

const STEPS = [
  { label: "User Roles" },
  { label: "Workflow" },
  { label: "Reporting" },
  { label: "Goals" },
];

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center">
        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    isComplete
                      ? "bg-blue-600 text-white"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                    isComplete || isCurrent ? "text-gray-700" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-5 transition-colors ${
                    stepNum < currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
