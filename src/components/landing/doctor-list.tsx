import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { DoctorCard } from "~/components/landing/doctor-card";
import {
  DOCTORS,
  getSpecialty,
  type Doctor,
} from "~/lib/appointments-data";
import { type ModalityFilter } from "~/components/landing/hero-search";

interface DoctorListProps {
  query: string;
  modality: ModalityFilter;
  specialtySlug: string | null;
  onClearFilters: () => void;
}

const DAYS_TO_SHOW = 7;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesQuery(doctor: Doctor, query: string) {
  if (!query.trim()) return true;
  const target = normalize(
    `${doctor.name} ${doctor.title} ${getSpecialty(doctor.specialtySlug)?.label ?? ""}`,
  );
  return normalize(query)
    .split(/\s+/)
    .every((word) => target.includes(word));
}

export const DoctorList = ({
  query,
  modality,
  specialtySlug,
  onClearFilters,
}: DoctorListProps) => {
  // Dates are computed client-side only to keep the statically exported HTML
  // free of build-time timestamps (avoids hydration mismatches).
  const [today, setToday] = useState<Date | null>(null);
  const [dayOffset, setDayOffset] = useState(0);

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);
  }, []);

  const days = useMemo(() => {
    if (!today) return [];
    return Array.from({ length: DAYS_TO_SHOW }, (_, offset) => {
      const date = new Date(today);
      date.setDate(date.getDate() + offset);
      return { offset, date };
    });
  }, [today]);

  const filtered = DOCTORS.filter(
    (doctor) =>
      (modality === "all" || doctor.modality === modality) &&
      (!specialtySlug || doctor.specialtySlug === specialtySlug) &&
      matchesQuery(doctor, query),
  );

  const selectedDay = days[dayOffset];

  return (
    <section id="resultados" className="bg-slate-50/70 py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Próximas horas disponibles
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filtered.length}{" "}
              {filtered.length === 1
                ? "profesional encontrado"
                : "profesionales encontrados"}
              {specialtySlug &&
                ` en ${getSpecialty(specialtySlug)?.label ?? ""}`}
            </p>
          </div>

          {/* Date strip */}
          {days.length > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setDayOffset((d) => Math.max(0, d - 1))}
                disabled={dayOffset === 0}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                aria-label="Día anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5 overflow-x-auto">
                {days.map(({ offset, date }) => {
                  const isActive = offset === dayOffset;
                  return (
                    <button
                      key={offset}
                      onClick={() => setDayOffset(offset)}
                      className={`flex min-w-[3.4rem] flex-col items-center rounded-lg border px-2 py-1.5 transition-colors ${
                        isActive
                          ? "border-blue-500 bg-blue-600 text-white"
                          : "border-gray-200 bg-white text-gray-600 hover:border-blue-300"
                      }`}
                    >
                      <span className="text-[10px] uppercase leading-tight">
                        {date.toLocaleDateString("es-CL", { weekday: "short" })}
                      </span>
                      <span className="text-sm font-semibold leading-tight">
                        {date.getDate()}
                      </span>
                      <span className="text-[10px] leading-tight">
                        {date.toLocaleDateString("es-CL", { month: "short" })}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() =>
                  setDayOffset((d) => Math.min(DAYS_TO_SHOW - 1, d + 1))
                }
                disabled={dayOffset === DAYS_TO_SHOW - 1}
                className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                aria-label="Día siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <SearchX className="h-8 w-8 text-gray-300" />
            <p className="font-medium text-gray-700">
              No encontramos profesionales para tu búsqueda
            </p>
            <p className="text-sm text-gray-500">
              Prueba con otra especialidad o modalidad de atención
            </p>
            <button
              onClick={onClearFilters}
              className="mt-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {selectedDay &&
              filtered.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  doctor={doctor}
                  date={selectedDay.date}
                  dayOffset={selectedDay.offset}
                />
              ))}
          </div>
        )}
      </div>
    </section>
  );
};
