'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import { UserProfileSetup } from '@/components/onboarding/user-profile-setup';
import { useStackAuth } from '@/hooks/use-stack-auth';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatContainer } from '@/components/chat/chat-container';
import { AppHeader } from '@/components/layout/app-header';
import { Conversation, Message } from '@/types/chat';

export default function Home() {
  const user = useUser({ or: 'redirect' });
  const { signOut } = useStackAuth();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  
  // Chat state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (user) {
      const onboarded = (user.clientMetadata as any)?.onboarded === true;
      setIsOnboarded(onboarded);
      
      // Initialize with sample conversation for demo
      if (onboarded && conversations.length === 0) {
        const sampleConversation: Conversation = {
          id: '1',
          title: 'Welcome to Agent Builder',
          messages: [
            {
              id: '1',
              role: 'assistant',
              content: 'Hello! I\'m your AI assistant. How can I help you build amazing agents today?',
              timestamp: new Date()
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
          lastMessagePreview: 'Hello! I\'m your AI assistant...'
        };
        setConversations([sampleConversation]);
        setActiveConversationId(sampleConversation.id);
      }
    }
  }, [user, conversations.length]);

  if (!user) {
    return null; // Will redirect to sign in
  }

  // Show onboarding if not completed
  if (isOnboarded === false) {
    return (
      <>
        <AppHeader />
        <UserProfileSetup onComplete={() => setIsOnboarded(true)} />
      </>
    );
  }

  // Loading state
  if (isOnboarded === null) {
    return (
      <>
        <AppHeader />
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  // Get user display name
  const firstName = (user.clientMetadata as any)?.firstName as string;
  const lastName = (user.clientMetadata as any)?.lastName as string;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : user.displayName || user.primaryEmail || 'User';

  // Chat handlers
  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (activeConversationId === conversationId) {
      setActiveConversationId(conversations.length > 1 ? conversations[0].id : null);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeConversationId) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversationId 
        ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date(),
            lastMessagePreview: content,
            title: conv.messages.length === 0 ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : conv.title
          }
        : conv
    ));

    // Simulate AI response
    setIsTyping(true);
    setIsLoading(true);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received your message: "${content}". This is a demo response. In the full implementation, this would connect to your AI backend.`,
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? {
              ...conv,
              messages: [...conv.messages, aiMessage],
              updatedAt: new Date(),
              lastMessagePreview: aiMessage.content
            }
          : conv
      ));
      
      setIsTyping(false);
      setIsLoading(false);
    }, 2000);
  };

  const activeConversation = conversations.find(conv => conv.id === activeConversationId) || null;

  return (
    <>
      <AppHeader />
      <div className="flex h-screen bg-background">
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          userName={fullName}
          userEmail={user.primaryEmail || ''}
          onSignOut={signOut}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
        <ChatContainer
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isTyping={isTyping}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={handleToggleSidebar}
        />
      </div>
    </>
  );
}
