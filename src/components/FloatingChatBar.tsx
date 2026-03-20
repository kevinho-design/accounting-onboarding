import * as React from "react";
import { Sparkles, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FloatingChatBarProps {
  onOpen: () => void;
  onSubmitMessage?: (message: string) => void;
  notificationCount?: number;
  isVisible: boolean;
  activeUser?: "jennifer" | "sarah";
}

const JENNIFER_SUGGESTIONS = [
  "What's my current cash position?",
  "Are there any trust compliance issues?",
  "Which clients have overdue invoices?",
  "What's our realization rate this month?",
];

const SARAH_SUGGESTIONS = [
  "Which Brex transactions still need categorizing?",
  "Walk me through the duplicate ACH on Mar 15",
  "What's left before March close?",
  "Are there any IOLTA compliance issues I should know about?",
];

export function FloatingChatBar({
  onOpen,
  onSubmitMessage,
  notificationCount = 0,
  isVisible,
  activeUser = "jennifer",
}: FloatingChatBarProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);

  const suggestions = activeUser === "sarah" ? SARAH_SUGGESTIONS : JENNIFER_SUGGESTIONS;

  const handleSparkleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen();
    onSubmitMessage?.("__sparkle__");
  };

  const handleSubmit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onOpen();
    onSubmitMessage?.(trimmed);
    setInputValue("");
    setIsFocused(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(inputValue);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="chat-bar"
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4"
        >
          {/* Suggested Queries card */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="mb-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
              >
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Suggested Queries
                </p>
                {suggestions.map((q) => (
                  <button
                    key={q}
                    onMouseDown={() => handleSubmit(q)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    {q}
                  </button>
                ))}
                <div className="h-2" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bar */}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center gap-3 bg-white rounded-full shadow-lg border border-gray-200 px-3 py-2.5 cursor-text hover:shadow-xl transition-shadow"
          >
            {/* Sparkle button — clicking hides bar and opens rail */}
            <div className="relative flex-shrink-0" onClick={handleSparkleClick}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90 transition-opacity">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow">
                  {notificationCount}
                </span>
              )}
            </div>

            {/* Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 150)}
              placeholder="Ask your AI Teammate anything..."
              className="flex-1 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent outline-none"
            />

            {/* Send button */}
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              disabled={!inputValue.trim()}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white transition-colors flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
