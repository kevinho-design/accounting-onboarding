import * as React from "react";
import { Info, Edit2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";
import { AgentAction } from "./AgentTypes";
import { AGENTS } from "./AgentTypes";
import { motion } from "motion/react";

interface ExplainableActionProps {
  action: AgentAction;
  onEdit?: () => void;
  onReverse?: () => void;
}

export function ExplainableAction({ action, onEdit, onReverse }: ExplainableActionProps) {
  const [showReasoning, setShowReasoning] = React.useState(false);
  const agent = AGENTS[action.agentId];

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      {/* Action Summary */}
      <div className="p-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xs font-medium text-gray-600">{agent.name}</div>
            <div className="text-xs text-gray-400">•</div>
            <div className="text-xs text-gray-500">
              {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="text-sm text-gray-900">{action.action}</div>
        </div>
        
        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowReasoning(!showReasoning)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Show reasoning"
          >
            {showReasoning ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <Info className="w-4 h-4" />
            )}
          </button>
          {action.isEditable && onEdit && (
            <button
              onClick={onEdit}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {action.isReversible && onReverse && (
            <button
              onClick={onReverse}
              className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
              title="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Reasoning Panel */}
      {showReasoning && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200 bg-white p-3"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-gray-900 mb-1">Why this happened:</div>
              <p className="text-xs text-gray-600 leading-relaxed">{action.reasoning}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
