import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db, conversations as conversationsTable, messages as messagesTable, users as usersTable } from '@/lib/db';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // Check if this is a standard useChat request or custom format
    const body = await req.json();
    
    // Handle useChat format (with messages array)
    if ('messages' in body && Array.isArray(body.messages)) {
      const { messages }: { messages: UIMessage[] } = body;
      
      const result = streamText({
        model: openai('gpt-4.1'),
        system: 'You are a helpful assistant.',
        messages: convertToModelMessages(messages),
      });
      
      return result.toUIMessageStreamResponse();
    }
    
    // Handle custom format (legacy)
    const { conversationId, userId, userEmail, message } = body as {
      conversationId?: string | null;
      userId: string;
      userEmail?: string | null;
      userName?: string | null;
      userImage?: string | null;
      message: string;
    };

    if (!userId || !userEmail || !message?.trim()) {
      return NextResponse.json({ error: 'Missing userId, userEmail, or message' }, { status: 400 });
    }

    // 1) Verify user exists (should be auto-synced from Stack Auth)
    const [existingUser] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json({ 
        error: 'User not found. Please ensure you are properly authenticated.' 
      }, { status: 401 });
    }

    // 2) Ensure conversation exists or create a new one
    const isUuid = (id?: string | null) => !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    let convoId: string | null = null;

    if (isUuid(conversationId || null)) {
      // verify conversation belongs to user
      const [existing] = await db
        .select({ id: conversationsTable.id })
        .from(conversationsTable)
        .where(and(eq(conversationsTable.id, conversationId as string), eq(conversationsTable.userId, userId)))
        .limit(1);
      if (existing) {
        convoId = existing.id;
      }
    }

    if (!convoId) {
      const title = message.slice(0, 80);
      const inserted = await db
        .insert(conversationsTable)
        .values({ userId, title, isUserTitled: false })
        .returning({ id: conversationsTable.id });
      convoId = inserted[0].id;
    }

    // 3) Persist user message
    await db.insert(messagesTable).values({
      conversationId: convoId!,
      role: 'user',
      content: message,
    });

    // 4) Load full message history for this conversation
    const rows = await db
      .select({ role: messagesTable.role, content: messagesTable.content })
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, convoId!))
      .orderBy(messagesTable.createdAt);

    const history: UIMessage[] = rows.map((r, index) => ({
      id: `msg_${index}`,
      role: r.role as 'user' | 'assistant' | 'system',
      parts: [{ type: 'text', text: r.content }]
    }));

    // 5) Stream AI response
    const result = streamText({
      model: openai('gpt-4.1'),
      system: 'You are a helpful assistant.',
      messages: convertToModelMessages(history),
      onFinish: async ({ text, usage, finishReason, response }) => {
        // 6) Persist assistant message with metadata
        await db.insert(messagesTable).values({
          conversationId: convoId!,
          role: 'assistant',
          content: text,
          metadata: {
            finishReason,
            usage,
            provider: 'openai',
            model: 'gpt-4.1',
            responseId: (await response).id,
          },
        });

        // Update conversation last_message_at
        await db
          .update(conversationsTable)
          .set({ lastMessageAt: new Date() })
          .where(eq(conversationsTable.id, convoId!));
      },
    });

    return result.toUIMessageStreamResponse({
      headers: { 'x-conversation-id': convoId! },
      onError: err => {
        console.error('chat stream error', err);
        return 'Sorry, something went wrong.';
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


