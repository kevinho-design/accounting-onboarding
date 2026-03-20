import * as React from "react";
import { 
  X, 
  Search, 
  Filter, 
  CheckCircle, 
  Circle, 
  CreditCard, 
  Building,
  DollarSign,
  Shield,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'trust' | 'operating' | 'expense' | 'revenue';
  balance: number;
  accountNumber: string;
  isSelected: boolean;
  isExcluded: boolean;
  lastTransaction?: string;
  description?: string;
}

interface FinancialSource {
  id: string;
  name: string;
  type: 'bank' | 'accounting';
  status: 'connected' | 'disconnected' | 'error';
  accountCount?: number;
}

interface AccountSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: FinancialSource;
  onAccountsUpdated?: (accounts: Account[]) => void;
}

// Mock account data based on source type
const generateMockAccounts = (source: FinancialSource): Account[] => {
  if (source.type === 'bank') {
    return [
      {
        id: 'acc_1',
        name: 'Business Checking',
        type: 'checking',
        balance: 45280.50,
        accountNumber: '****4281',
        isSelected: true,
        isExcluded: false,
        lastTransaction: '2024-01-15',
        description: 'Primary business checking account'
      },
      {
        id: 'acc_2',
        name: 'Trust Account - IOLTA',
        type: 'trust',
        balance: 128500.00,
        accountNumber: '****7392',
        isSelected: true,
        isExcluded: false,
        lastTransaction: '2024-01-14',
        description: 'Client trust funds - IOLTA compliant'
      },
      {
        id: 'acc_3',
        name: 'Business Savings',
        type: 'savings',
        balance: 15750.25,
        accountNumber: '****8934',
        isSelected: false,
        isExcluded: true,
        lastTransaction: '2024-01-10',
        description: 'Emergency fund savings account'
      }
    ];
  } else {
    return [
      {
        id: 'qb_1',
        name: 'Checking Account',
        type: 'operating',
        balance: 45280.50,
        accountNumber: '1001',
        isSelected: true,
        isExcluded: false,
        description: 'Main operating account'
      },
      {
        id: 'qb_2',
        name: 'Trust Liability',
        type: 'trust',
        balance: 128500.00,
        accountNumber: '2001',
        isSelected: true,
        isExcluded: false,
        description: 'Trust account liability tracking'
      },
      {
        id: 'qb_3',
        name: 'Legal Fees Revenue',
        type: 'revenue',
        balance: 89450.00,
        accountNumber: '4001',
        isSelected: true,
        isExcluded: false,
        description: 'Revenue from legal services'
      },
      {
        id: 'qb_4',
        name: 'Office Expenses',
        type: 'expense',
        balance: -12450.50,
        accountNumber: '5001',
        isSelected: true,
        isExcluded: false,
        description: 'Office rent, utilities, supplies'
      },
      {
        id: 'qb_5',
        name: 'Marketing Expenses',
        type: 'expense',
        balance: -3200.00,
        accountNumber: '5002',
        isSelected: false,
        isExcluded: true,
        description: 'Marketing and advertising costs'
      },
      {
        id: 'qb_6',
        name: 'Professional Development',
        type: 'expense',
        balance: -1800.00,
        accountNumber: '5003',
        isSelected: true,
        isExcluded: false,
        description: 'Continuing education and training'
      },
      {
        id: 'qb_7',
        name: 'Equipment Purchases',
        type: 'expense',
        balance: -8500.00,
        accountNumber: '5004',
        isSelected: false,
        isExcluded: false,
        description: 'Computer equipment and furniture'
      },
      {
        id: 'qb_8',
        name: 'Interest Income',
        type: 'revenue',
        balance: 450.75,
        accountNumber: '4002',
        isSelected: true,
        isExcluded: false,
        description: 'Interest earned on deposits'
      }
    ];
  }
};

