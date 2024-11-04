import { useAtom } from "jotai";
import { publicKeyAtom, showModalAtom, integrationTypeAtom } from "~/atoms/simulation-settings";
import { env } from "~/env";

export function usePublicKey() {
  const [integrationType, setintegrationType] = useAtom(integrationTypeAtom);
  const [publicKey, setPublicKey] = useAtom(publicKeyAtom);
  const [showModal, setShowModal] = useAtom(showModalAtom);

  return {
    integrationType,
    setintegrationType,
    publicKey: publicKey ?? env.NEXT_PUBLIC_GOKEI_PUBLIC_KEY,
    setPublicKey,
    showModal,
    setShowModal,
  };
}
