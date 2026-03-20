import * as React from "react";
import { AmbientCFORail } from "./AmbientCFORail";
import { SpecializedTeammateRail } from "./SpecializedTeammateRail";
import { AgentAction, Exception } from "./agents/AgentTypes";

interface ContextAwareTeammateRailProps {
  isOpen: boolean;
  onToggle: () => void;
  context: "clio" | "accounting";
  recentActions?: AgentAction[];
  exceptions?: Exception[];
  initialMessage?: string;
  onMessageConsumed?: () => void;
}

export function ContextAwareTeammateRail({
  isOpen,
  onToggle,
  context,
  recentActions = [],
  exceptions = [],
  initialMessage,
  onMessageConsumed,
}: ContextAwareTeammateRailProps) {
  if (context === "accounting") {
    return (
      <SpecializedTeammateRail
        isVisible={isOpen}
        onToggle={onToggle}
        recentActions={recentActions}
        exceptions={exceptions}
        initialMessage={initialMessage}
        onMessageConsumed={onMessageConsumed}
      />
    );
  }

  return <AmbientCFORail isOpen={isOpen} onToggle={onToggle} />;
}
