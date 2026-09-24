import { getStorage } from "~/lib/utils"
import { authSessionSchema, type AuthSession } from "./types/auth"

export const AUTH_STORAGE_KEY = "auth-session"

export function getStoredSession(): AuthSession | null {
  const storage = getStorage()
  const storedSession = storage?.getItem(AUTH_STORAGE_KEY)

  if (!storage || !storedSession) {
    return null
  }

  try {
    const result = authSessionSchema.safeParse(JSON.parse(storedSession))

    if (result.success) {
      return result.data
    }
  } catch {
    // Invalid sessions are cleared below.
  }

  storage.removeItem(AUTH_STORAGE_KEY)
  return null
}
