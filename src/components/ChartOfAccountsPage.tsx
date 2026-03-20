"use client";

import * as React from "react";
import {
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Clock,
  FileText,
  Eye,
  ChevronRight,
  Zap,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Split,
  Plus,
  MoreHorizontal,
  Bot,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Checkbox } from "./ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// Mock data for Chart of Accounts - Expanded for scrolling demonstration
const chartOfAccounts = [
  {
    id: "1001",
    name: "Operating Checking",
    type: "Chequing",
    balance: 125480.00,
    reconciled: 85,
    totalTransactions: 127,
    lastReconciled: "2024-06-20",
    isTrust: false,
    status: "in-progress",
    hasIABookkeeper: true
  },
  {
    id: "1002", 
    name: "Client Trust Account",
    type: "Trust",
    balance: 89350.00,
    reconciled: 92,
    totalTransactions: 86,
    lastReconciled: "2024-06-21",
    isTrust: true,
    status: "complete",
    hasIABookkeeper: true
  },
  {
    id: "4001",
    name: "Legal Fees Revenue",
    type: "Operating",
    balance: 345200.00,
    reconciled: 78,
    totalTransactions: 89,
    lastReconciled: "2024-06-19",
    isTrust: false,
    status: "needs-attention",
    hasIABookkeeper: false
  },
  {
    id: "5001",
    name: "Office Rent",
    type: "Expense",
    balance: 8500.00,
    reconciled: 100,
    totalTransactions: 12,
    lastReconciled: "2024-06-22",
    isTrust: false,
    status: "complete",
    hasIABookkeeper: true
  },
  {
    id: "5002",
    name: "Legal Research",
    type: "Hard cost", 
    balance: 2850.00,
    reconciled: 25,
    totalTransactions: 23,
    lastReconciled: "2024-06-18",
    isTrust: false,
    status: "behind",
    hasIABookkeeper: false
  },
  {
    id: "1003",
    name: "IOLTA Trust Account", 
    type: "Trust",
    balance: 156780.00,
    reconciled: 67,
    totalTransactions: 94,
    lastReconciled: "2024-06-20",
    isTrust: true,
    status: "in-progress",
    hasIABookkeeper: true
  },
  {
    id: "1004",
    name: "Savings Account",
    type: "Savings",
    balance: 75000.00,
    reconciled: 95,
    totalTransactions: 24,
    lastReconciled: "2024-06-21",
    isTrust: false,
    status: "complete",
    hasIABookkeeper: true
  },
  {
    id: "5003",
    name: "Office Supplies",
    type: "Expense",
    balance: 1250.00,
    reconciled: 88,
    totalTransactions: 45,
    lastReconciled: "2024-06-19",
    isTrust: false,
    status: "in-progress",
    hasIABookkeeper: false
  },
  {
    id: "5004",
    name: "Marketing & Advertising",
    type: "Expense",
    balance: 3500.00,
    reconciled: 72,
    totalTransactions: 18,
    lastReconciled: "2024-06-18",
    isTrust: false,
    status: "needs-attention",
    hasIABookkeeper: true
  },
  {
    id: "4002",
    name: "Consultation Fees",
    type: "Operating",
    balance: 28750.00,
    reconciled: 91,
    totalTransactions: 67,
    lastReconciled: "2024-06-20",
    isTrust: false,
    status: "complete",
    hasIABookkeeper: true
  },
  {
    id: "5005",
    name: "Professional Development",
    type: "Expense",
    balance: 4200.00,
    reconciled: 100,
    totalTransactions: 8,
    lastReconciled: "2024-06-22",
    isTrust: false,
    status: "complete",
    hasIABookkeeper: false
  },
  {
    id: "1005",
    name: "Petty Cash",
    type: "Cash",
    balance: 500.00,
    reconciled: 60,
    totalTransactions: 15,
    lastReconciled: "2024-06-17",
    isTrust: false,
    status: "behind",
    hasIABookkeeper: false
  },
  {
    id: "5006",
    name: "Technology & Software",
    type: "Expense",
    balance: 12800.00,
    reconciled: 83,
    totalTransactions: 52,
    lastReconciled: "2024-06-19",
    isTrust: false,
    status: "in-progress",
    hasIABookkeeper: true
  },
  {
    id: "4003",
    name: "Court Representation",
    type: "Operating",
    balance: 89200.00,
    reconciled: 76,
    totalTransactions: 134,
    lastReconciled: "2024-06-18",
    isTrust: false,
    status: "needs-attention",
    hasIABookkeeper: true
  },
  {
    id: "5007",
    name: "Insurance",
    type: "Expense",
    balance: 15600.00,
    reconciled: 100,
    totalTransactions: 12,
    lastReconciled: "2024-06-21",
    isTrust: false,
    status: "complete",
    hasIABookkeeper: false
  },
  {
    id: "1006",
    name: "Client Retainer Trust",
    type: "Trust",
    balance: 245000.00,
    reconciled: 89,
    totalTransactions: 178,
    lastReconciled: "2024-06-20",
    isTrust: true,
    status: "in-progress",
    hasIABookkeeper: true
  },
  {
    id: "5008",
    name: "Travel & Entertainment",
    type: "Expense",
    balance: 2200.00,
    reconciled: 65,
    totalTransactions: 28,
    lastReconciled: "2024-06-17",
    isTrust: false,
    status: "behind",
    hasIABookkeeper: false
  },
  {
    id: "4004",
    name: "Document Review Services",
    type: "Operating",
    balance: 34500.00,
    reconciled: 94,
    totalTransactions: 76,
    lastReconciled: "2024-06-21",
    isTrust: false,
    status: "complete",
    hasIABookkeeper: true
  }
];

