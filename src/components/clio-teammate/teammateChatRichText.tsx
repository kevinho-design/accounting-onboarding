import * as React from 'react';

/**
 * Highlights common financial tokens in scripted teammate replies (currency, runway, headcount, %).
 * Split with capturing groups: even segments are plain text, odd are matches.
 */
const FINANCIAL_TOKEN_RE =
  /(~\d+\s+days|\d+(?:\u2013|-)\d+\s+days|\d+\s+attorneys?|\d+(?:\.\d+)?%|\$[\d,]+(?:\.\d+)?[KkMm]?)/gi;

function highlightLine(line: string, keyPrefix: string): React.ReactNode {
  const parts = line.split(FINANCIAL_TOKEN_RE);
  return parts.map((part, i) => {
    if (part === '') return null;
    const key = `${keyPrefix}-${i}`;
    if (i % 2 === 1) {
      return (
        <span key={key} className="font-semibold tabular-nums text-primary">
          {part}
        </span>
      );
    }
    return <span key={key}>{part}</span>;
  });
}

const bubbleTextClass = 'text-[13px] leading-relaxed';

function formatParagraph(para: string, pIdx: number): React.ReactNode {
  const lines = para.split('\n');
  return (
    <p key={pIdx} className={`mb-3 last:mb-0 ${bubbleTextClass}`}>
      {lines.map((line, li) => (
        <React.Fragment key={li}>
          {li > 0 ? <br /> : null}
          {highlightLine(line, `${pIdx}-${li}`)}
        </React.Fragment>
      ))}
    </p>
  );
}

export function TeammateAiMessageContent({ content }: { content: string }) {
  if (!content.trim()) return null;
  const paragraphs = content.split(/\n\s*\n+/).filter((p) => p.trim());
  return (
    <div className={`break-words ${bubbleTextClass}`}>
      {paragraphs.map((p, i) => formatParagraph(p, i))}
    </div>
  );
}
