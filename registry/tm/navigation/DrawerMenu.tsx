import { Text } from '@/components/ui/text';
import { ArrowLeft, Radio, User } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import React from 'react';
import { Pressable, Switch, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerItem } from './DrawerItem';

// Animated.View no es un componente que NativeWind reconozca solo: sin esto
// descarta el className y el panel se queda sin fondo — texto blanco sobre
// blanco. Registrarlo mapea className -> style, igual que en un View normal.
cssInterop(Animated.View, { className: 'style' });

type MenuItem = {
  label: string;
  /** Icono de lucide-react-native. Se pasa el componente, no un elemento. */
  icon: React.ComponentType<{
    size?: number;
    color?: string;
    strokeWidth?: number;
  }>;
  onPress: () => void;
  active?: boolean;
  /** Dibuja una linea separadora debajo de este item. */
  divider?: boolean;
};

type DrawerMenuProps = {
  /** Valor 0..1 que controla la apertura. Sale del hook useDrawer. */
  progress: SharedValue<number>;
  onClose: () => void;
  /**
   * Titulo del encabezado (empresa o usuario). Se recibe por prop en vez de
   * leerlo de un AuthContext, para que el componente sirva en cualquier
   * proyecto sin arrastrar su contexto de sesion.
   */
  userName?: string | null;
  items: MenuItem[];
  bottomItems?: MenuItem[];
  /** Si se pasa onRealTimeChange, aparece el switch de tiempo real. */
  realTimeEnabled?: boolean;
  onRealTimeChange?: (value: boolean) => void;
};

const DRAWER_OPEN_DURATION = 320;
const DRAWER_CLOSE_DURATION = 260;

/**
 * Ancho del panel: 78% de la pantalla, con tope de 320.
 *
 * Es un hook y no una constante de modulo a proposito. Calcularlo una sola vez
 * con `Dimensions.get('window')` al importar lo deja congelado: no reacciona a
 * rotar el telefono, y si el modulo se evalua antes de que exista la ventana
 * (renderizado en servidor) el ancho queda en 0 y el panel se ve vacio.
 * `useWindowDimensions` se re-evalua cuando cambia el tamano.
 */
const useDrawerWidth = () => {
  const { width } = useWindowDimensions();
  return Math.min(width * 0.78, 320);
};

/**
 * Menu lateral deslizante.
 *
 * Se monta en un contenedor absoluto sobre la pantalla y se traslada segun
 * `progress`. El hook useDrawer maneja ese valor y ademas devuelve el estilo
 * para desplazar el contenido de la pantalla, de modo que el drawer parezca
 * empujarlo.
 */
const DrawerMenu = ({
  progress,
  onClose,
  userName,
  items,
  bottomItems,
  realTimeEnabled = false,
  onRealTimeChange,
}: DrawerMenuProps) => {
  const drawerWidth = useDrawerWidth();

  // El array de dependencias es obligatorio sin el plugin de Babel de
  // reanimated (al correr la app en web). Con el plugin se respeta igual.
  const drawerStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [-drawerWidth - 24, 0]) },
      ],
    }),
    [progress, drawerWidth]
  );

  return (
    <Animated.View
      className="absolute bottom-0 left-0 top-0 bg-blue-700"
      style={[{ width: drawerWidth }, drawerStyle]}
    >
      <SafeAreaView className="flex-1" edges={['top', 'bottom', 'left']}>
        <View className="flex-row justify-end px-3 pt-2">
          <Pressable onPress={onClose} hitSlop={12} className="p-2 active:opacity-60">
            <ArrowLeft size={26} color="#fff" />
          </Pressable>
        </View>

        <View className="items-center px-5 pb-2">
          <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-white">
            <User size={25} color="#fff" />
          </View>
          <Text
            className="mt-3 text-center font-semibold uppercase text-white"
            numberOfLines={1}
          >
            {userName ?? 'Usuario'}
          </Text>
        </View>

        <View className="mx-3 my-4 h-px bg-white/15" />

        <View className="mt-2 px-4">
          {items.map((item, idx) => (
            <React.Fragment key={item.label}>
              <DrawerItem item={item} index={idx} progress={progress} />
              {item.divider ? <View className="mx-3 my-3 h-px bg-white/15" /> : null}
            </React.Fragment>
          ))}
        </View>

        <View className="flex-1" />

        {onRealTimeChange ? (
          <View className="mb-5 px-4">
            <View className="flex-row items-center justify-between px-3 py-2">
              <View className="flex-1 flex-row items-center">
                <Radio size={20} color="#fff" strokeWidth={2.2} />
                <Text className="ml-3 text-[16px] font-medium text-white">
                  Tiempo real
                </Text>
              </View>
              <Switch
                value={realTimeEnabled}
                onValueChange={onRealTimeChange}
                trackColor={{ false: 'rgba(255,255,255,0.25)', true: '#22c55e' }}
                thumbColor="#fff"
                ios_backgroundColor="rgba(255,255,255,0.25)"
              />
            </View>
          </View>
        ) : null}

        {bottomItems && bottomItems.length > 0 ? (
          <View className="px-4 pb-2">
            <View className="mx-3 mb-1 h-px bg-white/15" />
            {bottomItems.map((item, idx) => (
              <DrawerItem
                key={item.label}
                item={item}
                index={items.length + idx}
                progress={progress}
              />
            ))}
          </View>
        ) : null}
      </SafeAreaView>
    </Animated.View>
  );
};

export {
  DRAWER_CLOSE_DURATION,
  DRAWER_OPEN_DURATION,
  DrawerMenu,
  useDrawerWidth,
};
export type { MenuItem };
