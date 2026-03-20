import * as React from "react";
import { MapPin, Scale, Building2, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";

interface Screen2Props {
  onComplete: () => void;
}

export function Screen2_RegionDetection({ onComplete }: Screen2Props) {
  return (
    <div className="relative flex-1 h-screen overflow-hidden">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />
      
      <div className="relative z-20 flex items-center justify-center h-full p-8">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10">
          
          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Step 2 of 14 • Migration Intelligence
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Let Us Personalize Clio Accounting for You
            </h2>
            <p className="text-gray-600 text-lg">
              Based on your QuickBooks data, here's what we know about your firm. We'll use this to configure your accounting system perfectly for your practice.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Your Location</div>
                <div className="text-gray-700 text-lg mb-2">Delaware</div>
                <div className="text-sm text-gray-600">We'll configure state-specific compliance rules and IOLTA requirements</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Practice Areas</div>
                <div className="text-gray-700 text-lg mb-2">Litigation, Real Estate, Family Law</div>
                <div className="text-sm text-gray-600">Your chart of accounts will include categories optimized for these practice areas</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-green-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Firm Size</div>
                <div className="text-gray-700 text-lg mb-2">52 attorneys</div>
                <div className="text-sm text-gray-600">We'll set up workflows and approval processes appropriate for your firm size</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 bg-orange-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">AI Personalization</div>
                <div className="text-gray-700 text-lg mb-2">Custom ML Model</div>
                <div className="text-sm text-gray-600">We'll train an AI model on your historical patterns to auto-categorize future transactions</div>
              </div>
            </div>
          </div>

          <Button
            onClick={onComplete}
            className="w-full bg-[#1C60FF] hover:bg-[#1550E0] text-white px-8 py-6 rounded-lg font-semibold text-lg"
          >
            Personalize My Accounting System
          </Button>
        </div>
      </div>
    </div>
  );
}