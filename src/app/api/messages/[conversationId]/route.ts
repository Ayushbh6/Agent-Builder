import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId } = await params

    // Verify conversation belongs to user
    const conversation = await sql`
      SELECT id FROM conversations 
      WHERE id = ${conversationId} AND user_id = ${userId}
    `

    if (conversation.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Get URL parameters for pagination
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Fetch messages for the conversation
    const messages = await sql`
      SELECT 
        id,
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
      FROM messages 
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    // Get total count for pagination
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM messages 
      WHERE conversation_id = ${conversationId}
    `

    const total = parseInt(countResult[0].total)

    return NextResponse.json({ 
      messages,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Get messages API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}