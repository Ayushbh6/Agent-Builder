"use client";

import { Sparkles } from "lucide-react";

interface WelcomeMessageProps {
  userName?: string | null;
}

export function WelcomeMessage({ userName }: WelcomeMessageProps) {
  const displayName = userName || "there";

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Sparkles className="w-8 h-8 text-gray-700 dark:text-gray-300" />
        <h1 className="text-3xl md:text-4xl font-medium text-gray-800 dark:text-gray-100">
          Back at it, {displayName}
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
        How can I help you today?
      </p>
    </div>
  );
}