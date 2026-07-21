import { useEffect, useRef, useState } from "react";
import {
  WIDGET_FORM_CLOSE,
  WIDGET_FORM_MOUNT,
  WIDGET_FORM_SUCCESS,
  WIDGET_PAYMENT_SUCCESS,
} from "~/constants/events";

interface ModalIframeProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ModalIframe = ({
  url,
  isOpen,
  onClose,
  onSuccess,
}: ModalIframeProps) => {
  const [loaded, setLoaded] = useState(false);
  // Keep the latest callback without re-subscribing the message listener.
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  function onReceivedMessage(event: MessageEvent) {
    // Check the message source origin as a security measure
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#targetorigin
    const domain = process.env.NEXT_PUBLIC_GOKEI_WIDGET_URL;

    if (event.origin !== domain) {
      return;
    }
    console.log({ event });
    if (event.type === "message") {
      switch (event.data) {
        case WIDGET_FORM_MOUNT:
          break;
        case WIDGET_FORM_CLOSE:
          console.log("The user closed the widget");
          onClose();
          break;
        case WIDGET_FORM_SUCCESS:
        case WIDGET_PAYMENT_SUCCESS:
          onSuccessRef.current?.();
          break;
        default:
          break;
      }
    }
  }
  useEffect(() => {
    // This avoids scrolling on the background when the modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // We listen to the events from the iframe
    window.addEventListener("message", onReceivedMessage);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("message", onReceivedMessage);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Fullscreen on mobile; centered 480px-wide card on sm+ capped to the
  // viewport height so the widget never gets clipped.
  const frameClasses =
    "h-full w-full sm:h-[min(820px,calc(100dvh-2rem))] sm:w-[480px] sm:rounded-lg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative h-full w-full overflow-hidden bg-white sm:h-auto sm:w-auto sm:rounded-lg">
        {!loaded && (
          <div
            className={`absolute inset-0 flex animate-pulse items-center justify-center bg-gray-100 ${frameClasses}`}
          >
            <span className="text-sm text-gray-400">Cargando…</span>
          </div>
        )}
        <iframe
          src={url}
          onLoad={() => setLoaded(true)}
          className={`${frameClasses} ${loaded ? "" : "invisible"}`}
        />
      </div>
    </div>
  );
};

export default ModalIframe;
