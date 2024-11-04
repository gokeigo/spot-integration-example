import Link from "next/link";
import { CreditCard, Shield } from "lucide-react";
import ServiceSummary from "~/components/ui/service-summary";

export const Checkout = () => {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <ServiceSummary />
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Detalles del Pago
        </h2>
        <div className="mb-6 space-y-4">
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Costo de Consulta</span>
            <span className="font-medium">$75.000</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Cargo de Plataforma</span>
            <span className="font-medium">$5.000</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-medium text-gray-900">Total</span>
            <span className="text-lg font-semibold text-blue-600">$80.000</span>
          </div>
        </div>
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500" />
            Su pago está protegido y encriptado
          </div>
        </div>
        <Link
          href="/success"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <CreditCard className="h-5 w-5" />
          Completar Pago
        </Link>
        <p className="mt-4 text-center text-sm text-gray-500">
          Al continuar, usted acepta nuestros Términos de Servicio y Política de
          Privacidad
        </p>
      </div>
    </div>
  );
};

export default Checkout;
