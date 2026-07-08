import Head from "next/head";
import { useAtom } from "jotai";
import { Clock } from "lucide-react";
import { Navbar } from "~/components/layout/navbar";
import GastosConsole from "~/components/features/gastos-console";
import { patientAtom } from "~/atoms/patient";
import { gastosOrderHashAtom } from "~/atoms/simulation-settings";
import { usePublicKey } from "~/hooks/use-public-key";

export default function EnviarGasto() {
  const [patient] = useAtom(patientAtom);
  const [orderHash] = useAtom(gastosOrderHashAtom);
  const { publicKey, workflowType } = usePublicKey();
  const isCnpl = workflowType === "cnpl";

  return (
    <>
      <Head>
        <title>Skip Spot: Enviar gasto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Navbar />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Enviar gasto</h1>
            <p className="mt-1 text-sm text-gray-500">
              Esta ventana simula lo que el prestador debe enviarle a Skip desde
              su propio sistema cuando emite la boleta del paciente. Aquí puedes
              verlo y probarlo para entender qué datos se mandan.
            </p>
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4">
            <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-violet-600" />
            <div className="text-sm text-violet-900">
              <p className="font-medium">Puede ser síncrono o diferido</p>
              <p className="mt-1 leading-relaxed text-violet-800">
                La boleta puede generarse y enviarse{" "}
                <b>apenas se agenda la atención</b> (de forma síncrona) o{" "}
                <b>más tarde</b>, cuando el prestador la emite. Skip la asocia
                al beneficiario ya registrado en cualquiera de los dos momentos.
              </p>
            </div>
          </div>

          <GastosConsole
            publicKey={publicKey}
            rut={patient.rut}
            orderHash={orderHash ?? undefined}
            isCnpl={isCnpl}
          />
        </div>
      </main>
    </>
  );
}
