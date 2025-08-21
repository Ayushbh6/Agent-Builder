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

    const { id: agentId } = await params

    // Fetch specific agent
    const agent = await sql`
      SELECT 
        id,
        name,
        type,
        description,
        system_prompt,
        tools,
        agent_config,
        is_active,
        created_at,
        updated_at
      FROM agents 
      WHERE id = ${agentId} AND user_id = ${userId}
    `

    if (agent.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({ agent: agent[0] })

  } catch (error) {
    console.error('Get agent API error:', error)
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

    const { id: agentId } = await params
    const body = await request.json()
    const { 
      name, 
      type, 
      description, 
      systemPrompt, 
      tools, 
      agentConfig, 
      isActive 
    } = body

    // Validate agent type if provided
    if (type && !['react', 'plan_act'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid agent type. Must be "react" or "plan_act"' 
      }, { status: 400 })
    }

    // Build update query dynamically based on provided fields
    const updates = []
    const values = []

    if (name !== undefined) {
      updates.push(`name = $${updates.length + 1}`)
      values.push(name)
    }
    if (type !== undefined) {
      updates.push(`type = $${updates.length + 1}`)
      values.push(type)
    }
    if (description !== undefined) {
      updates.push(`description = $${updates.length + 1}`)
      values.push(description)
    }
    if (systemPrompt !== undefined) {
      updates.push(`system_prompt = $${updates.length + 1}`)
      values.push(systemPrompt)
    }
    if (tools !== undefined) {
      updates.push(`tools = $${updates.length + 1}`)
      values.push(tools)
    }
    if (agentConfig !== undefined) {
      updates.push(`agent_config = $${updates.length + 1}`)
      values.push(JSON.stringify(agentConfig))
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${updates.length + 1}`)
      values.push(isActive)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    // Add updated_at
    updates.push(`updated_at = NOW()`)

    // Update agent
    const result = await sql`
      UPDATE agents 
      SET ${sql.unsafe(updates.join(', '))}
      WHERE id = ${agentId} AND user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({ agent: result[0] })

  } catch (error) {
    console.error('Update agent API error:', error)
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

    const { id: agentId } = await params

    // Soft delete by setting is_active to false
    const result = await sql`
      UPDATE agents 
      SET is_active = false, updated_at = NOW()
      WHERE id = ${agentId} AND user_id = ${userId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete agent API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}