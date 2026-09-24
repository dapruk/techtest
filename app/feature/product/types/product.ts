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

export type Product = z.infer<typeof productSchema>
