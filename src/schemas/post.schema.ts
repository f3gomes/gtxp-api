import { z } from "zod";

export const postSchema = z.object({
  userId: z.string(),
  message: z.string(),
  imgUrl: z.string().optional(),
  tags: z.array(z.string()).min(1, {}),
});
