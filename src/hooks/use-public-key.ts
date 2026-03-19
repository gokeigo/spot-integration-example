import { useAtom } from "jotai";
import { publicKeyAtom, showModalAtom, integrationTypeAtom, reimbursementFeeAtom, workflowTypeAtom, clientSecretAtom, cnplSkipCommissionPercentAtom, consultaCostoAtom } from "~/atoms/simulation-settings";
import { env } from "~/env";

export function usePublicKey() {
  const [integrationType, setintegrationType] = useAtom(integrationTypeAtom);
  const [publicKey, setPublicKey] = useAtom(publicKeyAtom);
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [reimbursementFee, setReimbursementFee] = useAtom(reimbursementFeeAtom);
  const [workflowType, setWorkflowType] = useAtom(workflowTypeAtom);
  const [clientSecret, setClientSecret] = useAtom(clientSecretAtom);
  const [cnplSkipCommissionPercent, setCnplSkipCommissionPercent] = useAtom(cnplSkipCommissionPercentAtom);
  const [consultaCosto, setConsultaCosto] = useAtom(consultaCostoAtom);

  return {
    integrationType,
    setintegrationType,
    publicKey: publicKey ?? env.NEXT_PUBLIC_GOKEI_PUBLIC_KEY,
    setPublicKey,
    showModal,
    setShowModal,
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
  };
}
