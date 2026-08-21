"use client";

import { useSyncExternalStore } from "react";

/**
 * Renderiza sus hijos solo despues de montar en el navegador.
 *
 * Las vistas previas son componentes React Native corriendo sobre
 * react-native-web, y varios no tienen un equivalente estable en el servidor:
 * `Switch` emite atributos distintos a los del cliente y `useWindowDimensions`
 * devuelve 0 cuando no hay ventana. React no repara esas diferencias al
 * hidratar ("this won't be patched up"), asi que quedaban avisos en consola.
 *
 * Saltarse el prerender no cuesta nada aqui: la preview es interactiva por
 * definicion y no aporta nada al HTML estatico.
 */

// El valor nunca cambia despues del montaje, asi que no hay a que suscribirse.
const noSubscribe = () => () => {};
const enCliente = () => true;
const enServidor = () => false;

export function ClientOnly({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore y no useEffect + setState: React lo trata como la
  // forma correcta de leer un valor que difiere entre servidor y cliente, sin
  // provocar un render extra ni disparar la regla de set-state-in-effect.
  const montado = useSyncExternalStore(noSubscribe, enCliente, enServidor);

  // El alto reservado evita que la pagina salte cuando entra la preview.
  if (!montado) return <div style={{ minHeight: 160 }} />;

  return <>{children}</>;
}
