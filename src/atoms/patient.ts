import { atom } from "jotai";

interface Patient {
  name: string;
  rut: string;
  email: string;
  phone_number: string;
  wantsReimbursement?: boolean;
}

export const patientAtom = atom<Patient>({
  name: "Natalia Becerra Morales",
  rut: "3367999-7",
  email: "natalia@getgokei.com",
  phone_number: "+56 9 1234 5678",
  wantsReimbursement: false,
});
