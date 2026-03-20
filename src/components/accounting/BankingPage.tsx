import * as React from "react";
import { Building2, Plus, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "motion/react";

export function BankingPage() {
  // Mock: exceptions requiring attention
  const exceptions = [
    {
      id: "1",
      severity: "high",
      title: "14 unmatched transactions need review",
      description: "Unable to auto-match with 95%+ confidence",
      account: "Operating Account - BOA",
      amount: "$8,450.00"
    }
  ];

  const hasExceptions = exceptions.length > 0;

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header with Goal Context */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Banking</h1>
          <p className="text-gray-600">Bank accounts and transaction monitoring</p>
          
          {/* Reconciliation Status - Zero-Day */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-green-700 font-medium">Last reconciled: 2 minutes ago</span>
          </div>
        </div>

        {hasExceptions ? (
          <>
            {/* Exception Queue */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Needs Your Attention</h2>
              <div className="space-y-4">
                {exceptions.map((exception, idx) => (
                  <motion.div
                    key={exception.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{exception.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-2">{exception.description}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          {exception.account} • {exception.amount}
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                          Review Transactions
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Connected Accounts - Only show if relevant */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Accounts</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                        BOA
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Bank of America</div>
                        <div className="text-sm text-gray-600">Operating Account</div>
                      </div>
                    </div>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-1 inline-block">
                    14 items need review
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                        TD
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">TD Bank</div>
                        <div className="text-sm text-gray-600">IOLTA Trust</div>
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-xs text-green-600 bg-green-50 rounded px-2 py-1 inline-block">
                    All current
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* All Clear State */
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All Transactions Reconciled</h2>
            <p className="text-gray-600 mb-6">
              Matching Agent has reconciled all bank transactions. No exceptions need review.
            </p>
            <Button 
              variant="outline"
              className="border-gray-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Connect Another Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}