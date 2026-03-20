import * as React from "react";
import { Sparkles, Settings } from "lucide-react";

interface ConfigModeToggleProps {
  mode: "suggested" | "advanced";
  onModeChange: (mode: "suggested" | "advanced") => void;
}

export function ConfigModeToggle({ mode, onModeChange }: ConfigModeToggleProps) {
  return (
    <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg mb-6">
      <button
        onClick={() => onModeChange("suggested")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          mode === "suggested"
            ? "bg-white text-blue-700 font-semibold shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Sparkles className="w-4 h-4" />
        <span>Suggested</span>
      </button>
      <button
        onClick={() => onModeChange("advanced")}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          mode === "advanced"
            ? "bg-white text-blue-700 font-semibold shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <Settings className="w-4 h-4" />
        <span>Advanced</span>
      </button>
    </div>
  );
}
