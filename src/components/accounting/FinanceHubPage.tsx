import * as React from "react";
import FinanceHubApp from "../finance-hub/App";
import type { TeammateChatMessage } from "../finance-hub/components/clio-teammate/SpecializedTeammateRail";
import type { FhoTeammatePlan } from "../finance-hub/data/fhoTeammateBreakdowns";
import type { Exception } from "../agents/AgentTypes";

export function FinanceHubPage({
  initialPage,
  scrollToWidget,
  onAddPageRef,
  embeddedInAccountingShell,
  shellNavLeftInsetPx,
  shellExceptions,
  onShellAskTeammate,
  onShellNavigateToConnections,
  onShellNavigateToTransactionsFiltered,
  teammateOpen,
  onTeammateOpenChange,
  onTeammateChatHistoryChange,
  onTeammateExplorePlan,
  financeChatSubmitRef,
  onTeammateSparkle,
  navigationGuardRef,
  onShellNavigate,
  headcountHireApplyNonce,
  onFinanceCustomNavChange,
}: {
  initialPage?: string;
  scrollToWidget?: string;
  onAddPageRef?: React.MutableRefObject<(() => void) | null>;
  /** When true, finance-hub shows its own floating search bar (root shell hides its bar on Finances:*). */
  embeddedInAccountingShell?: boolean;
  /** Width of the accounting shell left nav (px) for floating bar inset when embedded. */
  shellNavLeftInsetPx?: number;
  shellExceptions?: Exception[];
  onShellAskTeammate?: (message: string) => void;
  onShellNavigateToConnections?: () => void;
  onShellNavigateToTransactionsFiltered?: (filter: string, month?: string) => void;
  teammateOpen: boolean;
  onTeammateOpenChange: (open: boolean) => void;
  onTeammateChatHistoryChange: React.Dispatch<React.SetStateAction<TeammateChatMessage[]>>;
  onTeammateExplorePlan: (plan: FhoTeammatePlan) => void;
  financeChatSubmitRef: React.MutableRefObject<((text: string) => void) | null>;
  onTeammateSparkle: () => void;
  navigationGuardRef?: React.MutableRefObject<{ tryLeaveToShellPage: (page: string) => boolean } | null>;
  onShellNavigate?: (page: string) => void;
  headcountHireApplyNonce?: number;
  onFinanceCustomNavChange?: (pages: { id: string; title: string }[]) => void;
}) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden finance-hub">
      <style>{`
        .finance-hub > div > aside { display: none !important; }
        .finance-hub > div > aside + div { margin-left: 0 !important; }
        .finance-hub .max-w-4xl,
        .finance-hub .max-w-5xl,
        .finance-hub .max-w-6xl,
        .finance-hub .max-w-7xl { max-width: 100% !important; }
      `}</style>
      <FinanceHubApp
        initialPage={initialPage}
        scrollToWidget={scrollToWidget}
        onAddPageRef={onAddPageRef}
        embeddedInAccountingShell={embeddedInAccountingShell}
        shellNavLeftInsetPx={shellNavLeftInsetPx}
        shellExceptions={shellExceptions}
        onShellAskTeammate={onShellAskTeammate}
        onShellNavigateToConnections={onShellNavigateToConnections}
        onShellNavigateToTransactionsFiltered={onShellNavigateToTransactionsFiltered}
        teammateOpen={teammateOpen}
        onTeammateOpenChange={onTeammateOpenChange}
        onTeammateChatHistoryChange={onTeammateChatHistoryChange}
        onTeammateExplorePlan={onTeammateExplorePlan}
        financeChatSubmitRef={financeChatSubmitRef}
        onTeammateSparkle={onTeammateSparkle}
        navigationGuardRef={navigationGuardRef}
        onShellNavigate={onShellNavigate}
        headcountHireApplyNonce={headcountHireApplyNonce}
        onFinanceCustomNavChange={onFinanceCustomNavChange}
      />
    </div>
  );
}
