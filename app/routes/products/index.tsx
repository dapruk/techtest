import { ProductCard } from "~/components/feature/product/product-card"
import { Button } from "~/components/ui/button"

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Comfortable headphones for everyday listening.",
    price: 89.99,
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    description: "A compact keyboard with tactile switches.",
    price: 119.99,
  },
  {
    id: 3,
    name: "USB-C Hub",
    description: "Connect displays, storage, and accessories.",
    price: 49.99,
  },
  {
    id: 4,
    name: "Webcam",
    description: "Clear video for meetings and streaming.",
    price: 69.99,
  },
  {
    id: 5,
    name: "Laptop Stand",
    description: "Raise your laptop for a more comfortable setup.",
    price: 39.99,
  },
]

export default function Index() {
  return (
    <div className="flex w-full flex-col gap-8">
      <nav className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
        <span className="text-lg font-semibold">Product Store</span>
        <Button variant="outline">Cart</Button>
      </nav>

      <main>
        <h1 className="mb-4 text-2xl font-bold">Products</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
