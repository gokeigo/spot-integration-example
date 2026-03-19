import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env";

export interface CreateOrderResponse {
  hash: string;
  reference: string;
  status: string;
  total_amount: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!env.SKIPPAY_API_URL) {
    return res.status(500).json({ error: "SKIPPAY_API_URL is not configured" });
  }

  const { clientSecret: bodySecret, patient, totalAmount } = req.body as {
    clientSecret?: string;
    patient: { name: string; rut: string; email: string; phone_number: string };
    totalAmount: number;
  };

  const clientSecret = bodySecret ?? env.SKIPAY_CLIENT_SECRET;
  if (!clientSecret) {
    return res.status(500).json({ error: "No client secret provided" });
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
    const errorBody = await response.text();
    console.error("SkipPay order creation failed:", response.status, errorBody);
    return res.status(response.status).json({ error: "Failed to create order", detail: errorBody });
  }

  const data = (await response.json()) as CreateOrderResponse;
  return res.status(200).json(data);
}
