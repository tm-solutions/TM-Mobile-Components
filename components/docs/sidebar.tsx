"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, REGISTRY } from "@/registry";

export function Sidebar() {
  const pathname = usePathname();

  const link = (href: string, label: string, mono = false) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className={[
          // El borde izquierdo existe siempre (transparente si no esta activo)
          // para que el texto no se desplace al seleccionar.
          "block border-l-2 py-1.5 pl-3 pr-2 text-sm transition-colors",
          mono ? "font-mono text-[13px]" : "",
          active
            ? "border-tm bg-tm/[0.07] font-medium text-tm"
            : "border-transparent text-muted-foreground hover:border-tm/30 hover:bg-tm/[0.04] hover:text-foreground",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex flex-col gap-6 py-4 pl-2 pr-2">
      <div className="grid gap-0.5">
        {link("/", "Inicio")}
        {link("/setup", "Requisitos del proyecto")}
      </div>

      {CATEGORIES.map((cat) => {
        const items = REGISTRY.filter((i) => i.category === cat.key);
        if (items.length === 0) return null;
        return (
          <div key={cat.key} className="grid gap-0.5">
            <h4 className="pb-1 pl-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {cat.label}
            </h4>
            {items.map((i) => link(`/c/${i.slug}`, i.name, true))}
          </div>
        );
      })}
    </nav>
  );
}
