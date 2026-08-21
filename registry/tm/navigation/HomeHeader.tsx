import { Text } from '@/components/ui/text';
import { ArrowLeft, Menu } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

type Props = {
  title: string;
  /** true = boton de menu (abre el drawer); false = flecha de volver. */
  showMenu: boolean;
  onMenuPress: () => void;
  onBackPress: () => void;
};

/**
 * Barra superior de pantalla, con el titulo centrado.
 *
 * El View vacio de la derecha no es relleno: iguala el ancho del boton
 * izquierdo para que `justify-between` deje el titulo realmente centrado.
 */
export const HomeHeader = ({ title, showMenu, onMenuPress, onBackPress }: Props) => (
  <View className="flex-row items-center justify-between border-b border-slate-200 bg-transparent px-4 py-3">
    <Pressable
      onPress={showMenu ? onMenuPress : onBackPress}
      hitSlop={12}
      className="h-10 w-10 items-center justify-center rounded-xl active:opacity-60"
    >
      {showMenu ? (
        <Menu size={26} color="#1E3A8A" />
      ) : (
        <ArrowLeft size={22} color="#1E3A8A" />
      )}
    </Pressable>

    <Text className="text-base font-semibold text-slate-800">{title}</Text>

    <View className="w-10" />
  </View>
);
