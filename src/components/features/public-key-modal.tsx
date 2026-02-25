import { useState, useEffect } from "react";
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
  } = usePublicKey();
  const [patient, setPatient] = useAtom(patientAtom);
  const alreadyRegisteredRut = "3367999-7";
  const notRegisteredRut = "11111111-k";

  const [draftKey, setDraftKey] = useState(publicKey);
  const [draftPatientRut, setDraftPatientRut] = useState(patient.rut);
  const [draftIntegrationType, setDraftIntegrationType] =
    useState(integrationType);

  useEffect(() => {
    if (showModal) {
      setDraftKey(publicKey);
      setDraftPatientRut(patient.rut);
      setDraftIntegrationType(integrationType);
    }
  }, [showModal, publicKey, patient.rut, integrationType]);

  if (!showModal) return null;

  const handleSave = () => {
    setPublicKey(draftKey);
    setPatient((prev) => ({ ...prev, rut: draftPatientRut }));
    setintegrationType(draftIntegrationType);
    setShowModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
        <section>
          <h2 className="text-xl font-bold">Ingrese su llave pública</h2>
          <p className="pb-4 text-gray-500">
            Por favor, ingrese su llave pública de Skip Spot para continuar.
          </p>
          <div className="flex items-center gap-4">
            <input
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              className="border p-2"
            />
          </div>
        </section>

        <section>
          <h2 className="pb-2 text-xl font-bold">Tipo de paciente:</h2>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              id="patient-type-1"
              name="patient-type"
              checked={draftPatientRut === alreadyRegisteredRut}
              onChange={() => setDraftPatientRut(alreadyRegisteredRut)}
              className="border p-2"
            />
            <label htmlFor="patient-type-1" className="text-gray-600">
              Usuario registrado en Skip
            </label>
            <input
              type="radio"
              id="patient-type-2"
              name="patient-type"
              checked={draftPatientRut === notRegisteredRut}
              onChange={() => setDraftPatientRut(notRegisteredRut)}
              className="border p-2"
            />
            <label htmlFor="patient-type-2" className="text-gray-600">
              Usuario no registrado en Skip
            </label>
          </div>
        </section>

        <section>
          <h2 className="pb-2 text-xl font-bold">Tipo de integración:</h2>
          <div className="flex items-center gap-4">
            <input
              type="radio"
              id="simulation-type-1"
              name="simulation-type"
              checked={draftIntegrationType === "modal"}
              onChange={() => setDraftIntegrationType("modal")}
              className="border p-2"
            />
            <label htmlFor="simulation-type-1" className="text-gray-600">
              Modal
            </label>
            <input
              type="radio"
              id="simulation-type-2"
              name="simulation-type"
              checked={draftIntegrationType === "div"}
              onChange={() => setDraftIntegrationType("div")}
              className="border p-2"
            />
            <label htmlFor="simulation-type-2" className="text-gray-600">
              Div directo
            </label>
          </div>
        </section>

        <button
          onClick={handleSave}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
