import { createGuard } from "guardap"
import { createReactRouterDriver } from "guardap/drivers/react-router"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"

import { getStoredSession } from "./session"
import type {
  AuthAction,
  AuthFeature,
  AuthGuardData,
  AuthRequirement,
  AuthRole,
  AuthRoute,
} from "./types/auth"

function createAuthGuard(navigate: ReturnType<typeof useNavigate>) {
  return createGuard<
    AuthRole,
    AuthFeature,
    AuthAction,
    never,
    never,
    AuthGuardData,
    AuthRoute
  >({
    defaultRedirect: "/",
    router: {
      driver: createReactRouterDriver<AuthRoute>(navigate),
    },
    getPermissions: (roles) =>
      roles.includes("user") ? { products: "rc" } : {},
    getUserState: () => {
      const session = getStoredSession()

      return {
        roles: session ? ["user"] : [],
        conditions: {},
        isAuthenticated: Boolean(session),
        session,
      }
    },
  })
}

export function useAuthGuard(
  requirement: AuthRequirement,
  redirectTo: AuthRoute
) {
  const navigate = useNavigate()
  const guard = useMemo(() => createAuthGuard(navigate), [navigate])
  const [allowed, setAllowed] = useState<boolean | null>(null)

  useEffect(() => {
    const guardChain =
      requirement === "authenticated" ? guard.requireLogin() : guard.guestOnly()
    const canAccess = guardChain.allowed()

    setAllowed(canAccess)

    if (canAccess) {
      return
    }

    guardChain.redirect(redirectTo)
  }, [guard, redirectTo, requirement])

  return allowed
}
