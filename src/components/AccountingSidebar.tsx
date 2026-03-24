import * as React from "react";
import {
  LayoutDashboard,
  CreditCard,
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  List,
  Users,
  FileText,
  Settings,
  ArrowLeft,
  Wifi,
} from "lucide-react";
import { cn } from "./ui/utils";

interface AccountingSidebarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
  onBackToClio?: () => void;
}

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

export function AccountingSidebar({ onPageChange, currentPage, onBackToClio }: AccountingSidebarProps) {
  const navigationItems: NavigationItem[] = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      onClick: () => onPageChange("Dashboard") 
    },
    { 
      icon: CreditCard, 
      label: "Transactions", 
      onClick: () => onPageChange("Transactions") 
    },
    { 
      icon: ArrowDownToLine, 
      label: "Funds In", 
      onClick: () => onPageChange("Funds In") 
    },
    { 
      icon: ArrowUpFromLine, 
      label: "Funds Out", 
      onClick: () => onPageChange("Funds Out") 
    },
    { 
      icon: Users, 
      label: "Payroll", 
      onClick: () => onPageChange("Payroll") 
    },
    { 
      icon: DollarSign, 
      label: "Finances", 
      onClick: () => onPageChange("Finances") 
    },
    { 
      icon: List, 
      label: "Chart of Accounts", 
      onClick: () => onPageChange("Chart of Accounts") 
    },
    { 
      icon: FileText, 
      label: "Documents", 
      onClick: () => onPageChange("Documents") 
    },
    { 
      icon: Wifi, 
      label: "Connections", 
      onClick: () => onPageChange("Connections") 
    },
  ];

  return (
    <div className="w-[240px] h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div>
          <h1 className="font-semibold text-gray-900">Clio Accounting</h1>
          <p className="text-xs text-gray-500">Financial Management</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.label;
            
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => onPageChange("Settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            currentPage === "Settings"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-700 hover:bg-gray-50"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span>Settings</span>
        </button>
      </div>

      {/* Back to Clio */}
      {onBackToClio && (
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onBackToClio}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span>Back to Clio</span>
          </button>
        </div>
      )}
    </div>
  );
}