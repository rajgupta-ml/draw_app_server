import { z } from "zod";

// Simple schema that just checks for id and json fields
export const ShapeDataSchema = z.object({
  id: z.string(),
  json: z.string(),
});


export const roomRequestSchema = z.object({
  id : z.string(),
  name : z.string()
})


export enum MessageType {
  JOIN_ROOM = "join-room",
  REMOVE_ROOM = "remove-room",
  SHARE_DRAW_STATE = "share-draw-state",
  SAVE_DRAW_STATE = "save-draw-state"
}


export const messageSchema = z.object({
  type : z.enum(MessageType),
  name : z.string(),
  roomId : z.string(),
  message : z.string().optional()
})

// Type export
export type ShapeData = z.infer<typeof ShapeDataSchema>;