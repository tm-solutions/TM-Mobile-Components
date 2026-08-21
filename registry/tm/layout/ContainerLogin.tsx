import React, { ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

type ContainerLoginProps = {
  children: ReactNode;
  /** Contenido extra sobre el formulario, normalmente un BackButton. */
  header?: ReactNode;
};

/**
 * Contenedor de las pantallas de login: centra el formulario y lo mantiene
 * visible cuando sube el teclado.
 *
 * Combina tres cosas que hay que poner juntas o el formulario queda tapado:
 * KeyboardAvoidingView (empuja el contenido), ScrollView con `flexGrow: 1`
 * (permite desplazarlo en pantallas bajas sin perder el centrado) y
 * TouchableWithoutFeedback (cierra el teclado al tocar afuera).
 *
 * `keyboardShouldPersistTaps="handled"` es necesario: sin eso, el primer toque
 * en el boton de enviar solo cierra el teclado y hay que tocar dos veces.
 */
const ContainerLogin = ({ children, header }: ContainerLoginProps) => {
  return (
    <View style={{ flex: 1 }} className="bg-background">
      {header}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 24,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ width: '100%', maxWidth: 350 }} className="items-center gap-4">
              {children}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export { ContainerLogin };
