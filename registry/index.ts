/**
 * Registro de componentes del catalogo.
 *
 * El codigo NO se duplica aqui: cada item apunta a su archivo real en
 * `registry/tm/**` y la ficha lo lee del disco al renderizar. Asi lo que el dev
 * copia es literalmente el mismo archivo que se esta previsualizando.
 */

export type NpmDep = {
  pkg: string;
  version: string;
  /** true => se instala con `npx expo install` (Expo fija la version compatible). */
  expo: boolean;
  reason: string;
};

export type ConfigStep = {
  file: string;
  reason: string;
  snippet?: string;
};

export type Category =
  | "base"
  | "formularios"
  | "navegacion"
  | "layout"
  | "avisos";

export type RegistryItem = {
  slug: string;
  name: string;
  category: Category;
  description: string;
  /** Ruta del archivo fuente dentro de este repo. */
  source: string;
  /** Donde debe pegarse en el proyecto destino. */
  target: string;
  npm: NpmDep[];
  config: ConfigStep[];
  /** Otros slugs del registry que deben copiarse antes. */
  dependsOn: string[];
  /** Se muestra en la ficha como nota destacada. */
  notes?: string[];
};

/**
 * Requisitos del proyecto, una sola vez. Aplican a todos los componentes, por
 * eso no se repiten en cada ficha.
 */
