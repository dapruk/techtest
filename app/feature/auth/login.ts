import { getStorage } from "~/lib/utils"
import { AUTH_STORAGE_KEY } from "./session"
import { loginSchema, type LoginInput, type LoginResult } from "./types/auth"

const MOCK_CREDENTIALS: LoginInput = {
  username: "admin",
  password: "password",
}

export function loginMiddleware(input: unknown): LoginResult {
  const parsedInput = loginSchema.safeParse(input)

  if (!parsedInput.success) {
    return {
      success: false,
      message: "Username and password are required",
    }
  }

  const { username, password } = parsedInput.data

  if (
    username !== MOCK_CREDENTIALS.username ||
    password !== MOCK_CREDENTIALS.password
  ) {
    return { success: false, message: "Invalid username or password" }
  }

  return {
    success: true,
    session: {
      username,
      authenticatedAt: new Date().toISOString(),
    },
  }
}

export function login(input: LoginInput): LoginResult {
  const result = loginMiddleware(input)

  if (!result.success) {
    return result
  }

  try {
    getStorage()?.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.session))
    return result
  } catch {
    return { success: false, message: "Unable to save login session" }
  }
}
