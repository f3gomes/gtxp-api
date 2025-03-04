import { z } from "zod";

export const postSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  imgUrl: z.string().optional(),
  profileImg: z.string().optional(),
});