export const SETUP: ConfigStep[] = [
  {
    file: "package.json",
    reason:
      "Linea base contra la que se prueban los componentes: Expo 54, RN 0.81.5, NativeWind 4.2 y Tailwind 3.4. Ya la cumplen TM-Admin-Forms, TM-Tracker-Expo, TM-Tracker_Premium_expo, Entregas-carga, Protocolos e Intermunicipales.",
  },
  {
    file: "tailwind.config.js",
    reason:
      "Los componentes usan tokens semanticos (bg-primary, text-muted-foreground, border-border). Sin estos colores las clases no generan CSS y el componente sale sin estilo.",
    snippet: `const { hairlineWidth } = require('nativewind/theme');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      borderWidth: { hairline: hairlineWidth() },
    },
  },
  plugins: [require('tailwindcss-animate')],
};`,
  },
  {
    file: "global.css",
    reason:
      "Define los valores HSL de los tokens anteriores. Esta es la paleta de TM-Tracker_Premium_expo: azul #1D4ED8 (blue-700) sobre grises slate. Es el archivo que importa tu layout raiz.",
    snippet: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    /* blue-700 #1D4ED8 */
    --primary: 224.3 76.3% 48%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 224.3 76.3% 48%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    /* blue-500: el blue-700 no contrasta lo suficiente en oscuro */
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}`,
  },
  {
    file: "tsconfig.json",
    reason:
      "Los componentes importan con el alias @/. Si tu proyecto usa otro prefijo, ajusta los imports al pegar.",
    snippet: `{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}`,
  },
];

export const CATEGORIES: { key: Category; label: string; description: string }[] = [
  {
    key: "base",
    label: "Base",
    description: "Piezas compartidas. Se copian una sola vez por proyecto.",
  },
  {
    key: "formularios",
    label: "Formularios",
    description: "Captura de datos, seleccion y firma.",
  },
  {
    key: "navegacion",
    label: "Navegacion",
    description: "Menu lateral, encabezados y botones de navegacion.",
  },
  {
    key: "avisos",
    label: "Avisos",
    description: "Toasts y dialogos de confirmacion.",
  },
  {
    key: "layout",
    label: "Layout",
    description: "Contenedores de pantalla.",
  },
];

/**
 * notify y confirm viven en el mismo archivo, asi que comparten requisitos: el
 * dev que copie `lib/notify.ts` desde cualquiera de las dos fichas necesita
 * todo esto.
 */
const DEPS_SONNER: NpmDep[] = [
  {
    pkg: "sonner-native",
    version: "^0.24.0",
    expo: false,
    reason: "Motor de toasts. Ya lo usan los 6 proyectos Expo de TM.",
  },
  {
    pkg: "react-native-gesture-handler",
    version: "~2.28.0",
    expo: true,
    reason: "Peer de sonner-native: permite descartar el toast deslizando.",
  },
  {
    pkg: "react-native-reanimated",
    version: "~4.1.1",
    expo: true,
    reason: "Peer de sonner-native: anima la entrada y salida.",
  },
  {
    pkg: "react-native-safe-area-context",
    version: "~5.6.0",
    expo: true,
    reason: "Peer de sonner-native: evita el notch al posicionar el toast.",
  },
  {
    pkg: "react-native-screens",
    version: "~4.16.0",
    expo: true,
    reason: "Peer de sonner-native.",
  },
  {
    pkg: "react-native-svg",
    version: "15.12.1",
    expo: true,
    reason: "Peer de sonner-native: dibuja los iconos de cada tipo.",
  },
];

export const REGISTRY: RegistryItem[] = [
  {
    slug: "utils",
    name: "cn()",
    category: "base",
    description:
      "Une clases de Tailwind resolviendo conflictos. Sin esto, una clase condicional no puede sobrescribir a la base.",
    source: "registry/tm/lib/utils.ts",
    target: "lib/utils.ts",
    npm: [
      { pkg: "clsx", version: "^2.1.1", expo: false, reason: "Arma la lista de clases condicionales." },
      {
        pkg: "tailwind-merge",
        version: "^3.5.0",
        expo: false,
        reason: "Resuelve conflictos: la ultima clase del mismo grupo gana.",
      },
    ],
    config: [],
    dependsOn: [],
  },
  {
    slug: "text",
    name: "Text",
    category: "base",
    description:
      "Texto con variantes tipograficas (h1-h4, p, muted, code...). Provee TextClassContext, que Button usa para colorear su etiqueta.",
    source: "registry/tm/ui/text.tsx",
    target: "components/ui/text.tsx",
    npm: [
      {
        pkg: "@rn-primitives/slot",
        version: "^1.4.0",
        expo: false,
        reason: "Habilita asChild para delegar el estilo a un hijo.",
      },
      {
        pkg: "class-variance-authority",
        version: "^0.7.1",
        expo: false,
        reason: "Define las variantes tipograficas.",
      },
    ],
    config: [],
    dependsOn: ["utils"],
    notes: [
      "Limita el escalado de fuente del sistema a 1.3x para que los formularios no se desborden con accesibilidad al 200%.",
    ],
  },
  {
    slug: "button",
    name: "Button",
    category: "base",
    description:
      "Boton con variantes (default, destructive, outline, secondary, ghost, link) y tamanos. Colorea su texto via TextClassContext.",
    source: "registry/tm/ui/button.tsx",
    target: "components/ui/button.tsx",
    npm: [
      {
        pkg: "class-variance-authority",
        version: "^0.7.1",
        expo: false,
        reason: "Define variantes y tamanos.",
      },
    ],
    config: [],
    dependsOn: ["utils", "text"],
    notes: ["El contenido va como hijo: <Button><Text>Guardar</Text></Button>."],
  },
  {
    slug: "button-forms",
    name: "ButtonForms",
    category: "formularios",
    description:
      "Boton de submit con spinner de carga. Se deshabilita solo mientras isLoading para evitar envios duplicados.",
    source: "registry/tm/forms/ButtonForms.tsx",
    target: "components/forms/ButtonForms.tsx",
    npm: [],
    config: [],
    dependsOn: [],
    notes: [
      "Usa el azul corporativo #395995 como literal, para que funcione sin tocar tailwind.config.js.",
    ],
  },
  {
    slug: "controlled-input",
    name: "ControlledInput",
    category: "formularios",
    description:
      "TextInput conectado a react-hook-form, con mensaje de error debajo y ojo de mostrar/ocultar contrasena.",
    source: "registry/tm/forms/ControlledInput.tsx",
    target: "components/forms/ControlledInput.tsx",
    npm: [
      {
        pkg: "react-hook-form",
        version: "^7.72.1",
        expo: false,
        reason: "Provee Controller y el estado de validacion.",
      },
      {
        pkg: "lucide-react-native",
        version: "^1.8.0",
        expo: false,
        reason: "Iconos de ojo (Eye / EyeOff). Se dibujan con react-native-svg.",
      },
      {
        pkg: "react-native-svg",
        version: "15.12.1",
        expo: true,
        reason: "Motor de dibujo que usa lucide-react-native.",
      },
    ],
    config: [],
    dependsOn: ["utils"],
    notes: [
      "Version corregida: la original recibia className pero lo descartaba, asi que el borde rojo de error nunca se veia. Aca las clases se combinan con cn().",
      "Absorbe el ThemedTextInput de FormAdmin.tsx: es un solo archivo, no hay que copiar nada mas.",
    ],
  },
  {
    slug: "signature-pad",
    name: "SignaturePad",
    category: "formularios",
    description:
      "Lienzo de firma a dedo. Exporta la firma como SVG en base64 y expone clear(), isEmpty() y toBase64() por ref.",
    source: "registry/tm/forms/SignaturePad.tsx",
    target: "components/forms/SignaturePad.tsx",
    npm: [
      {
        pkg: "react-native-svg",
        version: "15.12.1",
        expo: true,
        reason: "Dibuja los trazos como paths vectoriales.",
      },
      {
        pkg: "lucide-react-native",
        version: "^1.8.0",
        expo: false,
        reason: "Iconos de lapiz y refrescar (PenLine / RefreshCw).",
      },
    ],
    config: [],
    dependsOn: ["utils", "text"],
    notes: [
      "El PanResponder captura el gesto desde el inicio, asi que funciona dentro de un ScrollView sin desactivarle el scroll al padre.",
      "No uses onSignStart/onSignEnd para hacer scrollEnabled={false}: si el evento de fin no llega, el contenedor queda sin scroll para siempre.",
      "La firma sale como data:image/svg+xml;base64 — es texto, pesa poco y se manda directo al API.",
    ],
  },
  {
    slug: "user-input",
    name: "UserInput",
    category: "formularios",
    description:
      "Input de una linea con boton opcional de mostrar/ocultar contrasena. Es el de las pantallas de login.",
    source: "registry/tm/forms/UserInput.tsx",
    target: "components/forms/UserInput.tsx",
    npm: [
      {
        pkg: "lucide-react-native",
        version: "^1.8.0",
        expo: false,
        reason: "Iconos de ojo (Eye / EyeOff).",
      },
      {
        pkg: "react-native-svg",
        version: "15.12.1",
        expo: true,
        reason: "Motor de dibujo que usa lucide-react-native.",
      },
    ],
    config: [],
    dependsOn: ["utils"],
    notes: [
      "Estaba repetido en 5 proyectos con 3 versiones distintas. Esta es la de TM-Tracker_Premium_expo.",
      "No guarda el estado de la contrasena: tu pantalla decide el valor de secureTextEntry. Si quieres validacion integrada, usa ControlledInput.",
    ],
  },
  {
    slug: "select-card",
    name: "SelectCard",
    category: "formularios",
    description:
      "Tarjeta que muestra la seleccion actual y abre un PickerModal al tocarla. Soporta estado de carga y deshabilitado.",
    source: "registry/tm/forms/SelectCard.tsx",
    target: "components/forms/SelectCard.tsx",
    npm: [
      {
        pkg: "lucide-react-native",
        version: "^1.8.0",
        expo: false,
        reason: "Chevron indicador (ChevronDown).",
      },
      {
        pkg: "react-native-svg",
        version: "15.12.1",
        expo: true,
        reason: "Motor de dibujo que usa lucide-react-native.",
      },
    ],
    config: [],
    dependsOn: ["utils", "text"],
    notes: ["Va de la mano con PickerModal: esta es la parte visible, aquel es la lista."],
  },
  {
    slug: "picker-modal",
    name: "PickerModal",
    category: "formularios",
    description:
      "Hoja inferior para elegir de una lista, con buscador y modo multiseleccion. Es generica: tu decides como se dibuja cada fila.",
    source: "registry/tm/forms/PickerModal.tsx",
    target: "components/forms/PickerModal.tsx",
    npm: [
      {
        pkg: "lucide-react-native",
        version: "^1.8.0",
        expo: false,
        reason: "Iconos de buscar, cerrar y check.",
      },
      {
        pkg: "react-native-svg",
        version: "15.12.1",
        expo: true,
        reason: "Motor de dibujo que usa lucide-react-native.",
      },
      {
        pkg: "react-native-safe-area-context",
        version: "~5.6.0",
        expo: true,
        reason: "Respeta la barra inferior de gestos al fijar el boton Listo.",
      },
    ],
    config: [],
    dependsOn: ["utils", "text"],
    notes: [
      "Para que el buscador filtre hay que pasar `filterFn`; con `searchable` solo, la lista no se filtra.",
      "En multiSelect el modal no se cierra al elegir: se cierra con el boton Listo.",
    ],
  },
  {
    slug: "home-header",
    name: "HomeHeader",
    category: "navegacion",
    description:
      "Barra superior con titulo centrado. Alterna entre boton de menu (abre el drawer) y flecha de volver.",
    source: "registry/tm/navigation/HomeHeader.tsx",
    target: "components/navigation/HomeHeader.tsx",
    npm: [
      {
        pkg: "lucide-react-native",
        version: "^1.8.0",
        expo: false,
        reason: "Iconos de menu y flecha (Menu / ArrowLeft).",
      },
      {
        pkg: "react-native-svg",
        version: "15.12.1",
        expo: true,
        reason: "Motor de dibujo que usa lucide-react-native.",
      },
    ],
    config: [],
    dependsOn: ["utils", "text"],
    notes: [
      "Estaba repetido en 5 proyectos, los 5 distintos. El original mezclaba Ionicons y lucide en el mismo archivo; aca todo es lucide.",
    ],
  },
  {
    slug: "back-button",
    name: "BackButton",
    category: "navegacion",
    description:
      "Flecha de volver flotante para pantallas sin header (login, mapa). Se ubica bajo el notch usando los insets del area segura.",
    source: "registry/tm/navigation/BackButton.tsx",
    target: "components/navigation/BackButton.tsx",
    npm: [
      {
        pkg: "lucide-react-native",
        version: "^1.8.0",
        expo: false,
        reason: "Icono de flecha (ArrowLeft).",
      },
      {
        pkg: "react-native-svg",
        version: "15.12.1",
        expo: true,
        reason: "Motor de dibujo que usa lucide-react-native.",
      },
      {
        pkg: "react-native-safe-area-context",
        version: "~5.6.0",
        expo: true,
        reason: "Da el inset superior para no quedar tapado por el notch.",
      },
    ],
    config: [],
    dependsOn: [],
    notes: [
      "Recibe onPress en vez de llamar a router.back() adentro, asi no queda atado a expo-router. Con expo-router: onPress={() => router.canGoBack() && router.back()}",
    ],
  },
  {
    slug: "drawer-item",
    name: "DrawerItem",
    category: "navegacion",
    description:
      "Fila del DrawerMenu, con entrada escalonada y rebote al presionar. No se usa suelto.",
    source: "registry/tm/navigation/DrawerItem.tsx",
    target: "components/navigation/DrawerItem.tsx",
    npm: [
      {
        pkg: "react-native-reanimated",
        version: "~4.1.1",
        expo: true,
        reason: "Anima opacidad, desplazamiento y escala en el hilo de UI.",
      },
      {
        pkg: "nativewind",
        version: "^4.2.4",
        expo: false,
        reason:
          "cssInterop, para que el Pressable animado acepte className. Ya lo tienes instalado.",
      },
    ],
    config: [],
    dependsOn: [],
    notes: [
      "Se copia junto con DrawerMenu: le importa el tipo MenuItem y no funciona por separado.",
      "La llamada a cssInterop no es opcional: los componentes creados con createAnimatedComponent no los reconoce NativeWind y descartan el className.",
    ],
  },
  {
    slug: "drawer-menu",
    name: "DrawerMenu",
    category: "navegacion",
    description:
      "Menu lateral deslizante con encabezado de usuario, lista de items, seccion inferior y switch opcional de tiempo real.",
    source: "registry/tm/navigation/DrawerMenu.tsx",
    target: "components/navigation/DrawerMenu.tsx",
    npm: [
      {
        pkg: "react-native-reanimated",
        version: "~4.1.1",
        expo: true,
        reason: "Desplaza el panel segun el valor de progress.",
      },
      {
        pkg: "react-native-safe-area-context",
        version: "~5.6.0",
        expo: true,
        reason: "Evita el notch y la barra de gestos dentro del panel.",
      },
      {
        pkg: "lucide-react-native",
        version: "^1.8.0",
        expo: false,
        reason: "Iconos del encabezado y del switch.",
      },
      {
        pkg: "react-native-svg",
        version: "15.12.1",
        expo: true,
        reason: "Motor de dibujo que usa lucide-react-native.",
      },
      {
        pkg: "nativewind",
        version: "^4.2.4",
        expo: false,
        reason:
          "cssInterop, para que Animated.View acepte className. Ya lo tienes instalado.",
      },
    ],
    config: [],
    dependsOn: ["utils", "text", "drawer-item"],
    notes: [
      "Necesita el hook useDrawer para funcionar: el es quien produce el valor de progress y monta/desmonta el panel.",
      "La llamada a cssInterop no es opcional: sin ella Animated.View descarta el className y el panel se ve en blanco, con el texto blanco sobre fondo blanco.",
      "Estaba repetido en 4 proyectos, los 4 distintos (de 3.4KB a 4.5KB). Esta es la de TM-Tracker_Premium_expo.",
      "El original leia el nombre de la empresa de useAuth(); aca entra por la prop userName, para que no arrastre el contexto de sesion de ningun proyecto.",
      "Los iconos se pasan como componente, no como elemento: icon: Radio, no icon: <Radio />.",
    ],
  },
  {
    slug: "use-drawer",
    name: "useDrawer",
    category: "navegacion",
    description:
      "Hook que maneja la apertura del DrawerMenu: estado de montaje, valor animado y los estilos para desplazar el contenido.",
    source: "registry/tm/hooks/useDrawer.ts",
    target: "hooks/useDrawer.ts",
    npm: [
      {
        pkg: "react-native-reanimated",
        version: "~4.1.1",
        expo: true,
        reason: "withTiming y los estilos animados.",
      },
      {
        pkg: "react-native-worklets",
        version: "^0.8.3",
        expo: true,
        reason: "scheduleOnRN, para volver al hilo de JS desde el worklet de cierre.",
      },
    ],
    config: [],
    dependsOn: ["drawer-item", "drawer-menu"],
    notes: [
      "Desmonta el drawer solo cuando la animacion de cierre termina de verdad; por eso el callback es un worklet y usa scheduleOnRN.",
      "Importa las constantes de ancho y duracion de DrawerMenu, asi que ese archivo va primero.",
    ],
  },
  {
    slug: "container-login",
    name: "ContainerLogin",
    category: "layout",
    description:
      "Contenedor de pantallas de login: centra el formulario, lo mantiene visible con el teclado abierto y cierra el teclado al tocar afuera.",
    source: "registry/tm/layout/ContainerLogin.tsx",
    target: "components/layout/ContainerLogin.tsx",
    npm: [],
    config: [],
    dependsOn: [],
    notes: [
      "Estaba repetido en 5 proyectos, los 5 distintos. Esta es la de TM-Tracker_Premium_expo.",
      "El original renderizaba un BackButton atado a expo-router. Aca el boton entra por la prop header, para que el contenedor no dependa del router.",
      'keyboardShouldPersistTaps="handled" no es opcional: sin eso el primer toque en el boton de enviar solo cierra el teclado.',
    ],
  },
  {
    slug: "notify",
    name: "notify",
    category: "avisos",
    description:
      "Toasts de error, exito, advertencia e info sobre sonner-native. Es el aviso que no interrumpe: aparece, informa y se va solo.",
    source: "registry/tm/lib/notify.ts",
    target: "lib/notify.ts",
    npm: DEPS_SONNER,
    config: [
      {
        file: "app/_layout.tsx",
        reason:
          "Hay que montar <Toaster /> una vez en la raiz, dentro de GestureHandlerRootView y SafeAreaProvider. Sin el, las llamadas a notify no muestran nada y tampoco lanzan error.",
        snippet: `import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* ...tu Stack y demas providers... */}
        <Toaster theme="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}`,
      },
    ],
    dependsOn: [],
    notes: [
      "Los 6 proyectos ya montan <Toaster /> y suman 321 llamadas a toast: 189 error, 75 success, 51 warning y 6 info. Esto solo les pone un nombre y un tipo comun.",
      "El archivo trae tambien confirm(), para el dialogo que si interrumpe. Es un solo archivo: al copiarlo tienes los dos.",
    ],
  },
  {
    slug: "confirm",
    name: "confirm",
    category: "avisos",
    description:
      "Dialogo de confirmacion sobre Alert.alert, pero con promesa en vez de callbacks. Para acciones que no se pueden deshacer.",
    source: "registry/tm/lib/notify.ts",
    target: "lib/notify.ts",
    npm: DEPS_SONNER,
    config: [],
    dependsOn: [],
    notes: [
      "Vive en el mismo archivo que notify: si ya copiaste uno, tienes el otro.",
      "Devuelve Promise<boolean>, asi el flujo se escribe en linea: if (!(await confirm({...}))) return;",
      "En los proyectos hay 110 Alert.alert escritos a mano, muchos repitiendo el par Cancelar / destructivo.",
      "cancelable:false y onDismiss cubren el caso de Android en que se cierra tocando fuera: sin eso la promesa nunca resuelve y el flujo se queda colgado.",
      "En web cae a window.confirm: react-native-web no implementa Alert, y sin esa rama la llamada no hace nada ni lanza, dejando el await colgado en silencio.",
    ],
  },
];

