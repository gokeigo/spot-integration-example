import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import SuccessHeader from "~/components/ui/success/success-header";
import AppointmentDetails from "~/components/ui/success/appointment-details";
import NextSteps from "~/components/ui/success/next-steps";
import ActionButtons from "~/components/ui/success/action-buttons";
import { patientAtom } from "~/atoms/patient";
import { env } from "~/env";
import ModalIframe from "./modal-iframe";
import { usePublicKey } from "~/hooks/use-public-key";
import { PiggyBank } from "lucide-react";
import DivIframe from "./div-iframe";
import { type GokeiWidgetResponse } from "~/types/gokei-spot";
import { type CreateOrderResponse } from "~/pages/api/create-order";

async function createOrder(
  clientSecret: string,
  patient: { name: string; rut: string; email: string; phone_number: string },
  totalAmount: number,
): Promise<string> {
  const response = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientSecret, patient, totalAmount }),
  });
  const body = (await response.json()) as CreateOrderResponse & { error?: string; detail?: string };
  if (!response.ok) {
    console.error("[create-order] failed", response.status, body);
    throw new Error(`Failed to create order (${response.status}): ${body.detail ?? body.error ?? "unknown"}`);
  }
  return body.hash;
}

function AppointmentConfirmation() {
  const [patient] = useAtom(patientAtom);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { integrationType, publicKey, workflowType, clientSecret, consultaCosto } = usePublicKey();

  useEffect(() => {
    const initializeGokeiWidget = async () => {
      const isCnpl = workflowType === "cnpl";
      if (!patient.wantsReimbursement && !isCnpl) return;

      try {
        const nameParts = patient.name.split(" ");
        const surname = nameParts.slice(1).join(" ");
        const firstName = nameParts[0] ?? "";

        let orderToken: string | undefined;
        if (isCnpl) {
          orderToken = await createOrder(clientSecret, patient, consultaCosto);
        }

        const response = await fetch(
          `${env.NEXT_PUBLIC_GOKEI_API_URL}/widget?public_key=${publicKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              rut: patient.rut,
              user_data: {
                name: firstName,
                surname,
                rut: patient.rut,
                email: patient.email,
                phone_number: patient.phone_number,
              },
            }),
          },
        );

        if (response.ok) {
          const data = (await response.json()) as GokeiWidgetResponse;
          console.log("Gokei widget initialized:", data);
          const url = orderToken
            ? `${data.url}&order_token=${orderToken}`
            : data.url;
          setWidgetUrl(url);
          setIsModalOpen(true);
        } else {
          console.error("Failed to initialize Gokei widget");
        }
      } catch (error) {
        console.error("Error initializing Gokei widget:", error);
      }
    };

    void initializeGokeiWidget();
  }, [patient, publicKey, workflowType]);

  const isCnpl = workflowType === "cnpl";
  const showWidget = patient.wantsReimbursement || isCnpl;

  if (integrationType === "div") {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-8 rounded-2xl bg-white p-8 shadow-xl">
            <SuccessHeader />
            <AppointmentDetails />
            {showWidget && <DivIframe url={widgetUrl ?? ""} />}
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
            {patient.wantsReimbursement && !isCnpl && (
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
