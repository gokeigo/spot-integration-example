import Link from "next/link";
import Image from "next/image";
import { Settings2, ExternalLink, User } from "lucide-react";
import { usePublicKey } from "~/hooks/use-public-key";
import { useAtom } from "jotai";
import { showPatientModalAtom } from "~/atoms/simulation-settings";

export const Navbar = () => {
  const { setShowModal } = usePublicKey();
  const [, setShowPatientModal] = useAtom(showPatientModalAtom);
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
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <Settings2 className="h-4 w-4 flex-shrink-0" />
            Configuración
          </button>
          <button
            onClick={() => setShowPatientModal(true)}
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <User className="h-4 w-4 flex-shrink-0" />
            Paciente
          </button>
          <Link
            href="https://getskip.readme.io/reference"
            target="_blank"
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            Documentación
          </Link>
        </div>
      </div>
    </nav>
  );
};
