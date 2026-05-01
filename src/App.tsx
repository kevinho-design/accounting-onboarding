import * as React from "react";
import { toast } from "sonner";

// ── Deeplink helpers ─────────────────────────────────────────────────────────
// Supported: ?flow=setup | ?flow=bookkeeper | ?flow=finance
function getFlowParam(): string | null {
  return new URLSearchParams(window.location.search).get("flow");
}
function pushFlow(flow: string | null) {
  const url = new URL(window.location.href);
  if (flow) url.searchParams.set("flow", flow);
  else url.searchParams.delete("flow");
  window.history.replaceState({}, "", url.toString());
}
import { SimplifiedSidebar } from "./components/SimplifiedSidebar";
import { EmptyWorkspace } from "./components/EmptyWorkspace";
import { ContextAwareTeammateRail } from "./components/ContextAwareTeammateRail";
import type { TeammateChatMessage } from "./components/finance-hub/components/clio-teammate/SpecializedTeammateRail";
import type { FhoTeammatePlan } from "./components/finance-hub/data/fhoTeammateBreakdowns";
import { AccountingDashboard } from "./components/AccountingDashboard";
import { MigrationOnboardingFlow } from "./components/MigrationOnboardingFlow";
import { BookkeeperOnboardingFlow } from "./components/BookkeeperOnboardingFlow";
import { AccountingApp } from "./components/AccountingApp";
import { Screen10_FinancialGoals } from "./components/migration/Screen10_FinancialGoals";
import { Toaster } from "./components/ui/sonner";
import { AgentAction, Exception } from "./components/agents/AgentTypes";
import { AccountingVisionPortal } from "./components/AccountingVisionPortal";
import { cn } from "./components/ui/utils";

