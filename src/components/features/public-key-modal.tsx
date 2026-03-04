import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { X } from "lucide-react";
import { usePublicKey } from "~/hooks/use-public-key";
import { patientAtom } from "~/atoms/patient";
import { patientPresetAtom } from "~/atoms/simulation-settings";
import { useAtom } from "jotai";

const NOT_REGISTERED_PRESET = {
  name: "Natalia Gonzáléz",
  rut: "75858230-2",
  email: "spot@example.com",
  phone_number: "+56 9 1234 5678",
};

const REGISTERED_PRESET = {
  name: "Natalia Becerra Morales",
  rut: "87839572-7",
  email: "natalia@getgokei.com",
  phone_number: "+56 9 1234 5678",
};

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
  const router = useRouter();
  const [patient, setPatient] = useAtom(patientAtom);
  const [patientPreset, setPatientPreset] = useAtom(patientPresetAtom);

  const [draftKey, setDraftKey] = useState(publicKey);
  const [draftPatientPreset, setDraftPatientPreset] = useState<
    "not_registered" | "registered"
  >(patientPreset);
  const [draftIntegrationType, setDraftIntegrationType] =
    useState(integrationType);
  const [draftReimbursementFee, setDraftReimbursementFee] =
    useState(reimbursementFee === 0 ? 1000 : reimbursementFee);
  const [draftReimbursementMode, setDraftReimbursementMode] = useState<
    "free_trial" | "paid"
  >(reimbursementFee === 0 ? "free_trial" : "paid");

  useEffect(() => {
    if (showModal) {
      setDraftKey(publicKey);
      setDraftPatientPreset(patientPreset);
      setDraftIntegrationType(integrationType);
      setDraftReimbursementFee(reimbursementFee === 0 ? 1000 : reimbursementFee);
      setDraftReimbursementMode(reimbursementFee === 0 ? "free_trial" : "paid");
      if (router.pathname !== "/") {
        void router.push("/");
      }
    }
  }, [showModal, publicKey, patientPreset, integrationType, reimbursementFee]);

  if (!showModal) return null;

  const handleSave = () => {
    setPublicKey(draftKey);
    const preset =
      draftPatientPreset === "not_registered"
        ? NOT_REGISTERED_PRESET
        : REGISTERED_PRESET;
    setPatient((prev) => ({ ...prev, ...preset }));
    setPatientPreset(draftPatientPreset);
    setintegrationType(draftIntegrationType);
    setReimbursementFee(
      draftReimbursementMode === "free_trial" ? 0 : draftReimbursementFee,
    );
    setShowModal(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-md flex-col rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-start justify-between border-b border-gray-100 px-6 py-5">
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
            className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
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
              className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 ${
                draftKey.trim() === ""
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            {draftKey.trim() === "" && (
              <p className="text-xs text-red-500">Este campo es obligatorio.</p>
            )}
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
                  name="patient-type"
                  checked={draftPatientPreset === "not_registered"}
                  onChange={() => setDraftPatientPreset("not_registered")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">
                  No registrado en Skip
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="patient-type"
                  checked={draftPatientPreset === "registered"}
                  onChange={() => setDraftPatientPreset("registered")}
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

          {/* Reimbursement mode */}
          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">
              Servicio de reembolso
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="reimbursement-mode"
                  checked={draftReimbursementMode === "free_trial"}
                  onChange={() => setDraftReimbursementMode("free_trial")}
                  className="accent-blue-600"
                />
                <span className="flex items-center gap-2 text-sm text-gray-700">
                  2 rendiciones gratis
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Prueba gratis
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="reimbursement-mode"
                    checked={draftReimbursementMode === "paid"}
                    onChange={() => setDraftReimbursementMode("paid")}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-gray-700">
                    Costo del servicio de reembolso
                  </span>
                </div>
                {draftReimbursementMode === "paid" && (
                  <div className="flex flex-col gap-1 pl-7">
                    <p className="text-xs text-gray-400">Monto en pesos (CLP)</p>
                    <input
                      id="reimbursement-fee-input"
                      type="number"
                      value={draftReimbursementFee}
                      onChange={(e) =>
                        setDraftReimbursementFee(Number(e.target.value))
                      }
                      min={1}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                )}
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 justify-end gap-2 border-t border-gray-100 px-6 py-4">
          <button
            onClick={() => setShowModal(false)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={draftKey.trim() === ""}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
