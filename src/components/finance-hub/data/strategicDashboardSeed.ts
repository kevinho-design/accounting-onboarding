/** Baseline strategic dashboard series (cash, burn, runway by month). */
export const strategicData = [
  { month: "Mar '26", cash: 1200000, burn: 45000, runway: 26.6 },
  { month: "Apr '26", cash: 1155000, burn: 48000, runway: 24.0 },
  { month: "May '26", cash: 1107000, burn: 42000, runway: 26.3 },
  { month: "Jun '26", cash: 1065000, burn: 50000, runway: 21.3 },
  { month: "Jul '26", cash: 1015000, burn: 55000, runway: 18.4 },
  { month: "Aug '26", cash: 960000, burn: 45000, runway: 21.3 },
  { month: "Sep '26", cash: 915000, burn: 40000, runway: 22.8 },
  { month: "Oct '26", cash: 875000, burn: 45000, runway: 19.4 },
  { month: "Nov '26", cash: 830000, burn: 48000, runway: 17.2 },
  { month: "Dec '26", cash: 782000, burn: 42000, runway: 18.6 },
];

export type StrategicMonthRow = (typeof strategicData)[number] & {
  altCash?: number;
  altBurn?: number;
  altRunway?: number;
  /** Anonymized peer composite (Modelling → Benchmark against peers) */
  peerCash?: number;
  peerBurn?: number;
  peerRunway?: number;
};
