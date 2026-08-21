import { Text } from "@/components/ui/text";
import { PenLine, RefreshCw } from "lucide-react-native";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

type Point = { x: number; y: number };

export type SignaturePadRef = {
  clear: () => void;
  isEmpty: () => boolean;
  toBase64: () => string | null;
};

type Props = {
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  onChange?: (base64: string | null) => void;
  /**
   * Avisos de inicio/fin de trazo, por si el contenedor necesita reaccionar.
   *
   * NO los uses para desactivar el scroll del padre: el PanResponder de abajo
   * ya captura el gesto y bloquea al responder nativo, así que el ScrollView no
   * puede robarse el trazo. Un `scrollEnabled={!isSigning}` sólo agrega un modo
   * de fallo — si el "fin" no llega, el contenedor queda sin scroll para
   * siempre.
   */
  onSignStart?: () => void;
  onSignEnd?: () => void;
  /** Textos visibles. Se dejan como props para poder traducirlos por pantalla. */
  placeholderLabel?: string;
  emptyLabel?: string;
  filledLabel?: string;
  clearLabel?: string;
};

const pointsToPath = (points: Point[]) => {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)} L ${(p.x + 0.1).toFixed(2)} ${(p.y + 0.1).toFixed(2)}`;
  }
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)}`;
  }
  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
};

const utf8ToBase64 = (str: string) => {
  if (typeof globalThis.btoa === "function") {
    try {
      return globalThis.btoa(unescape(encodeURIComponent(str)));
    } catch {
      // fallthrough
    }
  }
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const bytes: number[] = [];
  const utf8 = unescape(encodeURIComponent(str));
  for (let i = 0; i < utf8.length; i++) bytes.push(utf8.charCodeAt(i));
  let output = "";
  let i = 0;
  while (i < bytes.length) {
    const b1 = bytes[i++];
    const b2 = i < bytes.length ? bytes[i++] : NaN;
    const b3 = i < bytes.length ? bytes[i++] : NaN;
    const e1 = b1 >> 2;
    const e2 = ((b1 & 3) << 4) | ((isNaN(b2) ? 0 : b2) >> 4);
    const e3 = isNaN(b2)
      ? 64
      : (((b2 & 15) << 2) | ((isNaN(b3) ? 0 : b3) >> 6));
    const e4 = isNaN(b3) ? 64 : b3 & 63;
    output +=
      chars.charAt(e1) +
      chars.charAt(e2) +
      (e3 === 64 ? "=" : chars.charAt(e3)) +
      (e4 === 64 ? "=" : chars.charAt(e4));
  }
  return output;
};

