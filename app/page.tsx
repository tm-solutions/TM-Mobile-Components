import Link from "next/link";
import { CATEGORIES, REGISTRY, collectNpm } from "@/registry";

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-tm">
        Libreria interna
      </p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">
        Componentes
      </h1>
      <p className="mt-2 text-muted-foreground">
        Componentes React Native listos para copiar y pegar en los proyectos
        Expo de TM. Cada ficha muestra primero lo que necesitas instalar y
        configurar, y despues el codigo.
      </p>

      <Link
        href="/setup"
        className="mt-6 flex items-start gap-3 rounded-lg border border-tm/25 bg-tm/[0.05] p-4 transition-colors hover:bg-tm/[0.09]"
      >
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-tm text-[11px] font-bold text-tm-foreground">
          !
        </span>
        <span className="text-sm">
          <span className="font-medium">
            Antes de copiar tu primer componente
          </span>
          <span className="mt-0.5 block text-muted-foreground">
            Revisa los requisitos del proyecto. Se hacen una sola vez y sin
            ellos las clases de Tailwind no generan estilos.
          </span>
        </span>
      </Link>

      {CATEGORIES.map((cat) => {
        const items = REGISTRY.filter((i) => i.category === cat.key);
        if (items.length === 0) return null;
        return (
          <section key={cat.key} className="mt-10">
            <div className="flex items-baseline gap-2.5">
              <h2 className="text-lg font-semibold">{cat.label}</h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {items.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {cat.description}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const n = collectNpm(item.slug).length;
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/c/${item.slug}`}
                      className="group flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:border-tm/40 hover:bg-tm/[0.04]"
                    >
                      <span className="font-mono text-sm font-medium transition-colors group-hover:text-tm">
                        {item.name}
                      </span>
                      <span className="mt-1.5 flex-1 text-sm text-muted-foreground">
                        {item.description}
                      </span>
                      <span className="mt-3 text-xs text-muted-foreground">
                        {n === 0
                          ? "sin dependencias"
                          : `${n} dependencia${n > 1 ? "s" : ""}`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
