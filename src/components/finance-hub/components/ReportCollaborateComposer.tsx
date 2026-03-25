import * as React from 'react';
import { Send } from 'lucide-react';

export type ReportCollaborateComposerProps = {
  onSend: (text: string) => void;
  brandColor?: string;
  placeholder?: string;
};

export function ReportCollaborateComposer({
  onSend,
  brandColor = '#0069D1',
  placeholder = 'Ask Firm Intelligence about this report…',
}: ReportCollaborateComposerProps) {
  const [value, setValue] = React.useState('');

  const submit = () => {
    const t = value.trim();
    if (!t) return;
    setValue('');
    onSend(t);
  };

  return (
    <div className="shrink-0 border-t border-gray-200 bg-white p-3">
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-3 py-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 border-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          className="shrink-0 rounded-[8px] p-2 text-white shadow-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: brandColor }}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
