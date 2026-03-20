import * as React from "react";
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Shield,
  BarChart3,
  PieChart,
  FileCheck,
  ExternalLink,
  Printer
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'compliance' | 'trust';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'requires-review';
  icon: React.ComponentType<{ className?: string }>;
  auditReady: boolean;
}

export function AccountingReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState("current-month");
  
  const reports: Report[] = [
    {
      id: "pl",
      name: "Profit & Loss Statement",
      description: "Income and expenses for the selected period",
      type: "financial",
      lastGenerated: "2024-07-20",
      status: "ready",
      icon: TrendingUp,
      auditReady: true
    },
    {
      id: "balance-sheet", 
      name: "Balance Sheet",
      description: "Assets, liabilities, and equity snapshot",
      type: "financial",
      lastGenerated: "2024-07-20",
      status: "ready",
      icon: BarChart3,
      auditReady: true
    },
    {
      id: "trust-ledger",
      name: "Trust Account Ledger",
      description: "Detailed trust account transactions and balances",
      type: "trust",
      lastGenerated: "2024-07-20", 
      status: "ready",
      icon: Shield,
      auditReady: true
    },
    {
      id: "trust-reconciliation",
      name: "Trust Reconciliation Report",
      description: "Monthly trust account reconciliation for state compliance",
      type: "compliance",
      lastGenerated: "2024-06-30",
      status: "requires-review",
      icon: FileCheck,
      auditReady: false
    },
    {
      id: "client-ledger",
      name: "Client Ledger Detail",
      description: "Individual client trust balances and activity",
      type: "trust",
      lastGenerated: "2024-07-20",
      status: "ready",
      icon: PieChart,
      auditReady: true
    },
    {
      id: "iolta-summary",
      name: "IOLTA Summary Report",
      description: "Interest earned and distributed on trust accounts",
      type: "compliance",
      lastGenerated: "2024-06-30",
      status: "ready",
      icon: FileText,
      auditReady: true
    }
  ];

  const getStatusBadge = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Ready</Badge>;
      case 'generating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Generating</Badge>;
      case 'requires-review':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Requires Review</Badge>;
    }
  };

  const filteredReports = reports.filter(report => {
    // You could add filtering logic here if needed
    return true;
  });

  const ComplianceStatus = () => (
    <Card className="mb-6 border-green-200 bg-green-50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-green-800">Audit-Ready Reports Available</CardTitle>
            <CardDescription className="text-green-600">
              All reports meet Massachusetts state bar requirements
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            100% Compliant
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-800">5</div>
            <div className="text-sm text-green-600">Reports Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-800">1</div>
            <div className="text-sm text-green-600">Needs Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-800">July 31</div>
            <div className="text-sm text-green-600">Next Deadline</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ReportCard = ({ report }: { report: Report }) => (
    <Card className="hover:shadow-lg transition-shadow bg-white shadow-md border-0">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            report.type === 'financial' ? 'accounting-blue-bg' :
            report.type === 'trust' ? 'bg-green-500' : 
            'accounting-peach-gradient'
          }`}>
            <report.icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-base text-gray-900">{report.name}</CardTitle>
              {report.auditReady && (
                <Badge variant="outline" className="text-xs px-2 py-0 border-gray-300 text-gray-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Audit-ready
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm text-gray-600">{report.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge(report.status)}
            <Badge 
              variant="outline" 
              className={`text-xs px-2 py-0 ${
                report.type === 'compliance' ? 'border-red-200 text-red-600' :
                report.type === 'trust' ? 'border-green-200 text-green-600' :
                'border-blue-200 text-blue-600'
              }`}
            >
              {report.type === 'compliance' ? 'Compliance' :
               report.type === 'trust' ? 'Trust' : 'Financial'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button size="sm" className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white">
              Generate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const SubmissionPortal = () => (
    <Card className="border-blue-200 bg-blue-50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 accounting-black-gradient rounded-xl flex items-center justify-center">
            <FileCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-blue-800">State Bar Submission Portal</CardTitle>
            <CardDescription className="text-blue-600">
              Submit compliance reports directly to Massachusetts State Bar
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2 text-gray-900">Pre-submission Validation</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Trust ledger reconciliation complete</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">IOLTA interest calculations verified</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Client balances validated</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">All required signatures obtained</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button className="flex-1 accounting-blue-bg hover:bg-[#1C60FF]/90 text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Submit to State Bar
            </Button>
            <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export Package
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-1 flex-col py-6 px-5 space-y-6 accounting-white-bg">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 accounting-peach-gradient rounded-full opacity-5 blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 accounting-black-gradient rounded-full opacity-5 blur-3xl transform -translate-x-24 translate-y-24"></div>
      </div>

      <div className="relative z-10 space-y-6">
        <ComplianceStatus />
        
        {/* Period Selection */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Financial Reports</h2>
            <p className="text-sm text-gray-600">Generate audit-ready financial statements and compliance reports</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="current-month">Current Month (July 2024)</SelectItem>
                  <SelectItem value="last-month">Last Month (June 2024)</SelectItem>
                  <SelectItem value="current-quarter">Current Quarter (Q3 2024)</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter (Q2 2024)</SelectItem>
                  <SelectItem value="year-to-date">Year to Date (2024)</SelectItem>
                  <SelectItem value="last-year">Last Year (2023)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All Reports</TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-white">Financial</TabsTrigger>
            <TabsTrigger value="trust" className="data-[state=active]:bg-white">Trust</TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-white">Compliance</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredReports
                .filter(report => report.type === 'financial')
                .map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="trust" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredReports
                .filter(report => report.type === 'trust')
                .map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {filteredReports
                .filter(report => report.type === 'compliance')
                .map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
            </div>
          </TabsContent>
        </Tabs>

        <SubmissionPortal />
      </div>
    </div>
  );
}