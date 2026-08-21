"use client";

import { Map, Radio, Truck } from "lucide-react-native";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import ButtonForms from "@/components/forms/ButtonForms";
import ControlledInput from "@/components/forms/ControlledInput";
import { PickerModal } from "@/components/forms/PickerModal";
import { SelectCard } from "@/components/forms/SelectCard";
import {
  SignaturePad,
  type SignaturePadRef,
} from "@/components/forms/SignaturePad";
import UserInput from "@/components/forms/UserInput";
import { ContainerLogin } from "@/components/layout/ContainerLogin";
import { BackButton } from "@/components/navigation/BackButton";
import { DrawerMenu, type MenuItem } from "@/components/navigation/DrawerMenu";
import { HomeHeader } from "@/components/navigation/HomeHeader";
import { Text } from "@/components/ui/text";
import { confirm, notify } from "@/lib/notify";
import { useDrawer } from "@/hooks/useDrawer";

export function TextDemo() {
  return (
    <View className="gap-2">
      <Text variant="h3">Titulo h3</Text>
      <Text variant="p">
        Parrafo normal, el que usarias para el cuerpo de una pantalla.
      </Text>
      <Text variant="muted">Texto atenuado para ayudas y descripciones.</Text>
      <Text variant="small">Texto pequeno</Text>
      <Text variant="code">const x = 1</Text>
    </View>
  );
}

export function ButtonDemo() {
  const [pulsos, setPulsos] = useState(0);
  return (
    <View className="gap-3">
      <Text variant="muted">Pulsaciones: {pulsos}</Text>
      <Button onPress={() => setPulsos((p) => p + 1)}>
        <Text>Default</Text>
      </Button>
      <Button variant="secondary" onPress={() => setPulsos((p) => p + 1)}>
        <Text>Secondary</Text>
      </Button>
      <Button variant="outline" onPress={() => setPulsos((p) => p + 1)}>
        <Text>Outline</Text>
      </Button>
      <Button variant="destructive" onPress={() => setPulsos(0)}>
        <Text>Destructive (reinicia)</Text>
      </Button>
      <Button variant="ghost" onPress={() => setPulsos((p) => p + 1)}>
        <Text>Ghost</Text>
      </Button>
    </View>
  );
}

export function ButtonFormsDemo() {
  const [cargando, setCargando] = useState(false);

  const enviar = () => {
    setCargando(true);
    setTimeout(() => setCargando(false), 1600);
  };

  return (
    <View>
      <Text variant="muted">
        Toca para simular un envio: se bloquea 1.6s mostrando el spinner.
      </Text>
      <ButtonForms textButton="Guardar" isLoading={cargando} onPress={enviar} />
    </View>
  );
}

type LoginForm = { correo: string; clave: string };

export function ControlledInputDemo() {
  const [enviado, setEnviado] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { correo: "", clave: "" },
  });

  return (
    <View>
      <ControlledInput
        control={control}
        name="correo"
        placeholder="Correo"
        autoCapitalize="none"
        rules={{ required: "El correo es obligatorio" }}
      />
      <ControlledInput
        control={control}
        name="clave"
        placeholder="Contrasena"
        isPassword
        rules={{ required: "La contrasena es obligatoria" }}
      />
      <ButtonForms
        textButton="Enviar"
        onPress={handleSubmit((v) => setEnviado(v.correo))}
      />
      {enviado ? (
        <Text variant="muted" className="mt-3">
          Enviado como: {enviado}
        </Text>
      ) : (
        <Text variant="muted" className="mt-3">
          Envia vacio para ver los mensajes de error.
        </Text>
      )}
    </View>
  );
}

export function SignaturePadDemo() {
  const ref = useRef<SignaturePadRef>(null);
  const [largo, setLargo] = useState(0);

  return (
    <View className="gap-3">
      <SignaturePad
        ref={ref}
        onChange={(base64) => setLargo(base64?.length ?? 0)}
      />
      <Text variant="muted">
        {largo === 0
          ? "Dibuja con el mouse para firmar."
          : `Base64 generado: ${largo} caracteres`}
      </Text>
      <Button variant="outline" onPress={() => ref.current?.clear()}>
        <Text>Limpiar por ref</Text>
      </Button>
    </View>
  );
}

