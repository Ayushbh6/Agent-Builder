import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local')
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret!)

  let evt: {
    type: string
    data: {
      id: string
      email_addresses: Array<{
        id: string
        email_address: string
      }>
      primary_email_address_id?: string
      first_name?: string
      last_name?: string
    }
  }

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as typeof evt
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data
    
    try {
      // Import Neon client
      const { neon } = await import('@neondatabase/serverless')
      const sql = neon(process.env.DATABASE_URL!)

      // Get primary email
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id)?.email_address

      // Create user record in our database
      await sql`
        INSERT INTO users (id, email, first_name, last_name, created_at, updated_at)
        VALUES (
          ${id}, 
          ${primaryEmail || null}, 
          ${first_name || null}, 
          ${last_name || null}, 
          NOW(), 
          NOW()
        )
        ON CONFLICT (id) DO NOTHING
      `

      console.log(`User ${id} created in database`)
    } catch (error) {
      console.error('Error creating user in database:', error)
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data
    
    try {
      // Import Neon client
      const { neon } = await import('@neondatabase/serverless')
      const sql = neon(process.env.DATABASE_URL!)

      // Get primary email
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id)?.email_address

      // Update user record in our database
      await sql`
        UPDATE users 
        SET 
          email = ${primaryEmail || null},
          first_name = ${first_name || null},
          last_name = ${last_name || null},
          updated_at = NOW()
        WHERE id = ${id}
      `

      console.log(`User ${id} updated in database`)
    } catch (error) {
      console.error('Error updating user in database:', error)
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    
    try {
      // Import Neon client
      const { neon } = await import('@neondatabase/serverless')
      const sql = neon(process.env.DATABASE_URL!)

      // Note: In production, you might want to soft delete or anonymize instead
      await sql`DELETE FROM users WHERE id = ${id}`

      console.log(`User ${id} deleted from database`)
    } catch (error) {
      console.error('Error deleting user from database:', error)
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}