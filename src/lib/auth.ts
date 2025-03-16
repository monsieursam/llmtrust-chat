import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { User } from '@/db/schema';
import { currentUser } from '@clerk/nextjs/server'

/**
 * Gets the current authenticated user from the database
 * This function first gets the Clerk user, then finds the corresponding
 * user record in our database
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get the current Clerk user
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return null;
    }

    // Find the user in our database by Clerk ID
    const dbUser = await db.select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    return dbUser[0] || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Creates or updates a user in our database based on Clerk user data
 * This is useful for ensuring a user exists in our database when needed
 */
export async function syncUserWithClerk() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // Get primary email
    const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
      throw new Error('User has no email address');
    }

    // Check if user exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.clerkId, clerkUser.id))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user
      await db.update(users)
        .set({
          email: primaryEmail,
          name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null,
          avatarUrl: clerkUser.imageUrl,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, clerkUser.id));

      return existingUser[0];
    }
    // Create new user
    const [newUser] = await db.insert(users)
      .values({
        clerkId: clerkUser.id,
        email: primaryEmail,
        name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : null,
        avatarUrl: clerkUser.imageUrl,
      })
      .returning();

    return newUser;
  } catch (error) {
    console.error('Error syncing user with Clerk:', error);
    return null;
  }
}
