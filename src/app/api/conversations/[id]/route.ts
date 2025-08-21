import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: conversationId } = await params

    // Fetch specific conversation with agent details
    const conversation = await sql`
      SELECT 
        c.id,
        c.title,
        c.agent_id,
        c.last_message_at,
        c.created_at,
        c.updated_at,
        a.name as agent_name,
        a.type as agent_type,
        a.description as agent_description,
        a.system_prompt as agent_system_prompt
      FROM conversations c
      LEFT JOIN agents a ON c.agent_id = a.id
      WHERE c.id = ${conversationId} AND c.user_id = ${userId}
    `

    if (conversation.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({ conversation: conversation[0] })

  } catch (error) {
    console.error('Get conversation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: conversationId } = await params

    // Verify conversation belongs to user and delete it
    const result = await sql`
      DELETE FROM conversations 
      WHERE id = ${conversationId} AND user_id = ${userId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete conversation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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
    const { title } = body

    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'Valid title is required' }, { status: 400 })
    }

    // Update conversation title and mark as user-renamed
    const result = await sql`
      UPDATE conversations 
      SET title = ${title}, is_user_renamed = true, updated_at = NOW()
      WHERE id = ${conversationId} AND user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    return NextResponse.json({ conversation: result[0] })

  } catch (error) {
    console.error('Update conversation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}