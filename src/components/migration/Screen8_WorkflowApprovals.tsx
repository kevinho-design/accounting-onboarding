import * as React from "react";
import { Users, Shield, Bell, Sparkles, Plus, X, Send, Trash2, ChevronLeft, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";
import { ConfigModeToggle } from "./ConfigModeToggle";
import { WizardProgress } from "./WizardProgress";
import { AssignTaskModal, type AssignedTask } from "./AssignTaskModal";

interface Screen8Props {
  onComplete: () => void;
  onBack?: () => void;
  onAssign?: (task: AssignedTask) => void;
}

interface Rule {
  id: string;
  text: string;
  suggested?: boolean;
}

const SUGGESTED_RULES: Rule[] = [
  { id: "s1", text: "Require partner approval for expenses over $5,000", suggested: true },
  { id: "s2", text: "Require dual approval for all trust account transactions", suggested: true },
  { id: "s3", text: "Alert the CFO when operating runway drops below 30 days", suggested: true },
];

const EXAMPLE_PLACEHOLDERS = [
  "Require expenses over $250 to have a receipt attached",
  "Notify all partners when a trust balance drops below $1,000",
  "Route vendor payments over $10,000 to the managing partner",
  "Block expense posting on weekends without manager override",
];

export function Screen8_WorkflowApprovals({ onComplete, onBack, onAssign }: Screen8Props) {
  const [showAssign, setShowAssign] = React.useState(false);
  const [mode, setMode] = React.useState<"suggested" | "advanced">("suggested");
  const [approvalThreshold, setApprovalThreshold] = React.useState("5000");
  const [dualApproval, setDualApproval] = React.useState(true);
  const [alertRecipients, setAlertRecipients] = React.useState(["partners"]);
  const [rules, setRules] = React.useState<Rule[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [placeholderIndex, setPlaceholderIndex] = React.useState(0);
  const [ruleAdded, setRuleAdded] = React.useState(false);
  const [visibleCards, setVisibleCards] = React.useState({
    approval: true,
    trust: true,
    alerts: true,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % EXAMPLE_PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const addRule = () => {
    const text = inputValue.trim();
    if (!text) return;
    setRules((prev) => [...prev, { id: Date.now().toString(), text }]);
    setInputValue("");
    setRuleAdded(true);
    setTimeout(() => setRuleAdded(false), 1500);
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addRule();
  };

  return (
    <>
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 my-8">

          <div className="mb-8 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Step 2 of 4 · Workflow
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Workflow & Approvals
            </h2>
            <p className="text-gray-600 text-lg">
              Set up approval workflows and notification preferences.
            </p>
          </div>

          <WizardProgress currentStep={2} />

          <ConfigModeToggle mode={mode} onModeChange={setMode} />

          {mode === "suggested" ? (
            <div className="space-y-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Recommended Settings</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Based on your firm size (52 attorneys) and practice areas, we recommend:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Partner Approval for $5,000+</div>
                      <div className="text-sm text-gray-600">Expenses over this amount require partner sign-off</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Dual Approval for Trust Transactions</div>
                      <div className="text-sm text-gray-600">Required for Delaware IOLTA compliance</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <Bell className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Partners & CFO Receive Alerts</div>
                      <div className="text-sm text-gray-600">Low balance notifications when runway drops below 30 days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 mb-8">

              {/* ── Natural language rules input ── */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Add a rule in plain language
                </label>

                {/* Input row */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={EXAMPLE_PLACEHOLDERS[placeholderIndex]}
                    className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                  />
                  <button
                    onClick={addRule}
                    disabled={!inputValue.trim()}
                    className="flex items-center gap-1.5 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {/* Confirmation */}
                {ruleAdded && (
                  <p className="text-xs text-green-600 font-medium mt-2 transition-opacity">Rule added</p>
                )}

                {/* Rule chips */}
                <div className="flex flex-col gap-2">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg group"
                    >
                      {rule.suggested ? (
                        <Sparkles className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="flex-1 text-sm text-gray-800">{rule.text}</span>
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  You can add, edit, or remove rules anytime in{" "}
                  <span className="text-blue-500 font-medium">Settings → Automation Rules</span>
                </p>
              </div>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Or configure individually</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Expense Approval Threshold */}
              {visibleCards.approval && (
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-900 mb-1">
                        Who needs to approve expenses over a certain amount?
                      </label>
                      <p className="text-sm text-gray-600">
                        Set a threshold for automatic approval routing
                      </p>
                    </div>
                    <button
                      onClick={() => setVisibleCards((v) => ({ ...v, approval: false }))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Approval threshold</label>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">$</span>
                        <input
                          type="number"
                          value={approvalThreshold}
                          onChange={(e) => setApprovalThreshold(e.target.value)}
                          className="flex-1 p-3 bg-white rounded-lg shadow-sm"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Route approvals to</label>
                      <select className="w-full p-3 bg-white rounded-lg shadow-sm">
                        <option>All Partners</option>
                        <option>Managing Partner Only</option>
                        <option>Specific People (Custom)</option>
                        <option>Department Heads</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Dual Approval */}
              {visibleCards.trust && (
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-900 mb-1">
                        Should trust transactions require dual approval?
                      </label>
                      <p className="text-sm text-gray-600">
                        Recommended for IOLTA compliance and fraud prevention
                      </p>
                    </div>
                    <button
                      onClick={() => setVisibleCards((v) => ({ ...v, trust: false }))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="dualApproval"
                        checked={dualApproval}
                        onChange={() => setDualApproval(true)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-900">Yes, require dual approval</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="dualApproval"
                        checked={!dualApproval}
                        onChange={() => setDualApproval(false)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-900">No, single approval</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Low Balance Alerts */}
              {visibleCards.alerts && (
                <div className="p-5 bg-gray-50 rounded-xl">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block font-semibold text-gray-900 mb-1">
                        Who should receive low balance alerts?
                      </label>
                      <p className="text-sm text-gray-600">
                        Get notified when operating account drops below 30 days runway
                      </p>
                    </div>
                    <button
                      onClick={() => setVisibleCards((v) => ({ ...v, alerts: false }))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertRecipients.includes("partners")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAlertRecipients([...alertRecipients, "partners"]);
                          } else {
                            setAlertRecipients(alertRecipients.filter((r) => r !== "partners"));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-900">All Partners</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertRecipients.includes("cfo")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAlertRecipients([...alertRecipients, "cfo"]);
                          } else {
                            setAlertRecipients(alertRecipients.filter((r) => r !== "cfo"));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-gray-900">CFO / Finance Manager</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-gray-900">Office Administrator</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-700 px-4 py-6 shrink-0">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              Next: Reporting Preferences
            </Button>
            {onAssign && (
              <Button variant="outline" onClick={() => setShowAssign(true)} className="px-5 py-6 rounded-lg font-medium text-gray-600 border-gray-300 shrink-0">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign to someone
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>

    {showAssign && onAssign && (
      <AssignTaskModal
        taskName="Workflow & Approvals"
        onAssign={onAssign}
        onClose={() => setShowAssign(false)}
      />
    )}
    </>
  );
}
