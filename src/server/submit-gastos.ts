import type {
  GastosFormValues,
  GastosResult,
  GastosResponse,
  GastosErrorBody,
} from "~/types/gokei-gastos";

/**
 * Ordered `[key, value]` pairs for the multipart body of `POST /spot/gastos`,
 * excluding the files. Shared between the real request (`submitGastos`) and the
 * code snippets so they never drift. Empty optional fields are dropped.
 */
export function gastosFieldEntries(
  values: GastosFormValues,
): Array<[string, string]> {
  const entries: Array<[string, string]> = [
    ["name", values.name],
    ["date", values.date],
    ["receipt_id", values.receiptId],
    ["receipt_rut", values.receiptRut],
  ];

  if (values.doctorRut.trim()) entries.push(["doctor_rut", values.doctorRut]);

  const total = values.total.replace(/\D/g, "");
  if (total) entries.push(["total", total]);

  if (values.skipPayOrderId.trim())
    entries.push(["skip_pay_order_id", values.skipPayOrderId]);

  for (const subtype of values.expenseSubtypes) {
    entries.push(["expense_subtypes", subtype]);
  }

  return entries;
}

interface SubmitGastosArgs {
  apiUrl: string;
  publicKey: string;
  rut: string;
  values: GastosFormValues;
  files: File[];
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}

/**
 * Sends the expense upload directly to `POST /api/spot/gastos`.
 *
 * Unlike the CNPL order flow, this endpoint authenticates only with the
 * `public_key` query param — no secret — so the call goes straight from the
 * browser (no server-side proxy). `multipart/form-data` is CORS-safelisted, so
 * no preflight is triggered.
 */
export async function submitGastos({
  apiUrl,
  publicKey,
  rut,
  values,
  files,
  signal,
  fetchImpl = fetch,
}: SubmitGastosArgs): Promise<GastosResult> {
  const formData = new FormData();
  for (const [key, value] of gastosFieldEntries(values)) {
    formData.append(key, value);
  }
  for (const file of files) {
    formData.append("uploaded_files", file, file.name);
  }

  const url = `${apiUrl}/gastos?public_key=${encodeURIComponent(
    publicKey,
  )}&rut=${encodeURIComponent(rut)}`;

  // No manual Content-Type: the browser sets the multipart boundary.
  const response = await fetchImpl(url, {
    method: "POST",
    body: formData,
    signal,
  });

  const text = await response.text();
  let parsed: unknown;
  try {
    parsed = text ? JSON.parse(text) : undefined;
  } catch {
    parsed = undefined;
  }

  if (!response.ok) {
    const body = parsed as Partial<GastosErrorBody> | undefined;
    return {
      ok: false,
      status: response.status,
      error: {
        detail: body?.detail ?? text ?? "Error desconocido",
        code: body?.code ?? null,
      },
    };
  }

  return {
    ok: true,
    status: response.status,
    data: parsed as GastosResponse,
  };
}
