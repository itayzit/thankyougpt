import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

export async function insertMessage(role: string, content: string, sessionId: string, environment: string) {
  await sql`
    INSERT INTO messages (role, content, sessionid, environment)
    VALUES (${role}, ${content}, ${sessionId}, ${environment})
  `;
}

