import { getStorage } from "~/lib/utils"
import { AUTH_STORAGE_KEY } from "./session"

export function logout() {
  getStorage()?.removeItem(AUTH_STORAGE_KEY)
}
