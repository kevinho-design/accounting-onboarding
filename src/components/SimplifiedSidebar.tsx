import * as React from "react";
import {
  Home,
  LayoutDashboard,
  Calendar,
  ListTodo,
  Briefcase,
  Users,
  Activity,
  DollarSign,
  CreditCard,
  ChevronDown,
  Check,
} from "lucide-react";
import { cn } from "./ui/utils";

interface SimplifiedSidebarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}

export function SimplifiedSidebar({ onPageChange, currentPage }: SimplifiedSidebarProps) {
  const navigationItems: NavigationItem[] = [
    { 
      icon: Home, 
      label: "Dashboard", 
      onClick: () => onPageChange("Dashboard") 
    },
    { 
      icon: Calendar, 
      label: "Calendar", 
      onClick: () => onPageChange("Calendar") 
    },
    { 
      icon: ListTodo, 
      label: "Tasks", 
      onClick: () => onPageChange("Tasks") 
    },
    { 
      icon: Briefcase, 
      label: "Matters", 
      onClick: () => onPageChange("Matters") 
    },
    { 
      icon: Users, 
      label: "Contacts", 
      onClick: () => onPageChange("Contacts") 
    },
    { 
      icon: Activity, 
      label: "Activities", 
      onClick: () => onPageChange("Activities") 
    },
    { 
      icon: DollarSign, 
      label: "Billing", 
      onClick: () => onPageChange("Billing") 
    },
    { 
      icon: CreditCard, 
      label: "Online payments", 
      onClick: () => onPageChange("Online payments") 
    },
    { 
      icon: LayoutDashboard, 
      label: "Accounting", 
      onClick: () => onPageChange("Accounting") 
    },
  ];

  return (
    <div className="w-[240px] h-full bg-[#0F2A52] flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="bg-[#3366CC] px-4 py-3">
        <button className="flex items-center gap-2 w-full">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-[#3366CC]" strokeWidth={3} />
          </div>
          <span className="text-white font-medium text-sm">Clio Manage</span>
          <ChevronDown className="w-4 h-4 text-white ml-auto" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.label;
            
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-sm font-normal transition-colors",
                  isActive
                    ? "bg-[#2952A3] text-white"
                    : "text-white hover:bg-[#1a3a5f]"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}