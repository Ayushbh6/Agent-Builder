import { NextResponse } from 'next/server';
import { eq, desc, and } from 'drizzle-orm';
import { db, conversations as conversationsTable, messages as messagesTable, users as usersTable } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    // Verify user exists
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

    // Load user's conversations with message counts and last message preview
    const conversations = await db
      .select({
        id: conversationsTable.id,
        title: conversationsTable.title,
        createdAt: conversationsTable.createdAt,
        lastMessageAt: conversationsTable.lastMessageAt,
        isUserTitled: conversationsTable.isUserTitled,
      })
      .from(conversationsTable)
      .where(eq(conversationsTable.userId, userId))
      .orderBy(desc(conversationsTable.lastMessageAt));

    // For each conversation, get the messages
    const conversationsWithMessages = await Promise.all(
      conversations.map(async (conv) => {
        const messages = await db
          .select({
            id: messagesTable.id,
            role: messagesTable.role,
            content: messagesTable.content,
            createdAt: messagesTable.createdAt,
            metadata: messagesTable.metadata,
          })
          .from(messagesTable)
          .where(eq(messagesTable.conversationId, conv.id))
          .orderBy(messagesTable.createdAt);

        // Get last message for preview
        const lastMessage = messages[messages.length - 1];
        const lastMessagePreview = lastMessage ? lastMessage.content.slice(0, 100) : '';

        return {
          id: conv.id,
          title: conv.title,
          messages: messages.map(msg => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
            timestamp: new Date(msg.createdAt!),
            metadata: msg.metadata,
          })),
          createdAt: new Date(conv.createdAt!),
          lastMessageAt: new Date(conv.lastMessageAt!),
          lastMessagePreview,
          persisted: true,
          isUserTitled: conv.isUserTitled,
        };
      })
    );

    return NextResponse.json({ conversations: conversationsWithMessages });
  } catch (err) {
    console.error('Error loading conversations:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');

    if (!conversationId || !userId) {
      return NextResponse.json({ error: 'Missing conversationId or userId parameter' }, { status: 400 });
    }

    // Verify user exists
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

    // Verify conversation belongs to user and delete it
    const [deletedConversation] = await db
      .delete(conversationsTable)
      .where(and(
        eq(conversationsTable.id, conversationId),
        eq(conversationsTable.userId, userId)
      ))
      .returning({ id: conversationsTable.id });

    if (!deletedConversation) {
      return NextResponse.json({ error: 'Conversation not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Conversation deleted successfully',
      conversationId: deletedConversation.id 
    });
  } catch (err) {
    console.error('Error deleting conversation:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');
    
    const body = await req.json();
    const { title } = body;

    if (!conversationId || !userId || !title?.trim()) {
      return NextResponse.json({ error: 'Missing conversationId, userId, or title' }, { status: 400 });
    }

    // Verify user exists
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

    // Update conversation title
    const [updatedConversation] = await db
      .update(conversationsTable)
      .set({ 
        title: title.trim(),
        lastMessageAt: new Date(), // Update last message time for sorting
        isUserTitled: true // Mark as user-titled when manually renamed
      })
      .where(and(
        eq(conversationsTable.id, conversationId),
        eq(conversationsTable.userId, userId)
      ))
      .returning({ 
        id: conversationsTable.id, 
        title: conversationsTable.title 
      });

    if (!updatedConversation) {
      return NextResponse.json({ error: 'Conversation not found or access denied' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Conversation title updated successfully',
      conversation: updatedConversation
    });
  } catch (err) {
    console.error('Error updating conversation:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
