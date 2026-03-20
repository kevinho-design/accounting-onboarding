"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend,
  Cell,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  PiggyBank,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Globe,
  Calendar,
  ChevronUp,
  Download,
} from "lucide-react";
import { Button } from "./ui/button";

// Chart data for revenue over time
const revenueData = [
  {
    month: "Jan",
    revenue: 65000,
    expenses: 45000,
  },
  {
    month: "Feb",
    revenue: 59000,
    expenses: 42000,
  },
  {
    month: "Mar",
    revenue: 80000,
    expenses: 48000,
  },
  {
    month: "Apr",
    revenue: 81000,
    expenses: 52000,
  },
  {
    month: "May",
    revenue: 56000,
    expenses: 40000,
  },
  {
    month: "Jun",
    revenue: 55000,
    expenses: 38000,
  },
  {
    month: "Jul",
    revenue: 40000,
    expenses: 35000,
  },
];

// Stacked bar chart data for practice areas
const practiceAreasData = [
  {
    name: 'Jan',
    familyLaw: 120,
    realEstate: 80,
    corporateLaw: 150,
    tax: 90,
  },
  {
    name: 'Feb',
    familyLaw: 100,
    realEstate: 120,
    corporateLaw: 130,
    tax: 70,
  },
  {
    name: 'Mar',
    familyLaw: 90,
    realEstate: 60,
    corporateLaw: 140,
    tax: 110,
  },
  {
    name: 'Apr',
    familyLaw: 130,
    realEstate: 90,
    corporateLaw: 120,
    tax: 85,
  },
  {
    name: 'May',
    familyLaw: 70,
    realEstate: 45,
    corporateLaw: 80,
    tax: 50,
  },
];

// Colors for the stacked bars matching the reference image
const colors = {
  familyLaw: '#1f2937', // Dark gray/black
  realEstate: '#8b5cf6', // Purple
  corporateLaw: '#06b6d4', // Cyan
  tax: '#3b82f6', // Blue
};

export function FirmFinancesDashboard() {
  // Calculate totals for KPIs
  const totalCases = practiceAreasData.reduce((sum, month) => 
    sum + month.familyLaw + month.realEstate + month.corporateLaw + month.tax, 0
  );
  
  const totalPracticeAreas = 4;
  const averageCasesPerMonth = Math.round(totalCases / practiceAreasData.length);

  return (
    <div className="flex flex-1 flex-col min-h-0 overflow-auto bg-gray-50">
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div>
              <div className="mb-2">
                <h4 className="text-gray-900">Total Revenue</h4>
              </div>
              <div className="space-y-1">
                <p className="text-2xl text-gray-900">$486,420</p>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">12.5% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div>
              <div className="mb-2">
                <h4 className="text-gray-900">Outstanding</h4>
              </div>
              <div className="space-y-1">
                <p className="text-2xl text-gray-900">$124,380</p>
                <div className="flex items-center gap-1">
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">3.2% from last month</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div>
              <div className="mb-2">
                <h4 className="text-gray-900">Expenses</h4>
              </div>
              <div>
                <p className="text-2xl text-gray-900">$89,245</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div>
              <div className="mb-2">
                <h4 className="text-gray-900">Net Profit</h4>
              </div>
              <div>
                <p className="text-2xl text-gray-900">$397,175</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-gray-900 text-lg mb-6">Revenue Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Practice Areas Stacked Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-gray-900 text-lg font-medium mb-2">Practice Areas Revenue</h3>
              <p className="text-gray-500 text-sm">Bar chart showing revenue distribution across practice areas</p>
            </div>
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-md">
                  <Users className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cases</p>
                  <p className="font-semibold">{totalCases.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-md">
                  <Building2 className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Areas</p>
                  <p className="font-semibold">{totalPracticeAreas}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-white rounded-md">
                  <Calendar className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg/Month</p>
                  <p className="font-semibold">{averageCasesPerMonth}</p>
                </div>
              </div>
            </div>

            {/* Stacked Bar Chart */}
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={practiceAreasData}
                  margin={{
                    top: 20,
                    right: 0,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9ca3af"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="familyLaw" stackId="a" fill={colors.familyLaw} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="realEstate" stackId="a" fill={colors.realEstate} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="corporateLaw" stackId="a" fill={colors.corporateLaw} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="tax" stackId="a" fill={colors.tax} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.familyLaw }}></div>
                <span className="text-sm text-gray-600">Family Law</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.realEstate }}></div>
                <span className="text-sm text-gray-600">Real Estate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.corporateLaw }}></div>
                <span className="text-sm text-gray-600">Corporate Law</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.tax }}></div>
                <span className="text-sm text-gray-600">Tax</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                <ChevronUp className="h-4 w-4" />
                Less details
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-600">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Recent Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-gray-600 text-lg font-medium mb-6">Recent Clients</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">TC</span>
                  </div>
                  <span className="text-gray-600">TechCorp Inc.</span>
                </div>
                <span className="text-sm text-gray-400">2 days ago</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-medium">GL</span>
                  </div>
                  <span className="text-gray-600">Global LLC</span>
                </div>
                <span className="text-sm text-gray-400">3 days ago</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-medium">SE</span>
                  </div>
                  <span className="text-gray-600">Smith Enterprises</span>
                </div>
                <span className="text-sm text-gray-400">5 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}