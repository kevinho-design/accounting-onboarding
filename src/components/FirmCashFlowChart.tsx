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
  Legend,
} from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

// Generate mock data for different time periods
const generateDailyData = () => {
  const data = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const baseHours = 160 + Math.random() * 40;
    const billedHours = baseHours * (0.75 + Math.random() * 0.2);
    const revenue = billedHours * (350 + Math.random() * 100);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      fullDate: date.toISOString().split('T')[0],
      firmHoursWorked: Math.round(baseHours),
      billedHours: Math.round(billedHours),
      collectedRevenue: Math.round(revenue / 100), // Scale down for better visualization
    });
  }
  return data;
};

const generateMonthlyData = () => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < 12; i++) {
    const baseHours = 3200 + Math.random() * 800;
    const billedHours = baseHours * (0.78 + Math.random() * 0.15);
    const revenue = billedHours * (365 + Math.random() * 85);
    
    data.push({
      date: months[i],
      fullDate: `2024-${String(i + 1).padStart(2, '0')}`,
      firmHoursWorked: Math.round(baseHours),
      billedHours: Math.round(billedHours),
      collectedRevenue: Math.round(revenue / 100), // Scale down for better visualization
    });
  }
  return data;
};

const generateQuarterlyData = () => {
  const data = [];
  const quarters = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'];
  
  for (let i = 0; i < 4; i++) {
    const baseHours = 9600 + Math.random() * 2400;
    const billedHours = baseHours * (0.8 + Math.random() * 0.12);
    const revenue = billedHours * (375 + Math.random() * 75);
    
    data.push({
      date: quarters[i],
      fullDate: `2024-Q${i + 1}`,
      firmHoursWorked: Math.round(baseHours),
      billedHours: Math.round(billedHours),
      collectedRevenue: Math.round(revenue / 100), // Scale down for better visualization
    });
  }
  return data;
};

type TimePeriod = 'daily' | 'monthly' | 'quarterly';

interface MetricVisibility {
  firmHoursWorked: boolean;
  billedHours: boolean;
  collectedRevenue: boolean;
}

export function FirmCashFlowChart() {
  const [timePeriod, setTimePeriod] = React.useState<TimePeriod>('monthly');
  const [metricVisibility, setMetricVisibility] = React.useState<MetricVisibility>({
    firmHoursWorked: true,
    billedHours: true,
    collectedRevenue: true,
  });

  const getData = () => {
    switch (timePeriod) {
      case 'daily':
        return generateDailyData();
      case 'monthly':
        return generateMonthlyData();
      case 'quarterly':
        return generateQuarterlyData();
      default:
        return generateMonthlyData();
    }
  };

  const data = getData();

  const toggleMetric = (metric: keyof MetricVisibility) => {
    setMetricVisibility(prev => ({
      ...prev,
      [metric]: !prev[metric]
    }));
  };

  const formatTooltipValue = (value: number, name: string) => {
    const metricNames = {
      firmHoursWorked: 'Firm Hours Worked',
      billedHours: 'Billed Hours',
      collectedRevenue: 'Collected Revenue (Scaled)'
    };
    
    const displayName = metricNames[name as keyof typeof metricNames] || name;
    
    if (name === 'collectedRevenue') {
      return [`${value.toLocaleString()}`, displayName];
    }
    return [`${value.toLocaleString()} hours`, displayName];
  };

  // Calculate total revenue in original scale for display
  const totalRevenueActual = data.reduce((sum, item) => sum + (item.collectedRevenue * 100), 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Firm Cash Flow Analysis
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Track firm hours, billing efficiency, and revenue collection over time
            </p>
          </div>
          
          {/* Time Period Controls */}
          <div className="flex bg-gray-50 rounded-lg p-1">
            {[
              { key: 'daily', label: 'Daily' },
              { key: 'monthly', label: 'Monthly' },
              { key: 'quarterly', label: 'Quarterly' }
            ].map((period) => (
              <Button
                key={period.key}
                variant="ghost"
                size="sm"
                onClick={() => setTimePeriod(period.key as TimePeriod)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timePeriod === period.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Metric Visibility Controls */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="firm-hours"
              checked={metricVisibility.firmHoursWorked}
              onCheckedChange={() => toggleMetric('firmHoursWorked')}
            />
            <Label htmlFor="firm-hours" className="flex items-center gap-2 cursor-pointer">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Firm Hours Worked</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="billed-hours"
              checked={metricVisibility.billedHours}
              onCheckedChange={() => toggleMetric('billedHours')}
            />
            <Label htmlFor="billed-hours" className="flex items-center gap-2 cursor-pointer">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Billed Hours</span>
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="collected-revenue"
              checked={metricVisibility.collectedRevenue}
              onCheckedChange={() => toggleMetric('collectedRevenue')}
            />
            <Label htmlFor="collected-revenue" className="flex items-center gap-2 cursor-pointer">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">Collected Revenue</span>
            </Label>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-blue-700">
              {data.reduce((sum, item) => sum + item.firmHoursWorked, 0).toLocaleString()}
            </div>
            <div className="text-sm text-blue-600">Total Firm Hours</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-green-700">
              {data.reduce((sum, item) => sum + item.billedHours, 0).toLocaleString()}
            </div>
            <div className="text-sm text-green-600">Total Billed Hours</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-purple-700">
              ${(totalRevenueActual / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-purple-600">Total Revenue</div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                domain={[0, 'dataMax']}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                formatter={formatTooltipValue}
                labelStyle={{ color: '#64748b', fontWeight: 500 }}
              />
              
              {metricVisibility.firmHoursWorked && (
                <Line
                  type="monotone"
                  dataKey="firmHoursWorked"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                />
              )}
              
              {metricVisibility.billedHours && (
                <Line
                  type="monotone"
                  dataKey="billedHours"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              )}
              
              {metricVisibility.collectedRevenue && (
                <Line
                  type="monotone"
                  dataKey="collectedRevenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#8b5cf6' }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex justify-center">
          <div className="flex items-center gap-6 text-sm">
            {metricVisibility.firmHoursWorked && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-blue-500"></div>
                <span className="text-gray-600">Firm Hours Worked</span>
              </div>
            )}
            {metricVisibility.billedHours && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-green-500"></div>
                <span className="text-gray-600">Billed Hours</span>
              </div>
            )}
            {metricVisibility.collectedRevenue && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-purple-500"></div>
                <span className="text-gray-600">Collected Revenue</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}