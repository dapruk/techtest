import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes"

export default [
  layout("components/layouts/general-layout.tsx", [
    index("routes/auth/login.tsx"),
    route("products", "routes/products/index.tsx"),
  ]),
] satisfies RouteConfig
