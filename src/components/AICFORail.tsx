import * as React from "react";
import { CFOAvatar } from "./CFOAvatar";
import { Sparkles, TrendingUp, Bell, Target, Zap, MessageCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface AICFORailProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

export function AICFORail({ isVisible = true, onToggle }: AICFORailProps) {
  const [showChat, setShowChat] = React.useState(false);

  // If not visible, show a floating toggle button
  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 rounded-l-lg shadow-lg z-50 flex items-center gap-2"
        title="Show Teammate"
      >
        <CFOAvatar size="sm" showPulse={true} />
        <ChevronLeft className="w-4 h-4" />
      </motion.button>
    );
  }

  return (
    <motion.div 
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-[400px] h-full flex-shrink-0 border-l border-[#1C60FF] overflow-y-auto flex flex-col"
      style={{ backgroundColor: '#F8FAFF' }}
    >
      <div className="p-6 flex-1">
        {/* Teammate Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CFOAvatar size="md" showPulse={true} />
              <div>
                <h3 className="text-sm font-bold text-gray-900">Your Teammate</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs text-gray-600">Actively monitoring</p>
                </div>
              </div>
            </div>
            <button 
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Hide Teammate"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            I'm analyzing your financial data in real-time and will alert you to opportunities and risks as they emerge.
          </p>
        </div>

        {/* Quick Stats - AI Powered */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
            AI INSIGHTS
          </h4>
          
          <div className="space-y-3">
            {/* Insight 1 */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-green-900 mb-1">Revenue Trend</div>
                  <p className="text-xs text-green-800 leading-relaxed">
                    Your Q1 revenue is tracking 8% above target. Great work!
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Insight 2 */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl border border-orange-200"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-orange-900 mb-1">Action Needed</div>
                  <p className="text-xs text-orange-800 leading-relaxed">
                    3 invoices are 12+ days overdue. Quick action could secure $73.7K.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Insight 3 */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-900 mb-1">Opportunity</div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Converting unbilled time could extend your cash runway by 12 days.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Insight 4 */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-900 mb-1">Compliance Check</div>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    All trust accounts are reconciled and Massachusetts IOLTA compliant.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
            RECENT ACTIVITY
          </h4>
          
          <div className="space-y-4">
            <div className="text-xs">
              <div className="flex items-start gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                <div>
                  <span className="text-gray-900 font-medium">Analyzed</span>
                  <span className="text-gray-600"> 1,833 transactions</span>
                </div>
              </div>
              <div className="text-gray-500 ml-3.5">Just now</div>
            </div>

            <div className="text-xs">
              <div className="flex items-start gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                <div>
                  <span className="text-gray-900 font-medium">Enriched</span>
                  <span className="text-gray-600"> 127 vendor records</span>
                </div>
              </div>
              <div className="text-gray-500 ml-3.5">2 min ago</div>
            </div>

            <div className="text-xs">
              <div className="flex items-start gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5" />
                <div>
                  <span className="text-gray-900 font-medium">Identified</span>
                  <span className="text-gray-600"> 3 priority actions</span>
                </div>
              </div>
              <div className="text-gray-500 ml-3.5">5 min ago</div>
            </div>

            <div className="text-xs">
              <div className="flex items-start gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                <div>
                  <span className="text-gray-900 font-medium">Verified</span>
                  <span className="text-gray-600"> trust compliance status</span>
                </div>
              </div>
              <div className="text-gray-500 ml-3.5">10 min ago</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
            QUICK ACTIONS
          </h4>
          
          <div className="space-y-2">
            <Button 
              className="w-full justify-start text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask your Teammate
            </Button>
            
            <Button 
              className="w-full justify-start text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate insights report
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-gray-900 font-medium mb-1">
                AI-Powered CFO
              </p>
              <p className="text-xs text-gray-600 leading-relaxed">
                I learn from your firm's patterns to provide increasingly personalized insights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}