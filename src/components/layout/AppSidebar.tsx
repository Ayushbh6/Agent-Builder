"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NewChatButton } from "@/components/sidebar/NewChatButton";
import { NavigationItems } from "@/components/sidebar/NavigationItems";
import { ConversationList } from "@/components/sidebar/ConversationList";
import { UserProfile } from "@/components/layout/UserProfile";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
      <SidebarHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
        <div className="mt-4 space-y-2">
          <NewChatButton />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <NavigationItems />
        <SidebarGroup>
          <ConversationList />
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-800">
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  );
}