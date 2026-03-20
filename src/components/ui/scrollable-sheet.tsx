"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./sheet";
import { X } from "lucide-react";
import { Button } from "./button";
import { cn } from "./utils";

interface ScrollableSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
  headerActions?: React.ReactNode;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "w-full max-w-none"
};

export function ScrollableSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "lg",
  className,
  headerActions 
}: ScrollableSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="right" 
        className={cn(
          "flex flex-col min-h-0 h-full",
          sizeClasses[size],
          className
        )}
      >
        {/* Header - Fixed */}
        <SheetHeader className="flex-shrink-0 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-medium text-gray-900">
              {title}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {headerActions}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 -mr-6 pr-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}