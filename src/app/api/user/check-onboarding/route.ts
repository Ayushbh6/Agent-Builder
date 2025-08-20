import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Import Neon client
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(process.env.DATABASE_URL!)

    // Check if user has completed onboarding
    const result = await sql`
      SELECT id, first_name, last_name, email
      FROM users 
      WHERE id = ${userId} 
      AND first_name IS NOT NULL 
      AND last_name IS NOT NULL
      AND first_name != ''
      AND last_name != ''
    `

    const completed = result.length > 0
    
    return NextResponse.json({
      completed,
      user: completed ? result[0] : null
    })

  } catch (error) {
    console.error('Check onboarding API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}