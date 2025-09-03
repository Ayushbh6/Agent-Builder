"use client";

import { Button } from "@/components/ui/button";
import { Bot, Workflow } from "lucide-react";

export function NavigationItems() {
  return (
    <div className="space-y-1 mt-4">
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Bot className="h-4 w-4 mr-3" />
        Sub-agents
      </Button>
      
      <Button
        variant="ghost"
        className="w-full justify-start text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <Workflow className="h-4 w-4 mr-3" />
        Workflows
      </Button>
    </div>
  );
}