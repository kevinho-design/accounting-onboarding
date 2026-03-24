import * as React from "react";
import { CheckCircle, Mail, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";

interface Screen3Props {
  onComplete: () => void;
  onBack?: () => void;
}

export function Screen3_ConnectedServices({ onComplete, onBack }: Screen3Props) {
  // All services pre-selected (email is optional)
  const [connectedServices, setConnectedServices] = React.useState({
    adp: true,
    brex: true,
    bankOfAmerica: true,
    cityNational: true,
    email: true // Recommended
  });

  const toggleService = (serviceId: keyof typeof connectedServices) => {
    setConnectedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const services = [
    {
      id: "adp",
      name: "ADP",
      type: "Payroll",
      description: "Sync payroll data automatically",
      logo: (
        <div className="h-[42px] w-[42px] rounded-lg bg-[#D0021B] flex items-center justify-center">
          <span className="text-white font-black text-[15px] tracking-tight">ADP</span>
        </div>
      )
    },
    {
      id: "brex",
      name: "Brex",
      type: "Corporate Card",
      description: "Import card transactions in real-time",
      logo: (
        <div className="h-[42px] w-[42px] rounded-lg bg-black flex items-center justify-center">
          <span className="text-white font-bold text-[15px] tracking-tight">brex</span>
        </div>
      )
    },
    {
      id: "bankOfAmerica",
      name: "Bank of America",
      type: "Operating Account",
      description: "Connect your operating account feed",
      logo: (
        <div className="h-[42px] w-[42px] rounded-lg bg-[#E31837] flex items-center justify-center">
          <span className="text-white font-black text-[10px] tracking-tight leading-tight text-center">BofA</span>
        </div>
      )
    },
    {
      id: "cityNational",
      name: "City National",
      type: "IOLTA Account",
      description: "Connect your trust account feed",
      logo: (
        <div className="h-[42px] w-[42px] rounded-lg bg-[#003087] flex items-center justify-center">
          <span className="text-white font-black text-[10px] tracking-tight leading-tight text-center">CNB</span>
        </div>
      )
    }
  ];

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />
      
      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-10">
          
          <div className="mb-7 mt-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.34px] text-[#6a7282] mb-[10.5px]">
              Connect Your Financial Tools
            </div>
            <h2 className="text-[26.25px] font-semibold text-[#101828] mb-[10.5px] leading-[31.5px] tracking-[0.24px]">
              Connect Your Financial Tools
            </h2>
            <p className="text-[#4a5565] text-[15.75px] leading-[24.5px] tracking-[-0.29px]">
              We detected these services in your QuickBooks data. We'll connect them automatically for seamless syncing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-[14px] mb-[14px]">
            {services.map((service) => {
              const isConnected = connectedServices[service.id as keyof typeof connectedServices];
              
              return (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id as keyof typeof connectedServices)}
                  className={`relative h-[170px] rounded-[12.75px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] transition-all cursor-pointer text-left ${
                    isConnected 
                      ? 'bg-[#f0fdf4] hover:bg-[#dcfce7]' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300'
                  }`}
                >
                  <div className="absolute flex items-center justify-between left-[21px] top-[21px] w-[calc(100%-42px)]">
                    <div className="flex items-center gap-2">
                      <div className={`transition-opacity ${isConnected ? 'opacity-100' : 'opacity-40'}`}>
                        {service.logo}
                      </div>
                      <p className={`font-medium text-[16px] leading-[17.5px] tracking-[-0.018px] transition-colors ${
                        isConnected ? 'text-[#4a5565]' : 'text-gray-400'
                      }`}>
                        {service.name}
                      </p>
                    </div>
                    <CheckCircle 
                      className={`w-[21px] h-[21px] flex-shrink-0 transition-colors ${
                        isConnected ? 'text-[#00A63E]' : 'text-gray-300'
                      }`} 
                      strokeWidth={1.75} 
                    />
                  </div>
                  
                  <div className="absolute left-[21px] top-[77px] w-[calc(100%-42px)]">
                    <p className={`font-normal text-[12.25px] leading-[17.5px] tracking-[-0.018px] transition-colors ${
                      isConnected ? 'text-[#4a5565]' : 'text-gray-400'
                    }`}>
                      {service.type}
                    </p>
                  </div>
                  
                  <div className="absolute left-[21px] top-[101.5px] w-[calc(100%-42px)]">
                    <p className={`font-normal text-[12.25px] leading-[17.5px] tracking-[-0.018px] transition-colors ${
                      isConnected ? 'text-[#4a5565]' : 'text-gray-400'
                    }`}>
                      {service.description}
                    </p>
                  </div>
                  
                  <div className="absolute flex items-center gap-[7px] left-[21px] top-[133px]">
                    <CheckCircle 
                      className={`w-[14px] h-[14px] transition-colors ${
                        isConnected ? 'text-[#008236]' : 'text-gray-300'
                      }`} 
                      strokeWidth={1.17} 
                    />
                    <span className={`font-medium text-[12.25px] leading-[17.5px] tracking-[-0.018px] transition-colors ${
                      isConnected ? 'text-[#008236]' : 'text-gray-400'
                    }`}>
                      {isConnected ? 'Ready to connect' : 'Click to enable'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Email Intelligence Card - Spans full width */}
          <button
            onClick={() => toggleService('email')}
            className={`relative w-full h-[170px] rounded-[12.75px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] transition-all cursor-pointer text-left mb-7 ${
              connectedServices.email 
                ? 'bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200' 
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300'
            }`}
          >
            <div className="absolute flex items-center justify-between left-[21px] top-[21px] w-[calc(100%-42px)]">
              <div className="flex items-center gap-3">
                <div className={`h-[42px] w-[42px] rounded-lg flex items-center justify-center transition-colors ${
                  connectedServices.email 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                    : 'bg-gray-300'
                }`}>
                  <Mail className="w-[24px] h-[24px] text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <p className={`font-semibold text-[16px] leading-[17.5px] tracking-[-0.018px] transition-colors ${
                    connectedServices.email ? 'text-[#4a5565]' : 'text-gray-400'
                  }`}>
                    Email Intelligence
                  </p>
                  <p className={`font-normal text-[12.25px] leading-[17.5px] tracking-[-0.018px] mt-1 transition-colors ${
                    connectedServices.email ? 'text-[#6a7282]' : 'text-gray-400'
                  }`}>
                    Gmail / Outlook
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-medium text-[11px] uppercase tracking-[0.34px] px-2 py-1 rounded transition-colors ${
                  connectedServices.email 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  Recommended
                </span>
                <CheckCircle 
                  className={`w-[21px] h-[21px] flex-shrink-0 transition-colors ${
                    connectedServices.email ? 'text-[#00A63E]' : 'text-gray-300'
                  }`} 
                  strokeWidth={1.75} 
                />
              </div>
            </div>
            
            <div className="absolute left-[21px] top-[85px] w-[calc(100%-42px)]">
              <p className={`font-normal text-[13px] leading-[20px] tracking-[-0.018px] mb-3 transition-colors ${
                connectedServices.email ? 'text-[#4a5565]' : 'text-gray-400'
              }`}>
                Auto-detect vendors, parse invoices, and match payments from email
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle 
                    className={`w-[14px] h-[14px] transition-colors ${
                      connectedServices.email ? 'text-blue-600' : 'text-gray-300'
                    }`} 
                    strokeWidth={1.5} 
                  />
                  <span className={`font-normal text-[12.25px] transition-colors ${
                    connectedServices.email ? 'text-[#4a5565]' : 'text-gray-400'
                  }`}>
                    Train your AI teammate on vendor patterns
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle 
                    className={`w-[14px] h-[14px] transition-colors ${
                      connectedServices.email ? 'text-blue-600' : 'text-gray-300'
                    }`} 
                    strokeWidth={1.5} 
                  />
                  <span className={`font-normal text-[12.25px] transition-colors ${
                    connectedServices.email ? 'text-[#4a5565]' : 'text-gray-400'
                  }`}>
                    Auto-populate vendor contact info
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle 
                    className={`w-[14px] h-[14px] transition-colors ${
                      connectedServices.email ? 'text-blue-600' : 'text-gray-300'
                    }`} 
                    strokeWidth={1.5} 
                  />
                  <span className={`font-normal text-[12.25px] transition-colors ${
                    connectedServices.email ? 'text-[#4a5565]' : 'text-gray-400'
                  }`}>
                    Match bank transactions to invoice PDFs automatically
                  </span>
                </div>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-3">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="text-gray-500 hover:text-gray-700 px-4 py-6 shrink-0">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              onClick={onComplete}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
            >
              Connect Services
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}