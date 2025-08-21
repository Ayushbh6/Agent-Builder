import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: conversationId } = await params
    const body = await request.json()
    const { userMessage } = body

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: 'User message is required' }, { status: 400 })
    }

    // Check if conversation exists and is NOT user-renamed
    const conversation = await sql`
      SELECT id, title, is_user_renamed
      FROM conversations 
      WHERE id = ${conversationId} AND user_id = ${userId}
    `

    if (conversation.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const conv = conversation[0]

    // Only auto-update if user hasn't manually renamed it and title is still default
    if (!conv.is_user_renamed && (conv.title === 'New Conversation' || conv.title === 'Untitled')) {
      // Generate title from first 20 characters of user message
      const autoTitle = userMessage.trim().substring(0, 20) + (userMessage.trim().length > 20 ? '...' : '')
      
      const result = await sql`
        UPDATE conversations 
        SET title = ${autoTitle}, updated_at = NOW()
        WHERE id = ${conversationId} AND user_id = ${userId}
        RETURNING *
      `

      return NextResponse.json({ 
        updated: true, 
        conversation: result[0] 
      })
    }

    return NextResponse.json({ 
      updated: false, 
      message: 'Title not updated (already user-renamed or not default)' 
    })

  } catch (error) {
    console.error('Auto-title conversation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}