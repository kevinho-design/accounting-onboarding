import * as React from "react";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Landmark,
  Plus,
  ChevronRight,
  ArrowUpRight,
  FileText,
  Search,
  Zap,
  ClipboardEdit,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

interface Invoice {
  id: string;
  client: string;
  matter: string;
  amount: number;
  dateIssued: string;
  dueDate: string;
  status: InvoiceStatus;
}

interface Payment {
  client: string;
  invoiceRef: string;
  amount: number;
  date: string;
  method: string;
}

const INVOICES: Invoice[] = [
  { id: "INV-2026-0051", client: "Robert Chen",       matter: "Chen v. StateFarm",          amount: 4500.00,  dateIssued: "Mar 12", dueDate: "Apr 11", status: "sent"    },
  { id: "INV-2026-0050", client: "Jane Doe",          matter: "Doe v. Metroplex",           amount: 8200.00,  dateIssued: "Mar 10", dueDate: "Mar 25", status: "overdue" },
  { id: "INV-2026-0049", client: "Green Family",      matter: "Green Estate Admin.",         amount: 3150.00,  dateIssued: "Mar 8",  dueDate: "Apr 7",  status: "paid"    },
  { id: "INV-2026-0048", client: "D. Williams",       matter: "Williams IP Filing",         amount: 6800.00,  dateIssued: "Mar 7",  dueDate: "Apr 6",  status: "sent"    },
  { id: "INV-2026-0047", client: "Martinez Family",   matter: "Martinez Estate Admin.",      amount: 4600.00,  dateIssued: "Mar 5",  dueDate: "Mar 20", status: "overdue" },
  { id: "INV-2026-0046", client: "Tom Wilson",        matter: "Wilson v. Metro",             amount: 2900.00,  dateIssued: "Mar 4",  dueDate: "Apr 3",  status: "paid"    },
  { id: "INV-2026-0045", client: "M. Santos",         matter: "Santos Immigration",          amount: 5400.00,  dateIssued: "Mar 3",  dueDate: "Apr 2",  status: "sent"    },
  { id: "INV-2026-0044", client: "Priya Sharma",      matter: "Sharma v. DataCorp",          amount: 7500.00,  dateIssued: "Mar 1",  dueDate: "Mar 31", status: "paid"    },
  { id: "INV-2026-0043", client: "Ellis Hirthe",      matter: "Hirthe v. Consolidated",      amount: 11200.00, dateIssued: "Feb 28", dueDate: "Mar 30", status: "overdue" },
  { id: "INV-2026-0042", client: "Vanessa Towns",     matter: "Towns Custody",               amount: 3800.00,  dateIssued: "Feb 26", dueDate: "Mar 28", status: "sent"    },
  { id: "INV-2026-0041", client: "Bruce Wayne",       matter: "Wayne Enterprises IP",        amount: 22500.00, dateIssued: "Feb 24", dueDate: "Mar 26", status: "sent"    },
  { id: "INV-2026-0040", client: "Lucy Hane",         matter: "Hane Trust Setup",            amount: 5900.00,  dateIssued: "Feb 22", dueDate: "Mar 24", status: "paid"    },
  { id: "INV-2026-0039", client: "Bethany Gleason",   matter: "Gleason v. Metro Transit",    amount: 6400.00,  dateIssued: "Feb 20", dueDate: "Mar 22", status: "sent"    },
  { id: "INV-2026-0038", client: "Felix Spinko",      matter: "Spinko Malpractice",          amount: 9100.00,  dateIssued: "Feb 18", dueDate: "Mar 20", status: "overdue" },
  { id: "INV-2026-0037", client: "Shannon Klein",     matter: "Klein Divorce",               amount: 4250.00,  dateIssued: "Feb 16", dueDate: "Mar 18", status: "paid"    },
  { id: "INV-2026-0036", client: "Kelvin Nitzsche",   matter: "Nitzsche Contract Dispute",   amount: 7800.00,  dateIssued: "Feb 14", dueDate: "Mar 16", status: "sent"    },
  { id: "INV-2026-0035", client: "D. Williams",       matter: "Williams Employment",         amount: 3300.00,  dateIssued: "Feb 12", dueDate: "Mar 14", status: "paid"    },
  { id: "INV-2026-0034", client: "Robert Chen",       matter: "Chen Personal Injury",        amount: 5750.00,  dateIssued: "Feb 10", dueDate: "Mar 12", status: "paid"    },
  { id: "INV-2026-0033", client: "Priya Sharma",      matter: "Sharma Trademark Filing",     amount: 2100.00,  dateIssued: "Feb 8",  dueDate: "Mar 10", status: "paid"    },
  { id: "INV-2026-0032", client: "Martinez Family",   matter: "Martinez Property",           amount: 8900.00,  dateIssued: "Feb 6",  dueDate: "Mar 8",  status: "paid"    },
  { id: "INV-2026-0031", client: "Tom Wilson",        matter: "Wilson Workers Comp",         amount: 4100.00,  dateIssued: "Feb 4",  dueDate: "Mar 6",  status: "paid"    },
  { id: "INV-2026-0030", client: "Jane Doe",          matter: "Doe Immigration Appeal",      amount: 6600.00,  dateIssued: "Feb 2",  dueDate: "Mar 4",  status: "paid"    },
  { id: "INV-2026-0029", client: "Ellis Hirthe",      matter: "Hirthe Business Formation",   amount: 3950.00,  dateIssued: "Jan 31", dueDate: "Mar 2",  status: "paid"    },
  { id: "INV-2026-0028", client: "Lucy Hane",         matter: "Hane Real Estate Closing",    amount: 12400.00, dateIssued: "Jan 29", dueDate: "Feb 28", status: "paid"    },
  { id: "INV-2026-0027", client: "Bruce Wayne",       matter: "Wayne Estate Planning",       amount: 18000.00, dateIssued: "Jan 27", dueDate: "Feb 26", status: "paid"    },
];

