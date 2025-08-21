import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName } = body

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Import Neon client
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)

    // Update or insert user data and display_name
    const result = await sql`
      INSERT INTO users (id, first_name, last_name, display_name, updated_at)
      VALUES (${userId}, ${firstName.trim()}, ${lastName.trim()}, ${firstName.trim()}, NOW())
      ON CONFLICT (id)
      DO UPDATE SET 
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        display_name = EXCLUDED.first_name,
        updated_at = NOW()
      RETURNING id, first_name, last_name, display_name
    `

    if (!result.length) {
      throw new Error('Failed to save user data')
    }

    // Check if user already has an ARIA agent
    const existingAgent = await sql`
      SELECT id FROM agents 
      WHERE user_id = ${userId} AND name = 'ARIA'
    `

    // Create default ARIA agent if it doesn't exist
    if (existingAgent.length === 0) {
      await sql`
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
          'ARIA', 
          'react', 
          'Your Autonomous Reasoning & Intelligence Assistant - ARIA helps you build and manage your AI agent workforce.', 
          'You are ARIA, an Autonomous Reasoning & Intelligence Assistant. You help users create, manage, and optimize AI agents and workflows. You are knowledgeable, helpful, and focused on helping users achieve their automation and AI goals. Always be concise but thorough in your responses.', 
          ARRAY['web_search', 'code_generation', 'data_analysis'], 
          '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 2000}', 
          true,
          NOW(),
          NOW()
        )
      `
    }

    return NextResponse.json({
      success: true,
      user: result[0]
    })

  } catch (error) {
    console.error('Onboarding API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}