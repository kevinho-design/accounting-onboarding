import * as React from "react";
import {
  Upload, CheckCircle, Loader2, FileText, Building2, Sparkles,
  ChevronLeft, ChevronRight, Grid2X2, List, Search, ChevronDown,
  ArrowRight, X,
} from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";
import { GalaxyNebula } from "./animations/GalaxyNebula";

interface Screen1Props {
  onComplete: () => void;
  onUploadFile?: () => void;
}

const CSV_FILES = [
  { name: "chart_of_accounts.csv", modified: "Today, 9:14 AM", size: "48 KB", kind: "CSV Document" },
  { name: "transactions_2025.csv", modified: "Today, 9:12 AM", size: "3.2 MB", kind: "CSV Document" },
  { name: "clients.csv",           modified: "Yesterday, 4:30 PM", size: "124 KB", kind: "CSV Document" },
  { name: "vendors.csv",           modified: "Yesterday, 4:28 PM", size: "89 KB", kind: "CSV Document" },
  { name: "trust_accounts.csv",    modified: "Mar 15, 2026",       size: "210 KB", kind: "CSV Document" },
  { name: "invoices_2025.csv",     modified: "Mar 15, 2026",       size: "680 KB", kind: "CSV Document" },
];

const SIDEBAR_FAVORITES = ["Desktop", "Documents", "Downloads", "Applications"];
const SIDEBAR_LOCATIONS = ["Summit Legal Group", "iCloud Drive", "Macintosh HD"];

