import { z } from "zod"

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  images: z.array(z.string()),
  category: z.object({
    id: z.number(),
    name: z.string(),
    image: z.string(),
  }),
})

export const createProductSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be at most 150 characters"),
  price: z.number({ error: "Price must be a number" }).nonnegative(),
  description: z.string(),
  categoryId: z.number({ error: "Category is required" }).int().positive(),
  images: z
    .custom<File>((value) => value instanceof File, "Image must be a file")
    .optional(),
})

export type Product = z.infer<typeof productSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
