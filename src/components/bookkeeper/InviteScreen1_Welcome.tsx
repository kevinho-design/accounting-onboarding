import * as React from "react";
import { CheckCircle, Database, Wifi, Sparkles, Building2, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { CloudBackground } from "../CloudBackground";

interface InviteScreen1Props {
  onComplete: () => void;
}

export function InviteScreen1_Welcome({ onComplete }: InviteScreen1Props) {
  return (
    <div className="relative flex-1 min-h-[calc(100vh-140px)]">
      <CloudBackground />
      <div className="absolute inset-0 backdrop-blur-md bg-white/30 z-10" />

      <div className="relative z-20 flex items-center justify-center min-h-full p-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10">

          {/* Invite header */}
          <div className="flex items-center gap-3 mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Jennifer Hart invited you to Clio Accounting
              </p>
              <p className="text-sm text-gray-500">Hartwell &amp; Morris LLP · Your role: <span className="font-semibold text-blue-700">Bookkeeper</span></p>
            </div>
          </div>

          {/* Firm badge */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 mb-6">
              <Building2 className="w-4 h-4" />
              Hartwell &amp; Morris LLP · Delaware
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Your firm is already up and running
            </h2>
            <p className="text-gray-600 text-base">
              Jennifer finished setting everything up. You're joining a live workspace — no setup required on your end.
            </p>
          </div>

          {/* What's already done */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">12 years of financial history migrated</p>
                <p className="text-xs text-gray-500">All transactions, vendors, and chart of accounts from QuickBooks</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">3 bank feeds connected &amp; syncing live</p>
                <p className="text-xs text-gray-500">Bank of America, City National IOLTA, and Brex corporate card</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Our system, trained on your firm</p>
                <p className="text-xs text-gray-500">Vendor patterns, approval workflows, and IOLTA rules configured</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mb-6">
            We just need 2 minutes to personalize your view as a bookkeeper.
          </p>

          <Button
            onClick={onComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-lg font-semibold text-lg"
          >
            Accept &amp; Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
