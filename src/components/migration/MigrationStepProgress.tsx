import * as React from "react";
import { CheckCircle } from "lucide-react";

interface MigrationStepProgressProps {
  currentStep: number; // 1-4
}

const steps = [
  { number: 1, label: "Import data" },
  { number: 2, label: "Connect your financial tools" },
  { number: 3, label: "Review" },
  { number: 4, label: "Configuration" }
];

export function MigrationStepProgress({ currentStep }: MigrationStepProgressProps) {
  return (
    <div className="w-full bg-white border-b border-gray-200 py-6 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const isComplete = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            const isUpcoming = currentStep < step.number;
            
            return (
              <div key={step.number} className="flex items-center flex-1 last:flex-initial">
                {/* Step item */}
                <div className="flex items-center gap-3">
                  {/* Circle indicator */}
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    isComplete 
                      ? 'bg-green-600 text-white' 
                      : isCurrent 
                        ? 'bg-[#1C60FF] text-white ring-4 ring-blue-100' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isComplete ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <span className="text-sm">{step.number}</span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <div className={`font-medium transition-all whitespace-nowrap ${
                    isComplete || isCurrent ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </div>
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 transition-all ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
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