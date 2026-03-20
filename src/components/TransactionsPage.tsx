"use client";

import * as React from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Edit,
  Download,
  X,
  Zap,
  Brain,
  Filter,
  ChevronDown,
  Check,
  Info,
  Send,
  FileCheck,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { cn } from "./ui/utils";
import { toast } from "sonner";
import { GroupedTransactionRow } from "./GroupedTransactionRow";

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

// Helper function to get source icon
const getSourceIcon = (source: string) => {
  const sourceColors: { [key: string]: string } = {
    "Clio Manage": "bg-blue-600",
    "Clio Trust": "bg-green-600", 
    "Bank of America": "bg-red-600",
    "QuickBooks Online": "bg-yellow-600",
    "Bank Wire": "bg-purple-600",
    "Check Deposit": "bg-indigo-600",
    "Bank Transfer": "bg-pink-600",
    "ACH Transfer": "bg-teal-600",
    "Wire Transfer": "bg-orange-600",
  };

  const color = sourceColors[source] || "bg-gray-600";
  const initial = source.charAt(0).toUpperCase();

  return (
    <div className={`w-5 h-5 ${color} rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0`}>
      {initial}
    </div>
  );
};

interface Transaction {
  id: string;
  source: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
  type: string;
  groupId?: string;
}

interface TransactionsPageProps {
  onClearNewTransactions?: () => void;
  onNavigateToTransactions?: () => void;
  onAIGuidanceOpenChange?: (isOpen: boolean) => void;
  onUpdateTransactionsNeedingAttention?: (count: number) => void;
  transactionsNeedingAttention?: number;
  transactions: Transaction[];
  onUpdateTransaction: (transactionId: string, updates: any) => void;
  onNavigateToReconciliation?: () => void;
}

