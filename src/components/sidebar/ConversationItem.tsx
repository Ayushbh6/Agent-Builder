"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  id: string;
  title: string;
  lastMessageAt: Date;
  isActive?: boolean;
}

export function ConversationItem({ 
  id, 
  title, 
  isActive = false 
}: ConversationItemProps) {
  const handleClick = () => {
    // TODO: Navigate to conversation
    console.log("Navigate to conversation:", id);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={cn(
        "w-full justify-start p-3 h-auto text-left hover:bg-amber-50 dark:hover:bg-amber-950/30 text-stone-700 dark:text-stone-300",
        isActive && "bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100 border-l-2 border-amber-600"
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <MessageCircle className="h-4 w-4 mt-0.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-stone-700 dark:text-stone-300 truncate">{title}</p>
        </div>
      </div>
    </Button>
  );
}