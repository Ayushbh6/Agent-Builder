export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  lastMessagePreview?: string;
}

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading: boolean;
  isTyping: boolean;
}

export interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
}

export interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onRename?: (newTitle: string) => void;
}

export interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onConversationSelect: (conversationId: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export interface ChatContainerProps {
  conversation: Conversation | null;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  isTyping?: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export interface EmptyStateProps {
  onStartConversation: (prompt: string) => void;
  userName: string;
}