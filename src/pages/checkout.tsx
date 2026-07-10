import Head from "next/head";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import { Checkout } from "~/components/features/checkout";

export default function CheckoutPage() {
  return (
    <>
      <Head>
        <title>Checkout | Centro Médico Telehealth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a las horas disponibles
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="mt-1 text-sm text-gray-500">
              Ejemplo de integración de Skip Spot en un flujo de pago
            </p>
          </div>
          <Checkout />
        </div>
      </main>
    </>
  );
}
