import { atom } from "jotai";

interface Patient {
  name: string;
  rut: string;
  email: string;
  phone_number: string;
  wantsReimbursement?: boolean;
}

export const patientAtom = atom<Patient>({
  name: "Natalia Gonzáléz",
  rut: "75858230-2",
  email: "spot@example.com",
  phone_number: "+56 9 1234 5678",
  wantsReimbursement: false,
});
