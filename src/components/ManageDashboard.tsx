import * as React from "react";
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  Users,
  TrendingUp,
  Calendar,
  FileText
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";

interface ManageDashboardProps {
  onPreviewMigration: () => void;
}

export function ManageDashboard({ onPreviewMigration }: ManageDashboardProps) {
  const stats = [
    { label: "Active Matters", value: "47", icon: Briefcase, color: "from-blue-500 to-blue-600" },
    { label: "Unbilled Hours", value: "142.5", icon: Clock, color: "from-purple-500 to-purple-600" },
    { label: "Outstanding AR", value: "$84,320", icon: DollarSign, color: "from-green-500 to-green-600" },
    { label: "Active Clients", value: "89", icon: Users, color: "from-orange-500 to-orange-600" },
  ];

  const recentMatters = [
    { name: "Smith v. Johnson", client: "Sarah Smith", status: "Discovery", value: "$12,450" },
    { name: "Estate Planning - Williams", client: "Robert Williams", status: "Active", value: "$5,800" },
    { name: "Business Formation - TechCo", client: "TechCo Inc.", status: "Filing", value: "$8,900" },
  ];

  return (
    <div className="flex-1 bg-transparent overflow-y-auto">
      <div className="px-20 py-16 backdrop-blur-md bg-white/30">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Manage Dashboard</h1>
          <p className="text-gray-600">Overview of your practice</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* AMBIENT INSIGHT CARD - CENTER OF DASHBOARD */}
        <div className="mb-8 flex justify-center">
          <div 
            className="relative bg-white rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.1)] max-w-2xl w-full border-2 border-[#0057FF] ambient-glow"
          >
            {/* Contextual Pip - Top Right Corner */}
            <div className="absolute top-4 right-4 w-1 h-1 rounded-full bg-[#0057FF]"
              style={{
                boxShadow: '0 0 4px 2px rgba(0, 87, 255, 0.6)'
              }}
            />

            {/* Label */}
            <div className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mb-3">
              Migration Opportunity
            </div>

            {/* Narrative */}
            <div className="text-[15px] font-medium text-gray-900 leading-relaxed mb-6">
              I've analyzed your Manage transactions and your QBO data. Your current bank feed has <span className="font-semibold text-[#0057FF]">14 unreconciled trust entries</span> from QBO. I can clean this up for you.
            </div>

            {/* Action Button */}
            <Button 
              onClick={onPreviewMigration}
              className="bg-[#1C60FF] hover:bg-[#1550E0] text-white px-6 py-2.5 rounded-lg font-medium"
            >
              Preview Clean Migration
            </Button>
          </div>
        </div>

        {/* Recent Matters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Matters</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentMatters.map((matter, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{matter.name}</div>
                      <div className="text-sm text-gray-600">{matter.client}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                      {matter.status}
                    </div>
                    <div className="font-semibold text-gray-900 w-24 text-right">
                      {matter.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}