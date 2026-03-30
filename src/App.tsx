import * as React from "react";
import { toast } from "sonner";

const DEMO_PASSWORD = "clio2026";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === DEMO_PASSWORD) {
      sessionStorage.setItem("demo_unlocked", "1");
      onUnlock();
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-sm mx-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Clio Accounting</h1>
          <p className="text-sm text-gray-500 mt-1">Enter the password to view this prototype</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            className={`w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors ${
              error ? "border-red-400 bg-red-50 placeholder:text-red-300" : "border-gray-200 focus:border-blue-500"
            }`}
          />
          {error && <p className="text-xs text-red-500">Incorrect password. Try again.</p>}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
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
  const [unlocked, setUnlocked] = React.useState(
    () => sessionStorage.getItem("demo_unlocked") === "1"
  );
  const [currentPage, setCurrentPage] = React.useState("Dashboard");
  const [showValueProp, setShowValueProp] = React.useState(true);
  const [inMigrationFlow, setInMigrationFlow] = React.useState(false);
  const [inBookkeeperFlow, setInBookkeeperFlow] = React.useState(false);
  const [showGoalSetting, setShowGoalSetting] = React.useState(false);
  const [inAccountingApp, setInAccountingApp] = React.useState(false);
  const [isTeammateRailOpen, setIsTeammateRailOpen] = React.useState(false);
  const [recentAgentActions, setRecentAgentActions] = React.useState<AgentAction[]>([]);
  const [exceptions, setExceptions] = React.useState<Exception[]>([]);

  const [initialChatMessage, setInitialChatMessage] = React.useState<string | undefined>();
  const [teammateChatHistory, setTeammateChatHistory] = React.useState<TeammateChatMessage[]>([]);
  const [teammatePlan, setTeammatePlan] = React.useState<FhoTeammatePlan | null>(null);
  const [teammatePlanTabNonce, setTeammatePlanTabNonce] = React.useState(0);
  const financeChatSubmitRef = React.useRef<((text: string) => void) | null>(null);

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
  const [activeUser, setActiveUser] = React.useState<"jennifer" | "sarah" | "ryan">("jennifer");
  const [showPortal, setShowPortal] = React.useState(true);
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


  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  if (showPortal) {
    return (
      <>
        <div className="h-screen w-screen overflow-auto">
          <AccountingVisionPortal
            onPillar1={() => {
              setShowPortal(false);
              setActiveUser("jennifer");
              setCurrentPage("Accounting");
              setShowValueProp(true);
            }}
            onPillar2={() => {
              setShowPortal(false);
              startSarahFlow();
            }}
            onPillar3={() => {
              setShowPortal(false);
              setActiveUser("ryan");
              setCurrentPage("Accounting");
              setInitialPage("Dashboard");
              setInAccountingApp(true);
            }}
          />
        </div>
        <Toaster />
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
        />
      )}

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}