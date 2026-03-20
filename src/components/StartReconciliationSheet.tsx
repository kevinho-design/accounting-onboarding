"use client";

import * as React from "react";
import {
  X,
  CheckCircle,
  Clock,
  Eye,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Shield,
  Download,
  Filter,
  Search,
  Calendar,
  Building,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

interface StartReconciliationSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const pendingTransactions = [
  {
    id: "p1",
    date: "2025-01-01",
    description: "Unknown Vendor Payment",
    amount: -325.00,
    account: "Operating Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 3,
    category: "Uncategorized"
  },
  {
    id: "p2",
    date: "2025-01-01",
    description: "Potential Duplicate - Office Depot",
    amount: -89.50,
    account: "Operating Account", 
    type: "expense",
    priority: "high",
    daysOverdue: 1,
    category: "Office Supplies"
  },
  {
    id: "p3",
    date: "2024-12-31",
    description: "Medical Records Co.",
    amount: -1650.00,
    account: "Operating Account",
    type: "expense", 
    priority: "medium",
    daysOverdue: 2,
    category: "Professional Services"
  },
  {
    id: "p4",
    date: "2025-01-01",
    description: "Client Retainer - Smith Case",
    amount: 5000.00,
    account: "Trust Account",
    type: "income",
    priority: "high",
    daysOverdue: 2,
    category: "Client Funds"
  },
  {
    id: "p5",
    date: "2024-12-30",
    description: "Court Filing Fee",
    amount: -350.00,
    account: "Operating Account",
    type: "expense",
    priority: "high", 
    daysOverdue: 3,
    category: "Court Costs"
  },
  {
    id: "p6",
    date: "2025-01-01",
    description: "Monthly Bank Service Fee",
    amount: -25.00,
    account: "Operating Account",
    type: "expense",
    priority: "low",
    daysOverdue: 5,
    category: "Bank Fees"
  },
  {
    id: "p7",
    date: "2024-12-29",
    description: "Insurance Premium - Q1",
    amount: -2400.00,
    account: "Operating Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 6,
    category: "Insurance"
  },
  {
    id: "p8",
    date: "2025-01-01",
    description: "Equipment Purchase - Printer",
    amount: -450.00,
    account: "Operating Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 2,
    category: "Equipment"
  },
  {
    id: "p9",
    date: "2024-12-31",
    description: "IOLTA Interest Income",
    amount: 125.50,
    account: "IOLTA Trust Account",
    type: "income",
    priority: "low",
    daysOverdue: 1,
    category: "Interest Income"
  },
  {
    id: "p10",
    date: "2025-01-01",
    description: "Payroll Tax Payment",
    amount: -3200.00,
    account: "Payroll Account",
    type: "expense",
    priority: "high",
    daysOverdue: 2,
    category: "Payroll Taxes"
  },
  {
    id: "p11",
    date: "2024-12-28",
    description: "Client Entertainment - Holiday Party",
    amount: -580.00,
    account: "Operating Account",
    type: "expense",
    priority: "low",
    daysOverdue: 4,
    category: "Client Entertainment"
  },
  {
    id: "p12",
    date: "2025-01-01",
    description: "Bar Association Membership Renewal",
    amount: -450.00,
    account: "Operating Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 1,
    category: "Professional Dues"
  },
  {
    id: "p13",
    date: "2024-12-30",
    description: "Client Trust Transfer - Wilson Case",
    amount: 3500.00,
    account: "Trust Account",
    type: "transfer",
    priority: "high",
    daysOverdue: 2,
    category: "Client Funds"
  },
  {
    id: "p14",
    date: "2025-01-01",
    description: "Legal Database Subscription",
    amount: -199.00,
    account: "Operating Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 1,
    category: "Software"
  },
  {
    id: "p15",
    date: "2024-12-29",
    description: "Office Security System",
    amount: -125.00,
    account: "Operating Account",
    type: "expense",
    priority: "low",
    daysOverdue: 3,
    category: "Security"
  },
  {
    id: "p16",
    date: "2025-01-01",
    description: "Client Reimbursement - Expert Witness",
    amount: -2850.00,
    account: "Operating Account",
    type: "expense",
    priority: "high",
    daysOverdue: 1,
    category: "Expert Witness Fees"
  },
  {
    id: "p17",
    date: "2024-12-31",
    description: "Parking Meter Violations",
    amount: -75.00,
    account: "Operating Account",
    type: "expense",
    priority: "low",
    daysOverdue: 1,
    category: "Parking"
  },
  {
    id: "p18",
    date: "2024-12-30",
    description: "Conference Registration - ABA",
    amount: -895.00,
    account: "Operating Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 2,
    category: "Professional Development"
  },
  {
    id: "p19",
    date: "2025-01-01",
    description: "Paralegal Overtime Payment",
    amount: -340.00,
    account: "Payroll Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 1,
    category: "Overtime"
  },
  {
    id: "p20",
    date: "2024-12-29",
    description: "Client Advance - Corporate Matter",
    amount: 15000.00,
    account: "Trust Account",
    type: "income",
    priority: "high",
    daysOverdue: 3,
    category: "Client Advances"
  },
  {
    id: "p21",
    date: "2025-01-01",
    description: "Document Storage Service",
    amount: -89.00,
    account: "Operating Account",
    type: "expense",
    priority: "low",
    daysOverdue: 1,
    category: "Storage"
  },
  {
    id: "p22",
    date: "2024-12-31",
    description: "Law Library Access Fee",
    amount: -250.00,
    account: "Operating Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 1,
    category: "Research"
  },
  {
    id: "p23",
    date: "2024-12-30",
    description: "IT Support - Emergency Call",
    amount: -175.00,
    account: "Operating Account",
    type: "expense",
    priority: "medium",
    daysOverdue: 2,
    category: "IT Support"
  }
];

const automatedTransactions = [
  {
    id: "a1",
    date: "2025-01-01",
    description: "Office Rent - January",
    amount: -4500.00,
    account: "Operating Account",
    type: "expense",
    category: "Rent",
    confidence: 98,
    matchedRule: "Recurring rent payment"
  },
  {
    id: "a2", 
    date: "2025-01-01",
    description: "Client Payment - Johnson vs. State",
    amount: 2500.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 95,
    matchedRule: "Invoice #INV-2024-1205"
  },
  {
    id: "a3",
    date: "2024-12-31",
    description: "LexisNexis Subscription",
    amount: -299.00,
    account: "Operating Account",
    type: "expense",
    category: "Legal Research",
    confidence: 100,
    matchedRule: "Recurring software subscription"
  },
  {
    id: "a4",
    date: "2025-01-01",
    description: "Client Trust Transfer - Wilson Matter",
    amount: 1500.00,
    account: "Trust Account",
    type: "transfer",
    category: "Client Funds",
    confidence: 92,
    matchedRule: "Trust account rule TF-001"
  },
  {
    id: "a5",
    date: "2024-12-30",
    description: "Utility Payment - Electric",
    amount: -285.50,
    account: "Operating Account",
    type: "expense",
    category: "Utilities",
    confidence: 96,
    matchedRule: "Recurring utility payment"
  },
  {
    id: "a6",
    date: "2025-01-01",
    description: "Employee Salary - December",
    amount: -8500.00,
    account: "Payroll Account",
    type: "expense",
    category: "Salaries",
    confidence: 100,
    matchedRule: "Payroll processing rule PR-001"
  },
  {
    id: "a7",
    date: "2024-12-29",
    description: "Client Reimbursement - Travel",
    amount: -180.75,
    account: "Operating Account",
    type: "expense",
    category: "Client Expenses",
    confidence: 89,
    matchedRule: "Expense reimbursement rule ER-003"
  },
  {
    id: "a8",
    date: "2025-01-01",
    description: "Interest Income - Business Savings",
    amount: 45.25,
    account: "Business Savings",
    type: "income",
    category: "Interest Income",
    confidence: 100,
    matchedRule: "Interest accrual rule INT-001"
  },
  {
    id: "a9",
    date: "2024-12-31",
    description: "Phone Service - Verizon",
    amount: -195.00,
    account: "Operating Account",
    type: "expense",
    category: "Telecommunications",
    confidence: 94,
    matchedRule: "Recurring phone bill"
  },
  {
    id: "a10",
    date: "2025-01-01",
    description: "Client Payment - Estate Planning",
    amount: 1800.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 97,
    matchedRule: "Invoice #INV-2024-1189"
  },
  {
    id: "a11",
    date: "2024-12-30",
    description: "Internet Service - Comcast",
    amount: -89.99,
    account: "Operating Account",
    type: "expense",
    category: "Internet",
    confidence: 98,
    matchedRule: "Recurring internet service"
  },
  {
    id: "a12",
    date: "2025-01-01",
    description: "Office Supplies - Staples",
    amount: -156.78,
    account: "Operating Account",
    type: "expense",
    category: "Office Supplies",
    confidence: 91,
    matchedRule: "Vendor match STAPLES-001"
  },
  {
    id: "a13",
    date: "2024-12-29",
    description: "Coffee Service - Monthly",
    amount: -85.00,
    account: "Operating Account",
    type: "expense",
    category: "Office Amenities",
    confidence: 95,
    matchedRule: "Recurring office service"
  },
  {
    id: "a14",
    date: "2025-01-01",
    description: "Client Payment - Personal Injury",
    amount: 3200.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 96,
    matchedRule: "Invoice #INV-2024-1234"
  },
  {
    id: "a15",
    date: "2024-12-31",
    description: "Cleaning Service - December",
    amount: -120.00,
    account: "Operating Account",
    type: "expense",
    category: "Janitorial",
    confidence: 93,
    matchedRule: "Recurring cleaning service"
  },
  {
    id: "a16",
    date: "2025-01-01",
    description: "Gas Bill - December",
    amount: -145.30,
    account: "Operating Account",
    type: "expense",
    category: "Utilities",
    confidence: 97,
    matchedRule: "Recurring gas bill"
  },
  {
    id: "a17",
    date: "2024-12-30",
    description: "Water Service - City",
    amount: -78.50,
    account: "Operating Account",
    type: "expense",
    category: "Utilities",
    confidence: 99,
    matchedRule: "Recurring water bill"
  },
  {
    id: "a18",
    date: "2025-01-01",
    description: "Client Trust Deposit - Martinez",
    amount: 2000.00,
    account: "Trust Account",
    type: "income",
    category: "Client Funds",
    confidence: 94,
    matchedRule: "Trust deposit rule TD-005"
  },
  {
    id: "a19",
    date: "2024-12-29",
    description: "Paralegal Salary - December",
    amount: -3200.00,
    account: "Payroll Account",
    type: "expense",
    category: "Salaries",
    confidence: 100,
    matchedRule: "Payroll processing rule PR-002"
  },
  {
    id: "a20",
    date: "2025-01-01",
    description: "Legal Assistant Salary",
    amount: -2800.00,
    account: "Payroll Account",
    type: "expense",
    category: "Salaries",
    confidence: 100,
    matchedRule: "Payroll processing rule PR-003"
  },
  {
    id: "a21",
    date: "2024-12-31",
    description: "Microsoft Office 365",
    amount: -45.00,
    account: "Operating Account",
    type: "expense",
    category: "Software",
    confidence: 100,
    matchedRule: "Recurring software subscription"
  },
  {
    id: "a22",
    date: "2025-01-01",
    description: "Client Payment - Contract Review",
    amount: 850.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 93,
    matchedRule: "Invoice #INV-2024-1156"
  },
  {
    id: "a23",
    date: "2024-12-30",
    description: "Printer Lease - December",
    amount: -125.00,
    account: "Operating Account",
    type: "expense",
    category: "Equipment Lease",
    confidence: 98,
    matchedRule: "Recurring equipment lease"
  },
  {
    id: "a24",
    date: "2025-01-01",
    description: "Trash Service - Monthly",
    amount: -45.00,
    account: "Operating Account",
    type: "expense",
    category: "Waste Management",
    confidence: 96,
    matchedRule: "Recurring waste service"
  },
  {
    id: "a25",
    date: "2024-12-29",
    description: "Client Payment - Divorce Case",
    amount: 1200.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 95,
    matchedRule: "Invoice #INV-2024-1167"
  },
  {
    id: "a26",
    date: "2025-01-01",
    description: "Security System - Monthly",
    amount: -89.00,
    account: "Operating Account",
    type: "expense",
    category: "Security",
    confidence: 97,
    matchedRule: "Recurring security service"
  },
  {
    id: "a27",
    date: "2024-12-31",
    description: "Bank Service Fee - Business",
    amount: -35.00,
    account: "Operating Account",
    type: "expense",
    category: "Bank Fees",
    confidence: 100,
    matchedRule: "Recurring bank fee"
  },
  {
    id: "a28",
    date: "2025-01-01",
    description: "Client Trust Interest",
    amount: 25.00,
    account: "Trust Account",
    type: "income",
    category: "Interest Income",
    confidence: 100,
    matchedRule: "Trust interest rule TI-001"
  },
  {
    id: "a29",
    date: "2024-12-30",
    description: "Office Equipment Maintenance",
    amount: -150.00,
    account: "Operating Account",
    type: "expense",
    category: "Maintenance",
    confidence: 92,
    matchedRule: "Service contract SC-001"
  },
  {
    id: "a30",
    date: "2025-01-01",
    description: "Client Payment - Criminal Defense",
    amount: 2800.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 96,
    matchedRule: "Invoice #INV-2024-1178"
  },
  {
    id: "a31",
    date: "2024-12-29",
    description: "Receptionist Salary",
    amount: -2400.00,
    account: "Payroll Account",
    type: "expense",
    category: "Salaries",
    confidence: 100,
    matchedRule: "Payroll processing rule PR-004"
  },
  {
    id: "a32",
    date: "2025-01-01",
    description: "Health Insurance Premium",
    amount: -850.00,
    account: "Operating Account",
    type: "expense",
    category: "Insurance",
    confidence: 98,
    matchedRule: "Recurring insurance payment"
  },
  {
    id: "a33",
    date: "2024-12-31",
    description: "Parking Garage - Monthly",
    amount: -180.00,
    account: "Operating Account",
    type: "expense",
    category: "Parking",
    confidence: 94,
    matchedRule: "Recurring parking fee"
  },
  {
    id: "a34",
    date: "2025-01-01",
    description: "Client Payment - Real Estate",
    amount: 1500.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 94,
    matchedRule: "Invoice #INV-2024-1145"
  },
  {
    id: "a35",
    date: "2024-12-30",
    description: "Professional Liability Insurance",
    amount: -420.00,
    account: "Operating Account",
    type: "expense",
    category: "Insurance",
    confidence: 99,
    matchedRule: "Recurring insurance payment"
  },
  {
    id: "a36",
    date: "2025-01-01",
    description: "Office Furniture Lease",
    amount: -290.00,
    account: "Operating Account",
    type: "expense",
    category: "Equipment Lease",
    confidence: 97,
    matchedRule: "Recurring furniture lease"
  },
  {
    id: "a37",
    date: "2024-12-29",
    description: "Client Trust Withdrawal - Smith",
    amount: -1800.00,
    account: "Trust Account",
    type: "transfer",
    category: "Client Funds",
    confidence: 91,
    matchedRule: "Trust withdrawal rule TW-002"
  },
  {
    id: "a38",
    date: "2025-01-01",
    description: "Copy Machine Lease",
    amount: -165.00,
    account: "Operating Account",
    type: "expense",
    category: "Equipment Lease",
    confidence: 98,
    matchedRule: "Recurring equipment lease"
  },
  {
    id: "a39",
    date: "2024-12-31",
    description: "Client Payment - Employment Law",
    amount: 2200.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 95,
    matchedRule: "Invoice #INV-2024-1199"
  },
  {
    id: "a40",
    date: "2025-01-01",
    description: "Postage and Shipping",
    amount: -78.50,
    account: "Operating Account",
    type: "expense",
    category: "Postage",
    confidence: 90,
    matchedRule: "Vendor match USPS-001"
  },
  {
    id: "a41",
    date: "2024-12-30",
    description: "Legal Forms Software",
    amount: -95.00,
    account: "Operating Account",
    type: "expense",
    category: "Software",
    confidence: 96,
    matchedRule: "Recurring software subscription"
  },
  {
    id: "a42",
    date: "2025-01-01",
    description: "Client Payment - Bankruptcy",
    amount: 1600.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 93,
    matchedRule: "Invoice #INV-2024-1223"
  },
  {
    id: "a43",
    date: "2024-12-29",
    description: "File Storage - Monthly",
    amount: -60.00,
    account: "Operating Account",
    type: "expense",
    category: "Storage",
    confidence: 94,
    matchedRule: "Recurring storage service"
  },
  {
    id: "a44",
    date: "2025-01-01",
    description: "Client Trust Deposit - Anderson",
    amount: 3500.00,
    account: "Trust Account",
    type: "income",
    category: "Client Funds",
    confidence: 92,
    matchedRule: "Trust deposit rule TD-006"
  },
  {
    id: "a45",
    date: "2024-12-31",
    description: "Elevator Maintenance",
    amount: -180.00,
    account: "Operating Account",
    type: "expense",
    category: "Building Maintenance",
    confidence: 89,
    matchedRule: "Service contract SC-002"
  },
  {
    id: "a46",
    date: "2025-01-01",
    description: "Client Payment - Immigration",
    amount: 950.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 94,
    matchedRule: "Invoice #INV-2024-1211"
  },
  {
    id: "a47",
    date: "2024-12-30",
    description: "HVAC Maintenance",
    amount: -220.00,
    account: "Operating Account",
    type: "expense",
    category: "Building Maintenance",
    confidence: 91,
    matchedRule: "Service contract SC-003"
  },
  {
    id: "a48",
    date: "2025-01-01",
    description: "Accounting Software",
    amount: -75.00,
    account: "Operating Account",
    type: "expense",
    category: "Software",
    confidence: 100,
    matchedRule: "Recurring software subscription"
  },
  {
    id: "a49",
    date: "2024-12-29",
    description: "Client Payment - Probate",
    amount: 1350.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 95,
    matchedRule: "Invoice #INV-2024-1187"
  },
  {
    id: "a50",
    date: "2025-01-01",
    description: "Document Shredding Service",
    amount: -45.00,
    account: "Operating Account",
    type: "expense",
    category: "Document Management",
    confidence: 93,
    matchedRule: "Recurring shredding service"
  },
  {
    id: "a51",
    date: "2024-12-31",
    description: "Client Trust Withdrawal - Wilson",
    amount: -2200.00,
    account: "Trust Account",
    type: "transfer",
    category: "Client Funds",
    confidence: 90,
    matchedRule: "Trust withdrawal rule TW-003"
  },
  {
    id: "a52",
    date: "2025-01-01",
    description: "Marketing Services",
    amount: -350.00,
    account: "Operating Account",
    type: "expense",
    category: "Marketing",
    confidence: 88,
    matchedRule: "Vendor match MARKETING-001"
  },
  {
    id: "a53",
    date: "2024-12-30",
    description: "Client Payment - Tax Law",
    amount: 2800.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 96,
    matchedRule: "Invoice #INV-2024-1245"
  },
  {
    id: "a54",
    date: "2025-01-01",
    description: "Property Tax - Office",
    amount: -1200.00,
    account: "Operating Account",
    type: "expense",
    category: "Property Tax",
    confidence: 100,
    matchedRule: "Recurring property tax"
  },
  {
    id: "a55",
    date: "2024-12-29",
    description: "Client Trust Interest - IOLTA",
    amount: 85.50,
    account: "IOLTA Trust Account",
    type: "income",
    category: "Interest Income",
    confidence: 100,
    matchedRule: "IOLTA interest rule IOL-001"
  },
  {
    id: "a56",
    date: "2025-01-01",
    description: "Office Lease - Parking",
    amount: -250.00,
    account: "Operating Account",
    type: "expense",
    category: "Parking",
    confidence: 97,
    matchedRule: "Recurring parking lease"
  },
  {
    id: "a57",
    date: "2024-12-31",
    description: "Client Payment - Corporate Law",
    amount: 4200.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 97,
    matchedRule: "Invoice #INV-2024-1267"
  },
  {
    id: "a58",
    date: "2025-01-01",
    description: "Payroll Service Fee",
    amount: -89.00,
    account: "Payroll Account",
    type: "expense",
    category: "Payroll Services",
    confidence: 99,
    matchedRule: "Recurring payroll service"
  },
  {
    id: "a59",
    date: "2024-12-30",
    description: "Office Water Service",
    amount: -35.00,
    account: "Operating Account",
    type: "expense",
    category: "Office Amenities",
    confidence: 95,
    matchedRule: "Recurring water service"
  },
  {
    id: "a60",
    date: "2025-01-01",
    description: "Client Payment - Litigation",
    amount: 3800.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 98,
    matchedRule: "Invoice #INV-2024-1289"
  },
  {
    id: "a61",
    date: "2024-12-29",
    description: "Building Insurance",
    amount: -680.00,
    account: "Operating Account",
    type: "expense",
    category: "Insurance",
    confidence: 98,
    matchedRule: "Recurring insurance payment"
  },
  {
    id: "a62",
    date: "2025-01-01",
    description: "Client Trust Deposit - Garcia",
    amount: 2500.00,
    account: "Trust Account",
    type: "income",
    category: "Client Funds",
    confidence: 93,
    matchedRule: "Trust deposit rule TD-007"
  },
  {
    id: "a63",
    date: "2024-12-31",
    description: "Office Alarm System",
    amount: -55.00,
    account: "Operating Account",
    type: "expense",
    category: "Security",
    confidence: 96,
    matchedRule: "Recurring security service"
  },
  {
    id: "a64",
    date: "2025-01-01",
    description: "Client Payment - Family Law",
    amount: 1750.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 94,
    matchedRule: "Invoice #INV-2024-1298"
  },
  {
    id: "a65",
    date: "2024-12-30",
    description: "Court Reporter Services",
    amount: -450.00,
    account: "Operating Account",
    type: "expense",
    category: "Court Services",
    confidence: 87,
    matchedRule: "Vendor match COURT-001"
  },
  {
    id: "a66",
    date: "2025-01-01",
    description: "Office Plants Service",
    amount: -25.00,
    account: "Operating Account",
    type: "expense",
    category: "Office Amenities",
    confidence: 92,
    matchedRule: "Recurring plant service"
  },
  {
    id: "a67",
    date: "2024-12-29",
    description: "Client Trust Withdrawal - Martinez",
    amount: -1500.00,
    account: "Trust Account",
    type: "transfer",
    category: "Client Funds",
    confidence: 89,
    matchedRule: "Trust withdrawal rule TW-004"
  },
  {
    id: "a68",
    date: "2025-01-01",
    description: "Office Window Cleaning",
    amount: -85.00,
    account: "Operating Account",
    type: "expense",
    category: "Janitorial",
    confidence: 91,
    matchedRule: "Recurring cleaning service"
  },
  {
    id: "a69",
    date: "2024-12-31",
    description: "Client Payment - Intellectual Property",
    amount: 2650.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 95,
    matchedRule: "Invoice #INV-2024-1312"
  },
  {
    id: "a70",
    date: "2025-01-01",
    description: "Legal Research Database",
    amount: -185.00,
    account: "Operating Account",
    type: "expense",
    category: "Legal Research",
    confidence: 100,
    matchedRule: "Recurring research subscription"
  },
  {
    id: "a71",
    date: "2024-12-30",
    description: "Office Carpet Cleaning",
    amount: -120.00,
    account: "Operating Account",
    type: "expense",
    category: "Janitorial",
    confidence: 88,
    matchedRule: "Quarterly cleaning service"
  },
  {
    id: "a72",
    date: "2025-01-01",
    description: "Client Payment - Labor Law",
    amount: 1950.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 93,
    matchedRule: "Invoice #INV-2024-1324"
  },
  {
    id: "a73",
    date: "2024-12-29",
    description: "Office Supply Delivery",
    amount: -45.00,
    account: "Operating Account",
    type: "expense",
    category: "Office Supplies",
    confidence: 89,
    matchedRule: "Vendor match SUPPLY-001"
  },
  {
    id: "a74",
    date: "2025-01-01",
    description: "Client Trust Interest Distribution",
    amount: 125.00,
    account: "Trust Account",
    type: "income",
    category: "Interest Income",
    confidence: 100,
    matchedRule: "Trust interest rule TI-002"
  },
  {
    id: "a75",
    date: "2024-12-31",
    description: "Office Backup Service",
    amount: -65.00,
    account: "Operating Account",
    type: "expense",
    category: "IT Services",
    confidence: 94,
    matchedRule: "Recurring backup service"
  },
  {
    id: "a76",
    date: "2025-01-01",
    description: "Client Payment - Medical Malpractice",
    amount: 5200.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 97,
    matchedRule: "Invoice #INV-2024-1335"
  },
  {
    id: "a77",
    date: "2024-12-30",
    description: "Conference Room Equipment",
    amount: -280.00,
    account: "Operating Account",
    type: "expense",
    category: "Equipment",
    confidence: 86,
    matchedRule: "Equipment purchase EP-001"
  },
  {
    id: "a78",
    date: "2025-01-01",
    description: "Office Lobby Maintenance",
    amount: -95.00,
    account: "Operating Account",
    type: "expense",
    category: "Building Maintenance",
    confidence: 90,
    matchedRule: "Building service BS-001"
  },
  {
    id: "a79",
    date: "2024-12-29",
    description: "Client Trust Deposit - Thompson",
    amount: 4000.00,
    account: "Trust Account",
    type: "income",
    category: "Client Funds",
    confidence: 94,
    matchedRule: "Trust deposit rule TD-008"
  },
  {
    id: "a80",
    date: "2025-01-01",
    description: "Office Printer Supplies",
    amount: -125.00,
    account: "Operating Account",
    type: "expense",
    category: "Office Supplies",
    confidence: 91,
    matchedRule: "Vendor match PRINTER-001"
  },
  {
    id: "a81",
    date: "2024-12-31",
    description: "Client Payment - Environmental Law",
    amount: 3100.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 96,
    matchedRule: "Invoice #INV-2024-1347"
  },
  {
    id: "a82",
    date: "2025-01-01",
    description: "Office Temperature Control",
    amount: -175.00,
    account: "Operating Account",
    type: "expense",
    category: "Utilities",
    confidence: 93,
    matchedRule: "HVAC service HS-001"
  },
  {
    id: "a83",
    date: "2024-12-30",
    description: "Legal Secretary Bonus",
    amount: -500.00,
    account: "Payroll Account",
    type: "expense",
    category: "Bonuses",
    confidence: 100,
    matchedRule: "Bonus payment BP-001"
  },
  {
    id: "a84",
    date: "2025-01-01",
    description: "Office Kitchen Supplies",
    amount: -75.00,
    account: "Operating Account",
    type: "expense",
    category: "Office Amenities",
    confidence: 88,
    matchedRule: "Office supplies OS-001"
  },
  {
    id: "a85",
    date: "2024-12-29",
    description: "Client Payment - Securities Law",
    amount: 4800.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 98,
    matchedRule: "Invoice #INV-2024-1359"
  },
  {
    id: "a86",
    date: "2025-01-01",
    description: "Office Mail Service",
    amount: -35.00,
    account: "Operating Account",
    type: "expense",
    category: "Postage",
    confidence: 95,
    matchedRule: "Recurring mail service"
  },
  {
    id: "a87",
    date: "2024-12-31",
    description: "Client Trust Withdrawal - Anderson",
    amount: -2800.00,
    account: "Trust Account",
    type: "transfer",
    category: "Client Funds",
    confidence: 92,
    matchedRule: "Trust withdrawal rule TW-005"
  },
  {
    id: "a88",
    date: "2025-01-01",
    description: "Office Lighting Maintenance",
    amount: -140.00,
    account: "Operating Account",
    type: "expense",
    category: "Building Maintenance",
    confidence: 87,
    matchedRule: "Maintenance service MS-001"
  },
  {
    id: "a89",
    date: "2024-12-30",
    description: "Client Payment - Antitrust",
    amount: 6500.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 99,
    matchedRule: "Invoice #INV-2024-1371"
  },
  {
    id: "a90",
    date: "2025-01-01",
    description: "Office Fire Safety Inspection",
    amount: -200.00,
    account: "Operating Account",
    type: "expense",
    category: "Safety",
    confidence: 96,
    matchedRule: "Safety inspection SI-001"
  },
  {
    id: "a91",
    date: "2024-12-29",
    description: "Office Restroom Supplies",
    amount: -85.00,
    account: "Operating Account",
    type: "expense",
    category: "Janitorial",
    confidence: 90,
    matchedRule: "Janitorial supplies JS-001"
  },
  {
    id: "a92",
    date: "2025-01-01",
    description: "Client Trust Deposit - Rodriguez",
    amount: 3200.00,
    account: "Trust Account",
    type: "income",
    category: "Client Funds",
    confidence: 95,
    matchedRule: "Trust deposit rule TD-009"
  },
  {
    id: "a93",
    date: "2024-12-31",
    description: "Office Air Freshener Service",
    amount: -25.00,
    account: "Operating Account",
    type: "expense",
    category: "Office Amenities",
    confidence: 89,
    matchedRule: "Office service OS-002"
  },
  {
    id: "a94",
    date: "2025-01-01",
    description: "Client Payment - Patent Law",
    amount: 3750.00,
    account: "Operating Account",
    type: "income",
    category: "Legal Fees",
    confidence: 97,
    matchedRule: "Invoice #INV-2024-1383"
  }
];

const TransactionRow = ({ transaction, type = "pending" }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    return {
      formatted: `$${absAmount.toLocaleString()}`,
      isNegative
    };
  };

  const { formatted, isNegative } = formatAmount(transaction.amount);

  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex items-center gap-2">
            {isNegative ? (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            ) : (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            )}
            <span className="font-medium">{transaction.description}</span>
          </div>
          {type === "pending" && (
            <Badge variant="outline" className={`text-xs ${getPriorityColor(transaction.priority)}`}>
              {transaction.priority}
            </Badge>
          )}
          {type === "automated" && (
            <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
              {transaction.confidence}% confidence
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{transaction.account}</span>
          <span>{transaction.category}</span>
          <span>{transaction.date}</span>
          {type === "pending" && (
            <span className="flex items-center gap-1 text-orange-600">
              <Clock className="h-3 w-3" />
              {transaction.daysOverdue} days overdue
            </span>
          )}
          {type === "automated" && (
            <span className="flex items-center gap-1 text-green-600">
              <Zap className="h-3 w-3" />
              {transaction.matchedRule}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`font-semibold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
          {isNegative ? '-' : '+'}{formatted}
        </span>
        {type === "pending" && (
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Review
          </Button>
        )}
      </div>
    </div>
  );
};

export function StartReconciliationSheet({ isOpen, onClose }: StartReconciliationSheetProps) {
  const [activeTab, setActiveTab] = React.useState("pending");
  const [searchTerm, setSearchTerm] = React.useState("");

  const totalPending = pendingTransactions.length;
  const totalAutomated = automatedTransactions.length;
  const totalProgress = 91; // Hardcoded to 91% as requested

  const filteredPendingTransactions = pendingTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAutomatedTransactions = automatedTransactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sheet covering whole page except top 20px */}
      <div
        className={`fixed top-5 left-0 right-0 h-[calc(100vh-20px)] bg-white shadow-2xl z-50 transition-all duration-300 flex flex-col ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Month-End Reconciliation</h2>
              <p className="text-sm text-muted-foreground">
                Reconcile all transactions across all bank accounts
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Summary Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b flex-shrink-0">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalPending}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalAutomated}</div>
              <div className="text-sm text-muted-foreground">Automated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalProgress}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">July 31</div>
              <div className="text-sm text-muted-foreground">Due Date</div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-auto grid-cols-2">
                  <TabsTrigger value="pending">Pending ({totalPending})</TabsTrigger>
                  <TabsTrigger value="automated">Automated ({totalAutomated})</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden px-6 pb-6">
              <TabsContent value="pending" className="mt-0 h-full">
                <div className="h-full border rounded-lg bg-white">
                  <div className="p-4 border-b bg-orange-50">
                    <h3 className="font-semibold text-orange-900">Transactions Requiring Review</h3>
                    <p className="text-sm text-orange-800">
                      {filteredPendingTransactions.length} transactions need your attention to complete reconciliation
                    </p>
                  </div>
                  <ScrollArea className="h-[calc(100%-80px)]">
                    {filteredPendingTransactions.map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} type="pending" />
                    ))}
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="automated" className="mt-0 h-full">
                <div className="h-full border rounded-lg bg-white">
                  <div className="p-4 border-b bg-green-50">
                    <h3 className="font-semibold text-green-900">AI-Processed Transactions</h3>
                    <p className="text-sm text-green-800">
                      {filteredAutomatedTransactions.length} transactions automatically categorized and reconciled this month
                    </p>
                  </div>
                  <ScrollArea className="h-[calc(100%-80px)]">
                    {filteredAutomatedTransactions.map((transaction) => (
                      <TransactionRow key={transaction.id} transaction={transaction} type="automated" />
                    ))}
                  </ScrollArea>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Reconciliation period: July 1-31, 2025
              </span>
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                All trust accounts compliant
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                Save Progress
              </Button>
              <Button>
                Complete Reconciliation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}