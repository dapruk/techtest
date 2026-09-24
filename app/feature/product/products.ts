import { z } from "zod"

import {
  productSchema,
  type CreateProductInput,
  type Product,
} from "./types/product"

const PRODUCTS_ENDPOINT = "https://api.escuelajs.co/api/v1/products"
const FILES_ENDPOINT = "https://api.escuelajs.co/api/v1/files/upload"

export const PRODUCTS_PER_PAGE = 6

type GetProductsOptions = {
  page: number
  search: string
  signal?: AbortSignal
}

export type ProductsPage = {
  products: Product[]
  hasNextPage: boolean
}

export async function getProducts({
  page,
  search,
  signal,
}: GetProductsOptions): Promise<ProductsPage> {
  const params = new URLSearchParams({
    offset: String((page - 1) * PRODUCTS_PER_PAGE),
    limit: String(PRODUCTS_PER_PAGE + 1),
  })

  if (search.trim()) {
    params.set("title", search.trim())
  }

  const response = await fetch(`${PRODUCTS_ENDPOINT}?${params}`, { signal })

  if (!response.ok) {
    throw new Error("Unable to load products")
  }

  const data: unknown = await response.json()

  if (!Array.isArray(data)) {
    throw new Error("The products response is invalid")
  }

  const products = data.flatMap((item) => {
    const result = productSchema.safeParse(item)
    return result.success ? [result.data] : []
  })

  return {
    products: products.slice(0, PRODUCTS_PER_PAGE),
    hasNextPage: products.length > PRODUCTS_PER_PAGE,
  }
}

async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(FILES_ENDPOINT, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Unable to upload product image")
  }

  const result = z
    .object({ location: z.string() })
    .safeParse(await response.json())

  if (!result.success) {
    throw new Error("The uploaded image response is invalid")
  }

  return result.data.location
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const images = input.images ? [await uploadProductImage(input.images)] : []

  const response = await fetch(PRODUCTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.title,
      price: input.price,
      description: input.description || "",
      categoryId: input.categoryId,
      images,
    }),
  })

  if (!response.ok) {
    throw new Error("Unable to create product")
  }

  const result = productSchema.safeParse(await response.json())

  if (!result.success) {
    throw new Error("The created product response is invalid")
  }

  return result.data
}
