import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Control,
  Controller,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';

interface ControlledInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  isPassword?: boolean;
  /** Reglas de validacion de react-hook-form (required, minLength, pattern...). */
  rules?: Omit<
    RegisterOptions<T, Path<T>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >;
}

/**
 * TextInput conectado a react-hook-form, con mensaje de error y ojo de
 * mostrar/ocultar contrasena.
 *
 * El estilo base y el `className` de estado se combinan con `cn()`: si se
 * concatenan a mano, tailwind-merge no puede resolver el conflicto y la clase
 * de error (`border-red-500`) queda pisada por el borde base.
 */
const ControlledInput = <T extends FieldValues>({
  control,
  name,
  isPassword,
  className,
  rules,
  ...textInputProps
}: ControlledInputProps<T>) => {
  const [isSecure, setIsSecure] = useState(isPassword || textInputProps.secureTextEntry);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="w-full mb-3">
          <View className="relative w-full justify-center">
            <TextInput
              {...textInputProps}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry={isPassword ? isSecure : textInputProps.secureTextEntry}
              placeholderTextColor="grey"
              className={cn(
                'py-2 px-2 text-black dark:text-white border border-slate-400 rounded w-full',
                error && 'border-red-500',
                isPassword && 'pr-10',
                className
              )}
            />
            {isPassword && (
              <Pressable onPress={() => setIsSecure(!isSecure)} className="absolute right-3">
                {isSecure ? (
                  <EyeOff size={20} color="gray" />
                ) : (
                  <Eye size={20} color="gray" />
                )}
              </Pressable>
            )}
          </View>
          {error && <Text className="text-red-500 text-xs mt-1 ml-1">{error.message}</Text>}
        </View>
      )}
    />
  );
};

export default ControlledInput;
