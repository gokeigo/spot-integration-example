import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";
import type { GastosFormValues } from "~/types/gokei-gastos";
import { gastosFieldEntries } from "~/server/submit-gastos";

type Lang = "curl" | "js" | "python";

const LANGS: { id: Lang; label: string }[] = [
  { id: "curl", label: "cURL" },
  { id: "js", label: "JavaScript" },
  { id: "python", label: "Python" },
];

interface CodeSnippetProps {
  apiUrl: string;
  publicKey: string;
  rut: string;
  values: GastosFormValues;
  fileNames: string[];
}

function buildUrl(apiUrl: string, publicKey: string, rut: string): string {
  return `${apiUrl}/gastos?public_key=${publicKey}&rut=${rut}`;
}

function buildCurl(
  url: string,
  entries: Array<[string, string]>,
  fileNames: string[],
): string {
  const lines = [`curl -X POST \\`, `  '${url}' \\`];
  for (const [key, value] of entries) {
    lines.push(`  -F '${key}=${value}' \\`);
  }
  fileNames.forEach((name, index) => {
    const suffix = index === fileNames.length - 1 ? "" : " \\";
    lines.push(`  -F 'uploaded_files=@${name}'${suffix}`);
  });
  return lines.join("\n");
}

function buildJs(
  apiUrl: string,
  publicKey: string,
  rut: string,
  entries: Array<[string, string]>,
  fileNames: string[],
): string {
  const appends = entries
    .map(([key, value]) => `fd.append(${q(key)}, ${q(value)});`)
    .join("\n");
  const fileAppends = fileNames
    .map(
      (name, index) =>
        `fd.append("uploaded_files", file${index + 1}); // ${name}`,
    )
    .join("\n");

  return [
    `const fd = new FormData();`,
    appends,
    fileAppends,
    ``,
    `const url = new URL(${q(`${apiUrl}/gastos`)});`,
    `url.searchParams.set("public_key", ${q(publicKey)});`,
    `url.searchParams.set("rut", ${q(rut)});`,
    ``,
    `// sin Content-Type manual: el browser pone el boundary`,
    `const res = await fetch(url, { method: "POST", body: fd });`,
    `const data = await res.json();`,
  ].join("\n");
}

function buildPython(
  apiUrl: string,
  publicKey: string,
  rut: string,
  entries: Array<[string, string]>,
  fileNames: string[],
): string {
  const dataLines = entries
    .map(([key, value]) => `    (${q(key)}, ${q(value)}),`)
    .join("\n");
  const fileLines = fileNames
    .map(
      (name) =>
        `    ("uploaded_files", (${q(name)}, open(${q(name)}, "rb"), "image/png")),`,
    )
    .join("\n");

  return [
    `import requests`,
    ``,
    `data = [`,
    dataLines,
    `]`,
    `files = [`,
    fileLines,
    `]`,
    `r = requests.post(`,
    `    ${q(`${apiUrl}/gastos`)},`,
    `    params={"public_key": ${q(publicKey)}, "rut": ${q(rut)}},`,
    `    data=data, files=files,`,
    `)`,
    `print(r.status_code, r.json())`,
  ].join("\n");
}

function q(value: string): string {
  return `"${value.replace(/"/g, '\\"')}"`;
}

export function CodeSnippet({
  apiUrl,
  publicKey,
  rut,
  values,
  fileNames,
}: CodeSnippetProps) {
  const [lang, setLang] = useState<Lang>("curl");
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    const entries = gastosFieldEntries(values);
    const url = buildUrl(apiUrl, publicKey, rut);
    if (lang === "curl") return buildCurl(url, entries, fileNames);
    if (lang === "js")
      return buildJs(apiUrl, publicKey, rut, entries, fileNames);
    return buildPython(apiUrl, publicKey, rut, entries, fileNames);
  }, [lang, apiUrl, publicKey, rut, values, fileNames]);

  const handleCopy = () => {
    void navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-[#0f1117]">
      <div className="flex items-center gap-1 border-b border-gray-800 bg-[#171a22] px-2 py-1.5">
        {LANGS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLang(item.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              lang === item.id
                ? "bg-[#262b37] text-white"
                : "text-gray-400 hover:bg-[#20242e] hover:text-gray-200"
            }`}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          className={`ml-auto flex items-center gap-1.5 rounded-md border border-gray-700 px-2.5 py-1.5 font-mono text-[11px] transition ${
            copied
              ? "border-emerald-800 text-emerald-400"
              : "text-gray-400 hover:border-gray-600 hover:text-white"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> Copiado
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Copiar
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-xs leading-relaxed text-gray-300">
        {code}
      </pre>
    </div>
  );
}

export default CodeSnippet;
