import * as React from "react";
import { ArrowDownToLine, Plus } from "lucide-react";
import { Button } from "../ui/button";

export function FundsInPage() {
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Funds In</h1>
          <p className="text-gray-600">Track income, client payments, and trust deposits</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ArrowDownToLine className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Funds In Coming Soon</h2>
          <p className="text-gray-600 mb-6">
            Record payments, manage invoices, and track trust account deposits
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
