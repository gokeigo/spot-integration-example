import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { env } from "~/env";

export const publicKeyAtom = atomWithStorage<string>("gokei-public-key", "");
export const showModalAtom = atom<boolean>(true);
export const integrationTypeAtom = atomWithStorage<string>(
  "gokei-integration-type",
  "modal",
);
export const reimbursementFeeAtom = atomWithStorage<number>(
  "gokei-reimbursement-fee",
  1000,
);
