# TM Components UI

Catalogo interno de componentes **React Native** reutilizables de TM Solutions.
Los devs entran, eligen un componente, leen los requisitos y copian el codigo a
su proyecto Expo.

```bash
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Como esta armado

El catalogo es una app Next.js, pero **los componentes son React Native de
verdad**. Se renderizan en el navegador con `react-native-web`, asi que la vista
previa ejecuta exactamente el mismo archivo que el dev copia — no hay capturas
ni demos paralelas que se desincronicen.

```
registry/
  index.ts              metadata: requisitos, dependencias, relaciones
  tm/lib/utils.ts       cn()
  tm/ui/*.tsx           base (react-native-reusables)
  tm/forms/*.tsx        formularios
  tm/navigation/*.tsx   drawer, header, boton de volver
  tm/layout/*.tsx       contenedores de pantalla
  tm/lib/*.ts           cn(), notify() y confirm()
  tm/hooks/*.ts         hooks (useDrawer)
app/
  page.tsx              indice
  setup/page.tsx        requisitos del proyecto (una sola vez)
  c/[slug]/page.tsx     ficha: preview -> requisitos -> codigo
components/docs/        UI del catalogo (esto si es web normal)
```

### De donde salieron los componentes

Los de `navigation/`, `layout/` y varios de `forms/` se extrajeron de
**TM-Tracker_Premium_expo**, que tambien define la paleta del catalogo. Se
eligieron por estar duplicados: `UserInput`, `HomeHeader`, `DrawerItem` y
`ContainerLogin` aparecian en 5 proyectos y `DrawerMenu`, `PickerModal`,
`SelectCard` y `BackButton` en 4 — con una version distinta en cada uno
(`DrawerMenu` iba de 3.4KB a 4.5KB segun el proyecto). Esa divergencia es
justamente lo que el catalogo viene a cortar.

Al portarlos se les quito el acople al proyecto de origen: `BackButton` recibe
`onPress` en vez de llamar a `router.back()`, `DrawerMenu` recibe `userName` en
vez de leer `useAuth()`, y `ContainerLogin` recibe el boton por la prop
`header`. Asi sirven en cualquiera de los seis proyectos sin arrastrar su
contexto.

`lib/notify.ts` (categoria Avisos) no salio de un archivo: los proyectos ya
montan `<Toaster />` de `sonner-native` y suman **321 llamadas sueltas a
`toast.*`** (189 error, 75 success, 51 warning, 6 info) mas **110 `Alert.alert`
escritos a mano**. El archivo solo les pone un nombre y un tipo comun, y agrega
`confirm()` con promesa para el patron de confirmacion que se repetia.

### Los imports del registry no se tocan

Los archivos de `registry/tm/` conservan los imports que necesita el proyecto
destino (`@/lib/utils`, `@/components/ui/text`). El catalogo los redirige con
`paths` en `tsconfig.json`:

```json
"@/lib/utils":       ["./registry/tm/lib/utils.ts"],
"@/components/ui/*": ["./registry/tm/ui/*"]
```

Por eso el codigo se copia y funciona sin editar una sola linea. Como
contrapartida, la UI del catalogo vive en `components/docs/`, no en
`components/ui/`.

### El codigo no se duplica

`registry/index.ts` guarda solo metadata. La ficha lee el archivo fuente del
disco con `fs.readFile` al renderizar, asi que el bloque "Codigo" siempre
coincide con lo que se esta previsualizando.

## Agregar un componente

1. Crea el archivo en `registry/tm/<categoria>/<nombre>.tsx`.
2. Agrega su entrada a `REGISTRY` en `registry/index.ts` — sobre todo `npm`,
   `config` y `dependsOn`, que es lo que arma el bloque de requisitos.
3. Opcional: agrega una demo en `components/docs/demos/demos.tsx` y registrala
   en `components/docs/demos/index.ts`.

Si el componente usa un paquete que publica TSX/JSX sin compilar (los
`@rn-primitives/*`, por ejemplo), sumalo a `transpilePackages` en
`next.config.ts`.

## Decisiones que conviene no deshacer

**Webpack, no Turbopack.** Los scripts pasan `--webpack`. Librerias como
`react-native-svg` traen variantes `.web.js` y su entry por defecto importa
TurboModules nativos que `react-native-web` no implementa. Metro resuelve esto
priorizando la extension `.web.*`, y de los dos bundlers solo Webpack aplica esa
prioridad dentro de `node_modules` (`turbopack.resolveExtensions` solo afecta al
codigo de la app).

**Sin Babel.** NativeWind normalmente pide su plugin de Babel, pero ese plugin
solo hace dos cosas y la que importa es el `jsxImportSource`. Eso lo hace SWC
nativamente via `tsconfig.json`, asi que Next conserva su compilador rapido.

**Tailwind 3.4, no 4.** `nativewind/preset` es Tailwind 3, y ademas asi el
catalogo comparte la configuracion exacta de los proyectos Expo de TM.

**`lucide-react-native`, no `@expo/vector-icons`.** Fuera de un proyecto Expo,
`@expo/vector-icons` arrastra `expo-font` -> `expo-modules-core` y termina
importando `node:async_hooks`, que no existe en el navegador. `lucide` se dibuja
con `react-native-svg` y ya era dependencia de TM-Admin-Forms.

**`react-native` esta en devDependencies.** Solo aporta los tipos: en runtime
todo se resuelve a `react-native-web` por alias. `npm audit` reporta vulns de
`metro` que vienen de ahi — metro nunca se ejecuta en este proyecto.

**`useAnimatedStyle` siempre lleva array de dependencias.** Sin el plugin de
Babel de reanimated, el hook lanza si no lo recibe — y este catalogo no usa
Babel. El array es igual de valido con el plugin activo, asi que no cambia nada
en nativo y ademas deja los componentes listos para correr la app en web.

**`__DEV__` se define en la config de Webpack.** Metro lo declara como global en
todo proyecto React Native y varias librerias (reanimated entre ellas) lo leen
sin comprobar que exista.

**La preview envuelve todo en un `SafeAreaProvider`** con `initialMetrics`
fijos. `BackButton`, `DrawerMenu` y `PickerModal` piden los insets del area
segura, que en una app real provee la raiz; sin metricas iniciales el prerender
del servidor falla con "No safe area value available".

**Los componentes animados llaman a `cssInterop`.** NativeWind no reconoce
`Animated.View` ni nada creado con `createAnimatedComponent`, asi que descarta
su `className` sin avisar. En el drawer eso se veia como un panel en blanco:
fondo azul perdido y texto blanco sobre blanco. `cssInterop(Componente, {
className: 'style' })` lo registra.

**Las previews son client-only** (`components/docs/client-only.tsx`). Varios
componentes de react-native-web no tienen equivalente estable en el servidor:
`Switch` emite atributos distintos y `useWindowDimensions` devuelve 0 sin
ventana. React no repara esas diferencias al hidratar, asi que se saltan el
prerender — que en una preview interactiva no aporta nada.

## Linea base de los componentes

Expo 54 · RN 0.81.5 · React 19.1 · NativeWind 4.2 · Tailwind 3.4

La cumplen TM-Admin-Forms, TM-Tracker-Expo, TM-Tracker_Premium_expo,
Entregas-carga, Protocolos e Intermunicipales. Los proyectos RN sin NativeWind
(TM_Tracker_Premium, TM_Intermunicipal, TM_Protocolos, entrgas_carga_api_35,
TMLAND_MOBILE_API_34) quedan fuera de esta tanda.
