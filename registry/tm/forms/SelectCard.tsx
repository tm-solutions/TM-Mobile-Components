import { Text } from '@/components/ui/text';
import { ChevronDown } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

export type SelectCardProps = {
  label: string;
  value: string | null;
  placeholder: string;
  /** Icono ya renderizado, p. ej. <Truck size={22} color="#1D4ED8" />. */
  icon: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

/**
 * Tarjeta que muestra la seleccion actual y abre un PickerModal al tocarla.
 *
 * Es solo el disparador: no guarda estado ni conoce la lista de opciones. La
 * pareja habitual es SelectCard + PickerModal, con el valor viviendo en la
 * pantalla.
 */
export const SelectCard = ({
  label,
  value,
  placeholder,
  icon,
  onPress,
  loading,
  disabled,
}: SelectCardProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    className={`flex-row items-center rounded-2xl bg-white px-4 py-4 ${
      disabled || loading ? 'opacity-70' : 'active:opacity-90'
    }`}
    style={{
      shadowColor: '#0f172a',
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    }}
  >
    <View className="h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
      {icon}
    </View>
    <View className="ml-3 flex-1">
      <Text className="text-xs font-medium text-slate-500">{label}</Text>
      <Text
        className={`mt-0.5 text-base ${
          value ? 'font-semibold text-slate-800' : 'text-slate-400'
        }`}
        numberOfLines={1}
      >
        {value ?? placeholder}
      </Text>
    </View>
    {loading ? (
      <ActivityIndicator size="small" color="#1d4ed8" />
    ) : (
      <ChevronDown size={20} color="#94a3b8" />
    )}
  </Pressable>
);
