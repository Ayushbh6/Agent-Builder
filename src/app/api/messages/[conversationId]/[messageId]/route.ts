import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ conversationId: string; messageId: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, messageId } = await params
    const body = await request.json()
    const { content, metadata = {} } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    // Verify message belongs to user's conversation
    const messageCheck = await sql`
      SELECT m.id
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      WHERE m.id = ${messageId} 
        AND m.conversation_id = ${conversationId}
        AND c.user_id = ${userId}
    `

    if (messageCheck.length === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Update message content and metadata
    const updatedMessage = await sql`
      UPDATE messages 
      SET 
        content = ${content},
        metadata = ${JSON.stringify(metadata)},
        updated_at = NOW()
      WHERE id = ${messageId}
      RETURNING *
    `

    return NextResponse.json({ message: updatedMessage[0] })

  } catch (error) {
    console.error('Update message API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ conversationId: string; messageId: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { conversationId, messageId } = await params

    // Verify message belongs to user's conversation
    const messageCheck = await sql`
      SELECT m.id
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      WHERE m.id = ${messageId} 
        AND m.conversation_id = ${conversationId}
        AND c.user_id = ${userId}
    `

    if (messageCheck.length === 0) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Delete the message
    await sql`
      DELETE FROM messages 
      WHERE id = ${messageId}
    `

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete message API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}