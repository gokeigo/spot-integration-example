const STEPS = [
  {
    number: "1",
    title: "Busca tu especialista",
    description:
      "Filtra por especialidad, modalidad y elige la hora que más te acomode.",
  },
  {
    number: "2",
    title: "Agenda y paga online",
    description:
      "Confirma tus datos y paga con tarjeta. Puedes pagar el total o solo el 30% si tienes isapre o seguro.",
  },
  {
    number: "3",
    title: "Atiéndete y recibe tu boleta",
    description:
      "Te atiendes por video o presencial, y tu boleta llega al instante lista para reembolsar.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="border-y border-gray-100 bg-white py-14">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            ¿Cómo funciona?
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map(({ number, title, description }) => (
            <div key={number} className="flex flex-col items-center text-center">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                {number}
              </span>
              <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-gray-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
