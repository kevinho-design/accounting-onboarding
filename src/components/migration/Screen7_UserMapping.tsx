import * as React from "react";
import {
  CheckCircle,
  AlertCircle,
  Sparkles,
  User,
  UserPlus,
  Edit2,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";
import { ConfigModeToggle } from "./ConfigModeToggle";

interface Screen7Props {
  onComplete: () => void;
  onBack?: () => void;
}

interface UserMapping {
  id: string;
  clioManageName: string;
  email: string;
  role: string;
  status: "auto-mapped" | "needs-review" | "new";
  accountingRole: string;
  permissions: string[];
  avatarColor: string;
}

export function Screen7_UserMapping({
  onComplete,
  onBack,
}: Screen7Props) {
  const [mode, setMode] = React.useState<
    "suggested" | "advanced"
  >("suggested");
  const [users, setUsers] = React.useState<UserMapping[]>([
    {
      id: "1",
      clioManageName: "Jennifer Williams",
      email: "jennifer@lawfirm.com",
      role: "Controller",
      status: "auto-mapped",
      accountingRole: "Controller",
      permissions: [
        "Full Access",
        "Approve Transactions",
        "View Reports",
      ],
      avatarColor: "from-blue-500 to-purple-600",
    },
    {
      id: "2",
      clioManageName: "Michael Chen",
      email: "michael@lawfirm.com",
      role: "Partner",
      status: "auto-mapped",
      accountingRole: "Partner",
      permissions: ["View Reports", "Approve Transactions"],
      avatarColor: "from-green-500 to-teal-600",
    },
    {
      id: "3",
      clioManageName: "Sarah Martinez",
      email: "sarah@lawfirm.com",
      role: "Office Manager",
      status: "auto-mapped",
      accountingRole: "Bookkeeper",
      permissions: ["Manage Transactions", "View Reports"],
      avatarColor: "from-orange-500 to-red-600",
    },
    {
      id: "4",
      clioManageName: "David Thompson",
      email: "david@lawfirm.com",
      role: "Associate",
      status: "auto-mapped",
      accountingRole: "Timekeeper",
      permissions: ["View Own Matters", "Submit Expenses"],
      avatarColor: "from-purple-500 to-pink-600",
    },
  ]);

  const [isEditing, setIsEditing] = React.useState<
    string | null
  >(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const statusConfig = {
    "auto-mapped": {
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      label: "Auto-Mapped",
      description: "AI matched from Clio Manage",
    },
    "needs-review": {
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      label: "Needs Review",
      description: "Please verify mapping",
    },
    new: {
      icon: UserPlus,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      label: "New User",
      description: "Will be created",
    },
  };

  const autoMappedCount = users.filter(
    (u) => u.status === "auto-mapped",
  ).length;

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 my-8">
          {/* Header */}
          <div className="mb-7 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.34px] text-[#6a7282] mb-[10.5px]">
              Configuration • User Management
            </div>
            <h2 className="text-[26.25px] font-semibold text-[#101828] mb-[10.5px] leading-[31.5px] tracking-[0.24px]">
              Import Your Team
            </h2>
            <p className="text-[#4a5565] text-[15.75px] leading-[24.5px] tracking-[-0.29px]">
              We detected {users.length} users from Clio Manage
              and automatically mapped their accounting roles
              and permissions.
            </p>
          </div>

          <ConfigModeToggle
            mode={mode}
            onModeChange={setMode}
          />

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Configuration Progress
              </span>
              <span className="text-sm font-semibold text-blue-600">
                Step 1 of 4
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-full w-1/4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
            </div>
          </div>

          {mode === "suggested" ? (
            // Suggested Mode - Simple Overview
            <div className="space-y-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    AI-Mapped User Roles
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Based on your Clio Manage permissions, we've
                  automatically assigned accounting roles to
                  your team:
                </p>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg"
                    >
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-white font-semibold text-xs">
                          {getInitials(user.clioManageName)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user.clioManageName}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">
                            {user.role}
                          </span>{" "}
                          →{" "}
                          <span className="font-semibold text-blue-600">
                            {user.accountingRole}
                          </span>
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Advanced Mode - Detailed Editing
            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                {users.map((user) => {
                  const config = statusConfig[user.status];
                  const StatusIcon = config.icon;

                  return (
                    <div
                      key={user.id}
                      className={`p-3 rounded-lg border transition-all ${
                        user.status === "auto-mapped"
                          ? "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className={`w-9 h-9 rounded-full bg-gradient-to-br ${user.avatarColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <span className="text-white font-semibold text-xs">
                            {getInitials(user.clioManageName)}
                          </span>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  {user.clioManageName}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  •
                                </span>
                                <span className="text-xs text-gray-600">
                                  {user.role}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>

                            {/* Status Badge */}
                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded ${config.bg} border ${config.border} flex-shrink-0`}
                            >
                              <StatusIcon
                                className={`w-3 h-3 ${config.color}`}
                              />
                              <span
                                className={`text-xs font-medium ${config.color}`}
                              >
                                {config.label}
                              </span>
                            </div>
                          </div>

                          {/* Accounting Role Mapping */}
                          <div className="flex items-center gap-2 py-1.5">
                            <Sparkles className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <span className="text-xs text-gray-600">
                              Accounting Role:
                            </span>
                            <span className="text-xs font-semibold text-blue-600">
                              {user.accountingRole}
                            </span>
                            <span className="text-xs text-gray-400">
                              •
                            </span>
                            <div className="flex flex-wrap gap-1 flex-1">
                              {user.permissions.map(
                                (permission, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                                  >
                                    {permission}
                                  </span>
                                ),
                              )}
                            </div>
                            <button
                              onClick={() =>
                                setIsEditing(
                                  isEditing === user.id
                                    ? null
                                    : user.id,
                                )
                              }
                              className="p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                              title="Edit mapping"
                            >
                              <Edit2 className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add More Users Button - Only in Advanced Mode */}
              <Button
                variant="outline"
                className="w-full px-4 py-3 rounded-lg font-medium border-gray-300 hover:bg-gray-50"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add More Users
              </Button>
            </div>
          )}

          {/* Action Button - Single CTA matching other screens */}
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
              Next: Workflow & Approvals
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}