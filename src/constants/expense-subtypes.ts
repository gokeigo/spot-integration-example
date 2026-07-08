export interface ExpenseSubtypeOption {
  value: string;
  label: string;
}

/**
 * Curated subset of the backend `ChileanExpenseSubtype` enum
 * (`backend-skip/src/expenses/choices.py`). Values must match exactly;
 * they travel in the `expense_subtypes` form field of `POST /spot/gastos`.
 */
export const EXPENSE_SUBTYPE_OPTIONS: ExpenseSubtypeOption[] = [
  { value: "DOCTOR_APPOINTMENT", label: "Consulta médica" },
  { value: "OUTPATIENT_EXAM", label: "Examen ambulatorio" },
  { value: "OUTPATIENT_LAB", label: "Laboratorio" },
  { value: "OUTPATIENT_IMAGING", label: "Imagenología" },
  { value: "KINESIOLOGY", label: "Kinesiología" },
  { value: "DENTAL", label: "Dental" },
];
