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
import { FloatingChatBar } from "./finance-hub/components/clio-teammate/FloatingChatBar";
import type { TeammateChatMessage } from "./finance-hub/components/clio-teammate/SpecializedTeammateRail";
import type { FhoTeammatePlan } from "./finance-hub/data/fhoTeammateBreakdowns";
import { AgentAction, Exception } from "./agents/AgentTypes";
import {
  UNIFIED_TEAMMATE_TODAY_ACTIONS,
  UNIFIED_TEAMMATE_TODAY_EXCEPTIONS,
} from "./teammateTodayUnifiedFeed";

const ACCOUNTING_SHELL_SUGGESTIONS: Record<"jennifer" | "sarah" | "ryan", string[]> = {
  jennifer: [
    "What's our cash runway looking like this quarter?",
    "Which clients have overdue invoices over 60 days?",
    "Are we on track for our Q1 revenue goal?",
    "Show me any trust account compliance issues",
    "What's our realization rate this month?",
  ],
  sarah: [
    "What transactions are blocking March reconciliation?",
    "Show me the duplicate ACH transactions from Mar 15",
    "Which Brex transactions need categorizing?",
    "What's the status of the IOLTA three-way reconciliation?",
    "Summarize what AI did overnight",
  ],
  ryan: [
    "What's our cash runway and operating cushion this quarter?",
    "Which approvals are blocking cash or trust movements?",
    "How are we tracking against firm financial goals?",
    "Show me trust and IOLTA items that need sign-off",
    "What's at risk in collections and unbilled time?",
  ],
};

interface AccountingAppProps {
  isChatBarVisible: boolean;
  onBackToClio?: () => void;
  onReviewFinancialGoals: () => void;
  onRecentActionsChange?: (actions: AgentAction[]) => void;
  onExceptionsChange?: (exceptions: Exception[]) => void;
  onAskTeammate?: (message: string) => void;
  onOpenRail?: () => void;
  activeUser?: "jennifer" | "sarah" | "ryan";
  initialPage?: string;
  teammateOpen: boolean;
  onTeammateOpenChange: (open: boolean) => void;
  onTeammateChatHistoryChange: React.Dispatch<React.SetStateAction<TeammateChatMessage[]>>;
  onTeammateExplorePlan: (plan: FhoTeammatePlan) => void;
  financeChatSubmitRef: React.MutableRefObject<((text: string) => void) | null>;
  onTeammateSparkle: () => void;
}

export function AccountingApp({
  isChatBarVisible,
  onBackToClio,
  onReviewFinancialGoals,
  onRecentActionsChange,
  onExceptionsChange,
  onAskTeammate,
  onOpenRail,
  activeUser = "jennifer",
  initialPage = "Dashboard",
  teammateOpen,
  onTeammateOpenChange,
  onTeammateChatHistoryChange,
  onTeammateExplorePlan,
  financeChatSubmitRef,
  onTeammateSparkle,
}: AccountingAppProps) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [transactionFilter, setTransactionFilter] = React.useState<string>("all");
  const [transactionMonth, setTransactionMonth] = React.useState<string | undefined>();
  const [fhoScrollTarget, setFhoScrollTarget] = React.useState<string | undefined>();
  const [shellChatInput, setShellChatInput] = React.useState("");
  const addPageRef = React.useRef<(() => void) | null>(null);

  const isFinanceHubRoute =
    currentPage.startsWith("Finances:") || currentPage === "Finances";
  const suggestedQuestions =
    ACCOUNTING_SHELL_SUGGESTIONS[activeUser] ?? ACCOUNTING_SHELL_SUGGESTIONS.jennifer;

  /** Financial Oversight (Ryan): same Teammate Today data as Pillars 1 + 2 (those pages push their own feeds). */
  React.useEffect(() => {
    if (activeUser !== "ryan") return;
    onExceptionsChange?.(UNIFIED_TEAMMATE_TODAY_EXCEPTIONS);
    onRecentActionsChange?.(UNIFIED_TEAMMATE_TODAY_ACTIONS);
  }, [activeUser, onExceptionsChange, onRecentActionsChange]);

  const navigateToTransactions = (filter: string = "all", month?: string) => {
    setTransactionFilter(filter);
    setTransactionMonth(month);
    setCurrentPage("Transactions");
  };

  const navigateToConnections = () => setCurrentPage("Connections");

  const renderPage = () => {
    if (currentPage.startsWith("Finances:")) {
      const subPage = currentPage.split(":")[1];
      return (
        <FinanceHubPage
          initialPage={subPage}
          scrollToWidget={fhoScrollTarget}
          onAddPageRef={addPageRef}
          embeddedInAccountingShell
          teammateOpen={teammateOpen}
          onTeammateOpenChange={onTeammateOpenChange}
          onTeammateChatHistoryChange={onTeammateChatHistoryChange}
          onTeammateExplorePlan={onTeammateExplorePlan}
          financeChatSubmitRef={financeChatSubmitRef}
          onTeammateSparkle={onTeammateSparkle}
        />
      );
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
              onTeammateExplorePlan={onTeammateExplorePlan}
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
            onTeammateExplorePlan={onTeammateExplorePlan}
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
        return (
          <FinanceHubPage
            onAddPageRef={addPageRef}
            embeddedInAccountingShell
            teammateOpen={teammateOpen}
            onTeammateOpenChange={onTeammateOpenChange}
            onTeammateChatHistoryChange={onTeammateChatHistoryChange}
            onTeammateExplorePlan={onTeammateExplorePlan}
            financeChatSubmitRef={financeChatSubmitRef}
            onTeammateSparkle={onTeammateSparkle}
          />
        );
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
            onTeammateExplorePlan={onTeammateExplorePlan}
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
      <div className="flex min-h-0 min-w-0 flex-1">
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
      </div>

      {!isFinanceHubRoute ? (
        <FloatingChatBar
          isVisible={isChatBarVisible}
          onOpen={() => onOpenRail?.()}
          onSubmitMessage={(msg) => {
            onAskTeammate?.(msg);
            if (msg !== "__sparkle__") setShellChatInput("");
          }}
          suggestedQuestions={suggestedQuestions}
          chatInput={shellChatInput}
          onChatInputChange={setShellChatInput}
          brandColor="#0069D1"
          placeholder="Search the product or ask your Firm Intelligence…"
        />
      ) : null}
    </>
  );
}