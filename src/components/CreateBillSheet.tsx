"use client";

import * as React from "react";
import { X, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import exampleImage from 'figma:asset/85a0c772053cb2fe6e36dfec4946cc3499931f68.png';

interface CreateBillSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateBillSheet({ isOpen, onClose }: CreateBillSheetProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState("");
  const [invoiceType, setInvoiceType] = React.useState("revenue");
  const [selectedItem, setSelectedItem] = React.useState("");
  const [invoiceAmount, setInvoiceAmount] = React.useState("");
  const [paymentCollection, setPaymentCollection] = React.useState("request");
  const [previewTab, setPreviewTab] = React.useState("invoice");

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-lg font-medium text-gray-900">Collect payment</h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Send
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* Left Panel - Form */}
            <div className="w-1/2 flex flex-col min-h-0">
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Contact Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">Contact</Label>
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div>
                        <div className="font-medium text-gray-900">Sophia Brown</div>
                        <div className="text-sm text-gray-500">sophia@example.com</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Template Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Invoice</SelectItem>
                        <SelectItem value="legal">Legal Services</SelectItem>
                        <SelectItem value="retainer">Retainer Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedTemplate && (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-pink-100 border-2 border-pink-300 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        </div>
                        <span className="text-xs text-pink-600 font-medium">click</span>
                      </div>
                    )}
                  </div>

                  {/* Type of Invoice Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">Type of invoice</Label>
                    <RadioGroup value={invoiceType} onValueChange={setInvoiceType} className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="revenue" id="revenue" className="mt-0.5" />
                        <div className="space-y-1">
                          <Label htmlFor="revenue" className="font-medium text-gray-900 cursor-pointer">
                            Revenue
                          </Label>
                          <p className="text-sm text-gray-500">Get paid for expenses and work done</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="trust" id="trust" className="mt-0.5" />
                        <div className="space-y-1">
                          <Label htmlFor="trust" className="font-medium text-gray-900 cursor-pointer">
                            Trust
                          </Label>
                          <p className="text-sm text-gray-500">Request funds held in trust</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="retainer" id="retainer" className="mt-0.5" />
                        <div className="space-y-1">
                          <Label htmlFor="retainer" className="font-medium text-gray-900 cursor-pointer">
                            Retainer
                          </Label>
                          <p className="text-sm text-gray-500">Request funds to retain client</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Add Items Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">Add items</Label>
                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an existing or new item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Legal Consultation</SelectItem>
                        <SelectItem value="research">Legal Research</SelectItem>
                        <SelectItem value="drafting">Document Drafting</SelectItem>
                        <SelectItem value="new">+ Add New Item</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Invoice Amount Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">Invoice amount</Label>
                    <p className="text-sm text-gray-500">How much would you like to request?</p>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="text"
                        value={invoiceAmount}
                        onChange={(e) => setInvoiceAmount(e.target.value)}
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Payment Collection Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-900">Payment collection</Label>
                    <RadioGroup value={paymentCollection} onValueChange={setPaymentCollection} className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="request" id="request" className="mt-0.5" />
                        <div className="space-y-1">
                          <Label htmlFor="request" className="font-medium text-gray-900 cursor-pointer">
                            Request payment
                          </Label>
                          <p className="text-sm text-gray-500">Create an invoice requesting payment on a specific date</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value="autocharge" id="autocharge" className="mt-0.5" />
                        <div className="space-y-1">
                          <Label htmlFor="autocharge" className="font-medium text-gray-900 cursor-pointer">
                            Autocharge customer
                          </Label>
                          <p className="text-sm text-gray-500">Automatically charge a payment method on file</p>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-1/2 bg-gray-50 border-l border-gray-200 flex flex-col min-h-0">
              <div className="flex-1 p-6 flex flex-col min-h-0">
                <div className="mb-4 flex-shrink-0">
                  <Label className="text-sm font-medium text-gray-900">Preview</Label>
                </div>

                {/* Preview Tabs */}
                <div className="flex border-b border-gray-200 mb-6 flex-shrink-0">
                  <button
                    onClick={() => setPreviewTab("invoice")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      previewTab === "invoice"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Invoice PDF
                  </button>
                  <button
                    onClick={() => setPreviewTab("email")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      previewTab === "email"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    onClick={() => setPreviewTab("payment")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      previewTab === "payment"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Payment page
                  </button>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-white rounded-lg shadow-sm p-6 overflow-y-auto min-h-0">
                  {previewTab === "invoice" && (
                    <div className="space-y-6">
                      {/* Invoice Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">Invoice</h3>
                          <div className="mt-2 text-sm text-gray-600 space-y-1">
                            <div><span className="font-medium">Invoice number:</span> INV-C-0001</div>
                            <div><span className="font-medium">Date of issue:</span> July 1, 2023</div>
                            <div><span className="font-medium">Date due:</span> July 31, 2023</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg text-gray-900">Clio Law</div>
                          <div className="text-sm text-gray-600 mt-1">
                            123 Main Street, Suite 100<br />
                            Anytown, BC V0H 1Z0<br />
                            United States
                          </div>
                        </div>
                      </div>

                      {/* Bill To */}
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Clio Law</h4>
                          <div className="text-sm text-gray-600">
                            123 Main Street, Suite 100<br />
                            Anytown, BC V0H 1Z0<br />
                            United States
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Bill to Sophia Brown</h4>
                          <div className="text-sm text-gray-600">
                            123 Main Street, Suite 100<br />
                            Anytown, BC V0H 1Z0<br />
                            United States
                          </div>
                        </div>
                      </div>

                      {/* Invoice Table Placeholder */}
                      <div className="border border-gray-200 rounded-md">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex justify-between text-sm font-medium text-gray-900">
                            <span>Description</span>
                            <span>Amount</span>
                          </div>
                        </div>
                        <div className="px-4 py-8 text-center text-gray-500">
                          <p>Invoice items will appear here</p>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-end">
                        <div className="w-48">
                          <div className="flex justify-between py-2 border-t border-gray-200">
                            <span className="font-medium text-gray-900">Total</span>
                            <span className="font-semibold text-gray-900">
                              ${invoiceAmount || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewTab === "email" && (
                    <div className="space-y-4">
                      <div className="text-center text-gray-500 py-8">
                        <p>Email preview will be shown here</p>
                      </div>
                    </div>
                  )}

                  {previewTab === "payment" && (
                    <div className="space-y-4">
                      <div className="text-center text-gray-500 py-8">
                        <p>Payment page preview will be shown here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}