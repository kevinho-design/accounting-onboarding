import * as React from "react";
import { ArrowRight, MoreHorizontal, AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "./ui/utils";

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

interface GroupedTransactionRowProps {
  transactions: Transaction[];
  groupId: string;
  onCategorySelect?: (transactionId: string, category: string) => void;
  transactionCategories?: string[];
  layout?: "table" | "grid";
}

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
    <div className={`w-6 h-6 ${color} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
      {initial}
    </div>
  );
};

const getGroupDescription = (transactions: Transaction[], groupId: string): string => {
  const firstTransaction = transactions[0];
  
  switch (groupId) {
    case "wilson-earned-fees":
      return "Wilson Estate Planning → Earned Fee Transfer";
    case "martinez-settlement":
      return "Martinez Settlement → Client Distribution";
    case "thompson-retainer":
      return "Thompson Retainer → Trust Deposit";
    case "brown-filing":
      return "Brown Filing Fee → Client Reimbursement";
    case "garcia-expert":
      return "Garcia Expert Witness → Trust Payment";
    default:
      return `${firstTransaction.description} + ${transactions.length - 1} more`;
  }
};

const getNetAmount = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
};

export function GroupedTransactionRow({ 
  transactions, 
  groupId, 
  onCategorySelect,
  transactionCategories,
  layout = "table" 
}: GroupedTransactionRowProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const netAmount = getNetAmount(transactions);
  const description = getGroupDescription(transactions, groupId);
  const mainDate = transactions[0].date;
  const allMatched = transactions.every(t => t.status === "matched");

  if (layout === "grid") {
    return (
      <>
        {/* Main grouped row */}
        <div
          className={cn(
            "grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-colors cursor-pointer",
            !allMatched && "bg-orange-50 border-l-4 border-orange-400"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Checkbox */}
          <div className="w-32 flex items-center flex-shrink-0">
            <Checkbox />
          </div>
          
          {/* Date */}
          <div className="col-span-1">
            <span className="text-sm text-gray-900 text-[14px] text-[13px]">
              {new Date(mainDate).toLocaleDateString()}
            </span>
          </div>
          
          {/* Source */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                {transactions.slice(0, 2).map((transaction, index) => (
                  <div 
                    key={transaction.id}
                    className={`${index > 0 ? '-ml-2' : ''} relative`}
                    style={{ zIndex: 10 - index }}
                  >
                    {getSourceIcon(transaction.source)}
                  </div>
                ))}
                {transactions.length > 2 && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium -ml-2 relative z-0">
                    +{transactions.length - 2}
                  </div>
                )}
              </div>
              <span className="text-sm text-[rgba(0,0,0,1)] truncate text-[14px] font-bold font-normal">
                {transactions.map(t => t.source).filter((source, index, arr) => arr.indexOf(source) === index).join(", ")}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div className="col-span-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{description}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </div>
            <span className="text-xs text-gray-500">{transactions.length} transactions</span>
          </div>
          
          {/* Category */}
          <div className="col-span-2">
            <Badge variant="outline" className="truncate">
              {transactions[0].category || "Multiple categories"}
            </Badge>
          </div>
          
          {/* Status */}
          <div className="col-span-1">
            {allMatched ? (
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
              netAmount > 0 ? "text-green-600" : "text-red-600"
            )}>
              {netAmount > 0 ? "+" : ""}${Math.abs(netAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          
          {/* Actions */}
          <div className="col-span-1 text-center">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Expanded individual transactions */}
        {isExpanded && transactions.map((transaction) => (
          <div
            key={transaction.id}
            className={cn(
              "grid grid-cols-12 gap-4 px-4 py-3 items-center bg-gray-50 ml-8",
              transaction.status === "needs_attention" && "bg-orange-100"
            )}
          >
            {/* Checkbox */}
            <div className="w-32 flex items-center flex-shrink-0">
              <Checkbox />
            </div>
            
            {/* Date */}
            <div className="col-span-1">
              <span className="text-sm text-gray-700">
                {new Date(transaction.date).toLocaleDateString()}
              </span>
            </div>
            
            {/* Source */}
            <div className="col-span-2">
              <div className="flex items-center gap-2">
                {getSourceIcon(transaction.source)}
                <span className="text-sm text-gray-700 truncate">{transaction.source}</span>
              </div>
            </div>
            
            {/* Description */}
            <div className="col-span-3">
              <span className="text-sm text-gray-700 truncate block">{transaction.description}</span>
            </div>
            
            {/* Category */}
            <div className="col-span-2">
              {transaction.category ? (
                <Badge variant="outline" className="truncate">
                  {transaction.category}
                </Badge>
              ) : transaction.status === "needs_attention" && onCategorySelect && transactionCategories ? (
                <Select onValueChange={(value) => onCategorySelect(transaction.id, value)}>
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
        ))}
      </>
    );
  }

  // Table layout (original)
  return (
    <>
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {/* Stacked Source Icons with text */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                {transactions.slice(0, 2).map((transaction, index) => (
                  <div 
                    key={transaction.id}
                    className={`${index > 0 ? '-ml-2' : ''} relative z-${10 - index}`}
                    style={{ zIndex: 10 - index }}
                  >
                    {getSourceIcon(transaction.source)}
                  </div>
                ))}
                {transactions.length > 2 && (
                  <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium -ml-2 relative z-0">
                    +{transactions.length - 2}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-900">
                {transactions.map(t => t.source).filter((source, index, arr) => arr.indexOf(source) === index).join(", ")}
              </span>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{description}</span>
                <ArrowRight className="w-3 h-3 text-gray-400" />
              </div>
              <span className="text-xs text-gray-500">{transactions.length} transactions</span>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          <Badge className={`${allMatched ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
            {allMatched ? 'Matched' : 'Review'}
          </Badge>
        </td>
        
        <td className="px-6 py-4 text-sm text-gray-900">
          {new Date(mainDate).toLocaleDateString()}
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-semibold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netAmount >= 0 ? '+' : ''}${Math.abs(netAmount).toLocaleString()}
            </span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      
      {/* Expanded view showing individual transactions */}
      {isExpanded && transactions.map((transaction, index) => (
        <tr key={transaction.id} className="bg-gray-50">
          <td className="px-6 py-3">
            <div className="flex items-center gap-3 ml-8">
              <div className="flex items-center gap-2">
                {getSourceIcon(transaction.source)}
                <span className="text-sm text-gray-700">{transaction.source}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-700">{transaction.description}</span>
              </div>
            </div>
          </td>
          
          <td className="px-6 py-3">
            {transaction.status === "needs_attention" && onCategorySelect && transactionCategories ? (
              <Select 
                onValueChange={(value) => onCategorySelect(transaction.id, value)}
              >
                <SelectTrigger className="w-full h-8 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {transactionCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                {transaction.status === "matched" ? "Matched" : "Review"}
              </Badge>
            )}
          </td>
          
          <td className="px-6 py-3 text-sm text-gray-700">
            {new Date(transaction.date).toLocaleDateString()}
          </td>
          
          <td className="px-6 py-3">
            <span className={`text-sm ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
}