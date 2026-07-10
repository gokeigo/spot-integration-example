import { SPECIALTIES, formatCLP } from "~/lib/appointments-data";

interface SpecialtiesGridProps {
  selected: string | null;
  onSelect: (slug: string | null) => void;
}

export const SpecialtiesGrid = ({
  selected,
  onSelect,
}: SpecialtiesGridProps) => {
  return (
    <section id="especialidades" className="mx-auto max-w-screen-xl px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Especialidades
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Elige una especialidad para ver las próximas horas disponibles
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SPECIALTIES.map(({ slug, label, icon: Icon, priceFrom }) => {
          const isActive = selected === slug;
          return (
            <button
              key={slug}
              onClick={() => onSelect(isActive ? null : slug)}
              className={`group flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                isActive
                  ? "border-blue-500 bg-blue-50 shadow-sm"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  {label}
                </span>
                <span className="block text-xs text-gray-500">
                  desde {formatCLP(priceFrom)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
