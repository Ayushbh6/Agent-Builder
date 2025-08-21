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

    // Fetch user's workflows
    const workflows = await sql`
      SELECT 
        w.id,
        w.name,
        w.is_enabled,
        w.trigger,
        w.action,
        w.created_at,
        w.updated_at,
        a.name as agent_name,
        a.type as agent_type
      FROM workflows w
      LEFT JOIN agents a ON w.agent_id = a.id
      WHERE w.user_id = ${userId}
      ORDER BY w.created_at DESC
    `

    return NextResponse.json({ workflows })

  } catch (error) {
    console.error('Get workflows API error:', error)
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
    const { 
      name, 
      agentId, 
      trigger = {}, 
      action = {}, 
      isEnabled = true 
    } = body

    if (!name) {
      return NextResponse.json({ 
        error: 'Name is required' 
      }, { status: 400 })
    }

    // If agentId is provided, verify it belongs to the user
    if (agentId) {
      const agent = await sql`
        SELECT id FROM agents 
        WHERE id = ${agentId} AND user_id = ${userId}
      `

      if (agent.length === 0) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }
    }

    // Create new workflow
    const workflow = await sql`
      INSERT INTO workflows (
        user_id, 
        agent_id, 
        name, 
        is_enabled, 
        trigger, 
        action, 
        created_at,
        updated_at
      )
      VALUES (
        ${userId}, 
        ${agentId || null}, 
        ${name}, 
        ${isEnabled}, 
        ${JSON.stringify(trigger)}, 
        ${JSON.stringify(action)}, 
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json({ workflow: workflow[0] }, { status: 201 })

  } catch (error) {
    console.error('Create workflow API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}