/**
 * Marco que encuadra la preview al ancho de un telefono.
 *
 * Los componentes son React Native corriendo sobre react-native-web, asi que
 * dentro de este marco se ven y responden igual que en el dispositivo. El ancho
 * fijo importa: muchos usan clases responsive (sm:) que a ancho de escritorio
 * mostrarian el layout de tablet, no el que vera el usuario.
 */
import { ClientOnly } from "./client-only";
import { PreviewProvider } from "./preview-provider";

export function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center rounded-lg border border-border bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:16px_16px] p-6">
      <div className="w-full max-w-[390px] rounded-2xl border border-border bg-background p-4 shadow-sm">
        <ClientOnly>
          <PreviewProvider>{children}</PreviewProvider>
        </ClientOnly>
      </div>
    </div>
  );
}
