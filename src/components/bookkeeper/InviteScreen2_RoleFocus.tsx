import * as React from "react";
import { Check, Sparkles, Plus, X, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";

interface InviteScreen2Props {
  onComplete: () => void;
  onBack?: () => void;
}

const DEFAULT_RESPONSIBILITIES = [
  "Transaction review & coding",
  "Bank reconciliation",
  "Expense categorization",
  "Vendor management",
];

const AI_HANDLES = [
  "Auto-categorization of new transactions",
  "Duplicate transaction detection",
  "Approval routing (per Jennifer's rules)",
  "IOLTA compliance monitoring",
  "Real-time bank feed reconciliation",
];

export function InviteScreen2_RoleFocus({ onComplete, onBack }: InviteScreen2Props) {
  const [responsibilities, setResponsibilities] = React.useState<string[]>(DEFAULT_RESPONSIBILITIES);
  const [checked, setChecked] = React.useState<Set<string>>(new Set(DEFAULT_RESPONSIBILITIES));
  const [newItem, setNewItem] = React.useState("");
  const [aiChecked, setAiChecked] = React.useState<Set<string>>(new Set(AI_HANDLES));

  const toggleAiItem = (item: string) => {
    setAiChecked(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const toggleItem = (item: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed || responsibilities.includes(trimmed)) return;
    setResponsibilities(prev => [...prev, trimmed]);
    setChecked(prev => new Set([...prev, trimmed]));
    setNewItem("");
  };

  const removeItem = (item: string) => {
    setResponsibilities(prev => prev.filter(r => r !== item));
    setChecked(prev => {
      const next = new Set(prev);
      next.delete(item);
      return next;
    });
  };

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-10">

          <div className="mb-8 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Your Role
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Here's what Clio has lined up for you
            </h2>
            <p className="text-gray-600 text-base">
              As the bookkeeper, you focus on the work that needs human judgment. Clio Accounting handles everything else.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Sarah's responsibilities */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">S</span>
                </div>
                <span className="font-semibold text-gray-900 text-sm">Sarah handles</span>
              </div>

              <div className="space-y-2">
                {responsibilities.map(item => (
                  <div
                    key={item}
                    onClick={() => toggleItem(item)}
                    className={`group flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      checked.has(item)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                      checked.has(item) ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"
                    }`}>
                      {checked.has(item) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm flex-1 ${checked.has(item) ? "text-gray-900" : "text-gray-400 line-through"}`}>
                      {item}
                    </span>
                    {!DEFAULT_RESPONSIBILITIES.includes(item) && (
                      <button
                        onClick={e => { e.stopPropagation(); removeItem(item); }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add custom responsibility */}
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addItem()}
                    placeholder="Add a responsibility..."
                    className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-gray-400"
                  />
                  <button
                    onClick={addItem}
                    disabled={!newItem.trim()}
                    className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center disabled:opacity-30 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* AI handles */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-gray-900 text-sm">Clio Accounting handles</span>
              </div>

              <div className="space-y-2">
                {AI_HANDLES.map(item => (
                  <div
                    key={item}
                    onClick={() => toggleAiItem(item)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      aiChecked.has(item)
                        ? "bg-purple-50 border-purple-200"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                      aiChecked.has(item) ? "bg-purple-500 border-purple-500" : "border-gray-300 bg-white"
                    }`}>
                      {aiChecked.has(item) && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm flex-1 ${aiChecked.has(item) ? "text-gray-700" : "text-gray-400 line-through"}`}>
                      {item}
                    </span>
                    <Sparkles className={`w-3.5 h-3.5 flex-shrink-0 transition-colors ${aiChecked.has(item) ? "text-purple-400" : "text-gray-300"}`} />
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-3 pl-1">
                Configured by Jennifer · editable anytime in Settings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-700 px-4 py-6 shrink-0">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              onClick={onComplete}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              Looks Good
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