// Mock transaction data for selected account
const mockTransactions = [
  {
    id: "t001",
    date: "2024-06-22",
    merchant: "Smith & Associates",
    description: "Legal Services - Case consultation and document review",
    source: "Operating Checking (1001)",
    category: "Legal Fees",
    amount: 2500.00,
    type: "credit",
    confidence: "high",
    status: "matched",
    suggestedMatch: "Invoice #INV-2024-089"
  },
  {
    id: "t002", 
    date: "2024-06-21",
    merchant: "Office Supplies Plus",
    description: "Monthly office supplies and legal materials",
    source: "Operating Checking (1001)",
    category: "Office Expenses",
    amount: -156.78,
    type: "debit",
    confidence: "medium",
    status: "review",
    suggestedMatch: "Could be Office Supplies or Legal Materials"
  },
  {
    id: "t003",
    date: "2024-06-21", 
    merchant: "Chase Bank",
    description: "Wire Transfer - Client Settlement Payment",
    source: "Client Trust Account (1002)",
    category: "Trust Transfer",
    amount: -15000.00,
    type: "debit",
    confidence: "low",
    status: "unmatched",
    suggestedMatch: "Requires trust accounting review"
  },
  {
    id: "t004",
    date: "2024-06-20",
    merchant: "Johnson Law Group",
    description: "Referral Fee - Personal injury case referral",
    source: "Operating Checking (1001)",
    category: "Legal Fees",
    amount: 1250.00,
    type: "credit", 
    confidence: "high",
    status: "matched",
    suggestedMatch: "Referral Agreement #REF-2024-12"
  },
  {
    id: "t005",
    date: "2024-06-20",
    merchant: "County Courthouse",
    description: "Filing Fee - Motion to dismiss",
    source: "Operating Checking (1001)",
    category: "Court Costs",
    amount: -285.00,
    type: "debit",
    confidence: "medium",
    status: "review",
    suggestedMatch: "Client reimbursable or firm expense?"
  },
  {
    id: "t006",
    date: "2024-06-19",
    merchant: "Westlaw",
    description: "Legal research subscription - Monthly fee",
    source: "Operating Checking (1001)",
    category: "Legal Research",
    amount: -450.00,
    type: "debit",
    confidence: "high",
    status: "matched",
    suggestedMatch: "Monthly subscription payment"
  },
  {
    id: "t007",
    date: "2024-06-18",
    merchant: "State Bar Association",
    description: "Annual membership dues and CLE credits",
    source: "Operating Checking (1001)",
    category: "Professional Dues",
    amount: -320.00,
    type: "debit",
    confidence: "high",
    status: "matched",
    suggestedMatch: "Annual dues payment"
  },
  {
    id: "t008",
    date: "2024-06-17",
    merchant: "Miller & Associates",
    description: "Expert witness consultation - Medical malpractice case",
    source: "Client Trust Account (1002)",
    category: "Expert Fees",
    amount: -2800.00,
    type: "debit",
    confidence: "medium",
    status: "review",
    suggestedMatch: "Client case expense or firm cost?"
  }
];

