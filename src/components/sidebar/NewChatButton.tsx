"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NewChatButton() {
  const handleNewChat = () => {
    // TODO: Implement new chat logic
    console.log("New chat clicked");
  };

  return (
    <Button
      onClick={handleNewChat}
      className="w-full bg-gray-800 hover:bg-gray-700 dark:bg-gray-300 dark:hover:bg-gray-200 text-white dark:text-gray-800 font-medium py-3 rounded-lg flex items-center gap-2 transition-all duration-200"
    >
      <Plus className="h-4 w-4" />
      New chat
    </Button>
  );
}