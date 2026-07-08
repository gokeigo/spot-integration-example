import { CheckCircle2, AlertTriangle } from "lucide-react";
import type { GastosResult } from "~/types/gokei-gastos";

interface ResponseViewProps {
  result: GastosResult;
  elapsedMs: number | null;
}

const SUBMISSION_BADGES: Record<
  string,
  { label: string; className: string; note: string }
> = {
  queued: {
    label: "Enviada a rendición",
    className: "bg-emerald-600 text-white",
    note: "Skip está procesando el reembolso.",
  },
  not_enqueued: {
    label: "Recibida (staging)",
    className: "bg-amber-500 text-white",
    note: "Documento guardado; la cola de IA no está activa en staging.",
  },
  blocked_spot_limit: {
    label: "Tope alcanzado",
    className: "bg-orange-500 text-white",
    note: "El usuario superó su límite de rendiciones.",
  },
};

function statusText(status: number): string {
  if (status === 200) return "200 OK";
  if (status === 400) return "400 Bad Request";
  if (status === 401) return "401 Unauthorized";
  if (status === 404) return "404 Not Found";
  return String(status);
}

export function ResponseView({ result, elapsedMs }: ResponseViewProps) {
  const ok = result.ok;
  const body = ok ? result.data : result.error;
  const json = JSON.stringify(body, null, 2);

  const badge =
    ok && result.data.submission_status
      ? SUBMISSION_BADGES[result.data.submission_status]
      : undefined;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-gray-100 bg-gray-50 px-4 py-2.5 font-mono text-xs">
        <span
          className={`flex items-center gap-2 font-bold ${
            ok ? "text-emerald-700" : "text-red-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              ok ? "bg-emerald-600" : "bg-red-600"
            }`}
          />
          {statusText(result.status)}
        </span>
        {elapsedMs !== null && (
          <span className="text-gray-500">
            Time <b className="font-semibold text-gray-700">{elapsedMs} ms</b>
          </span>
        )}
        {ok && result.data.submission_status && (
          <span className="ml-auto text-gray-500">
            submission_status{" "}
            <span className="text-violet-700">
              {result.data.submission_status}
            </span>
          </span>
        )}
        {!ok && result.error.code && (
          <span className="ml-auto text-gray-500">
            code <span className="text-red-600">{result.error.code}</span>
          </span>
        )}
      </div>

      {(badge ?? !ok) && (
        <div
          className={`flex items-start gap-3 px-4 py-3 ${
            ok ? "bg-white" : "bg-red-50"
          }`}
        >
          <span
            className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${
              ok ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {ok ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
          </span>
          <div className="min-w-0">
            {badge && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.className}`}
              >
                {badge.label}
              </span>
            )}
            <p className="mt-1 text-sm text-gray-700">
              {ok ? badge?.note : result.error.detail}
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 bg-[#0f1117]">
        <div className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-wider text-gray-500">
          Response body
        </div>
        <pre className="overflow-x-auto px-4 pb-4 font-mono text-xs leading-relaxed text-gray-300">
          {json}
        </pre>
      </div>
    </div>
  );
}

export default ResponseView;
