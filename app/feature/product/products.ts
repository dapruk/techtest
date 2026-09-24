import { productSchema, type Product } from "./types/product"

const PRODUCTS_ENDPOINT = "https://api.escuelajs.co/api/v1/products"

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
