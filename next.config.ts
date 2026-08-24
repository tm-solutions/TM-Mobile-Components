import type { NextConfig } from "next";

/**
 * Este catalogo renderiza componentes React Native reales en el navegador
 * (react-native-web), para que la vista previa sea el mismo archivo que el dev
 * copia a su proyecto Expo.
 *
 * Se usa Webpack y no Turbopack a proposito: librerias como react-native-svg
 * traen variantes `.web.js` y su entry por defecto importa TurboModules
 * nativos que react-native-web no implementa. Metro resuelve esto priorizando
 * la extension `.web.*`, y de los dos bundlers solo Webpack aplica esa
 * prioridad dentro de node_modules (`turbopack.resolveExtensions` solo afecta
 * al codigo de la app). Los scripts de package.json pasan `--webpack`.
 */
const nextConfig: NextConfig = {
  // Empaqueta el server y solo las dependencias trazadas en .next/standalone,
  // que es lo que copia el Dockerfile.
  output: "standalone",

  // Publican TSX/JSX sin compilar, o codigo que necesita pasar por el alias.
  // Al sumar un @rn-primitives/* nuevo al registry, agregalo aqui.
  transpilePackages: [
    "react-native",
    "react-native-web",
    "nativewind",
    "react-native-css-interop",
    "@rn-primitives/slot",
    "sonner-native",
    "react-native-gesture-handler",
    "react-native-screens",
  ],

  webpack: (config, { webpack, dev }) => {
    // Metro define __DEV__ como global en todo proyecto React Native, y varias
    // librerias (reanimated entre ellas) lo leen sin comprobar que exista.
    config.plugins.push(
      new webpack.DefinePlugin({ __DEV__: JSON.stringify(dev) })
    );

    // Mismo orden que Metro: la variante web gana sobre la nativa.
    config.resolve.extensions = [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ...config.resolve.extensions,
    ];

    // `$` = coincidencia exacta: "react-native" va a react-native-web, pero
    // los imports profundos (react-native/Libraries/...) se dejan intactos.
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native$": "react-native-web",
    };

    // @expo/vector-icons importa sus fuentes .ttf directamente. En Expo las
    // resuelve Metro; aqui hay que emitirlas como assets.
    config.module.rules.push({
      test: /\.ttf$/,
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;