const RECENT_PAYMENTS: Payment[] = [
  { client: "Green Family",     invoiceRef: "INV-2026-0049", amount: 3150.00,  date: "Mar 15", method: "Wire" },
  { client: "Tom Wilson",       invoiceRef: "INV-2026-0046", amount: 2900.00,  date: "Mar 14", method: "ACH" },
  { client: "Priya Sharma",     invoiceRef: "INV-2026-0044", amount: 7500.00,  date: "Mar 13", method: "Wire" },
  { client: "M. Santos",        invoiceRef: "INV-2026-0038", amount: 4200.00,  date: "Mar 11", method: "ACH" },
  { client: "D. Williams",      invoiceRef: "INV-2026-0035", amount: 1800.00,  date: "Mar 9",  method: "Check" },
];

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; bg: string; text: string }> = {
  draft:   { label: "Draft",   bg: "#F3F4F6", text: "#4B5563" },
  sent:    { label: "Sent",    bg: "color-mix(in srgb, #A3DCFF 28%, #ffffff)", text: "#0070E0" },
  paid:    { label: "Paid",    bg: "#F0FDF4", text: "#16A34A" },
  overdue: { label: "Overdue", bg: "#FEF2F2", text: "#DC2626" },
};

interface FeatureItem { name: string; subtitle?: string }
interface FeatureSection { title: string; items: FeatureItem[] }

const CORE_FEATURES: FeatureSection[] = [
  { title: "TIME & EXPENSES", items: [
    { name: "Manual time entry", subtitle: "Log hours per matter" },
    { name: "Basic expense tracking", subtitle: "Add costs to matters" },
    { name: "Hourly & flat fee billing", subtitle: "Core billing methods" },
  ]},
  { title: "INVOICING", items: [
    { name: "Quick bill generation", subtitle: "Single matter at a time" },
    { name: "PDF invoice download" },
    { name: "Send bills via email" },
    { name: "Manual payment recording", subtitle: "Track cash / cheque" },
  ]},
  { title: "TRUST ACCOUNTING", items: [
    { name: "Client trust ledgers" },
    { name: "Basic trust deposits & disbursements" },
  ]},
  { title: "REPORTING", items: [
    { name: "Basic accounts receivable report" },
    { name: "Billing history view" },
  ]},
];

