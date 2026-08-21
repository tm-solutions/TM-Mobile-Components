"use client";

import { useState } from "react";

type Props = {
  code: string;
  /** Etiqueta de la barra superior: normalmente la ruta destino del archivo. */
  label?: string;
  /** Altura maxima antes de hacer scroll. `null` = sin limite. */
  maxHeight?: number | null;
};

export function CodeBlock({ code, label, maxHeight = 420 }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Sin permiso de portapapeles (http en red local, por ejemplo).
      // El codigo sigue siendo seleccionable a mano, no hace falta avisar.
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
      <div className="flex items-center justify-between gap-4 border-b border-border px-3 py-2">
        <span className="truncate font-mono text-xs text-muted-foreground">
          {label ?? "codigo"}
        </span>
        {/* Copiar es la accion principal de todo el catalogo, va en color de
            marca. Al confirmar cambia a verde: el cambio de color comunica el
            resultado sin depender de leer la palabra. */}
        <button
          type="button"
          onClick={copy}
          className={[
            "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium text-white transition-colors",
            copied ? "bg-emerald-600" : "bg-tm hover:bg-tm/90",
          ].join(" ")}
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <pre
        className="overflow-auto p-3 text-xs leading-relaxed"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
