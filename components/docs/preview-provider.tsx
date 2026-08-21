"use client";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "sonner-native";

/**
 * Reproduce los providers que en una app de TM viven en `app/_layout.tsx`, para
 * que las previews se comporten como en el dispositivo.
 *
 * - `GestureHandlerRootView` y `Toaster`: los pide sonner-native.
 * - `SafeAreaProvider`: lo piden BackButton, DrawerMenu y PickerModal.
 *
 * `initialMetrics` es obligatorio: sin valores iniciales el provider mide el
 * contenedor en el primer layout y `useSafeAreaInsets` lanza "No safe area
 * value available". Los numeros son los de un telefono con notch, para que la
 * preview muestre los mismos margenes que el dispositivo.
 */
const METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 47, left: 0, right: 0, bottom: 34 },
};

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={METRICS}>
        {children}
        <Toaster theme="light" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
