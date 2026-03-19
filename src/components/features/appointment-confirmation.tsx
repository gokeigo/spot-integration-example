import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import SuccessHeader from "~/components/ui/success/success-header";
import AppointmentDetails from "~/components/ui/success/appointment-details";
import NextSteps from "~/components/ui/success/next-steps";
import ActionButtons from "~/components/ui/success/action-buttons";
import { patientAtom } from "~/atoms/patient";
import { env } from "~/env";
import ModalIframe from "./modal-iframe";
import { usePublicKey } from "~/hooks/use-public-key";
import { PiggyBank, AlertTriangle, Settings } from "lucide-react";
import DivIframe from "./div-iframe";
import { type GokeiWidgetResponse } from "~/types/gokei-spot";
import { showModalAtom } from "~/atoms/simulation-settings";

async function createOrder(
  clientSecret: string,
  patient: { name: string; rut: string; email: string; phone_number: string },
  totalAmount: number,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({ clientSecret, patient, totalAmount }),
  });
  const body = (await response.json()) as { hash: string; error?: string; detail?: string | unknown[] };
  if (!response.ok) {
    const detail = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
    throw new Error(`Failed to create order (${response.status}): ${detail ?? body.error ?? "unknown"}`);
  }
  return body.hash;
}

function AppointmentConfirmation() {
  const [patient] = useAtom(patientAtom);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [, setShowSettingsModal] = useAtom(showModalAtom);
  const { integrationType, publicKey, workflowType, clientSecret, consultaCosto } = usePublicKey();
  const hasInitialized = useRef(false);

  // Stable primitives extracted from patient to avoid object-reference churn
  const patientRut = patient.rut;
  const patientName = patient.name;
  const patientEmail = patient.email;
  const patientPhone = patient.phone_number;
  const patientWantsReimbursement = patient.wantsReimbursement;

  useEffect(() => {
    const isCnpl = workflowType === "cnpl";
    if (!patientWantsReimbursement && !isCnpl) return;

    // ⚠️ These guards MUST come before the hasInitialized check.
    // On SSR, atomWithStorage atoms have empty defaults. The guards return early
    // (without setting the flag) so that when hydration updates the atoms with
    // real values, the effect re-fires and proceeds correctly.
    if (!publicKey) return;
    if (isCnpl && !clientSecret) return;

    // Single-run guard: prevent double-init from Strict Mode or hydration re-renders
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const abortController = new AbortController();

    const initializeGokeiWidget = async () => {
      try {
        const nameParts = patientName.split(" ");
        const surname = nameParts.slice(1).join(" ");
        const firstName = nameParts[0] ?? "";

        const patientData = {
          name: patientName,
          rut: patientRut,
          email: patientEmail,
          phone_number: patientPhone,
        };

        // Parallelize: createOrder (CNPL only) and fetchWidgetToken are independent.
        // Note: if createOrder throws (e.g. SkipPay 4xx), Promise.all rejects and
        // the widget fetch is also abandoned — same behavior as the original sequential code.
        const [orderToken, widgetData] = await Promise.all([
          isCnpl
            ? createOrder(clientSecret, patientData, consultaCosto, abortController.signal)
            : Promise.resolve(undefined),
          fetch(
            `${env.NEXT_PUBLIC_GOKEI_API_URL}/widget?public_key=${publicKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: abortController.signal,
              body: JSON.stringify({
                rut: patientRut,
                user_data: {
                  name: firstName,
                  surname,
                  rut: patientRut,
                  email: patientEmail,
                  phone_number: patientPhone,
                },
              }),
            },
          ).then(async (res) => {
            if (!res.ok) throw new Error(`Widget fetch failed (${res.status})`);
            return res.json() as Promise<GokeiWidgetResponse>;
          }),
        ]);

        if (abortController.signal.aborted) return;

        const url = orderToken
          ? `${widgetData.url}&order_token=${orderToken}`
          : widgetData.url;

        setWidgetUrl(url);
        setIsModalOpen(true);
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") return;
        setWidgetError(error instanceof Error ? error.message : "Error desconocido al inicializar el widget");
      }
    };

    void initializeGokeiWidget();

    return () => {
      abortController.abort();
      // Reset guard on unmount so a fresh mount (e.g., navigating back) re-initializes
      hasInitialized.current = false;
    };
  }, [
    patientWantsReimbursement,
    patientRut,
    patientName,
    patientEmail,
    patientPhone,
    publicKey,
    workflowType,
    clientSecret,
    consultaCosto,
  ]);

  const isCnpl = workflowType === "cnpl";
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const showWidget = patient.wantsReimbursement || isCnpl;

  const errorBanner = widgetError && (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-red-800">Error al inicializar el widget</p>
          <p className="font-mono text-xs text-red-600">{widgetError}</p>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex w-fit items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-200"
          >
            <Settings className="h-3.5 w-3.5" />
            Abrir configuración
          </button>
        </div>
      </div>
    </div>
  );

  if (integrationType === "div") {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-8 rounded-2xl bg-white p-8 shadow-xl">
            <SuccessHeader />
            <AppointmentDetails />
            {errorBanner}
            {showWidget && !widgetError && <DivIframe url={widgetUrl ?? ""} />}
            <NextSteps />
            <ActionButtons />
            <p className="mt-6 text-center text-gray-500">
              ¿Necesita reagendar? Puede modificar su cita hasta 24 horas antes
              de la hora programada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-8 rounded-2xl bg-white p-8 shadow-xl">
            <SuccessHeader />
            <AppointmentDetails />
            {errorBanner}
            {patient.wantsReimbursement && !isCnpl && !widgetError && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                <PiggyBank className="h-5 w-5" />
                Configurar reembolso
              </button>
            )}
            <NextSteps />
            <ActionButtons />
            <p className="mt-6 text-center text-gray-500">
              ¿Necesita reagendar? Puede modificar su cita hasta 24 horas antes
              de la hora programada.
            </p>
          </div>
        </div>
      </div>

      <ModalIframe
        url={widgetUrl ?? ""}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default AppointmentConfirmation;
