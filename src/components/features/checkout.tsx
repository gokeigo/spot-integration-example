import { useState } from "react";
import Link from "next/link";
import { useAtom } from "jotai";
import { CreditCard, Shield, Info } from "lucide-react";
import { env } from "~/env";
import ServiceSummary from "~/components/ui/service-summary";
import { patientAtom } from "~/atoms/patient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { type GokeiIsUserSubscribedResponse } from "~/types/gokei-spot";
import GokeiLogo from "~/assets/skip-logo-icon-purple.svg";
import Image from "next/image";
import { usePublicKey } from "~/hooks/use-public-key";

export const Checkout = () => {
  const [patient, setPatient] = useAtom(patientAtom);
  const { publicKey, reimbursementFee, workflowType } = usePublicKey();
  const [isChecked, setIsChecked] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(
    undefined,
  );

  const basePrice = 75000;
  const platformFee = 5000;
  const isCnpl = workflowType === "cnpl";

  const cnplPayNow = Math.round(basePrice * 0.3);
  const cnplCommission = Math.round(basePrice * 0.7 * 0.07);

  const calculateTotal = () => {
    if (isCnpl) {
      return cnplPayNow + platformFee + cnplCommission;
    }
    let total = basePrice + platformFee;
    if (isChecked && isSubscribed === false) {
      total += reimbursementFee;
    }
    return total;
  };

  const handleCheckboxChange = async () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    setPatient((prev) => ({ ...prev, wantsReimbursement: newCheckedState }));

    if (newCheckedState) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${env.NEXT_PUBLIC_GOKEI_API_URL}/is_user_subscribed?public_key=${publicKey}&rut=${patient.rut}`,
        );
        const data = (await response.json()) as GokeiIsUserSubscribedResponse;
        setIsSubscribed(data.is_subscribed);
      } catch (error) {
        console.error("Error checking subscription:", error);
        setIsSubscribed(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsSubscribed(undefined);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-CL")}`;
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <ServiceSummary />
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Detalles del Pago
        </h2>
        <div className="mb-6 space-y-4">
          {isCnpl ? (
            <>
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-xs text-gray-400">Costo de Consulta</span>
                <span className="text-xs text-gray-400">{formatPrice(basePrice)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 py-3">
                <span className="font-medium text-gray-900">Pagas ahora (30%)</span>
                <span className="text-lg font-semibold text-blue-600">{formatPrice(cnplPayNow)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-xs text-gray-400">Cargo de Plataforma</span>
                <span className="text-xs text-gray-400">{formatPrice(platformFee)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-2">
                <span className="text-xs text-gray-400">Comisión Skip (7% del reembolso)</span>
                <span className="text-xs text-gray-400">{formatPrice(cnplCommission)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between border-b border-gray-100 py-3">
                <span className="text-gray-600">Costo de Consulta</span>
                <span className="font-medium">{formatPrice(basePrice)}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 py-3">
                <span className="text-gray-600">Cargo de Plataforma</span>
                <span className="font-medium">{formatPrice(platformFee)}</span>
              </div>
              {isChecked && (
                <div className="flex justify-between border-b border-gray-100 py-3">
                  <span className="text-gray-600">Servicio de Reembolso</span>
                  <span
                    className={`font-medium ${isLoading ? "animate-pulse rounded bg-gray-200 px-3" : ""}`}
                  >
                    {!isLoading &&
                      (isSubscribed ? (
                        <span className="text-nowrap text-green-600">
                          Gratis - Usuario Skip
                        </span>
                      ) : reimbursementFee === 0 ? (
                        <span className="text-nowrap text-green-600">
                          2 rendiciones gratis
                        </span>
                      ) : (
                        formatPrice(reimbursementFee)
                      ))}
                  </span>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between py-3">
            <span className="font-medium text-gray-900">Total</span>
            <span
              className={`text-lg font-semibold text-blue-600 ${isLoading ? "animate-pulse rounded bg-gray-200 px-3" : ""}`}
            >
              {!isLoading && formatPrice(calculateTotal())}
            </span>
          </div>
        </div>

        <div className="mb-6">
          {isCnpl ? (
            <div className="mb-4 rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-start gap-3">
                <Image
                  src={GokeiLogo as string}
                  alt="Skip Logo"
                  width={64}
                  height={64}
                  unoptimized
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-purple-800">
                    Care Now Pay Later
                  </span>
                  <span className="text-sm text-purple-700">
                    Pagas el 30% ahora. El 70% restante lo pagas cuando tu isapre
                    te reembolse.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="insurance-checkbox"
              className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:bg-gray-50 has-[:checked]:border-purple-500 has-[:checked]:bg-purple-50"
            >
              <input
                type="checkbox"
                id="insurance-checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="mt-6 h-4 w-4 flex-shrink-0 cursor-pointer accent-purple-600"
              />
              <div className="flex flex-col gap-1.5">
                <Image
                  src={GokeiLogo as string}
                  alt="Skip Logo"
                  width={80}
                  height={80}
                  unoptimized
                />
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  Reembolsar automáticamente en mi isapre y seguro(s)
                  <TooltipProvider delayDuration={100}>
                    <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setTooltipOpen(!tooltipOpen)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-sm">
                          <p className="text-sm">
                            Acepto el servicio de reembolsos de Skip, quienes me
                            informarán por email o WhatsApp el status de mi
                            reembolso.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
              </div>
            </label>
          )}

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4 text-green-500" />
              Su pago está protegido y encriptado
            </div>
          </div>
        </div>

        <Link
          href="/success"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <CreditCard className="h-5 w-5" />
          Completar Pago
        </Link>
        <p className="mt-4 text-center text-sm text-gray-500">
          Al continuar, usted acepta nuestros Términos de Servicio y Política de
          Privacidad
        </p>
      </div>
    </div>
  );
};

export default Checkout;
