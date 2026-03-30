import * as React from "react";
import { AmbientCFORail } from "./AmbientCFORail";
import {
  SpecializedTeammateRail,
  type TeammateChatMessage,
} from "./finance-hub/components/clio-teammate/SpecializedTeammateRail";
import type { FhoTeammatePlan } from "./finance-hub/data/fhoTeammateBreakdowns";
import { AgentAction, Exception } from "./agents/AgentTypes";
import { getSimulatedAccountingChatResponse } from "./clio-teammate/accountingChatSimulated";
import {
  getHireAttorneyNarrativeResponse,
  getHireViewConfirmationResponse,
  isAffirmativeHireViewReply,
  matchHireAttorneyIntent,
} from "./clio-teammate/headcountHireChatScript";

interface ContextAwareTeammateRailProps {
  isOpen: boolean;
  onToggle: () => void;
  context: "clio" | "accounting";
  recentActions?: AgentAction[];
  exceptions?: Exception[];
  initialMessage?: string;
  onMessageConsumed?: () => void;
  chatHistory: TeammateChatMessage[];
  onChatHistoryChange: React.Dispatch<React.SetStateAction<TeammateChatMessage[]>>;
  teammatePlan: FhoTeammatePlan | null;
  onTeammatePlanChange: (plan: FhoTeammatePlan | null) => void;
  focusPlanTabNonce: number;
  /** e.g. payroll shortfall → Plan tab with ranked options */
  onTeammateExplorePlan?: (plan: FhoTeammatePlan) => void;
  financeChatSubmitRef: React.MutableRefObject<((text: string) => void) | null>;
  /** Hire NQL demo: after user confirms, parent bumps nonce + navigates shell to Finances. */
  onNavigateToHeadcountHireView?: () => void;
}

export function ContextAwareTeammateRail({
  isOpen,
  onToggle,
  context,
  recentActions = [],
  exceptions = [],
  initialMessage,
  onMessageConsumed,
  chatHistory,
  onChatHistoryChange,
  teammatePlan,
  onTeammatePlanChange,
  focusPlanTabNonce,
  onTeammateExplorePlan,
  financeChatSubmitRef,
  onNavigateToHeadcountHireView,
}: ContextAwareTeammateRailProps) {
  const pendingHireViewOfferRef = React.useRef(false);

  const onUserSend = React.useCallback(
    (text: string) => {
      if (financeChatSubmitRef.current) {
        financeChatSubmitRef.current(text);
        return;
      }
      const trimmed = text.trim();
      if (!trimmed) return;

      if (pendingHireViewOfferRef.current) {
        if (isAffirmativeHireViewReply(trimmed)) {
          pendingHireViewOfferRef.current = false;
          onChatHistoryChange((prev) => [...prev, { role: "user", content: trimmed }]);
          const loadingMsgId = `loading-${Date.now()}`;
          onChatHistoryChange((prev) => [...prev, { role: "ai", content: "...", id: loadingMsgId }]);
          window.setTimeout(() => {
            onChatHistoryChange((prev) =>
              prev.map((msg) =>
                (msg as { id?: string }).id === loadingMsgId
                  ? { role: "ai", content: getHireViewConfirmationResponse() }
                  : msg,
              ),
            );
            onNavigateToHeadcountHireView?.();
          }, 900);
          return;
        }
        pendingHireViewOfferRef.current = false;
      }

      if (matchHireAttorneyIntent(trimmed)) {
        onChatHistoryChange((prev) => [...prev, { role: "user", content: trimmed }]);
        const loadingMsgId = `loading-${Date.now()}`;
        onChatHistoryChange((prev) => [...prev, { role: "ai", content: "...", id: loadingMsgId }]);
        window.setTimeout(() => {
          pendingHireViewOfferRef.current = true;
          onChatHistoryChange((prev) =>
            prev.map((msg) =>
              (msg as { id?: string }).id === loadingMsgId
                ? { role: "ai", content: getHireAttorneyNarrativeResponse() }
                : msg,
            ),
          );
        }, 1200);
        return;
      }

      onChatHistoryChange((prev) => [...prev, { role: "user", content: trimmed }]);
      const loadingMsgId = `loading-${Date.now()}`;
      onChatHistoryChange((prev) => [...prev, { role: "ai", content: "...", id: loadingMsgId }]);
      window.setTimeout(() => {
        const reply = getSimulatedAccountingChatResponse(trimmed);
        onChatHistoryChange((prev) =>
          prev.map((msg) => ((msg as { id?: string }).id === loadingMsgId ? { role: "ai", content: reply } : msg)),
        );
      }, 1200);
    },
    [financeChatSubmitRef, onChatHistoryChange, onNavigateToHeadcountHireView],
  );

  if (context === "accounting") {
    return (
      <SpecializedTeammateRail
        dock
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onTeammatePlanChange(null);
            onToggle();
          }
        }}
        chatHistory={chatHistory}
        onUserSend={onUserSend}
        onClearChat={() => {
          pendingHireViewOfferRef.current = false;
          onChatHistoryChange([]);
        }}
        brandColor="#0069D1"
        focusPlanTabNonce={focusPlanTabNonce}
        teammatePlan={teammatePlan}
        onTeammateExplorePlan={onTeammateExplorePlan}
        exceptions={exceptions}
        recentActions={recentActions}
        initialMessage={initialMessage}
        onMessageConsumed={onMessageConsumed}
      />
    );
  }

  return <AmbientCFORail isOpen={isOpen} onToggle={onToggle} />;
}
