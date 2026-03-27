import * as React from "react";
import FinanceHubApp from "../finance-hub/App";
import type { TeammateChatMessage } from "../finance-hub/components/clio-teammate/SpecializedTeammateRail";
import type { FhoTeammatePlan } from "../finance-hub/data/fhoTeammateBreakdowns";

export function FinanceHubPage({
  initialPage,
  scrollToWidget,
  onAddPageRef,
  embeddedInAccountingShell,
  teammateOpen,
  onTeammateOpenChange,
  onTeammateChatHistoryChange,
  onTeammateExplorePlan,
  financeChatSubmitRef,
  onTeammateSparkle,
}: {
  initialPage?: string;
  scrollToWidget?: string;
  onAddPageRef?: React.MutableRefObject<(() => void) | null>;
  /** When true, finance-hub shows its own floating search bar (root shell hides its bar on Finances:*). */
  embeddedInAccountingShell?: boolean;
  teammateOpen: boolean;
  onTeammateOpenChange: (open: boolean) => void;
  onTeammateChatHistoryChange: React.Dispatch<React.SetStateAction<TeammateChatMessage[]>>;
  onTeammateExplorePlan: (plan: FhoTeammatePlan) => void;
  financeChatSubmitRef: React.MutableRefObject<((text: string) => void) | null>;
  onTeammateSparkle: () => void;
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
        teammateOpen={teammateOpen}
        onTeammateOpenChange={onTeammateOpenChange}
        onTeammateChatHistoryChange={onTeammateChatHistoryChange}
        onTeammateExplorePlan={onTeammateExplorePlan}
        financeChatSubmitRef={financeChatSubmitRef}
        onTeammateSparkle={onTeammateSparkle}
      />
    </div>
  );
}
