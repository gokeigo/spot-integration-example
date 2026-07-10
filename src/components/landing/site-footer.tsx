import Image from "next/image";
import Link from "next/link";

export const SiteFooter = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-screen-xl px-4 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <Image
                src="/generic-telemedicine-logo.png"
                alt="Centro Médico Telehealth"
                width={36}
                height={36}
              />
              <span className="font-semibold text-gray-900">
                Centro Médico Telehealth
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Plataforma de demostración de un agendador de horas médicas con
              integración Skip Spot.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
            <div>
              <p className="mb-3 font-semibold text-gray-900">Pacientes</p>
              <ul className="space-y-2 text-gray-500">
                <li>
                  <Link href="#especialidades" className="hover:text-gray-900">
                    Especialidades
                  </Link>
                </li>
                <li>
                  <Link href="#resultados" className="hover:text-gray-900">
                    Horas disponibles
                  </Link>
                </li>
                <li>
                  <Link href="#beneficios" className="hover:text-gray-900">
                    Beneficios
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-gray-900">Atención</p>
              <ul className="space-y-2 text-gray-500">
                <li>Lun a Vie · 8:00 a 20:00</li>
                <li>Sáb · 9:00 a 14:00</li>
                <li>contacto@telehealth.demo</li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-gray-900">Integración</p>
              <ul className="space-y-2 text-gray-500">
                <li>
                  <Link
                    href="https://docs.getskip.ai"
                    target="_blank"
                    className="hover:text-gray-900"
                  >
                    Documentación Skip
                  </Link>
                </li>
                <li>
                  <Link href="/checkout" className="hover:text-gray-900">
                    Checkout de ejemplo
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          Sitio ficticio para demostrar la integración de Skip en el flujo de un
          prestador · No presta servicios médicos reales
        </p>
      </div>
    </footer>
  );
};
