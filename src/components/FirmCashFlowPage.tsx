"use client";

import * as React from "react";
import { FirmCashFlowChart } from "./FirmCashFlowChart";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  FileText,
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";

const kpiData = [
  {
    title: "Utilization Rate",
    value: "78.5%",
    change: 5.2,
    isPositive: true,
    icon: TrendingUp,
    description: "Billed hours vs total hours",
  },
  {
    title: "Avg Hourly Rate",
    value: "$385",
    change: 3.8,
    isPositive: true,
    icon: DollarSign,
    description: "Revenue per billed hour",
  },
  {
    title: "Collection Rate",
    value: "94.2%",
    change: -1.5,
    isPositive: false,
    icon: FileText,
    description: "Collected vs billed revenue",
  },
  {
    title: "Hours per Matter",
    value: "42.3",
    change: 8.1,
    isPositive: true,
    icon: Clock,
    description: "Average hours per active matter",
  },
];

export function FirmCashFlowPage() {
  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-auto bg-gray-50">
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          {kpiData.map((kpi) => {
            const IconComponent = kpi.icon;
            return (
              <Card key={kpi.title} className="bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <IconComponent className="h-4 w-4 text-blue-600" />
                      </div>
                      <CardTitle className="text-sm font-medium text-gray-600">
                        {kpi.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="text-2xl font-semibold text-gray-900">
                      {kpi.value}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${
                        kpi.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {kpi.isPositive ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        <span className="text-sm font-medium">
                          {Math.abs(kpi.change)}%
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                    <p className="text-xs text-gray-500">{kpi.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Cash Flow Chart */}
        <FirmCashFlowChart />

        {/* Additional Insights */}
        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Practice Area Performance
              </CardTitle>
              <p className="text-sm text-gray-500">
                Revenue breakdown by practice area this month
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { area: "Corporate Law", revenue: 245000, hours: 650, percentage: 42 },
                { area: "Litigation", revenue: 189000, hours: 520, percentage: 32 },
                { area: "Real Estate", revenue: 98000, hours: 280, percentage: 17 },
                { area: "Employment", revenue: 52000, hours: 145, percentage: 9 },
              ].map((item) => (
                <div key={item.area} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-500 rounded-full" style={{
                      backgroundColor: item.area === 'Corporate Law' ? '#3b82f6' :
                                      item.area === 'Litigation' ? '#10b981' :
                                      item.area === 'Real Estate' ? '#f59e0b' : '#ef4444'
                    }}></div>
                    <div>
                      <div className="font-medium text-gray-900">{item.area}</div>
                      <div className="text-sm text-gray-500">{item.hours} hours</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      ${(item.revenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Monthly Trends
              </CardTitle>
              <p className="text-sm text-gray-500">
                Key metrics compared to previous periods
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { 
                  metric: "New Matters Opened", 
                  current: 23, 
                  previous: 19, 
                  unit: "matters"
                },
                { 
                  metric: "Average Days to Collection", 
                  current: 28, 
                  previous: 32, 
                  unit: "days",
                  isInverse: true
                },
                { 
                  metric: "Client Satisfaction Score", 
                  current: 4.7, 
                  previous: 4.5, 
                  unit: "/5.0"
                },
                { 
                  metric: "Attorney Productivity", 
                  current: 1650, 
                  previous: 1580, 
                  unit: "hrs/month"
                },
              ].map((item) => {
                const isImprovement = item.isInverse ? 
                  item.current < item.previous : 
                  item.current > item.previous;
                const change = item.isInverse ?
                  ((item.previous - item.current) / item.previous * 100) :
                  ((item.current - item.previous) / item.previous * 100);

                return (
                  <div key={item.metric} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{item.metric}</div>
                      <div className="text-sm text-gray-500">
                        {item.current}{item.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="secondary"
                        className={`${
                          isImprovement 
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {isImprovement ? '+' : ''}{change.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}