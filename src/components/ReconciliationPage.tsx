"use client";

import * as React from "react";
import {
  TrendingUp,
  TrendingDown,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Calendar,
  Target,
  Zap,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { AccountDetailSheet } from "./AccountDetailSheet";
import { PendingReconciliationPanel } from "./PendingReconciliationPanel";

// Mock data for the dashboard
const dashboardMetrics = {
  totalFunds: {
    amount: 324000,
    change: 6.2,
    trend: "up"
  },
  transactionsImported: {
    count: 84,
    subtitle: "Since your last session"
  },
  automatedMatching: {
    percentage: 91,
    matched: 512,
    total: 562
  },
  pendingReconciliation: {
    total: 23,
    breakdown: [
      { type: "Needs Review", count: 8 },
      { type: "Missing Docs", count: 5 },
      { type: "Client Disputes", count: 4 },
      { type: "Approval Needed", count: 6 }
    ],
    completion: 92
  }
};

const chartOfAccounts = [
  {
    id: "operating",
    name: "Operating Account",
    balance: 125480.00,
    progress: 85,
    confidence: 92,
    status: "on-track",
    hasWarning: false,
    lastUpdated: "2 hours ago"
  },
  {
    id: "trust",
    name: "Client Trust Account",
    balance: 245000.00,
    progress: 100,
    confidence: 98,
    status: "complete",
    hasWarning: false,
    lastUpdated: "1 hour ago"
  },
  {
    id: "iolta",
    name: "IOLTA Trust Account",
    balance: 89350.00,
    progress: 67,
    confidence: 88,
    status: "needs-attention",
    hasWarning: true,
    lastUpdated: "30 minutes ago"
  },
  {
    id: "payroll",
    name: "Payroll Account",
    balance: 32000.00,
    progress: 95,
    confidence: 94,
    status: "on-track",
    hasWarning: false,
    lastUpdated: "3 hours ago"
  },
  {
    id: "savings",
    name: "Business Savings",
    balance: 75000.00,
    progress: 78,
    confidence: 85,
    status: "on-track",
    hasWarning: false,
    lastUpdated: "1 hour ago"
  },
  {
    id: "retainer",
    name: "Client Retainer Trust",
    balance: 156780.00,
    progress: 45,
    confidence: 76,
    status: "behind",
    hasWarning: true,
    lastUpdated: "4 hours ago"
  }
];

const aiInsights = {
  summary: "Most accounts are on track for this month's reconciliation. Trust Account is fully reconciled with high confidence. 3 low-confidence matches require your review.",
  warnings: [
    {
      type: "compliance",
      message: "1 trust transfer lacks supporting invoice. Review required.",
      severity: "high",
      account: "IOLTA Trust Account"
    }
  ],
  recommendations: [
    "Consider reviewing Client Retainer Trust transactions from the past week",
    "AI has flagged 2 unusual transaction patterns for your attention"
  ]
};

const MetricCard = ({ title, value, subtitle, trend, icon: Icon, className = "", onClick }) => {
  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <div className={`flex items-center gap-1 text-sm ${
                  trend.type === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.type === 'up' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  <span>{trend.value}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {Icon && (
            <div className="p-3 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const PendingReconciliationCard = ({ data, onClick }) => {
  return (
    <Card 
      className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">Pending Reconciliation</p>
            </div>
            
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-orange-600">{data.total}</p>
              <div className="flex items-center gap-1 text-sm text-orange-600">
                <Clock className="h-4 w-4" />
                <span>items remaining</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress to 100%</span>
                <span className="font-medium">{data.completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${data.completion}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="ml-4 p-3 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AccountTile = ({ account, onClick }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'text-green-600 bg-green-50';
      case 'on-track': return 'text-blue-600 bg-blue-50';
      case 'needs-attention': return 'text-orange-600 bg-orange-50';
      case 'behind': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 95) return 'bg-green-500';
    if (progress >= 80) return 'bg-blue-500';
    if (progress >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card 
      className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
      onClick={() => onClick(account)}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="font-semibold text-base">{account.name}</h3>
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

          {/* Progress Ring */}
          <div className="relative mt-[0px] mr-[0px] mb-[4px] ml-[0px]">
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
  );
};

const AIInsightCard = ({ insight, type = "summary" }) => {
  return (
    <Card className="transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">
            {type === "summary" ? "AI Summary" : "Compliance Alert"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {insight}
        </p>
      </CardContent>
    </Card>
  );
};

export function ReconciliationPage() {
  const [selectedAccount, setSelectedAccount] = React.useState(null);
  const [isAccountDetailOpen, setIsAccountDetailOpen] = React.useState(false);
  const [isPendingPanelOpen, setIsPendingPanelOpen] = React.useState(false);

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    setIsAccountDetailOpen(true);
  };

  const handleCloseAccountDetail = () => {
    setIsAccountDetailOpen(false);
    // Clear selected account after animation completes
    setTimeout(() => {
      setSelectedAccount(null);
    }, 300);
  };

  const handlePendingReconciliationClick = () => {
    setIsPendingPanelOpen(true);
  };

  const handleClosePendingPanel = () => {
    setIsPendingPanelOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-6 px-5 py-6 overflow-y-auto h-full px-[20px] py-[10px]">
        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PendingReconciliationCard
            data={dashboardMetrics.pendingReconciliation}
            onClick={handlePendingReconciliationClick}
          />
          
          <MetricCard
            title="Total Funds In"
            value={`$${dashboardMetrics.totalFunds.amount.toLocaleString()}`}
            subtitle="+6.2% vs. last month"
            trend={{ type: 'up', value: '+6.2%' }}
            icon={TrendingUp}
          />
          
          <MetricCard
            title="Transactions Imported"
            value={`${dashboardMetrics.transactionsImported.count} new`}
            subtitle={dashboardMetrics.transactionsImported.subtitle}
            icon={Download}
          />
          
          <MetricCard
            title="Auto-Matched"
            value={`${dashboardMetrics.automatedMatching.percentage}%`}
            subtitle={`${dashboardMetrics.automatedMatching.matched} of ${dashboardMetrics.automatedMatching.total} transactions`}
            icon={Zap}
          />
        </div>

        {/* Chart of Accounts Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mt-[0px] mr-[0px] mb-[10px] ml-[0px]">
            <h2 className="text-xl font-semibold">Account Overview</h2>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Chart of Accounts
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chartOfAccounts.map((account) => (
              <AccountTile
                key={account.id}
                account={account}
                onClick={handleAccountClick}
              />
            ))}
          </div>
        </div>

        {/* AI Insights and Compliance Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">AI Insights</h2>
            <AIInsightCard insight={aiInsights.summary} type="summary" />
            
            {aiInsights.recommendations.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base">Recommendations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {aiInsights.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Compliance Status</h2>
            {aiInsights.warnings.map((warning, index) => (
              <Card key={index} className="border-orange-200 bg-orange-50/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-base text-orange-900">
                      {warning.severity === 'high' ? 'High Priority' : 'Attention Required'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-orange-800 mb-2">{warning.message}</p>
                  <Badge variant="outline" className="text-xs text-orange-700 border-orange-300">
                    {warning.account}
                  </Badge>
                </CardContent>
              </Card>
            ))}

            {/* Trust Account Compliance Card */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-base text-green-900">Trust Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-green-800">
                  All trust accounts are properly segregated and reconciled. IOLTA reporting requirements are current.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>

      {/* Account Detail Sheet */}
      <AccountDetailSheet
        account={selectedAccount}
        isOpen={isAccountDetailOpen}
        onClose={handleCloseAccountDetail}
      />

      {/* Pending Reconciliation Panel */}
      <PendingReconciliationPanel
        isOpen={isPendingPanelOpen}
        onClose={handleClosePendingPanel}
      />
    </>
  );
}