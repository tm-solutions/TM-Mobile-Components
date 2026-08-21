"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { REGISTRY, getItem } from "@/registry";
import { Sidebar } from "./sidebar";

/**
 * Navegacion para pantallas angostas, donde el sidebar lateral esta oculto.
 *
 * Es un <details> y no un menu con estado propio: el navegador ya se encarga de
 * abrir y cerrar, funciona sin JavaScript y es accesible por teclado sin
 * escribir nada extra.
 */
export function MobileNav() {
  const pathname = usePathname();
  const ref = useRef<HTMLDetailsElement>(null);

  // Cerrar al navegar; si no, el menu queda abierto tapando la pagina nueva.
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  const actual =
    pathname === "/"
      ? "Inicio"
      : pathname === "/setup"
        ? "Requisitos del proyecto"
        : (getItem(pathname.replace("/c/", ""))?.name ?? "Componentes");

  const total = REGISTRY.length;

  return (
    <details ref={ref} className="border-b border-border md:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm [&::-webkit-details-marker]:hidden">
        <span>
          <span className="text-muted-foreground">Navegacion · </span>
          <span className="font-medium">{actual}</span>
        </span>
        <span className="text-xs text-muted-foreground">
          {total} componentes
        </span>
      </summary>
      <div className="max-h-[70vh] overflow-y-auto border-t border-border">
        <Sidebar />
      </div>
    </details>
  );
}
