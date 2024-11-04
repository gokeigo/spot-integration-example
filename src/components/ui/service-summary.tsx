import { Clock, VideoIcon, Stethoscope, ChevronRight } from "lucide-react";

export const ServiceSummary = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Resumen de la Cita
      </h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4 rounded-lg bg-blue-50 p-4">
          <VideoIcon className="mt-1 h-6 w-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900">Consulta por Video</h3>
            <p className="text-gray-600">
              Sesión de 30 minutos con la Dra. Sarah Wilson
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-6">
          <h3 className="mb-4 font-medium text-gray-900">
            Detalles de la Cita
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Mañana, 14:00 hrs. EST</span>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Consulta General</span>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-medium text-gray-900">Qué Incluye:</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-gray-600">
              <ChevronRight className="h-4 w-4 text-green-500" />
              Plataforma de video segura
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <ChevronRight className="h-4 w-4 text-green-500" />
              Receta digital si es necesaria
            </li>
            <li className="flex items-center gap-2 text-gray-600">
              <ChevronRight className="h-4 w-4 text-green-500" />
              Mensajes de seguimiento por 24 horas
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceSummary;
