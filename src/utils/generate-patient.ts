const FIRST_NAMES = [
  "Camilo", "Valentina", "Sebastián", "Isidora", "Matías",
  "Catalina", "Diego", "Javiera", "Felipe", "Sofía",
  "Rodrigo", "Fernanda", "Andrés", "Constanza", "Pablo",
];

const LAST_NAMES = [
  "Rojas", "Muñoz", "Fuentes", "Herrera", "Castro",
  "Vargas", "Soto", "Contreras", "Reyes", "Vega",
  "Flores", "Mendoza", "Lagos", "Araya", "Silva",
];

function computeRutCheckDigit(body: number): string {
  const digits = String(body).split("").reverse();
  let sum = 0;
  let multiplier = 2;
  for (const d of digits) {
    sum += parseInt(d) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const remainder = 11 - (sum % 11);
  if (remainder === 11) return "0";
  if (remainder === 10) return "K";
  return String(remainder);
}

function stripAccents(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function generateNotRegisteredPatient() {
  const body = Math.floor(Math.random() * (25_000_000 - 5_000_000 + 1)) + 5_000_000;
  const checkDigit = computeRutCheckDigit(body);
  const rut = `${body}-${checkDigit}`;

  const firstName = pick(FIRST_NAMES);
  const lastName1 = pick(LAST_NAMES);
  let lastName2 = pick(LAST_NAMES);
  if (lastName2 === lastName1) {
    lastName2 = LAST_NAMES[(LAST_NAMES.indexOf(lastName1) + 1) % LAST_NAMES.length]!;
  }
  const name = `${firstName} ${lastName1} ${lastName2}`;

  const emailBase = stripAccents(firstName).toLowerCase();
  const suffix = Math.floor(Math.random() * 90000) + 10000;
  const email = `${emailBase}${suffix}@gokeigo.com`;

  return {
    name,
    rut,
    email,
    phone_number: "+56 9 1234 5678",
  };
}
