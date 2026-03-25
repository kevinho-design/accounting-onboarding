import * as React from 'react';
import { Info, Edit2, RotateCcw, ChevronUp } from 'lucide-react';
import { motion } from 'motion/react';
import { AGENTS, type AgentAction } from './AgentTypes';

interface ExplainableActionProps {
  action: AgentAction;
  onEdit?: () => void;
  onReverse?: () => void;
}

export function ExplainableAction({ action, onEdit, onReverse }: ExplainableActionProps) {
  const [showReasoning, setShowReasoning] = React.useState(false);
  const agent = AGENTS[action.agentId];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <div className="flex items-start justify-between gap-3 p-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <div className="text-xs font-medium text-gray-600">{agent.name}</div>
            <div className="text-xs text-gray-400">•</div>
            <div className="text-xs text-gray-500">
              {new Date(action.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div className="text-sm text-gray-900">{action.action}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowReasoning(!showReasoning)}
            className="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            title="Show reasoning"
          >
            {showReasoning ? <ChevronUp className="h-4 w-4" /> : <Info className="h-4 w-4" />}
          </button>
          {action.isEditable && onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          {action.isReversible && onReverse && (
            <button
              type="button"
              onClick={onReverse}
              className="rounded p-1.5 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-600"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {showReasoning && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200 bg-white p-3"
        >
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
            <div>
              <div className="mb-1 text-xs font-medium text-gray-900">Why this happened:</div>
              <p className="text-xs leading-relaxed text-gray-600">{action.reasoning}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
