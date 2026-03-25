import type { NextApiRequest, NextApiResponse } from "next";
import {
  createSkipPayOrder,
  type CreateOrderRequestBody,
} from "~/server/create-order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiUrl = process.env.NEXT_PUBLIC_SKIP_PAY_API;
  if (!apiUrl) {
    return res.status(500).json({ error: "NEXT_PUBLIC_SKIP_PAY_API is not configured" });
  }

  const body = req.body as CreateOrderRequestBody | undefined;
  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { clientSecret: bodySecret, patient, totalAmount } = body;
  const clientSecret = bodySecret ?? process.env.SKIPAY_CLIENT_SECRET;

  if (!clientSecret) {
    return res.status(500).json({ error: "No client secret provided" });
  }

  if (
    !patient ||
    typeof patient.name !== "string" ||
    typeof patient.rut !== "string" ||
    typeof patient.email !== "string" ||
    typeof patient.phone_number !== "string" ||
    typeof totalAmount !== "number"
  ) {
    return res.status(400).json({ error: "Invalid create order payload" });
  }

  const result = await createSkipPayOrder({
    apiUrl,
    clientSecret,
    patient,
    totalAmount,
  });

  if (!result.ok) {
    return res
      .status(result.status)
      .json({ error: result.error, detail: result.detail });
  }

  return res.status(200).json(result.data);
}
