import { useEffect } from "react";

interface ModalIframeProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ModalIframe = ({ url, isOpen, onClose }: ModalIframeProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative rounded-lg bg-white">
        <iframe src={url} className="h-[820px] w-80 rounded-lg" />
        <button
          onClick={onClose}
          className="absolute -right-4 -top-4 rounded-full bg-gray-800 p-2 text-white shadow-lg hover:bg-gray-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ModalIframe;