export function UserInputDemo() {
  const [oculto, setOculto] = useState(true);
  const [valor, setValor] = useState("");

  return (
    <View className="gap-3">
      <UserInput placeholder="Usuario" value={valor} onChangeText={setValor} />
      <UserInput
        placeholder="Contrasena"
        secureTextEntry={oculto}
        viewPasswordIcon
        handleViewPasswordToggle={() => setOculto((o) => !o)}
      />
      <Text variant="muted">
        Toca el ojo para alternar. El estado vive en la pantalla, no en el input.
      </Text>
    </View>
  );
}

const VEHICULOS = [
  { id: "1", placa: "ABC-123", modelo: "Kenworth T800" },
  { id: "2", placa: "DEF-456", modelo: "Freightliner Cascadia" },
  { id: "3", placa: "GHI-789", modelo: "Volvo FH16" },
  { id: "4", placa: "JKL-012", modelo: "Scania R450" },
];

export function SelectCardDemo() {
  const [abierto, setAbierto] = useState(false);
  const [sel, setSel] = useState<(typeof VEHICULOS)[number] | null>(null);

  return (
    <View>
      <SelectCard
        label="Vehiculo"
        value={sel ? `${sel.placa} · ${sel.modelo}` : null}
        placeholder="Selecciona un vehiculo"
        icon={<Truck size={22} color="#1D4ED8" />}
        onPress={() => setAbierto(true)}
      />
      <PickerModal
        visible={abierto}
        title="Vehiculos"
        onClose={() => setAbierto(false)}
        data={VEHICULOS}
        keyExtractor={(v) => v.id}
        isSelected={(v) => v.id === sel?.id}
        onSelect={setSel}
        searchable
        searchPlaceholder="Buscar placa o modelo"
        filterFn={(v, q) =>
          v.placa.toLowerCase().includes(q) || v.modelo.toLowerCase().includes(q)
        }
        renderItem={(v) => (
          <View>
            <Text className="font-semibold text-slate-800">{v.placa}</Text>
            <Text className="text-xs text-slate-500">{v.modelo}</Text>
          </View>
        )}
      />
    </View>
  );
}

export function PickerModalDemo() {
  const [abierto, setAbierto] = useState(false);
  const [sel, setSel] = useState<(typeof VEHICULOS)[number][]>([]);

  const alternar = (v: (typeof VEHICULOS)[number]) =>
    setSel((prev) =>
      prev.some((x) => x.id === v.id)
        ? prev.filter((x) => x.id !== v.id)
        : [...prev, v]
    );

  return (
    <View className="gap-3">
      <Text variant="muted">
        Modo multiseleccion con buscador. {sel.length} seleccionado(s).
      </Text>
      <Button onPress={() => setAbierto(true)}>
        <Text>Abrir selector</Text>
      </Button>
      <PickerModal
        visible={abierto}
        title="Vehiculos"
        multiSelect
        onClose={() => setAbierto(false)}
        data={VEHICULOS}
        keyExtractor={(v) => v.id}
        isSelected={(v) => sel.some((x) => x.id === v.id)}
        onSelect={alternar}
        searchable
        searchPlaceholder="Buscar placa o modelo"
        filterFn={(v, q) =>
          v.placa.toLowerCase().includes(q) || v.modelo.toLowerCase().includes(q)
        }
        renderItem={(v) => (
          <View>
            <Text className="font-semibold text-slate-800">{v.placa}</Text>
            <Text className="text-xs text-slate-500">{v.modelo}</Text>
          </View>
        )}
      />
    </View>
  );
}

export function HomeHeaderDemo() {
  const [enHome, setEnHome] = useState(true);
  const [ultimo, setUltimo] = useState("—");

  return (
    <View className="gap-3">
      <HomeHeader
        title={enHome ? "Mapa" : "Informe de rutas"}
        showMenu={enHome}
        onMenuPress={() => setUltimo("abrir menu")}
        onBackPress={() => setUltimo("volver")}
      />
      <Text variant="muted">Ultima accion: {ultimo}</Text>
      <Button variant="outline" onPress={() => setEnHome((v) => !v)}>
        <Text>{enHome ? "Simular pantalla interna" : "Simular home"}</Text>
      </Button>
    </View>
  );
}

export function BackButtonDemo() {
  const [veces, setVeces] = useState(0);

  return (
    <View className="gap-3">
      <View className="h-24 overflow-hidden rounded-xl bg-slate-100">
        <BackButton onPress={() => setVeces((v) => v + 1)} />
      </View>
      <Text variant="muted">
        Flota sobre el contenido. Pulsado {veces} vez(ces).
      </Text>
    </View>
  );
}

