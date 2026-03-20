import * as React from "react";
import { ChevronLeft, ChevronRight, Check, Shield, Link, Sparkles, MapPin, Building, CreditCard, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { FinancialSourcesModal } from "./FinancialSourcesModal";
import { BankStatementUploadModal } from "./BankStatementUploadModal";

interface AccountingSetupWizardProps {
  onComplete: () => void;
  onBack: () => void;
}

export function AccountingSetupWizard({ onComplete, onBack }: AccountingSetupWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedStates, setSelectedStates] = React.useState<string[]>([]);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [showFinancialSources, setShowFinancialSources] = React.useState(false);
  const [showBankStatementUpload, setShowBankStatementUpload] = React.useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  const handleStateSelection = (state: string) => {
    if (!selectedStates.includes(state)) {
      setSelectedStates(prev => [...prev, state]);
    }
  };

  const removeState = (state: string) => {
    setSelectedStates(prev => prev.filter(s => s !== state));
  };

  const handleContinueFromStep1 = () => {
    if (selectedStates.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleConnectAccounts = () => {
    setIsConnecting(true);
    // Simulate Plaid connection
    setTimeout(() => {
      setIsConnecting(false);
      setCurrentStep(3);
      setIsAnalyzing(true);
      // Simulate AI analysis
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 3000);
    }, 2000);
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 accounting-black-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MapPin className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-[40px]">Select your states of operation</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select all states where your firm operates. We'll automatically configure compliance rules and trust account requirements for each jurisdiction.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* State Selection Dropdown */}
        <Select value="" onValueChange={handleStateSelection}>
          <SelectTrigger className="w-full bg-white border-gray-200 text-gray-900 h-12">
            <SelectValue placeholder="Add a state" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {states
              .filter(state => !selectedStates.includes(state))
              .map((state) => (
                <SelectItem key={state} value={state} className="text-gray-900 hover:bg-gray-50">
                  {state}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>

        {/* Selected States Pills */}
        {selectedStates.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Selected states:</p>
            <div className="flex flex-wrap gap-2">
              {selectedStates.map((state) => (
                <div
                  key={state}
                  className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200"
                >
                  <span className="text-sm font-medium">{state}</span>
                  <button
                    onClick={() => removeState(state)}
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedStates.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-800 text-lg">
                    {selectedStates.length} state{selectedStates.length > 1 ? 's' : ''} configured
                  </p>
                  <p className="text-green-600 text-sm">
                    IOLTA requirements and trust account regulations loaded
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between max-w-2xl mx-auto">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 text-[14px] py-[10px] px-[20px] py-[12px] p-[20px]"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleContinueFromStep1} 
          disabled={selectedStates.length === 0}
          className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white disabled:opacity-50 text-[13px] px-[20px] py-[7px] p-[20px]"
        >
          Continue
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 accounting-peach-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Building className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-[36px] text-[32px]">Connect your financial sources</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect your bank accounts and accounting tools to sync financial data automatically.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {/* Clio Manage Card */}
        <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 accounting-blue-bg rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[rgba(0,0,0,1)] text-lg text-[16px]">Clio Manage</h3>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">Recommended</Badge>
                  </div>
                  <p className="text-gray-600 mb-1">Operating, IOLTA account</p>
                  <p className="text-sm text-gray-500">14,283 transactions</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFinancialSources(true)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                Manage Sources
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Connect Bank Account Card */}
        <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 accounting-blue-bg rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[rgba(0,0,0,1)] text-lg text-[16px]">Link to your bank account</h3>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">Recommended</Badge>
                  </div>
                  <p className="text-gray-600">Chase, Bank of America, Wells Fargo, and more</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFinancialSources(true)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                Manage Sources
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Connect Other Tools Card */}
        <Card className="bg-white border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[rgba(0,0,0,1)] text-lg text-[16px]">Connect to other tools</h3>
                    <Badge className="bg-gray-50 text-gray-700 border-gray-200">Optional</Badge>
                  </div>
                  <p className="text-gray-600">QuickBooks, Xero, Bills.com</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFinancialSources(true)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                Manage Sources
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Bank Statements Option */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="text-center px-[0px] py-[20px] rounded-[8px] bg-[rgba(240,240,240,1)]">
            <p className="text-sm text-gray-600 mb-4">
              Don't have online banking? You can also upload your bank statements directly.
            </p>
            <Button 
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
              onClick={() => setShowBankStatementUpload(true)}
            >
              Upload Bank Statements
            </Button>
          </div>
        </div>


      </div>

      <div className="flex justify-between max-w-2xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(1)}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 text-[14px] px-[20px] py-[7px] p-[20px]"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={() => handleConnectAccounts()} 
          disabled={isConnecting}
          className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white disabled:opacity-50 text-[13px] px-[20px] p-[20px]"
        >
          {isConnecting ? "Setting up..." : "Continue Setup"}
          {!isConnecting && <ChevronRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          {isAnalyzing ? (
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          ) : (
            <Check className="w-10 h-10 text-white" />
          )}
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-[36px] text-[32px]">
          {isAnalyzing ? "Setting up your accounting..." : "Setup complete!"}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {isAnalyzing 
            ? "Our AI is analyzing your transactions and configuring your chart of accounts."
            : "Your accounting system is ready. Here's what we've set up for you."
          }
        </p>
      </div>

      {isAnalyzing ? (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Importing transactions</span>
              <span>84 found</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="accounting-blue-bg h-3 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Categorizing with AI</span>
              <span>81/84</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="accounting-peach-gradient h-3 rounded-full transition-all duration-300" style={{ width: '96%' }}></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Configuring compliance rules</span>
              <span className="text-green-600">Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full transition-all duration-300" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-white border-gray-200 shadow-md">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions imported</span>
                  <span className="font-semibold text-gray-900">84</span>
                </div>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto-categorized</span>
                  <span className="font-semibold text-green-600">96%</span>
                </div>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Compliance status</span>
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    {selectedStates.length > 1 
                      ? `${selectedStates.length} states active` 
                      : `${selectedStates[0]} rules active`
                    }
                  </Badge>
                </div>
                <Separator className="bg-gray-200" />
                <div className="flex justify-between">
                  <span className="text-gray-600">Items needing review</span>
                  <span className="font-semibold text-gray-900">3</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={onComplete} 
              size="lg" 
              className="accounting-blue-bg hover:bg-[#1C60FF]/90 text-white shadow-lg text-[14px] px-[20px] p-[20px]"
            >
              Continue to Dashboard
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-1 flex-col min-h-0 accounting-white-bg">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 accounting-peach-gradient rounded-full opacity-10 blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 accounting-black-gradient rounded-full opacity-10 blur-3xl transform -translate-x-24 translate-y-24"></div>
        
        {/* Pulsing Background Animation - Only during analysis */}
        {isAnalyzing && (
          <>
            {/* Primary pulsing circle */}
            <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] accounting-blue-bg rounded-full animate-pulse-background blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            
            {/* Secondary pulsing circle */}
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] accounting-peach-gradient rounded-full animate-pulse-secondary blur-3xl"></div>
            
            {/* Tertiary subtle glow */}
            <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] accounting-black-gradient rounded-full animate-pulse-glow blur-3xl"></div>
            
            {/* Additional subtle pulse overlays */}
            <div className="absolute inset-0 accounting-blue-bg animate-pulse-glow"></div>
          </>
        )}
      </div>
      
      <div className="relative z-10 flex flex-1 flex-col min-h-0 py-12 px-8">
        {/* Progress Header */}
        <div className="max-w-md mx-auto w-full mb-12">
          <div className="flex justify-between text-sm text-gray-500 mb-3">
            <span className="text-[rgba(0,0,0,1)]">Step {currentStep} of {totalSteps}</span>
            <span className="text-[rgba(177,177,177,1)]">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="accounting-black-gradient h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col justify-center min-h-0">
          <div className="overflow-y-auto px-4">
            <div className="min-h-full flex items-center justify-center py-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Sources Modal */}
      <FinancialSourcesModal
        isOpen={showFinancialSources}
        onClose={() => setShowFinancialSources(false)}
      />

      {/* Bank Statement Upload Modal */}
      <BankStatementUploadModal
        isOpen={showBankStatementUpload}
        onClose={() => setShowBankStatementUpload(false)}
      />
    </div>
  );
}