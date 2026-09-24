import { type RouteConfig, index, layout } from "@react-router/dev/routes"

export default [
  layout("components/layouts/general-layout.tsx", [
    index("routes/auth/login.tsx"),
  ]),
] satisfies RouteConfig
