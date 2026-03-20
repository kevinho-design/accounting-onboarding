"use client";

import * as React from "react";

interface AnimatedTextProps {
  phrases: string[];
  className?: string;
}

export function AnimatedText({ phrases, className = "" }: AnimatedTextProps) {
  const [currentPhraseIndex, setCurrentPhraseIndex] = React.useState(0);
  const [visibleChars, setVisibleChars] = React.useState(0);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const currentPhrase = phrases[currentPhraseIndex];

  React.useEffect(() => {
    if (visibleChars < currentPhrase.length) {
      const timer = setTimeout(() => {
        setVisibleChars(prev => prev + 1);
      }, 80); // 80ms staggered delay
      return () => clearTimeout(timer);
    } else {
      // Phrase is complete, wait 3 seconds then move to next
      setIsCompleted(true);
      const timer = setTimeout(() => {
        setCurrentPhraseIndex(prev => (prev + 1) % phrases.length);
        setVisibleChars(0);
        setIsCompleted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visibleChars, currentPhrase.length, phrases.length]);

  return (
    <div className={`min-h-[2rem] ${className}`}>
      <span className="inline-block">
        {currentPhrase.split('').map((char, index) => (
          <span
            key={`${currentPhraseIndex}-${index}`}
            className={`inline-block transition-all duration-200 ease-out ${
              index < visibleChars
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75'
            }`}
            style={{
              transitionDelay: `${index * 20}ms`, // Additional subtle delay for smoother effect
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
        {isCompleted && (
          <span className="inline-block w-2 h-5 bg-blue-600 ml-1 animate-pulse" />
        )}
      </span>
    </div>
  );
}