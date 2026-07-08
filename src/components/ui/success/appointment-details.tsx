import { useAtomValue } from "jotai";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import {
  DEFAULT_APPOINTMENT,
  selectedAppointmentAtom,
} from "~/atoms/appointment";

export const AppointmentDetails = () => {
  const appointment =
    useAtomValue(selectedAppointmentAtom) ?? DEFAULT_APPOINTMENT;
  const isVideo = appointment.modality === "video";

  return (
    <div className="space-y-4 rounded-xl bg-blue-50 p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
        {isVideo ? (
          <Video className="h-5 w-5 text-blue-600" />
        ) : (
          <MapPin className="h-5 w-5 text-blue-600" />
        )}
        {isVideo
          ? "Detalles de la Consulta Virtual"
          : "Detalles de la Consulta Presencial"}
      </h2>

      <p className="text-sm text-gray-600">
        {appointment.specialtyLabel} con {appointment.doctorName}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <Calendar className="mt-1 h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">Fecha</p>
            <p className="text-gray-600">{appointment.dateLabel}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-1 h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">Hora</p>
            <p className="text-gray-600">{appointment.time} hrs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
