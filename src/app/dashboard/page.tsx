import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ChatContainer } from "@/components/chat/ChatContainer";

export default async function DashboardPage() {
  const { userId } = await auth();

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  return <ChatContainer />;
}