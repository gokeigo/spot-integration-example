import type { PagesFunction } from "@cloudflare/workers-types";
import {
  createSkipPayOrder,
  type CreateOrderRequestBody,
} from "../../src/server/create-order";

interface Env {
  NEXT_PUBLIC_SKIP_PAY_API?: string;
  SKIPAY_CLIENT_SECRET?: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!env.NEXT_PUBLIC_SKIP_PAY_API) {
    return Response.json(
      { error: "NEXT_PUBLIC_SKIP_PAY_API is not configured" },
      { status: 500 },
    );
  }

  let body: CreateOrderRequestBody;
  try {
    body = (await request.json()) as CreateOrderRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { clientSecret: bodySecret, patient, totalAmount } = body;
  const clientSecret = bodySecret ?? env.SKIPAY_CLIENT_SECRET;

  if (!clientSecret) {
    return Response.json(
      { error: "No client secret provided" },
      { status: 500 },
    );
  }

  const result = await createSkipPayOrder({
    apiUrl: env.NEXT_PUBLIC_SKIP_PAY_API,
    clientSecret,
    patient,
    totalAmount,
  });

  if (!result.ok) {
    return Response.json(
      { error: result.error, detail: result.detail },
      { status: result.status },
    );
  }

  return Response.json(result.data);
};
