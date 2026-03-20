import * as React from "react";
import { Clock, Sparkles, Users, FileText, Target } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";

interface Screen6Props {
  onComplete: () => void;
  onSkip?: () => void;
}

export function Screen6_WizardIntro({ onComplete, onSkip }: Screen6Props) {
  return (
    <div className="relative flex-1 h-[calc(100vh-90px)] overflow-hidden">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />
      
      <div className="relative z-20 flex items-center justify-center h-full p-8">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10">
          
          <div className="mb-8 mt-4 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Configuration
            </div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Last step: tell us how you work
            </h2>
            <p className="text-gray-600 text-lg">
              We've pre-configured everything based on your data. These few questions let us tailor the rest to how Hartwell & Morris actually operates.
            </p>
          </div>

          {/* What You'll Configure */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">User Roles & Permissions</div>
                <div className="text-sm text-gray-600">We imported your team from Clio Manage. Confirm who gets accounting access.</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Workflow & Approvals</div>
                <div className="text-sm text-gray-600">We detected 3 approval patterns from your transaction history. Confirm or adjust.</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Reporting Preferences</div>
                <div className="text-sm text-gray-600">We've pre-selected the reports most relevant to a Delaware litigation firm. Adjust the schedule.</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Financial Goals</div>
                <div className="text-sm text-gray-600">Set the targets your Teammate will monitor and report against every day.</div>
              </div>
            </div>
          </div>

          {/* Time Estimate */}
          <div className="flex items-center justify-center gap-2 mb-8 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Estimated time: About 5 minutes</span>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={onComplete}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              Start Configuration
            </Button>
            {onSkip && (
              <Button
                onClick={onSkip}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-900"
              >
                Skip - Use Default Settings
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