export function ContainerLoginDemo() {
  const [oculto, setOculto] = useState(true);

  return (
    <View className="h-96 overflow-hidden rounded-xl border border-border">
      <ContainerLogin header={<BackButton onPress={() => {}} />}>
        <Text variant="h3">Iniciar sesion</Text>
        <UserInput placeholder="Usuario" />
        <UserInput
          placeholder="Contrasena"
          secureTextEntry={oculto}
          viewPasswordIcon
          handleViewPasswordToggle={() => setOculto((o) => !o)}
        />
        <ButtonForms textButton="Entrar" onPress={() => {}} />
      </ContainerLogin>
    </View>
  );
}

function DrawerSandbox({ altura = 420 }: { altura?: number }) {
  const { mounted, progress, open, close, contentStyle } = useDrawer();
  const [activo, setActivo] = useState("Mapa");
  const [tiempoReal, setTiempoReal] = useState(true);

  const items: MenuItem[] = [
    { label: "Mapa", icon: Map, active: activo === "Mapa", onPress: () => setActivo("Mapa") },
    {
      label: "Informes",
      icon: Radio,
      active: activo === "Informes",
      onPress: () => setActivo("Informes"),
    },
    {
      label: "Vehiculos",
      icon: Truck,
      active: activo === "Vehiculos",
      onPress: () => setActivo("Vehiculos"),
    },
  ];

  return (
    <View
      className="overflow-hidden rounded-xl border border-border bg-slate-50"
      style={{ height: altura }}
    >
      <Animated.View style={[{ flex: 1 }, contentStyle]}>
        <HomeHeader
          title={activo}
          showMenu
          onMenuPress={open}
          onBackPress={() => {}}
        />
        <View className="flex-1 items-center justify-center px-6">
          <Text variant="muted" className="text-center">
            Toca el icono de menu para abrir el drawer.
          </Text>
        </View>
      </Animated.View>

      {mounted ? (
        <DrawerMenu
          progress={progress}
          onClose={close}
          userName="TM Solutions"
          items={items}
          realTimeEnabled={tiempoReal}
          onRealTimeChange={setTiempoReal}
        />
      ) : null}
    </View>
  );
}

export function DrawerMenuDemo() {
  return <DrawerSandbox />;
}

export function DrawerItemDemo() {
  return <DrawerSandbox altura={360} />;
}

export function UseDrawerDemo() {
  return <DrawerSandbox altura={360} />;
}

export function NotifyDemo() {
  return (
    // Los botones van abajo y el marco reserva alto: los toasts caen en la
    // parte superior y con un contenedor corto taparian los disparadores.
    <View className="justify-end gap-3" style={{ minHeight: 360 }}>
      <Text variant="muted">
        Cada boton dispara un toast real de sonner-native.
      </Text>
      <Button onPress={() => notify.success("Guia sincronizada")}>
        <Text>success</Text>
      </Button>
      <Button
        variant="destructive"
        onPress={() => notify.error("Todos los campos son requeridos")}
      >
        <Text>error</Text>
      </Button>
      <Button
        variant="secondary"
        onPress={() => notify.warning("Sin conexion: se guardo local")}
      >
        <Text>warning</Text>
      </Button>
      <Button variant="outline" onPress={() => notify.info("Abriendo la tienda")}>
        <Text>info</Text>
      </Button>
    </View>
  );
}

export function ConfirmDemo() {
  const [resultado, setResultado] = useState<string | null>(null);

  const preguntar = async () => {
    const ok = await confirm({
      titulo: "Eliminar evidencia",
      mensaje:
        "Se eliminara la evidencia de esta etapa y no se enviara al finalizar. ¿Deseas continuar?",
      textoConfirmar: "Eliminar",
      destructivo: true,
    });
    setResultado(ok ? "Confirmado" : "Cancelado");
    if (ok) notify.success("Evidencia eliminada");
  };

  return (
    <View className="gap-3">
      <Text variant="muted">
        {resultado
          ? `Ultima respuesta: ${resultado}`
          : "Abre un dialogo del sistema y espera la respuesta."}
      </Text>
      <Button variant="destructive" onPress={preguntar}>
        <Text>Eliminar evidencia</Text>
      </Button>
    </View>
  );
}
