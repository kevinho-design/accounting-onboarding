"use client";

import * as React from "react";
import { TrendingUp, TrendingDown, DollarSign, Users, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

// Mock data for practice area performance
const practiceAreaData = [
  {
    name: "Immigration Law",
    revenue: 58000,
    leads: 3,
    trend: "up",
    trendValue: 12
  },
  {
    name: "Family Law", 
    revenue: 42000,
    leads: 2,
    trend: "up",
    trendValue: 8
  },
  {
    name: "Corporate Law",
    revenue: 35000,
    leads: 1,
    trend: "down",
    trendValue: -5
  },
  {
    name: "Tax Law",
    revenue: 28000,
    leads: 1,
    trend: "up",
    trendValue: 15
  }
];

// Mock data for recent client leads
const recentLeads = [
  {
    id: 1,
    clientName: "Maria Rodriguez",
    practiceArea: "Immigration",
    practiceAreaColor: "blue",
    dateStarted: "June 24",
    attorney: {
      name: "Sarah Chen",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612c7b8?w=150&h=150&fit=crop&crop=face"
    },
    caseValue: 9200
  },
  {
    id: 2,
    clientName: "David Thompson",
    practiceArea: "Family", 
    practiceAreaColor: "green",
    dateStarted: "June 23",
    attorney: {
      name: "Emily Thompson",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    caseValue: 15500
  },
  {
    id: 3,
    clientName: "Tech Solutions Inc",
    practiceArea: "Corporate",
    practiceAreaColor: "purple", 
    dateStarted: "June 22",
    attorney: {
      name: "Michael Rodriguez",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    caseValue: 25000
  },
  {
    id: 4,
    clientName: "Robert Kim",
    practiceArea: "Tax",
    practiceAreaColor: "orange",
    dateStarted: "June 21", 
    attorney: {
      name: "David Kim",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    caseValue: 7800
  },
  {
    id: 5,
    clientName: "Jennifer Walsh",
    practiceArea: "Immigration",
    practiceAreaColor: "blue",
    dateStarted: "June 20",
    attorney: {
      name: "Sarah Chen", 
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612c7b8?w=150&h=150&fit=crop&crop=face"
    },
    caseValue: 11200
  }
];

interface FirmLeadsWidgetProps {
  onViewAllLeads: () => void;
}

export function FirmLeadsWidget({ onViewAllLeads }: FirmLeadsWidgetProps) {
  const totalLeads = practiceAreaData.reduce((sum, area) => sum + area.leads, 0);

  const getBadgeColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200";
      case "green":
        return "bg-green-100 text-green-700 hover:bg-green-200";
      case "purple":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200";
      case "orange":
        return "bg-orange-100 text-orange-700 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm h-[600px] flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">Firm Leads</CardTitle>
          <p className="text-sm text-gray-500">{totalLeads} new leads this week</p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden flex flex-col space-y-6">
        {/* Practice Area Summary */}
        <div className="space-y-3 flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Practice Area Performance</h4>
          <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
            {practiceAreaData.map((area, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{area.name}</span>
                  <div className="flex items-center gap-1">
                    {area.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={`text-xs font-medium ${
                      area.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {area.trend === "up" ? "+" : ""}{area.trendValue}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-900">
                        ${area.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {area.leads} leads
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Client Activity Feed */}
        <div className="space-y-3 flex-1 min-h-0 flex flex-col">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex-shrink-0">Recent Client Activity</h4>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="group p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={lead.attorney.photo} alt={lead.attorney.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">
                      {lead.attorney.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-medium text-gray-900 text-sm truncate">
                        {lead.clientName}
                      </h5>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {lead.dateStarted}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs px-2 py-0.5 ${getBadgeColor(lead.practiceAreaColor)}`}
                      >
                        {lead.practiceArea}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Attorney:</span>
                        <span className="text-xs font-medium text-gray-700">
                          {lead.attorney.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-green-600">
                        Est. ${lead.caseValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Leads Button */}
        <div className="pt-2 border-t border-gray-100 flex-shrink-0">
          <Button
            onClick={onViewAllLeads}
            variant="outline"
            size="sm"
            className="w-full text-sm font-medium hover:bg-gray-50"
          >
            <ExternalLink className="h-3 w-3 mr-2" />
            View all leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}