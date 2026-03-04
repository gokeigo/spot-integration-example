import { useState, useEffect } from "react";
import { X, RotateCcw } from "lucide-react";
import { useAtom } from "jotai";
import { patientAtom } from "~/atoms/patient";
import { showPatientModalAtom, patientPresetAtom } from "~/atoms/simulation-settings";

const NOT_REGISTERED_DEFAULTS = {
  name: "Natalia Gonzáléz",
  rut: "75858230-2",
  email: "spot@example.com",
  phone_number: "+56 9 1234 5678",
};

const REGISTERED_DEFAULTS = {
  name: "Natalia Becerra Morales",
  rut: "87839572-7",
  email: "natalia@getgokei.com",
  phone_number: "+56 9 1234 5678",
};

function normalizeRut(rut: string): string {
  return rut.replace(/\./g, "").trim();
}

function validateRut(rut: string): { valid: boolean; error?: string } {
  const cleaned = normalizeRut(rut).toLowerCase();

  if (!cleaned) {
    return { valid: false, error: "El RUT es obligatorio." };
  }

  if (!/^\d{7,8}-[0-9k]$/.test(cleaned)) {
    return {
      valid: false,
      error:
        "Formato inválido. Usa XXXXXXXX-D con 7 u 8 dígitos y dígito verificador (0-9 o K).",
    };
  }

  const [digits, verifier] = cleaned.split("-") as [string, string];

  let sum = 0;
  let multiplier = 2;
  for (let i = digits.length - 1; i >= 0; i--) {
    sum += parseInt(digits[i]!) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = 11 - (sum % 11);
  let expected: string;
  if (remainder === 11) expected = "0";
  else if (remainder === 10) expected = "k";
  else expected = String(remainder);

  if (verifier !== expected) {
    return {
      valid: false,
      error: `Dígito verificador incorrecto. El correcto es "${expected.toUpperCase()}".`,
    };
  }

  return { valid: true };
}

export function PatientModal() {
  const [showModal, setShowModal] = useAtom(showPatientModalAtom);
  const [patient, setPatient] = useAtom(patientAtom);
  const [patientPreset] = useAtom(patientPresetAtom);

  const [draftName, setDraftName] = useState(patient.name);
  const [draftEmail, setDraftEmail] = useState(patient.email);
  const [draftRut, setDraftRut] = useState(patient.rut);
  const [draftPhone, setDraftPhone] = useState(patient.phone_number);
  const [rutTouched, setRutTouched] = useState(false);

  useEffect(() => {
    if (showModal) {
      setDraftName(patient.name);
      setDraftEmail(patient.email);
      setDraftRut(patient.rut);
      setDraftPhone(patient.phone_number);
      setRutTouched(false);
    }
  }, [showModal]);

  if (!showModal) return null;

  const rutValidation = validateRut(draftRut);
  const showRutError = rutTouched && !rutValidation.valid;

  const defaults =
    patientPreset === "registered" ? REGISTERED_DEFAULTS : NOT_REGISTERED_DEFAULTS;

  const handleReset = () => {
    setDraftName(defaults.name);
    setDraftEmail(defaults.email);
    setDraftRut(defaults.rut);
    setDraftPhone(defaults.phone_number);
    setRutTouched(false);
  };

  const handleSave = () => {
    setRutTouched(true);
    if (!rutValidation.valid) return;
    setPatient((prev) => ({
      ...prev,
      name: draftName,
      email: draftEmail,
      rut: normalizeRut(draftRut),
      phone_number: draftPhone,
    }));
    setShowModal(false);
  };

  const canSave = !rutTouched || rutValidation.valid;

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
              Simulación Paciente
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Aquí puedes configurar los datos del paciente que quieres simular
              en el flujo Skip Spot
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="ml-4 flex-shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5">
          {/* Name */}
          <section className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-name"
              className="text-sm font-medium text-gray-700"
            >
              Nombre completo
            </label>
            <input
              id="patient-name"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Nombre completo"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </section>

          {/* RUT */}
          <section className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-rut"
              className="text-sm font-medium text-gray-700"
            >
              RUT
            </label>
            <input
              id="patient-rut"
              value={draftRut}
              onChange={(e) => {
                setDraftRut(e.target.value);
                if (rutTouched) setRutTouched(false);
              }}
              onBlur={() => {
                if (draftRut.length > 4) setRutTouched(true);
              }}
              placeholder="12345678-9"
              className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 ${
                showRutError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            {showRutError ? (
              <p className="text-xs text-red-500">{rutValidation.error}</p>
            ) : (
              <p className="text-xs text-gray-400">
                Ejemplo: 12345678-9 o 12.345.678-9 (7 u 8 dígitos + dígito verificador)
              </p>
            )}
          </section>

          {/* Email */}
          <section className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-email"
              className="text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="patient-email"
              type="email"
              value={draftEmail}
              onChange={(e) => setDraftEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </section>

          {/* Phone */}
          <section className="flex flex-col gap-1.5">
            <label
              htmlFor="patient-phone"
              className="text-sm font-medium text-gray-700"
            >
              Teléfono
            </label>
            <input
              id="patient-phone"
              value={draftPhone}
              onChange={(e) => setDraftPhone(e.target.value)}
              placeholder="+56 9 1234 5678"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between gap-2 border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reestablecer
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(false)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
