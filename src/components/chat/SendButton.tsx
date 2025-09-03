"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SendButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SendButton({ onClick, disabled }: SendButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="icon"
      className={cn(
        "w-8 h-8 rounded-full transition-all duration-200 shadow-sm",
        disabled 
          ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" 
          : "bg-gray-800 hover:bg-gray-700 dark:bg-gray-300 dark:hover:bg-gray-200 text-white dark:text-gray-800 hover:shadow-md"
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  );
}