import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/, "PORT must be a number"),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsedEnv.error);
  process.exit(1); 
}

export const config = parsedEnv.data;
