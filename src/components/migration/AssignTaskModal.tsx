import * as React from "react";
import { X, Send, UserPlus } from "lucide-react";
import { Button } from "../ui/button";

export interface AssignedTask {
  taskName: string;
  assignee: string;
  email: string;
  note?: string;
}

const TEAM_SUGGESTIONS = [
  { name: "Michael Chen",    email: "michael@lawfirm.com",  role: "Partner" },
  { name: "Sarah Martinez",  email: "sarah@lawfirm.com",    role: "Office Manager" },
  { name: "David Thompson",  email: "david@lawfirm.com",    role: "Accountant" },
  { name: "Alex Rivera",     email: "a.rivera@lawfirm.com", role: "IT Manager" },
];

interface AssignTaskModalProps {
  taskName: string;
  onAssign: (task: AssignedTask) => void;
  onClose: () => void;
}

export function AssignTaskModal({ taskName, onAssign, onClose }: AssignTaskModalProps) {
  const [assignee, setAssignee] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [sent, setSent] = React.useState(false);

  const handleSuggestion = (s: typeof TEAM_SUGGESTIONS[number]) => {
    setAssignee(s.name);
    setEmail(s.email);
  };

  const handleSubmit = () => {
    if (!assignee.trim() || !email.trim()) return;
    setSent(true);
    setTimeout(() => {
      onAssign({ taskName, assignee: assignee.trim(), email: email.trim(), note: note.trim() || undefined });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">Assign Task</p>
              <h2 className="text-lg font-semibold text-gray-900">{taskName}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Send className="w-7 h-7 text-green-600" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">Invitation sent!</p>
            <p className="text-sm text-gray-500">
              {assignee} will receive an email with instructions to complete this step. Continuing setup…
            </p>
          </div>
        ) : (
          <>
            {/* Team suggestions */}
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Suggest from your team</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {TEAM_SUGGESTIONS.map((s) => (
                <button
                  key={s.email}
                  onClick={() => handleSuggestion(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-all ${
                    email === s.email
                      ? "border-blue-400 bg-blue-50 text-blue-700 font-medium"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
                    {s.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  {s.name}
                  <span className="text-gray-400 text-xs">· {s.role}</span>
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Name</label>
                <input
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  placeholder="Full name"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@lawfirm.com"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Note <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add context for the assignee…"
                  rows={2}
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-200 outline-none transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSubmit}
                disabled={!assignee.trim() || !email.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2.5 font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                Send & Continue
              </Button>
              <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
