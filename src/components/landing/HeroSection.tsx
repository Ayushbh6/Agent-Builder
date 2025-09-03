"use client";

import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-gray-700 dark:text-gray-300" />
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-gray-100 leading-tight pb-2">
          Agent Builder
        </h1>
      </div>
      
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl font-medium">
        Build intelligent AI agents with natural conversation
      </p>
    </div>
  );
}