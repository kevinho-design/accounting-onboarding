import * as React from "react";
import { Upload, CheckCircle, Loader2, FileText, Building2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";
import { GalaxyNebula } from "./animations/GalaxyNebula";

interface Screen1Props {
  onComplete: () => void;
}

export function Screen1_UploadAnalysis({ onComplete }: Screen1Props) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Sequentially complete each step
    setTimeout(() => setCompletedSteps([0]), 500);
    setTimeout(() => setCompletedSteps([0, 1]), 1000);
    setTimeout(() => setCompletedSteps([0, 1, 2]), 1500);
    setTimeout(() => setCompletedSteps([0, 1, 2, 3]), 2000);
    
    setTimeout(() => {
      onComplete();
    }, 3000);
  };

  const analysisSteps = [
    "Chart of accounts detected (52 accounts)",
    "Vendor list imported (127 vendors)",
    "Transaction history analyzed (3 years)",
    "Identifying compliance requirements..."
  ];

  return (
    <div className="relative flex-1 h-[calc(100vh-90px)] overflow-hidden">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />
      
      <div className="relative z-20 flex items-center justify-center h-full p-8">
        {!isAnalyzing ? (
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-10">
            
            {/* AI Detection Badge */}
            <div className="mb-6 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  We detected you're using QuickBooks Online
                </span>
              </div>
            </div>

            <div className="mb-8 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
                Import Data • Migration Intelligence
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                Connect Your QuickBooks Account
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We'll securely import your data and intelligently migrate everything to Clio Accounting with AI-powered optimization.
              </p>
            </div>

            {/* Primary Option: QuickBooks */}
            <div className="mb-6">
              <Button 
                onClick={handleAnalyze} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Connect to QuickBooks Online
              </Button>
              <p className="text-center text-xs text-gray-500 mt-2">
                Recommended • Fastest migration with full history
              </p>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">Other import options</span>
              </div>
            </div>

            {/* Alternative Options Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* File Upload */}
              <button
                onClick={handleAnalyze}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <FileText className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Upload File</p>
                  <p className="text-xs text-gray-500 leading-tight">Import CSV, Excel, or QBO file</p>
                </div>
              </button>

              {/* Other Platforms */}
              <button
                onClick={handleAnalyze}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Building2 className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Other Platform</p>
                  <p className="text-xs text-gray-500 leading-tight">Xero, PCLaw, or other software</p>
                </div>
              </button>

              {/* Start from Scratch */}
              <button
                onClick={handleAnalyze}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Upload className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Start from Scratch</p>
                  <p className="text-xs text-gray-500 leading-tight">Set up a fresh chart of accounts</p>
                </div>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Need help?{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View migration guide
                </button>
                {" "}or{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  contact support
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Background Galaxy Nebula - Larger and Transparent */}
            <div className="absolute inset-0 flex items-center justify-center opacity-25 scale-[3] pointer-events-none">
              <GalaxyNebula />
            </div>
            
            {/* Card Content */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 overflow-hidden">
            
              <div className="relative mb-8 mt-4 text-center">
                <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                  Analyzing your QuickBooks data...
                </h2>
                <p className="text-gray-600 text-lg">
                  This will take just a moment
                </p>
              </div>

              {/* Animated Loader Icon */}
              <div className="relative mb-8 flex justify-center">
                {/* Galaxy Nebula behind spinner at 75% opacity */}
                <div className="absolute inset-0 flex items-center justify-center scale-75 opacity-75 pointer-events-none">
                  <GalaxyNebula />
                </div>
                
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white animate-pulse" />
                  </div>
                  {/* Pulsing Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-30" />
                </div>
              </div>

              <div className="relative space-y-4">
                {analysisSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(index);
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 animate-spin" />
                      )}
                      <span className={`${isCompleted ? 'text-gray-700' : 'text-gray-600'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}