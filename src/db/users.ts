import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name?: string, role = 'acc_operator') {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        name: name || null,
        role
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {})
        }
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    const err = new Error('Database query failed. Please try again later.');
    (err as any).cause = error;
    throw err;
  }
}

export async function getUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Database query failed in getUsers:', error);
    const err = new Error('Database query failed. Please try again later.');
    (err as any).cause = error;
    throw err;
  }
}

export async function getUserByUid(uid: string) {
  try {
    const result = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Database query failed in getUserByUid:', error);
    const err = new Error('Database query failed. Please try again later.');
    (err as any).cause = error;
    throw err;
  }
}
