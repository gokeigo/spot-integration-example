interface FieldRow {
  field: string;
  type: string;
  required: boolean;
  format: string;
  note: string;
}

const FIELDS: FieldRow[] = [
  {
    field: "public_key",
    type: "query · string",
    required: true,
    format: "PK_…",
    note: "Provider activo. Público.",
  },
  {
    field: "rut",
    type: "query · string",
    required: true,
    format: "87839572-7",
    note: "El beneficiario debe existir → si no, 404.",
  },
  {
    field: "name",
    type: "form · string",
    required: false,
    format: "texto libre",
    note: "La IA lo completa si va vacío.",
  },
  {
    field: "date",
    type: "form · string",
    required: false,
    format: "dd/mm/yyyy",
    note: "Ej: 30/12/2025",
  },
  {
    field: "receipt_id",
    type: "form · string",
    required: false,
    format: "69",
    note: "N° boleta SII.",
  },
  {
    field: "receipt_rut",
    type: "form · string",
    required: false,
    format: "96.770.100-9",
    note: "RUT emisor (se normaliza).",
  },
  {
    field: "doctor_rut",
    type: "form · string",
    required: false,
    format: "11.111.111-1",
    note: "Opcional.",
  },
  {
    field: "total",
    type: "form · int",
    required: false,
    format: "100000",
    note: "CLP, sin separadores.",
  },
  {
    field: "skip_pay_order_id",
    type: "form · string",
    required: false,
    format: "uuid",
    note: "Enlaza a la orden CNPL/AAPD.",
  },
  {
    field: "expense_subtypes",
    type: "form · string[]",
    required: false,
    format: "DOCTOR_APPOINTMENT…",
    note: "Campo repetible (una vez por valor).",
  },
  {
    field: "uploaded_files",
    type: "form · file[]",
    required: true,
    format: "png / jpg / pdf",
    note: "1–5 archivos, ≤2 MB c/u.",
  },
];

export function FieldReference() {
  return (
    <details className="overflow-hidden rounded-xl border border-gray-200">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 hover:bg-gray-50">
        Referencia de campos
        <span className="ml-auto font-mono text-[11px] font-normal normal-case tracking-normal text-gray-400">
          schema
        </span>
      </summary>
      <div className="overflow-x-auto border-t border-gray-100">
        <table className="w-full min-w-[560px] border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 text-left text-[10px] uppercase tracking-wider text-gray-400">
              <th className="px-4 py-2 font-semibold">Campo</th>
              <th className="px-4 py-2 font-semibold">Tipo</th>
              <th className="px-4 py-2 font-semibold">Req</th>
              <th className="px-4 py-2 font-semibold">Formato</th>
              <th className="px-4 py-2 font-semibold">Notas</th>
            </tr>
          </thead>
          <tbody>
            {FIELDS.map((row) => (
              <tr key={row.field} className="border-t border-gray-100">
                <td className="px-4 py-2 font-mono font-semibold text-gray-900">
                  {row.field}
                </td>
                <td className="px-4 py-2 font-mono text-violet-700">
                  {row.type}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={row.required ? "text-red-500" : "text-gray-300"}
                  >
                    ●
                  </span>
                </td>
                <td className="px-4 py-2 font-mono text-gray-600">
                  {row.format}
                </td>
                <td className="px-4 py-2 text-gray-500">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export default FieldReference;
