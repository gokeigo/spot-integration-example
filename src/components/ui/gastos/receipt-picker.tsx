import { useRef } from "react";
import { Receipt, ClipboardList, Upload, X, Check, Info } from "lucide-react";
import { SAMPLE_RECEIPTS } from "~/lib/sample-receipts";

interface ReceiptPickerProps {
  selectedSampleIds: string[];
  uploads: File[];
  totalSelected: number;
  maxFiles: number;
  onToggleSample: (id: string) => void;
  onAddUploads: (files: FileList | null) => void;
  onRemoveUpload: (index: number) => void;
  error?: string | null;
}

export function ReceiptPicker({
  selectedSampleIds,
  uploads,
  totalSelected,
  maxFiles,
  onToggleSample,
  onAddUploads,
  onRemoveUpload,
  error,
}: ReceiptPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Documentos
        <span className="ml-auto font-mono text-[11px] font-normal normal-case tracking-normal text-gray-400">
          {totalSelected} de {maxFiles} archivos
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SAMPLE_RECEIPTS.map((doc) => {
          const selected = selectedSampleIds.includes(doc.id);
          const Icon = doc.kind === "orden" ? ClipboardList : Receipt;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => onToggleSample(doc.id)}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition ${
                selected
                  ? "border-violet-500 bg-violet-50 ring-1 ring-violet-500"
                  : "border-gray-200 bg-white hover:border-violet-200 hover:bg-violet-50/40"
              }`}
            >
              <span
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${
                  doc.kind === "orden"
                    ? "bg-sky-50 text-sky-600"
                    : "bg-violet-100 text-violet-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-gray-900">
                  {doc.label}
                </span>
                <span className="block truncate text-[11px] text-gray-400">
                  {doc.hint}
                </span>
              </span>
              <span
                className={`ml-auto flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border ${
                  selected
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-gray-300 bg-white text-transparent"
                }`}
              >
                <Check className="h-3 w-3" />
              </span>
            </button>
          );
        })}
      </div>

      {uploads.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {uploads.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
            >
              <Upload className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
              <span className="min-w-0 flex-1 truncate font-mono text-xs text-gray-700">
                {file.name}
              </span>
              <span className="flex-shrink-0 font-mono text-[11px] text-gray-400">
                {(file.size / 1024).toFixed(0)} KB
              </span>
              <button
                type="button"
                onClick={() => onRemoveUpload(index)}
                className="flex-shrink-0 rounded p-0.5 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600"
                aria-label={`Quitar ${file.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-xs text-gray-500 transition hover:border-violet-300 hover:bg-violet-50/40 hover:text-violet-700"
      >
        <Upload className="h-4 w-4" />
        Arrastra tu propia boleta o haz clic para subir
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        multiple
        className="hidden"
        onChange={(event) => {
          onAddUploads(event.target.files);
          event.target.value = "";
        }}
      />

      <p className="flex items-center gap-1.5 text-[11px] text-gray-400">
        <Info className="h-3 w-3" />1 a 5 archivos · máx 2&nbsp;MB c/u · imagen
        o PDF
      </p>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default ReceiptPicker;
