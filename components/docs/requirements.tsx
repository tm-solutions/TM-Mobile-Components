import {
  collectNpm,
  getItem,
  installCommand,
  resolveDeps,
  type RegistryItem,
} from "@/registry";
import { CodeBlock } from "./code-block";

function Block({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-tm text-[11px] font-bold text-tm-foreground">
          {step}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function Requirements({ item }: { item: RegistryItem }) {
  const deps = collectNpm(item.slug);
  const commands = installCommand(deps);
  const bases = resolveDeps(item.slug);

  return (
    <div className="grid gap-3">
      <Block step={1} title="Dependencias npm">
        {deps.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ninguna. Solo usa React Native y NativeWind.
          </p>
        ) : (
          <>
            <ul className="mb-3 grid gap-1.5">
              {deps.map((d) => (
                <li key={d.pkg} className="text-sm">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {d.pkg}
                  </code>{" "}
                  <span className="text-muted-foreground">{d.reason}</span>
                </li>
              ))}
            </ul>
            {commands.map((cmd) => (
              <div key={cmd} className="mb-2 last:mb-0">
                <CodeBlock code={cmd} label="terminal" maxHeight={null} />
              </div>
            ))}
          </>
        )}
      </Block>

      <Block step={2} title="Archivos base compartidos">
        {bases.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ninguno. Este componente es autocontenido: copias un archivo y ya.
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-muted-foreground">
              Copia estos primero. Se instalan una sola vez por proyecto — si ya
              los tienes, salta este paso.
            </p>
            <ul className="grid gap-2">
              {bases.map((b) => (
                <li
                  key={b.slug}
                  className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm"
                >
                  <a
                    href={`/c/${b.slug}`}
                    className="font-medium underline underline-offset-4"
                  >
                    {b.name}
                  </a>
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                    {b.target}
                  </code>
                </li>
              ))}
            </ul>
          </>
        )}
      </Block>

      <Block step={3} title="Configuracion previa">
        {item.config.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No necesita config propia. Solo el{" "}
            <a href="/setup" className="underline underline-offset-4">
              setup base del proyecto
            </a>
            , que se hace una vez.
          </p>
        ) : (
          <div className="grid gap-3">
            {item.config.map((c) => (
              <div key={c.file}>
                <p className="mb-2 text-sm">
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {c.file}
                  </code>{" "}
                  <span className="text-muted-foreground">{c.reason}</span>
                </p>
                {c.snippet && <CodeBlock code={c.snippet} label={c.file} />}
              </div>
            ))}
          </div>
        )}
      </Block>
    </div>
  );
}

export function DepsBadge({ slug }: { slug: string }) {
  const item = getItem(slug);
  if (!item) return null;
  const n = collectNpm(slug).length;
  return (
    <span className="text-xs text-muted-foreground">
      {n === 0 ? "sin dependencias" : `${n} dependencia${n > 1 ? "s" : ""}`}
    </span>
  );
}
