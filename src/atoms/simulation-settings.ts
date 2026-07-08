import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const publicKeyAtom = atomWithStorage<string>("gokei-public-key", "");
export const showModalAtom = atom<boolean>(true);
export const showPatientModalAtom = atom<boolean>(false);
export const integrationTypeAtom = atomWithStorage<string>(
  "gokei-integration-type",
  "modal",
);
export const reimbursementFeeAtom = atomWithStorage<number>(
  "gokei-reimbursement-fee",
  1000,
);
export const patientPresetAtom = atomWithStorage<
  "not_registered" | "registered"
>("patient-preset", "not_registered");
export const workflowTypeAtom = atomWithStorage<"standard" | "cnpl">(
  "workflow-type",
  "standard",
);
export const clientSecretAtom = atomWithStorage<string>(
  "skipay-client-secret",
  "",
);
export const providerRutAtom = atomWithStorage<string>("provider-rut", "");
export const cnplSkipCommissionPercentAtom = atomWithStorage<number>(
  "cnpl-skip-commission-percent",
  7,
);
export const consultaCostoAtom = atomWithStorage<number>(
  "consulta-costo",
  14000,
);

// Unlocks the "Enviar gasto" navbar action once the widget reports success
// (WIDGET_FORM_SUCCESS / WIDGET_PAYMENT_SUCCESS) or the patient is already
// registered. In-memory: resets on full reload, like patientAtom.
export const gastosUnlockedAtom = atom<boolean>(false);

// Real SkipPay order hash from the CNPL flow, used to prefill skip_pay_order_id
// on the gastos page.
export const gastosOrderHashAtom = atom<string | null>(null);
