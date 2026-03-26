import * as React from "react";
import { AccountingSidebar } from "./AccountingSidebar";
import { ExceptionFirstDashboard } from "./ExceptionFirstDashboard";
import { BookkeeperDashboard } from "./BookkeeperDashboard";
import { RyanDashboard } from "./RyanDashboard";
import { UnifiedTransactionInbox } from "./accounting/UnifiedTransactionInbox";
import { BankingPage } from "./accounting/BankingPage";
import { FundsInPage } from "./accounting/FundsInPage";
import { FundsOutPage } from "./accounting/FundsOutPage";
import { ReportsPage } from "./accounting/ReportsPage";
import { FinanceHubPage } from "./accounting/FinanceHubPage";
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
  const [transactionFilter, setTransactionFilter] = React.useState<string>("all");
  const [transactionMonth, setTransactionMonth] = React.useState<string | undefined>();
  const [fhoScrollTarget, setFhoScrollTarget] = React.useState<string | undefined>();
  const addPageRef = React.useRef<(() => void) | null>(null);

  const navigateToTransactions = (filter: string = "all", month?: string) => {
    setTransactionFilter(filter);
    setTransactionMonth(month);
    setCurrentPage("Transactions");
  };

  const navigateToConnections = () => setCurrentPage("Connections");

  const renderPage = () => {
    if (currentPage.startsWith("Finances:")) {
      const subPage = currentPage.split(":")[1];
      return <FinanceHubPage initialPage={subPage} scrollToWidget={fhoScrollTarget} onAddPageRef={addPageRef} />;
    }
    if (currentPage.startsWith("Funds Out:")) {
      const sub = currentPage.split(":")[1] as "payables" | "expenses" | "vendors";
      return <FundsOutPage initialTab={sub} />;
    }
    switch (currentPage) {
      case "Dashboard":
        if (activeUser === "sarah") {
          return (
            <BookkeeperDashboard
              onAskTeammate={onAskTeammate}
              onOpenRail={onOpenRail}
              onExceptionsChange={onExceptionsChange}
              onRecentActionsChange={onRecentActionsChange}
              onNavigateToTransactions={() => navigateToTransactions("all")}
              onNavigateToTransactionsFiltered={navigateToTransactions}
              onNavigateToConnections={navigateToConnections}
            />
          );
        }
        if (activeUser === "ryan") {
          return (
            <RyanDashboard
              onAskTeammate={onAskTeammate}
              onOpenRail={onOpenRail}
              onNavigateToTransactionsFiltered={navigateToTransactions}
              onNavigateToFinancialHealth={(scrollTo) => { setFhoScrollTarget(scrollTo); setCurrentPage("Finances:fp_financial_health"); }}
            />
          );
        }
        return (
          <ExceptionFirstDashboard
            onReviewFinancialGoals={onReviewFinancialGoals}
            onRecentActionsChange={onRecentActionsChange}
            onExceptionsChange={onExceptionsChange}
            onAskTeammate={onAskTeammate}
            onOpenRail={onOpenRail}
            onNavigateToTransactions={() => navigateToTransactions("all")}
            onNavigateToTransactionsFiltered={navigateToTransactions}
            onNavigateToConnections={navigateToConnections}
            onNavigateToFinancialHealth={(scrollTo) => { setFhoScrollTarget(scrollTo); setCurrentPage("Finances:fp_financial_health"); }}
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
        return <FundsOutPage initialTab="payables" />;
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
        return <FinanceHubPage onAddPageRef={addPageRef} />;
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
            onNavigateToFinancialHealth={(scrollTo) => { setFhoScrollTarget(scrollTo); setCurrentPage("Finances:fp_financial_health"); }}
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
        onAddFinancePage={() => addPageRef.current?.()}
      />

      {/* Column 2: Main Content (Fluid) */}
      {renderPage()}

      {/* Column 3: Specialized Financial Team Rail - Now controlled by global FAB */}
      {/* Removed: SpecializedTeammateRail - using global AmbientCFORail with FAB instead */}
    </>
  );
}