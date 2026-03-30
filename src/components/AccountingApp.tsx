import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AccountingSidebar } from "./AccountingSidebar";
import { cn } from "./ui/utils";
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
  RYAN_HANDLED_AGENT_ACTIONS,
  UNIFIED_TEAMMATE_TODAY_EXCEPTIONS,
} from "./teammateTodayUnifiedFeed";
import { FP_HEADCOUNT_HIRE_READINESS_PAGE_ID } from "./finance-hub/components/financeWidgetCatalog";

const ACCOUNTING_NAV_RAIL_STORAGE_KEY = "accounting-shell-nav-rail-width-px";
const ACCOUNTING_NAV_WIDTH_MIN = 176;
const ACCOUNTING_NAV_WIDTH_MAX = 400;
const ACCOUNTING_NAV_WIDTH_DEFAULT = 240;
const ACCOUNTING_NAV_COLLAPSED_PX = 72;
const ACCOUNTING_NAV_SNAP_COLLAPSE_IF_BELOW = 110;
const ACCOUNTING_NAV_SNAP_EXPAND_IF_ABOVE = 132;

function clampAccountingNavWidth(px: number): number {
  return Math.min(ACCOUNTING_NAV_WIDTH_MAX, Math.max(ACCOUNTING_NAV_WIDTH_MIN, Math.round(px)));
}

function readStoredAccountingNavWidth(): number {
  if (typeof window === "undefined") return ACCOUNTING_NAV_WIDTH_DEFAULT;
  try {
    const raw = localStorage.getItem(ACCOUNTING_NAV_RAIL_STORAGE_KEY);
    if (raw == null) return ACCOUNTING_NAV_WIDTH_DEFAULT;
    return clampAccountingNavWidth(parseInt(raw, 10) || ACCOUNTING_NAV_WIDTH_DEFAULT);
  } catch {
    return ACCOUNTING_NAV_WIDTH_DEFAULT;
  }
}

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
    "Can we afford to hire a 13th attorney?",
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
  /** Shell Today exceptions for Finances (e.g. Financial Health critical strip). */
  exceptions?: Exception[];
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
  /** Bumps when user confirms hire NQL demo; shell navigates to Finances so FHO can apply the preset page. */
  headcountHireApplyNonce?: number;
}

