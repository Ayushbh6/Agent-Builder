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

    // Update or insert user data
    const result = await sql`
      INSERT INTO users (id, first_name, last_name, updated_at)
      VALUES (${userId}, ${firstName.trim()}, ${lastName.trim()}, NOW())
      ON CONFLICT (id)
      DO UPDATE SET 
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW()
      RETURNING id, first_name, last_name
    `

    if (!result.length) {
      throw new Error('Failed to save user data')
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