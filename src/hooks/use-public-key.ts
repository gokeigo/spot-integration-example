import { useAtom } from "jotai";
import { publicKeyAtom, showModalAtom, integrationTypeAtom, reimbursementFeeAtom } from "~/atoms/simulation-settings";
import { env } from "~/env";

export function usePublicKey() {
  const [integrationType, setintegrationType] = useAtom(integrationTypeAtom);
  const [publicKey, setPublicKey] = useAtom(publicKeyAtom);
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [reimbursementFee, setReimbursementFee] = useAtom(reimbursementFeeAtom);

  return {
    integrationType,
    setintegrationType,
    publicKey: publicKey ?? env.NEXT_PUBLIC_GOKEI_PUBLIC_KEY,
    setPublicKey,
    showModal,
    setShowModal,
    reimbursementFee,
    setReimbursementFee,
  };
}
