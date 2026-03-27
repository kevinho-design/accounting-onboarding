import * as React from "react";
import { Calendar, Search, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SUGGESTIONS: Record<"jennifer" | "sarah" | "ryan", string[]> = {
  jennifer: [
    "What's our cash runway looking like this quarter?",
    "Which clients have overdue invoices over 60 days?",
    "Are we on track for our Q1 revenue goal?",
    "Show me any trust account compliance issues",
    "What's our realization rate this month?",
  ],
  sarah: [
    "What transactions are blocking March reconciliation?",
    "Show me the duplicate ACH transactions from Mar 15",
    "Which Brex transactions need categorizing?",
    "What's the status of the IOLTA three-way reconciliation?",
    "Summarize what AI did overnight",
  ],
  ryan: [
    "What's our cash runway and operating cushion this quarter?",
    "Which approvals are blocking cash or trust movements?",
    "How are we tracking against firm financial goals?",
    "Show me trust and IOLTA items that need sign-off",
    "What's at risk in collections and unbilled time?",
  ],
};

interface FloatingChatBarProps {
  onOpen: () => void;
  onSubmitMessage?: (message: string) => void;
  notificationCount?: number;
  isVisible: boolean;
  activeUser?: "jennifer" | "sarah" | "ryan";
}

export function FloatingChatBar({
  onOpen,
  onSubmitMessage,
  notificationCount = 0,
  isVisible,
  activeUser = "jennifer",
}: FloatingChatBarProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const suggestions = SUGGESTIONS[activeUser] ?? SUGGESTIONS.jennifer;

  const handleTodayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
  };

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setIsFocused(false);
    onOpen();
    onSubmitMessage?.(trimmed);
    setInputValue("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setIsFocused(false);
    onOpen();
    onSubmitMessage?.(suggestion);
    setInputValue("");
  };

  // Close suggestions when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showSuggestions = isFocused && !inputValue.trim();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="chat-bar"
          ref={containerRef}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
        >
          {/* Suggestions popover */}
          <AnimatePresence>
            {showSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="mb-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              >
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Suggested</p>
                </div>
                <div className="py-1">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(s);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bar */}
          <div className="flex items-center gap-2 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-2 hover:shadow-xl transition-shadow">
            {/* Today pill */}
            <button
              onClick={handleTodayClick}
              className="relative flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-1.5 flex-shrink-0 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Today</span>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-200 flex-shrink-0" />

            {/* Search icon */}
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />

            {/* Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setIsFocused(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(inputValue);
                if (e.key === "Escape") setIsFocused(false);
              }}
              placeholder="Ask me anything or search to find something"
              className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent outline-none"
            />

            {/* Send button */}
            <AnimatePresence>
              {inputValue.trim() && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleSubmit(inputValue)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex-shrink-0 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
