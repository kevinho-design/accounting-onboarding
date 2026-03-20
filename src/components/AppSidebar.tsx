import * as React from "react";
import {
  CheckCircle,
  Bell,
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Briefcase,
  Users,
  Receipt,
  CreditCard,
  Calculator,
  FolderOpen,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  Copy,
  Zap,
  Sliders,
  Moon,
  Package,
  FileText,
  Send,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import { cn } from "./ui/utils";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface AppSidebarProps {
  onPageChange: (page: string) => void;
  currentPage: string;
  isAccountingSetupComplete?: boolean;
  unreadNotificationsCount?: number;
  newTransactionsCount?: number;
  onClearNewTransactions?: () => void;
}

interface NavigationItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  external?: boolean;
}

interface NavigationSection {
  items: NavigationItem[];
}

export function AppSidebar({ onPageChange, currentPage, isAccountingSetupComplete = false, unreadNotificationsCount = 0, newTransactionsCount = 0, onClearNewTransactions }: AppSidebarProps) {
  const [isFinancesOpen, setIsFinancesOpen] = React.useState(true);
  const [isCasesOpen, setIsCasesOpen] = React.useState(false);

  const navigationSections: NavigationSection[] = [
    {
      items: [
        { 
          icon: Bell, 
          label: "Notifications", 
          onClick: () => onPageChange("Notifications"),
          badge: unreadNotificationsCount > 0 ? unreadNotificationsCount.toString() : undefined
        },
        { icon: LayoutDashboard, label: "Dashboard", onClick: () => onPageChange("Dashboard") },
        { icon: Calendar, label: "Calendar", onClick: () => onPageChange("Calendar") },
      ],
    },
  ];

  const casesSection: NavigationItem[] = [
    { icon: CheckSquare, label: "Activities", onClick: () => onPageChange("Activities") },
    { icon: Briefcase, label: "Matters", onClick: () => onPageChange("Matters") },
    { icon: CheckSquare, label: "Tasks", onClick: () => onPageChange("Tasks") },
    { icon: FolderOpen, label: "Documents", onClick: () => onPageChange("Documents") },
    { icon: FileText, label: "E-Filing", onClick: () => onPageChange("EFiling") },
    { icon: MessageSquare, label: "Communications", onClick: () => onPageChange("Communications") },
    { icon: Users, label: "Contacts", onClick: () => onPageChange("Contacts") },
  ];

  const financesSection: NavigationItem[] = [
    { 
      icon: Receipt, 
      label: "Billing", 
      external: true,
      onClick: () => window.open("https://tempo-rapid-58664583.figma.site/", "_blank")
    },
    { icon: CreditCard, label: "Expenses", onClick: () => onPageChange("Expenses") },
    { 
      icon: Calculator, 
      label: "Accounting", 
      onClick: () => onPageChange("Accounting"), 
      badge: !isAccountingSetupComplete ? "New" : undefined 
    },
    ...(isAccountingSetupComplete ? [{ 
      icon: DollarSign, 
      label: "Transactions", 
      onClick: () => {
        onPageChange("Transactions");
        if (onClearNewTransactions) {
          onClearNewTransactions();
        }
      },
      badge: newTransactionsCount > 0 ? newTransactionsCount.toString() : undefined
    }] : []),
    { icon: Calculator, label: "Reconciliation", onClick: () => onPageChange("Reconciliation") },
    { icon: FileText, label: "Reports", onClick: () => onPageChange("Reports") },
  ];

  const bottomSection: NavigationItem[] = [
    { icon: Package, label: "More Products", onClick: () => onPageChange("MoreProducts") },
    { icon: Settings, label: "Settings", onClick: () => onPageChange("Settings") },
    { icon: Moon, label: "Dark Mode", onClick: () => onPageChange("DarkMode") },
  ];

  const NavigationItemComponent = ({ item, isActive }: { item: NavigationItem; isActive: boolean }) => (
    <button
      onClick={item.onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-left transition-colors",
        isActive && !item.external
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <item.icon className={cn("h-4 w-4", isActive && !item.external ? "text-sidebar-accent-foreground" : "text-muted-foreground")} />
      <span className="flex-1">{item.label}</span>
      {item.badge && item.label === "Accounting" ? (
        <span className="accounting-black-gradient px-2 py-0.5 rounded-full text-white text-xs font-medium">
          {item.badge}
        </span>
      ) : item.badge && (item.label === "Notifications" || item.label === "Transactions") ? (
        <Badge variant="destructive" className="h-5 px-1.5 text-xs">
          {item.badge}
        </Badge>
      ) : item.badge ? (
        <Badge variant="secondary" className="h-5 px-1.5 text-xs">
          {item.badge}
        </Badge>
      ) : null}
    </button>
  );

  const SectionHeader = ({ 
    title, 
    isOpen, 
    onToggle 
  }: { 
    title: string; 
    isOpen: boolean; 
    onToggle: () => void; 
  }) => (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors"
    >
      <span className="flex-1 text-left">{title}</span>
      {isOpen ? (
        <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
      ) : (
        <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
      )}
    </button>
  );

  return (
    <div className="flex h-full w-60 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-sidebar-primary">
          <span className="text-sm font-semibold text-sidebar-primary-foreground">C</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">Clio</span>
          <span className="text-xs text-muted-foreground">Practice Management</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md border border-input bg-input-background px-8 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigationSections[0].items.map((item) => (
              <NavigationItemComponent
                key={item.label}
                item={item}
                isActive={currentPage === item.label}
              />
            ))}
          </div>
        </div>

        {/* Cases Section */}
        <div className="px-3 py-2">
          <SectionHeader
            title="Cases"
            isOpen={isCasesOpen}
            onToggle={() => setIsCasesOpen(!isCasesOpen)}
          />
          {isCasesOpen && (
            <div className="mt-1 space-y-1 pl-6">
              {casesSection.map((item) => (
                <NavigationItemComponent
                  key={item.label}
                  item={item}
                  isActive={currentPage === item.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* Finances Section */}
        <div className="px-3 py-2">
          <SectionHeader
            title="Finances"
            isOpen={isFinancesOpen}
            onToggle={() => setIsFinancesOpen(!isFinancesOpen)}
          />
          {isFinancesOpen && (
            <div className="mt-1 space-y-1 pl-[10px] pt-[0px] pr-[0px] pb-[0px]">
              {financesSection.map((item) => (
                <NavigationItemComponent
                  key={item.label}
                  item={item}
                  isActive={currentPage === item.label && !item.external}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div>
        {/* Promotional Card */}
        <div className="mx-4 my-4 rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-4 transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-2xl cursor-pointer relative overflow-hidden border border-slate-700/50">
          {/* Glimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
          
          <div className="relative z-10">
            <div className="text-sm font-semibold text-white mb-1">Get paid 2.5x faster</div>
            <div className="text-xs text-slate-300 mb-3 leading-relaxed">
              Collect sooner and increase cashflow with flexible payment options.
            </div>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm h-8 border-0 shadow-lg"
              size="sm"
            >
              Activate Payments
            </Button>
          </div>
        </div>

        <Separator className="mx-3" />

        <div className="px-3 py-2">
          <div className="space-y-1">
            {bottomSection.map((item) => (
              <NavigationItemComponent
                key={item.label}
                item={item}
                isActive={currentPage === item.label}
              />
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">John Doe</div>
              <div className="text-xs text-muted-foreground truncate">john@lawfirm.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}