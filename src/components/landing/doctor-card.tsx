import { useState } from "react";
import { useRouter } from "next/router";
import { useSetAtom } from "jotai";
import { Clock, Info, MapPin, Star, Users, Video } from "lucide-react";
import {
  formatCLP,
  getInitials,
  getSpecialty,
  getTimesForDay,
  type Doctor,
} from "~/lib/appointments-data";
import { selectedAppointmentAtom } from "~/atoms/appointment";
import { consultaCostoAtom } from "~/atoms/simulation-settings";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface DoctorCardProps {
  doctor: Doctor;
  date: Date;
  dayOffset: number;
}

const VISIBLE_SLOTS = 5;

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const DoctorCard = ({ doctor, date, dayOffset }: DoctorCardProps) => {
  const router = useRouter();
  const setAppointment = useSetAtom(selectedAppointmentAtom);
  const setConsultaCosto = useSetAtom(consultaCostoAtom);
  const [showAll, setShowAll] = useState(false);

  const specialty = getSpecialty(doctor.specialtySlug);
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const times = getTimesForDay(doctor, dayOffset, isWeekend);
  const visibleTimes = showAll ? times : times.slice(0, VISIBLE_SLOTS);
  const payToday = Math.round(doctor.price * 0.3);
  const dateLabel = capitalize(
    date.toLocaleDateString("es-CL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }),
  );

  const handleSelectSlot = (time: string) => {
    setAppointment({
      specialtyLabel: specialty?.label ?? doctor.specialtySlug,
      doctorName: doctor.name,
      modality: doctor.modality,
      dateLabel,
      time,
      price: doctor.price,
      duration: doctor.duration,
    });
    // Keeps the simulation settings in sync so the checkout, the CNPL split
    // and the widget all use the price picked here. The AAPD authorization
    // itself happens later, via the checkout checkbox.
    setConsultaCosto(doctor.price);
    void router.push("/checkout");
  };

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Identity */}
        <div className="min-w-0 flex-1 lg:w-1/2 lg:flex-none">
          <div className="flex items-start gap-4">
            <span
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold ${doctor.avatarClass}`}
            >
              {getInitials(doctor.name)}
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">
                {doctor.name}
              </h3>
              <p className="text-sm text-gray-500">
                {doctor.title} · {specialty?.label}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {doctor.rating.toLocaleString("es-CL", {
                    minimumFractionDigits: 1,
                  })}
                </span>
                <span className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                  <Users className="h-3.5 w-3.5" />
                  {doctor.patients} pacientes
                </span>
                <span className="flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {doctor.modality === "video" ? (
                    <Video className="h-3.5 w-3.5" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5" />
                  )}
                  {doctor.modality === "video" ? "Telemedicina" : "Presencial"}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-600">{doctor.focus}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {doctor.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing + slots */}
        <div className="flex-shrink-0 border-t border-gray-100 pt-5 lg:w-1/2 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                {dateLabel}
              </h4>
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                Duración {doctor.duration} min
              </p>
            </div>

            {/* Informational only: the AAPD authorization itself is given in
                the checkout, not here. */}
            <div className="flex flex-col items-end">
              <div className="rounded-xl border border-violet-200/80 bg-violet-100/50 px-3 py-2 text-right">
                <p className="flex items-center justify-end gap-1 whitespace-nowrap text-sm font-bold text-violet-600">
                  Isapre o Seguro: {formatCLP(payToday)}
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="text-violet-400 hover:text-violet-600"
                          aria-label="Más información sobre el pago con reembolso"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-56 text-sm">
                          Puedes activarlo en el pago: pagas el 30% al agendar
                          y el 70% restante cuando tu isapre o seguro te
                          reembolse la consulta.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
                <p className="mt-0.5 whitespace-nowrap text-[10px] font-medium leading-snug text-violet-700/80">
                  Con Skip paga 30% ahora y el resto cuando te reembolsen
                </p>
              </div>
              <span className="mt-1.5 whitespace-nowrap text-sm text-gray-900">
                Particular: {formatCLP(doctor.price)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleSelectSlot(time)}
                className="rounded-lg border border-gray-300 px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700"
              >
                {time}
              </button>
            ))}
            {times.length === 0 && (
              <p className="text-sm text-gray-400">
                Sin horas disponibles este día
              </p>
            )}
          </div>

          {!showAll && times.length > VISIBLE_SLOTS && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
            >
              Ver más horarios
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
