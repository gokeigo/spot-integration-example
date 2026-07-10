import { useCallback, useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import SuccessHeader from "~/components/ui/success/success-header";
import AppointmentDetails from "~/components/ui/success/appointment-details";
import NextSteps from "~/components/ui/success/next-steps";
import ActionButtons from "~/components/ui/success/action-buttons";
import { patientAtom } from "~/atoms/patient";
import { env } from "~/env";
import ModalIframe from "./modal-iframe";
import { usePublicKey } from "~/hooks/use-public-key";
import { isCnplMetaProviderPublicKey } from "~/lib/provider-config";
import { PiggyBank, AlertTriangle, Settings } from "lucide-react";
import DivIframe from "./div-iframe";
import { type GokeiWidgetResponse } from "~/types/gokei-spot";
import {
  showModalAtom,
  patientPresetAtom,
  gastosUnlockedAtom,
  gastosOrderHashAtom,
} from "~/atoms/simulation-settings";

async function createOrder(
  patient: { name: string; rut: string; email: string; phone_number: string },
  totalAmount: number,
  clientSecret?: string,
  providerRut?: string,
  signal?: AbortSignal,
): Promise<string> {
  const trimmedClientSecret = clientSecret?.trim();
  const trimmedProviderRut = providerRut?.trim();

  const parseErrorBody = async (response: Response) => {
    const text = await response.text();
    if (!text) return undefined;

    try {
      const parsed = JSON.parse(text) as {
        error?: string;
        detail?: string | unknown[];
      };
      return typeof parsed.detail === "string"
        ? parsed.detail
        : parsed.detail
          ? JSON.stringify(parsed.detail)
          : parsed.error;
    } catch {
      return text;
    }
  };

  const response = await fetch(`/api/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      patient,
      totalAmount,
      clientSecret: trimmedClientSecret,
      providerRut: trimmedProviderRut,
    }),
  });

  if (!response.ok) {
    const detail = await parseErrorBody(response);
    throw new Error(
      `Failed to create order via API route (${response.status}): ${detail ?? "unknown"}`,
    );
  }

  const body = (await response.json()) as { hash: string };
  return body.hash;
}

async function fetchWidgetData({
  apiUrl,
  publicKey,
  patient,
  signal,
  orderToken,
}: {
  apiUrl: string | undefined;
  publicKey: string;
  patient: { rut: string; name: string; email: string; phone_number: string };
  signal?: AbortSignal;
  orderToken?: string;
}): Promise<GokeiWidgetResponse> {
  const nameParts = patient.name.split(" ");
  const firstName = nameParts[0] ?? "";
  const surname = nameParts.slice(1).join(" ");

  const response = await fetch(`${apiUrl}/widget?public_key=${publicKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      rut: patient.rut,
      user_data: {
        name: firstName,
        surname,
        rut: patient.rut,
        email: patient.email,
        phone_number: patient.phone_number,
      },
      ...(orderToken ? { order_token: orderToken } : {}),
    }),
  });

  if (!response.ok) {
    throw new Error(`Widget fetch failed (${response.status})`);
  }

  return response.json() as Promise<GokeiWidgetResponse>;
}

function AppointmentConfirmation() {
  const [patient] = useAtom(patientAtom);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const [, setShowSettingsModal] = useAtom(showModalAtom);
  const [patientPreset] = useAtom(patientPresetAtom);
  const [, setGastosUnlocked] = useAtom(gastosUnlockedAtom);
  const [, setGastosOrderHash] = useAtom(gastosOrderHashAtom);
  const {
    integrationType,
    publicKey,
    workflowType,
    clientSecret,
    providerRut,
    consultaCosto,
  } = usePublicKey();
  const hasInitialized = useRef(false);
  const trimmedClientSecret = clientSecret.trim();
  const trimmedProviderRut = providerRut.trim();

  // Stable primitives extracted from patient to avoid object-reference churn
  const patientRut = patient.rut;
  const patientName = patient.name;
  const patientEmail = patient.email;
  const patientPhone = patient.phone_number;
  const patientWantsReimbursement = patient.wantsReimbursement;

  useEffect(() => {
    const isCnpl = workflowType === "cnpl";
    const isMetaProvider = isCnplMetaProviderPublicKey(publicKey);
    // The authorization is given via the checkout checkbox in both flows:
    // Spot (reimbursement service) and CNPL/AAPD (30/70 split). Without it,
    // no SkipPay order is created and the widget is not initialized.
    if (!patientWantsReimbursement) return;

    // ⚠️ These guards MUST come before the hasInitialized check.
    // On SSR, atomWithStorage atoms have empty defaults. The guards return early
    // (without setting the flag) so that when hydration updates the atoms with
    // real values, the effect re-fires and proceeds correctly.
    if (!publicKey) return;
    if (isCnpl && !trimmedClientSecret) return;
    if (isCnpl && isMetaProvider && !trimmedProviderRut) return;

    // Single-run guard: prevent double-init from Strict Mode or hydration re-renders
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const abortController = new AbortController();

    const initializeGokeiWidget = async () => {
      try {
        const patientData = {
          name: patientName,
          rut: patientRut,
          email: patientEmail,
          phone_number: patientPhone,
        };

        const orderToken = isCnpl
          ? await createOrder(
              patientData,
              consultaCosto,
              trimmedClientSecret || undefined,
              isMetaProvider ? trimmedProviderRut || undefined : undefined,
              abortController.signal,
            )
          : undefined;

        setGastosOrderHash(orderToken ?? null);

        const widgetData = await fetchWidgetData({
          apiUrl: env.NEXT_PUBLIC_GOKEI_API_URL,
          publicKey,
          patient: patientData,
          signal: abortController.signal,
          orderToken,
        });

        if (abortController.signal.aborted) return;

        setWidgetUrl(widgetData.url);
        setIsModalOpen(true);
      } catch (error) {
        if ((error as { name?: string }).name === "AbortError") return;
        setWidgetError(
          error instanceof Error
            ? error.message
            : "Error desconocido al inicializar el widget",
        );
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
    trimmedClientSecret,
    trimmedProviderRut,
    consultaCosto,
  ]);

  // A "registered" preset is already a beneficiary, so the gastos step can be
  // exercised without completing the widget first.
  useEffect(() => {
    if (patientPreset === "registered") setGastosUnlocked(true);
  }, [patientPreset, setGastosUnlocked]);

  const handleWidgetSuccess = useCallback(
    () => setGastosUnlocked(true),
    [setGastosUnlocked],
  );

  const isCnpl = workflowType === "cnpl";
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const showWidget = patient.wantsReimbursement || isCnpl;

  const errorBanner = widgetError && (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-red-800">
            Error al inicializar el widget
          </p>
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
            {showWidget && !widgetError && (
              <DivIframe url={widgetUrl} onSuccess={handleWidgetSuccess} />
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
        onSuccess={handleWidgetSuccess}
      />
    </>
  );
}

export default AppointmentConfirmation;
