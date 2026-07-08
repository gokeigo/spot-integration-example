export interface SampleReceiptDef {
  id: string;
  label: string;
  filename: string;
  kind: "boleta" | "orden";
  hint: string;
  title: string;
  lines: string[];
}

/**
 * Fake, Skip-branded sample documents used to exercise the gastos upload
 * without committing binary assets. Two receipts + two medical orders so the
 * demo can show the real "boleta + orden médica" multi-document case.
 */
export const SAMPLE_RECEIPTS: SampleReceiptDef[] = [
  {
    id: "boleta-honorarios",
    label: "Boleta de honorarios",
    filename: "boleta-honorarios.png",
    kind: "boleta",
    hint: "boleta afecta",
    title: "BOLETA DE HONORARIOS",
    lines: [
      "Prestador: Clínica Demo Skip SpA",
      "RUT emisor: 96.770.100-9",
      "N° boleta: 69",
      "Fecha: 30/12/2025",
      "Profesional: Dr. Juan Sepúlveda",
      "Detalle: Consulta gastroenterología",
      "Total: $100.000",
    ],
  },
  {
    id: "boleta-exenta",
    label: "Boleta exenta",
    filename: "boleta-exenta.png",
    kind: "boleta",
    hint: "boleta exenta",
    title: "BOLETA EXENTA",
    lines: [
      "Prestador: Centro Médico Demo Skip",
      "RUT emisor: 76.123.456-7",
      "N° boleta: 1024",
      "Fecha: 30/12/2025",
      "Detalle: Examen de laboratorio",
      "Total: $38.000",
    ],
  },
  {
    id: "orden-examenes",
    label: "Orden de exámenes",
    filename: "orden-examenes.png",
    kind: "orden",
    hint: "orden médica · respaldo",
    title: "ORDEN DE EXÁMENES",
    lines: [
      "Paciente: (según registro)",
      "Médico: Dr. Juan Sepúlveda",
      "RUT médico: 11.111.111-1",
      "Indicación: Perfil bioquímico, hemograma",
      "Diagnóstico: Estudio ambulatorio",
      "Fecha: 30/12/2025",
    ],
  },
  {
    id: "orden-atencion",
    label: "Orden de atención",
    filename: "orden-atencion.png",
    kind: "orden",
    hint: "orden médica",
    title: "ORDEN DE ATENCIÓN",
    lines: [
      "Paciente: (según registro)",
      "Prestación: Consulta especialidad",
      "Médico: Dr. Juan Sepúlveda",
      "Previsión: ISAPRE",
      "Fecha: 30/12/2025",
    ],
  },
];

/**
 * Renders a sample document to a PNG `File` on the fly via canvas, so uploads
 * are real image files without shipping binaries in the repo.
 */
export async function renderSampleReceipt(
  def: SampleReceiptDef,
): Promise<File> {
  const width = 620;
  const height = 800;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No se pudo generar la boleta de muestra (canvas 2d)");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Header band
  ctx.fillStyle = "#7c3aed";
  ctx.fillRect(0, 0, width, 96);
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 26px system-ui, sans-serif";
  ctx.fillText("Skip · documento de ejemplo", 40, 58);

  // Title
  ctx.fillStyle = "#111827";
  ctx.font = "700 30px system-ui, sans-serif";
  ctx.fillText(def.title, 40, 168);

  ctx.strokeStyle = "#e5e7eb";
  ctx.beginPath();
  ctx.moveTo(40, 196);
  ctx.lineTo(width - 40, 196);
  ctx.stroke();

  // Body lines
  ctx.fillStyle = "#374151";
  ctx.font = "20px system-ui, sans-serif";
  def.lines.forEach((line, index) => {
    ctx.fillText(line, 40, 248 + index * 40);
  });

  ctx.fillStyle = "#9ca3af";
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillText(
    "Documento ficticio generado para pruebas de integración.",
    40,
    height - 48,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) {
    throw new Error("No se pudo generar la boleta de muestra (toBlob)");
  }

  return new File([blob], def.filename, { type: "image/png" });
}
