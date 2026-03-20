"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, MessageSquare, ChevronRight, BarChart3, Users, DollarSign, Target, Lightbulb, Bot, Calendar, Filter, LineChart as LineChartIcon, Building2, AlertTriangle, CheckCircle, TrendingUp as GrowthIcon, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Tooltip as RechartsTooltip } from "recharts";
import { AnimatedText } from "./AnimatedText";
import { StrategicOpportunityCard } from "./StrategicOpportunityCard";
import { QuickActionsPills } from "./QuickActionsPills";
import { FirmLawyersWidget } from "./FirmLawyersWidget";
import { FirmLeadsWidget } from "./FirmLeadsWidget";

// Mock data for different practice areas and time periods
const practiceAreaData = {
  "all": {
    weekly: [
      { period: "Week 1", actual: 52000, forecast: null, income: 65000, expenses: 13000 },
      { period: "Week 2", actual: 48000, forecast: null, income: 61000, expenses: 13000 },
      { period: "Week 3", actual: 55000, forecast: null, income: 68000, expenses: 13000 },
      { period: "Week 4", actual: 51000, forecast: null, income: 64000, expenses: 13000 },
      { period: "Week 5", actual: null, forecast: 56000, income: 69000, expenses: 13000 },
      { period: "Week 6", actual: null, forecast: 58000, income: 71000, expenses: 13000 },
      { period: "Week 7", actual: null, forecast: 61000, income: 74000, expenses: 13000 },
      { period: "Week 8", actual: null, forecast: 59000, income: 72000, expenses: 13000 },
    ],
    monthly: [
      { period: "Jan", actual: 145000, forecast: null, income: 170000, expenses: 25000 },
      { period: "Feb", actual: 167000, forecast: null, income: 195000, expenses: 28000 },
      { period: "Mar", actual: 189000, forecast: null, income: 220000, expenses: 31000 },
      { period: "Apr", actual: 156000, forecast: null, income: 185000, expenses: 29000 },
      { period: "May", actual: 178000, forecast: null, income: 210000, expenses: 32000 },
      { period: "Jun", actual: 203000, forecast: 203000, income: 235000, expenses: 32000 },
      { period: "Jul", actual: null, forecast: 225000, income: 260000, expenses: 35000 },
      { period: "Aug", actual: null, forecast: 241000, income: 278000, expenses: 37000 },
      { period: "Sep", actual: null, forecast: 268000, income: 308000, expenses: 40000 },
      { period: "Oct", actual: null, forecast: 285000, income: 330000, expenses: 45000 },
      { period: "Nov", actual: null, forecast: 302000, income: 352000, expenses: 50000 },
      { period: "Dec", actual: null, forecast: 318000, income: 375000, expenses: 57000 },
    ],
    quarterly: [
      { period: "Q1 2024", actual: 501000, forecast: null, income: 585000, expenses: 84000 },
      { period: "Q2 2024", actual: 537000, forecast: 537000, income: 630000, expenses: 93000 },
      { period: "Q3 2024", actual: null, forecast: 734000, income: 846000, expenses: 112000 },
      { period: "Q4 2024", actual: null, forecast: 905000, income: 1057000, expenses: 152000 },
    ]
  },
  "immigration": {
    weekly: [
      { period: "Week 1", actual: 18000, forecast: null, income: 22000, expenses: 4000 },
      { period: "Week 2", actual: 16000, forecast: null, income: 20000, expenses: 4000 },
      { period: "Week 3", actual: 19000, forecast: null, income: 23000, expenses: 4000 },
      { period: "Week 4", actual: 17000, forecast: null, income: 21000, expenses: 4000 },
      { period: "Week 5", actual: null, forecast: 20000, income: 24000, expenses: 4000 },
      { period: "Week 6", actual: null, forecast: 22000, income: 26000, expenses: 4000 },
      { period: "Week 7", actual: null, forecast: 24000, income: 28000, expenses: 4000 },
      { period: "Week 8", actual: null, forecast: 23000, income: 27000, expenses: 4000 },
    ],
    monthly: [
      { period: "Jan", actual: 42000, forecast: null, income: 50000, expenses: 8000 },
      { period: "Feb", actual: 48000, forecast: null, income: 57000, expenses: 9000 },
      { period: "Mar", actual: 54000, forecast: null, income: 64000, expenses: 10000 },
      { period: "Apr", actual: 46000, forecast: null, income: 55000, expenses: 9000 },
      { period: "May", actual: 52000, forecast: null, income: 62000, expenses: 10000 },
      { period: "Jun", actual: 58000, forecast: 58000, income: 69000, expenses: 11000 },
      { period: "Jul", actual: null, forecast: 65000, income: 77000, expenses: 12000 },
      { period: "Aug", actual: null, forecast: 71000, income: 84000, expenses: 13000 },
      { period: "Sep", actual: null, forecast: 78000, income: 92000, expenses: 14000 },
      { period: "Oct", actual: null, forecast: 85000, income: 100000, expenses: 15000 },
      { period: "Nov", actual: null, forecast: 92000, income: 108000, expenses: 16000 },
      { period: "Dec", actual: null, forecast: 98000, income: 115000, expenses: 17000 },
    ],
    quarterly: [
      { period: "Q1 2024", actual: 144000, forecast: null, income: 171000, expenses: 27000 },
      { period: "Q2 2024", actual: 156000, forecast: 156000, income: 186000, expenses: 30000 },
      { period: "Q3 2024", actual: null, forecast: 214000, income: 253000, expenses: 39000 },
      { period: "Q4 2024", actual: null, forecast: 275000, income: 323000, expenses: 48000 },
    ]
  },
  "family": {
    weekly: [
      { period: "Week 1", actual: 15000, forecast: null, income: 18000, expenses: 3000 },
      { period: "Week 2", actual: 14000, forecast: null, income: 17000, expenses: 3000 },
      { period: "Week 3", actual: 16000, forecast: null, income: 19000, expenses: 3000 },
      { period: "Week 4", actual: 15000, forecast: null, income: 18000, expenses: 3000 },
      { period: "Week 5", actual: null, forecast: 16000, income: 19000, expenses: 3000 },
      { period: "Week 6", actual: null, forecast: 17000, income: 20000, expenses: 3000 },
      { period: "Week 7", actual: null, forecast: 18000, income: 21000, expenses: 3000 },
      { period: "Week 8", actual: null, forecast: 17000, income: 20000, expenses: 3000 },
    ],
    monthly: [
      { period: "Jan", actual: 38000, forecast: null, income: 45000, expenses: 7000 },
      { period: "Feb", actual: 42000, forecast: null, income: 50000, expenses: 8000 },
      { period: "Mar", actual: 46000, forecast: null, income: 55000, expenses: 9000 },
      { period: "Apr", actual: 40000, forecast: null, income: 48000, expenses: 8000 },
      { period: "May", actual: 44000, forecast: null, income: 53000, expenses: 9000 },
      { period: "Jun", actual: 48000, forecast: 48000, income: 58000, expenses: 10000 },
      { period: "Jul", actual: null, forecast: 52000, income: 62000, expenses: 10000 },
      { period: "Aug", actual: null, forecast: 56000, income: 67000, expenses: 11000 },
      { period: "Sep", actual: null, forecast: 60000, income: 72000, expenses: 12000 },
      { period: "Oct", actual: null, forecast: 64000, income: 77000, expenses: 13000 },
      { period: "Nov", actual: null, forecast: 68000, income: 82000, expenses: 14000 },
      { period: "Dec", actual: null, forecast: 72000, income: 87000, expenses: 15000 },
    ],
    quarterly: [
      { period: "Q1 2024", actual: 126000, forecast: null, income: 150000, expenses: 24000 },
      { period: "Q2 2024", actual: 132000, forecast: 132000, income: 159000, expenses: 27000 },
      { period: "Q3 2024", actual: null, forecast: 168000, income: 201000, expenses: 33000 },
      { period: "Q4 2024", actual: null, forecast: 204000, income: 246000, expenses: 42000 },
    ]
  },
  "corporate": {
    weekly: [
      { period: "Week 1", actual: 12000, forecast: null, income: 15000, expenses: 3000 },
      { period: "Week 2", actual: 11000, forecast: null, income: 14000, expenses: 3000 },
      { period: "Week 3", actual: 13000, forecast: null, income: 16000, expenses: 3000 },
      { period: "Week 4", actual: 12000, forecast: null, income: 15000, expenses: 3000 },
      { period: "Week 5", actual: null, forecast: 13000, income: 16000, expenses: 3000 },
      { period: "Week 6", actual: null, forecast: 14000, income: 17000, expenses: 3000 },
      { period: "Week 7", actual: null, forecast: 15000, income: 18000, expenses: 3000 },
      { period: "Week 8", actual: null, forecast: 14000, income: 17000, expenses: 3000 },
    ],
    monthly: [
      { period: "Jan", actual: 35000, forecast: null, income: 42000, expenses: 7000 },
      { period: "Feb", actual: 38000, forecast: null, income: 46000, expenses: 8000 },
      { period: "Mar", actual: 42000, forecast: null, income: 51000, expenses: 9000 },
      { period: "Apr", actual: 36000, forecast: null, income: 44000, expenses: 8000 },
      { period: "May", actual: 40000, forecast: null, income: 49000, expenses: 9000 },
      { period: "Jun", actual: 44000, forecast: 44000, income: 54000, expenses: 10000 },
      { period: "Jul", actual: null, forecast: 48000, income: 58000, expenses: 10000 },
      { period: "Aug", actual: null, forecast: 52000, income: 63000, expenses: 11000 },
      { period: "Sep", actual: null, forecast: 56000, income: 68000, expenses: 12000 },
      { period: "Oct", actual: null, forecast: 60000, income: 73000, expenses: 13000 },
      { period: "Nov", actual: null, forecast: 64000, income: 78000, expenses: 14000 },
      { period: "Dec", actual: null, forecast: 68000, income: 83000, expenses: 15000 },
    ],
    quarterly: [
      { period: "Q1 2024", actual: 115000, forecast: null, income: 139000, expenses: 24000 },
      { period: "Q2 2024", actual: 120000, forecast: 120000, income: 147000, expenses: 27000 },
      { period: "Q3 2024", actual: null, forecast: 156000, income: 189000, expenses: 33000 },
      { period: "Q4 2024", actual: null, forecast: 192000, income: 234000, expenses: 42000 },
    ]
  },
  "tax": {
    weekly: [
      { period: "Week 1", actual: 7000, forecast: null, income: 10000, expenses: 3000 },
      { period: "Week 2", actual: 7000, forecast: null, income: 10000, expenses: 3000 },
      { period: "Week 3", actual: 7000, forecast: null, income: 10000, expenses: 3000 },
      { period: "Week 4", actual: 7000, forecast: null, income: 10000, expenses: 3000 },
      { period: "Week 5", actual: null, forecast: 7000, income: 10000, expenses: 3000 },
      { period: "Week 6", actual: null, forecast: 5000, income: 8000, expenses: 3000 },
      { period: "Week 7", actual: null, forecast: 4000, income: 7000, expenses: 3000 },
      { period: "Week 8", actual: null, forecast: 5000, income: 8000, expenses: 3000 },
    ],
    monthly: [
      { period: "Jan", actual: 30000, forecast: null, income: 33000, expenses: 3000 },
      { period: "Feb", actual: 39000, forecast: null, income: 42000, expenses: 3000 },
      { period: "Mar", actual: 47000, forecast: null, income: 50000, expenses: 3000 },
      { period: "Apr", actual: 34000, forecast: null, income: 38000, expenses: 4000 },
      { period: "May", actual: 42000, forecast: null, income: 46000, expenses: 4000 },
      { period: "Jun", actual: 53000, forecast: 53000, income: 54000, expenses: 1000 },
      { period: "Jul", actual: null, forecast: 60000, income: 63000, expenses: 3000 },
      { period: "Aug", actual: null, forecast: 62000, income: 64000, expenses: 2000 },
      { period: "Sep", actual: null, forecast: 74000, income: 76000, expenses: 2000 },
      { period: "Oct", actual: null, forecast: 76000, income: 80000, expenses: 4000 },
      { period: "Nov", actual: null, forecast: 78000, income: 84000, expenses: 6000 },
      { period: "Dec", actual: null, forecast: 80000, income: 90000, expenses: 10000 },
    ],
    quarterly: [
      { period: "Q1 2024", actual: 116000, forecast: null, income: 125000, expenses: 9000 },
      { period: "Q2 2024", actual: 129000, forecast: 129000, income: 138000, expenses: 9000 },
      { period: "Q3 2024", actual: null, forecast: 196000, income: 203000, expenses: 7000 },
      { period: "Q4 2024", actual: null, forecast: 234000, income: 254000, expenses: 20000 },
    ]
  }
};

