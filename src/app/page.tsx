import { HeroSection } from "@/components/landing/HeroSection";
import { AuthButtons } from "@/components/landing/AuthButtons";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  // Redirect to dashboard if user is already signed in
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 flex flex-col items-center justify-center relative overflow-hidden">
      
      <main className="relative z-10 flex flex-col items-center gap-12">
        <HeroSection />
        <AuthButtons />
      </main>
    </div>
  );
}
