import * as React from "react";
import { Sparkles, X } from "lucide-react";
import { motion } from "motion/react";

interface TeammateFABProps {
  onClick: () => void;
  notificationCount?: number;
  isRailOpen: boolean;
}

export function TeammateFAB({
  onClick,
  notificationCount = 0,
  isRailOpen,
}: TeammateFABProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 group transition-all duration-300"
      title={isRailOpen ? "Close Teammate" : "Open Teammate"}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Main FAB Button - transitions between open and closed states */}
        <motion.div
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
          animate={{
            background: isRailOpen
              ? "linear-gradient(135deg, #6B7280 0%, #374151 100%)" // Gray gradient when open
              : "linear-gradient(135deg, #2563EB 0%, #9333EA 100%)", // Blue to purple when closed
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isRailOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isRailOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Sparkles className="w-6 h-6 text-white" />
            )}
          </motion.div>
        </motion.div>

        {/* Notification Badge - only show when closed */}
        {!isRailOpen && notificationCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center shadow-md"
          >
            <span className="text-white text-xs font-bold">
              {notificationCount}
            </span>
          </motion.div>
        )}

        {/* Ping animation for notifications - only show when closed */}
        {!isRailOpen && notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          </span>
        )}
      </div>
    </motion.button>
  );
}