// Revenue data from AccountingDashboard
const revenueData = [
  { month: '12 Feb', gross: 65000, net: 45000 },
  { month: '12 Mar', gross: 72000, net: 52000 },
  { month: '5 Apr', gross: 68000, net: 48000 },
  { month: '7 May', gross: 75000, net: 55000 },
  { month: '11 Jun', gross: 82000, net: 62000 },
  { month: '8 Jul', gross: 78000, net: 58000 },
  { month: '13 Aug', gross: 85000, net: 65000 },
  { month: '10 Sept', gross: 88000, net: 68000 },
  { month: '8 Oct', gross: 92000, net: 72000 },
  { month: '12 Nov', gross: 95000, net: 75000 },
  { month: '10 Dec', gross: 98000, net: 78000 },
  { month: '2 Jan', gross: 102000, net: 82000 },
];

interface AICFODashboardProps {
  onOpenChat: () => void;
  onOpenScenario: () => void;
  onNavigateToAccounting: () => void;
}

export function AICFODashboard({ onOpenChat, onOpenScenario, onNavigateToAccounting }: AICFODashboardProps) {
  const [timeframe, setTimeframe] = React.useState("month");
  const [chartType, setChartType] = React.useState("line");
  const [practiceArea, setPracticeArea] = React.useState("all");
  const [scrollProgress, setScrollProgress] = React.useState(0);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const animatedPhrases = [
    "Show me my firm's financial snapshot",
    "Who are our collection bottlenecks",
    "Should we offer Immigration law"
  ];

  // Scroll animation setup
  React.useEffect(() => {
    const container = containerRef.current;
    const header = headerRef.current;
    
    if (!container || !header) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const progress = 1 - entry.intersectionRatio;
          setScrollProgress(progress);
        });
      },
      {
        root: container,
        threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0 to 1 in 0.01 increments
        rootMargin: "0px"
      }
    );

    observer.observe(header);

    return () => {
      observer.disconnect();
    };
  }, []);

  const getChartData = () => {
    const timeframeKey = timeframe === "week" ? "weekly" : timeframe === "quarter" ? "quarterly" : "monthly";
    return practiceAreaData[practiceArea as keyof typeof practiceAreaData][timeframeKey];
  };

  const getPracticeAreaLabel = (area: string) => {
    switch (area) {
      case "all":
        return "All Practice Areas";
      case "immigration":
        return "Immigration Law";
      case "family":
        return "Family Law";
      case "corporate":
        return "Corporate Law";
      case "tax":
        return "Tax Law";
      default:
        return "All Practice Areas";
    }
  };

  // Handler functions for interactions  
  const handleLawyerChat = (lawyerId: number) => {
    console.log(`Opening chat with lawyer ${lawyerId}`);
    onOpenChat();
  };

  const handleViewMatters = (lawyerId: number) => {
    console.log(`Viewing matters for lawyer ${lawyerId}`);
    // Could navigate to matters page with lawyer filter
  };

  const handleViewAllLeads = () => {
    console.log("Viewing all leads");
    // Could navigate to leads page
  };

  // Smart insights analysis function
  const generateInsights = (dataPoint: any, allData: any[], practiceArea: string) => {
    const insights = [];
    const currentValue = dataPoint.actual || dataPoint.forecast;
    const income = dataPoint.income;
    const expenses = dataPoint.expenses;
    
    // Calculate average for comparison
    const values = allData.map(d => d.actual || d.forecast).filter(Boolean);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const previousIndex = allData.findIndex(d => d.period === dataPoint.period) - 1;
    const previousValue = previousIndex >= 0 ? (allData[previousIndex].actual || allData[previousIndex].forecast) : null;

    // Cash flow shortage detection
    if (currentValue < 20000 && practiceArea === "all") {
      insights.push({
        type: "warning",
        icon: AlertTriangle,
        message: "Cash flow below critical threshold",
        recommendation: "Consider accelerating collections or reducing expenses"
      });
    }

    if (currentValue < 8000 && practiceArea !== "all") {
      insights.push({
        type: "warning", 
        icon: AlertTriangle,
        message: "Low cash flow for this practice area",
        recommendation: "Review billing rates and collection efficiency"
      });
    }

    // Growth opportunity detection
    if (currentValue > average * 1.3) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        message: "Exceptional performance period",
        recommendation: "Analyze factors driving this success for replication"
      });
    }

    // Growth trend detection
    if (previousValue && currentValue > previousValue * 1.15) {
      insights.push({
        type: "growth",
        icon: GrowthIcon,
        message: `Strong growth: +${Math.round(((currentValue - previousValue) / previousValue) * 100)}%`,
        recommendation: "Consider scaling successful strategies"
      });
    }

    // Expense efficiency insights
    if (income && expenses) {
      const margin = ((income - expenses) / income) * 100;
      if (margin > 85) {
        insights.push({
          type: "success",
          icon: CheckCircle,
          message: `Excellent profit margin: ${margin.toFixed(1)}%`,
          recommendation: "Maintain current operational efficiency"
        });
      } else if (margin < 60) {
        insights.push({
          type: "warning",
          icon: AlertTriangle,
          message: `Low profit margin: ${margin.toFixed(1)}%`,
          recommendation: "Review expense allocation and billing efficiency"
        });
      }
    }

    // Practice-specific insights
    if (practiceArea === "tax" && dataPoint.period === "Mar") {
      insights.push({
        type: "growth",
        icon: GrowthIcon,
        message: "Peak tax season performance",
        recommendation: "Prepare for seasonal demand patterns"
      });
    }

    if (practiceArea === "immigration" && currentValue > 70000) {
      insights.push({
        type: "success",
        icon: CheckCircle,
        message: "Immigration law showing strong demand",
        recommendation: "Consider expanding immigration practice capacity"
      });
    }

    return insights.slice(0, 2); // Limit to 2 insights per tooltip
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const insights = generateInsights(dataPoint, getChartData(), practiceArea);
      
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-900 mb-3">{label}</p>
          
          {/* Data Values */}
          <div className="space-y-2 mb-4">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 capitalize">{entry.dataKey}:</span>
                <span className="font-medium text-gray-900">
                  ${entry.value?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Smart Insights */}
          {insights.length > 0 && (
            <div className="border-t border-gray-100 pt-3 space-y-3">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                AI Insights
              </div>
              {insights.map((insight, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-start gap-2">
                    <insight.icon 
                      className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        insight.type === 'warning' ? 'text-amber-500' :
                        insight.type === 'success' ? 'text-green-500' :
                        'text-blue-500'
                      }`} 
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {insight.message}
                      </p>
                      <p className="text-xs text-gray-600">
                        {insight.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const data = getChartData();
    
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="period" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis 
              domain={[0, 500000]}
              tickCount={6}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `$${value / 1000}K`}
            />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="income" stackId="a" fill="#22c55e" name="Income" />
            <Bar dataKey="expenses" stackId="a" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="period" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 500000]}
            tickCount={6}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickFormatter={(value) => `$${value / 1000}K`}
          />
          <RechartsTooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#2563eb"
            fill="#2563eb"
            fillOpacity={0.1}
            strokeWidth={2}
            connectNulls={false}
          />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="#93c5fd"
            fill="#93c5fd"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
            connectNulls={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const getChartLegend = () => {
    if (chartType === "bar") {
      return (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span className="text-sm text-gray-600">Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
          <span className="text-sm text-gray-600">Forecast</span>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div ref={containerRef} className="flex-1 overflow-y-auto relative">
        {/* Header Section - Fades out on scroll */}
        <div 
          ref={headerRef}
          className="transition-all duration-[600ms] ease-out"
          style={{
            opacity: 1 - scrollProgress,
            transform: `translateY(${scrollProgress * -50}px)`,
          }}
        >
          <div className="py-8 px-5 space-y-8">
            {/* Clio Compass Header */}
            <div className="space-y-4">
              <h1 className="text-2xl font-medium text-gray-900 text-[48px] font-[Inter] pt-[80px] pr-[0px] pb-[0px] pl-[0px]">
                Welcome - I'm your AI Advisor. Ready to explore how your firm is doing or where it could grow next?
              </h1>
              <AnimatedText 
                phrases={animatedPhrases}
                className="text-lg text-blue-600 font-medium"
              />
              <div className="pt-2">
                {/* Quick Actions Pills */}
                <QuickActionsPills 
                  onOpenChat={onOpenChat}
                  onOpenScenario={onOpenScenario}
                />
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Slides over the header */}
        <div 
          ref={contentRef}
          className="bg-gray-50 transition-all duration-[600ms] ease-out relative z-10"
          style={{
            transform: `translateY(${-scrollProgress * 200}px)`,
          }}
        >
          <div className="px-5 pt-8 space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">


              {/* Total Revenue */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-normal text-[rgba(0,0,0,1)] font-[Inter] text-[14px] text-[13px]">Total Revenue</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="max-w-xs">
                          <p>The total amount of money earned by your firm from all sources during a specific period, before deducting expenses.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 text-[32px]">$341K</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">+8.2% vs last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Outstanding AR */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-normal text-[rgba(0,0,0,1)] font-[Inter] text-[14px] text-[13px]">Outstanding AR</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="max-w-xs">
                          <p>Accounts Receivable: Money owed to your firm by clients for work performed but not yet paid. Lower numbers indicate better cash flow.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 text-[32px]">$89K</p>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-600">+3.1% vs last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Average Days to Pay */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-normal text-[rgba(0,0,0,1)] font-[Inter] text-[14px] text-[13px]">Avg Days to Pay</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 text-gray-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="start" className="max-w-xs">
                          <p>The average number of days it takes for clients to pay their invoices. Lower numbers indicate faster payment and better cash flow.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 text-[32px]">32 days</p>
                    <div className="flex items-center gap-1">
                      <TrendingDown className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600">-2 days vs last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Analysis</h2>
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-gray-700" />
                      <CardTitle className="text-base font-medium text-gray-900">
                        {getPracticeAreaLabel(practiceArea)} Performance
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={practiceArea} onValueChange={setPracticeArea}>
                        <SelectTrigger className="w-40 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Practice Areas</SelectItem>
                          <SelectItem value="immigration">Immigration Law</SelectItem>
                          <SelectItem value="family">Family Law</SelectItem>
                          <SelectItem value="corporate">Corporate Law</SelectItem>
                          <SelectItem value="tax">Tax Law</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Tabs value={timeframe} onValueChange={setTimeframe} className="h-8">
                        <TabsList className="h-8">
                          <TabsTrigger value="week" className="text-xs px-3 h-7">Week</TabsTrigger>
                          <TabsTrigger value="month" className="text-xs px-3 h-7">Month</TabsTrigger>
                          <TabsTrigger value="quarter" className="text-xs px-3 h-7">Quarter</TabsTrigger>
                        </TabsList>
                      </Tabs>

                      <Tabs value={chartType} onValueChange={setChartType} className="h-8">
                        <TabsList className="h-8">
                          <TabsTrigger value="line" className="text-xs px-3 h-7">
                            <LineChartIcon className="h-3 w-3" />
                          </TabsTrigger>
                          <TabsTrigger value="bar" className="text-xs px-3 h-7">
                            <BarChart3 className="h-3 w-3" />
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {getChartLegend()}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    {renderChart()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue Chart Section - Greyed Out with CTA */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cash Flow</h2>
              <Card className="relative overflow-hidden border border-gray-200 shadow-sm">
                {/* Greyed out overlay */}
                <div className="absolute inset-0 bg-gray-100/80 z-10 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-16 h-16 mx-auto bg-gray-300 rounded-full flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Connect Bank Account</h3>
                      <p className="text-sm text-gray-600 max-w-sm">
                        Connect your bank account with Clio Accounting to see detailed cash flow analysis and trends over time.
                      </p>
                    </div>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={onNavigateToAccounting}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Connect Bank Account
                    </Button>
                  </div>
                </div>
                
                {/* Background chart content (greyed out) */}
                <CardContent className="p-6 opacity-30">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-sm text-gray-600">Gross Volume</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Net Volume</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="this-year" disabled>
                        <SelectTrigger className="w-32 h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="this-year">This year</SelectItem>
                          <SelectItem value="last-year">Last year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">$48,580</div>
                      <div className="text-sm text-green-600">+3.12% last year</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold text-gray-900">$29,540</div>
                      <div className="text-sm text-green-600">+1.56% last year</div>
                    </div>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <YAxis hide />
                        <Line 
                          type="monotone" 
                          dataKey="gross" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: '#2563eb' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="net" 
                          stroke="#9ca3af" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 4, fill: '#9ca3af' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strategic Opportunities - Full Width */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Strategic Opportunities</h2>
              <p className="text-sm text-gray-600 mb-6">
                AI-powered growth recommendations based on your firm's performance data and market trends.
              </p>
              <StrategicOpportunityCard
                title="Expand Immigration Practice"
                impact="High"
                effort="Medium"
                description="Current immigration cases show 34% higher margins than firm average. Market analysis suggests 45% growth potential in your region."
                metrics={{
                  revenue: "+$89K annually",
                  margin: "34% above average",
                  timeline: "6-8 months"
                }}
                onExplore={() => onOpenScenario()}
              />
            </div>

            {/* Firm Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FirmLawyersWidget 
                onChat={handleLawyerChat}
                onViewMatters={handleViewMatters}
              />
              <FirmLeadsWidget 
                onViewAll={handleViewAllLeads}
              />
            </div>

            {/* Bottom Padding */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}