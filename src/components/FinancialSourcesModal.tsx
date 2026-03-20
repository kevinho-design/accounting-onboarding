import * as React from "react";
import { 
  X, 
  Plus, 
  Building, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Search,
  ExternalLink,
  Settings
} from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { AccountSelectionModal } from "./AccountSelectionModal";

interface FinancialSource {
  id: string;
  name: string;
  type: 'bank' | 'accounting';
  logo?: string;
  status: 'connected' | 'disconnected' | 'error';
  accountCount?: number;
  lastSync?: string;
  category?: string;
}

interface FinancialSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSourcesUpdated?: (sources: FinancialSource[]) => void;
}

const AVAILABLE_BANKS = [
  { id: 'chase', name: 'Chase Bank', category: 'Major Banks' },
  { id: 'bank_of_america', name: 'Bank of America', category: 'Major Banks' },
  { id: 'wells_fargo', name: 'Wells Fargo', category: 'Major Banks' },
  { id: 'citi', name: 'Citibank', category: 'Major Banks' },
  { id: 'stripe', name: 'Stripe', category: 'Payment Processors' },
  { id: 'mercury', name: 'Mercury', category: 'Business Banking' },
  { id: 'silicon_valley_bank', name: 'Silicon Valley Bank', category: 'Business Banking' },
  { id: 'capital_one', name: 'Capital One', category: 'Major Banks' },
];

const AVAILABLE_ACCOUNTING_TOOLS = [
  { id: 'quickbooks', name: 'QuickBooks Online', category: 'Accounting Software' },
  { id: 'xero', name: 'Xero', category: 'Accounting Software' },
  { id: 'freshbooks', name: 'FreshBooks', category: 'Accounting Software' },
  { id: 'wave', name: 'Wave', category: 'Accounting Software' },
];

