import type { Product } from "~/feature/product/types/product"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0] || product.category.image

  return (
    <Card className="h-full pt-0">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform group-hover/card:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <CardDescription>{product.category.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}
