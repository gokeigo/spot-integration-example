import { MapPin, Search, Star, Video } from "lucide-react";

export type ModalityFilter = "all" | "video" | "presencial";

interface HeroSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  modality: ModalityFilter;
  onModalityChange: (value: ModalityFilter) => void;
  onSearch: () => void;
}

const TABS: { value: ModalityFilter; label: string; icon?: typeof Video }[] = [
  { value: "all", label: "Todas" },
  { value: "video", label: "Telemedicina", icon: Video },
  { value: "presencial", label: "Presencial", icon: MapPin },
];

export const HeroSearch = ({
  query,
  onQueryChange,
  modality,
  onModalityChange,
  onSearch,
}: HeroSearchProps) => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(60rem_30rem_at_50%_-10rem,rgba(59,130,246,0.10),transparent)]"
      />
      <div className="relative mx-auto max-w-screen-xl px-4 pb-16 pt-14 text-center sm:pt-20">
        <p className="mb-4 flex items-center justify-center gap-1.5 text-sm text-gray-500">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          4,9 de 5 · +45.000 pacientes atendidos
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Agenda tu hora médica <span className="text-blue-600">online</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-600 sm:text-lg">
          Telemedicina y consultas presenciales con especialistas verificados.
          Paga online y recibe tu boleta al instante.
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-gray-100 bg-white p-3 shadow-lg shadow-blue-100/60">
          <div className="mb-3 flex justify-center gap-1 border-b border-gray-100 pb-2">
            {TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => onModalityChange(value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  modality === value
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch();
                }}
                placeholder="Buscar por especialidad o nombre del profesional…"
                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <button
              onClick={onSearch}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Buscar horas
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Atención particular, con boleta reembolsable en tu isapre o seguro
          complementario.
        </p>
      </div>
    </section>
  );
};
