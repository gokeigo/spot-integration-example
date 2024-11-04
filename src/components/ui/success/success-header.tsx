import { CheckCircle } from "lucide-react";

export const SuccessHeader = () => {
  return (
    <div className="space-y-3 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">¡Cita Confirmada!</h1>
      <p className="text-gray-600">
        Su consulta virtual ha sido programada exitosamente
      </p>
    </div>
  );
};

export default SuccessHeader;
