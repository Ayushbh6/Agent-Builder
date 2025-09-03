import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessageAt: Date;
}

interface ConversationState {
  activeConversationId: string | null;
  conversations: Conversation[];
  currentMessages: Message[];
  isLoading: boolean;
  setActiveConversation: (id: string | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  addMessage: (message: Message) => void;
  setCurrentMessages: (messages: Message[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  activeConversationId: null,
  conversations: [],
  currentMessages: [],
  isLoading: false,
  
  setActiveConversation: (id: string | null) => {
    set({ activeConversationId: id });
    if (id) {
      const conversation = get().conversations.find(c => c.id === id);
      if (conversation) {
        set({ currentMessages: conversation.messages });
      }
    } else {
      set({ currentMessages: [] });
    }
  },
  
  setConversations: (conversations: Conversation[]) => set({ conversations }),
  
  addMessage: (message: Message) => set((state) => ({
    currentMessages: [...state.currentMessages, message]
  })),
  
  setCurrentMessages: (messages: Message[]) => set({ currentMessages: messages }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));