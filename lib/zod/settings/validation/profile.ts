import { z } from "zod";

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters"),

  avatar: z
    .instanceof(File)
    .optional()
    .refine(
      (file) =>
        !file ||
        ["image/png", "image/jpeg"].includes(file.type),
      "Avatar must be PNG or JPEG"
    ),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
