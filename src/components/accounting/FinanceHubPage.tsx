import * as React from "react";
import FinanceHubApp from "../finance-hub/App";

export function FinanceHubPage({ initialPage, scrollToWidget, onAddPageRef }: { initialPage?: string; scrollToWidget?: string; onAddPageRef?: React.MutableRefObject<(() => void) | null> }) {
  return (
    <div className="flex-1 h-full overflow-hidden finance-hub">
      <style>{`
        .finance-hub > div > aside { display: none !important; }
        .finance-hub > div > aside + div { margin-left: 0 !important; }
        .finance-hub .max-w-4xl,
        .finance-hub .max-w-5xl,
        .finance-hub .max-w-6xl,
        .finance-hub .max-w-7xl { max-width: 100% !important; }
      `}</style>
      <FinanceHubApp initialPage={initialPage} scrollToWidget={scrollToWidget} onAddPageRef={onAddPageRef} />
    </div>
  );
}
