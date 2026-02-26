import Head from "next/head";
import { Navbar } from "~/components/layout/navbar";
import { Checkout } from "~/components/features/checkout";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ejemplo de integración Skip Spot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8">
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