export function getItem(slug: string): RegistryItem | undefined {
  return REGISTRY.find((i) => i.slug === slug);
}

/**
 * Resuelve dependsOn recursivamente, en orden de copiado (dependencias primero)
 * y sin repetidos.
 */
export function resolveDeps(slug: string): RegistryItem[] {
  const out: RegistryItem[] = [];
  const seen = new Set<string>();

  const walk = (s: string) => {
    if (seen.has(s)) return;
    seen.add(s);
    const item = getItem(s);
    if (!item) return;
    item.dependsOn.forEach(walk);
    out.push(item);
  };

  const root = getItem(slug);
  root?.dependsOn.forEach(walk);
  return out;
}

/** Junta las dependencias npm del componente y de todas sus bases, sin repetir. */
export function collectNpm(slug: string): NpmDep[] {
  const item = getItem(slug);
  if (!item) return [];
  const all = [...resolveDeps(slug), item].flatMap((i) => i.npm);
  const seen = new Map<string, NpmDep>();
  all.forEach((d) => {
    if (!seen.has(d.pkg)) seen.set(d.pkg, d);
  });
  return [...seen.values()];
}

/** Comando de instalacion listo para copiar. */
export function installCommand(deps: NpmDep[]): string[] {
  const expo = deps.filter((d) => d.expo);
  const plain = deps.filter((d) => !d.expo);
  const cmds: string[] = [];
  if (expo.length) cmds.push(`npx expo install ${expo.map((d) => d.pkg).join(" ")}`);
  if (plain.length)
    cmds.push(`npm install ${plain.map((d) => `${d.pkg}@${d.version}`).join(" ")}`);
  return cmds;
}
