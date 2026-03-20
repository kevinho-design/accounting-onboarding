import * as React from "react";
import { Card, CardContent } from "./ui/card";

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

interface TransactionProgressCardProps {
  transactions: Transaction[];
}

export function TransactionProgressCard({ transactions }: TransactionProgressCardProps) {
  // Get the latest month from transactions
  const getLatestMonth = () => {
    const dates = transactions.map(t => new Date(t.date));
    const latestDate = new Date(Math.max(...dates.map(d => d.getTime())));
    return {
      year: latestDate.getFullYear(),
      month: latestDate.getMonth()
    };
  };

  // Filter transactions for the latest month
  const { year: latestYear, month: latestMonth } = getLatestMonth();
  const latestMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getFullYear() === latestYear && 
           transactionDate.getMonth() === latestMonth;
  });

  // Calculate statistics
  const totalTransactions = latestMonthTransactions.length;
  const autoMatched = latestMonthTransactions.filter(t => t.status === "matched").length;
  const pendingReview = latestMonthTransactions.filter(t => t.status === "needs_attention").length;
  const excluded = latestMonthTransactions.filter(t => t.status === "excluded").length;
  
  // Calculate percentages for bar widths
  const autoMatchedPercent = totalTransactions > 0 ? (autoMatched / totalTransactions) * 100 : 0;
  const pendingReviewPercent = totalTransactions > 0 ? (pendingReview / totalTransactions) * 100 : 0;
  const excludedPercent = totalTransactions > 0 ? (excluded / totalTransactions) * 100 : 0;

  const monthName = new Date(latestYear, latestMonth).toLocaleDateString('en-US', { month: 'long' });

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardContent className="px-[12px] py-[12px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[16px] font-medium text-gray-900">Progress</h3>
          <span className="text-xs text-gray-500">{monthName} {latestYear}</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-medium text-gray-900">{totalTransactions}</span>
          <span className="text-sm text-gray-500">Transactions</span>
        </div>

        {/* Progress bars */}
        <div className="mb-3">
          <div className="flex gap-0 h-3 rounded-full overflow-hidden bg-gray-100">
            {autoMatched > 0 && (
              <div 
                className="bg-blue-500 h-full transition-all duration-700 ease-out first:rounded-l-full"
                style={{ width: `${autoMatchedPercent}%` }}
              />
            )}
            {pendingReview > 0 && (
              <div 
                className="bg-purple-500 h-full transition-all duration-700 ease-out"
                style={{ width: `${pendingReviewPercent}%` }}
              />
            )}
            {excluded > 0 && (
              <div 
                className="bg-orange-500 h-full transition-all duration-700 ease-out last:rounded-r-full"
                style={{ width: `${excludedPercent}%` }}
              />
            )}
          </div>
        </div>

        {/* Labels and counts */}
        <div className="grid grid-cols-3 gap-3">
          {/* Auto-matched */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-gray-600 font-medium">Auto-matched</span>
            </div>
            <span className="text-xl font-medium text-gray-900">{autoMatched}</span>
          </div>
          
          {/* Pending review */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-gray-600 font-medium">Pending review</span>
            </div>
            <span className="text-xl font-medium text-gray-900">{pendingReview}</span>
          </div>
          
          {/* Excluded */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2.5 h-2.5 bg-orange-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs text-gray-600 font-medium">Excluded</span>
            </div>
            <span className="text-xl font-medium text-gray-900">{excluded}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}