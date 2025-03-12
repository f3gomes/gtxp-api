import { z } from "zod";

export const feedbackSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
});
