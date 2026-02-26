import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { usePublicKey } from "~/hooks/use-public-key";
import { patientAtom } from "~/atoms/patient";
import { useAtom } from "jotai";

export function PublicKeyModal() {
  const {
    integrationType,
    setintegrationType,
    publicKey,
    showModal,
    setShowModal,
    setPublicKey,
    reimbursementFee,
    setReimbursementFee,
  } = usePublicKey();
  const [patient, setPatient] = useAtom(patientAtom);
  const alreadyRegisteredRut = "3367999-7";
  const notRegisteredRut = "11111111-k";

  const [draftKey, setDraftKey] = useState(publicKey);
  const [draftPatientRut, setDraftPatientRut] = useState(patient.rut);
  const [draftIntegrationType, setDraftIntegrationType] =
    useState(integrationType);
  const [draftReimbursementFee, setDraftReimbursementFee] =
    useState(reimbursementFee);

  useEffect(() => {
    if (showModal) {
      setDraftKey(publicKey);
      setDraftPatientRut(patient.rut);
      setDraftIntegrationType(integrationType);
      setDraftReimbursementFee(reimbursementFee);
    }
  }, [showModal, publicKey, patient.rut, integrationType, reimbursementFee]);

  if (!showModal) return null;

  const handleSave = () => {
    setPublicKey(draftKey);
    setPatient((prev) => ({ ...prev, rut: draftPatientRut }));
    setintegrationType(draftIntegrationType);
    setReimbursementFee(draftReimbursementFee);
    setShowModal(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    >
      <div
        className="flex w-full max-w-md flex-col gap-0 rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Configuración del ejemplo
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Ajusta los parámetros de la simulación.
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="ml-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          {/* Public key */}
          <section className="flex flex-col gap-1.5">
            <label
              htmlFor="public-key-input"
              className="text-sm font-medium text-gray-700"
            >
              Llave pública de Skip Spot
            </label>
            <input
              id="public-key-input"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="pk_..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </section>

          <div className="border-t border-gray-100" />

          {/* Patient type */}
          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              Tipo de paciente
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  id="patient-type-1"
                  name="patient-type"
                  checked={draftPatientRut === alreadyRegisteredRut}
                  onChange={() => setDraftPatientRut(alreadyRegisteredRut)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  No registrado en Skip
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  id="patient-type-2"
                  name="patient-type"
                  checked={draftPatientRut === notRegisteredRut}
                  onChange={() => setDraftPatientRut(notRegisteredRut)}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Registrado en Skip
                </span>
              </label>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Integration type */}
          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              Tipo de integración
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  id="simulation-type-1"
                  name="simulation-type"
                  checked={draftIntegrationType === "modal"}
                  onChange={() => setDraftIntegrationType("modal")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">Modal</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  id="simulation-type-2"
                  name="simulation-type"
                  checked={draftIntegrationType === "div"}
                  onChange={() => setDraftIntegrationType("div")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">Div directo</span>
              </label>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Reimbursement fee */}
          <section className="flex flex-col gap-1.5">
            <label
              htmlFor="reimbursement-fee-input"
              className="text-sm font-medium text-gray-700"
            >
              Costo del servicio de reembolso
            </label>
            <p className="text-xs text-gray-400">Monto en pesos (CLP)</p>
            <input
              id="reimbursement-fee-input"
              type="number"
              value={draftReimbursementFee}
              onChange={(e) => setDraftReimbursementFee(Number(e.target.value))}
              min={0}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            onClick={() => setShowModal(false)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
