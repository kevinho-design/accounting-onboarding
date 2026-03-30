/**
 * Scripted NQL demo: "Can we afford to hire a 13th attorney?" → narrative → Yes → custom Finances view.
 */

export function matchHireAttorneyIntent(text: string): boolean {
  const q = text.trim().toLowerCase();
  if (!q) return false;
  const hire =
    q.includes("hire") ||
    q.includes("headcount") ||
    q.includes("new associate") ||
    q.includes("another attorney") ||
    q.includes("13th") ||
    q.includes("thirteenth") ||
    (q.includes("attorney") && (q.includes("afford") || q.includes("another") || q.includes("more") || q.includes("add")));
  return hire;
}

export function isAffirmativeHireViewReply(text: string): boolean {
  const q = text.trim().toLowerCase();
  if (!q) return false;
  return (
    q === "yes" ||
    q === "yeah" ||
    q === "yep" ||
    q === "sure" ||
    q === "ok" ||
    q === "okay" ||
    q.startsWith("yes ") ||
    q.startsWith("yeah ") ||
    q.includes("please build") ||
    q.includes("go ahead") ||
    q.includes("sounds good") ||
    (q.includes("build") && q.includes("view")) ||
    (q.includes("do it") && q.length < 24)
  );
}

export function getHireAttorneyNarrativeResponse(): string {
  return [
    "Here’s a concise read from your live books and goals, Hartwell & Morris: you’re at 12 attorneys today with $284.5K recognized revenue MTD (March 2026) and ~74 days operating runway at the current burn. Operating cash is $142.8K; unbilled WIP is $52.5K, which is the fastest internal lever if you need cushion before adding fixed payroll.",
    "Against peer firms of similar size in Clio’s anonymized benchmark band, your cash runway is slightly below the median (peers cluster closer to 80–88 days at this revenue band). That doesn’t rule out a hire—it means the next attorney should pay back inside your collections and utilization trajectory, or you time start date after a billing or AR push.",
    "Would you like Clio Accounting to build a custom Finances view with the relevant firm widgets and peer benchmarking turned on so you can stress-test adding a 13th attorney against cash, burn, and goals?",
  ].join("\n\n");
}

export function getHireViewConfirmationResponse(): string {
  return "Done. I’ve opened your Headcount & Runway view under Finances with peer benchmarking on. Use the strategic charts and modelling rail to compare your firm to peers and adjust timing for the hire.";
}
