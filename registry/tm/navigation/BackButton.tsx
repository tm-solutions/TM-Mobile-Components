import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  /**
   * Que hacer al volver. Se recibe por prop en vez de llamar a `router.back()`
   * adentro: asi el componente no queda atado a expo-router y sirve igual con
   * react-navigation o con un cierre de modal.
   *
   * Con expo-router: `onPress={() => router.canGoBack() && router.back()}`
   */
  onPress: () => void;
  color?: string;
  size?: number;
};

/**
 * Flecha de volver flotante, pensada para pantallas sin header (login, mapa).
 *
 * Se posiciona por debajo del notch usando los insets del area segura; con un
 * `top` fijo queda tapada en los telefonos con isla dinamica.
 */
const BackButton = ({ onPress, color = '#1D4ED8', size = 28 }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        zIndex: 10,
      }}
    >
      <ArrowLeft size={size} color={color} />
    </Pressable>
  );
};

export { BackButton };
