import { atomWithStorage } from "jotai/utils";
import { env } from "~/env";

export const publicKeyAtom = atomWithStorage<string>("gokei-public-key", "");
export const showModalAtom = atomWithStorage<boolean>(
  "gokei-show-modal",
  !env.NEXT_PUBLIC_GOKEI_PUBLIC_KEY,
);
export const integrationTypeAtom = atomWithStorage<string>(
  "gokei-integration-type",
  "modal",
);
