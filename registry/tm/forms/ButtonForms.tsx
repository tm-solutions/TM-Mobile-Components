import React from 'react';
import { ActivityIndicator, Pressable, PressableProps, Text } from 'react-native';

interface ButtonFormsProps extends PressableProps {
  textButton: string;
  isLoading?: boolean;
}

/**
 * Boton principal de formularios, con estado de carga.
 *
 * Mientras `isLoading` esta activo se reemplaza el texto por un spinner y se
 * deshabilita el Pressable, para que un doble toque no dispare el submit dos
 * veces. `min-h-[40px]` evita que la fila salte de alto al cambiar entre texto
 * y spinner.
 */
const ButtonForms = ({ textButton, isLoading, disabled, ...rest }: ButtonFormsProps) => {
  return (
    <Pressable
      {...rest}
      disabled={disabled || isLoading}
      className="bg-[#395995] mt-5 rounded w-full cursor-pointer active:opacity-80 disabled:opacity-60 items-center justify-center min-h-[40px]"
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-medium tracking-wider text-center">
          {textButton}
        </Text>
      )}
    </Pressable>
  );
};

export default ButtonForms;
