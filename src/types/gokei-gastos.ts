export interface GastosFormValues {
  name: string;
  date: string;
  receiptId: string;
  receiptRut: string;
  doctorRut: string;
  total: string;
  skipPayOrderId: string;
  expenseSubtypes: string[];
}

/** Success payload of `POST /api/spot/gastos` (GastosResponseSchema). */
export interface GastosResponse {
  status: string;
  processed_files: string[];
  submission_status: string | null;
  pending_document_ids: string[];
  submission_job_id: string | null;
  missing_document_types: string[];
}

/** Error payload of `POST /api/spot/gastos` (GastosErrorSchema). */
export interface GastosErrorBody {
  detail: string;
  code: string | null;
}

export type GastosResult =
  | { ok: true; status: number; data: GastosResponse }
  | { ok: false; status: number; error: GastosErrorBody };
