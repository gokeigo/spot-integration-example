import { atom } from "jotai";

export interface SelectedAppointment {
  specialtyLabel: string;
  doctorName: string;
  modality: "video" | "presencial";
  dateLabel: string;
  time: string;
  price: number;
  duration: number;
}

// Fallback used when /checkout is visited directly without picking a slot in
// the landing. Price matches the consultaCostoAtom default (14000).
export const DEFAULT_APPOINTMENT: SelectedAppointment = {
  specialtyLabel: "Consulta General",
  doctorName: "Dra. Sarah Wilson",
  modality: "video",
  dateLabel: "Mañana",
  time: "14:00",
  price: 14000,
  duration: 30,
};

// In-memory: resets on full reload, like patientAtom.
export const selectedAppointmentAtom = atom<SelectedAppointment | null>(null);
