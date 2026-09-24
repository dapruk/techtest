import z from "zod"

export const authSessionSchema = z.object({
  username: z.string(),
  authenticatedAt: z.string(),
})

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type AuthSession = z.infer<typeof authSessionSchema>

export type LoginResult =
  { success: true; session: AuthSession } | { success: false; message: string }

export type AuthRole = "user"
export type AuthFeature = "products"
export type AuthAction = "read" | "create"
export type AuthRoute = "/" | "/products"
export type AuthRequirement = "authenticated" | "guest"

export type AuthGuardData = {
  session: AuthSession | null
}
