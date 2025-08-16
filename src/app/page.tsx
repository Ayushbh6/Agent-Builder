'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@stackframe/stack';
import { UserProfileSetup } from '@/components/onboarding/user-profile-setup';
import { useStackAuth } from '@/hooks/use-stack-auth';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatContainer } from '@/components/chat/chat-container';
import { AppHeader } from '@/components/layout/app-header';
import { Conversation, Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

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
      const onboarded = (user.clientMetadata as Record<string, unknown> | undefined)?.onboarded === true;
      setIsOnboarded(onboarded);
    }
  }, [user]);

  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/conversations?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        
        // Preserve temporary conversations that haven't been persisted yet
        setConversations(prev => {
          const tempConversations = prev.filter(conv => conv.id.startsWith('temp-'));
          const persistedConversations = data.conversations || [];
          const allConversations = [...tempConversations, ...persistedConversations];
          
          // If there are conversations but no active one selected, select the most recent
          if (allConversations.length > 0 && !activeConversationId) {
            setActiveConversationId(allConversations[0].id);
          }
          
          return allConversations;
        });
      } else {
        console.error('Failed to load conversations:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  }, [user]); // activeConversationId intentionally excluded to prevent temp conversation reload bug

  // Load user's conversations when authenticated and onboarded
  useEffect(() => {
    if (user && isOnboarded === true) {
      loadConversations();
    }
  }, [user, isOnboarded, loadConversations]);

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
  const firstName = (user.clientMetadata as Record<string, unknown> | undefined)?.firstName as string;
  const lastName = (user.clientMetadata as Record<string, unknown> | undefined)?.lastName as string;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : user.displayName || user.primaryEmail || 'User';

  // Chat handlers
  const handleNewConversation = () => {
    const tempId = `temp-${Date.now()}`;
    const newConversation: Conversation = {
      id: tempId,
      title: 'New conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      persisted: false,
      isUserTitled: false,
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(tempId);
  };

  const handleConversationSelect = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!user) return;
    
    // Handle temp conversations (not persisted yet)
    if (conversationId.startsWith('temp-')) {
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      if (activeConversationId === conversationId) {
        const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
        setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
      }
      return;
    }
    
    // Handle persisted conversations
    try {
      const response = await fetch(`/api/conversations?conversationId=${conversationId}&userId=${user.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Update frontend state only after successful API call
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        if (activeConversationId === conversationId) {
          const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
          setActiveConversationId(remainingConversations.length > 0 ? remainingConversations[0].id : null);
        }
      } else {
        const error = await response.json();
        console.error('Failed to delete conversation:', error.error);
        // Optionally show user-friendly error message
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      // Optionally show user-friendly error message
    }
  };

  const handleRenameConversation = async (conversationId: string, newTitle: string) => {
    if (!user) return;
    
    // Handle temp conversations (not persisted yet)
    if (conversationId.startsWith('temp-')) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, title: newTitle, updatedAt: new Date(), isUserTitled: true }
            : conv
        )
      );
      return;
    }
    
    // Handle persisted conversations
    try {
      const response = await fetch(`/api/conversations?conversationId=${conversationId}&userId=${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle }),
      });
      
      if (response.ok) {
        // Update frontend state only after successful API call
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, title: newTitle, lastMessageAt: new Date(), isUserTitled: true }
              : conv
          )
        );
      } else {
        const error = await response.json();
        console.error('Failed to rename conversation:', error.error);
        // Optionally show user-friendly error message
      }
    } catch (error) {
      console.error('Error renaming conversation:', error);
      // Optionally show user-friendly error message
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSendMessage = async (content: string) => {
    // Create a temp conversation on first send if none exists
    let currentConversationId = activeConversationId;
    if (!currentConversationId) {
      const tempId = `temp-${Date.now()}`;
      const newConversation: Conversation = {
        id: tempId,
        title: 'New conversation',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        persisted: false,
        isUserTitled: false,
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(tempId);
      currentConversationId = tempId;
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Optimistic add of user message
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            updatedAt: new Date(),
            lastMessagePreview: content,
            title: (!conv.isUserTitled && conv.messages.length === 0) ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : conv.title
          }
        : conv
    ));

    setIsTyping(true);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversationId,
          userId: user.id,
          userEmail: user.primaryEmail,
          userName: fullName,
          userImage: user.profileImageUrl,
          message: content,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Failed to stream response');
      }

      // If server created a new conversation, capture id from header and mark persisted
      const serverConvoId = res.headers.get('x-conversation-id');
      if (serverConvoId && currentConversationId?.startsWith('temp-')) {
        const oldId = currentConversationId;
        setConversations(prev => prev.map(conv => conv.id === oldId ? { ...conv, id: serverConvoId, persisted: true } : conv));
        setActiveConversationId(serverConvoId);
        currentConversationId = serverConvoId;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6); // Remove 'data: ' prefix
            if (data === '[DONE]') break;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'text-delta' && parsed.delta) {
                assistantContent += parsed.delta;
                
                // Live typing effect: update last assistant message
                setConversations(prev => prev.map(conv => {
                  if (conv.id !== currentConversationId) return conv;
                  const existing = conv.messages;
                  const last = existing[existing.length - 1];
                  if (last && last.role === 'assistant') {
                    const updated = [...existing];
                    updated[updated.length - 1] = { ...last, content: assistantContent, timestamp: new Date() };
                    return { ...conv, messages: updated, lastMessagePreview: assistantContent };
                  }
                  return {
                    ...conv,
                    messages: [...existing, { id: uuidv4(), role: 'assistant', content: assistantContent, timestamp: new Date() }],
                    lastMessagePreview: assistantContent,
                  };
                }));
              }
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
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
          onRenameConversation={handleRenameConversation}
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
