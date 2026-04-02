import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { X, Info, Eye, EyeOff } from "lucide-react";
import { usePublicKey } from "~/hooks/use-public-key";
import { patientAtom } from "~/atoms/patient";
import { patientPresetAtom } from "~/atoms/simulation-settings";
import { useAtom } from "jotai";
import { generateNotRegisteredPatient } from "~/utils/generate-patient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

const REGISTERED_PRESET = {
  name: "Natalia Becerra Morales",
  rut: "87839572-7",
  email: "natalia@getgokei.com",
  phone_number: "+56 9 1234 5678",
};

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-xs">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

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
    workflowType,
    setWorkflowType,
    clientSecret,
    setClientSecret,
    cnplSkipCommissionPercent,
    setCnplSkipCommissionPercent,
    consultaCosto,
    setConsultaCosto,
  } = usePublicKey();
  const router = useRouter();
  const [, setPatient] = useAtom(patientAtom);
  const [patientPreset, setPatientPreset] = useAtom(patientPresetAtom);

  const [draftWorkflowType, setDraftWorkflowType] = useState<"standard" | "cnpl">(workflowType);
  const [showSecret, setShowSecret] = useState(false);
  const [draftKey, setDraftKey] = useState(publicKey ?? "");
  const [draftClientSecret, setDraftClientSecret] = useState(clientSecret);
  const [draftPatientPreset, setDraftPatientPreset] = useState<"not_registered" | "registered">(patientPreset);
  const [draftIntegrationType, setDraftIntegrationType] = useState(integrationType);
  const [draftReimbursementFee, setDraftReimbursementFee] = useState<number | "">(reimbursementFee === 0 ? 1000 : reimbursementFee);
  const [draftReimbursementMode, setDraftReimbursementMode] = useState<"free_trial" | "paid">(
    reimbursementFee === 0 ? "free_trial" : "paid",
  );
  const [draftCnplSkipCommissionPercent, setDraftCnplSkipCommissionPercent] = useState<number | "">(cnplSkipCommissionPercent);
  const [draftConsultaCosto, setDraftConsultaCosto] = useState<number | "">(consultaCosto);

  const prevShowModalRef = useRef(false);

  const routerPathname = router.pathname;

  useEffect(() => {
    const justOpened = showModal && !prevShowModalRef.current;
    prevShowModalRef.current = showModal;

    if (!justOpened) return;

    setDraftWorkflowType(workflowType);
    setDraftKey(publicKey ?? "");
    setDraftClientSecret(clientSecret);
    setDraftPatientPreset(patientPreset);
    setDraftIntegrationType(integrationType);
    setDraftReimbursementFee(reimbursementFee === 0 ? 1000 : reimbursementFee);
    setDraftReimbursementMode(reimbursementFee === 0 ? "free_trial" : "paid");
    setDraftCnplSkipCommissionPercent(cnplSkipCommissionPercent);
    setDraftConsultaCosto(consultaCosto);

    if (routerPathname !== "/") {
      void router.push("/");
    }
  }, [showModal, workflowType, publicKey, clientSecret, patientPreset, integrationType, reimbursementFee, cnplSkipCommissionPercent, consultaCosto, routerPathname]);

  if (!showModal) return null;

  const isCnpl = draftWorkflowType === "cnpl";
  const isKeyMissing = draftKey.trim() === "";
  const isSecretMissing = isCnpl && draftClientSecret.trim() === "";
  const canSave = !isKeyMissing && !isSecretMissing;

  const handleSave = () => {
    setPublicKey(draftKey);
    setClientSecret(draftClientSecret);
    const preset =
      draftPatientPreset === "not_registered"
        ? generateNotRegisteredPatient()
        : REGISTERED_PRESET;
    setPatient((prev) => ({ ...prev, ...preset }));
    setPatientPreset(draftPatientPreset);
    setintegrationType(draftIntegrationType);
    setReimbursementFee(draftReimbursementMode === "free_trial" ? 0 : (draftReimbursementFee === "" ? 0 : draftReimbursementFee));
    setWorkflowType(draftWorkflowType);
    setCnplSkipCommissionPercent(draftCnplSkipCommissionPercent === "" ? 0 : draftCnplSkipCommissionPercent);
    setConsultaCosto(draftConsultaCosto === "" ? 0 : draftConsultaCosto);
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

          {/* 1. Tipo de flujo */}
          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">Tipo de flujo</p>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="workflow-type"
                  checked={draftWorkflowType === "standard"}
                  onChange={() => setDraftWorkflowType("standard")}
                  className="accent-blue-600"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-700">Spot</span>
                  <span className="text-xs text-gray-400">Registro de paciente para reembolso</span>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="workflow-type"
                  checked={draftWorkflowType === "cnpl"}
                  onChange={() => setDraftWorkflowType("cnpl")}
                  className="accent-blue-600"
                />
                <div className="flex flex-col">
                  <span className="flex items-center gap-2 text-sm text-gray-700">
                    AAPD
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                      Atiéndete Ahora y Paga Después
                    </span>
                  </span>
                  <span className="text-xs text-gray-400">El paciente paga 30% de la boleta y el resto con el reembolso</span>
                </div>
              </label>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* 2. Public key */}
          <section className="flex flex-col gap-1.5">
            <label htmlFor="public-key-input" className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              Llave pública
              <InfoTooltip text="Se utiliza para autenticar las llamadas al widget de Skip Spot y al servicio de reembolso." />
            </label>
            <input
              id="public-key-input"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="PK_..."
              className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 ${
                isKeyMissing
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
              }`}
            />
            {isKeyMissing && <p className="text-xs text-red-500">Este campo es obligatorio.</p>}
          </section>

          {/* 3. Client secret (CNPL only) */}
          {isCnpl && (
            <section className="flex flex-col gap-1.5">
              <label htmlFor="client-secret-input" className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                Client secret
                <InfoTooltip text="Se utiliza en el servidor para crear la orden de pago diferido (CNPL). Nunca se expone al navegador." />
              </label>
              <div className="relative">
                <input
                  id="client-secret-input"
                  type={showSecret ? "text" : "password"}
                  value={draftClientSecret}
                  onChange={(e) => setDraftClientSecret(e.target.value)}
                  placeholder="st_secret_..."
                  className={`w-full rounded-lg border py-2 pl-3 pr-9 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 ${
                    isSecretMissing
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isSecretMissing && <p className="text-xs text-red-500">Este campo es obligatorio para el flujo CNPL.</p>}
            </section>
          )}

          {/* Skip commission % and Costo Consulta (CNPL only) */}
          {isCnpl && (
            <>
              <section className="flex flex-col gap-1.5">
                <label htmlFor="cnpl-commission-input" className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  Comisión Skip (% del costo de consulta)
                  <InfoTooltip text="Porcentaje que Skip cobra sobre el costo de consulta en el flujo Atiéndete Ahora y Paga Después." />
                </label>
                <div className="relative">
                  <input
                    id="cnpl-commission-input"
                    type="number"
                    value={draftCnplSkipCommissionPercent}
                    onChange={(e) => setDraftCnplSkipCommissionPercent(e.target.value === "" ? "" : Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.1}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-8 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
                </div>
              </section>

              <section className="flex flex-col gap-1.5">
                <label htmlFor="consulta-costo-input" className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                  Costo Consulta (CLP)
                  <InfoTooltip text="Monto de la consulta. Se usa para calcular el cobro en el checkout y como monto de la orden CNPL." />
                </label>
                <input
                  id="consulta-costo-input"
                  type="number"
                  value={draftConsultaCosto}
                  onChange={(e) => setDraftConsultaCosto(e.target.value === "" ? "" : Number(e.target.value))}
                  min={1}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </section>
            </>
          )}

          <div className="border-t border-gray-100" />

          {/* 4. Patient type */}
          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">Tipo de paciente</p>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="patient-type"
                  checked={draftPatientPreset === "not_registered"}
                  onChange={() => setDraftPatientPreset("not_registered")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">No registrado en Skip</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="patient-type"
                  checked={draftPatientPreset === "registered"}
                  onChange={() => setDraftPatientPreset("registered")}
                  className="accent-blue-600"
                />
                <span className="text-sm text-gray-700">Registrado en Skip</span>
              </label>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* 5. Integration type */}
          <section className="flex flex-col gap-2">
            <p className="text-sm font-medium text-gray-700">Tipo de integración</p>
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

          {/* 6. Reimbursement mode (Spot only) */}
          {!isCnpl && (
            <>
              <div className="border-t border-gray-100" />

              <section className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-700">Servicio de reembolso</p>
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
                      <span className="text-sm text-gray-700">Costo del servicio de reembolso</span>
                    </div>
                    {draftReimbursementMode === "paid" && (
                      <div className="flex flex-col gap-1 pl-7">
                        <p className="text-xs text-gray-400">Monto en pesos (CLP)</p>
                        <input
                          id="reimbursement-fee-input"
                          type="number"
                          value={draftReimbursementFee}
                          onChange={(e) => setDraftReimbursementFee(e.target.value === "" ? "" : Number(e.target.value))}
                          min={1}
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    )}
                  </label>
                </div>
              </section>
            </>
          )}
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
            disabled={!canSave}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
