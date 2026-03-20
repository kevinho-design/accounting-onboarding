// This file has been merged into InboxPage.tsx and is no longer needed

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

// Mock data for the inbox
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

export function InboxPage() {
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

  const handleConfirmTransaction = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === transactionId 
          ? { ...transaction, status: "matched" }
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
                <span className="text-sm font-semibold text-primary-foreground">C</span>
              </div>
              <span className="font-semibold text-foreground">Clio Financial Inbox</span>
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

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Insights Cards */}
            <section id="insights" className="p-5 bg-white border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                {/* Funds In/Out Card */}
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      Net Funds Movement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-2xl font-semibold",
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
                    <p className="text-xs text-muted-foreground mt-1">
                      Last 7 days
                    </p>
                  </CardContent>
                </Card>

                {/* Automation Card */}
                <Card 
                  className="border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setIsAutomationModalOpen(true)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Zap className="h-4 w-4" />
                      Transactions Automated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-semibold">{automationPercentage}%</span>
                        <Badge variant="secondary" className="text-xs">
                          {automatedTransactions}/{totalTransactions}
                        </Badge>
                      </div>
                      <Progress value={automationPercentage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Compliance Card */}
                <Card 
                  className="border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setIsComplianceModalOpen(true)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      State Bar Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {needsAttentionCount > 0 ? (
                          <>
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium text-orange-600">
                              Attention Needed
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm font-medium text-green-600">
                              Compliant
                            </span>
                          </>
                        )}
                      </div>
                      {needsAttentionCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {needsAttentionCount}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Data Table */}
            <section id="inbox-table" className="flex-1 p-5 overflow-hidden">
              <div className="h-full bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Recent Transactions</h2>
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
                </div>
                
                <div className="overflow-auto h-full">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                            Source
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </Button>
                        </th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">
                          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                            Date
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </Button>
                        </th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Description</th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Category</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">
                          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                            Amount
                            <ArrowUpDown className="h-3 w-3 ml-1" />
                          </Button>
                        </th>
                        <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-right p-3 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className={cn(
                            "clickable cursor-pointer hover:bg-gray-50 transition-colors min-h-[24px]",
                            transaction.status === "needs_attention" && "bg-orange-50 hover:bg-orange-100"
                          )}
                          onClick={() => setSelectedTransactionId(transaction.id)}
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
                            {editingTransactionId === transaction.id && editingField === "date" ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="date"
                                  value={editValues.date || transaction.date}
                                  onChange={(e) => handleEditValueChange("date", e.target.value)}
                                  className="w-32 text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSave();
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCancel();
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="flex items-center gap-1 hover:bg-gray-100 rounded px-1 py-0.5 cursor-pointer group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStart(transaction.id, "date", transaction.date);
                                }}
                              >
                                <time className="text-sm text-muted-foreground">
                                  {new Date(transaction.date).toLocaleDateString()}
                                </time>
                                <Edit className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {editingTransactionId === transaction.id && editingField === "description" ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editValues.description || transaction.description}
                                  onChange={(e) => handleEditValueChange("description", e.target.value)}
                                  className="w-48 text-sm"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSave();
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCancel();
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="flex items-center gap-1 hover:bg-gray-100 rounded px-1 py-0.5 cursor-pointer group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStart(transaction.id, "description", transaction.description);
                                }}
                              >
                                <span className="text-sm">{transaction.description}</span>
                                <Edit className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {editingTransactionId === transaction.id && editingField === "category" ? (
                              <div className="flex items-center gap-2">
                                <Select
                                  value={editValues.category || transaction.category}
                                  onValueChange={(value) => handleEditValueChange("category", value)}
                                >
                                  <SelectTrigger className="w-32 text-sm" onClick={(e) => e.stopPropagation()}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {transactionCategories.map((category) => (
                                      <SelectItem key={category} value={category}>
                                        {category}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSave();
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCancel();
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="flex items-center gap-1 hover:bg-gray-100 rounded px-1 py-0.5 cursor-pointer group"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStart(transaction.id, "category", transaction.category);
                                }}
                              >
                                <Badge variant="outline" className="text-xs">
                                  {transaction.category}
                                </Badge>
                                <Edit className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            {editingTransactionId === transaction.id && editingField === "amount" ? (
                              <div className="flex items-center gap-2 justify-end">
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editValues.amount || Math.abs(transaction.amount)}
                                  onChange={(e) => handleEditValueChange("amount", transaction.type === "expense" ? -Math.abs(parseFloat(e.target.value)) : Math.abs(parseFloat(e.target.value)))}
                                  className="w-24 text-sm text-right"
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSave();
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Check className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCancel();
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            ) : (
                              <div 
                                className="flex items-center gap-1 hover:bg-gray-100 rounded px-1 py-0.5 cursor-pointer group justify-end"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStart(transaction.id, "amount", transaction.amount);
                                }}
                              >
                                <span className={cn(
                                  "text-sm font-medium",
                                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                                )}>
                                  {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                                </span>
                                <Edit className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {transaction.status === "matched" ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm text-green-600">Matched</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm text-orange-600">Needs Attention</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {transaction.status === "needs_attention" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 hover:bg-green-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleConfirmTransaction(transaction.id);
                                  }}
                                  title="Confirm transaction"
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add view logic here
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Add more actions logic here
                                }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>

          {/* Right Panel - Transaction Details */}
          {selectedTransaction && (
            <div className="w-96 border-l border-gray-200 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Transaction Details</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setSelectedTransactionId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Source</label>
                  <p className="text-sm mt-1">{selectedTransaction.source}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-sm mt-1">{new Date(selectedTransaction.date).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-sm mt-1">{selectedTransaction.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-sm mt-1">{selectedTransaction.category}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amount</label>
                  <p className={cn(
                    "text-sm mt-1 font-medium",
                    selectedTransaction.type === "income" ? "text-green-600" : "text-red-600"
                  )}>
                    {selectedTransaction.type === "income" ? "+" : ""}${Math.abs(selectedTransaction.amount).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedTransaction.status === "matched" ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Matched</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-orange-600">Needs Attention</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {selectedTransaction.status === "needs_attention" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button 
                    onClick={() => handleConfirmTransaction(selectedTransaction.id)}
                    className="w-full"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Transaction
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Automation Breakdown Modal */}
        <Dialog open={isAutomationModalOpen} onOpenChange={setIsAutomationModalOpen}>
          <DialogContent className="max-w-4xl max-h-[720px] min-w-[600px] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                How Clio Automates Your Transactions
              </DialogTitle>
              <DialogDescription>
                See how our AI-powered system processes and categorizes {automationPercentage}% of your transactions automatically
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 overflow-y-auto flex-1 pr-2">
              {/* Overview Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-semibold text-blue-600">{automationPercentage}%</div>
                  <div className="text-sm text-blue-600">Automated</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-semibold text-green-600">{automatedTransactions}</div>
                  <div className="text-sm text-green-600">Transactions</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-semibold text-purple-600">2.3s</div>
                  <div className="text-sm text-purple-600">Avg Processing Time</div>
                </div>
              </div>

              {/* Process Flow */}
              <div>
                <h4 className="font-medium mb-3">AI Processing Workflow</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                    <div>
                      <div className="font-medium">Data Ingestion</div>
                      <div className="text-sm text-muted-foreground">Automatically imports transactions from connected sources</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <div>
                      <div className="font-medium">Pattern Recognition</div>
                      <div className="text-sm text-muted-foreground">AI analyzes description patterns and merchant data</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                    <div>
                      <div className="font-medium">Smart Categorization</div>
                      <div className="text-sm text-muted-foreground">Assigns appropriate categories based on legal practice needs</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
                    <div>
                      <div className="font-medium">Compliance Check</div>
                      <div className="text-sm text-muted-foreground">Ensures categorization meets bar association requirements</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automation Rates by Category */}
              <div>
                <h4 className="font-medium mb-3">Automation Rates by Category</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Operating Expenses</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                      </div>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Client Payments</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      <span className="text-sm font-medium">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trust Transactions</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Case Expenses</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Savings */}
              <div>
                <h4 className="font-medium mb-3">Time Savings Impact</h4>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">15 hours saved per week</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Time previously spent on manual transaction categorization
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Based on average law firm processing {totalTransactions} transactions monthly
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Compliance Modal */}
        <Dialog open={isComplianceModalOpen} onOpenChange={setIsComplianceModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Massachusetts State Bar Compliance
              </DialogTitle>
              <DialogDescription>
                Review compliance status and flagged items requiring attention
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="font-medium text-orange-700">Action Required</div>
                    <div className="text-sm text-orange-600">{needsAttentionCount} items need your attention</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Flagged Items</h4>
                <div className="space-y-2">
                  {mockFlaggedItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                      <Flag className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{item}</p>
                      </div>
                      <Button variant="outline" size="sm" className="flex-shrink-0">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsComplianceModalOpen(false)}>
                  Close
                </Button>
                <Button>
                  Generate Compliance Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}