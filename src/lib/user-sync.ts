import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "@/lib/db/index";

export async function ensureUserInDatabase() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    // Check if user already exists in database
    const existingUser = await sql`
      SELECT id FROM users WHERE id = ${userId} LIMIT 1
    `;

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    // User doesn't exist, get their data from Clerk and create record
    const user = await currentUser();
    if (!user) return null;

    const email = user.emailAddresses[0]?.emailAddress || '';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const displayName = firstName || user.fullName || 'User';

    // Insert user into database
    await sql`
      INSERT INTO users (id, email, first_name, last_name, display_name, created_at, updated_at)
      VALUES (${userId}, ${email}, ${firstName}, ${lastName}, ${displayName}, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        display_name = EXCLUDED.display_name,
        updated_at = NOW()
    `;

    console.log(`User synced to database: ${userId} (${email})`);
    return { id: userId };
  } catch (error) {
    console.error("Error ensuring user in database:", error);
    return null;
  }
}