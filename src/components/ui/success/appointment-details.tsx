import { Calendar, Clock, Video } from "lucide-react";

export const AppointmentDetails = () => {
  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + 1);
  return (
    <div className="space-y-4 rounded-xl bg-blue-50 p-6">
      <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
        <Video className="h-5 w-5 text-blue-600" />
        Detalles de la Consulta Virtual
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex items-start gap-3">
          <Calendar className="mt-1 h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">Fecha</p>
            <p className="text-gray-600">
              {appointmentDate.toLocaleDateString("es-CL", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="mt-1 h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">Hora</p>
            <p className="text-gray-600">14:30 hrs. EST</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
