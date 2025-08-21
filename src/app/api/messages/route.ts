import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      conversationId, 
      role, 
      content, 
      model, 
      toolsUsed = [], 
      metadata = {},
      parentMessageId,
      tokensUsed 
    } = body

    if (!conversationId || !role || !content) {
      return NextResponse.json({ 
        error: 'Conversation ID, role, and content are required' 
      }, { status: 400 })
    }

    // Verify conversation belongs to user
    const conversation = await sql`
      SELECT id FROM conversations 
      WHERE id = ${conversationId} AND user_id = ${userId}
    `

    if (conversation.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Create new message
    const message = await sql`
      INSERT INTO messages (
        conversation_id, 
        role, 
        content, 
        model, 
        tools_used, 
        metadata, 
        parent_message_id, 
        tokens_used,
        created_at,
        updated_at
      )
      VALUES (
        ${conversationId}, 
        ${role}, 
        ${content}, 
        ${model || null}, 
        ${toolsUsed}, 
        ${JSON.stringify(metadata)}, 
        ${parentMessageId || null}, 
        ${tokensUsed || null},
        NOW(),
        NOW()
      )
      RETURNING *
    `

    // Update conversation's last_message_at timestamp
    await sql`
      UPDATE conversations 
      SET last_message_at = NOW(), updated_at = NOW()
      WHERE id = ${conversationId}
    `

    return NextResponse.json({ message: message[0] }, { status: 201 })

  } catch (error) {
    console.error('Create message API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}