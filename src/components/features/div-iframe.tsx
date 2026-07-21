import { useEffect, useRef, useState } from "react";
import {
  WIDGET_FORM_SUCCESS,
  WIDGET_PAYMENT_SUCCESS,
} from "~/constants/events";

interface DivIframeProps {
  url: string | null;
  onSuccess?: () => void;
}

const frameClasses =
  "h-[min(820px,calc(100dvh-2rem))] w-full max-w-[480px] rounded-lg";

export const DivIframe = ({ url, onSuccess }: DivIframeProps) => {
  const [loaded, setLoaded] = useState(false);
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    function onReceivedMessage(event: MessageEvent) {
      const domain = process.env.NEXT_PUBLIC_GOKEI_WIDGET_URL;
      if (event.origin !== domain) return;
      if (
        event.data === WIDGET_FORM_SUCCESS ||
        event.data === WIDGET_PAYMENT_SUCCESS
      ) {
        onSuccessRef.current?.();
      }
    }

    window.addEventListener("message", onReceivedMessage);
    return () => window.removeEventListener("message", onReceivedMessage);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full max-w-[480px]">
        {/* Skeleton stays visible until the widget document finishes loading.
            Avoids a blank box during DNS/TLS + widget boot. */}
        {(!url || !loaded) && (
          <div
            className={`${frameClasses} animate-pulse bg-gray-100 ${url ? "absolute inset-0" : ""}`}
          />
        )}
        {/* Only mount the iframe once we have a real URL. Rendering it with an
            empty src makes the browser load the current page into the iframe. */}
        {url && (
          <iframe
            src={url}
            onLoad={() => setLoaded(true)}
            className={`${frameClasses} ${loaded ? "" : "invisible"}`}
          />
        )}
      </div>
    </div>
  );
};

export default DivIframe;
