"use client";

import * as React from "react";
import { X, Send, Bot, User, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  attachments?: Array<{
    type: 'chart' | 'table' | 'insight';
    title: string;
    data: any;
  }>;
}

interface AIAdvisorChatProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScenario?: () => void;
}

export function AIAdvisorChat({ isOpen, onClose, onOpenScenario }: AIAdvisorChatProps) {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your AI CFO Assistant. I can help you analyze financial data, forecast trends, and model business scenarios. What would you like to explore today?",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: "2",
      type: "user",
      content: "Can we afford to expand into Immigration Law?",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
    },
    {
      id: "3",
      type: "assistant",
      content: "Based on my analysis of your current financials and market data, expanding into Immigration Law shows strong potential. Here's my assessment:",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      confidence: 87,
      attachments: [
        {
          type: 'insight',
          title: 'Financial Impact Analysis',
          data: {
            revenue_potential: '$278K annually',
            investment_required: '$85K (salary + setup)',
            payback_period: '4.2 months',
            risk_level: 'Medium-Low'
          }
        }
      ]
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I've analyzed your question. Let me provide you with detailed insights based on your current financial position and market trends.",
        timestamp: new Date(),
        confidence: 92,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      
      {/* Chat Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">AI CFO Assistant</h2>
                <p className="text-sm text-gray-500">Advanced financial analysis and planning</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.type === 'assistant' && (
                  <div className="p-2 bg-blue-100 rounded-full flex-shrink-0 h-fit">
                    <Bot className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                
                <div className={`max-w-2xl space-y-3 ${msg.type === 'user' ? 'order-1' : ''}`}>
                  <div
                    className={`p-4 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>

                  {msg.confidence && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {msg.confidence}% confidence
                      </Badge>
                    </div>
                  )}

                  {/* Attachments */}
                  {msg.attachments?.map((attachment, index) => (
                    <Card key={index} className="border border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{attachment.title}</h4>
                        {attachment.type === 'insight' && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Revenue Potential</span>
                                <span className="font-semibold text-green-600">
                                  {attachment.data.revenue_potential}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Investment Required</span>
                                <span className="font-semibold text-gray-900">
                                  {attachment.data.investment_required}
                                </span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Payback Period</span>
                                <span className="font-semibold text-blue-600">
                                  {attachment.data.payback_period}
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Risk Level</span>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                  {attachment.data.risk_level}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={onOpenScenario}
                          >
                            Model this scenario
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {msg.type === 'user' && (
                  <div className="p-2 bg-gray-100 rounded-full flex-shrink-0 h-fit">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about cash flow, hiring decisions, market expansion..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMessage("What's our projected cash flow for Q4?")}
              >
                Q4 cash flow forecast
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMessage("Should we hire another senior associate?")}
              >
                Hiring analysis
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setMessage("How do we compare to industry benchmarks?")}
              >
                Industry comparison
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}