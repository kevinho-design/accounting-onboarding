import * as React from "react";
import { CFOAvatar } from "./CFOAvatar";
import { motion } from "motion/react";

interface AICFOMessageProps {
  message: string;
  type?: "insight" | "celebration" | "alert" | "suggestion";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function AICFOMessage({ message, type = "insight", action }: AICFOMessageProps) {
  const bgColors = {
    insight: "from-blue-50 to-purple-50",
    celebration: "from-green-50 to-emerald-50",
    alert: "from-orange-50 to-yellow-50",
    suggestion: "from-indigo-50 to-cyan-50"
  };

  const borderColors = {
    insight: "border-blue-200",
    celebration: "border-green-200",
    alert: "border-orange-200",
    suggestion: "border-indigo-200"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 bg-gradient-to-br ${bgColors[type]} border ${borderColors[type]} rounded-2xl`}
    >
      <div className="flex gap-4">
        <CFOAvatar size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-gray-900">Your Teammate</span>
            <span className="text-xs text-gray-500">just now</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            {message}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              {action.label} →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}