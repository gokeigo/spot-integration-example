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

function AppointmentConfirmation() {
  const [patient] = useAtom(patientAtom);
  const [widgetUrl, setWidgetUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { integrationType, publicKey } = usePublicKey();

  useEffect(() => {
    const initializeGokeiWidget = async () => {
      if (patient.wantsReimbursement) {
        try {
          const nameParts = patient.name.split(" ");
          const surname = nameParts.slice(1).join(" ");
          const firstName = nameParts[0];

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
            setWidgetUrl(data.url);
            setIsModalOpen(true);
          } else {
            console.error("Failed to initialize Gokei widget");
          }
        } catch (error) {
          console.error("Error initializing Gokei widget:", error);
        }
      }
    };

    void initializeGokeiWidget();
  }, [patient, publicKey]);

  if (integrationType === "div") {
    return (
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-8 rounded-2xl bg-white p-8 shadow-xl">
            <SuccessHeader />
            <AppointmentDetails />
            {patient.wantsReimbursement && <DivIframe url={widgetUrl ?? ""} />}
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
            {patient.wantsReimbursement && (
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
