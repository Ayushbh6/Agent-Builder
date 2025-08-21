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

    // Fetch user profile from Neon database
    const result = await sql`
      SELECT display_name, first_name, last_name, email
      FROM users 
      WHERE id = ${userId}
      LIMIT 1
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = result[0]
    
    // Create a display name fallback logic
    const displayName = user.display_name || 
                       (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null) ||
                       user.first_name || 
                       user.email?.split('@')[0] || 
                       'User'

    return NextResponse.json({
      displayName,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
