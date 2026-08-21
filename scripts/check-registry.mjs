/**
 * Verifica que los requisitos declarados en registry/index.ts cubran todos los
 * imports reales de cada componente. Corre `npm run check:registry` despues de
 * agregar o modificar un componente: un requisito faltante aqui significa que el
 * dev copia el archivo y le explota el proyecto.
 *
 * Importa el registry directamente (Node hace strip de tipos en .ts) en vez de
 * leerlo con expresiones regulares: asi las listas de dependencias compartidas
 * entre items se resuelven de verdad, en lugar de depender de que cada item
 * escriba sus paquetes como literales.
 */
import { readFileSync } from 'node:fs';
import { collectNpm, REGISTRY, resolveDeps } from '../registry/index.ts';

// Vienen con React Native, no se declaran.
const INCLUIDOS = ['react', 'react-native', 'react/jsx-runtime'];

/** "@scope/pkg/sub" -> "@scope/pkg" ; "pkg/sub" -> "pkg" */
const nombrePaquete = (imp) =>
  imp.startsWith('@') ? imp.split('/').slice(0, 2).join('/') : imp.split('/')[0];

let fallos = 0;

for (const item of REGISTRY) {
  const codigo = readFileSync(item.source, 'utf8');
  const imports = [...codigo.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);

  const paquetes = new Set(collectNpm(item.slug).map((d) => d.pkg));
  // Un import "@/..." queda cubierto si algun dependsOn (recursivo) lo entrega.
  const archivos = resolveDeps(item.slug).map(
    (d) => '@/' + d.target.replace(/\.tsx?$/, '')
  );

  const faltan = imports.filter((imp) => {
    if (INCLUIDOS.includes(imp)) return false;
    // Relativos: archivos hermanos que se copian juntos (DrawerMenu/DrawerItem).
    if (imp.startsWith('.')) return false;
    if (imp.startsWith('@/')) return !archivos.includes(imp);
    return !paquetes.has(nombrePaquete(imp));
  });

  if (faltan.length) fallos++;
  console.log(
    (faltan.length ? 'FALTA  ' : 'OK     ') +
      item.slug.padEnd(18) +
      (faltan.length ? '-> ' + faltan.join(', ') : '')
  );
}

console.log(
  fallos
    ? `\n${fallos} componente(s) con requisitos incompletos`
    : '\nTodos los requisitos cubren sus imports'
);
process.exit(fallos ? 1 : 0);
