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

    // Fetch user's agents
    const agents = await sql`
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
      WHERE user_id = ${userId} AND is_active = true
      ORDER BY created_at DESC
    `

    return NextResponse.json({ agents })

  } catch (error) {
    console.error('Get agents API error:', error)
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
      type, 
      description, 
      systemPrompt, 
      tools = [], 
      agentConfig = {} 
    } = body

    if (!name || !type) {
      return NextResponse.json({ 
        error: 'Name and type are required' 
      }, { status: 400 })
    }

    // Validate agent type
    if (!['react', 'plan_act'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid agent type. Must be "react" or "plan_act"' 
      }, { status: 400 })
    }

    // Create new agent
    const agent = await sql`
      INSERT INTO agents (
        user_id, 
        name, 
        type, 
        description, 
        system_prompt, 
        tools, 
        agent_config, 
        is_active,
        created_at,
        updated_at
      )
      VALUES (
        ${userId}, 
        ${name}, 
        ${type}, 
        ${description || null}, 
        ${systemPrompt || null}, 
        ${tools}, 
        ${JSON.stringify(agentConfig)}, 
        true,
        NOW(),
        NOW()
      )
      RETURNING *
    `

    return NextResponse.json({ agent: agent[0] }, { status: 201 })

  } catch (error) {
    console.error('Create agent API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}