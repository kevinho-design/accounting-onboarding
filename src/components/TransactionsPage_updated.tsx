"use client";

import * as React from "react";
import {
  Search,
  User,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Flag,
  MoreHorizontal,
  Edit,
  Download,
  X,
  Zap,
  DollarSign,
  Shield,
  Phone,
  MapPin,
  Building,
  ExternalLink,
  Filter,
  Calendar,
  ArrowUpDown,
  Eye,
  ChevronDown,
  Check,
  Circle,

  Brain,
  Target,
  PiggyBank,
  BarChart3,
  Lightbulb,
  Clock,
  Info,
  Edit2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { cn } from "./ui/utils";

// Mock data for transactions
const mockTransactions = [
  {
    id: "1",
    source: "Clio Manage",
    date: "2024-12-15",
    description: "Client payment - Smith vs. Jones",
    category: "Operating",
    amount: 2500.00,
    status: "matched",
    type: "income",
  },
  {
    id: "2",
    source: "Bank of America",
    date: "2024-12-15",
    description: "Office rent payment",
    category: "Expenses",
    amount: -3200.00,
    status: "needs_attention",
    type: "expense",
  },
  {
    id: "3",
    source: "QuickBooks Online",
    date: "2024-12-14",
    description: "Software subscription",
    category: "Operating",
    amount: -149.99,
    status: "matched",
    type: "expense",
  },
  {
    id: "4",
    source: "Clio Trust",
    date: "2024-12-14",
    description: "Trust account deposit - Johnson case",
    category: "Trust",
    amount: 5000.00,
    status: "needs_attention",
    type: "income",
  },
  {
    id: "5",
    source: "Bank of America",
    date: "2024-12-13",
    description: "Court filing fee",
    category: "Case Expenses",
    amount: -425.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "6",
    source: "PayPal",
    date: "2024-12-13",
    description: "Online consultation fee",
    category: "Operating",
    amount: 350.00,
    status: "matched",
    type: "income",
  },
  {
    id: "7",
    source: "Clio Manage",
    date: "2024-12-12",
    description: "Retainer payment - Davis Estate",
    category: "Operating",
    amount: 4200.00,
    status: "matched",
    type: "income",
  },
  {
    id: "8",
    source: "Stripe",
    date: "2024-12-12",
    description: "Credit card payment - Wilson case",
    category: "Operating",
    amount: 1850.00,
    status: "matched",
    type: "income",
  },
  {
    id: "9",
    source: "Bank of America",
    date: "2024-12-11",
    description: "Professional liability insurance",
    category: "Expenses",
    amount: -675.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "10",
    source: "Verizon Business",
    date: "2024-12-11",
    description: "Monthly phone service",
    category: "Operating",
    amount: -89.99,
    status: "matched",
    type: "expense",
  },
  {
    id: "11",
    source: "Clio Trust",
    date: "2024-12-10",
    description: "Trust transfer to operating - Martinez case",
    category: "Trust",
    amount: -2500.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "12",
    source: "Chase Business",
    date: "2024-12-10",
    description: "Wire transfer fee",
    category: "Expenses",
    amount: -25.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "13",
    source: "LexisNexis",
    date: "2024-12-09",
    description: "Legal research subscription",
    category: "Operating",
    amount: -295.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "14",
    source: "Clio Manage",
    date: "2024-12-09",
    description: "Hourly billing - Thompson litigation",
    category: "Operating",
    amount: 3750.00,
    status: "matched",
    type: "income",
  },
  {
    id: "15",
    source: "Microsoft",
    date: "2024-12-08",
    description: "Office 365 Business Premium",
    category: "Operating",
    amount: -22.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "16",
    source: "Bank of America",
    date: "2024-12-08",
    description: "Office supplies - Staples",
    category: "Expenses",
    amount: -156.42,
    status: "matched",
    type: "expense",
  },
  {
    id: "17",
    source: "PayPal",
    date: "2024-12-07",
    description: "Document review payment",
    category: "Operating",
    amount: 850.00,
    status: "matched",
    type: "income",
  },
  {
    id: "18",
    source: "Clio Trust",
    date: "2024-12-07",
    description: "Initial deposit - Anderson divorce",
    category: "Trust",
    amount: 3500.00,
    status: "needs_attention",
    type: "income",
  },
  {
    id: "19",
    source: "Bank of America",
    date: "2024-12-06",
    description: "Parking meter violation",
    category: "Expenses",
    amount: -75.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "20",
    source: "Zoom",
    date: "2024-12-06",
    description: "Video conferencing pro plan",
    category: "Operating",
    amount: -14.99,
    status: "matched",
    type: "expense",
  },
  {
    id: "21",
    source: "Clio Manage",
    date: "2024-12-05",
    description: "Settlement payment - Brown case",
    category: "Operating",
    amount: 8500.00,
    status: "matched",
    type: "income",
  },
  {
    id: "22",
    source: "Bank of America",
    date: "2024-12-05",
    description: "Court reporter services",
    category: "Case Expenses",
    amount: -450.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "23",
    source: "QuickBooks Online",
    date: "2024-12-04",
    description: "Payroll processing fee",
    category: "Operating",
    amount: -65.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "24",
    source: "Westlaw",
    date: "2024-12-04",
    description: "Legal database access",
    category: "Operating",
    amount: -425.00,
    status: "matched",
    type: "expense",
  },
  {
    id: "25",
    source: "Chase Business",
    date: "2024-12-03",
    description: "Business checking monthly fee",
    category: "Expenses",
    amount: -12.00,
    status: "matched",
    type: "expense",
  },
];

const mockFlaggedItems = [
  "Trust account balance discrepancy in Johnson case",
  "Missing IOLTA quarterly report submission",
  "Unreconciled bank transaction from 12/10",
  "Client funds held beyond 60-day requirement",
];

// Available categories for selection
const transactionCategories = [
  "Operating",
  "Expenses",
  "Trust",
  "Case Expenses",
  "Professional Services",
  "Marketing",
  "Insurance",
  "Software",
  "Office Supplies",
  "Travel",
  "Utilities"
];

// AI Insights data
const aiInsights = [
  {
    id: "1",
    type: "trend",
    title: "Office Expenses Trending Up",
    description: "Office supply costs have increased 15% this month compared to last month average",
    impact: "medium",
    action: "Consider bulk purchasing to reduce per-unit costs",
    icon: TrendingUp,
  },
  {
    id: "2", 
    type: "optimization",
    title: "Subscription Consolidation Opportunity",
    description: "You have 3 similar software subscriptions that could be consolidated",
    impact: "high",
    action: "Potential savings of $180/month identified",
    icon: Target,
  },
  {
    id: "3",
    type: "compliance",
    title: "Trust Account Activity",
    description: "All trust account transactions are properly categorized and compliant",
    impact: "positive",
    action: "Maintaining excellent compliance standards",
    icon: Shield,
  },
  {
    id: "4",
    type: "pattern",
    title: "Revenue Growth Pattern",
    description: "Client payments show 8% growth compared to same period last year",
    impact: "positive", 
    action: "Strong performance indicates healthy practice growth",
    icon: BarChart3,
  }
];

export function TransactionsPage() {
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(null);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilters, setStatusFilters] = React.useState<string[]>(["matched", "needs_attention"]);
  const [editingTransactionId, setEditingTransactionId] = React.useState<string | null>(null);
  const [editingField, setEditingField] = React.useState<string | null>(null);
  const [editValues, setEditValues] = React.useState<{[key: string]: any}>({});
  const [transactions, setTransactions] = React.useState(mockTransactions);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = React.useState(false);


  const selectedTransaction = transactions.find(t => t.id === selectedTransactionId);

  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by search query
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilters.includes(transaction.status);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // First sort by status: needs_attention comes before matched
      if (a.status !== b.status) {
        if (a.status === "needs_attention") return -1;
        if (b.status === "needs_attention") return 1;
      }
      
      // Then sort by date (most recent first) within the same status
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const fundsIn = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const fundsOut = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netMovement = fundsIn - fundsOut;

  const totalTransactions = transactions.length;
  const automatedTransactions = transactions.filter(t => t.status === "matched").length;
  const automationPercentage = Math.round((automatedTransactions / totalTransactions) * 100);

  const needsAttentionCount = transactions.filter(t => t.status === "needs_attention").length;

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilters(prev => [...prev, status]);
    } else {
      setStatusFilters(prev => prev.filter(s => s !== status));
    }
  };



  const handleEditStart = (transactionId: string, field: string, currentValue: any) => {
    setEditingTransactionId(transactionId);
    setEditingField(field);
    setEditValues({ [field]: currentValue });
  };

  const handleEditCancel = () => {
    setEditingTransactionId(null);
    setEditingField(null);
    setEditValues({});
  };

  const handleEditSave = () => {
    if (editingTransactionId && editingField) {
      setTransactions(prev => 
        prev.map(transaction => 
          transaction.id === editingTransactionId 
            ? { ...transaction, [editingField]: editValues[editingField] }
            : transaction
        )
      );
      handleEditCancel();
    }
  };

  const handleEditValueChange = (field: string, value: any) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleTransactionStatus = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === transactionId 
          ? { 
              ...transaction, 
              status: transaction.status === "matched" ? "needs_attention" : "matched" 
            }
          : transaction
      )
    );
  };

  return (
    <div className="flex h-full w-full min-w-[1440px] bg-gray-50">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-5 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <span className="text-sm font-semibold text-primary-foreground">T</span>
              </div>
              <span className="font-semibold text-foreground">Transactions</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions, sources, categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main Content - Two Column Layout */}
        <div className="flex-1 flex gap-6 p-5 overflow-hidden">
          {/* Left Column - Compact Sections */}
          <div className="w-80 flex flex-col space-y-4 overflow-y-auto">
            {/* Overview Cards */}
            <section className="space-y-3">
              {/* Funds In/Out Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Net Funds Movement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xl font-semibold",
                      netMovement >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      ${Math.abs(netMovement).toLocaleString()}
                    </span>
                    {netMovement >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                </CardContent>
              </Card>

              {/* Automation Card */}
              <Card 
                className="border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setIsAutomationModalOpen(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Automated</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold">{automationPercentage}%</span>
                      <Badge variant="secondary" className="text-xs">
                        {automatedTransactions}/{totalTransactions}
                      </Badge>
                    </div>
                    <Progress value={automationPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </section>



            {/* AI Insights Section */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium">Finance Insights</h3>
                <Badge variant="secondary" className="text-xs">AI</Badge>
              </div>
              
              <div className="space-y-3">
                {aiInsights.map((insight) => (
                  <Card key={insight.id} className="border border-gray-200 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0",
                          insight.impact === "positive" && "bg-green-100",
                          insight.impact === "medium" && "bg-yellow-100", 
                          insight.impact === "high" && "bg-blue-100"
                        )}>
                          <insight.icon className={cn(
                            "h-3 w-3",
                            insight.impact === "positive" && "text-green-600",
                            insight.impact === "medium" && "text-yellow-600",
                            insight.impact === "high" && "text-blue-600"
                          )} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                          <p className="text-xs text-muted-foreground mb-1">{insight.description}</p>
                          <p className="text-xs text-blue-600 font-medium">{insight.action}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - All Transactions Table */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* New Transactions Notification */}
            <Card className="border border-blue-200 bg-blue-50 shadow-sm mb-4">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Info className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-sm text-blue-900">New Transactions Available</h4>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                        23 new
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-700 mb-3">
                      We found 23 new transactions, but 4 of them need your attention because we couldn't automatically categorize them.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Edit2 className="h-3 w-3 mr-1" />
                        Categorize Manually
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-100">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Guidance
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">All Transactions</h2>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56" align="end">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Filter by Status</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="needs_attention"
                              checked={statusFilters.includes("needs_attention")}
                              onCheckedChange={(checked) => 
                                handleStatusFilterChange("needs_attention", checked as boolean)
                              }
                            />
                            <label
                              htmlFor="needs_attention"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3 text-orange-500" />
                              Needs Attention
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="matched"
                              checked={statusFilters.includes("matched")}
                              onCheckedChange={(checked) => 
                                handleStatusFilterChange("matched", checked as boolean)
                              }
                            />
                            <label
                              htmlFor="matched"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Matched
                            </label>
                          </div>
                        </div>
                      </div>
                      {statusFilters.length === 0 && (
                        <div className="text-xs text-muted-foreground text-center py-2">
                          Select at least one status to view transactions
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <Card className="border border-gray-200 shadow-sm flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Source</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className={cn(
                          "hover:bg-gray-50 transition-colors",
                          transaction.status === "needs_attention" && "bg-orange-50 hover:bg-orange-100"
                        )}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {transaction.source.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm">{transaction.source}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <time className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </time>
                        </td>
                        <td className="p-3">
                          <span className="text-sm truncate max-w-60 block">{transaction.description}</span>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <span className={cn(
                            "font-medium text-sm",
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          )}>
                            {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            {transaction.status === "matched" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleToggleTransactionStatus(transaction.id)}
                          >
                            {transaction.status === "matched" ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

      </div>

      {/* Automation Modal */}
      <Dialog open={isAutomationModalOpen} onOpenChange={setIsAutomationModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Transaction Automation Details
            </DialogTitle>
            <DialogDescription>
              AI-powered categorization and matching for your financial transactions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Automation Progress</h4>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  {automationPercentage}% Complete
                </Badge>
              </div>
              <Progress value={automationPercentage} className="mb-2" />
              <p className="text-sm text-muted-foreground">
                {automatedTransactions} out of {totalTransactions} transactions have been automatically processed
              </p>
            </div>

            {/* Categorization Rules */}
            <div>
              <h4 className="font-medium mb-3">Active Automation Rules</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bank Fee Detection</p>
                    <p className="text-xs text-muted-foreground">Automatically categorizes bank fees and charges</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Client Payment Matching</p>
                    <p className="text-xs text-muted-foreground">Matches payments to client matters</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Subscription Recognition</p>
                    <p className="text-xs text-muted-foreground">Identifies recurring software subscriptions</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h4 className="font-medium mb-3">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Accuracy Rate</span>
                  </div>
                  <p className="text-2xl font-semibold text-green-600">94.2%</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Time Saved</span>
                  </div>
                  <p className="text-2xl font-semibold text-blue-600">4.5 hrs</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}