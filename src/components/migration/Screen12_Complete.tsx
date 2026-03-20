import * as React from "react";
import { Sparkles, Eye, Shield, TrendingUp, Zap, Activity } from "lucide-react";
import { Button } from "../ui/button";

interface Screen12Props {
  onComplete: () => void;
}

export function Screen12_Complete({ onComplete }: Screen12Props) {
  const [showConfetti, setShowConfetti] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => setShowConfetti(false), 5000);
  }, []);

  return (
    <div className="flex-1 h-[calc(100vh-90px)] overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-white relative">
      {/* Real Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {Array.from({ length: 100 }).map((_, i) => {
            const colors = ['#1C60FF', '#9333EA', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomLeft = Math.random() * 100;
            const randomDelay = Math.random() * 3;
            const randomDuration = 3 + Math.random() * 4;
            const randomRotation = Math.random() * 360;
            
            return (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${randomLeft}%`,
                  top: '-20px',
                  backgroundColor: randomColor,
                  animation: `confettiFall ${randomDuration}s linear ${randomDelay}s forwards`,
                  transform: `rotate(${randomRotation}deg)`,
                  opacity: 0.8
                }}
              />
            );
          })}
        </div>
      )}
      
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        .pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="relative z-20 h-full overflow-y-auto flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-20 py-16 text-center">
          
          {/* AI Icon with Glow */}
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 mb-8 shadow-2xl pulse-glow relative">
            <Sparkles className="w-16 h-16 text-white" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 blur-xl opacity-50" />
          </div>

          {/* Hero Message */}
          <h1 className="text-5xl font-semibold text-gray-900 mb-4">
            Setup Complete.
          </h1>
          <h2 className="text-4xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Your Teammate is Now Monitoring.
          </h2>
          
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            While you focus on practicing law, your AI Teammate is actively watching your finances, learning from every transaction, and ensuring compliance 24/7.
          </p>

          {/* What AI is Doing Now - Active Monitoring */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            {/* Watching Bank Feeds */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100 text-left hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">Watching 3 bank feeds</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <p className="text-gray-600">
                    Automatically categorizing transactions from your operating account, IOLTA trust, and corporate card in real-time.
                  </p>
                </div>
              </div>
            </div>

            {/* Monitoring IOLTA Compliance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 text-left hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">Monitoring IOLTA compliance</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <p className="text-gray-600">
                    Validating every trust transaction against Delaware state bar rules and flagging potential issues before they happen.
                  </p>
                </div>
              </div>
            </div>

            {/* Learning from Every Transaction */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 text-left hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">Learning from every transaction</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <p className="text-gray-600">
                    Your AI model gets smarter with each transaction, understanding your firm's unique spending patterns and vendor relationships.
                  </p>
                </div>
              </div>
            </div>

            {/* Analyzing Financial Health */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-100 text-left hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">Analyzing financial health</h3>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <p className="text-gray-600">
                    Continuously tracking cash flow trends, comparing against your goals, and identifying optimization opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Signal */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-white shadow-xl">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Zap className="w-6 h-6" />
              <span className="text-2xl font-semibold">Trained on 3 years of your firm's history</span>
            </div>
            <p className="text-blue-100 text-lg">
              Your AI understands litigation firm finances better than generic accounting software ever could.
            </p>
          </div>

          {/* Main CTA */}
          <Button
            onClick={onComplete}
            className="bg-white hover:bg-gray-50 text-gray-900 px-12 py-6 rounded-xl font-semibold text-xl shadow-2xl border-2 border-gray-200"
          >
            View Live Dashboard →
          </Button>
        </div>
      </div>
    </div>
  );
}
