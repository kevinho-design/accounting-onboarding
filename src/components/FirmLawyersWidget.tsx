"use client";

import * as React from "react";
import { MessageCircle, Eye, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

// Mock lawyer data
const lawyersData = {
  "all": [
    {
      id: 1,
      name: "Sarah Chen",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612c7b8?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Immigration Law",
      caseLoad: 15,
      billableHours: 42.5,
      satisfaction: 4.9
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Corporate Law",
      caseLoad: 8,
      billableHours: 38.2,
      satisfaction: 4.7
    },
    {
      id: 3,
      name: "Emily Thompson",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      practiceArea: "Family Law",
      caseLoad: 12,
      billableHours: 36.8,
      satisfaction: 4.8
    },
    {
      id: 4,
      name: "David Kim",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Tax Law",
      caseLoad: 6,
      billableHours: 40.1,
      satisfaction: 4.6
    }
  ],
  "immigration": [
    {
      id: 1,
      name: "Sarah Chen",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612c7b8?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Immigration Law",
      caseLoad: 15,
      billableHours: 42.5,
      satisfaction: 4.9
    },
    {
      id: 5,
      name: "Carlos Martinez",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Immigration Law",
      caseLoad: 11,
      billableHours: 39.3,
      satisfaction: 4.8
    }
  ],
  "family": [
    {
      id: 3,
      name: "Emily Thompson",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      practiceArea: "Family Law",
      caseLoad: 12,
      billableHours: 36.8,
      satisfaction: 4.8
    },
    {
      id: 6,
      name: "Jennifer Walsh",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Family Law",
      caseLoad: 9,
      billableHours: 35.2,
      satisfaction: 4.7
    }
  ],
  "corporate": [
    {
      id: 2,
      name: "Michael Rodriguez",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Corporate Law",
      caseLoad: 8,
      billableHours: 38.2,
      satisfaction: 4.7
    },
    {
      id: 7,
      name: "Robert Johnson",
      photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
      isOnline: false,
      practiceArea: "Corporate Law",
      caseLoad: 7,
      billableHours: 41.7,
      satisfaction: 4.9
    }
  ],
  "tax": [
    {
      id: 4,
      name: "David Kim",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Tax Law",
      caseLoad: 6,
      billableHours: 40.1,
      satisfaction: 4.6
    },
    {
      id: 8,
      name: "Lisa Anderson",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      isOnline: true,
      practiceArea: "Tax Law",
      caseLoad: 10,
      billableHours: 44.8,
      satisfaction: 4.8
    }
  ]
};

interface FirmLawyersWidgetProps {
  onOpenChat: (lawyerId: number) => void;
  onViewMatters: (lawyerId: number) => void;
}

export function FirmLawyersWidget({ onOpenChat, onViewMatters }: FirmLawyersWidgetProps) {
  const [selectedPracticeArea, setSelectedPracticeArea] = React.useState("all");

  const getCurrentLawyers = () => {
    return lawyersData[selectedPracticeArea as keyof typeof lawyersData] || [];
  };

  const getPracticeAreaLabel = (area: string) => {
    switch (area) {
      case "all":
        return "All Practice Areas";
      case "immigration":
        return "Immigration Law";
      case "family":
        return "Family Law";
      case "corporate":
        return "Corporate Law";
      case "tax":
        return "Tax Law";
      default:
        return "All Practice Areas";
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm h-[600px] flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Firm Lawyers</CardTitle>
          <Select value={selectedPracticeArea} onValueChange={setSelectedPracticeArea}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Practice Areas</SelectItem>
              <SelectItem value="immigration">Immigration Law</SelectItem>
              <SelectItem value="family">Family Law</SelectItem>
              <SelectItem value="corporate">Corporate Law</SelectItem>
              <SelectItem value="tax">Tax Law</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto space-y-4">
          {getCurrentLawyers().map((lawyer) => (
            <div
              key={lawyer.id}
              className="group p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-200"
            >
              {/* Lawyer Header */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-12 w-12 cursor-pointer hover:scale-105 transition-transform duration-200">
                  <AvatarImage src={lawyer.photo} alt={lawyer.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                    {lawyer.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">
                      {lawyer.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          lawyer.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                      <span className={`text-xs font-medium ${
                        lawyer.isOnline ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {lawyer.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{lawyer.practiceArea}</p>
                </div>
              </div>

              {/* Utilization Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Case Load</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {lawyer.caseLoad} Active
                  </p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">This Week</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {lawyer.billableHours} hrs
                  </p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Satisfaction</p>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {lawyer.satisfaction}
                    </p>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => onOpenChat(lawyer.id)}
                  size="sm"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-8"
                  disabled={!lawyer.isOnline}
                >
                  <MessageCircle className="h-3 w-3 mr-1.5" />
                  Live Chat
                </Button>
                <Button
                  onClick={() => onViewMatters(lawyer.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 border-gray-300 hover:bg-gray-50"
                >
                  <Eye className="h-3 w-3 mr-1.5" />
                  View Matters
                </Button>
              </div>
            </div>
          ))}

          {getCurrentLawyers().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No lawyers found for the selected practice area.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}