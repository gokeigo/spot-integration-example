export const NextSteps = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Próximos Pasos</h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <span className="font-medium text-blue-600">1</span>
          </div>
          <p className="text-gray-600">
            Revise su correo electrónico para obtener la confirmación detallada
            e instrucciones para unirse a la consulta virtual.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <span className="font-medium text-blue-600">2</span>
          </div>
          <p className="text-gray-600">
            Complete los formularios previos a la cita enviados a su correo al
            menos 1 hora antes de la consulta.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
            <span className="font-medium text-blue-600">3</span>
          </div>
          <p className="text-gray-600">
            Pruebe su cámara y micrófono antes de la cita utilizando el enlace
            en su correo de confirmación.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NextSteps;