export function AccountSelectionModal({ isOpen, onClose, source, onAccountsUpdated }: AccountSelectionModalProps) {
  const [accounts, setAccounts] = React.useState<Account[]>(() => generateMockAccounts(source));
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");
  const [showExcluded, setShowExcluded] = React.useState(true);

  const handleToggleAccount = (accountId: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, isSelected: !account.isSelected }
        : account
    ));
  };

  const handleExcludeAccount = (accountId: string) => {
    setAccounts(prev => prev.map(account => 
      account.id === accountId 
        ? { ...account, isExcluded: !account.isExcluded, isSelected: account.isExcluded ? true : false }
        : account
    ));
  };

  const handleSelectAll = () => {
    setAccounts(prev => prev.map(account => ({ 
      ...account, 
      isSelected: !account.isExcluded 
    })));
  };

  const handleDeselectAll = () => {
    setAccounts(prev => prev.map(account => ({ 
      ...account, 
      isSelected: false 
    })));
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || account.type === filterType;
    const matchesVisibility = showExcluded || !account.isExcluded;
    
    return matchesSearch && matchesType && matchesVisibility;
  });

  const selectedCount = accounts.filter(acc => acc.isSelected && !acc.isExcluded).length;
  const excludedCount = accounts.filter(acc => acc.isExcluded).length;
  const totalCount = accounts.length;

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking':
      case 'operating':
        return <Building className="w-5 h-5" />;
      case 'trust':
        return <Shield className="w-5 h-5" />;
      case 'savings':
        return <DollarSign className="w-5 h-5" />;
      case 'credit':
        return <CreditCard className="w-5 h-5" />;
      case 'revenue':
        return <DollarSign className="w-5 h-5" />;
      case 'expense':
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getAccountTypeColor = (type: Account['type']) => {
    switch (type) {
      case 'checking':
      case 'operating':
        return 'accounting-blue-bg';
      case 'trust':
        return 'bg-green-500';
      case 'savings':
        return 'bg-purple-500';
      case 'credit':
        return 'bg-orange-500';
      case 'revenue':
        return 'bg-green-500';
      case 'expense':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAccountTypeBadge = (type: Account['type']) => {
    const colors = {
      checking: 'bg-blue-100 text-blue-800 border-blue-200',
      operating: 'bg-blue-100 text-blue-800 border-blue-200',
      trust: 'bg-green-100 text-green-800 border-green-200',
      savings: 'bg-purple-100 text-purple-800 border-purple-200',
      credit: 'bg-orange-100 text-orange-800 border-orange-200',
      revenue: 'bg-green-100 text-green-800 border-green-200',
      expense: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge variant="outline" className={colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const AccountCard = ({ account }: { account: Account }) => (
    <Card className={`transition-all duration-200 ${
      account.isExcluded 
        ? 'bg-gray-50 border-gray-200 opacity-60' 
        : account.isSelected 
          ? 'bg-blue-50 border-blue-200 shadow-sm' 
          : 'bg-white border-gray-200 hover:shadow-md'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex items-center pt-1">
            <Checkbox
              checked={account.isSelected && !account.isExcluded}
              onCheckedChange={() => handleToggleAccount(account.id)}
              disabled={account.isExcluded}
              className="data-[state=checked]:accounting-blue-bg data-[state=checked]:border-[#1C60FF]"
            />
          </div>
          
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getAccountTypeColor(account.type)}`}>
            {getAccountIcon(account.type)}
            <span className="text-white sr-only">{account.type}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className={`font-medium ${account.isExcluded ? 'text-gray-500' : 'text-gray-900'}`}>
                {account.name}
              </h4>
              {getAccountTypeBadge(account.type)}
            </div>
            
            <p className={`text-sm ${account.isExcluded ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {account.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm">
              <span className={account.isExcluded ? 'text-gray-400' : 'text-gray-600'}>
                Account: {account.accountNumber}
              </span>
              <span className={`font-medium ${
                account.balance >= 0 
                  ? (account.isExcluded ? 'text-gray-400' : 'text-green-600')
                  : (account.isExcluded ? 'text-gray-400' : 'text-red-600')
              }`}>
                ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              {account.lastTransaction && (
                <span className={account.isExcluded ? 'text-gray-400' : 'text-gray-500'}>
                  Last: {new Date(account.lastTransaction).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            {!account.isExcluded ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExcludeAccount(account.id)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Exclude
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExcludeAccount(account.id)}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Eye className="w-4 h-4 mr-1" />
                Include
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl h-[95vh] max-h-[95vh] overflow-hidden bg-white p-0 flex flex-col">
        <DialogHeader className="border-b border-gray-200 pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-gray-900">
                {source.name} - Account Selection
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                Select which accounts to sync with your Clio Accounting system
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-white border-gray-200"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48 bg-white border-gray-200">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="all">All Types</SelectItem>
                  {source.type === 'bank' ? (
                    <>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="trust">Trust</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="operating">Operating</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="trust">Trust</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExcluded(!showExcluded)}
                className={`border-gray-300 ${
                  showExcluded 
                    ? 'text-gray-700 hover:bg-gray-50' 
                    : 'text-gray-500 bg-gray-50'
                }`}
              >
                {showExcluded ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                {showExcluded ? 'Hide' : 'Show'} Excluded
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>{selectedCount} selected</span>
            <span>{excludedCount} excluded</span>
            <span>{totalCount} total accounts</span>
          </div>
        </div>

        {/* Account List */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {filteredAccounts.length > 0 ? (
            <div className="space-y-3">
              {filteredAccounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {selectedCount} of {totalCount - excludedCount} accounts will be synced
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  onAccountsUpdated?.(accounts);
                  onClose();
                }} 
                className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white"
              >
                Confirm Selection
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}