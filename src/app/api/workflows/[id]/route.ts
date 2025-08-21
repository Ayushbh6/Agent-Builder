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

    const { id: workflowId } = await params

    // Fetch specific workflow with agent details
    const workflow = await sql`
      SELECT 
        w.id,
        w.name,
        w.is_enabled,
        w.trigger,
        w.action,
        w.created_at,
        w.updated_at,
        a.id as agent_id,
        a.name as agent_name,
        a.type as agent_type
      FROM workflows w
      LEFT JOIN agents a ON w.agent_id = a.id
      WHERE w.id = ${workflowId} AND w.user_id = ${userId}
    `

    if (workflow.length === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    return NextResponse.json({ workflow: workflow[0] })

  } catch (error) {
    console.error('Get workflow API error:', error)
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

    const { id: workflowId } = await params
    const body = await request.json()
    const { 
      name, 
      agentId, 
      trigger, 
      action, 
      isEnabled 
    } = body

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

    // Build update query dynamically based on provided fields
    const updates = []

    if (name !== undefined) {
      updates.push(`name = '${name}'`)
    }
    if (agentId !== undefined) {
      updates.push(`agent_id = ${agentId ? `'${agentId}'` : 'NULL'}`)
    }
    if (trigger !== undefined) {
      updates.push(`trigger = '${JSON.stringify(trigger)}'`)
    }
    if (action !== undefined) {
      updates.push(`action = '${JSON.stringify(action)}'`)
    }
    if (isEnabled !== undefined) {
      updates.push(`is_enabled = ${isEnabled}`)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`)

    // Update workflow
    const result = await sql`
      UPDATE workflows 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE id = ${workflowId} AND user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    return NextResponse.json({ workflow: result[0] })

  } catch (error) {
    console.error('Update workflow API error:', error)
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

    const { id: workflowId } = await params

    // Delete workflow
    const result = await sql`
      DELETE FROM workflows 
      WHERE id = ${workflowId} AND user_id = ${userId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete workflow API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}