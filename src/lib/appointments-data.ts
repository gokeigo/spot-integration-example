import {
  Activity,
  Apple,
  Baby,
  Bone,
  Brain,
  Flower2,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export interface Specialty {
  slug: string;
  label: string;
  icon: LucideIcon;
  priceFrom: number;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialtySlug: string;
  modality: "video" | "presencial";
  price: number;
  duration: number;
  rating: number;
  patients: number;
  focus: string;
  tags: string[];
  avatarClass: string;
  baseTimes: string[];
}

export const SPECIALTIES: Specialty[] = [
  {
    slug: "medicina-general",
    label: "Medicina General",
    icon: Stethoscope,
    priceFrom: 22000,
  },
  { slug: "pediatria", label: "Pediatría", icon: Baby, priceFrom: 30000 },
  {
    slug: "dermatologia",
    label: "Dermatología",
    icon: Sparkles,
    priceFrom: 38000,
  },
  { slug: "psicologia", label: "Psicología", icon: Brain, priceFrom: 30000 },
  { slug: "nutricion", label: "Nutrición", icon: Apple, priceFrom: 28000 },
  {
    slug: "ginecologia",
    label: "Ginecología",
    icon: Flower2,
    priceFrom: 40000,
  },
  {
    slug: "traumatologia",
    label: "Traumatología",
    icon: Bone,
    priceFrom: 42000,
  },
  {
    slug: "kinesiologia",
    label: "Kinesiología",
    icon: Activity,
    priceFrom: 24000,
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: "carolina-reyes",
    name: "Dra. Carolina Reyes M.",
    title: "Médico Cirujano",
    specialtySlug: "medicina-general",
    modality: "video",
    price: 22000,
    duration: 20,
    rating: 4.9,
    patients: 512,
    focus:
      "Atención integral y resolutiva de patologías agudas y crónicas del adulto.",
    tags: [
      "Enfoque integral",
      "Licencias médicas",
      "Recetas digitales",
      "Control crónico",
    ],
    avatarClass: "bg-blue-100 text-blue-700",
    baseTimes: ["09:00", "09:40", "10:20", "11:40", "15:00", "16:20", "17:40"],
  },
  {
    id: "andres-soto",
    name: "Dr. Andrés Soto V.",
    title: "Médico Cirujano",
    specialtySlug: "medicina-general",
    modality: "presencial",
    price: 25000,
    duration: 30,
    rating: 4.8,
    patients: 387,
    focus:
      "Medicina familiar con énfasis en prevención y chequeos preventivos anuales.",
    tags: ["Chequeo preventivo", "Adulto mayor", "Derivación oportuna"],
    avatarClass: "bg-sky-100 text-sky-700",
    baseTimes: ["08:30", "09:15", "10:45", "12:00", "16:00", "17:15"],
  },
  {
    id: "valentina-munoz",
    name: "Dra. Valentina Muñoz P.",
    title: "Pediatra",
    specialtySlug: "pediatria",
    modality: "video",
    price: 30000,
    duration: 25,
    rating: 4.9,
    patients: 296,
    focus:
      "Control sano y patologías respiratorias en lactantes y preescolares.",
    tags: ["Control sano", "Respiratorio", "Lactancia"],
    avatarClass: "bg-indigo-100 text-indigo-700",
    baseTimes: ["09:20", "10:00", "11:20", "15:40", "16:40"],
  },
  {
    id: "felipe-contreras",
    name: "Dr. Felipe Contreras A.",
    title: "Pediatra",
    specialtySlug: "pediatria",
    modality: "presencial",
    price: 32000,
    duration: 30,
    rating: 4.7,
    patients: 421,
    focus: "Pediatría general y seguimiento de desarrollo escolar.",
    tags: ["Escolares", "Vacunación", "Certificados"],
    avatarClass: "bg-cyan-100 text-cyan-700",
    baseTimes: ["08:45", "09:30", "11:00", "12:15", "15:30"],
  },
  {
    id: "josefa-aravena",
    name: "Dra. Josefa Aravena L.",
    title: "Dermatóloga",
    specialtySlug: "dermatologia",
    modality: "video",
    price: 38000,
    duration: 20,
    rating: 4.8,
    patients: 233,
    focus: "Acné, dermatitis y evaluación de lunares con fotografía guiada.",
    tags: ["Acné", "Dermatitis", "Teledermatología"],
    avatarClass: "bg-blue-100 text-blue-700",
    baseTimes: ["10:10", "10:50", "11:30", "16:10", "17:00", "17:50"],
  },
  {
    id: "rodrigo-palma",
    name: "Dr. Rodrigo Palma S.",
    title: "Dermatólogo",
    specialtySlug: "dermatologia",
    modality: "presencial",
    price: 45000,
    duration: 30,
    rating: 4.9,
    patients: 198,
    focus: "Dermatología clínica y quirúrgica, control de lunares con dermatoscopía.",
    tags: ["Dermatoscopía", "Cirugía menor", "Adultos y niños"],
    avatarClass: "bg-slate-200 text-slate-700",
    baseTimes: ["09:00", "10:30", "12:00", "15:00", "16:30"],
  },
  {
    id: "camila-torres",
    name: "Ps. Camila Torres R.",
    title: "Psicóloga Clínica",
    specialtySlug: "psicologia",
    modality: "video",
    price: 35000,
    duration: 50,
    rating: 5.0,
    patients: 340,
    focus:
      "Terapia individual adulto: ansiedad, estrés laboral y autoestima.",
    tags: ["Ansiedad", "Estrés laboral", "Enfoque cognitivo"],
    avatarClass: "bg-indigo-100 text-indigo-700",
    baseTimes: ["09:00", "10:00", "11:00", "15:00", "16:00", "18:00"],
  },
  {
    id: "ignacio-vergara",
    name: "Ps. Ignacio Vergara D.",
    title: "Psicólogo Clínico",
    specialtySlug: "psicologia",
    modality: "video",
    price: 30000,
    duration: 50,
    rating: 4.8,
    patients: 275,
    focus: "Acompañamiento en duelos, transiciones y terapia de pareja.",
    tags: ["Terapia de pareja", "Duelo", "Adultos jóvenes"],
    avatarClass: "bg-sky-100 text-sky-700",
    baseTimes: ["08:00", "09:00", "12:00", "17:00", "18:00", "19:00"],
  },
  {
    id: "fernanda-rios",
    name: "Nut. Fernanda Ríos C.",
    title: "Nutricionista",
    specialtySlug: "nutricion",
    modality: "video",
    price: 28000,
    duration: 40,
    rating: 4.9,
    patients: 310,
    focus:
      "Planes de alimentación realistas: baja de peso, resistencia a la insulina.",
    tags: ["Baja de peso", "Resistencia insulina", "Plan mensual"],
    avatarClass: "bg-cyan-100 text-cyan-700",
    baseTimes: ["09:30", "10:30", "11:30", "15:30", "16:30"],
  },
  {
    id: "paula-herrera",
    name: "Dra. Paula Herrera G.",
    title: "Ginecóloga",
    specialtySlug: "ginecologia",
    modality: "presencial",
    price: 40000,
    duration: 30,
    rating: 4.9,
    patients: 450,
    focus:
      "Control ginecológico preventivo, anticoncepción y climaterio.",
    tags: ["Control preventivo", "Anticoncepción", "PAP al día"],
    avatarClass: "bg-blue-100 text-blue-700",
    baseTimes: ["08:30", "09:10", "10:40", "11:50", "15:20", "16:00"],
  },
  {
    id: "matias-lagos",
    name: "Dr. Matías Lagos F.",
    title: "Traumatólogo",
    specialtySlug: "traumatologia",
    modality: "presencial",
    price: 42000,
    duration: 30,
    rating: 4.7,
    patients: 380,
    focus:
      "Lesiones deportivas, rodilla y hombro. Indicación y lectura de imágenes.",
    tags: ["Lesiones deportivas", "Rodilla y hombro", "Órdenes de imagen"],
    avatarClass: "bg-slate-200 text-slate-700",
    baseTimes: ["09:45", "10:45", "12:00", "16:15", "17:15"],
  },
  {
    id: "antonia-bravo",
    name: "Klga. Antonia Bravo T.",
    title: "Kinesióloga",
    specialtySlug: "kinesiologia",
    modality: "presencial",
    price: 24000,
    duration: 45,
    rating: 4.8,
    patients: 265,
    focus:
      "Rehabilitación musculoesquelética y pauta de ejercicios domiciliaria.",
    tags: ["Rehabilitación", "Dolor lumbar", "Pauta de ejercicios"],
    avatarClass: "bg-indigo-100 text-indigo-700",
    baseTimes: ["08:00", "09:00", "10:00", "11:00", "15:00", "16:00"],
  },
];

export function getSpecialty(slug: string): Specialty | undefined {
  return SPECIALTIES.find((s) => s.slug === slug);
}

// Deterministic pseudo-availability: rotates the doctor's base grid by day so
// each date shows a different-looking (but stable) set of hours, and thins out
// weekends so the calendar feels real.
export function getTimesForDay(
  doctor: Doctor,
  dayOffset: number,
  isWeekend = false,
): string[] {
  const times = doctor.baseTimes;
  const shift = (dayOffset + doctor.id.length) % times.length;
  const rotated = [...times.slice(shift), ...times.slice(0, shift)];
  const visible = isWeekend
    ? rotated.slice(0, Math.ceil(times.length / 3))
    : rotated.slice(0, Math.max(3, times.length - (dayOffset % 3)));
  return [...visible].sort();
}

export function formatCLP(value: number): string {
  return `$${value.toLocaleString("es-CL")}`;
}

export function getInitials(name: string): string {
  return name
    .replace(/^(Dra?\.|Ps\.|Nut\.|Klga?\.)\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
