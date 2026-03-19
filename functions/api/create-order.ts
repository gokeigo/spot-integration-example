import type { PagesFunction } from "@cloudflare/workers-types";

interface Env {
  SKIPPAY_API_URL?: string;
  SKIPAY_CLIENT_SECRET?: string;
}

interface CreateOrderRequestBody {
  clientSecret?: string;
  patient: {
    name: string;
    rut: string;
    email: string;
    phone_number: string;
  };
  totalAmount: number;
}

export interface CreateOrderResponse {
  hash: string;
  reference: string;
  status: string;
  total_amount: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  if (!env.SKIPPAY_API_URL) {
    return Response.json(
      { error: "SKIPPAY_API_URL is not configured" },
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

  const nameParts = patient.name.split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  const requestBody = {
    reference: `ORDER-${Date.now()}`,
    total_amount: String(totalAmount),
    customer: {
      rut: patient.rut,
      first_name: firstName,
      last_name: lastName,
      email: patient.email,
      phone_number: patient.phone_number,
    },
  };

  console.log("[create-order] POST", `${env.SKIPPAY_API_URL}/orders`);
  console.log("[create-order] key prefix:", clientSecret.slice(0, 6) + "...");
  console.log("[create-order] body:", JSON.stringify(requestBody));

  const response = await fetch(`${env.SKIPPAY_API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clientSecret}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let detail: string;
    try {
      detail = JSON.stringify(JSON.parse(errorText));
    } catch {
      detail = errorText;
    }
    console.error(
      "SkipPay order creation failed:",
      response.status,
      errorText,
    );
    return Response.json(
      { error: "Failed to create order", detail },
      { status: response.status },
    );
  }

  const data = (await response.json()) as CreateOrderResponse;
  return Response.json(data);
};