function FinderModal({ onClose, onUpload }: { onClose: () => void; onUpload: () => void }) {
  const [selected, setSelected] = React.useState<Set<number>>(
    new Set(CSV_FILES.map((_, i) => i))
  );
  const [activeFolder, setActiveFolder] = React.useState("Exported Files");

  const toggle = (i: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const selectAll = () => setSelected(new Set(CSV_FILES.map((_, i) => i)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Finder window */}
      <div className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl border border-gray-300/60 flex flex-col" style={{ height: 480 }}>

        {/* Title bar */}
        <div className="flex items-center gap-0 bg-[#EBEBEB] border-b border-gray-300 px-4 h-11 flex-shrink-0 select-none">
          {/* Traffic lights */}
          <div className="flex items-center gap-2 mr-4">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-90 border border-[#E0443E]/40" />
            <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D4A017]/40" />
            <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]/40" />
          </div>
          {/* Nav arrows */}
          <div className="flex items-center gap-0.5 mr-3">
            <button className="p-1 rounded hover:bg-black/10 text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 rounded hover:bg-black/10 text-gray-400"><ChevronRight className="w-4 h-4" /></button>
          </div>
          {/* Breadcrumb */}
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[13px] font-semibold text-gray-700">Exported Files</span>
          </div>
          {/* Toolbar right */}
          <div className="flex items-center gap-1 ml-auto">
            <button className="p-1 rounded hover:bg-black/10 text-gray-500"><Grid2X2 className="w-4 h-4" /></button>
            <button className="p-1 rounded hover:bg-black/10 text-gray-500"><List className="w-4 h-4" /></button>
            <div className="flex items-center gap-1 ml-2 px-2 py-1 rounded bg-white/70 border border-gray-300 text-gray-400">
              <Search className="w-3.5 h-3.5" />
              <span className="text-xs w-16">Search</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 bg-white">
          {/* Sidebar */}
          <div className="w-44 flex-shrink-0 bg-[#F0F0F0] border-r border-gray-200 py-3 overflow-y-auto select-none">
            <div className="mb-3">
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Favorites</p>
              {SIDEBAR_FAVORITES.map((name) => (
                <button key={name} className="w-full flex items-center gap-2 px-4 py-1 text-[13px] text-gray-600 hover:bg-black/5 rounded transition-colors">
                  <span className="w-4 h-4 text-blue-500 flex-shrink-0">
                    {name === "Documents" ? "📄" : name === "Desktop" ? "🖥" : name === "Downloads" ? "⬇️" : "📱"}
                  </span>
                  {name}
                </button>
              ))}
            </div>
            <div>
              <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Locations</p>
              {SIDEBAR_LOCATIONS.map((name) => (
                <button
                  key={name}
                  onClick={() => name === "Summit Legal Group" && setActiveFolder("Exported Files")}
                  className={`w-full flex items-center gap-2 px-4 py-1 text-[13px] rounded transition-colors ${
                    name === "Summit Legal Group" ? "bg-blue-500 text-white" : "text-gray-600 hover:bg-black/5"
                  }`}
                >
                  <span className="w-4 h-4 flex-shrink-0">{name === "iCloud Drive" ? "☁️" : "💾"}</span>
                  <span className="truncate">{name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* File list */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Column headers */}
            <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-1.5 bg-[#F5F5F5] border-b border-gray-200 select-none">
              <input
                type="checkbox"
                checked={selected.size === CSV_FILES.length}
                onChange={selectAll}
                className="w-3.5 h-3.5 accent-blue-500"
              />
              <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">Name <ChevronDown className="w-3 h-3" /></span>
              <span className="text-[11px] font-semibold text-gray-500 w-32">Date Modified</span>
              <span className="text-[11px] font-semibold text-gray-500 w-16 text-right">Size</span>
              <span className="text-[11px] font-semibold text-gray-500 w-24">Kind</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {CSV_FILES.map((file, i) => (
                <label
                  key={file.name}
                  className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-3 px-4 py-2 items-center cursor-pointer border-b border-gray-100 last:border-0 select-none ${
                    selected.has(i) ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(i)}
                    onChange={() => toggle(i)}
                    className="w-3.5 h-3.5 accent-blue-500"
                  />
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg flex-shrink-0">📊</span>
                    <span className="text-[13px] text-gray-800 truncate">{file.name}</span>
                  </div>
                  <span className="text-[12px] text-gray-400 w-32 whitespace-nowrap">{file.modified}</span>
                  <span className="text-[12px] text-gray-400 w-16 text-right whitespace-nowrap">{file.size}</span>
                  <span className="text-[12px] text-gray-400 w-24 whitespace-nowrap">{file.kind}</span>
                </label>
              ))}
            </div>

            {/* Status / action bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-200 bg-[#F5F5F5] flex-shrink-0">
              <span className="text-[12px] text-gray-500">
                {selected.size} of {CSV_FILES.length} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onClose} className="h-7 text-xs border-gray-300">
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => { onUpload(); }}
                  disabled={selected.size === 0}
                  className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white px-4"
                >
                  Upload {selected.size > 0 ? `${selected.size} file${selected.size !== 1 ? "s" : ""}` : ""}
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Screen1_UploadAnalysis({ onComplete, onUploadFile }: Screen1Props) {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [showFinder, setShowFinder] = React.useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setCompletedSteps([0]), 500);
    setTimeout(() => setCompletedSteps([0, 1]), 1000);
    setTimeout(() => setCompletedSteps([0, 1, 2]), 1500);
    setTimeout(() => setCompletedSteps([0, 1, 2, 3]), 2000);
    setTimeout(() => { onComplete(); }, 3000);
  };

  const analysisSteps = [
    "Chart of accounts detected (52 accounts)",
    "Vendor list imported (127 vendors)",
    "Transaction history analyzed (3 years)",
    "Identifying compliance requirements..."
  ];

  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12">
        {!isAnalyzing ? (
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-10">

            {/* AI Detection Badge */}
            <div className="mb-6 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  We detected you're using QuickBooks Online
                </span>
              </div>
            </div>

            <div className="mb-8 text-center">
              <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
                Import Data • Migration Intelligence
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                Connect Your QuickBooks Account
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We'll securely import your data and intelligently migrate everything to Clio Accounting with AI-powered optimization.
              </p>
            </div>

            {/* Primary Option: QuickBooks */}
            <div className="mb-6">
              <Button
                onClick={handleAnalyze}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Building2 className="w-5 h-5 mr-2" />
                Connect to QuickBooks Online
              </Button>
              <p className="text-center text-xs text-gray-500 mt-2">
                Recommended • Fastest migration with full history
              </p>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm text-gray-500">Other import options</span>
              </div>
            </div>

            {/* Alternative Options Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* File Upload */}
              <button
                onClick={() => setShowFinder(true)}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <FileText className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Upload File</p>
                  <p className="text-xs text-gray-500 leading-tight">Import CSV, Excel, or QBO file</p>
                </div>
              </button>

              {/* Other Platforms */}
              <button
                onClick={handleAnalyze}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Building2 className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Other Platform</p>
                  <p className="text-xs text-gray-500 leading-tight">Xero, PCLaw, or other software</p>
                </div>
              </button>

              {/* Start from Scratch */}
              <button
                onClick={handleAnalyze}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Upload className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 mb-1">Start from Scratch</p>
                  <p className="text-xs text-gray-500 leading-tight">Set up a fresh chart of accounts</p>
                </div>
              </button>
            </div>

            {/* Help Text */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Need help?{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View migration guide
                </button>
                {" "}or{" "}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  contact support
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-25 scale-[3] pointer-events-none">
              <GalaxyNebula />
            </div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10 overflow-hidden">
              <div className="relative mb-8 mt-4 text-center">
                <h2 className="text-3xl font-semibold text-gray-900 mb-3">
                  Analyzing your QuickBooks data...
                </h2>
                <p className="text-gray-600 text-lg">This will take just a moment</p>
              </div>
              <div className="relative mb-8 flex justify-center">
                <div className="absolute inset-0 flex items-center justify-center scale-75 opacity-75 pointer-events-none">
                  <GalaxyNebula />
                </div>
                <div className="relative inline-block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-white animate-pulse" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-300 animate-ping opacity-30" />
                </div>
              </div>
              <div className="relative space-y-4">
                {analysisSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(index);
                  return (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-blue-600 flex-shrink-0 animate-spin" />
                      )}
                      <span className={isCompleted ? "text-gray-700" : "text-gray-600"}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* macOS Finder modal — overlays this step */}
      {showFinder && (
        <FinderModal
          onClose={() => setShowFinder(false)}
          onUpload={() => {
            setShowFinder(false);
            onUploadFile?.();
          }}
        />
      )}
    </div>
  );
}