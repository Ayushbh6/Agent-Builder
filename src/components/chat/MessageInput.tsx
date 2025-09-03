"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SendButton } from "./SendButton";

export function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    
    // TODO: Implement message sending logic
    console.log("Sending message:", message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="How can I help you today?"
        className="min-h-[60px] max-h-[120px] pr-12 resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-gray-500 dark:focus:border-gray-400 focus:ring-1 focus:ring-gray-500 dark:focus:ring-gray-400 shadow-sm rounded-xl"
      />
      <div className="absolute bottom-3 right-3">
        <SendButton onClick={handleSend} disabled={!message.trim()} />
      </div>
    </div>
  );
}