import * as React from "react";
import { 
  Search, 
  Filter, 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Bot,
  Sparkles,
  ChevronRight,
  Building,
  CreditCard,
  Plus
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  account: string;
  category?: string;
  status: 'auto-categorized' | 'needs-review' | 'pending-approval';
  vendor?: string;
  aiSuggestion?: string;
  confidence?: number;
}

export function AccountingTransactionsPage() {
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2024-07-20",
      description: "Johnson & Associates - Legal Services",
      amount: 2450.00,
      account: "Operating",
      status: "needs-review",
      vendor: "Johnson & Associates",
      aiSuggestion: "Professional Services - Legal Consultation"
    },
    {
      id: "2", 
      date: "2024-07-19",
      description: "Office Depot - Office Supplies",
      amount: -89.50,
      account: "Operating",
      category: "Office Supplies",
      status: "auto-categorized",
      vendor: "Office Depot",
      confidence: 95
    },
    {
      id: "3",
      date: "2024-07-19", 
      description: "State Bar Association - Annual Dues",
      amount: -450.00,
      account: "Operating",
      category: "Professional Fees",
      status: "auto-categorized",
      vendor: "State Bar Association",
      confidence: 98
    },
    {
      id: "4",
      date: "2024-07-18",
      description: "Client Deposit - Smith v. Johnson",
      amount: 5000.00,
      account: "Trust",
      status: "pending-approval",
      aiSuggestion: "Trust Deposit - Client Advance"
    },
    {
      id: "5",
      date: "2024-07-18",
      description: "LexisNexis - Research Subscription",
      amount: -299.00,
      account: "Operating", 
      category: "Technology & Software",
      status: "auto-categorized",
      vendor: "LexisNexis",
      confidence: 92
    },
    {
      id: "6",
      date: "2024-07-17",
      description: "Wilson Marketing LLC - Marketing Services",
      amount: -1200.00,
      account: "Operating",
      category: "Marketing & Business Development",
      status: "auto-categorized",
      vendor: "Wilson Marketing LLC",
      confidence: 88
    }
  ];

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'auto-categorized':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Auto-categorized</Badge>;
      case 'needs-review':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Needs Review</Badge>;
      case 'pending-approval':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Pending Approval</Badge>;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'auto-categorized':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'needs-review':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'pending-approval':
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (selectedTab === "auto-categorized") return t.status === "auto-categorized";
    if (selectedTab === "needs-review") return t.status === "needs-review";
    if (selectedTab === "pending-approval") return t.status === "pending-approval";
    return true;
  });

  const AutomationSummary = () => (
    <Card className="mb-6 bg-white shadow-lg border-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 accounting-black-gradient rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-gray-900">AI Automation Summary</CardTitle>
            <CardDescription className="text-gray-600">Your transactions have been automatically processed</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-semibold text-blue-600 mb-1">97</div>
            <div className="text-sm text-gray-600">Auto-categorized</div>
            <div className="text-xs text-green-600 mt-1">+15 from yesterday</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-orange-600 mb-1">2</div>
            <div className="text-sm text-gray-600">Need review</div>
            <div className="text-xs text-orange-600 mt-1">AI suggestions ready</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-semibold text-blue-600 mb-1">1</div>
            <div className="text-sm text-gray-600">Pending approval</div>
            <div className="text-xs text-blue-600 mt-1">Trust transaction</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AISuggestionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card className="border-blue-200 bg-blue-50 mt-2 shadow-sm">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 accounting-blue-bg rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">AI Suggestion</span>
            </div>
            <p className="text-sm text-blue-700 mb-3">{transaction.aiSuggestion}</p>
            <div className="flex gap-2">
              <Button size="sm" className="h-7 px-3 text-xs accounting-blue-bg hover:bg-[#1C60FF]/90 text-white">
                Accept & Create Rule
              </Button>
              <Button variant="outline" size="sm" className="h-7 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50">
                Accept Once
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-3 text-xs text-gray-600 hover:bg-gray-100">
                Suggest Different
              </Button>
            </div>
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
        <AutomationSummary />

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white border-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all-accounts">
              <SelectTrigger className="w-40 bg-white border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="all-accounts">All Accounts</SelectItem>
                <SelectItem value="operating">Operating</SelectItem>
                <SelectItem value="trust">Trust</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">All Transactions (100)</TabsTrigger>
            <TabsTrigger value="auto-categorized" className="data-[state=active]:bg-white">Auto-categorized (97)</TabsTrigger>
            <TabsTrigger value="needs-review" className="data-[state=active]:bg-white">Needs Review (2)</TabsTrigger>
            <TabsTrigger value="pending-approval" className="data-[state=active]:bg-white">Pending Approval (1)</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            <Card className="bg-white shadow-lg border-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-900">Status</TableHead>
                    <TableHead className="text-gray-900">Date</TableHead>
                    <TableHead className="text-gray-900">Description</TableHead>
                    <TableHead className="text-gray-900">Amount</TableHead>
                    <TableHead className="text-gray-900">Account</TableHead>
                    <TableHead className="text-gray-900">Category</TableHead>
                    <TableHead className="text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>
                      <TableRow className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            {getStatusBadge(transaction.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-900">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{transaction.description}</div>
                            {transaction.vendor && (
                              <div className="flex items-center gap-2 mt-1">
                                <Building className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-500">{transaction.vendor}</span>
                                {transaction.confidence && (
                                  <Badge variant="outline" className="text-xs px-1 py-0 border-gray-300 text-gray-600">
                                    {transaction.confidence}% confident
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={transaction.amount > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                            ${Math.abs(transaction.amount).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-900">{transaction.account}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {transaction.category ? (
                            <Badge variant="outline" className="border-gray-300 text-gray-700">{transaction.category}</Badge>
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {transaction.status === 'needs-review' ? (
                            <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                              Review
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          ) : transaction.status === 'pending-approval' ? (
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                              Approve
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      {transaction.status === 'needs-review' && transaction.aiSuggestion && (
                        <TableRow>
                          <TableCell colSpan={7} className="p-0">
                            <AISuggestionCard transaction={transaction} />
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}