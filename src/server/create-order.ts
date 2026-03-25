interface Patient {
  name: string;
  rut: string;
  email: string;
  phone_number: string;
}

export interface CreateOrderRequestBody {
  clientSecret?: string;
  patient: Patient;
  totalAmount: number;
}

export interface CreateOrderResponse {
  hash: string;
  reference: string;
  status: string;
  total_amount: string;
}

export async function createSkipPayOrder({
  apiUrl,
  clientSecret,
  patient,
  totalAmount,
  fetchImpl = fetch,
}: {
  apiUrl: string;
  clientSecret: string;
  patient: Patient;
  totalAmount: number;
  fetchImpl?: typeof fetch;
}): Promise<
  | { ok: true; data: CreateOrderResponse }
  | { ok: false; status: number; error: string; detail?: string }
> {
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

  console.log("[create-order] POST", `${apiUrl}/orders`);
  console.log("[create-order] key prefix:", `${clientSecret.slice(0, 6)}...`);
  console.log("[create-order] body:", JSON.stringify(requestBody));

  const response = await fetchImpl(`${apiUrl}/orders`, {
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

    console.error("SkipPay order creation failed:", response.status, errorText);

    return {
      ok: false,
      status: response.status,
      error: "Failed to create order",
      detail,
    };
  }

  const data = (await response.json()) as CreateOrderResponse;
  return { ok: true, data };
}
