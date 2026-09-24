export { cn } from "cn"

export function getStorage() {
  return typeof window === "undefined" ? null : window.localStorage
}
