const SIMULATED_RESPONSES: Record<string, string> = {
  default:
    "I'm reviewing your firm's data. Based on current accounts, Hartwell & Morris has 74 days of operating cash runway and $52,500 in unbilled time. Is there something specific you'd like me to dig into?",
  cash:
    "Your current operating balance is $142,847. At your current burn rate of $57,900/month, you have approximately 74 days of runway — down from 91 days last month. The main driver is a 12% increase in operating expenses in October.",
  trust:
    "I've reviewed all IOLTA trust accounts. Two transactions from last week are flagged against Delaware state bar rules — both are retainer deposits that need client matter assignment. Suggested fixes are ready for your review.",
  invoice:
    "You have 14 invoices over 30 days past due, totalling $47,200. The highest risk is Chen & Associates ($18,400, 62 days). Based on historical payment patterns, I estimate a 78% probability of collection within the next 30 days without intervention.",
  realization:
    "Your firm's realization rate this month is 87.3%, up from 84.1% last month. Litigation matters are performing best at 92%. Family law is lagging at 79% — primarily due to two matters with write-downs over $5,000.",
};

export function getSimulatedAccountingChatResponse(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("cash") || q.includes("runway") || q.includes("balance")) return SIMULATED_RESPONSES.cash;
  if (q.includes("trust") || q.includes("iolta") || q.includes("compliance")) return SIMULATED_RESPONSES.trust;
  if (q.includes("invoice") || q.includes("ar") || q.includes("overdue") || q.includes("collect"))
    return SIMULATED_RESPONSES.invoice;
  if (q.includes("reali") || q.includes("rate") || q.includes("billing")) return SIMULATED_RESPONSES.realization;
  return SIMULATED_RESPONSES.default;
}
