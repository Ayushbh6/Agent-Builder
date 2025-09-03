import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { sql } from "@/lib/db/index";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, email, firstName, lastName, fullName } = await req.json();

    // Verify the user ID matches the authenticated user
    if (id !== userId) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 403 });
    }

    const displayName = firstName || fullName || 'User';

    // Insert or update user in database
    await sql`
      INSERT INTO users (id, email, first_name, last_name, display_name, created_at, updated_at)
      VALUES (${id}, ${email}, ${firstName}, ${lastName}, ${displayName}, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        display_name = EXCLUDED.display_name,
        updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}