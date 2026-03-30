import * as React from "react";
import { Sparkles, MessageSquare, Bell, Zap, ChevronLeft, Bot } from "lucide-react";

/**
 * Demo component showing different launch point options for the Teammate AI Rail
 * This is just for exploration - user will choose which option to implement
 */
export function TeammateRailLaunchOptions() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Teammate Rail - Launch Point Options
          </h1>
          <p className="text-gray-600">
            Choose how users will open/access the AI Teammate rail
          </p>
        </div>

        {/* Option Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Option 1: Current - Rail Edge Toggle */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  1. Rail Edge Toggle (Current)
                </h3>
                <p className="text-sm text-gray-600">
                  Toggle button on the collapsed rail edge
                </p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                CURRENT
              </span>
            </div>
            
            {/* Mockup */}
            <div className="relative h-48 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
              <div className="absolute right-0 top-0 h-full w-12 bg-[#F8FAFF] border-l-2 border-blue-600 flex flex-col">
                <button className="p-3 hover:bg-blue-50 transition-colors border-b border-blue-100 flex flex-col items-center gap-1">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <ChevronLeft className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Always visible, discoverable</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">No workspace clutter</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 font-bold">−</span>
                <span className="text-gray-700">Easy to ignore/overlook</span>
              </div>
            </div>
          </div>

          {/* Option 2: Floating Action Button (FAB) */}
          <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  2. Floating Action Button (FAB)
                </h3>
                <p className="text-sm text-gray-600">
                  Persistent floating button in bottom-right
                </p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                POPULAR
              </span>
            </div>
            
            {/* Mockup */}
            <div className="relative h-48 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
              <div className="absolute bottom-6 right-6">
                <button className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group hover:scale-105">
                  <Sparkles className="w-6 h-6 text-white" />
                </button>
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Highly visible, prominent</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Can show notification badges</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 font-bold">−</span>
                <span className="text-gray-700">May obstruct workspace content</span>
              </div>
            </div>
          </div>

          {/* Option 3: Top Bar Action */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  3. Top Bar Action Button
                </h3>
                <p className="text-sm text-gray-600">
                  Button in the main workspace header
                </p>
              </div>
            </div>
            
            {/* Mockup */}
            <div className="relative h-48 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b-2 border-gray-200 flex items-center justify-between px-4">
                <h2 className="text-sm font-semibold text-gray-900">Dashboard</h2>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-md transition-all flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Ask Clio</span>
                  <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">2</span>
                </button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Natural place to look</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Doesn't obstruct content</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 font-bold">−</span>
                <span className="text-gray-700">Competes with page title/actions</span>
              </div>
            </div>
          </div>

          {/* Option 4: Sidebar Integration */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  4. Sidebar Menu Item
                </h3>
                <p className="text-sm text-gray-600">
                  Dedicated item in left navigation
                </p>
              </div>
            </div>
            
            {/* Mockup */}
            <div className="relative h-48 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-16 bg-[#1a1f36] flex flex-col items-center py-4 gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white">H</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-white">$</span>
                </div>
                {/* Teammate item with glow */}
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center ring-2 ring-blue-400 ring-offset-2 ring-offset-[#1a1f36]">
                  <Sparkles className="w-5 h-5 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Consistent with nav patterns</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Always accessible</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 font-bold">−</span>
                <span className="text-gray-700">May feel like navigation vs. tool</span>
              </div>
            </div>
          </div>

          {/* Option 5: Proactive Notification Badge */}
          <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  5. Proactive Insight Badge
                </h3>
                <p className="text-sm text-gray-600">
                  Badge appears when AI has new insights
                </p>
              </div>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                SMART
              </span>
            </div>
            
            {/* Mockup */}
            <div className="relative h-48 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden">
              {/* Animated pulsing badge */}
              <div className="absolute top-4 right-4">
                <div className="relative">
                  <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-semibold rounded-full shadow-lg animate-pulse flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>3 New Insights</span>
                  </button>
                  {/* Ping animation */}
                  <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Only shows when relevant</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Creates urgency/curiosity</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 font-bold">−</span>
                <span className="text-gray-700">May be annoying if too frequent</span>
              </div>
            </div>
          </div>

          {/* Option 6: Keyboard Shortcut + Command Palette */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  6. Keyboard Shortcut
                </h3>
                <p className="text-sm text-gray-600">
                  Quick key (e.g., Cmd+K) to open rail
                </p>
              </div>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                POWER USER
              </span>
            </div>
            
            {/* Mockup */}
            <div className="relative h-48 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden flex items-center justify-center">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <kbd className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm">
                    ⌘
                  </kbd>
                  <span className="text-gray-400">+</span>
                  <kbd className="px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm font-semibold text-gray-700 shadow-sm">
                    T
                  </kbd>
                </div>
                <p className="text-xs text-gray-500">Toggle Teammate</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">Fast for power users</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-700">No UI clutter</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="text-orange-600 font-bold">−</span>
                <span className="text-gray-700">Not discoverable for new users</span>
              </div>
            </div>
          </div>

        </div>

        {/* Hybrid Recommendation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-300 p-8 mt-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">
                💡 Recommended: Hybrid Approach
              </h3>
              <p className="text-gray-700 mb-4">
                Combine multiple launch points for different user behaviors:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">1.</span>
                  <div>
                    <span className="font-semibold text-gray-900">Primary: </span>
                    <span className="text-gray-700">Proactive notification badge (appears when AI has insights)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">2.</span>
                  <div>
                    <span className="font-semibold text-gray-900">Secondary: </span>
                    <span className="text-gray-700">Rail edge toggle (always available, subtle)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">3.</span>
                  <div>
                    <span className="font-semibold text-gray-900">Power User: </span>
                    <span className="text-gray-700">Keyboard shortcut (⌘T) for quick access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