const ADVANCED_FEATURES: FeatureSection[] = [
  { title: "AUTOMATION", items: [
    { name: "Bulk / batch billing", subtitle: "Multiple matters at once" },
    { name: "Automated bill generation (AI)", subtitle: "Scheduled billing cycles" },
    { name: "AI expense capture", subtitle: "Receipt scanning & auto-fill" },
  ]},
  { title: "PAYMENTS", items: [
    { name: "Online payments", subtitle: "Card, ACH, Apple/Google Pay" },
    { name: "Payment plans", subtitle: "Auto-deduct installments" },
    { name: "Stored payment methods" },
  ]},
  { title: "ADVANCED INVOICING", items: [
    { name: "Multi-matter billing", subtitle: "Combine matters for one client" },
    { name: "Split billing", subtitle: "Multiple payers per matter" },
    { name: "Bill themes & branding", subtitle: "Firm logo, custom templates" },
    { name: "Contingency fee billing" },
    { name: "Multi-currency support" },
    { name: "Interest & late fee accrual" },
  ]},
  { title: "REPORTING & WORKFLOWS", items: [
    { name: "Full billing report suite", subtitle: "WIP, collections, revenue" },
    { name: "Bill approval workflows" },
    { name: "SMS bill delivery" },
  ]},
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function FeatureColumn({ sections, dotColor }: { sections: FeatureSection[]; dotColor: string }) {
  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <div key={section.title}>
          <p className="text-[10px] uppercase tracking-widest font-semibold mb-2.5 text-muted-foreground">{section.title}</p>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div key={item.name} className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: dotColor }} />
                <div>
                  <p className="text-[13px] font-medium text-foreground">{item.name}</p>
                  {item.subtitle && <p className="text-[11px] text-muted-foreground/60">{item.subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const LOAD_BATCH = 12;

export function FundsInPage() {
  const [statusFilter, setStatusFilter] = React.useState<"all" | InvoiceStatus>("all");
  const [search, setSearch] = React.useState("");
  const [compareOpen, setCompareOpen] = React.useState(false);
  const [visibleCount, setVisibleCount] = React.useState(LOAD_BATCH);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const filtered = INVOICES.filter((inv) => {
    if (statusFilter !== "all" && inv.status !== statusFilter) return false;
    if (search && !inv.client.toLowerCase().includes(search.toLowerCase()) && !inv.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const visibleInvoices = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  React.useEffect(() => {
    setVisibleCount(LOAD_BATCH);
  }, [statusFilter, search]);

  React.useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + LOAD_BATCH, filtered.length));
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered.length]);

  const isDraftEmpty = statusFilter === "draft" && filtered.length === 0;

  const tabs: { key: "all" | InvoiceStatus; label: string; count: number }[] = [
    { key: "all",     label: "All",     count: INVOICES.length },
    { key: "draft",   label: "Draft",   count: 0 },
    { key: "sent",    label: "Sent",    count: INVOICES.filter(i => i.status === "sent").length },
    { key: "paid",    label: "Paid",    count: INVOICES.filter(i => i.status === "paid").length },
    { key: "overdue", label: "Overdue", count: INVOICES.filter(i => i.status === "overdue").length },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-6 flex-shrink-0" style={{ backgroundColor: "#F7F5F5" }}>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Billings</h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-foreground hover:bg-foreground/90 transition-all shadow-sm">
          <Plus className="w-4 h-4" />
            Create Bill
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-24">

        {/* PLG Activation Banner */}
        <div className="rounded-xl p-5 mb-6 flex items-center justify-between" style={{ background: "linear-gradient(135deg, color-mix(in srgb, #A3DCFF 28%, #ffffff), #F5F3FF)", border: "1px solid #DBEAFE" }}>
          <div className="flex items-center gap-4">
            <img src="/clio-logo.png" alt="Clio" className="h-8 flex-shrink-0 object-contain" />
            <div>
              <p className="text-[14px] font-semibold text-foreground">Unlock the complete billing suite</p>
              <p className="text-[13px] text-muted-foreground mt-0.5">Professional bill templates, a dedicated client payment portal, and flexible options like payment plans and online payments. Available with Clio Manage.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setCompareOpen(true)}
              className="text-[13px] font-medium text-primary hover:text-primary transition-colors"
            >
              Compare features
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 transition-all shadow-sm">
              Start free trial
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60 mb-2">Revenue Collected</p>
            <p className="text-2xl font-bold text-foreground">$87,420</p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-[12px] font-medium text-emerald-600">+12% vs last month</span>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60 mb-2">Outstanding AR</p>
            <p className="text-2xl font-bold text-foreground">$34,150</p>
            <p className="text-[12px] text-muted-foreground mt-1">8 invoices</p>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60 mb-2">Overdue</p>
            <p className="text-2xl font-bold text-foreground">$12,800</p>
            <p className="text-[12px] text-red-500 font-medium mt-1">3 invoices past due</p>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60 mb-2">Trust Deposits</p>
            <p className="text-2xl font-bold text-foreground">$28,500</p>
            <p className="text-[12px] text-muted-foreground mt-1">6 deposits this month</p>
          </div>
        </div>

        {/* Invoice List */}
        <div className="bg-card rounded-xl overflow-hidden mb-6 border border-border shadow-sm">
          {/* Toolbar */}
          <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-1.5">
              {tabs.map((tab) => {
                const isActive = statusFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] transition-all"
                    style={{
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#17181C" : "#64748B",
                      backgroundColor: isActive ? "#F1F5F9" : "transparent",
                      border: isActive ? "1px solid #CBD5E1" : "1px solid transparent",
                    }}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span
                        className="text-[11px] px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: isActive ? "#E2E8F0" : "#F1F5F9",
                          color: isActive ? "#475569" : "#94A3B8",
                          fontWeight: 600,
                        }}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {!isDraftEmpty && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#F7F5F5", border: "1px solid var(--border)" }}>
                <Search className="w-3.5 h-3.5 text-muted-foreground/60" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search invoices…"
                  className="bg-transparent outline-none text-[13px] w-40"
                  style={{ color: "var(--foreground)" }}
                />
              </div>
            )}
          </div>

          {isDraftEmpty ? (
            <div className="px-8 py-14 text-center">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <ClipboardEdit className="w-6 h-6 text-primary/70" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Bill drafting & approval workflows</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                Create bill drafts, route them for partner approval, and send directly to clients — available in Clio Manage.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setCompareOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-foreground/80 hover:bg-background transition-all"
                  style={{ border: "1px solid var(--border)" }}
                >
                  Compare features
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 transition-all shadow-sm">
                  Start free trial
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Invoice</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Client</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Matter</th>
                    <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Amount</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Issued</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Due</th>
                    <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide font-semibold text-muted-foreground/60">Status</th>
                    <th className="px-4 py-3 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleInvoices.map((inv) => {
                    const cfg = STATUS_CONFIG[inv.status];
                    return (
                      <tr key={inv.id} className="hover:bg-background transition-colors cursor-pointer" style={{ borderBottom: "1px solid #F7F5F5" }}>
                        <td className="px-5 py-3 text-[13px] font-medium text-primary">{inv.id}</td>
                        <td className="px-4 py-3 text-[13px] font-medium text-foreground">{inv.client}</td>
                        <td className="px-4 py-3 text-[13px] text-muted-foreground truncate max-w-[180px]">{inv.matter}</td>
                        <td className="px-4 py-3 text-[13px] font-semibold text-foreground text-right tabular-nums">{fmt(inv.amount)}</td>
                        <td className="px-4 py-3 text-[13px] text-muted-foreground">{inv.dateIssued}</td>
                        <td className="px-4 py-3 text-[13px] text-muted-foreground">{inv.dueDate}</td>
                        <td className="px-4 py-3">
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{ backgroundColor: cfg.bg, color: cfg.text }}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                        </td>
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
                  <span className="text-[12px] text-muted-foreground/40">All {filtered.length} invoices loaded</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Feature Comparison Modal */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto p-0 gap-0">
          <DialogTitle className="sr-only">Billing Plan Comparison</DialogTitle>
          <div className="px-6 pt-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <h2 className="text-lg font-semibold text-foreground">Compare Billing Features</h2>
          </div>

          <div className="grid grid-cols-2 gap-5 p-6">
            {/* Core billing card */}
            <div className="rounded-xl overflow-hidden border border-border shadow-sm">
              <div className="px-6 pt-6 pb-4 text-center" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold mb-3" style={{ backgroundColor: "#F0FDF4", color: "#16A34A" }}>
                  Included
                </span>
                <h3 className="text-xl font-semibold text-foreground">Core billing</h3>
                <p className="text-sm text-muted-foreground/60 mt-1">Included with Clio Accounting</p>
              </div>
              <div className="px-6 py-5">
                <FeatureColumn sections={CORE_FEATURES} dotColor="#16A34A" />
              </div>
            </div>

            {/* Advanced billing card — highlighted */}
            <div className="rounded-xl overflow-hidden relative" style={{ border: "2px solid #0070E0", boxShadow: "0 4px 16px rgba(59,130,246,0.12)" }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: "linear-gradient(90deg, #0070E0, #6366F1)" }} />
              <div className="px-6 pt-6 pb-4 text-center" style={{ borderBottom: "1px solid var(--border)" }}>
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold mb-3" style={{ backgroundColor: "color-mix(in srgb, #A3DCFF 28%, #ffffff)", color: "#0070E0" }}>
                  Recommended
                </span>
                <h3 className="text-xl font-semibold text-foreground">Advanced billing</h3>
                <p className="text-sm text-muted-foreground/60 mt-1">Available with Clio Manage</p>
              </div>
              <div className="px-6 py-5">
                <FeatureColumn sections={ADVANCED_FEATURES} dotColor="#0070E0" />
              </div>
              <div className="px-6 pb-6">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-primary hover:bg-primary/90 transition-all shadow-sm">
                  Start free trial
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
