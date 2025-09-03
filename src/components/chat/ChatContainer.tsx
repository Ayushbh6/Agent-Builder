"use client";

import { WelcomeMessage } from "./WelcomeMessage";
import { MessageInput } from "./MessageInput";
import { useUser } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function ChatContainer() {
  const { user } = useUser();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800 relative">
      {/* Permanent sidebar toggle - always visible */}
      <div className="absolute top-4 left-4 z-10">
        <SidebarTrigger 
          className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 backdrop-blur-sm p-2 rounded-md"
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <WelcomeMessage userName={user?.firstName} />
      </div>
      
      {/* Message input area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}