import { drizzle } from 'drizzle-orm/node-postgres';

console.log(process.env.POSTGRES_URL);
export const db = drizzle(process.env.POSTGRES_URL!)
