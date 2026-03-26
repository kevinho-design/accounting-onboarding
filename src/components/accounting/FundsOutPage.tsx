import * as React from "react";
import {
  Check,
  Download,
  ChevronDown,
  FileText,
  TrendingUp,
  DollarSign,
  Users,
  Plus,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type BillStatus = "paid" | "billed" | "unbilled" | "";

interface Bill {
  id: string;
  billDate: string;
  daysUntilDue: number;
  paymentDate?: string;
  vendor: string;
  billNumber: string;
  billable: boolean;
  matter: string;
  status: BillStatus;
  totalBill: number;
  balanceDue: number;
  billTab: "draft" | "unpaid" | "paid";
  category: string;
  paymentTerms: string;
  notes: string;
  contact: string;
}

interface Expense {
  paymentDate: string;
  source: string;
  vendor: string;
  billable: boolean;
  matter: string;
  status: BillStatus;
  category: string;
  amount: number;
  expenseTab: "all" | "pending" | "posted" | "excluded";
}

interface Vendor {
  name: string;
  category: string;
  email: string;
  activeMatters: number;
  balanceDue: number;
  totalSpend: number;
}

/* ─── Mock Data ─────────────────────────────────────────────────────────── */

const BILLS: Bill[] = [
  /* ── UNPAID ───────────────────────────────────────────────────────── */
  { id: "b1",  billDate: "Jan 15 2026", daysUntilDue: -39, vendor: "Rosenbaum, O'Keefe & Roberts", billNumber: "234",    billable: false, matter: "0001-Kelvin Nitzsche",  status: "",         totalBill: 1459.55,  balanceDue: 1459.55,  billTab: "unpaid", category: "Legal Services",       paymentTerms: "Net 30",        notes: "February retainer invoice. Please reference matter number.", contact: "Santos.Braun@hotmail.com"      },
  { id: "b2",  billDate: "Jan 20 2026", daysUntilDue: -28, vendor: "Rolfson, Cronin and Murazik",  billNumber: "06835",  billable: false, matter: "",                      status: "",         totalBill: 30459.12, balanceDue: 30459.12, billTab: "unpaid", category: "Marketing",            paymentTerms: "Net 45",        notes: "Q1 marketing campaign — social media + print.", contact: "Loraine.Fisher236@gmail.com"          },
  { id: "b3",  billDate: "Jan 28 2026", daysUntilDue: -18, vendor: "Oncricka - Blick",             billNumber: "OB-221", billable: true,  matter: "0001-Felix Spinko DVM", status: "billed",   totalBill: 17059.87, balanceDue: 17059.87, billTab: "unpaid", category: "Expert Witness",       paymentTerms: "Net 30",        notes: "Expert testimony services — medical malpractice case.", contact: "Lessie68@gmail.com"               },
  { id: "b4",  billDate: "Feb 01 2026", daysUntilDue: -11, vendor: "Torphy - Walsh",               billNumber: "457535", billable: false, matter: "",                      status: "",         totalBill: 57459.55, balanceDue: 57459.55, billTab: "unpaid", category: "Insurance",            paymentTerms: "Net 30",        notes: "Professional liability insurance — annual premium Q1 installment.", contact: "Kimberly.Heaney90@hotmail.com" },
  { id: "b5",  billDate: "Feb 03 2026", daysUntilDue: -6,  vendor: "Marquardt, Auer and Ankunding",billNumber: "25468",  billable: false, matter: "",                      status: "",         totalBill: 7459.55,  balanceDue: 7459.55,  billTab: "unpaid", category: "Bank Charges",         paymentTerms: "Due on receipt", notes: "Wire transfer fees and account maintenance January.", contact: "Hermina97@hotmail.com"              },
  { id: "b6",  billDate: "Feb 05 2026", daysUntilDue: -2,  vendor: "Kirlin and Sons",              billNumber: "6852",   billable: false, matter: "",                      status: "",         totalBill: 37459.55, balanceDue: 37459.55, billTab: "unpaid", category: "Office Supplies",      paymentTerms: "Net 15",        notes: "Printer cartridges, paper stock, letterhead, envelopes.", contact: "Clement.Gottlieb@yahoo.com"        },
  { id: "b7",  billDate: "Feb 06 2026", daysUntilDue: 0,   vendor: "Bergnaum, Carter and Emard",   billNumber: "7534",   billable: true,  matter: "0001-Vanessa Towns",    status: "billed",   totalBill: 1459.55,  balanceDue: 959.55,   billTab: "unpaid", category: "Court Reporter",       paymentTerms: "Net 30",        notes: "Deposition transcript — partial payment received ($500).", contact: "Krystina8@yahoo.com"              },
  { id: "b8",  billDate: "Feb 07 2026", daysUntilDue: 4,   vendor: "Batz LLC",                     billNumber: "93150",  billable: false, matter: "",                      status: "",         totalBill: 30459.12, balanceDue: 30459.12, billTab: "unpaid", category: "Software & Tech",      paymentTerms: "Net 30",        notes: "Annual Clio Manage subscription renewal — all users.", contact: "Hiram_Volkman59@gmail.com"         },
  { id: "b9",  billDate: "Feb 08 2026", daysUntilDue: 10,  vendor: "Willms - Hammes",              billNumber: "361",    billable: false, matter: "",                      status: "",         totalBill: 17059.87, balanceDue: 17059.87, billTab: "unpaid", category: "Legal Research",       paymentTerms: "Net 30",        notes: "Westlaw subscription — February cycle.", contact: "Braeden.Langosh99@gmail.com"              },
  { id: "b10", billDate: "Feb 10 2026", daysUntilDue: 14,  vendor: "Bashirian LLC",                billNumber: "68447",  billable: true,  matter: "0001-Lucy Hane",        status: "paid",     totalBill: 57459.55, balanceDue: 57459.55, billTab: "unpaid", category: "Expert Witness",       paymentTerms: "Net 45",        notes: "Financial analysis expert — securities litigation matter.", contact: "Perry40@hotmail.com"              },
  { id: "b11", billDate: "Feb 12 2026", daysUntilDue: 20,  vendor: "VonRueden, Herman and Deckow", billNumber: "5243",   billable: true,  matter: "0001-Bethany Gleason",  status: "unbilled", totalBill: 7459.55,  balanceDue: 7459.55,  billTab: "unpaid", category: "Translation Services", paymentTerms: "Net 30",        notes: "Certified Spanish translation — 12 documents, contract dispute.", contact: "Quentin.Daniel@hotmail.com"   },
  { id: "b12", billDate: "Feb 14 2026", daysUntilDue: 28,  vendor: "Howell LLC",                   billNumber: "984401", billable: false, matter: "",                      status: "",         totalBill: 42300.00, balanceDue: 42300.00, billTab: "unpaid", category: "Payroll",              paymentTerms: "Net 7",         notes: "Semi-monthly payroll run — attorneys and staff.", contact: "Vada.Hilpert@yahoo.com"               },
  { id: "b13", billDate: "Feb 15 2026", daysUntilDue: 35,  vendor: "Torphy - Walsh",               billNumber: "457601", billable: false, matter: "",                      status: "",         totalBill: 8900.00,  balanceDue: 8900.00,  billTab: "unpaid", category: "Office Rent",          paymentTerms: "Net 30",        notes: "March office rent — Suite 1200, 340 Pine Street.", contact: "Kimberly.Heaney90@hotmail.com"         },

  /* ── DRAFT ────────────────────────────────────────────────────────── */
  { id: "b14", billDate: "Feb 16 2026", daysUntilDue: 42,  vendor: "Stark Industries",             billNumber: "",       billable: false, matter: "",                      status: "",         totalBill: 15000.00, balanceDue: 15000.00, billTab: "draft",  category: "IT Services",          paymentTerms: "Net 45",        notes: "Server infrastructure upgrade — awaiting partner approval.", contact: "stark.accounts@stark.com"        },
  { id: "b15", billDate: "Feb 17 2026", daysUntilDue: 47,  vendor: "LexCorp Legal Tech",           billNumber: "",       billable: false, matter: "",                      status: "",         totalBill: 10000.00, balanceDue: 10000.00, billTab: "draft",  category: "Software & Tech",      paymentTerms: "Net 30",        notes: "eDiscovery platform — annual subscription pending review.", contact: "billing@lexcorp.com"             },
  { id: "b16", billDate: "Feb 18 2026", daysUntilDue: 52,  vendor: "Rolfson, Cronin and Murazik",  billNumber: "",       billable: false, matter: "",                      status: "",         totalBill: 4500.00,  balanceDue: 4500.00,  billTab: "draft",  category: "Marketing",            paymentTerms: "Net 30",        notes: "Spring bar association event sponsorship — draft pending CFO sign-off.", contact: "Loraine.Fisher236@gmail.com"},
  { id: "b17", billDate: "Feb 19 2026", daysUntilDue: 58,  vendor: "Kirlin and Sons",              billNumber: "",       billable: false, matter: "",                      status: "",         totalBill: 2200.00,  balanceDue: 2200.00,  billTab: "draft",  category: "Office Equipment",     paymentTerms: "Net 30",        notes: "Standing desk replacements for 2 associates — needs facilities approval.", contact: "Clement.Gottlieb@yahoo.com"},

  /* ── PAID ─────────────────────────────────────────────────────────── */
  { id: "b18", billDate: "Dec 07 2025", daysUntilDue: -55, paymentDate: "Dec 14 2025", vendor: "Howell LLC",                   billNumber: "984312", billable: false, matter: "",                      status: "",     totalBill: 37459.55, balanceDue: 0, billTab: "paid", category: "Payroll",              paymentTerms: "Net 7",         notes: "December semi-monthly payroll — paid via ACH.", contact: "Vada.Hilpert@yahoo.com"               },
  { id: "b19", billDate: "Dec 15 2025", daysUntilDue: -48, paymentDate: "Jan 14 2026",  vendor: "Torphy - Walsh",               billNumber: "457412", billable: false, matter: "",                      status: "",     totalBill: 8900.00,  balanceDue: 0, billTab: "paid", category: "Office Rent",          paymentTerms: "Net 30",        notes: "February office rent — paid on time.", contact: "Kimberly.Heaney90@hotmail.com"               },
  { id: "b20", billDate: "Dec 20 2025", daysUntilDue: -44, paymentDate: "Jan 19 2026",  vendor: "Batz LLC",                     billNumber: "92801",  billable: false, matter: "",                      status: "",     totalBill: 30459.12, balanceDue: 0, billTab: "paid", category: "Software & Tech",      paymentTerms: "Net 30",        notes: "Clio Manage annual subscription — paid in full.", contact: "Hiram_Volkman59@gmail.com"            },
  { id: "b21", billDate: "Jan 03 2026", daysUntilDue: -38, paymentDate: "Feb 02 2026",  vendor: "Willms - Hammes",              billNumber: "355",    billable: false, matter: "",                      status: "",     totalBill: 17059.87, balanceDue: 0, billTab: "paid", category: "Legal Research",       paymentTerms: "Net 30",        notes: "Westlaw January subscription — paid.", contact: "Braeden.Langosh99@gmail.com"                 },
  { id: "b22", billDate: "Jan 08 2026", daysUntilDue: -32, paymentDate: "Jan 09 2026",  vendor: "Marquardt, Auer and Ankunding",billNumber: "25300",  billable: false, matter: "",                      status: "",     totalBill: 3200.00,  balanceDue: 0, billTab: "paid", category: "Bank Charges",         paymentTerms: "Due on receipt", notes: "December wire fees and account maintenance — cleared.", contact: "Hermina97@hotmail.com"              },
  { id: "b23", billDate: "Jan 10 2026", daysUntilDue: -28, paymentDate: "Feb 09 2026",  vendor: "Oncricka - Blick",             billNumber: "OB-198", billable: true,  matter: "0003-Bruce Wayne",      status: "paid", totalBill: 5200.00,  balanceDue: 0, billTab: "paid", category: "Expert Witness",       paymentTerms: "Net 30",        notes: "IP expert — patent infringement review. Billed to client.", contact: "Lessie68@gmail.com"              },
  { id: "b24", billDate: "Jan 14 2026", daysUntilDue: -22, paymentDate: "Feb 13 2026",  vendor: "VonRueden, Herman and Deckow", billNumber: "5198",   billable: true,  matter: "0001-Ellis Hirthe",     status: "paid", totalBill: 3450.00,  balanceDue: 0, billTab: "paid", category: "Translation Services", paymentTerms: "Net 30",        notes: "Mandarin translation — 8 documents. Billed and recovered.", contact: "Quentin.Daniel@hotmail.com"       },
  { id: "b25", billDate: "Jan 18 2026", daysUntilDue: -18, paymentDate: "Feb 17 2026",  vendor: "Bergnaum, Carter and Emard",   billNumber: "7489",   billable: true,  matter: "0001-Vanessa Towns",    status: "paid", totalBill: 1890.00,  balanceDue: 0, billTab: "paid", category: "Court Reporter",       paymentTerms: "Net 30",        notes: "Deposition services — Hernandez matter. Billed and client paid.", contact: "Krystina8@yahoo.com"     },

  /* ── MORE UNPAID ──────────────────────────────────────────────────── */
  { id: "b26", billDate: "Feb 20 2026", daysUntilDue: 45,  vendor: "Howell LLC",                   billNumber: "984502", billable: false, matter: "",                      status: "",         totalBill: 44100.00, balanceDue: 44100.00, billTab: "unpaid", category: "Payroll",              paymentTerms: "Net 7",         notes: "March first payroll run — attorneys and support staff.", contact: "Vada.Hilpert@yahoo.com"              },
  { id: "b27", billDate: "Feb 22 2026", daysUntilDue: 50,  vendor: "Rosenbaum, O'Keefe & Roberts", billNumber: "312",    billable: true,  matter: "0001-Kelvin Nitzsche",  status: "billed",   totalBill: 6200.00,  balanceDue: 6200.00,  billTab: "unpaid", category: "Legal Services",       paymentTerms: "Net 30",        notes: "March retainer — ongoing contract dispute representation.", contact: "Santos.Braun@hotmail.com"          },
  { id: "b28", billDate: "Feb 23 2026", daysUntilDue: 55,  vendor: "Batz LLC",                     billNumber: "94201",  billable: false, matter: "",                      status: "",         totalBill: 2400.00,  balanceDue: 2400.00,  billTab: "unpaid", category: "Software & Tech",      paymentTerms: "Net 30",        notes: "Zoom Rooms annual licence — all conference rooms.", contact: "Hiram_Volkman59@gmail.com"            },
  { id: "b29", billDate: "Feb 24 2026", daysUntilDue: 60,  vendor: "Willms - Hammes",              billNumber: "402",    billable: false, matter: "",                      status: "",         totalBill: 17059.87, balanceDue: 17059.87, billTab: "unpaid", category: "Legal Research",       paymentTerms: "Net 30",        notes: "Westlaw — March subscription cycle.", contact: "Braeden.Langosh99@gmail.com"                 },
  { id: "b30", billDate: "Feb 25 2026", daysUntilDue: 65,  vendor: "Oncricka - Blick",             billNumber: "OB-249", billable: true,  matter: "0001-Shannon Klein",    status: "unbilled", totalBill: 3750.00,  balanceDue: 3750.00,  billTab: "unpaid", category: "Expert Witness",       paymentTerms: "Net 30",        notes: "Forensic accountant — divorce asset valuation.", contact: "Lessie68@gmail.com"                      },
  { id: "b31", billDate: "Feb 26 2026", daysUntilDue: 70,  vendor: "Torphy - Walsh",               billNumber: "457700", billable: false, matter: "",                      status: "",         totalBill: 8900.00,  balanceDue: 8900.00,  billTab: "unpaid", category: "Office Rent",          paymentTerms: "Net 30",        notes: "April office rent — Suite 1200.", contact: "Kimberly.Heaney90@hotmail.com"                 },
  { id: "b32", billDate: "Feb 27 2026", daysUntilDue: 75,  vendor: "Marquardt, Auer and Ankunding",billNumber: "25600",  billable: false, matter: "",                      status: "",         totalBill: 1200.00,  balanceDue: 1200.00,  billTab: "unpaid", category: "Bank Charges",         paymentTerms: "Due on receipt", notes: "March wire transfer fees and account maintenance.", contact: "Hermina97@hotmail.com"              },
  { id: "b33", billDate: "Feb 28 2026", daysUntilDue: 80,  vendor: "VonRueden, Herman and Deckow", billNumber: "5310",   billable: true,  matter: "0001-Bethany Gleason",  status: "paid",     totalBill: 4100.00,  balanceDue: 4100.00,  billTab: "unpaid", category: "Translation Services", paymentTerms: "Net 30",        notes: "Portuguese translation — 5 documents, personal injury matter.", contact: "Quentin.Daniel@hotmail.com"  },
  { id: "b34", billDate: "Mar 01 2026", daysUntilDue: 90,  vendor: "Bashirian LLC",                billNumber: "68510",  billable: true,  matter: "0001-Lucy Hane",        status: "billed",   totalBill: 9800.00,  balanceDue: 9800.00,  billTab: "unpaid", category: "Expert Witness",       paymentTerms: "Net 45",        notes: "Actuarial expert — wrongful termination damages calculation.", contact: "Perry40@hotmail.com"             },
  { id: "b35", billDate: "Mar 02 2026", daysUntilDue: 95,  vendor: "Kirlin and Sons",              billNumber: "6940",   billable: false, matter: "",                      status: "",         totalBill: 5600.00,  balanceDue: 5600.00,  billTab: "unpaid", category: "Office Equipment",     paymentTerms: "Net 30",        notes: "Printer lease renewal — Q2 2026.", contact: "Clement.Gottlieb@yahoo.com"                      },

  /* ── MORE PAID ────────────────────────────────────────────────────── */
  { id: "b36", billDate: "Dec 10 2025", daysUntilDue: -80, paymentDate: "Jan 09 2026",  vendor: "Bashirian LLC",                billNumber: "67900",  billable: true,  matter: "0001-Felix Spinko DVM", status: "paid", totalBill: 57459.55, balanceDue: 0, billTab: "paid", category: "Legal Research",       paymentTerms: "Net 30",        notes: "Westlaw annual subscription — December renewal. Billed and recovered.", contact: "Perry40@hotmail.com"     },
  { id: "b37", billDate: "Dec 12 2025", daysUntilDue: -76, paymentDate: "Jan 26 2026",  vendor: "Rolfson, Cronin and Murazik",  billNumber: "06700",  billable: false, matter: "",                      status: "",     totalBill: 12000.00, balanceDue: 0, billTab: "paid", category: "Marketing",            paymentTerms: "Net 45",        notes: "Q4 marketing retainer — website refresh and SEO campaign.", contact: "Loraine.Fisher236@gmail.com"      },
  { id: "b38", billDate: "Dec 14 2025", daysUntilDue: -72, paymentDate: "Jan 13 2026",  vendor: "Torphy - Walsh",               billNumber: "457300", billable: false, matter: "",                      status: "",     totalBill: 8900.00,  balanceDue: 0, billTab: "paid", category: "Office Rent",          paymentTerms: "Net 30",        notes: "January rent — paid on time.", contact: "Kimberly.Heaney90@hotmail.com"                       },
  { id: "b39", billDate: "Dec 18 2025", daysUntilDue: -64, paymentDate: "Jan 02 2026",  vendor: "Kirlin and Sons",              billNumber: "6700",   billable: false, matter: "",                      status: "",     totalBill: 4800.00,  balanceDue: 0, billTab: "paid", category: "Office Supplies",      paymentTerms: "Net 15",        notes: "Year-end stationery and office supply restock.", contact: "Clement.Gottlieb@yahoo.com"               },
  { id: "b40", billDate: "Dec 22 2025", daysUntilDue: -60, paymentDate: "Dec 29 2025",  vendor: "Howell LLC",                   billNumber: "984200", billable: false, matter: "",                      status: "",     totalBill: 42300.00, balanceDue: 0, billTab: "paid", category: "Payroll",              paymentTerms: "Net 7",         notes: "December second payroll — paid via ACH.", contact: "Vada.Hilpert@yahoo.com"                      },
];

const EXPENSES: Expense[] = [
  { paymentDate: "Feb 07 2026", source: "BoA Checking",     vendor: "Rosenbaum, O'Keefe and Roberts", billable: false, matter: "0001-Ellis Hirthe",     status: "unbilled", category: "Private investigators",                    amount: 1459.55,  expenseTab: "posted" },
  { paymentDate: "Feb 06 2026", source: "BoA Checking",     vendor: "Marquardt, Auer and Ankunding",  billable: false, matter: "",                       status: "",         category: "Insurance",                                amount: 7459.55,  expenseTab: "posted" },
  { paymentDate: "Feb 02 2026", source: "BoA credit card",  vendor: "Kirlin and Sons",                billable: false, matter: "",                       status: "",         category: "Office supplies",                          amount: 37459.55, expenseTab: "posted" },
  { paymentDate: "Feb 01 2026", source: "BoA Checking",     vendor: "Bergnaum, Carter and Emard",     billable: true,  matter: "0001-Vanessa Towns",     status: "billed",   category: "Court filing fees, Court reporter...",     amount: 1459.55,  expenseTab: "posted" },
  { paymentDate: "Jan 30 2026", source: "BoA Checking",     vendor: "Batz LLC",                       billable: false, matter: "",                       status: "",         category: "Software",                                 amount: 30459.12, expenseTab: "posted" },
  { paymentDate: "Jan 28 2026", source: "BoA credit card",  vendor: "Willms - Hammes",                billable: false, matter: "",                       status: "",         category: "Courier",                                  amount: 17059.87, expenseTab: "posted" },
  { paymentDate: "Jan 27 2026", source: "BoA credit card",  vendor: "Bashirian LLC",                  billable: true,  matter: "0001-Lucy Hane",         status: "paid",     category: "Legal research",                           amount: 57459.55, expenseTab: "posted" },
  { paymentDate: "Jan 25 2026", source: "BoA credit card",  vendor: "VonRueden, Herman and Deckow",   billable: true,  matter: "0001-Bethany Gleason",   status: "paid",     category: "Translation services",                     amount: 7459.55,  expenseTab: "posted" },
  { paymentDate: "Mar 01 2026", source: "BoA Checking",     vendor: "Howell LLC",                     billable: false, matter: "",                       status: "",         category: "Payroll",                                  amount: 12400.00, expenseTab: "pending" },
  { paymentDate: "Mar 03 2026", source: "BoA credit card",  vendor: "Torphy - Walsh",                 billable: false, matter: "",                       status: "",         category: "Insurance",                                amount: 890.00,   expenseTab: "pending" },
  { paymentDate: "Nov 15 2025", source: "BoA Checking",     vendor: "Kirlin and Sons",                billable: false, matter: "",                       status: "",         category: "Office supplies",                          amount: 320.00,   expenseTab: "excluded" },
];

const VENDORS: Vendor[] = [
  { name: "Howell LLC",                     category: "Payroll Expenses",          email: "Vada.Hilpert@yahoo.com",           activeMatters: 2, balanceDue: 34128.36, totalSpend: 77459.55 },
  { name: "Rosenbaum, O'Keefe and Roberts", category: "Contractors",               email: "Santos.Braun@hotmail.com",         activeMatters: 0, balanceDue: 27256.15, totalSpend: 30459.12 },
  { name: "Rolfson, Cronin and Murazik",    category: "Marketing/Advertising",     email: "Loraine.Fisher236@gmail.com",      activeMatters: 6, balanceDue: 19268.30, totalSpend: 57459.55 },
  { name: "Oncricka - Blick",               category: "Operations",                email: "Lessie68@gmail.com",               activeMatters: 1, balanceDue: 8159.74,  totalSpend: 17059.87 },
  { name: "Torphy - Walsh",                 category: "Insurance",                 email: "Kimberly.Heaney90@hotmail.com",    activeMatters: 0, balanceDue: 534.64,   totalSpend: 44987.36 },
  { name: "Marquardt, Auer and Ankunding",  category: "Bank/Credit Card Charges",  email: "Hermina97@hotmail.com",            activeMatters: 1, balanceDue: 742.13,   totalSpend: 7458.55  },
  { name: "Kirlin and Sons",                category: "Office Expenses: Supplies", email: "Clement.Gottlieb@yahoo.com",       activeMatters: 2, balanceDue: 358.36,   totalSpend: 37459.55 },
  { name: "Bergnaum, Carter and Emard",     category: "Office Expenses: Repairs",  email: "Krystina8@yahoo.com",              activeMatters: 0, balanceDue: 0,        totalSpend: 30459.12 },
  { name: "Batz LLC",                       category: "Office Expenses: Software", email: "Hiram_Volkman59@gmail.com",        activeMatters: 0, balanceDue: 0,        totalSpend: 17059.87 },
  { name: "Willms - Hammes",                category: "Legal Research",            email: "Braeden.Langosh99@gmail.com",      activeMatters: 0, balanceDue: 0,        totalSpend: 1459.55  },
  { name: "Bashirian LLC",                  category: "Legal Research",            email: "Perry40@hotmail.com",              activeMatters: 0, balanceDue: 0,        totalSpend: 1459.55  },
  { name: "VonRueden, Herman and Deckow",   category: "Office Expenses: Supplies", email: "Quentin.Daniel@hotmail.com",       activeMatters: 0, balanceDue: 0,        totalSpend: 374.68   },
];

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function fmtDue(days: number): { label: string; overdue: boolean } {
  if (days < -1)  return { label: `${Math.abs(days)} days overdue`, overdue: true  };
  if (days === -1) return { label: "1 day overdue",                  overdue: true  };
  if (days === 0)  return { label: "Due today",                      overdue: false };
  if (days === 1)  return { label: "Due in 1 day",                   overdue: false };
  return                   { label: `Due in ${days} days`,           overdue: false };
}

const STATUS_CONFIG: Record<BillStatus, { label: string; bg: string; text: string }> = {
  paid:     { label: "Paid",     bg: "#F0FDF4", text: "#16A34A" },
  billed:   { label: "Billed",   bg: "color-mix(in srgb, #A3DCFF 28%, #ffffff)", text: "#0070E0" },
  unbilled: { label: "Unbilled", bg: "#FFF7ED", text: "#C2410C" },
  "":       { label: "",         bg: "",        text: "" },
};

function StatusBadge({ status }: { status: BillStatus }) {
  if (!status) return null;
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

function PillTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string; count?: number }[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {tabs.map(({ key, label, count }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] transition-all"
            style={{
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#17181C" : "#64748B",
              backgroundColor: isActive ? "#F1F5F9" : "transparent",
              border: isActive ? "1px solid #CBD5E1" : "1px solid transparent",
            }}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span
                className="text-[11px] px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: isActive ? "#E2E8F0" : "#F1F5F9",
                  color: isActive ? "#475569" : "#94A3B8",
                  fontWeight: 600,
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Payables Tab ──────────────────────────────────────────────────────── */

const BILLS_LOAD_BATCH = 10;

function PayablesTab() {
  const [billTab, setBillTab] = React.useState<"draft" | "unpaid" | "paid">("unpaid");
  const [visibleCount, setVisibleCount] = React.useState(BILLS_LOAD_BATCH);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const filtered = BILLS.filter((b) => b.billTab === billTab);
  const visibleBills = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  React.useEffect(() => {
    setVisibleCount(BILLS_LOAD_BATCH);
  }, [billTab]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BILLS_LOAD_BATCH, filtered.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered.length]);

  const billTabs: { key: "draft" | "unpaid" | "paid"; label: string; count: number }[] = [
    { key: "draft",  label: "Draft",  count: BILLS.filter(b => b.billTab === "draft").length  },
    { key: "unpaid", label: "Unpaid", count: BILLS.filter(b => b.billTab === "unpaid").length },
    { key: "paid",   label: "Paid",   count: BILLS.filter(b => b.billTab === "paid").length   },
  ];


  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Total Payables */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="mb-2">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Total Payables</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{fmt(42350)}</p>
          <div className="flex items-center gap-1 mt-1 mb-3">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span className="text-[12px] font-medium text-emerald-600">+12% from last month</span>
            <span className="text-[11px] text-muted-foreground/60 ml-1">· 13 open bills</span>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50">Aging Breakdown</p>
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
              <div className="rounded-full" style={{ flex: 3, backgroundColor: "#22C55E" }} />
              <div className="rounded-full" style={{ flex: 2, backgroundColor: "#F59E0B" }} />
              <div className="rounded-full" style={{ flex: 2, backgroundColor: "#F97316" }} />
              <div className="rounded-full" style={{ flex: 1, backgroundColor: "#EF4444" }} />
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { label: "0–30", color: "#22C55E" },
                { label: "31–60", color: "#F59E0B" },
                { label: "61–90", color: "#F97316" },
                { label: "90+", color: "#EF4444" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-[10px] text-muted-foreground/70">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hard Cost */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="mb-2">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Hard Cost</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{fmt(12450)}</p>
          <p className="text-[12px] text-muted-foreground mt-1 mb-3">Ready to bill · Recoverable from clients</p>
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/50 mb-1">Top Hard Costs</p>
            {[
              { matter: "0003-Bruce Wayne", amount: 5200 },
              { matter: "0001-Ellis Hirthe", amount: 3450 },
            ].map(({ matter, amount }) => (
              <div key={matter} className="flex items-center justify-between">
                <span className="text-[12px] text-primary hover:underline cursor-pointer">{matter}</span>
                <span className="text-[12px] font-semibold text-foreground tabular-nums">{fmt(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Vendors */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <div className="mb-2">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Top Vendors</p>
          </div>
          <div className="space-y-2 mt-3">
            {[
              { name: "Howell LLC",       bills: 3, amount: 37459.55 },
              { name: "Stark Industries", bills: 7, amount: 15000.00 },
              { name: "LexCorp",          bills: 1, amount: 10000.00 },
              { name: "Oncricka - Blick", bills: 2, amount: 8159.74  },
            ].map(({ name, bills, amount }) => (
              <div key={name} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-primary hover:underline cursor-pointer font-medium">{name}</span>
                  <span className="text-[10px] text-muted-foreground/50">{bills} bill{bills !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-[12px] font-semibold text-foreground tabular-nums">{fmt(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bill table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
          <PillTabs tabs={billTabs} active={billTab} onChange={setBillTab} />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#F7F5F5", border: "1px solid var(--border)" }}>
            <input
              placeholder="vendor, matter, bill no."
              className="bg-transparent outline-none text-[13px] w-44"
              style={{ color: "var(--foreground)" }}
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {              (billTab === "paid"
                ? ["Bill date", "Payment date", "Vendor", "Bill no.", "Billable", "Matter", "Invoice status", "Total bill"]
                : ["Bill date", "Due", "Vendor", "Bill no.", "Billable", "Matter", "Invoice status", "Total bill", "Balance due"]
              ).map((h, i) => (
                <th key={h} className={`${i === 0 ? "pl-6 pr-3" : "px-3"} py-3 text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60 ${h === "Total bill" || h === "Balance due" ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleBills.map((bill) => {
              const due = fmtDue(bill.daysUntilDue);
              return (
                <tr key={bill.id} className="hover:bg-background transition-colors cursor-pointer" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td className="pl-6 pr-3 py-3 text-[13px] text-foreground whitespace-nowrap">{bill.billDate}</td>
                  {billTab === "paid" ? (
                    <td className="px-3 py-3 text-[13px] text-muted-foreground whitespace-nowrap">{bill.paymentDate}</td>
                  ) : (
                    <td className="px-3 py-3 text-[13px] whitespace-nowrap font-medium" style={{ color: due.overdue ? "#DC2626" : "#64748B" }}>{due.label}</td>
                  )}
                  <td className="px-3 py-3 text-[13px] text-primary font-medium whitespace-nowrap hover:underline">{bill.vendor}</td>
                  <td className="px-3 py-3 text-[13px] text-muted-foreground">{bill.billNumber}</td>
                  <td className="px-3 py-3 text-center">{bill.billable && <Check className="w-3.5 h-3.5 text-muted-foreground/60 mx-auto" />}</td>
                  <td className="px-3 py-3 text-[13px] text-primary truncate max-w-[160px]">{bill.matter}</td>
                  <td className="px-3 py-3">{bill.billable && <StatusBadge status={bill.status} />}</td>
                  <td className="px-3 py-3 text-[13px] font-semibold text-foreground text-right tabular-nums whitespace-nowrap">{fmt(bill.totalBill)}</td>
                  {billTab !== "paid" && (
                    <td className="px-3 py-3 text-[13px] font-semibold text-foreground text-right tabular-nums whitespace-nowrap">{fmt(bill.balanceDue)}</td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Sentinel for infinite scroll */}
        <div ref={sentinelRef} className="h-1" />
        {hasMore && (
          <div className="flex items-center justify-center py-4 gap-2" style={{ color: "#94A3B8" }}>
            <div className="w-4 h-4 rounded-full border-2 border-slate-200 border-t-slate-400 animate-spin" />
            <span className="text-[12px]">Loading more…</span>
          </div>
        )}
        {!hasMore && filtered.length > 0 && (
          <div className="flex items-center justify-center py-3">
            <span className="text-[12px] text-muted-foreground/40">All {filtered.length} bills loaded</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Expenses Tab ──────────────────────────────────────────────────────── */

function ExpensesTab() {
  const [expTab, setExpTab] = React.useState<"all" | "pending" | "posted" | "excluded">("posted");

  const filtered = expTab === "all" ? EXPENSES : EXPENSES.filter((e) => e.expenseTab === expTab);

  const expTabs: { key: "all" | "pending" | "posted" | "excluded"; label: string; count: number }[] = [
    { key: "all",      label: "All",      count: EXPENSES.length },
    { key: "pending",  label: "Pending",  count: EXPENSES.filter(e => e.expenseTab === "pending").length  },
    { key: "posted",   label: "Posted",   count: EXPENSES.filter(e => e.expenseTab === "posted").length   },
    { key: "excluded", label: "Excluded", count: EXPENSES.filter(e => e.expenseTab === "excluded").length },
  ];

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <PillTabs tabs={expTabs} active={expTab} onChange={setExpTab} />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#F7F5F5", border: "1px solid var(--border)" }}>
          <input
            placeholder="vendor name"
            className="bg-transparent outline-none text-[13px] w-36"
            style={{ color: "var(--foreground)" }}
          />
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Payment date","Source","Vendor","Billable","Matter","Invoice Status","Categories","Amount"].map((h) => (
              <th key={h} className={`px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60 ${h === "Amount" ? "text-right" : "text-left"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((exp, i) => (
            <tr key={i} className="hover:bg-background transition-colors cursor-pointer" style={{ borderBottom: "1px solid var(--border)" }}>
              <td className="px-4 py-3 text-[13px] text-foreground whitespace-nowrap">{exp.paymentDate}</td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground whitespace-nowrap">{exp.source}</td>
              <td className="px-4 py-3 text-[13px] text-primary font-medium hover:underline whitespace-nowrap">{exp.vendor}</td>
              <td className="px-4 py-3 text-center">{exp.billable && <Check className="w-3.5 h-3.5 text-muted-foreground/60 mx-auto" />}</td>
              <td className="px-4 py-3 text-[13px] text-primary">{exp.matter}</td>
              <td className="px-4 py-3"><StatusBadge status={exp.status} /></td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground truncate max-w-[180px]">{exp.category}</td>
              <td className="px-4 py-3 text-[13px] font-semibold text-foreground text-right tabular-nums whitespace-nowrap">{fmt(exp.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)", backgroundColor: "#F8FAFC" }}>
        <span className="text-[12px] text-muted-foreground/60">1–{filtered.length} of {filtered.length} items</span>
        <select className="text-[12px] rounded px-2 py-1 outline-none" style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
    </div>
  );
}

/* ─── Vendors Tab ───────────────────────────────────────────────────────── */

function VendorsTab() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#F7F5F5", border: "1px solid var(--border)" }}>
          <input
            placeholder="vendor name"
            className="bg-transparent outline-none text-[13px] w-36"
            style={{ color: "var(--foreground)" }}
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium text-foreground hover:bg-background transition-colors" style={{ border: "1px solid var(--border)" }}>
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>

      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border)" }}>
            {["Vendor","Category (Default)","Primary email address","Active matters","Balance due","Total Spend (YTD)"].map((h) => (
              <th key={h} className={`px-4 py-3 text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60 ${h === "Balance due" || h === "Total Spend (YTD)" ? "text-right" : "text-left"}`}>
                {h === "Balance due" || h === "Active matters" ? (
                  <span className="flex items-center gap-1 justify-end">
                    {h} <ChevronDown className="w-3 h-3" />
                  </span>
                ) : h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {VENDORS.map((vendor, i) => (
            <tr key={i} className="hover:bg-background transition-colors cursor-pointer" style={{ borderBottom: "1px solid var(--border)" }}>
              <td className="px-4 py-3 text-[13px] text-primary font-medium hover:underline">{vendor.name}</td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground">{vendor.category}</td>
              <td className="px-4 py-3 text-[13px] text-muted-foreground">{vendor.email}</td>
              <td className="px-4 py-3 text-[13px] text-foreground">{vendor.activeMatters}</td>
              <td className="px-4 py-3 text-[13px] font-semibold text-foreground text-right tabular-nums">{vendor.balanceDue > 0 ? fmt(vendor.balanceDue) : "$0"}</td>
              <td className="px-4 py-3 text-[13px] font-semibold text-foreground text-right tabular-nums">{fmt(vendor.totalSpend)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)", backgroundColor: "#F8FAFC" }}>
        <span className="text-[12px] text-muted-foreground/60">1–{VENDORS.length} of {VENDORS.length} items</span>
        <select className="text-[12px] rounded px-2 py-1 outline-none" style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────────── */

type TopTab = "payables" | "expenses" | "vendors";

interface FundsOutPageProps {
  initialTab?: TopTab;
}

const TAB_LABELS: Record<TopTab, string> = {
  payables: "Payables",
  expenses: "Expenses",
  vendors:  "Vendors",
};

export function FundsOutPage({ initialTab = "payables" }: FundsOutPageProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-6 flex-shrink-0" style={{ backgroundColor: "#F7F5F5" }}>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{TAB_LABELS[initialTab]}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Expenses, vendor payments, and disbursements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-foreground hover:bg-foreground/90 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6 pb-24">
        {initialTab === "payables" && <PayablesTab />}
        {initialTab === "expenses" && <ExpensesTab />}
        {initialTab === "vendors"  && <VendorsTab  />}
      </div>
    </div>
  );
}
