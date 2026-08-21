import { cssInterop } from 'nativewind';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MenuItem } from './DrawerMenu';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Un componente creado con createAnimatedComponent no lo reconoce NativeWind:
// sin esto descarta el className y la fila pierde su fondo y su espaciado.
cssInterop(AnimatedPressable, { className: 'style' });

/**
 * Fila del DrawerMenu. No se usa suelto: lo renderiza DrawerMenu.
 *
 * Cada fila entra escalonada segun su indice (`delay = index * 0.06`) y se
 * hunde levemente al presionarse. La animacion se deriva del mismo `progress`
 * que abre el drawer, en vez de tener su propio timer: asi si el usuario
 * cierra a medio camino, las filas se devuelven en sincronia con el panel.
 */
const DrawerItem = ({
  item,
  index,
  progress,
}: {
  item: MenuItem;
  index: number;
  progress: SharedValue<number>;
}) => {
  const pressed = useSharedValue(0);

  // El array de dependencias es obligatorio: sin el plugin de Babel de
  // reanimated (por ejemplo al correr la app en web) useAnimatedStyle lanza
  // si no lo recibe. Con el plugin activo se respeta igual, asi que ponerlo
  // no cambia nada en nativo.
  const animatedStyle = useAnimatedStyle(
    () => {
      const delay = index * 0.06;
      const adjusted = Math.max(0, Math.min(1, (progress.value - delay) / 0.6));
      return {
        opacity: adjusted,
        transform: [
          { translateX: interpolate(adjusted, [0, 1], [24, 0]) },
          { scale: interpolate(pressed.value, [0, 1], [1, 0.97]) },
        ],
      };
    },
    [index, progress, pressed]
  );

  const Icon = item.icon;
  const isActive = item.active;

  return (
    <AnimatedPressable
      onPress={item.onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 180 });
      }}
      className={`flex-row items-center gap-4 rounded-full px-3 py-3 ${
        isActive ? 'bg-white/15' : ''
      }`}
      style={animatedStyle}
    >
      {/* Sin borde en el item activo: el resalte lo dan el fondo de la fila
          (bg-white/15), el trazo mas grueso del icono y la tipografia. */}
      <View className="h-9 w-9 items-center justify-center rounded-full">
        <Icon size={25} color="#fff" strokeWidth={isActive ? 2.5 : 2} />
      </View>
      <Text
        className={`flex-1 text-[16px] text-white ${
          isActive ? 'font-semibold' : 'font-medium'
        }`}
      >
        {item.label}
      </Text>
    </AnimatedPressable>
  );
};

export { DrawerItem };
