/**
 * Mapa slug del registry -> demo.
 *
 * Este archivo NO lleva "use client" a proposito. Las demos si son componentes
 * cliente (viven en ./demos), pero el mapa tiene que construirse en el servidor:
 * las exportaciones de un modulo "use client" llegan al servidor como
 * referencias opacas, asi que un objeto declarado alli no se puede indexar
 * desde un Server Component — DEMOS[slug] siempre daria undefined.
 *
 * Un slug sin entrada aqui simplemente no muestra vista previa.
 */
import {
  BackButtonDemo,
  ButtonDemo,
  ButtonFormsDemo,
  ConfirmDemo,
  ContainerLoginDemo,
  ControlledInputDemo,
  DrawerItemDemo,
  DrawerMenuDemo,
  HomeHeaderDemo,
  NotifyDemo,
  PickerModalDemo,
  SelectCardDemo,
  SignaturePadDemo,
  TextDemo,
  UseDrawerDemo,
  UserInputDemo,
} from "./demos";

export const DEMOS: Record<string, React.ComponentType> = {
  text: TextDemo,
  button: ButtonDemo,
  "button-forms": ButtonFormsDemo,
  "controlled-input": ControlledInputDemo,
  "signature-pad": SignaturePadDemo,
  "user-input": UserInputDemo,
  "select-card": SelectCardDemo,
  "picker-modal": PickerModalDemo,
  "home-header": HomeHeaderDemo,
  "back-button": BackButtonDemo,
  "drawer-menu": DrawerMenuDemo,
  "drawer-item": DrawerItemDemo,
  "use-drawer": UseDrawerDemo,
  "container-login": ContainerLoginDemo,
  notify: NotifyDemo,
  confirm: ConfirmDemo,
};
