import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';

interface UserInputProps extends React.ComponentProps<typeof TextInput> {
  /** Muestra el boton de mostrar/ocultar. Tambien se activa si pasas el handler. */
  viewPasswordIcon?: boolean;
  handleViewPasswordToggle?: () => void;
}

/**
 * Input de una linea, el que usan las pantallas de login.
 *
 * El estado de la contrasena vive afuera: este componente solo dibuja el ojo y
 * avisa; quien lo usa decide el valor de `secureTextEntry`. Para un input
 * conectado a react-hook-form con validacion, usa ControlledInput.
 */
const UserInput = ({
  viewPasswordIcon,
  handleViewPasswordToggle,
  className,
  ...rest
}: UserInputProps) => {
  const showToggle = viewPasswordIcon || !!handleViewPasswordToggle;

  return (
    <View className="w-full">
      <TextInput
        {...rest}
        placeholderTextColor="#9CA3AF"
        className={cn(
          'h-12 w-full rounded-md border border-input bg-background px-4 pr-10 text-base text-gray-900',
          // Android centra el texto solo; iOS lo deja pegado arriba en inputs altos.
          Platform.OS === 'ios' && 'pb-1',
          className
        )}
      />

      {showToggle && (
        <Pressable
          onPress={handleViewPasswordToggle}
          hitSlop={8}
          className="absolute right-3 top-3 opacity-50"
        >
          {rest.secureTextEntry ? (
            <Eye size={22} color="black" />
          ) : (
            <EyeOff size={22} color="black" />
          )}
        </Pressable>
      )}
    </View>
  );
};

export default UserInput;
