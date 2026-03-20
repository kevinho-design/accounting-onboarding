"use client";

import * as React from "react";
import {
  X,
  AlertTriangle,
  Filter,
  MoreVertical,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";

// Mock transaction data matching the screenshot format
const mockTransactions = [
  {
    id: "1",
    date: "2024-01-14",
    matter: "Johnson vs Smith",
    matterId: "M2024-001",
    transactionId: "TXN-202401-001",
    merchant: "Office Depot",
    description: "Office supplies and equipment",
    confidence: 95,
    amount: 245.67,
    invoice: "INV-2024-001",
    invoiceId: "inv_001"
  },
  {
    id: "2",
    date: "2024-01-13",
    matter: "Estate Planning - Williams",
    matterId: "M2024-002", 
    transactionId: "TXN-202401-002",
    merchant: "Riverdale Enterprises",
    description: "Legal services retainer - Johnson vs Smith",
    confidence: 98,
    amount: 2500.00,
    invoice: "INV-2024-002",
    invoiceId: "inv_002"
  },
  {
    id: "3",
    date: "2024-01-11",
    matter: "Corporate Merger - TechCorp",
    matterId: "M2024-003",
    transactionId: "TXN-202401-003",
    merchant: "Golden Gate Holdings",
    description: "Monthly phone and internet service",
    confidence: 87,
    amount: 189.45,
    invoice: "INV-2024-003", 
    invoiceId: "inv_003"
  },
  {
    id: "4",
    date: "2024-01-09",
    matter: "Personal Injury - Davis",
    matterId: "M2024-004",
    transactionId: "TXN-202401-004",
    merchant: "Nova Construction",
    description: "Client meeting expenses",
    confidence: 62,
    amount: 24.5,
    invoice: "INV-2024-004",
    invoiceId: "inv_004"
  },
  {
    id: "5",
    date: "2024-01-07",
    matter: "Contract Dispute - ABC Inc",
    matterId: "M2024-005",
    transactionId: "TXN-202401-005",
    merchant: "Silverstone Insurance",
    description: "Office rent - January 2024",
    confidence: 99,
    amount: 3200.00,
    invoice: "INV-2024-005",
    invoiceId: "inv_005"
  },
  {
    id: "6",
    date: "2024-01-06",
    matter: "Immigration Case - Rodriguez",
    matterId: "M2024-006",
    transactionId: "TXN-202401-006",
    merchant: "Wilson Legal Group",
    description: "Brief Preparation",
    confidence: 94,
    amount: 1190.00,
    invoice: "INV-2024-006",
    invoiceId: "inv_006"
  },
  {
    id: "7",
    date: "2024-01-05",
    matter: "Bankruptcy Filing - Thompson",
    matterId: "M2024-007",
    transactionId: "TXN-202401-007",
    merchant: "Johnson & Partners",
    description: "Estate Planning",
    confidence: 76,
    amount: 2620.00,
    invoice: "INV-2024-007",
    invoiceId: "inv_007"
  },
  {
    id: "8",
    date: "2024-01-04",
    matter: "Family Law - Martinez",
    matterId: "M2024-008",
    transactionId: "TXN-202401-008",
    merchant: "Horizon Media",
    description: "Legal Advertisement",
    confidence: 85,
    amount: 920.00,
    invoice: "INV-2024-008",
    invoiceId: "inv_008"
  }
];

interface AccountDetailSheetProps {
  account: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AccountDetailSheet({ account, isOpen, onClose }: AccountDetailSheetProps) {
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  // Animation state to ensure consistent transitions
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Match the animation duration for closing
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'text-green-600 bg-green-50';
      case 'on-track': return 'text-blue-600 bg-blue-50';
      case 'needs-attention': return 'text-orange-600 bg-orange-50';
      case 'behind': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 95) return 'bg-green-500';
    if (progress >= 80) return 'bg-blue-500';
    if (progress >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const filteredTransactions = React.useMemo(() => {
    let filtered = mockTransactions;
    
    if (selectedTab === "reconciled") {
      filtered = mockTransactions.filter(t => t.confidence >= 90);
    } else if (selectedTab === "excluded") {
      filtered = mockTransactions.filter(t => t.confidence < 70);
    }
    
    return filtered;
  }, [selectedTab]);

  const paginatedTransactions = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleInvoiceClick = (invoiceId: string) => {
    console.log('Navigate to invoice:', invoiceId);
    // Add navigation logic here
  };

  const handleMatterClick = (matterId: string) => {
    console.log('Navigate to matter:', matterId);
    // Add navigation logic here
  };

  // Don't render anything if no account is provided
  if (!account) return null;

  const tabs = [
    { id: "all", label: "All", count: mockTransactions.length },
    { id: "reconciled", label: "Reconciled", count: mockTransactions.filter(t => t.confidence >= 90).length },
    { id: "excluded", label: "Excluded", count: mockTransactions.filter(t => t.confidence < 70).length }
  ];

  return (
    <>
      {/* Backdrop with matching animation timing */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        style={{
          transitionDelay: '0ms',
          transitionDuration: '300ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      
      {/* Bottom Sheet with matching animation timing */}
      <div
        className={`fixed inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col min-h-0 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ 
          top: '20px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          transitionDelay: '0ms',
          transitionDuration: '300ms',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold">Account Details</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 transition-colors duration-200 ease-in-out hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-6 m-[0px]">
              {/* Section 1: Account Details */}
              <div className="space-y-4">
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col">
                          <h4 className="font-semibold text-base">{account.name}</h4>
                          <p className="text-sm text-[rgba(0,0,0,1)] text-[20px] font-bold">
                            ${account.balance.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-xs ${getStatusColor(account.status)}`}>
                            {account.status.replace('-', ' ')}
                          </Badge>
                          {account.hasWarning && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Requires attention</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-bold">{account.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(account.progress)}`}
                            style={{ width: `${account.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Confidence Score & Last Updated */}
                      <div className="flex items-center justify-between">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="text-sm text-muted-foreground cursor-help">
                                Avg. Confidence {account.confidence}%
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Average AI match confidence this month</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-xs text-muted-foreground">{account.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Account Info */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-muted-foreground">Connected Bank Account</h4>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-600 text-white text-sm font-semibold">
                            WF
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">Wells Fargo Business</div>
                          <div className="text-sm text-muted-foreground">Business Checking • ••••6334</div>
                        </div>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Section 2: Transaction Table */}
              <div className="space-y-4">
                {/* Table Header */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Transactions to review</h3>
                  
                  {/* Custom Tab Navigation with Filter Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-0">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.id)}
                          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 border-b-2 ${
                            selectedTab === tab.id
                              ? 'text-blue-600 border-blue-600'
                              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.label} ({tab.count})
                        </button>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>

                {/* Transaction Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="h-12 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Created
                        </TableHead>
                        <TableHead className="h-12 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Matters
                        </TableHead>
                        <TableHead className="h-12 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Transaction #
                        </TableHead>
                        <TableHead className="h-12 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Merchant
                        </TableHead>
                        <TableHead className="h-12 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Confidence
                        </TableHead>
                        <TableHead className="h-12 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Summary
                        </TableHead>
                        <TableHead className="h-12 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Amount
                        </TableHead>
                        <TableHead className="h-12 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTransactions.map((transaction, index) => (
                        <TableRow 
                          key={transaction.id} 
                          className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                        >
                          <TableCell className="h-16 px-4 text-sm text-gray-900">
                            {new Date(transaction.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </TableCell>
                          <TableCell className="h-16 px-4">
                            <a 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleMatterClick(transaction.matterId);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer underline"
                            >
                              {transaction.matter}
                            </a>
                          </TableCell>
                          <TableCell className="h-16 px-4 text-sm text-gray-900">
                            {transaction.transactionId}
                          </TableCell>
                          <TableCell className="h-16 px-4">
                            <div className="space-y-1">
                              <div className="text-sm font-medium text-gray-900">{transaction.merchant}</div>
                              <div className="text-xs text-gray-500">{transaction.description}</div>
                            </div>
                          </TableCell>
                          <TableCell className="h-16 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-900">{transaction.confidence}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${getConfidenceColor(transaction.confidence)}`}
                                    style={{ width: `${transaction.confidence}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="h-16 px-4">
                            <a 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                handleInvoiceClick(transaction.invoiceId);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer underline"
                            >
                              {transaction.invoice}
                            </a>
                          </TableCell>
                          <TableCell className="h-16 px-4 text-right text-gray-900 text-sm font-medium">
                            ${transaction.amount.toLocaleString()}
                          </TableCell>
                          <TableCell className="h-16 px-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Button variant="outline" size="sm" className="text-xs">
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm font-medium bg-blue-600 text-white px-3 py-1 rounded">
                        {currentPage}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}