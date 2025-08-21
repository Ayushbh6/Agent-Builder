import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's conversations with latest message timestamp
    const conversations = await sql`
      SELECT 
        c.id,
        c.title,
        c.agent_id,
        c.last_message_at,
        c.created_at,
        c.updated_at,
        c.is_user_renamed,
        a.name as agent_name,
        a.type as agent_type
      FROM conversations c
      LEFT JOIN agents a ON c.agent_id = a.id
      WHERE c.user_id = ${userId}
      ORDER BY COALESCE(c.last_message_at, c.created_at) DESC
    `

    return NextResponse.json({ conversations })

  } catch (error) {
    console.error('Get conversations API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, agentId } = body

    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 })
    }

    // Verify the agent belongs to the user
    const agent = await sql`
      SELECT id FROM agents 
      WHERE id = ${agentId} AND user_id = ${userId}
    `

    if (agent.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Create new conversation
    const conversation = await sql`
      INSERT INTO conversations (user_id, agent_id, title, is_user_renamed, created_at, updated_at)
      VALUES (${userId}, ${agentId}, ${title || 'New Conversation'}, ${title ? true : false}, NOW(), NOW())
      RETURNING *
    `

    return NextResponse.json({ conversation: conversation[0] }, { status: 201 })

  } catch (error) {
    console.error('Create conversation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}