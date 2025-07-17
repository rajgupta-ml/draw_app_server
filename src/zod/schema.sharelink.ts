import { z } from "zod";

// Simple schema that just checks for id and json fields
export const ShapeDataSchema = z.object({
  id: z.string(),
  json: z.string(),
});

// Type export
export type ShapeData = z.infer<typeof ShapeDataSchema>;