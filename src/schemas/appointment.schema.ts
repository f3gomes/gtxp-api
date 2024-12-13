import { z } from "zod";

export const appointmentSchema = z.object({
  userId: z.string(),
  local: z.string(),
  description: z.string(),
  limit: z.number(),
  date: z.coerce.date(),
});
