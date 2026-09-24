import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { toast } from "~/components/ui/toast"
import { useAuthGuard } from "~/feature/auth/authguard"
import { login } from "~/feature/auth/login"
import { loginSchema, type LoginInput } from "~/feature/auth/types/auth"

export default function Index() {
  const navigate = useNavigate()
  const allowed = useAuthGuard("guest", "/products")
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  function onSubmit(values: LoginInput) {
    form.clearErrors("root")

    const result = login(values)

    if (!result.success) {
      form.setError("root", { message: result.message })
      toast.add({
        title: "Login failed",
        description: result.message,
        type: "error",
      })
      return
    }

    form.reset()
    toast.add({
      title: "Login successful",
      description: `Welcome back, ${result.session.username}`,
      type: "success",
    })
    navigate("/products", { replace: true })
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
    <div className="flex min-h-[calc(100svh-3rem)] flex-1 items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="text"
                      placeholder="Username"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      placeholder="Password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              {form.formState.errors.root && (
                <FieldError>{form.formState.errors.root.message}</FieldError>
              )}
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            type="submit"
            form="login-form"
            disabled={form.formState.isSubmitting}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
