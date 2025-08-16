// Core domain types
export interface AgentSpec {
  name: string;
  type: 'react' | 'plan_act';
  description: string;
  knowledgeSources: (string | File)[];
  tools: AgentTool[];
}

export interface WorkflowSpec {
  name: string;
  trigger: WorkflowTrigger;
  action: WorkflowAction;
  agentId?: string;
}

export interface WorkflowTrigger {
  type: 'email_from' | 'calendar_event' | 'schedule';
  config: Record<string, unknown>;
}

export interface WorkflowAction {
  type: 'draft_reply' | 'send_reply' | 'add_calendar_event';
  config: Record<string, unknown>;
}

export type AgentTool = 
  | 'calculator'
  | 'web_search'
  | 'write_docx'
  | 'write_csv'
  | 'url_scraper';

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  agentId?: string;
  messages: ChatMessage[];
  lastMessageAt: Date;
}

// UI State types
export interface UIState {
  currentSession?: string;
  currentAgent?: string;
  isLoading: boolean;
  error?: string;
}

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
}