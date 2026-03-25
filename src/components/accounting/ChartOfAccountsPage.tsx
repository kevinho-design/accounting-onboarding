import * as React from "react";
import { Plus, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface Account {
  number: string;
  name: string;
  type: string;
  balance: number;
  description?: string;
}

interface AccountCategory {
  type: string;
  accounts: Account[];
}

export function ChartOfAccountsPage() {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(["Assets", "Revenue", "Expenses"])
  );
  const [searchQuery, setSearchQuery] = React.useState("");

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Chart of Accounts migrated from QuickBooks Online
  const chartOfAccounts: AccountCategory[] = [
    {
      type: "Assets",
      accounts: [
        { number: "1000", name: "Operating Account", type: "Bank", balance: 127543.89 },
        { number: "1010", name: "Trust Account - IOLTA", type: "Bank", balance: 384920.50 },
        { number: "1020", name: "Payroll Account", type: "Bank", balance: 45230.00 },
        { number: "1100", name: "Accounts Receivable", type: "Accounts Receivable", balance: 234567.23 },
        { number: "1200", name: "Prepaid Expenses", type: "Other Current Asset", balance: 12400.00 },
        { number: "1210", name: "Prepaid Insurance", type: "Other Current Asset", balance: 8900.00 },
        { number: "1500", name: "Office Equipment", type: "Fixed Asset", balance: 45600.00 },
        { number: "1510", name: "Furniture & Fixtures", type: "Fixed Asset", balance: 28900.00 },
        { number: "1520", name: "Computer Equipment", type: "Fixed Asset", balance: 34200.00 },
        { number: "1530", name: "Accumulated Depreciation", type: "Fixed Asset", balance: -23450.00 },
      ]
    },
    {
      type: "Liabilities",
      accounts: [
        { number: "2000", name: "Accounts Payable", type: "Accounts Payable", balance: 34567.80 },
        { number: "2100", name: "Credit Card - American Express", type: "Credit Card", balance: 8923.45 },
        { number: "2110", name: "Credit Card - Visa Business", type: "Credit Card", balance: 4532.10 },
        { number: "2200", name: "Payroll Liabilities", type: "Other Current Liability", balance: 15678.90 },
        { number: "2210", name: "Sales Tax Payable", type: "Other Current Liability", balance: 0.00 },
        { number: "2300", name: "Client Trust Liability", type: "Other Current Liability", balance: 384920.50 },
        { number: "2400", name: "Line of Credit", type: "Long Term Liability", balance: 50000.00 },
      ]
    },
    {
      type: "Equity",
      accounts: [
        { number: "3000", name: "Owner's Capital", type: "Equity", balance: 350000.00 },
        { number: "3100", name: "Retained Earnings", type: "Equity", balance: 425678.34 },
        { number: "3900", name: "Current Year Earnings", type: "Equity", balance: 187234.56 },
      ]
    },
    {
      type: "Revenue",
      accounts: [
        { number: "4000", name: "Legal Fees - Litigation", type: "Income", balance: 543200.00 },
        { number: "4010", name: "Legal Fees - Corporate", type: "Income", balance: 234500.00 },
        { number: "4020", name: "Legal Fees - Real Estate", type: "Income", balance: 189300.00 },
        { number: "4030", name: "Legal Fees - Estate Planning", type: "Income", balance: 98700.00 },
        { number: "4100", name: "Consultation Fees", type: "Income", balance: 45600.00 },
        { number: "4200", name: "Retainer Fees", type: "Income", balance: 156000.00 },
        { number: "4900", name: "Other Income", type: "Other Income", balance: 8900.00 },
      ]
    },
    {
      type: "Expenses",
      accounts: [
        { number: "5000", name: "Salaries & Wages - Attorneys", type: "Expense", balance: 456000.00 },
        { number: "5010", name: "Salaries & Wages - Paralegals", type: "Expense", balance: 189000.00 },
        { number: "5020", name: "Salaries & Wages - Staff", type: "Expense", balance: 98700.00 },
        { number: "5100", name: "Payroll Taxes", type: "Expense", balance: 67800.00 },
        { number: "5110", name: "Employee Benefits", type: "Expense", balance: 45600.00 },
        { number: "5200", name: "Office Rent", type: "Expense", balance: 84000.00 },
        { number: "5210", name: "Utilities", type: "Expense", balance: 12400.00 },
        { number: "5220", name: "Office Supplies", type: "Expense", balance: 8900.00 },
        { number: "5230", name: "Equipment & Technology", type: "Expense", balance: 23400.00 },
        { number: "5300", name: "Professional Development", type: "Expense", balance: 15600.00 },
        { number: "5310", name: "Legal Research (Westlaw, Lexis)", type: "Expense", balance: 28900.00 },
        { number: "5320", name: "Bar Dues & Licenses", type: "Expense", balance: 4500.00 },
        { number: "5400", name: "Professional Liability Insurance", type: "Expense", balance: 34200.00 },
        { number: "5410", name: "General Business Insurance", type: "Expense", balance: 8900.00 },
        { number: "5500", name: "Client Costs - Recoverable", type: "Expense", balance: 12300.00 },
        { number: "5510", name: "Client Costs - Non-Recoverable", type: "Expense", balance: 3400.00 },
        { number: "5600", name: "Marketing & Advertising", type: "Expense", balance: 18900.00 },
        { number: "5700", name: "Bank Service Charges", type: "Expense", balance: 1200.00 },
        { number: "5710", name: "Credit Card Processing Fees", type: "Expense", balance: 4500.00 },
        { number: "5800", name: "Depreciation Expense", type: "Expense", balance: 11700.00 },
        { number: "5900", name: "Operating Expenses", type: "Expense", balance: 6700.00 },
      ]
    },
  ];

  // Filter accounts based on search
  const filteredAccounts = chartOfAccounts.map(category => ({
    ...category,
    accounts: category.accounts.filter(account => 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.number.includes(searchQuery) ||
      account.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.accounts.length > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const getCategoryTotal = (accounts: Account[]) => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FAFBFF' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Chart of Accounts</h1>
              <p className="text-gray-600">
                Migrated from QuickBooks Online • Optimized for law firm accounting
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredAccounts.map((category) => {
            const isExpanded = expandedCategories.has(category.type);
            const categoryTotal = getCategoryTotal(category.accounts);

            return (
              <div key={category.type} className="border-b border-gray-200 last:border-b-0">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.type)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">{category.type}</h3>
                    <span className="text-sm text-gray-500">
                      ({category.accounts.length} account{category.accounts.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(categoryTotal)}
                  </div>
                </button>

                {/* Account Rows */}
                {isExpanded && (
                  <div>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-t border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <div className="col-span-2">Account #</div>
                      <div className="col-span-5">Account Name</div>
                      <div className="col-span-3">Type</div>
                      <div className="col-span-2 text-right">Balance</div>
                    </div>

                    {/* Account Items */}
                    {category.accounts.map((account) => (
                      <div
                        key={account.number}
                        className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="col-span-2 text-sm font-mono text-gray-900">
                          {account.number}
                        </div>
                        <div className="col-span-5 text-sm font-medium text-gray-900">
                          {account.name}
                        </div>
                        <div className="col-span-3 text-sm text-gray-600">
                          {account.type}
                        </div>
                        <div className="col-span-2 text-sm text-right font-medium text-gray-900">
                          {account.balance < 0 && '('}
                          {formatCurrency(account.balance)}
                          {account.balance < 0 && ')'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Assets</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatCurrency(getCategoryTotal(chartOfAccounts[0].accounts))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Revenue (YTD)</div>
            <div className="text-2xl font-semibold text-green-600">
              {formatCurrency(getCategoryTotal(chartOfAccounts[3].accounts))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-600 mb-1">Total Expenses (YTD)</div>
            <div className="text-2xl font-semibold text-gray-900">
              {formatCurrency(getCategoryTotal(chartOfAccounts[4].accounts))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
