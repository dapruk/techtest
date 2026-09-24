import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"

import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { toast } from "~/components/ui/toast"
import {
  createProduct,
  PRODUCTS_PER_PAGE,
  type ProductsPage,
} from "~/feature/product/products"
import {
  createProductSchema,
  type CreateProductInput,
} from "~/feature/product/types/product"

export function ProductForm() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })
  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (product) => {
      queryClient.setQueriesData<ProductsPage>(
        { queryKey: ["products"] },
        (currentPage) =>
          currentPage
            ? {
                ...currentPage,
                products: [product, ...currentPage.products].slice(
                  0,
                  PRODUCTS_PER_PAGE
                ),
              }
            : currentPage
      )

      toast.add({
        title: "Product created",
        description: `${product.title} was added to the list.`,
        type: "success",
      })
      form.reset()
      setOpen(false)
    },
    onError: () => {
      toast.add({
        title: "Unable to create product",
        description: "Please check the product details and try again.",
        type: "error",
      })
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        Add Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Enter the details for the new product.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-product-form"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Title</FieldLabel>
                  <Input
                    {...field}
                    placeholder="Product title"
                    maxLength={150}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Price</FieldLabel>
                  <Input
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? undefined
                          : event.target.valueAsNumber
                      )
                    }
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Description</FieldLabel>
                  <Textarea {...field} placeholder="Product description" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Category ID</FieldLabel>
                  <Input
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(
                        event.target.value === ""
                          ? undefined
                          : event.target.valueAsNumber
                      )
                    }
                    type="number"
                    min="1"
                    step="1"
                    placeholder="1"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="images"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Image</FieldLabel>
                  <Input
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(event.target.files?.[0])
                    }
                    type="file"
                    accept="image/*"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="create-product-form"
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader2Icon className="animate-spin" />}
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
