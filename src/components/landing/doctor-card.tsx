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
import {
  consultaCostoAtom,
  workflowTypeAtom,
} from "~/atoms/simulation-settings";
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
  const setWorkflowType = useSetAtom(workflowTypeAtom);
  const [payMode, setPayMode] = useState<"full" | "aapd">("full");
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
      payMode,
    });
    // Keeps the simulation settings in sync so the checkout, the CNPL split
    // and the widget all use the price/mode picked here.
    setConsultaCosto(doctor.price);
    setWorkflowType(payMode === "aapd" ? "cnpl" : "standard");
    void router.push("/checkout");
  };

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Identity */}
        <div className="min-w-0 flex-1">
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
        <div className="flex-shrink-0 border-t border-gray-100 pt-5 lg:w-[360px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold text-gray-900">{dateLabel}</h4>
            <span className="whitespace-nowrap text-sm font-semibold text-blue-700">
              Particular: {formatCLP(doctor.price)}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            Duración {doctor.duration} min
          </p>

          <fieldset className="mt-3 space-y-2">
            <legend className="sr-only">Modo de pago</legend>
            <label
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                payMode === "full"
                  ? "border-blue-400 bg-blue-50/60 text-gray-900"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name={`pay-mode-${doctor.id}`}
                checked={payMode === "full"}
                onChange={() => setPayMode("full")}
                className="h-3.5 w-3.5 accent-blue-600"
              />
              <span className="flex-1">Pago total hoy</span>
              <span className="font-medium">{formatCLP(doctor.price)}</span>
            </label>
            <label
              className={`flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 transition-colors ${
                payMode === "aapd"
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-emerald-200/70 bg-emerald-50/40 hover:border-emerald-300"
              }`}
            >
              <input
                type="radio"
                name={`pay-mode-${doctor.id}`}
                checked={payMode === "aapd"}
                onChange={() => setPayMode("aapd")}
                className="mt-0.5 h-3.5 w-3.5 accent-emerald-600"
              />
              <span className="flex-1 text-xs leading-relaxed text-emerald-900">
                <span className="font-semibold">Isapre o Seguro:</span> paga hoy{" "}
                <span className="text-sm font-bold">{formatCLP(payToday)}</span>{" "}
                y el resto al reembolsar
              </span>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      className="mt-0.5 text-emerald-700/70 hover:text-emerald-800"
                      aria-label="Más información sobre el pago con reembolso"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-56 text-sm">
                      Pagas el 30% al agendar. El 70% restante se paga cuando tu
                      isapre o seguro te reembolse la consulta.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
          </fieldset>

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
