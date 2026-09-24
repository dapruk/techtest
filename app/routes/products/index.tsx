import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Loader2Icon, SearchIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

import { ProductCard } from "~/components/feature/product/product-card"
import { ProductForm } from "~/components/feature/product/product-form"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { toast } from "~/components/ui/toast"
import { useAuthGuard } from "~/feature/auth/authguard"
import { logout } from "~/feature/auth/logout"
import { getProducts } from "~/feature/product/products"

export default function Index() {
  const navigate = useNavigate()
  const allowed = useAuthGuard("authenticated", "/")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const { data, error, isError, isFetching, isPending } = useQuery({
    queryKey: ["products", page, debouncedSearch],
    queryFn: ({ signal }) =>
      getProducts({ page, search: debouncedSearch, signal }),
    enabled: allowed === true,
    placeholderData: keepPreviousData,
    retry: 1,
  })

  const products = data?.products ?? []
  const hasNextPage = data?.hasNextPage ?? false

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timeout)
  }, [search])

  useEffect(() => {
    if (!error) {
      return
    }

    toast.add({
      title: "Unable to load products",
      description: "Please try again.",
      type: "error",
    })
  }, [error])

  function handleLogout() {
    logout()
    toast.add({
      title: "Logged out",
      description: "Your session has been removed",
      type: "success",
    })
    navigate("/", { replace: true })
  }

  if (allowed === null) {
    return (
      <div className="flex min-h-[calc(100svh-3rem)] flex-1 items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!allowed) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <nav className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
        <span className="text-lg font-semibold">Product Store</span>
        <div className="flex gap-2">
          <ProductForm />
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </nav>

      <main>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold">Products</h1>
          <div className="relative w-full sm:max-w-xs">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              className="pl-8"
              placeholder="Search products..."
            />
          </div>
        </div>

        {isPending ? (
          <div className="flex min-h-80 items-center justify-center">
            <Loader2Icon className="size-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <p className="py-20 text-center text-destructive">
            Unable to load products.
          </p>
        ) : products.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            No products found.
          </p>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            disabled={page === 1 || isFetching}
            onClick={() => setPage((currentPage) => currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page}</span>
          <Button
            variant="outline"
            disabled={!hasNextPage || isFetching}
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  )
}
