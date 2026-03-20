"use client";

import * as React from "react";
import { 
  Bot, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Receipt, 
  Target, 
  Users, 
  Building2, 
  MoreHorizontal,
  Filter,
  Bookmark
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface NotificationItem {
  id: string;
  type: "ai_insight" | "recommendation" | "accounting_task" | "performance_alert" | "opportunity";
  avatar: string;
  author: string;
  handle: string;
  timestamp: string;
  content: string;
  read?: boolean;
  metrics?: {
    value: string;
    change: string;
    positive: boolean;
  };
  actionButton?: {
    text: string;
    variant: "default" | "outline" | "secondary";
    action: () => void;
  };
  tags?: string[];
  priority?: "high" | "medium" | "low";
}

interface NotificationsPageProps {
  onMarkAllRead?: () => void;
  onUpdateUnreadCount?: (count: number) => void;
}

export function NotificationsPage({ onMarkAllRead, onUpdateUnreadCount }: NotificationsPageProps = {}) {
  const [activeFilter, setActiveFilter] = React.useState<string>("all");
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: "1",
      type: "ai_insight",
      avatar: "🤖",
      author: "AI Advisor",
      handle: "@ai_advisor",
      timestamp: "2h",
      content: "Your immigration practice is outperforming the firm average by 34%. Consider expanding capacity with 1-2 new associates to capture the $278K annual growth opportunity. Market data shows 45% regional demand growth.",
      read: false,
      metrics: {
        value: "+$278K",
        change: "+34% above average",
        positive: true
      },
      actionButton: {
        text: "Model Scenario",
        variant: "default",
        action: () => console.log("Model scenario")
      },
      tags: ["Immigration", "Growth", "High Impact"],
      priority: "high"
    },
    {
      id: "2",
      type: "accounting_task",
      avatar: "📊",
      author: "Clio Accounting",
      handle: "@clio_accounting",
      timestamp: "4h",
      content: "We imported 23 new transactions, but 3 of them need your attention because we couldn't automatically categorize them.",
      read: false,
      actionButton: {
        text: "View transactions",
        variant: "default",
        action: () => console.log("Navigate to transactions")
      },
      tags: ["Accounting", "Tasks"],
      priority: "medium"
    },
    {
      id: "3",
      type: "performance_alert",
      avatar: "📈",
      author: "Performance Monitor",
      handle: "@performance",
      timestamp: "6h",
      content: "Outstanding AR has increased 12% this month ($89K total). 37% of receivables are over 90 days. Consider implementing automated collection reminders.",
      read: false,
      metrics: {
        value: "$89K",
        change: "+12% this month",
        positive: false
      },
      actionButton: {
        text: "Review Collections",
        variant: "outline",
        action: () => console.log("Review collections")
      },
      tags: ["Cash Flow", "Collections"],
      priority: "high"
    },
    {
      id: "4",
      type: "opportunity",
      avatar: "🎯",
      author: "Growth Insights",
      handle: "@growth_ai",
      timestamp: "8h",
      content: "Tax season performance exceeded expectations with 47% margin improvement. Consider expanding tax practice capacity for next season to capture additional $120K revenue.",
      read: true,
      metrics: {
        value: "+$120K",
        change: "+47% margin",
        positive: true
      },
      actionButton: {
        text: "Plan Expansion",
        variant: "secondary",
        action: () => console.log("Plan expansion")
      },
      tags: ["Tax Practice", "Seasonal", "Opportunity"],
      priority: "medium"
    },
    {
      id: "5",
      type: "accounting_task",
      avatar: "🏦",
      author: "Bank Reconciliation",
      handle: "@reconciliation",
      timestamp: "12h",
      content: "Monthly reconciliation for July is due in 3 days. Bank statements for Chase Business and Savings accounts are ready for review.",
      read: false,
      actionButton: {
        text: "Start Reconciliation",
        variant: "default",
        action: () => console.log("Start reconciliation")
      },
      tags: ["Reconciliation", "Due Soon"],
      priority: "high"
    },
    {
      id: "6",
      type: "ai_insight",
      avatar: "🤖",
      author: "AI Advisor",
      handle: "@ai_advisor",
      timestamp: "1d",
      content: "Client payment patterns show 23% faster payments when invoices include case progress updates. Consider enabling automated progress reporting in your billing workflow.",
      read: true,
      actionButton: {
        text: "Configure Billing",
        variant: "outline",
        action: () => console.log("Configure billing")
      },
      tags: ["Billing", "Client Relations", "Efficiency"],
      priority: "low"
    },
    {
      id: "7",
      type: "recommendation",
      avatar: "💡",
      author: "Business Optimizer",
      handle: "@optimizer",
      timestamp: "1d",
      content: "Your family law cases average 23 days longer than industry benchmark but achieve 18% higher client satisfaction. Consider premium pricing strategy for this specialization.",
      read: true,
      metrics: {
        value: "+18%",
        change: "client satisfaction",
        positive: true
      },
      actionButton: {
        text: "Analyze Pricing",
        variant: "secondary",
        action: () => console.log("Analyze pricing")
      },
      tags: ["Family Law", "Pricing", "Client Satisfaction"],
      priority: "medium"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ai_insight":
        return <Bot className="h-4 w-4 text-blue-600" />;
      case "recommendation":
        return <Target className="h-4 w-4 text-purple-600" />;
      case "accounting_task":
        return <Receipt className="h-4 w-4 text-orange-600" />;
      case "performance_alert":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "opportunity":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      default:
        return <Bot className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string, isRead: boolean) => {
    const baseColors = {
      high: isRead ? "border-l-red-300" : "border-l-red-500",
      medium: isRead ? "border-l-yellow-300" : "border-l-yellow-500", 
      low: isRead ? "border-l-green-300" : "border-l-green-500",
      default: isRead ? "border-l-gray-200" : "border-l-gray-300"
    };
    
    return baseColors[priority as keyof typeof baseColors] || baseColors.default;
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    onMarkAllRead?.();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filterCategories = [
    { id: "all", label: "All", icon: Filter, count: notifications.length },
    { id: "ai_insight", label: "AI Insights", icon: Bot, count: notifications.filter(n => n.type === "ai_insight").length },
    { id: "recommendation", label: "Recommendations", icon: Target, count: notifications.filter(n => n.type === "recommendation").length },
    { id: "accounting_task", label: "Accounting Tasks", icon: Receipt, count: notifications.filter(n => n.type === "accounting_task").length },
    { id: "performance_alert", label: "Performance Alerts", icon: AlertTriangle, count: notifications.filter(n => n.type === "performance_alert").length },
    { id: "opportunity", label: "Opportunities", icon: TrendingUp, count: notifications.filter(n => n.type === "opportunity").length }
  ];

  const filteredNotifications = activeFilter === "all" 
    ? notifications 
    : notifications.filter(notification => notification.type === activeFilter);

  // Update parent component's unread count when notifications change
  React.useEffect(() => {
    const currentUnreadCount = notifications.filter(n => !n.read).length;
    onUpdateUnreadCount?.(currentUnreadCount);
  }, [notifications.map(n => n.read).join(','), onUpdateUnreadCount]); // Only depend on read status changes

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered insights, recommendations, and tasks for your firm
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {unreadCount} unread
            </Badge>
            <Badge variant="secondary" className="bg-red-50 text-red-700">
              {notifications.filter(n => n.priority === "high" && !n.read).length} high priority
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2 overflow-x-auto">
            {filterCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeFilter === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(category.id)}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.label}
                  <Badge 
                    variant="secondary" 
                    className={`ml-1 ${
                      activeFilter === category.id 
                        ? "bg-white/20 text-white border-white/30" 
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Filter className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
              <p className="text-gray-500">
                {activeFilter === "all" 
                  ? "You're all caught up! No new notifications to show."
                  : `No ${filterCategories.find(c => c.id === activeFilter)?.label.toLowerCase()} at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`bg-white border-l-4 ${getPriorityColor(notification.priority || "low", notification.read || false)} hover:shadow-md transition-all duration-200 cursor-pointer ${notification.read ? 'opacity-60' : 'opacity-100'}`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-lg">
                          {notification.avatar}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Author and timestamp */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`${notification.read ? 'font-medium text-gray-600' : 'font-semibold text-gray-900'}`}>
                            {notification.author}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {notification.handle}
                          </span>
                          <span className="text-gray-400">·</span>
                          <span className="text-gray-500 text-sm">
                            {notification.timestamp}
                          </span>
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Bookmark clicked for:", notification.id);
                        }}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mt-3 ml-13">
                    <p className={`leading-relaxed ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.content}
                    </p>

                    {/* Metrics */}
                    {notification.metrics && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="text-lg font-semibold text-gray-900">
                                {notification.metrics.value}
                              </div>
                              <div className={`text-sm ${
                                notification.metrics.positive ? "text-green-600" : "text-red-600"
                              }`}>
                                {notification.metrics.change}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <DollarSign className={`h-8 w-8 ${
                              notification.metrics.positive ? "text-green-500" : "text-red-500"
                            }`} />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {notification.tags && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {notification.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    {notification.actionButton && (
                      <div className="mt-4">
                        <Button 
                          variant={notification.actionButton.variant}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.actionButton!.action();
                          }}
                          className="rounded-full"
                        >
                          {notification.actionButton.text}
                        </Button>
                      </div>
                    )}


                  </div>
                </CardContent>
              </Card>
              ))}
            </div>
          )}

          {/* Load More */}
          {filteredNotifications.length > 0 && (
            <div className="mt-8 text-center">
              <Button variant="outline" className="rounded-full">
                Load more insights
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}