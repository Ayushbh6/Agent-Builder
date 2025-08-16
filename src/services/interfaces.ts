import { AgentSpec, WorkflowSpec, ChatMessage, ChatSession } from '@/types';
import { Agent, Conversation, Message, Workflow } from '@/lib/db/schema';

// Service interfaces following Interface Segregation Principle
export interface IChatService {
  createConversation(userId: string, agentId?: string): Promise<Conversation>;
  sendMessage(conversationId: string, message: ChatMessage): Promise<Message>;
  getConversationHistory(conversationId: string): Promise<Message[]>;
  streamResponse(conversationId: string, userMessage: string): Promise<ReadableStream>;
}

export interface IAgentService {
  createAgent(userId: string, spec: AgentSpec): Promise<Agent>;
  getAgent(agentId: string): Promise<Agent | null>;
  getUserAgents(userId: string): Promise<Agent[]>;
  updateAgent(agentId: string, updates: Partial<Agent>): Promise<Agent>;
  deleteAgent(agentId: string): Promise<void>;
}

export interface IKnowledgeService {
  processDocument(agentId: string, file: File): Promise<void>;
  processUrl(agentId: string, url: string): Promise<void>;
  searchKnowledge(agentId: string, query: string): Promise<string>;
  getKnowledgeSources(agentId: string): Promise<Array<{ id: string; name: string; type: string }>>;
}

export interface IWorkflowService {
  createWorkflow(userId: string, spec: WorkflowSpec): Promise<Workflow>;
  getUserWorkflows(userId: string): Promise<Workflow[]>;
  executeWorkflow(workflowId: string, triggerData: unknown): Promise<void>;
  toggleWorkflow(workflowId: string, isActive: boolean): Promise<void>;
}

export interface IIntentDetectionService {
  detectIntent(message: string): Promise<{
    type: 'chat' | 'agent_creation' | 'workflow_setup';
    confidence: number;
    params?: Record<string, unknown>;
  }>;
}

export interface IEmbeddingService {
  generateEmbeddings(texts: string[]): Promise<number[][]>;
  searchSimilar(query: string, agentId: string, limit?: number): Promise<Array<{
    text: string;
    similarity: number;
  }>>;
}