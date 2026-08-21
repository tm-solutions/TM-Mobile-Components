import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/docs/code-block";
import { DEMOS } from "@/components/docs/demos";
import { PreviewFrame } from "@/components/docs/preview-frame";
import { Requirements } from "@/components/docs/requirements";
import { CATEGORIES, REGISTRY, getItem } from "@/registry";

export function generateStaticParams() {
  return REGISTRY.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  const item = getItem(slug);
  return { title: item ? `${item.name} · TM Components UI` : "No encontrado" };
}

export default async function Page({ params }: PageProps<"/c/[slug]">) {
  const { slug } = await params;
  const item = getItem(slug);
  if (!item) notFound();

  // Se lee el archivo real: lo que se copia es exactamente lo que se previsualiza.
  const code = await readFile(path.join(process.cwd(), item.source), "utf8");
  const Demo = DEMOS[item.slug];

  const categoria = CATEGORIES.find((c) => c.key === item.category);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-tm">
        {categoria?.label}
      </p>
      <h1 className="mt-1.5 font-mono text-3xl font-semibold tracking-tight">
        {item.name}
      </h1>
      <p className="mt-2 text-muted-foreground">{item.description}</p>

      {/* La vista previa va antes que las notas: es lo que el dev viene a ver,
          y con componentes de varias notas quedaba empujada fuera de pantalla. */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Vista previa</h2>
        {Demo ? (
          <PreviewFrame>
            <Demo />
          </PreviewFrame>
        ) : (
          <p className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
            Sin vista previa: no es un componente visual.
          </p>
        )}
      </section>

      {item.notes && item.notes.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Ten en cuenta</h2>
          <ul className="grid gap-2">
            {item.notes.map((n) => (
              <li
                key={n}
                className="rounded-md border-l-2 border-tm/40 bg-tm/[0.05] px-3 py-2 text-sm text-muted-foreground"
              >
                {n}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-semibold">Requisitos</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Haz estos pasos antes de pegar el codigo.
        </p>
        <Requirements item={item} />
      </section>

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-semibold">Codigo</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Copialo en{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
            {item.target}
          </code>
          .
        </p>
        <CodeBlock code={code} label={item.target} maxHeight={520} />
      </section>
    </div>
  );
}
