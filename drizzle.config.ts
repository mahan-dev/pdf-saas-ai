import type { Config } from "drizzle-kit";
import * as dotEnv from "dotenv";
dotEnv.config({ path: ".env" });

const BASE_URL = process.env.DATABASE_URL as string;

export default {
  dialect:"postgresql",
  schema: "./core/lib/db/schema.ts",
  dbCredentials: {
    url: BASE_URL,
  },
} satisfies Config;
 