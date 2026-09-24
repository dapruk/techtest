import { Outlet } from "react-router"

export default function GeneralLayout() {
  return (
    <div className="flex h-full w-screen bg-background p-6">
      <Outlet />
    </div>
  )
}
