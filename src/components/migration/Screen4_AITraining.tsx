import * as React from "react";
import { Brain, Zap, TrendingUp } from "lucide-react";
import { CloudBackground } from "../CloudBackground";
import { GalaxyNebula } from "./animations/GalaxyNebula";

interface Screen4Props {
  onComplete: () => void;
}

export function Screen4_AITraining({ onComplete }: Screen4Props) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

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
                Review • Learning
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                Learning Your Firm's Patterns
              </h2>
              <p className="text-gray-600 text-lg">
                Analyzing historical data to auto-categorize future transactions
              </p>
            </div>

            {/* Animated Brain Icon */}
            <div className="relative mb-8 flex justify-center">
              {/* Galaxy Nebula behind spinner at 75% opacity */}
              <div className="absolute inset-0 flex items-center justify-center scale-75 opacity-75 pointer-events-none">
                <GalaxyNebula />
              </div>
              
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-white animate-pulse" />
                </div>
                {/* Pulsing Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-purple-300 animate-ping opacity-30" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Processing 34,520 transactions...</span>
                <span className="text-sm font-semibold text-blue-600">{progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Learning Insights */}
            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                progress > 25 ? 'bg-blue-50 opacity-100' : 'bg-gray-50 opacity-30'
              }`}>
                <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Identifying vendor payment patterns</span>
              </div>
              
              <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                progress > 50 ? 'bg-purple-50 opacity-100' : 'bg-gray-50 opacity-30'
              }`}>
                <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Learning trust transaction classifications</span>
              </div>
              
              <div className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                progress > 75 ? 'bg-green-50 opacity-100' : 'bg-gray-50 opacity-30'
              }`}>
                <Brain className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700">Optimizing matter-expense matching rules</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}