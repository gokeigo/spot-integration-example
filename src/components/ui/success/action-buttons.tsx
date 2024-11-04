import { Calendar, MessageCircle } from "lucide-react";

export const ActionButtons = () => {
  return (
    <div className="flex flex-col gap-4 pt-4 sm:flex-row">
      <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
        <Calendar className="h-5 w-5" />
        Agregar al Calendario
      </button>
      <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50">
        <MessageCircle className="h-5 w-5" />
        Contactar Soporte
      </button>
    </div>
  );
};

export default ActionButtons;
