import Link from "next/link";
import Image from "next/image";
import { Settings2, ExternalLink, User, Receipt } from "lucide-react";
import { usePublicKey } from "~/hooks/use-public-key";
import { useAtom } from "jotai";
import {
  showPatientModalAtom,
  gastosUnlockedAtom,
} from "~/atoms/simulation-settings";

interface NavbarProps {
  showLandingLinks?: boolean;
}

export const Navbar = ({ showLandingLinks = false }: NavbarProps) => {
  const { setShowModal } = usePublicKey();
  const [, setShowPatientModal] = useAtom(showPatientModalAtom);
  const [gastosUnlocked] = useAtom(gastosUnlockedAtom);
  return (
    <nav className="border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/generic-telemedicine-logo.png"
              alt="Logo de Ejemplo de integración Skip Spot"
              width={48}
              height={48}
            />
            <span className="hidden text-sm font-semibold text-gray-900 md:block">
              Centro Médico Telehealth
            </span>
          </Link>
          {showLandingLinks && (
            <div className="hidden items-center gap-4 lg:flex">
              <Link
                href="#especialidades"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Especialidades
              </Link>
              <Link
                href="#resultados"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Horas disponibles
              </Link>
              <Link
                href="#beneficios"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                Beneficios
              </Link>
            </div>
          )}
        </div>
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
            href="https://docs.getskip.ai"
            target="_blank"
            className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:gap-1.5 sm:px-3 sm:text-sm"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            Documentación
          </Link>
          {gastosUnlocked && (
            <Link
              href="/enviar-gasto"
              className="flex items-center gap-1 rounded-lg bg-violet-600 px-2 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-violet-700 sm:gap-1.5 sm:px-3 sm:text-sm"
            >
              <Receipt className="h-4 w-4 flex-shrink-0" />
              Enviar gasto
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