export function TransactionsPage({ 
  onClearNewTransactions, 
  onNavigateToTransactions, 
  onAIGuidanceOpenChange,
  onUpdateTransactionsNeedingAttention,
  transactionsNeedingAttention = 0,
  transactions,
  onUpdateTransaction,
  onNavigateToReconciliation
}: TransactionsPageProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilters, setStatusFilters] = React.useState<string[]>(["matched", "needs_attention", "excluded"]);
  const [currentView, setCurrentView] = React.useState("all");
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set());
  const [isAIGuidanceOpen, setIsAIGuidanceOpen] = React.useState(false);
  const [currentTransactionIndex, setCurrentTransactionIndex] = React.useState(0);
  const [chatInput, setChatInput] = React.useState("");
  // Static snapshot of transactions needing attention when AI guidance starts
  const [guidanceTransactions, setGuidanceTransactions] = React.useState<Transaction[]>([]);
  
  // Conversation flow state
  const [conversationStep, setConversationStep] = React.useState(0);
  const [conversationHistory, setConversationHistory] = React.useState<Array<{question: string, answer: string}>>([]);
  const [currentQuestion, setCurrentQuestion] = React.useState("");
  const [questionOptions, setQuestionOptions] = React.useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = React.useState(false);
  const [suggestedCategory, setSuggestedCategory] = React.useState("");

  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.category && transaction.category.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Tab-based filtering
      let matchesView = true;
      if (currentView === "all") {
        matchesView = true; // Show all transactions
      } else if (currentView === "pending_review") {
        matchesView = transaction.status === "needs_attention" || transaction.status === "excluded";
      } else if (currentView === "matched") {
        matchesView = transaction.status === "matched";
      } else if (currentView === "client_trust") {
        matchesView = transaction.category === "Trust";
      }
      
      return matchesSearch && matchesView;
    })
    .sort((a, b) => {
      if (a.status !== b.status) {
        if (a.status === "needs_attention") return -1;
        if (b.status === "needs_attention") return 1;
        if (a.status === "excluded") return -1;
        if (b.status === "excluded") return 1;
      }
      
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const needsAttentionCount = transactions.filter(t => t.status === "needs_attention").length;
  const excludedCount = transactions.filter(t => t.status === "excluded").length;
  const reviewRequiredCount = needsAttentionCount + excludedCount;
  const needsAttentionTransactions = transactions.filter(t => t.status === "needs_attention");

  // Group transactions for display and sort by date
  const groupTransactions = (transactions: Transaction[]) => {
    const groups: { [key: string]: Transaction[] } = {};
    const ungrouped: Transaction[] = [];

    transactions.forEach(transaction => {
      if (transaction.groupId) {
        if (!groups[transaction.groupId]) {
          groups[transaction.groupId] = [];
        }
        groups[transaction.groupId].push(transaction);
      } else {
        ungrouped.push(transaction);
      }
    });

    // Create a unified list of display items with dates for sorting
    const displayItems: Array<{
      type: 'group' | 'individual';
      date: string;
      groupId?: string;
      transactions?: Transaction[];
      transaction?: Transaction;
    }> = [];

    // Add grouped transactions (use the earliest date in each group)
    Object.entries(groups).forEach(([groupId, groupTransactions]) => {
      const earliestDate = groupTransactions
        .map(t => new Date(t.date))
        .sort((a, b) => b.getTime() - a.getTime())[0]; // Get the latest date for consistent sorting
      
      displayItems.push({
        type: 'group',
        date: earliestDate.toISOString().split('T')[0],
        groupId,
        transactions: groupTransactions
      });
    });

    // Add individual transactions
    ungrouped.forEach(transaction => {
      displayItems.push({
        type: 'individual',
        date: transaction.date,
        transaction
      });
    });

    // Sort all items by date (most recent first)
    displayItems.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      // If dates are the same, prioritize groups over individuals for consistent ordering
      if (a.type === 'group' && b.type === 'individual') return -1;
      if (a.type === 'individual' && b.type === 'group') return 1;
      return 0;
    });

    return { displayItems, totalGroups: Object.keys(groups).length, totalUngrouped: ungrouped.length };
  };

  const { displayItems, totalGroups, totalUngrouped } = groupTransactions(filteredTransactions);

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    if (checked) {
      setStatusFilters(prev => [...prev, status]);
    } else {
      setStatusFilters(prev => prev.filter(s => s !== status));
    }
  };

  const handleRowSelect = (transactionId: string, checked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(transactionId);
      } else {
        newSet.delete(transactionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = displayItems.flatMap(item => 
        item.type === 'group' 
          ? item.transactions!.map(t => t.id)
          : [item.transaction!.id]
      );
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const isAllSelected = displayItems.length > 0 && displayItems.every(item =>
    item.type === 'group'
      ? item.transactions!.every(t => selectedRows.has(t.id))
      : selectedRows.has(item.transaction!.id)
  );

  const isIndeterminate = selectedRows.size > 0 && !isAllSelected;

  const handleOpenAIGuidance = () => {
    // Capture static snapshot of transactions needing attention or excluded
    const transactionsForGuidance = transactions.filter(t => t.status === "needs_attention" || t.status === "excluded");
    setGuidanceTransactions(transactionsForGuidance);
    
    setIsAIGuidanceOpen(true);
    onAIGuidanceOpenChange?.(true);
    setCurrentTransactionIndex(0);
    setChatInput("");
    setConversationStep(0);
    setConversationHistory([]);
    setShowAnalysis(false);
    setSuggestedCategory("");
    startConversation(transactionsForGuidance);
  };

  const startConversation = (transactionsToUse?: Transaction[]) => {
    const transactionsArray = transactionsToUse || guidanceTransactions;
    const currentTransaction = transactionsArray[currentTransactionIndex];
    if (!currentTransaction) return;

    // Generate contextual first question based on transaction details
    let question = "";
    let options: string[] = [];

    if (currentTransaction.description.toLowerCase().includes("trust") || 
        currentTransaction.source.toLowerCase().includes("trust")) {
      question = "Is this money going into or coming out of your trust account?";
      options = ["Going into trust (client deposit)", "Coming out of trust (payment to client)", "Transfer between accounts", "I'm not sure"];
    } else if (currentTransaction.amount > 0) {
      question = "What type of income does this transaction represent?";
      options = ["Client payment for legal services", "Retainer or advance payment", "Refund or reimbursement", "Other business income"];
    } else {
      question = "What type of business expense is this?";
      options = ["Office rent or utilities", "Professional services or fees", "Case-related expense", "Software or technology", "Other business expense"];
    }

    setCurrentQuestion(question);
    setQuestionOptions(options);
  };

  const handleCloseAIGuidance = () => {
    setIsAIGuidanceOpen(false);
    onAIGuidanceOpenChange?.(false);
    setCurrentTransactionIndex(0);
    setChatInput("");
    setConversationStep(0);
    setConversationHistory([]);
    setShowAnalysis(false);
    setSuggestedCategory("");
    setGuidanceTransactions([]);
  };

  const handleAnswerQuestion = (answer: string) => {
    const newHistoryItem = { question: currentQuestion, answer };
    const updatedHistory = [...conversationHistory, newHistoryItem];
    setConversationHistory(updatedHistory);

    if (conversationStep === 0) {
      // Ask follow-up question based on first answer
      askFollowUpQuestion(answer);
      setConversationStep(1);
    } else if (conversationStep === 1) {
      // After second question, show analysis
      generateAnalysisAndSuggestion(updatedHistory);
    }
  };

  const askFollowUpQuestion = (firstAnswer: string) => {
    let question = "";
    let options: string[] = [];

    if (firstAnswer.includes("trust")) {
      question = "Which client matter is this transaction related to?";
      options = ["Johnson case", "Anderson divorce", "Smith vs. Jones", "General retainer", "I need to check"];
    } else if (firstAnswer.includes("Client payment") || firstAnswer.includes("Retainer")) {
      question = "Is this payment for a specific case or general legal services?";
      options = ["Specific case/matter", "General legal consultation", "Ongoing representation", "I'm not sure"];
    } else if (firstAnswer.includes("rent") || firstAnswer.includes("utilities")) {
      question = "Is this a recurring monthly expense?";
      options = ["Yes, monthly recurring", "Quarterly payment", "One-time expense", "Annual payment"];
    } else {
      question = "Does this expense relate to a specific client matter?";
      options = ["Yes, billable to client", "No, general business expense", "Partially billable", "I need to check"];
    }

    setCurrentQuestion(question);
    setQuestionOptions(options);
  };

  const generateAnalysisAndSuggestion = (history: Array<{question: string, answer: string}>) => {
    // Analyze the conversation to determine the best category
    let category = "Operating";
    let confidence = 85;
    let reasoning = "";

    const firstAnswer = history[0]?.answer || "";
    const secondAnswer = history[1]?.answer || "";

    // Trust account related transactions
    if (firstAnswer.includes("Going into trust") || firstAnswer.includes("Coming out of trust")) {
      category = "Trust";
      confidence = 95;
      if (firstAnswer.includes("Going into trust")) {
        reasoning = "This is a client deposit into the trust account. Trust funds must be kept separate from operating funds for compliance with legal ethics rules.";
      } else {
        reasoning = "This is a payment from the trust account to a client. All trust withdrawals must be properly documented and compliant with state regulations.";
      }
    } 
    // Transfer between accounts
    else if (firstAnswer.includes("Transfer between accounts")) {
      category = "Operating";
      confidence = 90;
      reasoning = "This appears to be an internal transfer between your business accounts. These should be categorized based on their ultimate purpose.";
    }
    // Income transactions
    else if (firstAnswer.includes("Client payment for legal services")) {
      if (secondAnswer.includes("Specific case")) {
        category = "Case Expenses";
        confidence = 90;
        reasoning = "This is client payment for specific legal work. Since it's case-specific, it should be tracked separately for proper matter accounting.";
      } else if (secondAnswer.includes("General legal consultation") || secondAnswer.includes("Ongoing representation")) {
        category = "Operating";
        confidence = 95;
        reasoning = "This is payment for general legal services and should be categorized as operating income for your firm.";
      } else {
        category = "Operating";
        confidence = 80;
        reasoning = "This appears to be legal service income. Without more specific details, it's safest to categorize as general operating income.";
      }
    }
    // Retainer payments
    else if (firstAnswer.includes("Retainer or advance payment")) {
      category = "Trust";
      confidence = 95;
      reasoning = "Retainer and advance payments must be held in trust until earned. This ensures compliance with legal ethics rules regarding client funds.";
    }
    // Refunds and reimbursements
    else if (firstAnswer.includes("Refund or reimbursement")) {
      if (secondAnswer.includes("billable to client") || secondAnswer.includes("Partially billable")) {
        category = "Case Expenses";
        confidence = 90;
        reasoning = "This refund/reimbursement relates to case expenses that can be billed back to the client.";
      } else {
        category = "Expenses";
        confidence = 85;
        reasoning = "This appears to be a general business refund or reimbursement for firm expenses.";
      }
    }
    // Other business income
    else if (firstAnswer.includes("Other business income")) {
      category = "Operating";
      confidence = 75;
      reasoning = "This is non-legal business income. Consider if this should be tracked separately from legal service revenue.";
    }
    // Office expenses
    else if (firstAnswer.includes("Office rent or utilities")) {
      if (secondAnswer.includes("monthly recurring") || secondAnswer.includes("Quarterly payment") || secondAnswer.includes("Annual payment")) {
        category = "Expenses";
        confidence = 95;
        reasoning = "Office rent and utilities are standard recurring business operating expenses and are tax-deductible.";
      } else {
        category = "Expenses";
        confidence = 90;
        reasoning = "This appears to be a one-time office-related expense. Still categorized as a business operating expense.";
      }
    }
    // Professional services
    else if (firstAnswer.includes("Professional services or fees")) {
      if (secondAnswer.includes("billable to client")) {
        category = "Case Expenses";
        confidence = 90;
        reasoning = "This professional service expense can be billed to a client, so it should be tracked as a case expense for reimbursement.";
      } else {
        category = "Professional Services";
        confidence = 95;
        reasoning = "This is a professional service expense for your firm's operations, such as accounting, legal counsel, or consulting fees.";
      }
    }
    // Case-related expenses
    else if (firstAnswer.includes("Case-related expense")) {
      category = "Case Expenses";
      confidence = 95;
      if (secondAnswer.includes("billable to client")) {
        reasoning = "This case expense can be billed back to the client and should be tracked for reimbursement.";
      } else if (secondAnswer.includes("Partially billable")) {
        reasoning = "This case expense is partially billable to the client. You may want to split this transaction if possible.";
      } else {
        reasoning = "This is a case-related expense that will be absorbed by the firm and not billed to the client.";
      }
    }
    // Software and technology
    else if (firstAnswer.includes("Software or technology")) {
      category = "Software";
      confidence = 95;
      if (secondAnswer.includes("monthly recurring") || secondAnswer.includes("Annual payment")) {
        reasoning = "This is a recurring software/technology subscription expense. These are typically tax-deductible business expenses.";
      } else {
        reasoning = "This is a one-time software or technology purchase for your firm's operations.";
      }
    }
    // Other business expenses
    else if (firstAnswer.includes("Other business expense")) {
      if (secondAnswer.includes("billable to client")) {
        category = "Case Expenses";
        confidence = 85;
        reasoning = "This expense can be billed to a client, so it should be tracked as a case expense for reimbursement.";
      } else {
        category = "Expenses";
        confidence = 75;
        reasoning = "This appears to be a general business expense. Consider creating a more specific category if this type of expense recurs frequently.";
      }
    }
    // Fallback for uncertain answers
    else if (firstAnswer.includes("I'm not sure") || secondAnswer.includes("I'm not sure") || firstAnswer.includes("I need to check") || secondAnswer.includes("I need to check")) {
      category = "Operating";
      confidence = 60;
      reasoning = "Since there's uncertainty about this transaction, I'm suggesting a general category. You may want to review this manually or provide additional context.";
    }

    setSuggestedCategory(category);
    setShowAnalysis(true);
  };

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      console.log("User message:", chatInput);
      setChatInput("");
      
      toast.success("Message received", {
        description: "Thanks for the additional context. I'll consider this information.",
        duration: 3000,
      });
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  const handleApplySuggestion = (category: string) => {
    const currentTransaction = guidanceTransactions[currentTransactionIndex];
    if (currentTransaction) {
      // Update the transaction through the parent component
      onUpdateTransaction(currentTransaction.id, { category, status: "matched" });
      
      toast.success("Successfully categorized", {
        description: "Automate similar future transactions with categorization pattern?",
        duration: Infinity,
        action: {
          label: "Yes",
          onClick: () => {
            toast.dismiss();
            toast.success(`AI Rule Created! Future transactions from "${currentTransaction.source}" will automatically be categorized as "${category}".`, {
              duration: 5000,
            });
          }
        },
        cancel: {
          label: "No, and dismiss",
          onClick: () => {
            toast.dismiss();
          }
        }
      });
      
      // Move to next transaction
      moveToNextTransaction();
    }
  };

  const moveToNextTransaction = () => {
    const nextIndex = currentTransactionIndex + 1;
    
    if (nextIndex < guidanceTransactions.length) {
      setCurrentTransactionIndex(nextIndex);
      // Reset conversation for next transaction
      setConversationStep(0);
      setConversationHistory([]);
      setShowAnalysis(false);
      setSuggestedCategory("");
      setTimeout(() => startConversation(), 500);
    } else {
      setIsAIGuidanceOpen(false);
      onAIGuidanceOpenChange?.(false);
      setCurrentTransactionIndex(0);
      setChatInput("");
      setConversationStep(0);
      setConversationHistory([]);
      setShowAnalysis(false);
      setSuggestedCategory("");
      setGuidanceTransactions([]);
      
      // The count will be automatically updated by the useEffect in App.tsx
      
      if (onClearNewTransactions) {
        onClearNewTransactions();
      }
      toast.success("All transactions categorized!", {
        description: "Great work! All imported transactions have been successfully categorized.",
        duration: 5000,
      });
    }
  };

  const handleSkipTransaction = () => {
    moveToNextTransaction();
  };

  const handleCategorySelect = (transactionId: string, category: string) => {
    onUpdateTransaction(transactionId, { category, status: "matched" });
    
    toast.success("Transaction categorized successfully", {
      description: `Transaction has been categorized as "${category}"`,
      duration: 3000,
    });
  };

  const currentTransaction = guidanceTransactions[currentTransactionIndex];
  const progressPercentage = guidanceTransactions.length > 0 
    ? Math.round((currentTransactionIndex / guidanceTransactions.length) * 100)
    : 0;

  // Helper function to get status badge text and styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excluded":
        return {
          text: "Excluded",
          className: "bg-gray-100 text-gray-800 border-gray-200"
        };
      case "needs_attention":
        return {
          text: "Needs Attention", 
          className: "bg-red-100 text-red-800 border-red-200"
        };
      case "matched":
        return {
          text: "Matched",
          className: "bg-green-100 text-green-800 border-green-200"
        };
      default:
        return {
          text: "Needs Attention",
          className: "bg-red-100 text-red-800 border-red-200"
        };
    }
  };

  // Get dynamic confidence and reasoning for display
  const getConfidenceLevel = () => {
    const firstAnswer = conversationHistory[0]?.answer || "";
    const secondAnswer = conversationHistory[1]?.answer || "";
    
    if (firstAnswer.includes("I'm not sure") || secondAnswer.includes("I'm not sure") || 
        firstAnswer.includes("I need to check") || secondAnswer.includes("I need to check")) {
      return { confidence: 60, level: "Medium" };
    }
    
    if (firstAnswer.includes("Going into trust") || firstAnswer.includes("Coming out of trust") ||
        firstAnswer.includes("Retainer or advance payment") ||
        (firstAnswer.includes("Client payment for legal services") && secondAnswer.includes("General legal consultation"))) {
      return { confidence: 95, level: "High" };
    }
    
    if (firstAnswer.includes("Office rent or utilities") || 
        firstAnswer.includes("Case-related expense") ||
        firstAnswer.includes("Software or technology")) {
      return { confidence: 95, level: "High" };
    }
    
    return { confidence: 85, level: "High" };
  };

  const getCurrentReasoning = () => {
    const firstAnswer = conversationHistory[0]?.answer || "";
    const secondAnswer = conversationHistory[1]?.answer || "";

    // Trust account related transactions
    if (firstAnswer.includes("Going into trust")) {
      return "This is a client deposit into the trust account. Trust funds must be kept separate from operating funds for compliance with legal ethics rules.";
    } else if (firstAnswer.includes("Coming out of trust")) {
      return "This is a payment from the trust account to a client. All trust withdrawals must be properly documented and compliant with state regulations.";
    }
    // Transfer between accounts
    else if (firstAnswer.includes("Transfer between accounts")) {
      return "This appears to be an internal transfer between your business accounts. These should be categorized based on their ultimate purpose.";
    }
    // Income transactions
    else if (firstAnswer.includes("Client payment for legal services")) {
      if (secondAnswer.includes("Specific case")) {
        return "This is client payment for specific legal work. Since it's case-specific, it should be tracked separately for proper matter accounting.";
      } else if (secondAnswer.includes("General legal consultation") || secondAnswer.includes("Ongoing representation")) {
        return "This is payment for general legal services and should be categorized as operating income for your firm.";
      } else {
        return "This appears to be legal service income. Without more specific details, it's safest to categorize as general operating income.";
      }
    }
    // Add more specific reasoning cases as needed
    else if (firstAnswer.includes("Retainer or advance payment")) {
      return "Retainer and advance payments must be held in trust until earned. This ensures compliance with legal ethics rules regarding client funds.";
    }
    // Default reasoning
    else {
      return "Based on your responses, this categorization follows legal accounting best practices and compliance requirements.";
    }
  };

  return (
    <>
      <div className="flex h-full w-full min-w-[1440px] bg-gray-50">
        <div className="flex-1 flex flex-col">
          {/* Page Title */}
          <div className="px-5 py-6 bg-gray-50">
            <h1 className="text-4xl font-medium text-foreground text-[36px] font-[Inter]">Firm transactions</h1>
          </div>

          <div className="flex-1 flex px-5 pb-5 overflow-hidden">
            <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
              
              
              {reviewRequiredCount > 0 ? (
                <Card className="border border-blue-200 bg-blue-50/50 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 mt-0.5">
                          <Brain className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">AI Transaction Categorization</h4>
                          <p className="text-sm text-blue-700 mb-3">
                            We imported 23 new transactions, but {reviewRequiredCount} of them need your attention because we couldn't automatically categorize them or they were excluded.
                          </p>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={handleOpenAIGuidance}
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              Start AI Guidance
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-green-200 bg-green-50/50 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">All Transactions Categorized!</h4>
                          <p className="text-sm text-green-700 mb-3">
                            Great work! All transactions have been successfully categorized. You're now ready to start reconciliation.
                          </p>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              onClick={onNavigateToReconciliation}
                            >
                              <FileCheck className="h-3 w-3 mr-1" />
                              Start Reconciliation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="flex-1 border border-gray-200 shadow-sm overflow-hidden">
                <CardContent className="p-0 h-full">
                  <div className="flex h-full flex-col">
                    {/* Custom Tab Menu */}
                    <div className="px-4 pt-[14px] pb-[0px] bg-white pr-[14px] pl-[0px]">
                      <div className="flex space-x-8 border-b border-gray-200">
                        <button
                          onClick={() => setCurrentView("all")}
                          className={cn(
                            "pb-3 px-3 text-lg font-medium transition-colors relative",
                            currentView === "all" 
                              ? "text-primary" 
                              : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          All transactions
                          {currentView === "all" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                          )}
                        </button>
                        <button
                          onClick={() => setCurrentView("pending_review")}
                          className={cn(
                            "pb-3 px-3 text-lg font-medium transition-colors relative",
                            currentView === "pending_review" 
                              ? "text-primary" 
                              : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          Pending review
                          {currentView === "pending_review" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                          )}
                        </button>
                        <button
                          onClick={() => setCurrentView("matched")}
                          className={cn(
                            "pb-3 px-1 text-lg font-medium transition-colors relative",
                            currentView === "matched" 
                              ? "text-primary" 
                              : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          Matched
                          {currentView === "matched" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                          )}
                        </button>
                        <button
                          onClick={() => setCurrentView("client_trust")}
                          className={cn(
                            "pb-3 px-1 text-lg font-medium transition-colors relative",
                            currentView === "client_trust" 
                              ? "text-primary" 
                              : "text-gray-500 hover:text-gray-700"
                          )}
                        >
                          Client Trust
                          {currentView === "client_trust" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            Latest transactions
                          </span>
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                            {filteredTransactions.length}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search transactions..."
                            className="pl-10 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-auto">
                      <div className="min-w-full">
                        <div className="sticky top-0 bg-[rgba(232,232,232,1)] border-b border-gray-200 px-4 py-3 px-[14px] py-[10px]">
                          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 tracking-wider">
                            <div className="w-32 flex items-center flex-shrink-0">
                              <Checkbox
                                checked={isAllSelected}
                                onCheckedChange={handleSelectAll}
                                className={isIndeterminate ? "data-[state=checked]:bg-primary data-[state=checked]:border-primary opacity-50" : ""}
                              />
                            </div>
                            <div className="col-span-1 text-[rgba(0,0,0,1)] text-[11px] font-bold">Date</div>
                            <div className="col-span-2 text-[rgba(0,0,0,1)] text-[12px] font-bold">Source</div>
                            <div className="col-span-3 text-[rgba(0,0,0,1)] text-[12px] font-bold">Description</div>
                            <div className="col-span-2 text-[rgba(0,0,0,1)] text-[12px] font-bold">Category</div>
                            <div className="col-span-1 text-[rgba(0,0,0,1)] text-[12px] font-bold">Status</div>
                            <div className="col-span-1 text-[rgba(0,0,0,1)] text-[12px] font-bold">Amount</div>
                            <div className="col-span-1 text-[rgba(0,0,0,1)] text-[12px] font-bold"></div>
                          </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                          {displayItems.map((item, index) => {
                            if (item.type === 'group') {
                              return (
                                <GroupedTransactionRow
                                  key={item.groupId}
                                  transactions={item.transactions!}
                                  groupId={item.groupId!}
                                  onCategorySelect={handleCategorySelect}
                                  transactionCategories={transactionCategories}
                                  layout="grid"
                                />
                              );
                            } else {
                              const transaction = item.transaction!;
                              return (
                                <div
                                  key={transaction.id}
                                  className={cn(
                                    "grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-colors",
                                    transaction.status === "needs_attention" && "bg-orange-50 border-l-4 border-orange-400"
                                  )}
                                >
                                  {/* Checkbox */}
                                  <div className="w-32 flex items-center flex-shrink-0">
                                    <Checkbox
                                      checked={selectedRows.has(transaction.id)}
                                      onCheckedChange={(checked) => handleRowSelect(transaction.id, checked as boolean)}
                                    />
                                  </div>
                                  
                                  {/* Date */}
                                  <div className="col-span-1">
                                    <span className="text-sm text-gray-900 text-[14px] text-[13px]">
                                      {new Date(transaction.date).toLocaleDateString()}
                                    </span>
                                  </div>
                                  
                                  {/* Source */}
                                  <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                      {getSourceIcon(transaction.source)}
                                      <span className="text-sm text-[rgba(0,0,0,1)] truncate text-[14px] font-bold font-normal">
                                        {transaction.source}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Description */}
                                  <div className="col-span-3">
                                    <span className="text-sm text-gray-900 truncate block">{transaction.description}</span>
                                  </div>
                                  
                                  {/* Category */}
                                  <div className="col-span-2">
                                    {transaction.category ? (
                                      <Badge variant="outline" className="truncate">
                                        {transaction.category}
                                      </Badge>
                                    ) : transaction.status === "needs_attention" ? (
                                      <Select onValueChange={(value) => handleCategorySelect(transaction.id, value)}>
                                        <SelectTrigger className="w-full h-8 text-xs">
                                          <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {transactionCategories.map((category) => (
                                            <SelectItem key={category} value={category} className="text-xs">
                                              {category}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <span className="text-sm text-gray-500">No category</span>
                                    )}
                                  </div>
                                  
                                  {/* Status */}
                                  <div className="col-span-1">
                                    {transaction.status === "matched" ? (
                                      <Badge variant="secondary" className="gap-1 text-xs px-2 py-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Matched
                                      </Badge>
                                    ) : (
                                      <Badge variant="destructive" className="gap-1 text-xs px-2 py-1">
                                        <AlertCircle className="h-3 w-3" />
                                        Needs Attention
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {/* Amount */}
                                  <div className="col-span-1 text-right">
                                    <span className={cn(
                                      "text-sm font-medium",
                                      transaction.amount > 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                  </div>
                                  
                                  {/* Actions */}
                                  <div className="col-span-1 text-center">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* AI Guidance Drawer */}
      <Sheet open={isAIGuidanceOpen} onOpenChange={handleCloseAIGuidance}>
        <SheetContent side="right" className="w-[440px] sm:max-w-[440px] flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Transaction Guidance</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseAIGuidance}
              className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 mb-6">
            I'll help you categorize the {guidanceTransactions.length} transactions that need attention, one by one.
          </p>

          {/* Progress */}
          <div className="flex items-center justify-between text-sm mb-4">
            <span className="text-gray-900 font-medium">Transaction {currentTransactionIndex + 1} of {guidanceTransactions.length}</span>
            <span className="text-blue-600 font-medium">{progressPercentage}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="w-full mb-6 h-2" />

          {/* Transaction Details */}
          {currentTransaction && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-semibold text-gray-900">Transaction Details</h3>
                <Badge variant="destructive" className={getStatusBadge(currentTransaction?.status || "needs_attention").className}>
                  {getStatusBadge(currentTransaction?.status || "needs_attention").text}
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Source:</span>
                  <span className="text-sm text-gray-900 font-medium">{currentTransaction.source}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Date:</span>
                  <span className="text-sm text-gray-900">{new Date(currentTransaction.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600 font-medium">Description:</span>
                  <span className="text-sm text-gray-900 text-right max-w-[200px]">{currentTransaction.description}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">Amount:</span>
                  <span className={cn(
                    "text-sm font-semibold",
                    currentTransaction.amount > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {currentTransaction.amount > 0 ? "" : "-"}${Math.abs(currentTransaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Previous Q&A */}
            {conversationHistory.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="bg-blue-50 rounded-lg p-3 mb-2">
                  <div className="flex items-start gap-2">
                    <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-900">{item.question}</p>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-3">
                  <p className="text-sm text-gray-900">{item.answer}</p>
                </div>
              </div>
            ))}

            {/* Quick Questions */}
            {currentQuestion && !showAnalysis && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Questions</h3>
                <p className="text-sm text-gray-900 mb-4">{currentQuestion}</p>
                <div className="space-y-2">
                  {questionOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerQuestion(option)}
                      className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors text-sm text-gray-900"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis and Suggestion */}
            {showAnalysis && suggestedCategory && (
              <div className="mb-6">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 mb-1">Analysis Complete</p>
                      <p className="text-sm text-green-800">
                        Based on your responses, I recommend categorizing this transaction as:
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{suggestedCategory}</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {getConfidenceLevel().confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getCurrentReasoning()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApplySuggestion(suggestedCategory)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Apply Category
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkipTransaction}
                    className="flex-1"
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Context */}
          <div className="flex-shrink-0 border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Additional Context</h3>
            <p className="text-sm text-gray-600 mb-3">
              Have more details about this transaction? Share them here to help improve the categorization.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Type additional context..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleChatKeyPress}
                className="flex-1"
              />
              <Button
                onClick={handleChatSubmit}
                disabled={!chatInput.trim()}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}