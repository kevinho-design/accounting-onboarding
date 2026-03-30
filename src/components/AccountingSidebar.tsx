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
  /** Icon-only rail; parent widens the shell column. */
  collapsed?: boolean;
  /** When collapsed, parent with children calls this before navigating so the rail expands. */
  onRequestExpandNav?: () => void;
}

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  children?: { label: string; route?: string; onClick: () => void; icon?: React.ComponentType<{ className?: string }> }[];
}

export function AccountingSidebar({
  onPageChange,
  currentPage,
  onBackToClio,
  onAddFinancePage,
  collapsed = false,
  onRequestExpandNav,
}: AccountingSidebarProps) {
  const navigationItems: NavigationItem[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      onClick: () => onPageChange("Dashboard"),
    },
    {
      icon: CreditCard,
      label: "Transactions",
      onClick: () => onPageChange("Transactions"),
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
      onClick: () => onPageChange("Funds Out:payables"),
      children: [
        { label: "Payables", route: "payables", onClick: () => onPageChange("Funds Out:payables") },
        { label: "Expenses", route: "expenses", onClick: () => onPageChange("Funds Out:expenses") },
        { label: "Vendors", route: "vendors", onClick: () => onPageChange("Funds Out:vendors") },
      ],
    },
    {
      icon: Users,
      label: "Payroll",
      onClick: () => onPageChange("Payroll"),
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
      onClick: () => onPageChange("Chart of Accounts"),
    },
    {
      icon: FileText,
      label: "Documents",
      onClick: () => onPageChange("Documents"),
    },
    {
      icon: Wifi,
      label: "Connections",
      onClick: () => onPageChange("Connections"),
    },
  ];

  const handleParentClick = (item: NavigationItem) => {
    if (collapsed && item.children?.length) {
      onRequestExpandNav?.();
    }
    item.onClick();
  };

  return (
    <div className="flex h-full min-w-0 w-full flex-col bg-white">
      {/* Header */}
      <div className={cn("border-b border-border", collapsed ? "flex justify-center px-2 py-4" : "p-6")}>
        {collapsed ? (
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
            title="Clio Accounting"
          >
            C
          </div>
        ) : (
          <div>
            <h1 className="font-semibold text-foreground">Clio Accounting</h1>
            <p className="text-xs text-muted-foreground">Financial Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className={cn("space-y-1", collapsed ? "flex flex-col items-center px-2" : "px-3")}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.label || currentPage.startsWith(item.label + ":");

            return (
              <React.Fragment key={item.label}>
                <button
                  type="button"
                  title={collapsed ? item.label : undefined}
                  onClick={() => handleParentClick(item)}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all",
                    collapsed
                      ? "h-10 w-10 shrink-0 justify-center p-0"
                      : "w-full gap-3 px-3 py-2",
                    isActive
                      ? "bg-nav-active text-foreground"
                      : "text-foreground/80 hover:bg-nav-hover",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed ? <span>{item.label}</span> : null}
                </button>
                {!collapsed && isActive && item.children ? (
                  <div className="ml-8 mt-0.5 space-y-0.5">
                    {item.children.map((child) => {
                      const isChildActive =
                        currentPage === `${item.label}:${child.route ?? child.label}` ||
                        (item.children &&
                          child === item.children[0] &&
                          currentPage === item.label);
                      const ChildIcon = child.icon;
                      return (
                        <button
                          key={child.label}
                          type="button"
                          onClick={child.onClick}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-[13px] transition-all",
                            isChildActive
                              ? "bg-nav-active/60 font-medium text-foreground"
                              : "text-muted-foreground hover:bg-nav-hover hover:text-foreground",
                          )}
                        >
                          {ChildIcon ? <ChildIcon className="h-3.5 w-3.5 shrink-0" /> : null}
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Settings */}
      <div className={cn("border-t border-border", collapsed ? "flex justify-center p-2" : "p-4")}>
        <button
          type="button"
          title={collapsed ? "Settings" : undefined}
          onClick={() => onPageChange("Settings")}
          className={cn(
            "flex items-center rounded-lg text-sm font-medium transition-all",
            collapsed ? "h-10 w-10 shrink-0 justify-center p-0" : "w-full gap-3 px-3 py-2",
            currentPage === "Settings"
              ? "bg-nav-active text-foreground"
              : "text-foreground/80 hover:bg-nav-hover",
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed ? <span>Settings</span> : null}
        </button>
      </div>

      {/* Back to Clio */}
      {onBackToClio ? (
        <div className={cn("border-t border-border", collapsed ? "flex justify-center p-2 pb-3" : "p-4")}>
          <button
            type="button"
            title={collapsed ? "Back to Clio" : undefined}
            onClick={onBackToClio}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium text-foreground/80 transition-all hover:bg-nav-hover",
              collapsed ? "h-10 w-10 shrink-0 justify-center p-0" : "w-full gap-3 px-3 py-2",
            )}
          >
            <ArrowLeft className="h-5 w-5 shrink-0" />
            {!collapsed ? <span>Back to Clio</span> : null}
          </button>
        </div>
      ) : null}
    </div>
  );
}
