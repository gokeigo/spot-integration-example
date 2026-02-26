import Link from "next/link";
import Image from "next/image";
import { Settings2, ExternalLink } from "lucide-react";
import { usePublicKey } from "~/hooks/use-public-key";

export const Navbar = () => {
  const { setShowModal } = usePublicKey();
  return (
    <nav className="border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3">
        <Link href="/">
          <Image
            src="/generic-telemedicine-logo.png"
            alt="Logo de Ejemplo de integración Skip Spot"
            width={48}
            height={48}
          />
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <Settings2 className="h-4 w-4" />
            Configuración
          </button>
          <Link
            href="https://gokei.readme.io/"
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            <ExternalLink className="h-4 w-4" />
            Documentación
          </Link>
        </div>
      </div>
    </nav>
  );
};
