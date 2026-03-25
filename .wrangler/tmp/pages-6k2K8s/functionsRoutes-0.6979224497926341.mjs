import { onRequest as __api_create_order_ts_onRequest } from "/Users/martin/Desktop/Skip/repositories/spot-integration-example/functions/api/create-order.ts"

export const routes = [
    {
      routePath: "/api/create-order",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_create_order_ts_onRequest],
    },
  ]