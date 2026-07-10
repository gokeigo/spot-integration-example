import Image from "next/image";
import { CalendarCheck2, Receipt, ShieldCheck } from "lucide-react";
import SkipLogo from "~/assets/skip-logo-icon-purple.svg";

const STANDARD_BENEFITS = [
  {
    icon: CalendarCheck2,
    title: "Agenda online 24/7",
    description:
      "Reserva, reagenda o anula tu hora en cualquier momento, sin llamadas ni esperas.",
  },
  {
    icon: Receipt,
    title: "Boleta electrónica al instante",
    description:
      "Paga online con tarjeta y recibe tu boleta en el correo apenas termina el pago.",
  },
  {
    icon: ShieldCheck,
    title: "Telemedicina segura",
    description:
      "Videoconsulta encriptada, receta digital y profesionales verificados por la Superintendencia.",
  },
];

export const BenefitsSection = () => {
  return (
    <section id="beneficios" className="mx-auto max-w-screen-xl px-4 py-14">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Todo lo que incluye tu reserva
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Sin costos ocultos: agenda, paga y recupera tu dinero sin trámites
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STANDARD_BENEFITS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-200 bg-white p-6"
          >
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="mb-1.5 font-semibold text-gray-900">{title}</h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {description}
            </p>
          </div>
        ))}

        {/* Skip-branded benefit: the only purple island in the page */}
        <div className="relative overflow-hidden rounded-2xl border border-violet-300 bg-gradient-to-br from-violet-50 to-purple-50 p-6 ring-1 ring-inset ring-violet-100">
          <div className="mb-4 flex items-center justify-between">
            <Image
              src={SkipLogo as string}
              alt="Skip"
              width={73}
              height={36}
              unoptimized
            />
            <span className="rounded-full bg-violet-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              Nuevo
            </span>
          </div>
          <h3 className="mb-1.5 font-semibold text-violet-950">
            Gestión automática de reembolsos
          </h3>
          <p className="text-sm leading-relaxed text-violet-900/80">
            Al pagar tu consulta, la boleta se envía sola a tu isapre y seguros
            complementarios. El reembolso llega a tu cuenta sin hacer ningún
            trámite.
          </p>
          <p className="mt-3 text-xs font-medium text-violet-700">
            Con tecnología de Skip
          </p>
        </div>
      </div>
    </section>
  );
};
