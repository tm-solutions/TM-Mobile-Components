import {
  DRAWER_CLOSE_DURATION,
  DRAWER_OPEN_DURATION,
  useDrawerWidth,
} from '@/components/navigation/DrawerMenu';
import { useState } from 'react';
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

/**
 * Estado y animacion del DrawerMenu.
 *
 * `mounted` existe para no dejar el drawer en el arbol cuando esta cerrado: se
 * pone en true al abrir y solo vuelve a false cuando la animacion de cierre
 * termina de verdad. Por eso el callback de withTiming es un worklet y usa
 * `scheduleOnRN` — corre en el hilo de UI y no puede tocar el estado de React
 * directamente.
 *
 * Uso:
 *   const { mounted, progress, open, close, contentStyle, overlayStyle } = useDrawer();
 *
 *   <Animated.View style={contentStyle}>...contenido de la pantalla...</Animated.View>
 *   {mounted && (
 *     <>
 *       <Animated.View style={overlayStyle} />
 *       <DrawerMenu progress={progress} onClose={close} items={items} />
 *     </>
 *   )}
 */
export const useDrawer = () => {
  const [mounted, setMounted] = useState(false);
  const progress = useSharedValue(0);
  const drawerWidth = useDrawerWidth();

  const open = () => {
    setMounted(true);
    progress.value = withTiming(1, {
      duration: DRAWER_OPEN_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  };

  const close = () => {
    progress.value = withTiming(
      0,
      {
        duration: DRAWER_CLOSE_DURATION,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        'worklet';
        if (finished) scheduleOnRN(setMounted, false);
      }
    );
  };

  // Desplaza el contenido de la pantalla para que el drawer parezca empujarlo.
  // El array de dependencias es obligatorio sin el plugin de Babel de
  // reanimated (al correr la app en web). Con el plugin se respeta igual.
  const contentStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: interpolate(progress.value, [0, 1], [0, drawerWidth]) }],
    }),
    [progress, drawerWidth]
  );

  const overlayStyle = useAnimatedStyle(() => ({ opacity: progress.value }), [progress]);

  return { mounted, progress, open, close, contentStyle, overlayStyle };
};
