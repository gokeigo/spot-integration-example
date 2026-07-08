import { useAtomValue } from "jotai";
import {
  Calendar,
  ChevronRight,
  Clock,
  MapPin,
  Stethoscope,
  VideoIcon,
} from "lucide-react";
import {
  DEFAULT_APPOINTMENT,
  selectedAppointmentAtom,
} from "~/atoms/appointment";

export const ServiceSummary = () => {
  const appointment =
    useAtomValue(selectedAppointmentAtom) ?? DEFAULT_APPOINTMENT;
  const isVideo = appointment.modality === "video";

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Resumen de la Cita
      </h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4 rounded-lg bg-blue-50 p-4">
          {isVideo ? (
            <VideoIcon className="mt-1 h-6 w-6 text-blue-600" />
          ) : (
            <MapPin className="mt-1 h-6 w-6 text-blue-600" />
          )}
          <div>
            <h3 className="font-medium text-gray-900">
              {isVideo ? "Consulta por Video" : "Consulta Presencial"}
            </h3>
            <p className="text-gray-600">
              Sesión de {appointment.duration} minutos con{" "}
              {appointment.doctorName}
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h3 className="mb-4 font-medium text-gray-900">
            Detalles de la Cita
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">{appointment.dateLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">{appointment.time} hrs.</span>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">
                {appointment.specialtyLabel}
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-medium text-gray-900">Qué Incluye:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-600">
              <ChevronRight className="h-4 w-4 text-green-500" />
              {isVideo
                ? "Plataforma de video segura"
                : "Atención en Centro Médico Telehealth, Providencia"}
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <ChevronRight className="h-4 w-4 text-green-500" />
              Receta digital si es necesaria
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <ChevronRight className="h-4 w-4 text-green-500" />
              Boleta electrónica reembolsable
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceSummary;
