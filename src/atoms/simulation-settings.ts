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
export const patientPresetAtom = atomWithStorage<"not_registered" | "registered">(
  "patient-preset",
  "not_registered",
);
export const workflowTypeAtom = atomWithStorage<"standard" | "cnpl">(
  "workflow-type",
  "standard",
);
export const clientSecretAtom = atomWithStorage<string>("skipay-client-secret", "");
export const cnplSkipCommissionPercentAtom = atomWithStorage<number>("cnpl-skip-commission-percent", 7);
export const consultaCostoAtom = atomWithStorage<number>("consulta-costo", 14000);
