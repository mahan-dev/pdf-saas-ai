import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const BASE_URL = process.env.DATABASE_URL;
neonConfig.fetchConnectionCache = true;

if (!BASE_URL) {
  throw new Error("Database url not found");
}

const sql = neon(BASE_URL);


export const db = drizzle(sql)

