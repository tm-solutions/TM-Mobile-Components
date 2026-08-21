import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // tailwind.config.js es CommonJS por diseño: Tailwind 3 lo carga con
    // require(), igual que en los proyectos Expo de TM.
    files: ["tailwind.config.js", "postcss.config.mjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // registry/tm es código React Native: su destino son los proyectos Expo,
    // no esta app Next. Asignar a `.value` de un SharedValue es el patrón
    // documentado de reanimated para mutar desde el hilo de UI, pero el
    // React Compiler lo lee como mutación de un valor inmutable.
    files: ["registry/tm/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);

export default eslintConfig;
