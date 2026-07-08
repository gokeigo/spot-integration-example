import { useEffect, useMemo, useState } from "react";
import { Send, Loader2, Lock, Info, Receipt } from "lucide-react";
import { env } from "~/env";
import { submitGastos } from "~/server/submit-gastos";
import { SAMPLE_RECEIPTS, renderSampleReceipt } from "~/lib/sample-receipts";
import { EXPENSE_SUBTYPE_OPTIONS } from "~/constants/expense-subtypes";
import type { GastosFormValues, GastosResult } from "~/types/gokei-gastos";
import { ReceiptPicker } from "~/components/ui/gastos/receipt-picker";
import { CodeSnippet } from "~/components/ui/gastos/code-snippet";
import { ResponseView } from "~/components/ui/gastos/response-view";
import { FieldReference } from "~/components/ui/gastos/field-reference";

const MAX_FILES = 5;
const MAX_BYTES = 2 * 1024 * 1024;

type ReqTab = "params" | "body" | "headers";

interface GastosConsoleProps {
  publicKey: string;
  rut: string;
  orderHash?: string;
  isCnpl: boolean;
}

function todayDdMmYyyy(): string {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${now.getFullYear()}`;
}

export function GastosConsole({
  publicKey,
  rut,
  orderHash,
  isCnpl,
}: GastosConsoleProps) {
  const apiUrl = env.NEXT_PUBLIC_GOKEI_API_URL ?? "";

  const [publicKeyInput, setPublicKeyInput] = useState(publicKey);
  const [rutInput, setRutInput] = useState(rut);
  const [reqTab, setReqTab] = useState<ReqTab>("body");
  const [values, setValues] = useState<GastosFormValues>({
    name: "Consulta médica",
    date: todayDdMmYyyy(),
    receiptId: "",
    receiptRut: "",
    doctorRut: "",
    total: "",
    skipPayOrderId: orderHash ?? "",
    expenseSubtypes: [],
  });
  const [selectedSampleIds, setSelectedSampleIds] = useState<string[]>([
    "boleta-honorarios",
    "orden-examenes",
  ]);
  const [uploads, setUploads] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<"idle" | "sending">("idle");
  const [result, setResult] = useState<GastosResult | null>(null);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  // Backfill the AAPD order hash once it resolves upstream, unless edited.
  useEffect(() => {
    if (!orderHash) return;
    setValues((prev) =>
      prev.skipPayOrderId ? prev : { ...prev, skipPayOrderId: orderHash },
    );
  }, [orderHash]);

  const totalSelected = selectedSampleIds.length + uploads.length;

  const fileNames = useMemo(() => {
    const sampleNames = SAMPLE_RECEIPTS.filter((doc) =>
      selectedSampleIds.includes(doc.id),
    ).map((doc) => doc.filename);
    return [...sampleNames, ...uploads.map((file) => file.name)];
  }, [selectedSampleIds, uploads]);

  const setField = <K extends keyof GastosFormValues>(
    key: K,
    value: GastosFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const toggleSubtype = (value: string) =>
    setValues((prev) => ({
      ...prev,
      expenseSubtypes: prev.expenseSubtypes.includes(value)
        ? prev.expenseSubtypes.filter((item) => item !== value)
        : [...prev.expenseSubtypes, value],
    }));

  const toggleSample = (id: string) => {
    setFileError(null);
    setSelectedSampleIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (totalSelected >= MAX_FILES) {
        setFileError(`Máximo ${MAX_FILES} archivos.`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const addUploads = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setFileError(null);
    const incoming = Array.from(files);
    setUploads((prev) => {
      const next = [...prev];
      for (const file of incoming) {
        if (selectedSampleIds.length + next.length >= MAX_FILES) {
          setFileError(`Máximo ${MAX_FILES} archivos.`);
          break;
        }
        if (file.size > MAX_BYTES) {
          setFileError(`${file.name} supera el límite de 2 MB.`);
          continue;
        }
        next.push(file);
      }
      return next;
    });
  };

  const removeUpload = (index: number) => {
    setFileError(null);
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const canSend =
    submitState === "idle" &&
    totalSelected > 0 &&
    publicKeyInput.trim() !== "" &&
    rutInput.trim() !== "" &&
    apiUrl !== "";

  const handleSend = async () => {
    if (!canSend) return;
    setSubmitState("sending");
    setResult(null);
    setElapsedMs(null);
    const startedAt =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    try {
      const sampleFiles = await Promise.all(
        SAMPLE_RECEIPTS.filter((doc) => selectedSampleIds.includes(doc.id)).map(
          (doc) => renderSampleReceipt(doc),
        ),
      );
      const files = [...sampleFiles, ...uploads];

      const response = await submitGastos({
        apiUrl,
        publicKey: publicKeyInput.trim(),
        rut: rutInput.trim(),
        values,
        files,
      });

      const elapsed =
        typeof performance !== "undefined" ? performance.now() : Date.now();
      setElapsedMs(Math.round(elapsed - startedAt));
      setResult(response);
    } catch (error) {
      setResult({
        ok: false,
        status: 0,
        error: {
          detail:
            error instanceof Error
              ? error.message
              : "Error de red al enviar el gasto",
          code: "network_error",
        },
      });
    } finally {
      setSubmitState("idle");
    }
  };

  const inputClass =
    "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3 border-b border-gray-100 px-6 py-5">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600">
          <Receipt className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[11px] font-bold tracking-wide text-amber-700">
              POST
            </span>
            <span className="font-mono text-sm font-semibold text-gray-900">
              /api/spot/gastos
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Envía la boleta (y la orden médica cuando aplica) para que Skip
            gestione el reembolso.
          </p>
        </div>
        <span className="ml-auto hidden rounded-md border border-gray-200 bg-gray-50 px-2 py-1 font-mono text-[11px] text-gray-500 sm:block">
          auth · public_key
        </span>
      </div>

      <div className="flex flex-col gap-5 px-6 py-5">
        {/* URL bar */}
        <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-200">
          <span className="flex items-center bg-amber-50 px-3 font-mono text-xs font-bold text-amber-700">
            POST
          </span>
          <div className="flex-1 overflow-x-auto whitespace-nowrap border-l border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600">
            <span className="text-gray-400">{apiUrl}</span>
            <span className="text-gray-900">/gastos</span>
            <span className="text-violet-700">
              ?public_key={publicKeyInput || "…"}&rut={rutInput || "…"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex gap-1 border-b border-gray-100">
            {(
              [
                ["params", "Params"],
                ["body", "Body · form-data"],
                ["headers", "Headers"],
              ] as [ReqTab, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setReqTab(id)}
                className={`border-b-2 px-3 py-2 text-xs font-medium transition ${
                  reqTab === id
                    ? "border-violet-500 text-violet-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Params */}
          {reqTab === "params" && (
            <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-600">
                  public_key
                </span>
                <input
                  value={publicKeyInput}
                  onChange={(e) => setPublicKeyInput(e.target.value)}
                  placeholder="PK_…"
                  className={`${inputClass} font-mono`}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-gray-600">rut</span>
                <input
                  value={rutInput}
                  onChange={(e) => setRutInput(e.target.value)}
                  placeholder="12345678-9"
                  className={`${inputClass} font-mono`}
                />
              </label>
              <p className="col-span-full flex items-start gap-2 text-xs text-gray-500">
                <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                El <span className="font-mono">rut</span> debe existir como
                beneficiario en Skip (lo crea el paso del widget) o el backend
                responde <span className="font-mono">404</span>.
              </p>
            </div>
          )}

          {/* Body */}
          {reqTab === "body" && (
            <div className="flex flex-col gap-5 pt-4">
              <ReceiptPicker
                selectedSampleIds={selectedSampleIds}
                uploads={uploads}
                totalSelected={totalSelected}
                maxFiles={MAX_FILES}
                onToggleSample={toggleSample}
                onAddUploads={addUploads}
                onRemoveUpload={removeUpload}
                error={fileError}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 sm:col-span-2">
                  <span className="text-xs font-medium text-gray-600">
                    name
                  </span>
                  <input
                    value={values.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-gray-600">
                    date <span className="text-gray-400">· dd/mm/yyyy</span>
                  </span>
                  <input
                    value={values.date}
                    onChange={(e) => setField("date", e.target.value)}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-gray-600">
                    receipt_id
                  </span>
                  <input
                    value={values.receiptId}
                    onChange={(e) => setField("receiptId", e.target.value)}
                    placeholder="69"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-gray-600">
                    receipt_rut
                  </span>
                  <input
                    value={values.receiptRut}
                    onChange={(e) => setField("receiptRut", e.target.value)}
                    placeholder="96.770.100-9"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-gray-600">
                    doctor_rut <span className="text-gray-400">· opcional</span>
                  </span>
                  <input
                    value={values.doctorRut}
                    onChange={(e) => setField("doctorRut", e.target.value)}
                    placeholder="11.111.111-1"
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-gray-600">
                    total <span className="text-gray-400">· CLP</span>
                  </span>
                  <input
                    value={values.total}
                    onChange={(e) => setField("total", e.target.value)}
                    placeholder="100000"
                    inputMode="numeric"
                    className={inputClass}
                  />
                </label>
                {isCnpl && (
                  <label className="flex flex-col gap-1.5 sm:col-span-2">
                    <span className="text-xs font-medium text-gray-600">
                      skip_pay_order_id{" "}
                      <span className="text-gray-400">· AAPD</span>
                    </span>
                    <input
                      value={values.skipPayOrderId}
                      onChange={(e) =>
                        setField("skipPayOrderId", e.target.value)
                      }
                      placeholder="hash de la orden CNPL"
                      className={`${inputClass} font-mono text-xs`}
                    />
                  </label>
                )}
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-xs font-medium text-gray-600">
                    expense_subtypes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {EXPENSE_SUBTYPE_OPTIONS.map((option) => {
                      const on = values.expenseSubtypes.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleSubtype(option.value)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                            on
                              ? "border-violet-600 bg-violet-600 text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-violet-200"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Headers */}
          {reqTab === "headers" && (
            <div className="flex flex-col gap-3 pt-4">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full min-w-[420px] border-collapse text-xs">
                  <tbody>
                    <tr>
                      <td className="border-b border-gray-100 px-4 py-2 font-mono font-semibold text-gray-900">
                        Content-Type
                      </td>
                      <td className="border-b border-gray-100 px-4 py-2 font-mono text-gray-600">
                        multipart/form-data; boundary=…
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="flex items-start gap-2 text-xs text-gray-500">
                <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                Sin header <span className="font-mono">Authorization</span>: la
                autenticación es el{" "}
                <span className="font-mono">public_key</span> de la query. El
                boundary lo pone el cliente automáticamente.
              </p>
            </div>
          )}
        </div>

        {/* Code snippet */}
        <CodeSnippet
          apiUrl={apiUrl}
          publicKey={publicKeyInput}
          rut={rutInput}
          values={values}
          fileNames={fileNames}
        />

        {/* Send */}
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={!canSend}
          className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitState === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando {totalSelected} archivo{totalSelected === 1 ? "" : "s"}…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Enviar gasto a Skip
            </>
          )}
        </button>

        {/* Response */}
        {result && <ResponseView result={result} elapsedMs={elapsedMs} />}

        <FieldReference />
      </div>
    </section>
  );
}

export default GastosConsole;
