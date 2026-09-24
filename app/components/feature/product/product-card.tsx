import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

type ProductCardProps = {
  name: string
  description: string
  price: number
}

export function ProductCard({ name, description, price }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold">${price.toFixed(2)}</p>
      </CardContent>
    </Card>
  )
}
