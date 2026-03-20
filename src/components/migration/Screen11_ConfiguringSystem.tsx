import * as React from "react";
import { Settings, CheckCircle, Loader2, CheckCircle2 } from "lucide-react";
import { CloudBackground } from "../CloudBackground";
import { GalaxyNebula } from "./animations/GalaxyNebula";

interface Screen11Props {
  onComplete: () => void;
}

export function Screen11_ConfiguringSystem({ onComplete }: Screen11Props) {
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  
  const configSteps = [
    "Dashboard widgets customized",
    "Report schedules created",
    "Approval workflows configured",
    "Goal tracking activated",
    "Ambient insights calibrated"
  ];

  React.useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    configSteps.forEach((_, index) => {
      const t = setTimeout(() => {
        setCompletedSteps(prev => prev.includes(index) ? prev : [...prev, index]);
      }, (index + 1) * 800);
      timeouts.push(t);
    });

    const done = setTimeout(() => {
      onComplete();
    }, (configSteps.length + 1) * 800);
    timeouts.push(done);

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative flex-1 h-[calc(100vh-90px)] overflow-hidden">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />
      
      <div className="relative z-20 flex items-center justify-center h-full p-8">
        <div className="relative">
          {/* Background Galaxy Nebula - Larger and Transparent */}
          <div className="absolute inset-0 flex items-center justify-center opacity-25 scale-[3] pointer-events-none">
            <GalaxyNebula />
          </div>
          
          {/* Card Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 overflow-hidden">
          
          <div className="relative mb-8 mt-4 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
                Configuration • Finalizing
              </div>
              
              {/* Animated Settings Icon */}
              <div className="relative flex justify-center mb-4">
                {/* Galaxy Nebula behind spinner at 75% opacity */}
                <div className="absolute inset-0 flex items-center justify-center scale-75 opacity-75 pointer-events-none">
                  <GalaxyNebula />
                </div>
                
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Settings className="w-10 h-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                  {/* Pulsing Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-30" />
                </div>
              </div>
              
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                Configuring Your System
              </h2>
              <p className="text-gray-600 text-lg">
                Applying your preferences and personalizing your experience...
              </p>
            </div>

            {/* Configuration Steps */}
            <div className="space-y-3 mb-8">
              {configSteps.map((step, index) => {
                const isComplete = completedSteps.includes(index);
                const isInProgress = completedSteps.length === index;
                
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-500 ${
                      isComplete ? 'bg-green-50' :
                      isInProgress ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    ) : isInProgress ? (
                      <Loader2 className="w-6 h-6 text-blue-600 flex-shrink-0 animate-spin" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span className={`font-medium ${
                      isComplete ? 'text-gray-900' :
                      isInProgress ? 'text-blue-900' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress Indicator */}
            <div className="text-center">
              {completedSteps.length === configSteps.length ? (
                <div className="inline-flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">All done — launching your dashboard</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-blue-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">
                    {completedSteps.length} of {configSteps.length} complete
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
