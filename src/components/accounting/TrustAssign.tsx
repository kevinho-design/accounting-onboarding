import React from "react";
import * as ReactDOM from "react-dom";
import { Users, ChevronDown, Search, X } from "lucide-react";

export type FirmMember = { id: string; name: string; role: string; dept: string; initials: string; color: string };

export const TRUST_ASSIGNABLE: FirmMember[] = [
  { id: "priya",   name: "Priya Sharma",   role: "Senior Associate", dept: "Associates", initials: "PS", color: "#10B981" },
  { id: "tom",     name: "Tom Reeves",     role: "Associate",        dept: "Associates", initials: "TR", color: "#0070E0" },
  { id: "ana",     name: "Ana Flores",     role: "Associate",        dept: "Associates", initials: "AF", color: "#F97316" },
  { id: "james",   name: "James Park",     role: "Paralegal",        dept: "Admin",      initials: "JP", color: "#84CC16" },
  { id: "karen",   name: "Karen Mills",    role: "Office Manager",   dept: "Admin",      initials: "KM", color: "#64748B" },
];

export function MemberAvatar({ member, size }: { member: FirmMember; size: number }) {
  const [failed, setFailed] = React.useState(false);
  const seed = member.name.replace(/\s+/g, "");
  const fontSize = Math.round(size * 0.35);
  if (failed) {
    return (
      <div
        className="rounded-full flex-shrink-0 flex items-center justify-center"
        style={{ width: size, height: size, backgroundColor: member.color + "22", color: member.color, fontSize, fontWeight: 700 }}
      >
        {member.initials}
      </div>
    );
  }
  return (
    <img
      src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
      alt={member.name}
      width={size}
      height={size}
      className="rounded-full flex-shrink-0 object-cover"
      style={{ border: `1.5px solid ${member.color}33` }}
      onError={() => setFailed(true)}
    />
  );
}

export function TrustAssignCTA({ onDismiss, compact = false, buttonClassName, buttonStyle }: { onDismiss?: () => void; compact?: boolean; buttonClassName?: string; buttonStyle?: React.CSSProperties }) {
  const [assignee, setAssignee] = React.useState<FirmMember | null>(null);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [dropdownPos, setDropdownPos] = React.useState<{ top: number; left: number } | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const updatePos = React.useCallback(() => {
    if (!buttonRef.current) return;
    const r = buttonRef.current.getBoundingClientRect();
    setDropdownPos({ top: r.bottom + 4, left: r.left });
  }, []);

  React.useEffect(() => {
    if (!open) { setSearch(""); setDropdownPos(null); return; }
    updatePos();
    setTimeout(() => inputRef.current?.focus(), 40);
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open, updatePos]);

  const filtered = TRUST_ASSIGNABLE.filter(m =>
    search === "" ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  if (assignee) {
    return (
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
          <MemberAvatar member={assignee} size={18} />
          <span className="text-[11px]" style={{ fontWeight: 600, color: "#15803D" }}>
            Assigned to {assignee.name.split(" ")[0]}
          </span>
          {!compact && <span className="text-[10px]" style={{ color: "#4ADE80" }}>· Pending in Manage</span>}
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-amber-50" style={{ color: "#D97706" }}>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  const dropdown = open && dropdownPos ? ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        top: dropdownPos.top,
        left: dropdownPos.left,
        width: 232,
        zIndex: 9999,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      <div className="px-2.5 pt-2 pb-1.5" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg" style={{ backgroundColor: "#F7F5F5", border: "1px solid #E2E8F0" }}>
          <Search className="w-3 h-3 flex-shrink-0" style={{ color: "#94A3B8" }} />
          <input
            ref={inputRef}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search associates…"
            className="flex-1 bg-transparent outline-none text-[12px]"
            style={{ color: "#17181C" }}
          />
        </div>
      </div>
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {filtered.map(m => (
          <button
            key={m.id}
            onClick={(e) => { e.stopPropagation(); setAssignee(m); setOpen(false); }}
            className="w-full text-left px-3 py-2 flex items-center gap-2.5 hover:bg-slate-50 transition-colors"
          >
            <MemberAvatar member={m} size={28} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] truncate" style={{ fontWeight: 500, color: "#17181C" }}>{m.name}</p>
              <p className="text-[10px]" style={{ color: "#94A3B8" }}>{m.role} · {m.dept}</p>
            </div>
          </button>
        ))}
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="flex items-center gap-1.5 flex-shrink-0" ref={ref}>
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className={buttonClassName ?? "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] transition-all hover:opacity-90"}
        style={buttonStyle ?? { fontWeight: 600, backgroundColor: "#D97706", color: "#FFFFFF" }}
      >
        <Users className="w-3 h-3" />
        Assign request
        <ChevronDown className="w-2.5 h-2.5" />
      </button>
      {onDismiss && (
        <button onClick={onDismiss} className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-amber-50" style={{ color: "#D97706" }}>
          <X className="w-3 h-3" />
        </button>
      )}
      {dropdown}
    </div>
  );
}