export function ChartOfAccountsPage() {
  const [selectedAccount, setSelectedAccount] = React.useState(chartOfAccounts[0]);
  const [filterType, setFilterType] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedTransactions, setSelectedTransactions] = React.useState([]);

  // Calculate overall progress
  const totalAccounts = chartOfAccounts.length;
  const completeAccounts = chartOfAccounts.filter(acc => acc.status === "complete").length;
  const overallProgress = Math.round((completeAccounts / totalAccounts) * 100);
  const daysRemaining = 8; // Days until month end
  const unresolvedItems = chartOfAccounts.reduce((sum, acc) => sum + (acc.totalTransactions - Math.round(acc.totalTransactions * acc.reconciled / 100)), 0);

  // Filter accounts
  const filteredAccounts = chartOfAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || 
                       (filterType === "trust" && account.isTrust) ||
                       (filterType === "operating" && !account.isTrust) ||
                       (filterType === "needs-attention" && account.status === "needs-attention");
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case "complete": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-600" />;
      case "needs-attention": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "behind": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "complete": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "needs-attention": return "bg-orange-100 text-orange-800"; 
      case "behind": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceIcon = (confidence) => {
    switch(confidence) {
      case "high": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case "low": return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get progress bar color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage < 35) {
      return "bg-gray-500"; // Grey for low progress
    } else if (percentage < 75) {
      return "bg-orange-400"; // Light orange for medium progress
    } else if (percentage < 99) {
      return "bg-green-500"; // Green for high progress
    } else {
      return "bg-green-600"; // Darker green for complete
    }
  };

  const handleSelectTransaction = (transactionId, checked) => {
    if (checked) {
      setSelectedTransactions([...selectedTransactions, transactionId]);
    } else {
      setSelectedTransactions(selectedTransactions.filter(id => id !== transactionId));
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedTransactions(mockTransactions.map(t => t.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-3 p-[12px] px-[12px] py-[20px]">
      {/* Month-End Progress Banner - Full Width */}
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Month-End Closing Progress</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{daysRemaining} days remaining</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                <span>{unresolvedItems} unresolved items</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-600">Overall Progress</p>
              <p className="text-2xl font-bold">{overallProgress}%</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Complete Accounts</p>
              <p className="text-2xl font-bold">{completeAccounts}/{totalAccounts}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Need Attention</p>
              <p className="text-2xl font-bold">{chartOfAccounts.filter(acc => acc.status === "needs-attention" || acc.status === "behind").length}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Trust Accounts</p>
              <p className="text-2xl font-bold">{chartOfAccounts.filter(acc => acc.isTrust).length}</p>
            </div>
          </div>
          
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-3 flex-1 min-h-0">
        {/* Left Column - Chart of Accounts */}
        <Card className="flex flex-col min-h-0">
          <CardHeader className="pb-4 flex-shrink-0">
            <CardTitle>Chart of Accounts</CardTitle>
            
            {/* Search and Filter */}
            <div className="space-y-3 pt-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="trust">Trust Accounts</SelectItem>
                  <SelectItem value="operating">Operating Accounts</SelectItem>
                  <SelectItem value="needs-attention">Needs Attention</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 pt-0 min-h-0">
            <ScrollArea className="h-full">
              <div className="space-y-3 pr-4">
                {filteredAccounts.map((account) => (
                  <Card 
                    key={account.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedAccount.id === account.id 
                        ? "border-primary/40 bg-sidebar-accent/30 shadow-sm" 
                        : "hover:shadow-sm hover:border-border/60"
                    }`}
                    onClick={() => setSelectedAccount(account)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[16px] text-[15px]">{account.name}</h4>
                          <p className="text-sm text-gray-600">{account.type} • {account.id}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold text-[16px] text-[15px]">${account.balance.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(account.reconciled)}`}
                              style={{ width: `${account.reconciled}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {account.hasIABookkeeper ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center gap-2 px-2 py-1 rounded text-xs" style={{ color: '#3445FF' }}>
                                      <Bot className="h-3 w-3" style={{ color: '#3445FF' }} />
                                      <span className="font-medium">AI Bookkeeper</span>
                                      <span>
                                        {Math.round(account.totalTransactions * account.reconciled / 100)}/{account.totalTransactions} reconciled
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>AI Bookkeeper enabled - AI assists with reconciliation</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <span className="text-xs text-gray-500">
                                {Math.round(account.totalTransactions * account.reconciled / 100)}/{account.totalTransactions} reconciled
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{account.reconciled}%</span>
                        </div>
                      </div>
                      
                      {/* Trust Badge */}
                      {account.isTrust && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs w-full justify-center">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Trust Account - Special Compliance Required
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Client Trust Account - Special compliance required</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right Column - Selected Account Details */}
        <Card className="flex flex-col col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedAccount.name}</CardTitle>
                <CardDescription>Account {selectedAccount.id} • {selectedAccount.type}</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(selectedAccount.status)}>
                  {selectedAccount.status.replace("-", " ")}
                </Badge>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </div>
            
            {/* Account Summary */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Current Balance</p>
                <p className="text-xl font-bold">${selectedAccount.balance.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Reconciled</p>
                <p className="text-xl font-bold">{selectedAccount.reconciled}%</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-xl font-bold">{selectedAccount.totalTransactions}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">Last Reconciled</p>
                <p className="text-xl font-bold">{new Date(selectedAccount.lastReconciled).toLocaleDateString()}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 pt-0">
            {/* Transactions Section */}
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Transactions</h3>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="matched">Matched</SelectItem>
                      <SelectItem value="review">Needs Review</SelectItem>
                      <SelectItem value="unmatched">Unmatched</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedTransactions.length === mockTransactions.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-24">Date</TableHead>
                      <TableHead className="w-32">Merchant</TableHead>
                      <TableHead className="min-w-0">Description</TableHead>
                      <TableHead className="w-40">Source</TableHead>
                      <TableHead className="w-28 text-right">Amount</TableHead>
                      <TableHead className="w-24">Review</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox 
                            checked={selectedTransactions.includes(transaction.id)}
                            onCheckedChange={(checked) => handleSelectTransaction(transaction.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {transaction.merchant}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="max-w-xs">
                            <p className="truncate">{transaction.description}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                              {getConfidenceIcon(transaction.confidence)}
                              <span className="text-xs text-gray-500 capitalize">{transaction.confidence}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {transaction.source}
                        </TableCell>
                        <TableCell className={`text-sm font-medium text-right ${
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          ${Math.abs(transaction.amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {transaction.confidence === "low" ? (
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}