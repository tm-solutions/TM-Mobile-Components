import type { Metadata } from "next";
import { CodeBlock } from "@/components/docs/code-block";
import { SETUP } from "@/registry";

export const metadata: Metadata = {
  title: "Requisitos del proyecto · TM Components UI",
};

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">
        Requisitos del proyecto
      </h1>
      <p className="mt-2 text-muted-foreground">
        Se hace una sola vez por proyecto. Los proyectos Expo de TM que ya
        estaban usando react-native-reusables cumplen casi todo esto; compara y
        completa lo que falte.
      </p>

      <div className="mt-8 grid gap-4">
        {SETUP.map((step, i) => (
          <section key={step.file} className="rounded-lg border border-border p-4">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-tm text-[11px] font-bold text-tm-foreground">
                {i + 1}
              </span>
              <code className="font-mono">{step.file}</code>
            </h2>
            <p className="mb-3 text-sm text-muted-foreground">{step.reason}</p>
            {step.snippet && <CodeBlock code={step.snippet} label={step.file} />}
          </section>
        ))}
      </div>
    </div>
  );
}
