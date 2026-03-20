"use client";

import * as React from "react";
import { Search, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { SidebarInput } from "./ui/sidebar";

export function SidebarSearch() {
  const [searchValue, setSearchValue] = React.useState("");

  const handleAISearch = () => {
    if (searchValue.trim()) {
      // Placeholder for AI search functionality
      console.log("AI search triggered with:", searchValue);
    }
  };

  return (
    <div className="relative">
      <div className="relative flex items-center">
        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
        <SidebarInput
          type="search"
          placeholder="Search or ask AI..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-8 pr-10"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAISearch();
            }
          }}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 h-6 w-6 p-0 hover:bg-primary/10"
          onClick={handleAISearch}
          disabled={!searchValue.trim()}
        >
          <Sparkles className="h-3 w-3 text-primary" />
          <span className="sr-only">AI Search</span>
        </Button>
      </div>
    </div>
  );
}