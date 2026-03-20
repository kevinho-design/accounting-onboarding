"use client";

import * as React from "react";
import { X, Plus, Play, BarChart3, TrendingUp, AlertTriangle, CheckCircle, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";

interface ScenarioResult {
  cashFlowImpact: number;
  profitProjection: number;
  utilizationChange: number;
  confidenceScore: number;
  paybackPeriod: number;
  riskFactors: string[];
  projections: Array<{
    month: string;
    baseline: number;
    scenario: number;
  }>;
}

interface ScenarioPlanningProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScenarioPlanning({ isOpen, onClose }: ScenarioPlanningProps) {
  const [role, setRole] = React.useState("");
  const [salary, setSalary] = React.useState("");
  const [expectedLeads, setExpectedLeads] = React.useState("");
  const [billingRate, setBillingRate] = React.useState("");
  const [practiceArea, setPracticeArea] = React.useState("");
  const [timeframe, setTimeframe] = React.useState("12");
  const [results, setResults] = React.useState<ScenarioResult | null>(null);

  // Mock projection data
  const projectionData = [
    { month: "Month 1", baseline: 203000, scenario: 198000 },
    { month: "Month 2", baseline: 208000, scenario: 215000 },
    { month: "Month 3", baseline: 212000, scenario: 235000 },
    { month: "Month 4", baseline: 218000, scenario: 258000 },
    { month: "Month 5", baseline: 225000, scenario: 275000 },
    { month: "Month 6", baseline: 230000, scenario: 295000 },
    { month: "Month 7", baseline: 235000, scenario: 315000 },
    { month: "Month 8", baseline: 240000, scenario: 335000 },
    { month: "Month 9", baseline: 245000, scenario: 355000 },
    { month: "Month 10", baseline: 250000, scenario: 375000 },
    { month: "Month 11", baseline: 255000, scenario: 395000 },
    { month: "Month 12", baseline: 260000, scenario: 415000 },
  ];

  const runScenario = () => {
    // Mock calculation - in reality this would be AI-powered analysis
    const mockResults: ScenarioResult = {
      cashFlowImpact: 278000,
      profitProjection: 35,
      utilizationChange: 12,
      confidenceScore: 87,
      paybackPeriod: 4.2,
      riskFactors: [
        "Market competition may affect client acquisition",
        "Regulatory changes in immigration law",
        "Training and onboarding time required"
      ],
      projections: projectionData
    };
    
    setResults(mockResults);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Scenario Planning Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-full">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Scenario Planning</h2>
                <p className="text-sm text-gray-500">Model business decisions and their financial impact</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden min-h-0">
            <div className="flex h-full min-h-0">
              {/* Input Panel */}
              <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto min-h-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Scenario Inputs</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Define the parameters for your business scenario to get AI-powered projections.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="practice-area">Practice Area</Label>
                      <Select value={practiceArea} onValueChange={setPracticeArea}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select practice area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immigration">Immigration Law</SelectItem>
                          <SelectItem value="family">Family Law</SelectItem>
                          <SelectItem value="corporate">Corporate Law</SelectItem>
                          <SelectItem value="personal-injury">Personal Injury</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role to hire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="associate">Associate Attorney</SelectItem>
                          <SelectItem value="senior-associate">Senior Associate</SelectItem>
                          <SelectItem value="partner">Partner</SelectItem>
                          <SelectItem value="paralegal">Paralegal</SelectItem>
                          <SelectItem value="legal-assistant">Legal Assistant</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="salary">Annual Salary</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="salary"
                          type="text"
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          placeholder="85,000"
                          className="pl-7"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="billing-rate">Billing Rate (per hour)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          id="billing-rate"
                          type="text"
                          value={billingRate}
                          onChange={(e) => setBillingRate(e.target.value)}
                          placeholder="350"
                          className="pl-7"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="expected-leads">Expected Monthly Leads</Label>
                      <Input
                        id="expected-leads"
                        type="text"
                        value={expectedLeads}
                        onChange={(e) => setExpectedLeads(e.target.value)}
                        placeholder="15"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeframe">Analysis Timeframe</Label>
                      <Select value={timeframe} onValueChange={setTimeframe}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    onClick={runScenario}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={!role || !salary || !billingRate || !expectedLeads}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Run Scenario Analysis
                  </Button>
                </div>
              </div>

              {/* Results Panel */}
              <div className="flex-1 p-6 overflow-y-auto min-h-0">
                {!results ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center space-y-4">
                      <div className="p-4 bg-gray-50 rounded-full w-fit mx-auto">
                        <BarChart3 className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Ready to analyze</h3>
                        <p className="text-sm text-gray-500">
                          Fill in the scenario parameters and click "Run Scenario Analysis" to see the results.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Results Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">Scenario Results</h3>
                        <p className="text-sm text-gray-600">
                          AI-powered analysis for {practiceArea} expansion with new {role}
                        </p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          results.confidenceScore >= 80 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {results.confidenceScore}% confidence
                      </Badge>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">Cash Flow Impact</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900">
                            +${results.cashFlowImpact.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Annual projection</p>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">Profit Increase</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900">
                            +{results.profitProjection}%
                          </p>
                          <p className="text-xs text-gray-500">Year over year</p>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-600">Utilization Change</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900">
                            +{results.utilizationChange}%
                          </p>
                          <p className="text-xs text-gray-500">Firm-wide impact</p>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-medium text-gray-600">Payback Period</span>
                          </div>
                          <p className="text-xl font-bold text-gray-900">
                            {results.paybackPeriod} months
                          </p>
                          <p className="text-xs text-gray-500">Break-even timeline</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Projection Chart */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Cash Flow Projection</CardTitle>
                        <p className="text-sm text-gray-600">
                          Comparison between baseline and scenario outcomes
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={results.projections}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis 
                                dataKey="month" 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6b7280' }}
                                tickFormatter={(value) => `$${value / 1000}K`}
                              />
                              <Line
                                type="monotone"
                                dataKey="baseline"
                                stroke="#9ca3af"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                name="Baseline"
                              />
                              <Line
                                type="monotone"
                                dataKey="scenario"
                                stroke="#16a34a"
                                strokeWidth={3}
                                name="With Expansion"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Risk Factors */}
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          <CardTitle className="text-lg">Risk Factors</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {results.riskFactors.map((risk, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">{risk}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}