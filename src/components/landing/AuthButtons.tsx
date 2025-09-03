"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function AuthButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
      <Button
        onClick={() => router.push("/sign-up")}
        size="lg"
        className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-6 text-lg rounded-full transition-all duration-200 hover:scale-105 min-w-[180px] shadow-lg hover:shadow-xl"
      >
        Sign Up
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      
      <Button
        onClick={() => router.push("/sign-in")}
        size="lg"
        variant="outline"
        className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 font-semibold px-8 py-6 text-lg rounded-full transition-all duration-200 hover:scale-105 min-w-[180px] shadow-md hover:shadow-lg"
      >
        Log In
      </Button>
    </div>
  );
}