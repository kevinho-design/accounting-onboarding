/** Single source of truth for demo firm + primary user (Summit Legal Group / Jennifer Chen). */

export const FIRM_NAME = 'Summit Legal Group';
export const FIRM_ATTORNEY_COUNT = 82;

export const USER_FIRST_NAME = 'Jennifer';
export const USER_LAST_NAME = 'Chen';
export const USER_FULL_NAME = `${USER_FIRST_NAME} ${USER_LAST_NAME}`;
export const USER_INITIALS = 'JC';
export const USER_EMAIL = 'j.chen@summitlegal.com';
export const USER_ROLE = 'Controller';

/** Default Finances page title shown in nav + header */
export const FINANCE_DEFAULT_PAGE_TITLE = '2026 Strategic Roadmap';

export const FIRM_STORY = `Jennifer is the controller at Summit Legal Group, an ${FIRM_ATTORNEY_COUNT}-attorney multi-practice firm. She is responsible for the firm's day-to-day financial operations, reporting, and compliance. Every month she reviews cash flow, reconciles accounts, monitors AR aging, and ensures the firm is tracking against its financial goals—all while managing exceptions that surface in real time.`;

export const DIGITAL_TWIN_CATALOG_DESC =
  'Living model: firm data, peer benchmarks, and industry trends—pressure-test runway, headcount, and rates before you decide.';

export const DIGITAL_TWIN_HEADLINE = 'Digital Twin';

export const DIGITAL_TWIN_BODY =
  'Clio builds a digital twin of Summit—a living model that triangulates your firm\'s own data, anonymized peer benchmarks, and industry trends. Use it to pressure-test decisions before you make them: What happens to cash runway if two senior associates leave? What does a 10% rate increase in Real Estate do to revenue, based on what comparable firms have experienced?';

export const DIGITAL_TWIN_DISCLAIMER =
  'The digital twin does not predict the future. It gives you a financially grounded way to plan for it.';

export const DIGITAL_TWIN_BULLETS = [
  'Continuous benchmarking against anonymized peer firms in the same region and practice mix',
  'Models growth, headcount, rate, and operational scenarios before decisions are made',
  'Every scenario grounded in real firm performance data—not generic assumptions',
] as const;