export function AccountingApp({
  isChatBarVisible,
  onBackToClio,
  onReviewFinancialGoals,
  onRecentActionsChange,
  onExceptionsChange,
  exceptions: shellExceptions,
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
  headcountHireApplyNonce = 0,
}: AccountingAppProps) {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [transactionFilter, setTransactionFilter] = React.useState<string>("all");
  const [transactionMonth, setTransactionMonth] = React.useState<string | undefined>();
  const [fhoScrollTarget, setFhoScrollTarget] = React.useState<string | undefined>();
  const [shellChatInput, setShellChatInput] = React.useState("");
  const addPageRef = React.useRef<(() => void) | null>(null);
  const financeNavGuardRef = React.useRef<{ tryLeaveToShellPage: (page: string) => boolean } | null>(null);
  const [financeShellNavPages, setFinanceShellNavPages] = React.useState<{ id: string; title: string }[]>([]);

  const [isMdViewport, setIsMdViewport] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsMdViewport(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefersReducedMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const [isShellNavCollapsed, setIsShellNavCollapsed] = React.useState(false);
  const [shellNavWidthPx, setShellNavWidthPx] = React.useState(readStoredAccountingNavWidth);
  const [isResizingShellNav, setIsResizingShellNav] = React.useState(false);
  const isShellNavCollapsedRef = React.useRef(false);
  isShellNavCollapsedRef.current = isShellNavCollapsed;

  /** When Clio Teammate rail opens, collapse left nav for space; restore prior expand state when it closes. */
  const prevTeammateOpenRef = React.useRef(false);
  const shellNavWasExpandedBeforeTeammateRef = React.useRef<boolean | null>(null);
  React.useEffect(() => {
    if (teammateOpen && !prevTeammateOpenRef.current) {
      shellNavWasExpandedBeforeTeammateRef.current = !isShellNavCollapsed;
      setIsShellNavCollapsed(true);
    } else if (!teammateOpen && prevTeammateOpenRef.current) {
      const restoreExpanded = shellNavWasExpandedBeforeTeammateRef.current === true;
      shellNavWasExpandedBeforeTeammateRef.current = null;
      if (restoreExpanded) {
        setIsShellNavCollapsed(false);
      }
    }
    prevTeammateOpenRef.current = teammateOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only capture nav width on teammate open/close edges; isShellNavCollapsed is read from the render that flipped teammateOpen
  }, [teammateOpen]);

  React.useEffect(() => {
    try {
      localStorage.setItem(ACCOUNTING_NAV_RAIL_STORAGE_KEY, String(shellNavWidthPx));
    } catch {
      /* ignore */
    }
  }, [shellNavWidthPx]);

  React.useEffect(() => {
    if (!isResizingShellNav) return;
    const onMove = (e: MouseEvent) => {
      const raw = e.clientX;
      if (isShellNavCollapsedRef.current) {
        if (raw > ACCOUNTING_NAV_SNAP_EXPAND_IF_ABOVE) {
          isShellNavCollapsedRef.current = false;
          setIsShellNavCollapsed(false);
          setShellNavWidthPx(clampAccountingNavWidth(raw));
        }
      } else if (raw < ACCOUNTING_NAV_SNAP_COLLAPSE_IF_BELOW) {
        isShellNavCollapsedRef.current = true;
        setIsShellNavCollapsed(true);
      } else {
        setShellNavWidthPx(clampAccountingNavWidth(raw));
      }
    };
    const onUp = () => setIsResizingShellNav(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingShellNav]);

  const startShellNavResize = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingShellNav(true);
  }, []);

  const shellNavEffectiveWidthPx = isMdViewport
    ? isShellNavCollapsed
      ? ACCOUNTING_NAV_COLLAPSED_PX
      : shellNavWidthPx
    : 240;
  const shellSidebarCollapsed = isMdViewport && isShellNavCollapsed;

  const requestShellNavigation = React.useCallback(
    (page: string) => {
      if (
        (currentPage.startsWith("Finances:") || currentPage === "Finances") &&
        financeNavGuardRef.current
      ) {
        if (!financeNavGuardRef.current.tryLeaveToShellPage(page)) return;
      }
      setCurrentPage(page);
    },
    [currentPage],
  );

  const prevHeadcountHireNonceRef = React.useRef(0);
  React.useEffect(() => {
    if (
      headcountHireApplyNonce > 0 &&
      headcountHireApplyNonce !== prevHeadcountHireNonceRef.current
    ) {
      prevHeadcountHireNonceRef.current = headcountHireApplyNonce;
      requestShellNavigation(`Finances:${FP_HEADCOUNT_HIRE_READINESS_PAGE_ID}`);
    }
  }, [headcountHireApplyNonce, requestShellNavigation]);

  const isFinanceHubRoute =
    currentPage.startsWith("Finances:") || currentPage === "Finances";
  const suggestedQuestions =
    ACCOUNTING_SHELL_SUGGESTIONS[activeUser] ?? ACCOUNTING_SHELL_SUGGESTIONS.jennifer;

  /** Financial Oversight (Ryan): same Teammate Today data as Pillars 1 + 2 (those pages push their own feeds). */
  React.useEffect(() => {
    if (activeUser !== "ryan") return;
    onExceptionsChange?.(UNIFIED_TEAMMATE_TODAY_EXCEPTIONS);
    onRecentActionsChange?.(RYAN_HANDLED_AGENT_ACTIONS);
  }, [activeUser, onExceptionsChange, onRecentActionsChange]);

  const navigateToTransactions = (filter: string = "all", month?: string) => {
    setTransactionFilter(filter);
    setTransactionMonth(month);
    requestShellNavigation("Transactions");
  };

  const navigateToConnections = () => requestShellNavigation("Connections");

  const renderPage = () => {
    if (currentPage.startsWith("Finances:")) {
      const subPage = currentPage.split(":")[1];
      return (
        <FinanceHubPage
          initialPage={subPage}
          scrollToWidget={fhoScrollTarget}
          onAddPageRef={addPageRef}
          embeddedInAccountingShell
          shellNavLeftInsetPx={shellNavEffectiveWidthPx}
          shellExceptions={shellExceptions}
          onShellAskTeammate={onAskTeammate}
          onShellNavigateToConnections={navigateToConnections}
          onShellNavigateToTransactionsFiltered={navigateToTransactions}
          teammateOpen={teammateOpen}
          onTeammateOpenChange={onTeammateOpenChange}
          onTeammateChatHistoryChange={onTeammateChatHistoryChange}
          onTeammateExplorePlan={onTeammateExplorePlan}
          financeChatSubmitRef={financeChatSubmitRef}
          onTeammateSparkle={onTeammateSparkle}
          navigationGuardRef={financeNavGuardRef}
          onShellNavigate={setCurrentPage}
          headcountHireApplyNonce={headcountHireApplyNonce}
          onFinanceCustomNavChange={setFinanceShellNavPages}
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
              teammateTodayExceptions={shellExceptions}
              onNavigateToTransactionsFiltered={navigateToTransactions}
              onNavigateToFinancialHealth={(scrollTo) => {
                setFhoScrollTarget(scrollTo);
                requestShellNavigation("Finances:fp_financial_health");
              }}
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
            onNavigateToFinancialHealth={(scrollTo) => {
              setFhoScrollTarget(scrollTo);
              requestShellNavigation("Finances:fp_financial_health");
            }}
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
            shellNavLeftInsetPx={shellNavEffectiveWidthPx}
            shellExceptions={shellExceptions}
            onShellAskTeammate={onAskTeammate}
            onShellNavigateToConnections={navigateToConnections}
            onShellNavigateToTransactionsFiltered={navigateToTransactions}
            teammateOpen={teammateOpen}
            onTeammateOpenChange={onTeammateOpenChange}
            onTeammateChatHistoryChange={onTeammateChatHistoryChange}
            onTeammateExplorePlan={onTeammateExplorePlan}
            financeChatSubmitRef={financeChatSubmitRef}
            onTeammateSparkle={onTeammateSparkle}
            navigationGuardRef={financeNavGuardRef}
            onShellNavigate={setCurrentPage}
            headcountHireApplyNonce={headcountHireApplyNonce}
            onFinanceCustomNavChange={setFinanceShellNavPages}
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
            onNavigateToFinancialHealth={(scrollTo) => {
              setFhoScrollTarget(scrollTo);
              requestShellNavigation("Finances:fp_financial_health");
            }}
          />
        );
    }
  };

  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1">
        <aside
          className={cn(
            "relative flex h-full shrink-0 flex-col border-r border-border bg-white motion-reduce:transition-none",
          )}
          style={{
            width: shellNavEffectiveWidthPx,
            transition:
              isResizingShellNav || prefersReducedMotion
                ? undefined
                : "width 300ms cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          <AccountingSidebar
            currentPage={currentPage}
            onPageChange={requestShellNavigation}
            onBackToClio={onBackToClio}
            onAddFinancePage={() => addPageRef.current?.()}
            financeShellNavPages={financeShellNavPages}
            collapsed={shellSidebarCollapsed}
            onRequestExpandNav={() => setIsShellNavCollapsed(false)}
          />
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={
              isShellNavCollapsed
                ? "Drag right to expand navigation"
                : "Drag to resize navigation"
            }
            title={
              isShellNavCollapsed
                ? "Drag right to expand"
                : "Drag to resize; drag left to collapse"
            }
            className="absolute right-0 top-0 z-[60] hidden h-full w-2 -mr-1 cursor-col-resize touch-none hover:bg-primary/10 active:bg-primary/15 md:block motion-reduce:transition-none"
            onMouseDown={startShellNavResize}
          />
          <button
            type="button"
            onClick={() => setIsShellNavCollapsed((c) => !c)}
            className="absolute -right-3.5 top-[35px] z-50 hidden rounded-full border border-border bg-card p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-muted md:flex"
            title={isShellNavCollapsed ? "Expand navigation" : "Collapse navigation"}
            aria-label={isShellNavCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {isShellNavCollapsed ? (
              <PanelLeftOpen className="h-3.5 w-3.5" />
            ) : (
              <PanelLeftClose className="h-3.5 w-3.5" />
            )}
          </button>
        </aside>

        {/* Main Content (Fluid) */}
        <div className="min-h-0 min-w-0 flex-1">{renderPage()}</div>

        {/* Column 3: Specialized Financial Team Rail - Now controlled by global FAB */}
        {/* Removed: SpecializedTeammateRail - using global Clio Accounting rail (AmbientCFORail) with FAB instead */}
      </div>

      {!isFinanceHubRoute ? (
        <FloatingChatBar
          isVisible={isChatBarVisible}
          shellNavLeftInsetPx={shellNavEffectiveWidthPx}
          onOpen={() => onOpenRail?.()}
          onSubmitMessage={(msg) => {
            onAskTeammate?.(msg);
            if (msg !== "__sparkle__") setShellChatInput("");
          }}
          suggestedQuestions={suggestedQuestions}
          chatInput={shellChatInput}
          onChatInputChange={setShellChatInput}
          brandColor="#0069D1"
          placeholder="Search or ask Clio Accounting..."
          todayHasCriticalItem={(shellExceptions ?? []).some((e) => e.severity === "critical")}
        />
      ) : null}
    </>
  );
}