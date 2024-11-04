import SuccessHeader from "~/components/ui/success/success-header";
import AppointmentDetails from "~/components/ui/success/appointment-details";
import NextSteps from "~/components/ui/success/next-steps";
import ActionButtons from "~/components/ui/success/action-buttons";

function AppointmentConfirmation() {
  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <div className="space-y-8 rounded-2xl bg-white p-8 shadow-xl">
          <SuccessHeader />
          <AppointmentDetails />
          <NextSteps />
          <ActionButtons />
          <p className="mt-6 text-center text-gray-500">
            ¿Necesita reagendar? Puede modificar su cita hasta 24 horas antes de
            la hora programada.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AppointmentConfirmation;
