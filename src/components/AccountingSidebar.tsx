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
  Plus,
  Activity,
} from "lucide-react";
import { cn } from "./ui/utils";

interface AccountingSidebarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
  onBackToClio?: () => void;
  onAddFinancePage?: () => void;
}

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  children?: { label: string; route?: string; onClick: () => void; icon?: React.ComponentType<{ className?: string }> }[];
}

export function AccountingSidebar({ onPageChange, currentPage, onBackToClio, onAddFinancePage }: AccountingSidebarProps) {
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
      onClick: () => onPageChange("Funds In"),
      children: [
        { label: "Billing", onClick: () => onPageChange("Funds In") },
        { label: "Payments", onClick: () => onPageChange("Funds In") },
        { label: "Trust", onClick: () => onPageChange("Funds In") },
      ],
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
      onClick: () => onPageChange("Finances"),
      children: [
        { label: "Financial Health", route: "fp_financial_health", icon: Activity, onClick: () => onPageChange("Finances:fp_financial_health") },
        { label: "Reports", route: "Reports", icon: FileText, onClick: () => onPageChange("Finances:Reports") },
        { label: "Strategic Dashboard", route: "fp_default", icon: LayoutDashboard, onClick: () => onPageChange("Finances:fp_default") },
        { label: "Add a custom view", icon: Plus, onClick: () => { onPageChange("Finances"); onAddFinancePage?.(); } },
      ],
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
    <div className="w-[240px] h-full bg-white border-r border-border flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div>
          <h1 className="font-semibold text-foreground">Clio Accounting</h1>
          <p className="text-xs text-muted-foreground">Financial Management</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.label || currentPage.startsWith(item.label + ":");
            
            return (
              <React.Fragment key={item.label}>
                <button
                  onClick={item.onClick}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-nav-active text-foreground"
                      : "text-foreground/80 hover:bg-nav-hover"
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
                {isActive && item.children && (
                  <div className="ml-8 space-y-0.5 mt-0.5">
                    {item.children.map((child) => {
                      const isChildActive = currentPage === `${item.label}:${child.route ?? child.label}` || 
                        (item.children && child === item.children[0] && currentPage === item.label);
                      const ChildIcon = child.icon;
                      return (
                        <button
                          key={child.label}
                          onClick={child.onClick}
                          className={cn(
                            "w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-all flex items-center gap-2",
                            isChildActive ? "text-foreground font-medium bg-nav-active/60" : "text-muted-foreground hover:text-foreground hover:bg-nav-hover"
                          )}
                        >
                          {ChildIcon && <ChildIcon className="w-3.5 h-3.5 flex-shrink-0" />}
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Settings */}
      <div className="border-t border-border p-4">
        <button
          onClick={() => onPageChange("Settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
            currentPage === "Settings"
              ? "bg-nav-active text-foreground"
              : "text-foreground/80 hover:bg-nav-hover"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span>Settings</span>
        </button>
      </div>

      {/* Back to Clio */}
      {onBackToClio && (
        <div className="border-t border-border p-4">
          <button
            onClick={onBackToClio}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-nav-hover transition-all"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span>Back to Clio</span>
          </button>
        </div>
      )}
    </div>
  );
}