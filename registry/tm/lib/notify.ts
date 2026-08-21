import { Alert, Platform } from 'react-native';
import { toast } from 'sonner-native';

/**
 * Avisos de la app: mensajes que no interrumpen (toast) y confirmaciones que si
 * lo hacen (dialogo del sistema).
 *
 * La regla de cuando usar cada uno:
 *
 * - `notify.*` para informar algo ya ocurrido o una validacion que fallo. No
 *   bloquea y se va solo.
 * - `confirm` SOLO cuando el usuario debe decidir antes de una accion
 *   irreversible (borrar, descartar cambios, cerrar sesion). Interrumpe, asi
 *   que usarlo para simples avisos vuelve la app pesada de usar.
 */
export const notify = {
  /** Algo salio mal, o una validacion no paso. */
  error: (mensaje: string) => toast.error(mensaje),
  /** Una accion termino bien. */
  success: (mensaje: string) => toast.success(mensaje),
  /** Algo que conviene saber pero no impide seguir. */
  warning: (mensaje: string) => toast.warning(mensaje),
  /** Informacion neutra. */
  info: (mensaje: string) => toast.info(mensaje),
};

type ConfirmOpciones = {
  titulo: string;
  mensaje: string;
  /** Texto del boton que confirma. Por defecto "Continuar". */
  textoConfirmar?: string;
  /** Texto del boton que cancela. Por defecto "Cancelar". */
  textoCancelar?: string;
  /**
   * Marca la accion como destructiva: en iOS pinta el boton en rojo. Ponlo en
   * true cuando lo que sigue no se puede deshacer.
   */
  destructivo?: boolean;
};

/**
 * Dialogo de confirmacion.
 *
 * Devuelve una promesa con la decision, en vez de recibir callbacks como
 * `Alert.alert`. Eso permite escribir el flujo en linea:
 *
 *   if (!(await confirm({ titulo: 'Eliminar', mensaje: '...', destructivo: true }))) return;
 *   await eliminar();
 *
 * En lugar de anidar la logica dentro de un onPress.
 *
 * `cancelable: false` y el `onDismiss` que resuelve en false cubren el caso de
 * Android en que se cierra tocando fuera: sin eso la promesa nunca resuelve y
 * el flujo se queda colgado para siempre.
 */
export function confirm({
  titulo,
  mensaje,
  textoConfirmar = 'Continuar',
  textoCancelar = 'Cancelar',
  destructivo = false,
}: ConfirmOpciones): Promise<boolean> {
  // react-native-web no implementa Alert: la llamada no hace nada y tampoco
  // lanza, asi que sin esta rama la promesa no resuelve nunca y todo lo que
  // venga despues del `await` se queda colgado en silencio.
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensaje}`));
  }

  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensaje,
      [
        { text: textoCancelar, style: 'cancel', onPress: () => resolve(false) },
        {
          text: textoConfirmar,
          style: destructivo ? 'destructive' : 'default',
          onPress: () => resolve(true),
        },
      ],
      { cancelable: false, onDismiss: () => resolve(false) }
    );
  });
}
