import * as React from "react";
import { Bell, Zap, CalendarClock, ClipboardCheck } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";

interface InviteScreen3Props {
  onComplete: () => void;
}

interface NotificationOption {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  defaultOn: boolean;
  color: string;
}

const NOTIFICATION_OPTIONS: NotificationOption[] = [
  {
    id: "daily-digest",
    icon: <Bell className="w-5 h-5 text-white" />,
    title: "Daily digest",
    description: "A morning summary of overnight transactions, pending items, and reconciliation status — sent at 8am.",
    defaultOn: true,
    color: "bg-blue-600",
  },
  {
    id: "realtime-exceptions",
    icon: <Zap className="w-5 h-5 text-white" />,
    title: "Real-time exception alerts",
    description: "Instant notifications when the AI flags an unusual transaction, duplicate, or potential compliance issue.",
    defaultOn: true,
    color: "bg-orange-500",
  },
  {
    id: "weekly-reconciliation",
    icon: <CalendarClock className="w-5 h-5 text-white" />,
    title: "Weekly reconciliation reminder",
    description: "A Friday reminder with outstanding items that need your sign-off before week close.",
    defaultOn: true,
    color: "bg-purple-600",
  },
  {
    id: "approval-requests",
    icon: <ClipboardCheck className="w-5 h-5 text-white" />,
    title: "Approval request notifications",
    description: "Notifications when a transaction or expense hits your approval queue per Jennifer's workflow rules.",
    defaultOn: false,
    color: "bg-green-600",
  },
];

export function InviteScreen3_Notifications({ onComplete }: InviteScreen3Props) {
  const [enabled, setEnabled] = React.useState<Set<string>>(
    new Set(NOTIFICATION_OPTIONS.filter(o => o.defaultOn).map(o => o.id))
  );

  const toggle = (id: string) => {
    setEnabled(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10">

          <div className="mb-8 text-center">
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Preferences
            </div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bell className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              How should we keep you in the loop?
            </h2>
            <p className="text-gray-600 text-base">
              Choose what matters to you. You can adjust these anytime in your notification settings.
            </p>
          </div>

          <div className="space-y-3 mb-8">
            {NOTIFICATION_OPTIONS.map(option => {
              const isOn = enabled.has(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggle(option.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
                    isOn
                      ? "bg-blue-50 border-blue-200 shadow-sm"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-opacity ${option.color} ${isOn ? "opacity-100" : "opacity-40"}`}>
                    {option.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm mb-0.5 ${isOn ? "text-gray-900" : "text-gray-500"}`}>
                      {option.title}
                    </p>
                    <p className={`text-xs leading-relaxed ${isOn ? "text-gray-600" : "text-gray-400"}`}>
                      {option.description}
                    </p>
                  </div>
                  {/* Toggle */}
                  <div className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 mt-0.5 ${isOn ? "bg-blue-600" : "bg-gray-300"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isOn ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </button>
              );
            })}
          </div>

          <Button
            onClick={onComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
