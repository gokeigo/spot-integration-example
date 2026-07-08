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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative rounded-lg bg-white">
        {!loaded && (
          <div className="absolute inset-0 flex h-[820px] w-80 animate-pulse items-center justify-center rounded-lg bg-gray-100 sm:w-[480px]">
            <span className="text-sm text-gray-400">Cargando…</span>
          </div>
        )}
        <iframe
          src={url}
          onLoad={() => setLoaded(true)}
          className={`h-[820px] w-80 rounded-lg sm:w-[480px] ${loaded ? "" : "invisible"}`}
        />
      </div>
    </div>
  );
};

export default ModalIframe;
