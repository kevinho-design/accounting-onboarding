import * as React from "react";
import { AccountingSidebar } from "./AccountingSidebar";
import { ExceptionFirstDashboard } from "./ExceptionFirstDashboard";
import { BookkeeperDashboard } from "./BookkeeperDashboard";
import { UnifiedTransactionInbox } from "./accounting/UnifiedTransactionInbox";
import { BankingPage } from "./accounting/BankingPage";
import { FundsInPage } from "./accounting/FundsInPage";
import { FundsOutPage } from "./accounting/FundsOutPage";
import { ReportsPage } from "./accounting/ReportsPage";
import { ChartOfAccountsPage } from "./accounting/ChartOfAccountsPage";
import { AgentAction, Exception } from "./agents/AgentTypes";

interface AccountingAppProps {
  onBackToClio?: () => void;
  onReviewFinancialGoals: () => void;
  onRecentActionsChange?: (actions: AgentAction[]) => void;
  onExceptionsChange?: (exceptions: Exception[]) => void;
  onAskTeammate?: (message: string) => void;
  onOpenRail?: () => void;
  activeUser?: "jennifer" | "sarah" | "ryan";
  initialPage?: string;
}

export function AccountingApp({ onBackToClio, onReviewFinancialGoals, onRecentActionsChange, onExceptionsChange, onAskTeammate, onOpenRail, activeUser = "jennifer", initialPage = "Dashboard" }: AccountingAppProps) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [transactionFilter, setTransactionFilter] = React.useState<"all" | "critical" | "high" | "medium" | "processed">("all");
  const [transactionMonth, setTransactionMonth] = React.useState<string | undefined>();

  const navigateToTransactions = (filter: "all" | "critical" | "high" | "medium" | "processed" = "all", month?: string) => {
    setTransactionFilter(filter);
    setTransactionMonth(month);
    setCurrentPage("Transactions");
  };

  const navigateToConnections = () => setCurrentPage("Connections");

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return activeUser === "sarah" ? (
          <BookkeeperDashboard
            onAskTeammate={onAskTeammate}
            onOpenRail={onOpenRail}
            onExceptionsChange={onExceptionsChange}
            onRecentActionsChange={onRecentActionsChange}
            onNavigateToTransactions={() => navigateToTransactions("all")}
            onNavigateToTransactionsFiltered={navigateToTransactions}
            onNavigateToConnections={navigateToConnections}
          />
        ) : (
          <ExceptionFirstDashboard 
            onReviewFinancialGoals={onReviewFinancialGoals} 
            onRecentActionsChange={onRecentActionsChange}
            onExceptionsChange={onExceptionsChange}
            onAskTeammate={onAskTeammate}
            onOpenRail={onOpenRail}
            onNavigateToTransactions={() => navigateToTransactions("all")}
            onNavigateToTransactionsFiltered={navigateToTransactions}
            onNavigateToConnections={navigateToConnections}
          />
        );
      case "Transactions":
        return <UnifiedTransactionInbox onOpenRail={onOpenRail} initialFilter={transactionFilter} initialMonth={transactionMonth} onNavigateToConnections={navigateToConnections} />;
      case "Connections":
        return (
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FAFBFF' }}>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Connections</h2>
                <p className="text-gray-500">Coming soon...</p>
              </div>
            </div>
          </div>
        );
      case "Funds In":
        return <FundsInPage />;
      case "Funds Out":
        return <FundsOutPage />;
      case "Payroll":
        return (
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FAFBFF' }}>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Payroll</h2>
                <p className="text-gray-500">Coming soon...</p>
              </div>
            </div>
          </div>
        );
      case "Finances":
        return <ReportsPage />;
      case "Chart of Accounts":
        return <ChartOfAccountsPage />;
      case "Documents":
        return (
          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FAFBFF' }}>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Documents</h2>
                <p className="text-gray-500">Coming soon...</p>
              </div>
            </div>
          </div>
        );
      default:
        return activeUser === "sarah" ? (
          <BookkeeperDashboard
            onAskTeammate={onAskTeammate}
            onOpenRail={onOpenRail}
            onExceptionsChange={onExceptionsChange}
            onRecentActionsChange={onRecentActionsChange}
            onNavigateToTransactions={() => navigateToTransactions("all")}
            onNavigateToTransactionsFiltered={navigateToTransactions}
            onNavigateToConnections={navigateToConnections}
          />
        ) : (
          <ExceptionFirstDashboard 
            onReviewFinancialGoals={onReviewFinancialGoals} 
            onRecentActionsChange={onRecentActionsChange}
            onExceptionsChange={onExceptionsChange}
            onAskTeammate={onAskTeammate}
            onOpenRail={onOpenRail}
            onNavigateToTransactions={() => navigateToTransactions("all")}
            onNavigateToTransactionsFiltered={navigateToTransactions}
            onNavigateToConnections={navigateToConnections}
          />
        );
    }
  };

  return (
    <>
      {/* Column 1: Accounting Sidebar (Fixed - 240px) */}
      <AccountingSidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onBackToClio={onBackToClio}
      />

      {/* Column 2: Main Content (Fluid) */}
      {renderPage()}

      {/* Column 3: Specialized Financial Team Rail - Now controlled by global FAB */}
      {/* Removed: SpecializedTeammateRail - using global AmbientCFORail with FAB instead */}
    </>
  );
}