export default function App() {
  // Seed initial state from URL so deeplinks work on first paint
  const _initialFlow = getFlowParam();

  const [currentPage, setCurrentPage] = React.useState(_initialFlow ? "Accounting" : "Dashboard");
  const [showValueProp, setShowValueProp] = React.useState(!_initialFlow);
  const [inMigrationFlow, setInMigrationFlow] = React.useState(_initialFlow === "setup");
  const [inBookkeeperFlow, setInBookkeeperFlow] = React.useState(_initialFlow === "bookkeeper");
  const [showGoalSetting, setShowGoalSetting] = React.useState(false);
  const [inAccountingApp, setInAccountingApp] = React.useState(_initialFlow === "finance");
  const [isTeammateRailOpen, setIsTeammateRailOpen] = React.useState(false);
  const [recentAgentActions, setRecentAgentActions] = React.useState<AgentAction[]>([]);
  const [exceptions, setExceptions] = React.useState<Exception[]>([]);

  const [initialChatMessage, setInitialChatMessage] = React.useState<string | undefined>();
  const [teammateChatHistory, setTeammateChatHistory] = React.useState<TeammateChatMessage[]>([]);
  const [teammatePlan, setTeammatePlan] = React.useState<FhoTeammatePlan | null>(null);
  const [teammatePlanTabNonce, setTeammatePlanTabNonce] = React.useState(0);
  const financeChatSubmitRef = React.useRef<((text: string) => void) | null>(null);
  const [headcountHireApplyNonce, setHeadcountHireApplyNonce] = React.useState(0);

  const onTeammateExplorePlan = React.useCallback((plan: FhoTeammatePlan) => {
    setTeammatePlan(plan);
    setTeammatePlanTabNonce((n) => n + 1);
    setIsTeammateRailOpen(true);
    setIsChatBarVisible(false);
  }, []);

  const onTeammateSparkle = React.useCallback(() => {
    setInitialChatMessage("__sparkle__");
  }, []);
  const [isChatBarVisible, setIsChatBarVisible] = React.useState(true);
  const [activeUser, setActiveUser] = React.useState<"jennifer" | "sarah" | "ryan">(
    _initialFlow === "finance" ? "ryan" : _initialFlow === "bookkeeper" ? "sarah" : "jennifer"
  );
  const [showPortal, setShowPortal] = React.useState(!_initialFlow);
  const [initialPage, setInitialPage] = React.useState<string>("Dashboard");

  const handleMigrationComplete = () => {
    setInMigrationFlow(false);
    setInAccountingApp(true);
    setShowValueProp(false);
  };

  const handleReviewFinancialGoals = () => {
    // Show goal setting screen
    setShowGoalSetting(true);
  };

  const handleGoalsComplete = () => {
    // Goals set - return to accounting app
    setShowGoalSetting(false);
  };

  const handleBackToClio = () => {
    setInAccountingApp(false);
    setInMigrationFlow(false);
    setInBookkeeperFlow(false);
    setActiveUser("jennifer");
    setInitialPage("Dashboard");
    setShowPortal(true);
    pushFlow(null);
  };

  const startSarahFlow = React.useCallback(() => {
    setExceptions([]);
    setRecentAgentActions([]);
    setCurrentPage("Accounting");
    setShowValueProp(false);
    setShowPortal(false);
    setInBookkeeperFlow(true);
  }, []);

  const showSarahInviteToast = React.useCallback(() => {
    setTimeout(() => {
      toast.custom((id) => (
        <div className="flex items-stretch bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-[380px]">
          <div className="w-1 flex-shrink-0 bg-[#0d9488]" />
          <div className="flex items-center pl-4 pr-3 py-4">
            <div className="w-8 h-8 rounded-full bg-[#0d9488] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex-1 py-4 pr-2">
            <p className="text-sm font-semibold text-gray-900 mb-0.5">
              You've been invited to Clio Accounting!
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Jennifer Hart added you as a Bookkeeper at Hartwell &amp; Morris.
            </p>
            <button
              onClick={() => { toast.dismiss(id); startSarahFlow(); }}
              className="text-xs font-semibold text-[#0d9488] hover:text-[#0f766e] transition-colors"
            >
              Start onboarding →
            </button>
          </div>
          <button
            onClick={() => toast.dismiss(id)}
            className="flex items-start pt-3.5 pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ), { duration: Infinity, position: "bottom-right" });
    }, 600);
  }, [startSarahFlow]);


  if (showPortal) {
    return (
      <>
        <div className="h-screen w-screen overflow-auto">
          <AccountingVisionPortal
            onPillar1={() => {
              pushFlow("setup");
              setShowPortal(false);
              setActiveUser("jennifer");
              setCurrentPage("Accounting");
              setInMigrationFlow(true);
            }}
            onPillar2={() => {
              pushFlow("bookkeeper");
              setShowPortal(false);
              startSarahFlow();
            }}
            onPillar3={() => {
              pushFlow("finance");
              setShowPortal(false);
              setActiveUser("ryan");
              setCurrentPage("Accounting");
              setInitialPage("Dashboard");
              setInAccountingApp(true);
            }}
          />
        </div>
        <Toaster position="bottom-right" richColors />
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Column 1: Clio Left Nav (Fixed - 240px) - Hidden during migration, bookkeeper flow, and in accounting app */}
      {!inMigrationFlow && !inBookkeeperFlow && !inAccountingApp && (
        <SimplifiedSidebar 
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            // Reset states when switching to Accounting
            if (page === "Accounting") {
              setShowValueProp(true);
              setInMigrationFlow(false);
              setInBookkeeperFlow(false);
              setInAccountingApp(false);
              setShowGoalSetting(false);
              setActiveUser("jennifer");
            }
          }}
        />
      )}

      {/* Main Content Area */}
      {currentPage === "Accounting" ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {inMigrationFlow ? (
            <MigrationOnboardingFlow onComplete={handleMigrationComplete} />
          ) : inBookkeeperFlow ? (
            <BookkeeperOnboardingFlow onComplete={() => {
              setActiveUser("sarah");
              setInBookkeeperFlow(false);
              handleMigrationComplete();
            }} />
          ) : showGoalSetting ? (
            <Screen10_FinancialGoals onComplete={handleGoalsComplete} />
          ) : inAccountingApp ? (
            <div
              className={cn(
                "flex min-h-0 min-w-0 flex-1 overflow-hidden transition-[padding] duration-300 ease-out motion-reduce:transition-none",
                isTeammateRailOpen && "lg:pr-[28rem]",
              )}
            >
              <AccountingApp
                isChatBarVisible={isChatBarVisible}
                onBackToClio={handleBackToClio}
                onReviewFinancialGoals={handleReviewFinancialGoals}
                onRecentActionsChange={setRecentAgentActions}
                onExceptionsChange={setExceptions}
                exceptions={exceptions}
                activeUser={activeUser}
                initialPage={initialPage}
                onAskTeammate={(msg) => {
                  setInitialChatMessage(msg);
                  setIsTeammateRailOpen(true);
                  setIsChatBarVisible(false);
                }}
                onOpenRail={() => {
                  setIsTeammateRailOpen(true);
                  setIsChatBarVisible(false);
                }}
                teammateOpen={isTeammateRailOpen}
                onTeammateOpenChange={(open) => {
                  setIsTeammateRailOpen(open);
                  setIsChatBarVisible(!open);
                }}
                onTeammateChatHistoryChange={setTeammateChatHistory}
                onTeammateExplorePlan={onTeammateExplorePlan}
                financeChatSubmitRef={financeChatSubmitRef}
                onTeammateSparkle={onTeammateSparkle}
                headcountHireApplyNonce={headcountHireApplyNonce}
              />
            </div>
          ) : (
            <AccountingDashboard
              showValueProp={showValueProp}
              onStartMigration={() => setInMigrationFlow(true)}
              onDismiss={() => setShowValueProp(false)}
            />
          )}
        </div>
      ) : (
        <EmptyWorkspace />
      )}

      {/* Column 3: Teammate Rail - Only in Accounting App */}
      {inAccountingApp && !inMigrationFlow && !showGoalSetting && (
        <ContextAwareTeammateRail
          isOpen={isTeammateRailOpen}
          onToggle={() => {
            setIsTeammateRailOpen(false);
            setIsChatBarVisible(true);
          }}
          context={inAccountingApp ? "accounting" : "clio"}
          recentActions={recentAgentActions}
          exceptions={exceptions}
          initialMessage={initialChatMessage}
          onMessageConsumed={() => setInitialChatMessage(undefined)}
          chatHistory={teammateChatHistory}
          onChatHistoryChange={setTeammateChatHistory}
          teammatePlan={teammatePlan}
          onTeammatePlanChange={setTeammatePlan}
          focusPlanTabNonce={teammatePlanTabNonce}
          onTeammateExplorePlan={onTeammateExplorePlan}
          financeChatSubmitRef={financeChatSubmitRef}
          onNavigateToHeadcountHireView={() => {
            setHeadcountHireApplyNonce((n) => n + 1);
          }}
        />
      )}

      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}