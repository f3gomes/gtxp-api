import { z } from "zod";

export const userSchema = z.object({
  pmiId: z.string(),
  profileImgUrl: z.string().optional(),
  name: z.string().min(2, {}),
  email: z.string().email({}),
  phone: z.string().min(10, {}),
  role: z.string(),
  company: z.string(),
  areas: z.array(z.string()).min(1, {}),

  linkedin: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),

  password: z
    .string()
    .min(8, {})
    .regex(/[0-9]/, {})
    .regex(/[a-zA-Z]/, {}),

  visible: z.boolean(),
  type: z.enum(["SPEAKER", "CONGRESSMAN"]),
});

export const userSchemaResetPasword = z.object({
  password: z
    .string()
    .min(8, {})
    .regex(/[0-9]/, {})
    .regex(/[a-zA-Z]/, {}),
});
