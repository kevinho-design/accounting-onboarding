import * as React from "react";
import { CheckCircle, ArrowRight, Building2, Shield, Bot, Sparkles, Users, FileText, Scale } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface AccountingLandingPageProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export function AccountingLandingPage({ onGetStarted, onLearnMore }: AccountingLandingPageProps) {
  return (
    <div className="min-h-screen accounting-white-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-8">
        {/* Background Gradient Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 accounting-peach-gradient rounded-full opacity-20 blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 accounting-black-gradient rounded-full opacity-15 blur-3xl transform -translate-x-24 translate-y-24"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Bookkeeper powered
          </Badge>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Professional Accounting for 
            <span className="block bg-gradient-to-r from-[#1C60FF] to-[#3C8AFF] bg-clip-text text-transparent">
              Legal Practices
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Streamline your firm's financial operations with AI-powered bookkeeping, state bar compliance, 
            and seamless integration with your existing practice management workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="py-4 accounting-blue-bg hover:bg-[#1C60FF]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-[20px] text-[14px] px-[26px] py-[20px]"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              onClick={onLearnMore}
              variant="outline" 
              size="lg"
              className="py-4 border-gray-300 text-gray-700 hover:bg-gray-50 px-[20px] text-[13px] px-[26px] py-[20px]"
            >
              Watch Demo
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built specifically for law firms
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get real-time insights into your firm's financial health with our intuitive dashboard designed for legal professionals.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 accounting-black-gradient rounded-3xl opacity-5"></div>
            <Card className="border-0 shadow-2xl overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 accounting-blue-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Preview</h3>
                    <p className="text-gray-600">Interactive demo coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="py-20 px-8 accounting-white-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why law firms choose our platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Purpose-built features that understand the unique financial needs of legal practices.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 accounting-peach-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Manage to Accounting Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Seamlessly sync your practice management data with your accounting. Client invoices, 
                  time entries, and expenses flow automatically into your books.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 accounting-black-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">AI Bookkeeper</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Our AI automatically categorizes transactions, suggests corrections, and maintains 
                  your chart of accounts. Reduce manual work by 80%.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 accounting-blue-bg rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">State Bar Compliance Engine</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Built-in IOLTA compliance, trust account monitoring, and state-specific reporting. 
                  Stay compliant with automated safeguards.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Logos */}
      <section className="py-16 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-8">Trusted by law firms and integrated with</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {["QuickBooks", "Plaid", "IOLTA", "State Bars"].map((partner) => (
              <div key={partner} className="text-center">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">{partner}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 accounting-white-bg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything your firm needs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive accounting features designed specifically for the legal industry.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Client Trust Management",
                description: "Automated IOLTA tracking with real-time balance monitoring and compliance reporting."
              },
              {
                icon: FileText,
                title: "Legal Expense Categories",
                description: "Pre-configured chart of accounts with legal-specific expense categories and tax codes."
              },
              {
                icon: Scale,
                title: "Ethics Compliance",
                description: "Built-in safeguards to ensure compliance with state bar regulations and ethics rules."
              },
              {
                icon: Sparkles,
                title: "AI Transaction Coding",
                description: "Smart categorization learns your firm's patterns and suggests optimal account coding."
              },
              {
                icon: Shield,
                title: "Audit-Ready Reports",
                description: "Generate compliant financial statements and reports required by state bars."
              },
              {
                icon: Building2,
                title: "Multi-Entity Support",
                description: "Manage multiple practice entities, partnerships, and business structures in one place."
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white">
                <CardHeader>
                  <div className="w-12 h-12 accounting-peach-gradient rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 accounting-black-gradient opacity-95"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Ready to modernize your firm's accounting?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join hundreds of law firms who have streamlined their financial operations with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={onLearnMore}
                variant="outline" 
                size="lg"
                className="px-8 py-4 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}