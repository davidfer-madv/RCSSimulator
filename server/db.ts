import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as relations from "./db-declarative"; // Import our relations

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure the database connection
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create the drizzle instance with both schema and relations
export const db = drizzle(pool, { 
  schema: {
    ...schema,
    ...relations
  } 
});