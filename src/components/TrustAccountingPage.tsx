import * as React from "react";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Bot,
  Sparkles,
  ChevronRight,
  Building,
  User,
  DollarSign,
  FileText
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";

interface TrustTransaction {
  id: string;
  date: string;
  client: string;
  matter: string;
  description: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending-approval' | 'approved' | 'flagged';
  balance: number;
  complianceNote?: string;
}

export function TrustAccountingPage() {
  const [selectedTab, setSelectedTab] = React.useState("pending");
  const [showBulkApproval, setShowBulkApproval] = React.useState(false);

  const trustTransactions: TrustTransaction[] = [
    {
      id: "1",
      date: "2024-07-20",
      client: "Smith, John",
      matter: "Smith v. Johnson - Personal Injury",
      description: "Client advance payment",
      amount: 5000.00,
      type: "deposit",
      status: "pending-approval",
      balance: 15000.00
    },
    {
      id: "2",
      date: "2024-07-19",
      client: "Wilson, Sarah",
      matter: "Wilson Estate Planning",
      description: "Retainer deposit",
      amount: 2500.00,
      type: "deposit", 
      status: "approved",
      balance: 10000.00
    },
    {
      id: "3",
      date: "2024-07-18",
      client: "Johnson Corp",
      matter: "Corporate Restructuring",
      description: "Legal fees payment",
      amount: -3500.00,
      type: "withdrawal",
      status: "flagged",
      balance: 7500.00,
      complianceNote: "Missing invoice reference - Required for MA trust rules"
    },
    {
      id: "4",
      date: "2024-07-17",
      client: "Davis, Michael",
      matter: "Davis Bankruptcy Filing",
      description: "Court filing fees advance",
      amount: 1200.00,
      type: "deposit",
      status: "approved",
      balance: 11000.00
    }
  ];

  const getStatusBadge = (status: TrustTransaction['status']) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'pending-approval':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Pending Approval</Badge>;
      case 'flagged':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Flagged</Badge>;
    }
  };

  const getStatusIcon = (status: TrustTransaction['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending-approval':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const filteredTransactions = trustTransactions.filter(t => {
    if (selectedTab === "pending") return t.status === "pending-approval";
    if (selectedTab === "approved") return t.status === "approved";
    if (selectedTab === "flagged") return t.status === "flagged";
    return true;
  });

  const ComplianceSummary = () => (
    <Card className="mb-6 bg-white shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-gray-900">Trust Compliance Status</CardTitle>
            <CardDescription className="text-gray-600">Massachusetts IOLTA requirements - All systems compliant</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Compliant
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-semibold text-green-600 mb-1">$128,500</div>
            <div className="text-sm text-gray-600">Total Trust Balance</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-orange-600 mb-1">34</div>
            <div className="text-sm text-gray-600">Pending Approval</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setShowBulkApproval(true)}
            >
              Bulk Approve
            </Button>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-blue-600 mb-1">156</div>
            <div className="text-sm text-gray-600">Transactions This Month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-red-600 mb-1">1</div>
            <div className="text-sm text-gray-600">Compliance Issues</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AIBookkeeperPanel = () => (
    <Card className="border-blue-200 bg-blue-50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 accounting-blue-bg rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-blue-800">AI Bookkeeper</CardTitle>
            <CardDescription className="text-blue-600">
              Trust compliance assistant and transaction insights
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-orange-800">
              <strong>Compliance Flag:</strong> Johnson Corp withdrawal missing invoice reference. 
              Massachusetts requires invoice documentation for all trust withdrawals.
              <Button variant="link" className="p-0 h-auto text-orange-800 underline ml-2">
                Add Invoice Reference
              </Button>
            </AlertDescription>
          </Alert>
          
          <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
            <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 mb-2">
                <strong>AI Suggestion:</strong> I notice 34 routine trust deposits are ready for bulk approval. 
                All have proper documentation and client matter assignments.
              </p>
              <Button size="sm" className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white" onClick={() => setShowBulkApproval(true)}>
                Review & Approve All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BulkApprovalModal = () => {
    if (!showBulkApproval) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-2xl bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-gray-900">Bulk Approve Trust Transactions</CardTitle>
            <CardDescription className="text-gray-600">
              Review and approve 34 trust transactions in one action
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Pre-approval Validation Complete</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• All transactions have proper client/matter assignments</li>
                  <li>• Documentation requirements satisfied</li>
                  <li>• IOLTA compliance rules validated</li>
                  <li>• No suspicious activity detected</li>
                </ul>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={() => setShowBulkApproval(false)} className="flex-1 accounting-blue-bg hover:bg-[#1C60FF]/90 text-white">
                  Approve All 34 Transactions
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowBulkApproval(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Review Individually
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col py-6 px-5 space-y-6 accounting-white-bg">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 accounting-peach-gradient rounded-full opacity-5 blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 accounting-black-gradient rounded-full opacity-5 blur-3xl transform -translate-x-24 translate-y-24"></div>
      </div>

      <div className="relative z-10 space-y-6">
        <ComplianceSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6 bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-white">All Transactions</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-white">Pending Approval (34)</TabsTrigger>
                <TabsTrigger value="flagged" className="data-[state=active]:bg-white">Flagged (1)</TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-white">Recently Approved</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab}>
                <Card className="bg-white shadow-lg border-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-gray-900">Status</TableHead>
                        <TableHead className="text-gray-900">Date</TableHead>
                        <TableHead className="text-gray-900">Client & Matter</TableHead>
                        <TableHead className="text-gray-900">Description</TableHead>
                        <TableHead className="text-gray-900">Amount</TableHead>
                        <TableHead className="text-gray-900">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(transaction.status)}
                              {getStatusBadge(transaction.status)}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-900">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-gray-500" />
                                <span className="font-medium text-sm text-gray-900">{transaction.client}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <FileText className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-500">{transaction.matter}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-sm text-gray-900">{transaction.description}</div>
                              {transaction.complianceNote && (
                                <div className="text-xs text-red-600 mt-1">
                                  {transaction.complianceNote}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-right">
                              <div className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                                {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                Balance: ${transaction.balance.toLocaleString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {transaction.status === 'pending-approval' ? (
                              <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                                Approve
                              </Button>
                            ) : transaction.status === 'flagged' ? (
                              <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                                Resolve
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                                View
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <AIBookkeeperPanel />
          </div>
        </div>
        
        <BulkApprovalModal />
      </div>
    </div>
  );
}