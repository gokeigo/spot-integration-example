import Head from "next/head";
import { Navbar } from "~/components/layout/navbar";
import AppointmentConfirmation from "~/components/features/appointment-confirmation";

export default function Success() {
  return (
    <>
      <Head>
        <title>Gokei Spot: Éxito!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <AppointmentConfirmation />
      </main>
    </>
  );
}