export function FinancialSourcesModal({ isOpen, onClose, onSourcesUpdated }: FinancialSourcesModalProps) {
  const [connectedSources, setConnectedSources] = React.useState<FinancialSource[]>([
    {
      id: 'chase_connected',
      name: 'Chase Bank',
      type: 'bank',
      status: 'connected',
      accountCount: 3,
      lastSync: '2024-01-15T10:30:00Z'
    },
    {
      id: 'quickbooks_connected',
      name: 'QuickBooks Online',
      type: 'accounting',
      status: 'connected',
      accountCount: 8,
      lastSync: '2024-01-15T09:45:00Z'
    },
    {
      id: 'wells_fargo_connected',
      name: 'Wells Fargo',
      type: 'bank',
      status: 'connected',
      accountCount: 2,
      lastSync: '2024-08-24T15:20:00Z'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isConnecting, setIsConnecting] = React.useState<string | null>(null);
  const [selectedSource, setSelectedSource] = React.useState<FinancialSource | null>(null);
  const [showAccountSelection, setShowAccountSelection] = React.useState(false);

  const handleConnectSource = async (sourceId: string, sourceName: string, type: 'bank' | 'accounting') => {
    setIsConnecting(sourceId);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newSource: FinancialSource = {
      id: `${sourceId}_connected`,
      name: sourceName,
      type,
      status: 'connected',
      accountCount: Math.floor(Math.random() * 5) + 1,
      lastSync: new Date().toISOString()
    };
    
    setConnectedSources(prev => [...prev, newSource]);
    setIsConnecting(null);
    
    // Open account selection for the newly connected source
    setSelectedSource(newSource);
    setShowAccountSelection(true);
  };

  const handleViewSource = (source: FinancialSource) => {
    setSelectedSource(source);
    setShowAccountSelection(true);
  };

  const handleDisconnectSource = (sourceId: string) => {
    setConnectedSources(prev => prev.filter(source => source.id !== sourceId));
  };

  const getStatusBadge = (status: FinancialSource['status']) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Error
          </Badge>
        );
      default:
        return null;
    }
  };

  const filteredBanks = AVAILABLE_BANKS.filter(bank => 
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !connectedSources.some(connected => connected.name === bank.name)
  );

  const filteredAccountingTools = AVAILABLE_ACCOUNTING_TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !connectedSources.some(connected => connected.name === tool.name)
  );

  const ConnectedSourceCard = ({ source }: { source: FinancialSource }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              source.type === 'bank' ? 'accounting-blue-bg' : 'accounting-peach-gradient'
            }`}>
              {source.type === 'bank' ? (
                <Building className="w-5 h-5 text-white" />
              ) : (
                <CreditCard className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{source.name}</h4>
                {getStatusBadge(source.status)}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span>{source.accountCount} accounts</span>
                <span>Last synced: {new Date(source.lastSync!).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewSource(source)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 px-3 text-sm"
            >
              View Accounts
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDisconnectSource(source.id)}
              className="text-gray-500 hover:text-red-600 h-8 w-8 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AvailableSourceCard = ({ 
    source, 
    type, 
    onConnect 
  }: { 
    source: { id: string; name: string; category: string };
    type: 'bank' | 'accounting';
    onConnect: () => void;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              type === 'bank' ? 'bg-blue-100' : 'bg-purple-100'
            }`}>
              {type === 'bank' ? (
                <Building className="w-4 h-4 text-blue-600" />
              ) : (
                <CreditCard className="w-4 h-4 text-purple-600" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 text-sm">{source.name}</h4>
              <p className="text-xs text-gray-500">{source.category}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={onConnect}
            disabled={isConnecting === source.id}
            className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white h-8 px-3 text-sm"
          >
            {isConnecting === source.id ? "Connecting..." : "Connect"}
            {!isConnecting && <ExternalLink className="w-3 h-3 ml-1" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden bg-white">
          <DialogHeader className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl text-gray-900">Financial Sources</DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  Connect your bank accounts and accounting tools to sync financial data
                </DialogDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Connected Sources */}
            {connectedSources.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Connected Sources</h3>
                <div className="grid grid-cols-1 gap-3">
                  {connectedSources.map((source) => (
                    <ConnectedSourceCard key={source.id} source={source} />
                  ))}
                </div>
              </div>
            )}

            {/* Add New Sources */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">Add New Source</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search financial sources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-56 bg-white border-gray-200 h-8 text-sm"
                  />
                </div>
              </div>

              <Tabs defaultValue="banks" className="space-y-3">
                <TabsList className="bg-gray-100 h-8">
                  <TabsTrigger value="banks" className="data-[state=active]:bg-white text-sm px-3 py-1">
                    Bank Accounts
                  </TabsTrigger>
                  <TabsTrigger value="accounting" className="data-[state=active]:bg-white text-sm px-3 py-1">
                    Accounting Tools
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="banks" className="space-y-2">
                  {filteredBanks.length > 0 ? (
                    filteredBanks.map((bank) => (
                      <AvailableSourceCard
                        key={bank.id}
                        source={bank}
                        type="bank"
                        onConnect={() => handleConnectSource(bank.id, bank.name, 'bank')}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      {searchQuery ? 'No banks found matching your search.' : 'All available banks are already connected.'}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="accounting" className="space-y-2">
                  {filteredAccountingTools.length > 0 ? (
                    filteredAccountingTools.map((tool) => (
                      <AvailableSourceCard
                        key={tool.id}
                        source={tool}
                        type="accounting"
                        onConnect={() => handleConnectSource(tool.id, tool.name, 'accounting')}
                      />
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-500 text-sm">
                      {searchQuery ? 'No accounting tools found matching your search.' : 'All available accounting tools are already connected.'}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 hover:bg-gray-50 h-8 px-4 text-sm">
                Cancel
              </Button>
              <Button onClick={onClose} className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white h-8 px-4 text-sm">
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedSource && (
        <AccountSelectionModal
          isOpen={showAccountSelection}
          onClose={() => {
            setShowAccountSelection(false);
            setSelectedSource(null);
          }}
          source={selectedSource}
        />
      )}
    </>
  );
}