export const SignaturePad = forwardRef<SignaturePadRef, Props>(
  (
    {
      height = 200,
      strokeColor = "#0F172A",
      strokeWidth = 2.5,
      backgroundColor = "#FFFFFF",
      onChange,
      onSignStart,
      onSignEnd,
      placeholderLabel = "Firma aquí con tu dedo",
      emptyLabel = "Sin firma",
      filledLabel = "Firma registrada",
      clearLabel = "Limpiar",
    },
    ref,
  ) => {
    const [paths, setPaths] = useState<string[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("");
    const currentPointsRef = useRef<Point[]>([]);
    const sizeRef = useRef({ width: 0, height });

    const buildBase64 = (allPaths: string[]) => {
      if (allPaths.length === 0) return null;
      const { width, height: h } = sizeRef.current;
      if (!width) return null;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}" viewBox="0 0 ${width} ${h}"><rect width="100%" height="100%" fill="${backgroundColor}"/>${allPaths
        .map(
          (d) =>
            `<path d="${d}" stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
        )
        .join("")}</svg>`;
      return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
    };

    const emitChange = (allPaths: string[]) => {
      onChange?.(buildBase64(allPaths));
    };

    useImperativeHandle(ref, () => ({
      clear: () => {
        setPaths([]);
        setCurrentPath("");
        currentPointsRef.current = [];
        onChange?.(null);
      },
      isEmpty: () => paths.length === 0 && currentPath.length === 0,
      toBase64: () => buildBase64(paths),
    }));

    const onLayout = (e: LayoutChangeEvent) => {
      sizeRef.current = {
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      };
    };

    const handleStart = (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      currentPointsRef.current = [{ x: locationX, y: locationY }];
      setCurrentPath(pointsToPath(currentPointsRef.current));
      onSignStart?.();
    };

    const handleMove = (e: GestureResponderEvent) => {
      const { locationX, locationY } = e.nativeEvent;
      const pts = currentPointsRef.current;
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(last.x - locationX, last.y - locationY) > 1.2) {
        pts.push({ x: locationX, y: locationY });
        setCurrentPath(pointsToPath(pts));
      }
    };

    const handleEnd = () => {
      // Reactivar el scroll del padre es lo PRIMERO y pase lo que pase: si el
      // trazo venía vacío y salíamos antes, el padre se quedaba con el scroll
      // desactivado para siempre.
      onSignEnd?.();
      if (currentPointsRef.current.length === 0) return;
      const finished = pointsToPath(currentPointsRef.current);
      const next = [...paths, finished];
      setPaths(next);
      setCurrentPath("");
      currentPointsRef.current = [];
      emitChange(next);
    };

    const panResponder = useMemo(
      () =>
        PanResponder.create({
          // Capturamos el gesto desde el inicio para que el ScrollView padre
          // no nos robe el deslizamiento y haga scroll en vez de dibujar.
          onStartShouldSetPanResponder: () => true,
          onStartShouldSetPanResponderCapture: () => true,
          onMoveShouldSetPanResponder: () => true,
          onMoveShouldSetPanResponderCapture: () => true,
          // Evita que el padre reclame el gesto una vez empezamos a firmar.
          onPanResponderTerminationRequest: () => false,
          onShouldBlockNativeResponder: () => true,
          onPanResponderGrant: handleStart,
          onPanResponderMove: handleMove,
          onPanResponderRelease: handleEnd,
          onPanResponderTerminate: handleEnd,
        }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [paths],
    );

    const isEmpty = paths.length === 0 && currentPath.length === 0;

    return (
      <View className="w-full">
        <View
          className="rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden"
          style={{ height }}
        >
          {/* onSignStart/onSignEnd van en el ciclo del PanResponder (grant /
              release / terminate), no en onTouchStart/onTouchEnd: esos eventos
              no llegan cuando el sistema termina el responder o el dedo se
              levanta fuera del lienzo, y el padre se quedaba sin scroll. */}
          <View
            {...panResponder.panHandlers}
            onLayout={onLayout}
            style={{ flex: 1 }}
          >
            <Svg width="100%" height="100%">
              {paths.map((d, i) => (
                <Path
                  key={`p-${i}`}
                  d={d}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {currentPath ? (
                <Path
                  d={currentPath}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : null}
            </Svg>

            {isEmpty ? (
              <View
                pointerEvents="none"
                className="absolute inset-0 items-center justify-center"
              >
                <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-2">
                  <PenLine size={22} color="#395995" />
                </View>
                <Text className="text-slate-400 text-sm font-medium">
                  {placeholderLabel}
                </Text>
              </View>
            ) : null}

            {/* Baseline */}
            <View
              pointerEvents="none"
              className="absolute left-6 right-6"
              style={{
                bottom: 24,
                height: 1,
                backgroundColor: "#E2E8F0",
              }}
            />
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-2 px-1">
          <View className="flex-row items-center gap-1.5">
            <View
              className={`w-2 h-2 rounded-full ${
                isEmpty ? "bg-slate-300" : "bg-emerald-500"
              }`}
            />
            <Text className="text-[11px] text-slate-500">
              {isEmpty ? emptyLabel : filledLabel}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              setPaths([]);
              setCurrentPath("");
              currentPointsRef.current = [];
              onChange?.(null);
            }}
            disabled={isEmpty}
            style={{ opacity: isEmpty ? 0.4 : 1 }}
            className="flex-row items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 active:bg-slate-200"
          >
            <RefreshCw size={14} color="#475569" />
            <Text className="text-[12px] text-slate-600 font-semibold">
              {clearLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  },
);

SignaturePad.displayName = "SignaturePad";
