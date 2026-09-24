import { ImageIcon } from "lucide-react"
import { useEffect, useState } from "react"

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
  const image = product.images[0]
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [image])

  return (
    <Card className="h-full pt-0">
      <div className="flex aspect-square items-center justify-center overflow-hidden bg-muted">
        {image && !imageFailed ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform group-hover/card:scale-105"
          />
        ) : (
          <ImageIcon className="size-16 text-muted-foreground" />
        )}
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
