import * as React from "react";
import { toast } from "sonner";
import { SimplifiedSidebar } from "./components/SimplifiedSidebar";
import { EmptyWorkspace } from "./components/EmptyWorkspace";
import { ContextAwareTeammateRail } from "./components/ContextAwareTeammateRail";
import { AccountingDashboard } from "./components/AccountingDashboard";
import { MigrationOnboardingFlow } from "./components/MigrationOnboardingFlow";
import { BookkeeperOnboardingFlow } from "./components/BookkeeperOnboardingFlow";
import { AccountingApp } from "./components/AccountingApp";
import { Screen10_FinancialGoals } from "./components/migration/Screen10_FinancialGoals";
import { Toaster } from "./components/ui/sonner";
import { FloatingChatBar } from "./components/FloatingChatBar";
import { AgentAction, Exception } from "./components/agents/AgentTypes";

export default function App() {
  const [currentPage, setCurrentPage] = React.useState("Dashboard");
  const [showValueProp, setShowValueProp] = React.useState(true);
  const [inMigrationFlow, setInMigrationFlow] = React.useState(false);
  const [inBookkeeperFlow, setInBookkeeperFlow] = React.useState(false);
  const [showGoalSetting, setShowGoalSetting] = React.useState(false);
  const [inAccountingApp, setInAccountingApp] = React.useState(false);
  const [isTeammateRailOpen, setIsTeammateRailOpen] = React.useState(false);
  const [recentAgentActions, setRecentAgentActions] = React.useState<AgentAction[]>([]);
  const [exceptions, setExceptions] = React.useState<Exception[]>([]);

  // Badge count derives from live exceptions; resets to 0 when rail opens
  const [railSeen, setRailSeen] = React.useState(false);
  const teammateNotificationCount = railSeen ? 0 : exceptions.length;
  const [initialChatMessage, setInitialChatMessage] = React.useState<string | undefined>();
  const [isChatBarVisible, setIsChatBarVisible] = React.useState(true);
  const [activeUser, setActiveUser] = React.useState<"jennifer" | "sarah">("jennifer");

  const handleMigrationComplete = () => {
    setInMigrationFlow(false);
    setInAccountingApp(true);
    setShowValueProp(false);
    setRailSeen(false); // Show badge as soon as exceptions populate
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
    setCurrentPage("Dashboard");
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
  };

  const startSarahFlow = React.useCallback(() => {
    // Clear any stale data from Jennifer's session
    setExceptions([]);
    setRecentAgentActions([]);
    setRailSeen(false);
    setCurrentPage("Accounting");
    setShowValueProp(false);
    setInBookkeeperFlow(true);
  }, []);


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
        <>
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
            <AccountingApp 
              onBackToClio={handleBackToClio}
              onReviewFinancialGoals={handleReviewFinancialGoals}
              onRecentActionsChange={setRecentAgentActions}
              onExceptionsChange={setExceptions}
              activeUser={activeUser}
              onAskTeammate={(msg) => {
                setInitialChatMessage(msg);
                setIsTeammateRailOpen(true);
                setIsChatBarVisible(false);
                setRailSeen(true);
              }}
              onOpenRail={() => {
                setIsTeammateRailOpen(true);
                setIsChatBarVisible(false);
                setRailSeen(true);
              }}
            />
          ) : (
            <AccountingDashboard
              showValueProp={showValueProp}
              onStartMigration={() => setInMigrationFlow(true)}
              onDismiss={() => setShowValueProp(false)}
            />
          )}
        </>
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
            setRailSeen(true);
          }}
          context={inAccountingApp ? "accounting" : "clio"}
          recentActions={recentAgentActions}
          exceptions={exceptions}
          initialMessage={initialChatMessage}
          onMessageConsumed={() => setInitialChatMessage(undefined)}
        />
      )}

      {/* Floating Chat Bar - Only in Accounting App */}
      {inAccountingApp && !inMigrationFlow && !showGoalSetting && (
        <FloatingChatBar
          isVisible={isChatBarVisible}
          notificationCount={teammateNotificationCount}
          activeUser={activeUser}
          onOpen={() => {
            setIsTeammateRailOpen(true);
            setRailSeen(true);
          }}
          onSubmitMessage={(msg) => {
            if (msg === "__sparkle__") {
              setIsChatBarVisible(false);
            } else {
              setInitialChatMessage(msg);
              setIsChatBarVisible(false);
            }
            setIsTeammateRailOpen(true);
            setRailSeen(true);
          }}
        />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}